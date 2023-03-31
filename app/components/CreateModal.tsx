import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import type { ModalProps } from "./ui/Modal";
import Modal from "./ui/Modal";
import { ArrowUpTrayIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Form, useFetcher, useNavigate, useNavigation, useSearchParams } from "@remix-run/react";
import Input from "./ui/Input";
import type { Category, Tag } from "@prisma/client";
import Select from "./ui/Select";
import Loading from "./ui/Loading";
import type { ActionData as UploadFileActionData } from "~/routes/__layout/models.upload";
import type { ActionData as ModelCreateActionData } from "~/routes/__layout/models.new";
import { twMerge } from "tailwind-merge";
import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";
import { toJSON } from "~/utils/form";
import { asArray } from "~/utils/array";
import type { MultiSelectOption } from "./ui/MultiSelect";
import MultiSelect from "./ui/MultiSelect";
import { last } from "lodash";

type CreateModalProps = {
  open: ModalProps["open"];
  onClose: () => void;
  categories: Category[];
  tags: Tag[];
};

export default function CreateModal({ open, onClose, categories, tags }: CreateModalProps) {
  const [drag, setDrag] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [formValidity, setFormValidity] = useState(false);
  const [fileCount, setFileCount] = useState<number>();
  const [selectedTags, setSelectedTags] = useState<MultiSelectOption[]>([]);

  const fileUploadFetcher = useFetcher<UploadFileActionData>();
  const detailsFetcher = useFetcher<ModelCreateActionData>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const dropRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const tagOptions = tags.map((tag) => ({ value: tag.name, label: tag.name }));

  const isFileUploading = fileUploadFetcher.state === "submitting";

  // Handle upload error
  useEffect(() => {
    if (fileUploadFetcher.data?.error) {
      alert("There was an error uploading your files. Please try again.");
      setShowFields(false);
    }
  }, [fileUploadFetcher.data?.error]);

  // Reset field visibility when modal opens/closes
  useEffect(() => {
    if (open) {
      setShowFields(false);
    }
  }, [open]);

  // Make sure drag UI gets reset when fields toggle
  useEffect(() => {
    setDrag(false);
  }, [showFields]);

  const isCreatingModel = detailsFetcher.state === "submitting" || navigation.state === "loading";

  const handleFormChange = (e: any) => {
    setFormValidity(e.currentTarget.checkValidity());
  };

  // All done creating modal
  useEffect(() => {
    if (detailsFetcher.type === "done" && detailsFetcher.data?.model) {
      navigate(`/models/${detailsFetcher.data?.model.id}`);
    }
  }, [detailsFetcher.data?.model, detailsFetcher.type]);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      let { files } = toJSON<{ files: File[] }>(formData);
      files = asArray(files);

      // TODO: this needs to be more robust, but works for now
      const hasInvalidFiles = files.some((file) => file.type !== "audio/wav" && !file.name.includes(".nam"));

      if (hasInvalidFiles) {
        alert("Only NAM models and IR wav files are allowed");
        return;
      }

      setFileCount(files.length);

      // Zip up files
      const zipFileWriter = new BlobWriter();
      const zipWriter = new ZipWriter(zipFileWriter);

      await Promise.all(
        files.map((file) => {
          const blobReader = new BlobReader(file);
          return zipWriter.add(file.name, blobReader);
        })
      );

      const zippedFile = await zipWriter.close();

      // Create data to send to server
      const zippedFormData = new FormData();
      zippedFormData.set("file", zippedFile);

      fileUploadFetcher.submit(zippedFormData, {
        method: "post",
        action: "/models/upload",
        encType: "multipart/form-data",
      });

      setShowFields(true);
    }

    return false;
  };

  useEffect(() => {
    const element = dropRef.current;

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      element?.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e: any) {
      e.preventDefault();
      e.stopPropagation();
    }

    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        element?.removeEventListener(eventName, preventDefaults, false);
      });
    };
  }, []);

  return (
    <Modal open={open}>
      <div className="p-10 pt-7 relative">
        <div className="flex item-center">
          <h2 className="pb-3 text-2xl font-bold mb-5 flex-grow">Upload files</h2>
          <Button
            onClick={() => {
              searchParams.delete("create");
              setSearchParams(searchParams);
            }}
            variant="link"
            className="opacity-70 hover:opacity-100 font-3xl inline-block w-[24px] h-[24px]"
          >
            <XMarkIcon fontSize={24} className="inline-block" />
          </Button>
        </div>

        {!showFields ? (
          <div
            className={twMerge(
              "border-2 border-white rounded-lg px-32 py-16 border-dashed overflow-hidden relative",
              drag ? "opacity-100" : "opacity-30",
              "hover:opacity-80"
            )}
            onDragEnter={() => setDrag(true)}
            onDragExit={() => setDrag(false)}
            onDragLeave={() => setDrag(false)}
          >
            <Form
              ref={formRef}
              action="/models/new"
              method="post"
              className=" flex flex-col items-center justify-center"
              onSubmit={handleFormSubmit}
            >
              <input
                ref={dropRef}
                type="file"
                name="files"
                multiple
                onChange={handleFormSubmit}
                accept=".nam, .wav"
                style={{
                  width: "400%",
                  height: "100%",
                  marginLeft: "-300%",
                  border: "none",
                  cursor: "pointer",
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              />

              <ArrowUpTrayIcon className="h-24 w-24 mb-5 pointer-events-none" />
              <span className="pointer-events-none">Drop your files here or click to begin uploading</span>
            </Form>
          </div>
        ) : null}

        {showFields ? (
          <div>
            <div className="mb-12">
              {isFileUploading ? (
                <span className="flex items-center gap-3">
                  <Loading />
                  {fileCount === 1 ? "File" : "Files"} uploading ...
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    <strong> {fileCount === 1 ? "File" : "Files"} Uploaded!</strong>
                  </span>
                </>
              )}
            </div>

            <detailsFetcher.Form
              method="post"
              action="/models/new"
              style={{ width: "680px" }}
              onChange={handleFormChange}
            >
              <div className="flex gap-10">
                <div className="flex-grow flex flex-col gap-3 basis-1/2">
                  <Input name="title" label="Title" required autoFocus />
                  <Input name="description" label="Description" style={{ height: "168px" }} multiline />
                </div>

                <div className="flex-grow flex flex-col gap-3 basis-1/2">
                  <Input name="ampName" label="Make(s) and Model(s)" required />
                  <Select
                    required
                    label="Category"
                    name="categoryId"
                    options={categories.map((c) => {
                      return {
                        value: String(c.id),
                        description: c.title,
                      };
                    })}
                  />
                  <MultiSelect
                    // name="tags"
                    label="Tags"
                    options={tagOptions}
                    onChange={(e: any) => setSelectedTags(e)}
                    defaultValue={selectedTags}
                  />
                  {selectedTags.map((tag) => {
                    return <input type="hidden" name="tags" value={tag.value} key={tag.value} />;
                  })}
                </div>
              </div>

              {fileUploadFetcher.data?.path ? (
                <input type="hidden" name="modelPath" value={fileUploadFetcher.data?.path} />
              ) : null}

              <div className="pt-12 flex justify-end">
                {!isCreatingModel ? (
                  <Button variant="link" className="mr-10" onClick={() => onClose()}>
                    Cancel
                  </Button>
                ) : null}
                <Button disabled={!formValidity} loading={isCreatingModel} type="submit" className="">
                  Create Model
                </Button>
              </div>
            </detailsFetcher.Form>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

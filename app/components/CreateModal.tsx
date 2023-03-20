import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import type { ModalProps } from "./ui/Modal";
import Modal from "./ui/Modal";
import { ArrowUpTrayIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Form, useFetcher, useNavigate, useNavigation } from "@remix-run/react";
import Input from "./ui/Input";
import type { Category } from "@prisma/client";
import Select from "./ui/Select";
import Loading from "./ui/Loading";
import type { ActionData as UploadFileActionData } from "~/routes/__layout/models.upload";
import type { ActionData as ModelCreateActionData } from "~/routes/__layout/models.new";

type CreateModalProps = {
  open: ModalProps["open"];
  onClose: () => void;
  categories: Category[];
};

export default function CreateModal({ open, onClose, categories }: CreateModalProps) {
  const [drag, setDrag] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [formValidity, setFormValidity] = useState(false);
  const dropRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileUploadFetcher = useFetcher<UploadFileActionData>();
  const detailsFetcher = useFetcher<ModelCreateActionData>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const isFileUploading = fileUploadFetcher.state === "submitting";

  const isCreatingModel = detailsFetcher.state === "submitting" || navigation.state === "loading";

  const handleFormChange = (e: any) => {
    setFormValidity(e.currentTarget.checkValidity());
  };

  useEffect(() => {
    if (detailsFetcher.type === "done" && detailsFetcher.data?.model) {
      navigate(`/models/${detailsFetcher.data?.model.id}`);
    }
  }, [detailsFetcher.data?.model, detailsFetcher.type]);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (formRef.current) {
      const formData = new FormData(formRef.current);

      fileUploadFetcher.submit(formData, {
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
      <div className="p-24 py-12">
        <h2 className="text-2xl font-bold mb-12">Create New Model</h2>

        {!showFields ? (
          <div
            className={`border-2 border-white rounded-lg px-32 py-16 border-dashed overflow-hidden relative ${
              drag ? "opacity-100" : "opacity-30"
            } hover:opacity-80`}
            onDragEnter={() => setDrag(true)}
            onDragExit={() => setDrag(false)}
            onDragLeave={() => setDrag(false)}
          >
            <form
              ref={formRef}
              action="/models/new"
              method="post"
              className=" flex flex-col items-center justify-center"
              onSubmit={handleFormSubmit}
            >
              <input
                ref={dropRef}
                type="file"
                name="file"
                onChange={handleFormSubmit}
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
            </form>
          </div>
        ) : null}

        {showFields ? (
          <div>
            <div className="mb-12">
              {isFileUploading ? (
                <span className="flex items-center gap-3">
                  <Loading />
                  File uploading ...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  Uploaded <strong>{fileUploadFetcher.data?.name}</strong>!
                </span>
              )}
            </div>

            <detailsFetcher.Form
              method="post"
              action="/models/new"
              style={{ width: "680px" }}
              onChange={handleFormChange}
            >
              <div className="flex gap-10">
                <div className="flex-grow flex flex-col gap-3">
                  <Input name="title" label="Title" required autoFocus />
                  <Input name="description" label="Description" style={{ height: "168px" }} multiline />
                </div>

                <div className="flex-grow flex flex-col gap-3">
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
                  <Input name="tags" label="Tags" placeholder="Rock, Metal, Marshal ..." />
                </div>
              </div>

              <input type="hidden" name="modelPath" value={fileUploadFetcher.data?.filepath} />
              <input type="hidden" name="filename" value={fileUploadFetcher.data?.name} />

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

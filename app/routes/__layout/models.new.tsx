import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { db } from "~/utils/db.server";
import type { Category, Model, License } from "@prisma/client";
import { toJSON } from "~/utils/form";
import { useEffect, useRef, useState } from "react";
import Button from "~/components/ui/Button";
import { ArrowUpTrayIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Form, useFetcher, useLoaderData, useNavigate, useNavigation, useSearchParams } from "@remix-run/react";
import Input from "~/components/ui/Input";
import Select from "~/components/ui/Select";
import Loading from "~/components/ui/Loading";
import type { ActionData as UploadFileActionData } from "~/routes/__layout/models.upload";
import type { ActionData as ModelCreateActionData } from "~/routes/__layout/models.new";
import { twMerge } from "tailwind-merge";
import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";
import { asArray } from "~/utils/array";
import type { MultiSelectOption } from "~/components/ui/MultiSelect";
import MultiSelect from "~/components/ui/MultiSelect";
import { getTags } from "~/services/tags";
import { sortCategories } from "~/utils/categories";
import { Link } from "@remix-run/react";

export type ActionData = {
  model?: Model;
  error?: string;
};

export type LoaderData = {
  tags: { id: number; name: string; group: string | null }[];
  categories: Category[];
  licenses: License[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await getSession(request);

  const profile = await db.profile.findFirst({ where: { id: session?.user?.id } });

  if (!session || !profile) {
    return redirect("/login");
  }

  const [tags, categories, licenses] = await Promise.all([
    getTags(),
    db.category.findMany({ where: { NOT: { title: "IR" } } }),
    db.license.findMany({ where: { active: true } }),
  ]);

  return json<LoaderData>({
    tags,
    categories,
    licenses,
  });
};

export const action: ActionFunction = async ({ request, context }) => {
  const { session } = await getSession(request);
  const profile = await db.profile.findFirst({ where: { id: session?.user?.id } });

  if (!session || !profile) {
    return redirect("/login");
  }

  try {
    const formData = await request.formData();
    const data = toJSON(formData);

    const model = await db.model.create({
      data: {
        title: data?.title,
        description: data?.description,
        ampName: data?.ampName,
        modelPath: data?.modelPath,
        filename: data?.filename,
        profileId: profile.id,
        categoryId: data?.categoryId ? +data?.categoryId : 0,
        tags: data?.tags,
        filecount: +data?.filecount,
        licenseId: data?.licenseId ? data.licenseId : 1,
      },
    });

    return redirect(`/${profile.username}/${model.id}`);
  } catch (e: any) {
    console.error("ERROR:", e);
    return json<ActionData>({ error: e.message }, { status: 500 });
  }
};

export default function ModelsNewPage() {
  const data = useLoaderData<LoaderData>();
  const [drag, setDrag] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [formValidity, setFormValidity] = useState(false);
  const [fileCount, setFileCount] = useState<number>();
  const [selectedTags, setSelectedTags] = useState<MultiSelectOption[]>([]);

  const fileUploadFetcher = useFetcher<UploadFileActionData>();
  const detailsFetcher = useFetcher<ModelCreateActionData>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const dropRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const tagOptions = data.tags.map((tag) => ({ value: tag.name, label: tag.name }));

  const isFileUploading = fileUploadFetcher.state === "submitting";

  // Handle upload error
  useEffect(() => {
    if (fileUploadFetcher.data?.error) {
      alert("There was an error uploading your files. Please try again.");
      setShowFields(false);
    }
  }, [fileUploadFetcher.data?.error]);

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

  return (
    <div className=" relative">
      <div className="flex item-center">
        <h1 className="w-full text-center text-2xl lg:text-3xl font-satoshi-bold mb-10">Upload Model</h1>
      </div>

      {!showFields ? (
        <div>
          <h3 className="text-lg pb-10 text-white/80 text-center">
            Upload a single NAM file, multiple files to create a pack,
            <br />
            or a NAM file and an IR to create a complete rig.
          </h3>
          <div
            className={twMerge(
              "border-2 border-white rounded-lg px-32 py-16 border-dashed overflow-hidden relative",
              drag ? "opacity-100" : "opacity-30",
              "hover:opacity-80"
            )}
            onDragEnter={() => {
              console.log("drag enter");
              setDrag(true);
            }}
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
              <span className="pointer-events-none">Drop your files here or click to begin uploading files</span>
            </Form>
          </div>
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
                <Select
                  required
                  label="License *"
                  name="licenseId"
                  options={data.licenses.map((l) => {
                    return {
                      value: String(l.id),
                      description: l.name,
                    };
                  })}
                />
              </div>

              <div className="flex-grow flex flex-col gap-3 basis-1/2">
                <Input name="ampName" label="Make(s) and Model(s)" required />
                <Select
                  required
                  label="Category"
                  name="categoryId"
                  options={sortCategories(data.categories).map((c) => {
                    return {
                      value: String(c.id),
                      description: c.title,
                    };
                  })}
                />
                <MultiSelect
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
            <div className="flex mt-3 font-satoshi-regular text-sm">
              * Not sure which license to choose? Click{" "}
              <Link
                to="/support/licensing"
                target="_new"
                className="inline mx-1 hover:underline text-tonehunt-blue-light"
              >
                here
              </Link>{" "}
              for more information.
            </div>

            {fileUploadFetcher.data?.path ? (
              <input type="hidden" name="modelPath" value={fileUploadFetcher.data?.path} />
            ) : null}

            {fileCount !== undefined ? <input type="hidden" name="filecount" value={fileCount} /> : null}

            <div className="pt-12 flex justify-end">
              <Button disabled={!formValidity} loading={isCreatingModel} type="submit" className="">
                Create Model
              </Button>
            </div>
          </detailsFetcher.Form>
        </div>
      ) : null}
    </div>
  );
}

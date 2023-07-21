import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { db } from "~/utils/db.server";
import type { Category, Model, License } from "@prisma/client";
import { toJSON } from "~/utils/form";
import { useEffect, useRef, useState } from "react";
import Button from "~/components/ui/Button";
import { ArrowUpTrayIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Form, useFetcher, useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import Input from "~/components/ui/Input";
import Select from "~/components/ui/Select";
import Loading from "~/components/ui/Loading";
import type { ActionData as ModelCreateActionData } from "~/routes/__account/models.new";
import { twMerge } from "tailwind-merge";
import { asArray } from "~/utils/array";
import type { MultiSelectOption } from "~/components/ui/MultiSelect";
import MultiSelect from "~/components/ui/MultiSelect";
import { getTags } from "~/services/tags";
import { sortCategories } from "~/utils/categories";
import { Link } from "@remix-run/react";
import type { GenerateUploadUrlLoaderData } from "../models.new.generateUploadUrl";
import { generateUplaodUrlPath } from "../models.new.generateUploadUrl";
import { zipFiles } from "~/utils/file";

export const meta: MetaFunction<LoaderData> = ({ data }) => {
  return {
    title: `New Model | ToneHunt`,
    description: `Create a new model on ToneHunt`,
  };
};

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
    return redirect("/login?redirecTo=/models/new");
  }

  const [tags, categories, licenses] = await Promise.all([
    getTags(),
    db.category.findMany(),
    db.license.findMany({ where: { active: true }, orderBy: { id: "asc" } }),
  ]);

  return json<LoaderData>({
    tags,
    categories,
    licenses,
  });
};

type ActionFormData = {
  title: string;
  description: string;
  ampName: string;
  modelPath: string;
  filename: string;
  categoryId?: string;
  tags: string[];
  filecount: string;
  licenseId?: string;
  link?: string;
  active?: string;
};

export const action: ActionFunction = async ({ request, context }) => {
  const { session } = await getSession(request);
  const profile = await db.profile.findFirst({ where: { id: session?.user?.id } });

  if (!session || !profile) {
    return redirect("/login");
  }

  try {
    const formData = await request.formData();
    const data = toJSON<ActionFormData>(formData);

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
        licenseId: data?.licenseId ? +data.licenseId : 1,
        link: data.link === "" ? null : data.link,
        active: data.active === "1",
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
  const [files, setFiles] = useState<File[]>();
  const [selectedTags, setSelectedTags] = useState<MultiSelectOption[]>([]);
  const [uploading, setUploading] = useState(false);

  const detailsFetcher = useFetcher<ModelCreateActionData>();
  const signedUploadUrlFecher = useFetcher<GenerateUploadUrlLoaderData>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const dropRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const tagOptions = data.tags.map((tag) => ({ value: tag.name, label: tag.name }));

  // Handle upload error
  useEffect(() => {
    if (signedUploadUrlFecher.data?.error) {
      alert("There was an error uploading your files. Please try again.");
      setShowFields(false);
    }
  }, [signedUploadUrlFecher.data?.error]);

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

  useEffect(() => {
    // Once the signed upload url is generated, the upload can begin
    if (signedUploadUrlFecher.data && signedUploadUrlFecher.type === "done" && files) {
      zipFiles(files)
        .then((zippedFile) => {
          // Create data to send to server
          const zippedFormData = new FormData();

          zippedFormData.set("file", zippedFile);

          if (!signedUploadUrlFecher.data.signedUrl || !signedUploadUrlFecher.data.apiKey) {
            throw new Error("Signed Url and related data was missing while fetching");
          }

          return fetch(signedUploadUrlFecher.data.signedUrl, {
            method: "PUT",
            body: zippedFormData,
            headers: {
              apikey: signedUploadUrlFecher.data.apiKey,
              Authorization: `Bearer: ${signedUploadUrlFecher.data.bearer}`,
            },
          });
        })
        .then(async (response) => {
          if (!response.ok) {
            setShowFields(false);
            const text = await response.text();

            alert(`There was an error uploading your files. ${text}. Please try again`);
          }
        })
        .catch((e) => {
          setShowFields(false);
          alert(`There was an error uploading your files. ${e}. Please try again`);
        })
        .finally(() => {
          setUploading(false);
        });
    }
  }, [files, signedUploadUrlFecher.data, signedUploadUrlFecher.data?.path, signedUploadUrlFecher.type]);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      let { files: filesBeingUploaded } = toJSON<{ files: File[] }>(formData);
      const _files = asArray(filesBeingUploaded);

      const hasInvalidFiles = _files.some((file) => !file.type.match(/audio.*wav/) && !file.name.includes(".nam"));

      if (hasInvalidFiles) {
        alert("Only NAM models and IR wav files are allowed");
        return;
      }

      setUploading(true);
      setFiles(_files);
      setShowFields(true);

      // Get the uplaod url
      signedUploadUrlFecher.load(`${generateUplaodUrlPath}?filename=${Math.random()}.zip`);
    }

    return false;
  };

  return (
    <div className=" relative">
      <div className="flex item-center">
        <h1 className="w-full text-center text-2xl lg:text-3xl font-satoshi-bold mb-10">New Model</h1>
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
            {uploading ? (
              <span className="flex items-center gap-3">
                <Loading />
                {files?.length === 1 ? "File" : "Files"} uploading ...
              </span>
            ) : (
              <>
                <span className="flex items-center gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  <strong> {files?.length === 1 ? "File" : "Files"} Uploaded!</strong>
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
                <Input
                  name="link"
                  label="Link"
                  type="url"
                  placeholder="Link to a Youtube video demonstrating the model"
                />

                <Select
                  required
                  label="Status"
                  name="active"
                  defaultSelected="1"
                  showEmptyOption={false}
                  options={[
                    {
                      value: "1",
                      description: "Published",
                    },
                    {
                      value: "2",
                      description: "Hidden",
                    },
                  ]}
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
                <div className="mb-3">
                  <MultiSelect
                    label="Tags"
                    options={tagOptions}
                    onChange={(e: any) => setSelectedTags(e)}
                    defaultValue={selectedTags}
                  />
                </div>
                {selectedTags.map((tag) => {
                  return <input type="hidden" name="tags" value={tag.value} key={tag.value} />;
                })}
                <Select
                  required
                  label="License *"
                  name="licenseId"
                  showEmptyOption={false}
                  options={data.licenses.map((l) => {
                    return {
                      value: String(l.id),
                      description: l.name,
                    };
                  })}
                />
                <div className="flex flex-col font-satoshi-regular text-sm">
                  <p className="block">* Not sure which license to choose?</p>
                  <p className="block ml-2">
                    Click
                    <Link
                      to="/support/licensing"
                      target="_new"
                      className="inline mx-1 hover:underline text-tonehunt-blue-light"
                    >
                      here
                    </Link>
                    {""}
                    for more information.
                  </p>
                </div>
              </div>
            </div>

            {signedUploadUrlFecher.data?.path ? (
              <input type="hidden" name="modelPath" value={signedUploadUrlFecher.data?.path} />
            ) : null}

            {files?.length !== undefined ? <input type="hidden" name="filecount" value={files?.length} /> : null}

            <div className="pt-12 flex justify-end">
              <Button disabled={!formValidity || uploading} loading={isCreatingModel} type="submit" className="">
                Create Model
              </Button>
            </div>
          </detailsFetcher.Form>
        </div>
      ) : null}
    </div>
  );
}

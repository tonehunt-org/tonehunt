import { useState } from "react";
import type { FormEvent } from "react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useNavigate, useActionData, useSubmit, useNavigation } from "@remix-run/react";
import { getSession } from "~/auth.server";
import Alert from "~/components/ui/Alert";
import { db } from "~/utils/db.server";
import { getCategories } from "~/services/categories";
import { getTags } from "~/services/tags";
import Input from "~/components/ui/Input";
import Select from "~/components/ui/Select";
import Button from "~/components/ui/Button";
import { split, join, map } from "lodash";
import MultiSelect from "~/components/ui/MultiSelect";
import type { MultiSelectOption } from "~/components/ui/MultiSelect";

type LoaderData = {
  model: any;
  categories: any;
  tags: any;
};

type ActionData = {
  error?: string;
  success?: boolean;
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { session } = await getSession(request);
  const user = session?.user;

  const modelId = params.id as string;
  const model = await db.model.findFirst({
    where: {
      id: modelId,
      deleted: false,
    },
  });

  if (!model || model.profileId !== user?.id) {
    return redirect("/");
  }

  const categoriesReq = getCategories();
  const tagsReq = getTags();

  const [categories, tags] = await Promise.all([categoriesReq, tagsReq]);

  return json<LoaderData>({ model, categories, tags });
};

export const action: ActionFunction = async ({ request, context }) => {
  const { session } = await getSession(request);
  const formData = await request.formData();

  const modelId = formData.get("id") as string;
  const profileId = formData.get("profileId") as string;
  const user = session?.user;

  if (user?.id === profileId) {
    try {
      const status = formData.get("active") as string;
      const link = formData.get("link") as string;

      const tags = formData.get("tags") as string;
      const tagsScala = tags && tags !== "" ? split(tags, ",") : [];

      const params = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        ampName: formData.get("ampName") as string,
        categoryId: Number(formData.get("categoryId")) as number,
        active: status === "1" ? true : false,
        link: link === "" ? null : link,
        tags: tagsScala,
      };

      await db.model.update({
        where: {
          id: modelId,
        },
        data: params,
      });
    } catch (error) {
      return json<ActionData>({ error: "Error updating model. Please try again." }, { status: 500 });
    }
  }
  return json<ActionData>({ success: true });
};

export default function EditModelPage() {
  const data = useLoaderData<LoaderData>();
  const submit = useSubmit();
  const { model, categories, tags } = data;
  const navigation = useNavigation();

  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();

  const [formErrorMsg, setFormErrorMsg] = useState<string>();

  const [selectedCategoryId, setSelectedCategoryId] = useState(model.categoryId);
  const [selectedStatus, setSelectedStatus] = useState(model.active);

  const tagOptions = map(tags, (tag) => ({ value: tag.name, label: tag.name }));
  const modelTags = model.tags ? map(model.tags, (tag) => ({ value: tag, label: tag })) : [];
  const [selectedTags, setSelectedTags] = useState<MultiSelectOption[]>(modelTags);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setFormErrorMsg(undefined);
    event.preventDefault();
    const currentForm = event.currentTarget;
    let formData = new FormData(currentForm);

    const titleValue = formData.get("title");
    if (!titleValue || titleValue === "") {
      setFormErrorMsg("Title is required.");
      return;
    }

    const ampNameValue = formData.get("ampName");
    if (!ampNameValue || ampNameValue === "") {
      setFormErrorMsg("Make and Model is required.");
      return;
    }

    const tagsData = map(selectedTags, (tag) => tag.value);
    formData.set("tags", join(tagsData, ","));

    submit(formData, { method: "post" });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <h1 className="w-full text-center text-2xl lg:text-3xl font-satoshi-bold mb-10">Edit Model</h1>
      </div>

      {actionData?.success ? (
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <Alert title="Model updated successfully." variant="success" />
          </div>
        </div>
      ) : null}

      {actionData?.error ? (
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <Alert title="There was an error" description={actionData?.error} variant="error" />
          </div>
        </div>
      ) : null}

      {formErrorMsg ? (
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <Alert title="There was an error" description={formErrorMsg} variant="error" />
          </div>
        </div>
      ) : null}

      <div className="flex flex-col mt-5">
        <div className="flex-1">
          {/* <Form method="post" onChange={handleFormChange} onSubmit={handleSubmit}> */}
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-10">
              <div className="w-full lg:w-1/2">
                <div className="flex flex-col gap-3">
                  <div>
                    <Input name="title" label="Title" required autoFocus defaultValue={model.title} />
                  </div>
                  <div>
                    <Input
                      name="description"
                      label="Description"
                      style={{ height: "168px" }}
                      multiline
                      defaultValue={model.description}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="flex flex-col gap-3">
                  <div>
                    <Input name="ampName" label="Make(s) and Model(s)" required defaultValue={model.ampName} />
                  </div>
                  <div>
                    <Select
                      required
                      label="Category"
                      name="categoryId"
                      defaultSelected={selectedCategoryId}
                      showEmptyOption={false}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      options={categories.map((c: any) => {
                        return {
                          value: String(c.id),
                          description: c.title,
                        };
                      })}
                    />
                  </div>
                  <div>
                    <Select
                      required
                      label="Status"
                      name="active"
                      defaultSelected={selectedStatus === true ? "1" : "2"}
                      showEmptyOption={false}
                      onChange={(e) => setSelectedStatus(e.target.value === "1" ? true : false)}
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
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="w-full mt-3">
                <Input
                  name="link"
                  label="Link"
                  placeholder="Link to Youtube, Soundcloud, etc"
                  defaultValue={model.link}
                />
              </div>
            </div>

            <div className="flex">
              <div className="w-full mt-3">
                <MultiSelect
                  name="tags"
                  label="Tags"
                  options={tagOptions}
                  onChange={(e: any) => setSelectedTags(e)}
                  defaultValue={selectedTags}
                />
              </div>
              <Input name="id" type="hidden" defaultValue={model.id} />
              <Input name="profileId" type="hidden" defaultValue={model.profileId} />
            </div>

            <div className="flex justify-end pt-12">
              <Button type="submit" loading={navigation.state === "submitting"}>
                Update Model
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

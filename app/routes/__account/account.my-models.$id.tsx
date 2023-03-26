import { useEffect, useRef, useState } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, Form, useNavigate } from "@remix-run/react";
import { getSession } from "~/auth.server";
import Alert from "~/components/ui/Alert";
import { db } from "~/utils/db.server";
import { getCategories } from "~/services/categories";
import Input from "~/components/ui/Input";
import Select from "~/components/ui/Select";
import Button from "~/components/ui/Button";

type LoaderData = {
  model: any;
  categories: any;
};

// type ActionData = {
//   error?: string;
//   success?: boolean;
// };

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

  const categories = await getCategories();

  return json<LoaderData>({ model, categories });
};

// export const action: ActionFunction = async ({ request, context, params }) => {
//   const { session, supabase } = await getSession(request);
//   const formData = await request.formData();

//   const { error } = await supabase
//     .from("models")
//     .update({
//       title: formData.get("title") as string,
//       description: formData.get("description") as string,
//       amp_name: formData.get("ampName") as string,
//     })
//     .eq("profile_id", session?.user.id)
//     .eq("id", params.id)
//     .select();

//   if (error) {
//     return json<ActionData>({ error: "Error updating model" }, { status: 500 });
//   }

//   return json<ActionData>({ success: true });
// };

export default function EditModelPage() {
  const data = useLoaderData<LoaderData>();
  const { model, categories } = data;
  const navigate = useNavigate();

  const [formValidity, setFormValidity] = useState(false);
  console.log(data);
  //   const actionData = useActionData<ActionData>();

  const [selectedCategoryId, setSelectedCategoryId] = useState(model.categoryId);
  const [selectedStatus, setSelectedStatus] = useState(model.active);

  const handleFormChange = (e: any) => {
    setFormValidity(e.currentTarget.checkValidity());
  };

  return (
    <div className="w-full">
      <div className="flex">
        <h1 className="w-full text-center text-2xl lg:text-3xl font-satoshi-bold mb-10">Edit Model</h1>
      </div>
      <div className="flex flex-col mt-5">
        <div className="flex-1">
          <Form method="post" action="/models/update" onChange={handleFormChange}>
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
                      name="status"
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
                <Input name="tags" label="Tags" placeholder="Rock, Metal, Marshal ..." defaultValue={model.tags} />
              </div>
            </div>

            <div className="flex justify-end pt-12">
              <Button variant="link" className="mr-10" onClick={() => navigate("/account/my-models")}>
                Cancel
              </Button>

              <Button disabled={!formValidity} type="submit" className="">
                Update Model
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

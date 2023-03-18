import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { getSession } from "~/auth.server";
import ModelForm from "~/components/ModelForm";
import Alert from "~/components/ui/Alert";
import type { Model } from "~/types/custom";

type LoaderData = {
  model: Model;
};

type ActionData = {
  error?: string;
  success?: boolean;
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { session, supabase } = await getSession(request);

  if (!session?.user) {
    return redirect("/");
  }

  const { data } = await supabase
    .from("models")
    .select()
    .eq("profile_id", session.user.id)
    .eq("id", params.id)
    .limit(1)
    .single();

  if (!data) {
    return redirect("/");
  }

  return json<LoaderData>({ model: data });
};

export const action: ActionFunction = async ({ request, context, params }) => {
  const { session, supabase } = await getSession(request);
  const formData = await request.formData();

  const { error } = await supabase
    .from("models")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      amp_name: formData.get("ampName") as string,
    })
    .eq("profile_id", session?.user.id)
    .eq("id", params.id)
    .select();

  if (error) {
    return json<ActionData>({ error: "Error updating model" }, { status: 500 });
  }

  return json<ActionData>({ success: true });
};

export default function EditModelPage() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="max-w-3xl m-auto">
      {actionData?.success ? <Alert title="Successfully Updated" /> : null}
      <h2 className="text-2xl font-bold pb-5">Edit {data.model.title}</h2>
      <ModelForm model={data.model} />
    </div>
  );
}

import type { ActionFunction } from "@remix-run/cloudflare";
import {
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import type { LoaderFunction } from "react-router";
import { getSession } from "~/auth.server";
import ModelForm from "~/components/ModelForm";

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session } = await getSession(request, context);

  if (!session) {
    return redirect("/login");
  }

  return new Response();
};

//storage/v1/object/public

export const action: ActionFunction = async ({ request, context }) => {
  const { session, supabase } = await getSession(request, context);

  if (!session) {
    return redirect("/login"); // TODO: send a redirect url
  }

  try {
    const uploadHandler = unstable_createMemoryUploadHandler({ maxPartSize: 1000000 });

    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler // <-- we'll look at this deeper next
    );

    const model = formData.get("model") as File;

    const { data, error } = await supabase.storage
      .from("models")
      .upload(
        `${session.user.user_metadata.username}/${Math.random() /* tmp */}_${model.name}`,
        model,
        {
          cacheControl: "3600000000000",
          upsert: false,
        }
      );

    if (!data || error) {
      throw new Error("Could not upload model file");
    }

    const insertResponse = await supabase
      .from("models")
      .insert([
        {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          amp_name: formData.get("ampName") as string,
          model_path: data?.path,
          filename: model.name,
          profile_id: session.user.id,
        },
      ])
      .select();

    if (!insertResponse.data || insertResponse.error) {
      console.error("Write error:", insertResponse);
      throw new Error("Could not save model in database");
    }

    // const formData = await request.formData();
    return redirect(`/models/${insertResponse.data[0].id}`);
  } catch (e) {
    console.error("ERROR", e);
    return json({});
  }
};

export default function NewModelPage() {
  return (
    <div className="max-w-3xl m-auto">
      <h2 className="text-2xl font-bold pb-5">Upload Model</h2>
      <ModelForm />
    </div>
  );
}

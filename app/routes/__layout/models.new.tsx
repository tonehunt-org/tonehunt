import type { ActionFunction } from "@remix-run/node";
import { unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "react-router";
import { getSession } from "~/auth.server";
import ModelForm from "~/components/ModelForm";

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session } = await getSession(request);

  if (!session) {
    return redirect("/login");
  }

  return new Response();
};

//storage/v1/object/public

export const action: ActionFunction = async ({ request, context }) => {
  const { session, supabase } = await getSession(request);

  // if (!session) {
  //   return redirect("/login"); // TODO: send a redirect url
  // }

  try {
    const uploadHandler = unstable_createMemoryUploadHandler({ maxPartSize: 1000000 });

    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler // <-- we'll look at this deeper next
    );

    const file = formData.get("file") as File;

    const { data, error } = await supabase.storage
      .from("models")
      .upload(`${Math.random() /* tmp */}_${file.name}`, file, {
        cacheControl: "3600000000000",
        upsert: false,
      });

    if (!data || error) {
      throw new Error("Could not upload model file");
    }

    return json({ filepath: data?.path });
  } catch (e: any) {
    console.error("ERROR:", e);
    return json({ error: e.message }, { status: 500 });
  }
};

// export default function NewModelPage() {
//   return (
//     <div className="max-w-3xl m-auto">
//       <h2 className="text-2xl font-bold pb-5">Upload Model</h2>
//       <ModelForm />
//     </div>
//   );
// }

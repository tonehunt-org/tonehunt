import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "react-router";
import { useLoaderData } from "react-router";
import { getSession } from "~/auth.server";

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { supabase } = await getSession(request);

  const dbResponse = await supabase.from("models").select("*").eq("id", params.id).limit(1).single();

  if (!dbResponse.data) {
    return redirect("/not-found");
  }

  if (dbResponse.error) {
    console.error("DB ERROR:", dbResponse);
    return new Response("", { status: 500 });
  }

  return json({
    model: dbResponse.data,
    appUrl: context.SUPABASE_URL,
  });
};

export default function ModelPage() {
  const data = useLoaderData();

  console.log(data);
  return (
    <div>
      <h2 className="text-2xl pb-3 font-bold">{data?.model.title}</h2> <hr className="pb-3" />
      <div>
        <h3 className="text-xl font-semibold">Description</h3>
        {data?.model.description}
      </div>
      <div>
        <h3 className="text-xl font-semibold">Amp Name</h3>
        {data?.model.amp_name}
      </div>
      <a
        href={`/models/${data?.model.id}/download?path=${data.model.model_path}`}
        target="_blank"
        rel="noreferrer"
        download={data.model.filename}
      >
        Download
      </a>
    </div>
  );
}

import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { getSession } from "~/auth.server";
import Table from "~/components/ui/Table";
import type { Model } from "~/types/custom";
import ModelEntryActions from "~/components/ModelEntryActions";

type LoaderData = {
  models: Model[] | null;
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session, supabase } = await getSession(request);

  if (!session?.user) {
    return redirect("/");
  }

  const { data } = await supabase
    .from("models")
    .select("*")
    .eq("profile_id", session?.user.id)
    .order("created_at", { ascending: false });

  return json<LoaderData>({
    models: data,
  });
};

export default function ModelsPage() {
  const data = useLoaderData<LoaderData>();
  const location = useLocation();

  return (
    <div className="max-w-6xl m-auto">
      <h2 className="text-2xl font-bold pb-5">My Models</h2>
      <Table
        columns={[
          {
            title: "Title",
            renderCell: (model) => model.title,
          },
          {
            title: "Amp Name",
            renderCell: (model) => model.amp_name,
          },
          {
            title: "Actions",
            className: "w-24 text-center",
            renderCell: (model) => <ModelEntryActions model={model} />,
          },
        ]}
        data={data.models ?? []}
      />
    </div>
  );
}

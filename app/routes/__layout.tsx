import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { getSession } from "~/auth.server";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import CreateModal from "~/components/CreateModal";

type LoaderData = {
  user?: User;
  username?: string | null;
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session, supabase } = await getSession(request);

  const { data } = await supabase.from("profiles").select().eq("id", session?.user.id).limit(1).single();

  return json<LoaderData>({
    user: session?.user,
    username: data?.username,
  });
};

export default function Layout() {
  const data = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();

  const createModalOpen = searchParams.get("create") !== null && searchParams.get("create") !== undefined;

  const handelClose = () => {
    searchParams.delete("create");
    setSearchParams(searchParams);
  };

  return (
    <div>
      <Header data={data} />
      <div className="max-w-7xl m-auto mb-16 mt-16">
        <Outlet />
      </div>
      <Footer />
      <CreateModal open={createModalOpen} onClose={handelClose} />
    </div>
  );
}

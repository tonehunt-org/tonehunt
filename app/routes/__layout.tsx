import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { getSession } from "~/auth.server";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import CreateModal from "~/components/CreateModal";
import { db } from "~/utils/db.server";
import type { Category } from "@prisma/client";

type LoaderData = {
  user?: User;
  username?: string | null;
  categories: Category[];
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session } = await getSession(request);

  const profileReq = db.profile.findFirst({ where: { id: session?.user.id } });
  const categoriesReq = db.category.findMany({ where: { NOT: { title: "IR" } } }); // Ignoring IRs for now

  const [profile, categories] = await Promise.all([profileReq, categoriesReq]);

  return json<LoaderData>({
    user: session?.user,
    categories,
    username: profile?.username,
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
      <div className="max-w-7xl m-auto mb-16 mt-16 px-3">
        <Outlet />
      </div>
      <Footer />
      <CreateModal open={createModalOpen} onClose={handelClose} categories={data.categories} />
    </div>
  );
}

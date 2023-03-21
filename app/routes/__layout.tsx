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

  const Sidebar = () => {
    return (
      <div className="w-full p-4">
        <div className="w-full text-white rounded-md p-2 mb-8 border border-gray-600">
          <span className="block p-20 text-center">USER AREA</span>
        </div>
        <div className="w-full text-white rounded-md p-2 mb-8 border border-gray-600">
          <span className="block p-20 text-center">TAGS AREA</span>
        </div>
        <div className="w-full text-white rounded-md p-2 mb-8 border border-gray-600">
          <span className="block p-20 text-center">ARTICLES</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <Header data={data} />
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-3/4 xl:max-w-3xl xl:m-auto mb-8 mt-8 lg:mb-16 lg:mt-16 xl:mt-16 xl:mb-16 px-3">
          <Outlet />
        </div>
        <div className="w-full lg:w-1/4 xl:hidden">
          <Sidebar />
        </div>
      </div>

      {/* FIXED DESKTOP SIDEBAR */}
      <div className="hidden xl:block absolute top-20 right-0 w-72 min-h-full mb-20">
        <Sidebar />
      </div>

      <Footer />
      <CreateModal open={createModalOpen} onClose={handelClose} categories={data.categories} />
    </div>
  );
}

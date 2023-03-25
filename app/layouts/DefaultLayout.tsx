import { useSearchParams } from "@remix-run/react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Sidebar from "~/components/Sidebar";
import type { User } from "@supabase/supabase-js";
import type { Category, Profile } from "@prisma/client";
import type { PropsWithChildren } from "react";
import CreateModal from "~/components/CreateModal";

interface DefaultLayoutType {
  user?: User | null;
  profile?: Profile | null;
  className?: string | null;
  categories: Category[];
}

const DefaultLayout = (props: PropsWithChildren<DefaultLayoutType>) => {
  const { user, username, categories } = props;
  const [searchParams, setSearchParams] = useSearchParams();

  const createModalOpen = searchParams.get("create") !== null && searchParams.get("create") !== undefined;

  const handelClose = () => {
    searchParams.delete("create");
    setSearchParams(searchParams);
  };

  return (
    <div className="relative">
      <Header user={user} username={username} />
      <div className="flex flex-col p-3 lg:flex-row relative">
        <div className="w-full lg:w-3/4 xl:max-w-3xl xl:m-auto mb-8 mt-8 lg:mb-16 lg:mt-16 xl:mt-16 xl:mb-16 px-3">
          {props.children}
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

      <CreateModal open={createModalOpen} onClose={handelClose} categories={categories} />
    </div>
  );
};

export default DefaultLayout;

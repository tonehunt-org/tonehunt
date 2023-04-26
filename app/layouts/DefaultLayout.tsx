import Header from "~/components/Header";
import Footer from "~/components/Footer";
import type { User } from "@supabase/supabase-js";
import type { Counts, Profile } from "@prisma/client";
import type { PropsWithChildren } from "react";
import Asidebar from "~/components/Asidebar";
import MainNav from "~/components/MainNav";
import { ArticlesBlock } from "~/components/Sidebar";
import { ModelListCountTitle } from "~/components/routes/ModelListPage";

interface DefaultLayoutType {
  user?: User | null | undefined;
  profile?: Profile | null | undefined;
  className?: string | null;
  counts: Counts[];
  hideAsidebar?: boolean;
}

const DefaultLayout = ({ user, profile, counts, children, hideAsidebar }: PropsWithChildren<DefaultLayoutType>) => {
  return (
    <>
      <Header user={user} profile={profile} />

      <div className="p-3 h-fit block md:flex">
        <MainNav user={user} profile={profile} />

        <div className="w-full max-w-3xl mb-8 mt-3 lg:mb-10 lg:mt-5 px-3">
          <ModelListCountTitle counts={counts} className="lg:text-2xl mb-10 mt-8 md:mt-4 block lg:hidden" />

          {children}

          {/* NOTE: not ideal that this is duplicated here and another place, but it'll work for now */}
          <div className="mt-10 mb-5 lg:hidden">
            <ArticlesBlock />
          </div>
        </div>

        {hideAsidebar ? <div className="flex-1 ml-10 flex-grow" /> : <Asidebar counts={counts} />}
      </div>

      <Footer />
    </>
  );
};

export default DefaultLayout;

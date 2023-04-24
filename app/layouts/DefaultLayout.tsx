import Header from "~/components/Header";
import Footer from "~/components/Footer";
import type { User } from "@supabase/supabase-js";
import type { Counts, Profile } from "@prisma/client";
import type { PropsWithChildren } from "react";
import Asidebar from "~/components/Asidebar";
import MainNav from "~/components/MainNav";

interface DefaultLayoutType {
  user?: User | null | undefined;
  profile?: Profile | null | undefined;
  className?: string | null;
  counts: Counts[];
  hideAsidebar?: boolean;
}

const DefaultLayout = (props: PropsWithChildren<DefaultLayoutType>) => {
  const { user, profile } = props;

  return (
    <div className="">
      <Header user={user} profile={profile} />

      <div className="flex p-3 h-fit">
        <MainNav user={user} profile={profile} className="lg:min-w-[220px] overflow-hidden lg:overflow-auto" />

        <div className="w-full max-w-3xl mb-8 mt-8 lg:mb-16 lg:mt-5 xl:mb-16 px-3">{props.children}</div>

        {props.hideAsidebar ? <div className="flex-1 ml-10 flex-grow" /> : <Asidebar counts={props.counts} />}
      </div>

      <Footer />
    </div>
  );
};

export default DefaultLayout;

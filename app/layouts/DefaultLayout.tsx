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

      <div className="flex flex-col xl:flex-row p-3 h-fit">
        <MainNav user={user} profile={profile} />

        <div className="w-full xl:max-w-3xl mb-8 mt-8 xl:mb-16 xl:mt-5 px-3">{props.children}</div>

        {props.hideAsidebar ? <div className="flex-1 ml-10 flex-grow" /> : <Asidebar counts={props.counts} />}
      </div>

      <Footer />
    </div>
  );
};

export default DefaultLayout;

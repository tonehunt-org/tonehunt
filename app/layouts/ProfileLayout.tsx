import { useSearchParams } from "@remix-run/react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import type { User } from "@supabase/supabase-js";
import type { Category, Profile, Tag } from "@prisma/client";
import type { PropsWithChildren } from "react";

interface ProfileLayoutType {
  user?: User | null | undefined;
  profile?: Profile | null | undefined;
  className?: string | null;
}

const ProfileLayout = (props: PropsWithChildren<ProfileLayoutType>) => {
  const { user, profile } = props;

  return (
    <div className="relative">
      <Header user={user} profile={profile} />
      <div className="flex relative">{props.children}</div>
      <Footer />
    </div>
  );
};

export default ProfileLayout;

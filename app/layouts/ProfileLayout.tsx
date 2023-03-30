import { useSearchParams } from "@remix-run/react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import type { User } from "@supabase/supabase-js";
import type { Category, Profile, Tag } from "@prisma/client";
import type { PropsWithChildren } from "react";
import CreateModal from "~/components/CreateModal";

interface ProfileLayoutType {
  user?: User | null | undefined;
  profile?: Profile | null | undefined;
  className?: string | null;
  categories: Category[];
  tags: Tag[];
}

const ProfileLayout = (props: PropsWithChildren<ProfileLayoutType>) => {
  const { user, profile, categories, tags } = props;
  const [searchParams, setSearchParams] = useSearchParams();

  const createModalOpen = searchParams.get("create") !== null && searchParams.get("create") !== undefined;

  const handelClose = () => {
    searchParams.delete("create");
    setSearchParams(searchParams);
  };

  return (
    <div className="relative">
      <Header user={user} profile={profile} />
      <div className="flex relative">{props.children}</div>
      <Footer />
      <CreateModal open={createModalOpen} onClose={handelClose} categories={categories} tags={tags} />
    </div>
  );
};

export default ProfileLayout;

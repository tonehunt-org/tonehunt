import { useOutletContext } from "@remix-run/react";
import ModelList from "~/components/ModelList";
import { MODELS_LIMIT } from "~/utils/constants";
import type { ProfileLoaderData } from "../$username";

export default function UsernamePage() {
  const data = useOutletContext<ProfileLoaderData>();

  return (
    <ModelList
      data={data.modelList.models}
      total={data.modelList.total}
      currentPage={data.modelList.page}
      limit={MODELS_LIMIT}
      user={data.user}
      categories={data.categories}
      profile={data.sessionProfile}
      emptyMessage={
        data.profile && data.sessionProfile && data.profile.id === data.sessionProfile.id
          ? "You haven't uploaded any models yet."
          : `${data.profile?.username ?? "This user"} hasn't uplaoded any models yet.`
      }
    />
  );
}

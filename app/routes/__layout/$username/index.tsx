import { useOutletContext } from "@remix-run/react";
import ModelList from "~/components/ModelList";
import { MODELS_LIMIT } from "~/utils/constants";
import type { ProfileLoaderData } from "../$username";
import EmptyFeed from "~/components/EmptyFeed";

export default function UsernamePage() {
  const data = useOutletContext<ProfileLoaderData>();

  const isOwnProfile = data.profile && data.sessionProfile && data.profile.id === data.sessionProfile.id && data.user;

  if (data.modelList.models.length === 0 && isOwnProfile) {
    return <EmptyFeed headline="You haven't uplaoded any models yet" />;
  }

  return (
    <ModelList
      data={data.modelList.models}
      total={data.modelList.total}
      currentPage={data.modelList.page}
      limit={MODELS_LIMIT}
      user={data.user}
      categories={data.categories}
      profile={data.sessionProfile}
      emptyMessage={`${data.profile?.username ?? "This user"} hasn't uploaded any models yet`}
      emptyFilterMessage={`${data.profile?.username ?? "This user"} hasn't uploaded any of these models yet`}
    />
  );
}

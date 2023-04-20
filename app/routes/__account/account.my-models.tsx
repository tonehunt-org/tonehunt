import { getSession } from "~/auth.server";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { User } from "@supabase/supabase-js";
import type { Category, Model } from "@prisma/client";
import ModelList from "~/components/ModelList";
import type { ProfileWithSocials } from "~/services/profile";
import { getProfileWithSocials } from "~/services/profile";
import { getSortFilter } from "~/utils/loader";
import { MODELS_LIMIT } from "~/utils/constants";
import { getModels } from "~/services/models";
import EmptyFeed from "~/components/EmptyFeed";

export const meta: MetaFunction<LoaderData> = ({ data }) => {
  return {
    title: `My Models | ToneHunt`,
    description: `A list of my models.`,
  };
};

type LoaderData = {
  user: User | null | undefined;
  models: Model[];
  total: number;
  page: number;
  profile: ProfileWithSocials | null;
  categories: Category[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await getSession(request);
  const user = session?.user;

  if (!session) {
    return redirect("/login?redirectTo=/account/my-models");
  }

  const url = new URL(request.url);
  const profile = await getProfileWithSocials(session);

  if (!profile) {
    return redirect(`/login?redirectTo=/account/my-models`);
  }

  const { offset, sortDirection, categoryId, page, categories } = await getSortFilter(url);

  const models = await getModels({
    limit: MODELS_LIMIT,
    next: offset,
    profileId: profile.id,
    user,
    sortDirection,
    categoryId,
    all: true,
  });

  return json<LoaderData>({
    user,
    models: models.data,
    categories,
    total: models.total,
    page,
    profile,
  });
};

const MyModelsPage = () => {
  const data = useLoaderData<LoaderData>();
  // const submit = useSubmit();
  // const profile = useProfile();

  // const onDeleteClick = (modelId: string, profileId: string) => {
  //   if (window.confirm("Do you really want to delete this model?")) {
  //     let formData = new FormData();
  //     formData.append("modelId", modelId);
  //     formData.append("profileId", profileId);
  //     submit(formData, { method: "post", action: "/models/delete" });
  //   }
  // };

  return (
    <EmptyFeed
      headline="You haven't uploaded any models yet"
      buttonHref="/models/new"
      buttonText="Start uploading your models"
    />
  );

  return (
    <ModelList
      data={data.models}
      categories={data.categories}
      total={data.total}
      currentPage={data.page}
      limit={MODELS_LIMIT}
      user={data.user}
      profile={data.profile}
    />
  );
};

export default MyModelsPage;

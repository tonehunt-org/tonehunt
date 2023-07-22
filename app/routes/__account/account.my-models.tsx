/*
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

  // if (data.models.length === 0) {
  //   return (
  //     <EmptyFeed
  //       headline="You haven't uploaded any models yet"
  //       buttonHref="/models/new"
  //       buttonText="Start uploading your models"
  //     />
  //   );
  // }

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
*/

import { getSession } from "~/auth.server";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { User } from "@supabase/supabase-js";
import { db } from "~/utils/db.server";
import { map } from "lodash";
import * as timeago from "timeago.js";
import Button from "~/components/ui/Button";
import ButtonLink from "~/components/ui/ButtonLink";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import useProfile from "~/hooks/useProfile";
import type { Prisma } from "@prisma/client";

export const meta: MetaFunction<LoaderData> = ({ data }) => {
  return {
    title: `My Models | ToneHunt`,
    description: `A list of my models.`,
  };
};

type ModelWithCustomData = Prisma.ModelGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    tags: true;
    createdAt: true;
    updatedAt: true;
    filename: true;
    private: true;
    active: true;
    profileId: true;
    category: {
      select: {
        id: true;
        title: true;
        slug: true;
      };
    };
  };
}>;

type LoaderData = {
  user: User | null | undefined;
  models: ModelWithCustomData[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await getSession(request);
  const user = session?.user;

  if (!session) {
    return redirect("/login?redirectTo=/account/my-models");
  }

  const models = await db.model.findMany({
    where: {
      profileId: user?.id,
      deleted: false,
    },
    select: {
      id: true,
      title: true,
      description: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      filename: true,
      private: true,
      active: true,
      profileId: true,
      category: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  return json<LoaderData>({
    user,
    models,
  });
};

const MyModelsPage = () => {
  const data = useLoaderData<LoaderData>();
  const submit = useSubmit();
  const profile = useProfile();

  const onDeleteClick = (modelId: string, profileId: string) => {
    if (window.confirm("Do you really want to delete this model?")) {
      let formData = new FormData();
      formData.append("modelId", modelId);
      formData.append("profileId", profileId);
      submit(formData, { method: "post", action: "/models/delete" });
    }
  };

  const renderItems = map(data.models, (model) => {
    return (
      <div key={model.id} className="flex-1 bg-tonehunt-gray-medium p-3 mb-5 rounded-xl">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/4">
            <Link
              to={`/${profile?.username}/${model.id}`}
              prefetch="intent"
              className="block w-full font-satoshi-bold text-2xl mb-1 hover:underline"
            >
              {model.title}
            </Link>
            <span className="block w-full font-satoshi-light text-sm mb-1">
              <span className="font-satoshi-bold">Category</span>: {model.category.title}
            </span>
            <span className="block w-full font-satoshi-light text-sm mb-1">
              <span className="font-satoshi-bold">Created</span>:{" "}
              <time dateTime={model.createdAt}>{timeago.format(new Date(model.createdAt!))}</time>
            </span>
            <span className="block w-full font-satoshi-light text-sm mb-1">
              <span className="font-satoshi-bold">Updated</span>:{" "}
              <time dateTime={model.createdAt}>{timeago.format(new Date(model?.updatedAt!))}</time>
            </span>
            <span className="block w-full font-satoshi-light text-sm ">
              <span className="font-satoshi-bold">Status</span>:{" "}
              <span className={`${model.active ? "text-green-500" : "text-yellow-500"}`}>
                {model.active ? "Published" : "Hidden"}
              </span>
            </span>
          </div>
          <div className="w-full lg:w-1/4 lg:pl-3">
            <div className="flex items-center h-full justify-center">
              <ButtonLink
                className="ml-2 bg-cyan-600 hover:bg-cyan-700 border-none"
                variant="button"
                to={`/account/my-models/${model.id}`}
              >
                <PencilSquareIcon className="w-5 h-5 inline-block" />
              </ButtonLink>
              <Button
                type="button"
                variant="secondary"
                className="ml-2 bg-red-600 hover:bg-red-700 border-none"
                onClick={() => onDeleteClick(model.id, model.profileId)}
              >
                <TrashIcon className="w-5 h-5 inline-block" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="w-full">
      <div className="flex">
        <h1 className="w-full text-center text-2xl lg:text-3xl font-satoshi-bold mb-10">My Models</h1>
      </div>
      <div className="flex flex-col">{renderItems}</div>
    </div>
  );
};

export default MyModelsPage;

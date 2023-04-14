import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "~/utils/db.server";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getSession } from "~/auth.server";
import { FaceFrownIcon, UserIcon } from "@heroicons/react/24/outline";

import ModelsListComponent from "~/components/ModelList";
import Loading from "~/components/ui/Loading";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@prisma/client";
import { getModels } from "~/services/models";
import { MODELS_LIMIT } from "~/utils/constants";
import type { ProfileWithFollows } from "~/services/profile";
import { getProfileWithFollows } from "~/services/profile";
import FollowButton from "~/components/FollowButton";

export const meta: MetaFunction<LoaderData> = ({ data, location }) => {
  const d = data as LoaderData;

  const title = d.profile ? `${d.profile?.username}'s Profile | ToneHunt` : "Not Found | ToneHunt";
  const description = d.profile
    ? `${d.profile?.username}'s models include ${d.modelList.models[0]?.title} and ${d.modelList.models[1]?.title}. ${d.profile?.bio}`
    : "Not Found";

  return {
    title,
    description,

    "og:title": title,
    // "og:image": "http://euro-travel-example.com/thumbnail.jpg", // TODO
    "og:url": `${location.pathname}${location.search}`,
    // "twitter:card": "summary_large_image", // TODO

    // <!--  Non-Essential, But Recommended -->
    "og:description": description,
    "twitter:image:alt": description,
  };
};

export type LoaderData = {
  user?: User | null | undefined;
  profile?: ProfileWithFollows | null | undefined;
  sessionProfile:
    | (Profile & {
        favorites: {
          id: number;
          modelId: string;
        }[];
        following: {
          targetId: string;
        }[];
      })
    | null;
  modelList: {
    models: any;
    total: number;
    page: number;
  };
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { session, supabase } = await getSession(request);
  const user = session?.user;
  const url = new URL(request.url);

  // GET PAGE
  let page = Number(url.searchParams.get("page")) ?? 1;
  if (!page || page === 0) page = 1;
  const offset = (page - 1) * MODELS_LIMIT;

  const sessionProfileReq = db.profile.findFirst({
    where: { id: session?.user.id },
    include: {
      favorites: {
        select: {
          id: true,
          modelId: true,
        },
      },
      following: {
        select: {
          targetId: true,
        },
        where: {
          deleted: false,
          active: true,
        },
      },
    },
  });

  const [sessionProfile, profile] = await Promise.all([
    sessionProfileReq,
    getProfileWithFollows(params.username as string),
  ]);

  if (profile && profile.avatar && profile?.avatar !== "") {
    const { data } = supabase.storage.from("avatars").getPublicUrl(profile.avatar);
    profile.avatar = data.publicUrl ?? null;
  }

  // GET MODELS
  const models = profile
    ? await getModels({ limit: MODELS_LIMIT, next: offset, profileId: profile.id, user })
    : {
        data: [],
        total: 0,
      };

  return json<LoaderData>(
    {
      user,
      profile,
      sessionProfile,
      modelList: {
        models: models.data,
        total: models.total,
        page: page - 1,
      },
    },
    {
      status: !profile ? 404 : 200,
    }
  );
};

export const NotFound = ({ children }: PropsWithChildren) => (
  <div className="w-full">
    <div className="flex flex-col">
      <div className="flex-1">
        <div className="w-full px-3 py-10 xl:max-w-3xl xl:m-auto">
          <div className="flex justify-center flex-col">
            <div className="flex-1">
              <div className="flex justify-center">
                <FaceFrownIcon className="w-32" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-center">
                <h1 className="text-3xl font-satoshi-bold my-5 uppercase">{children}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function UserProfilePage() {
  const data = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState<boolean>(false);

  const handlePageClick = (selectedPage: number) => {
    setLoading(true);
    searchParams.set("page", String(selectedPage + 1));
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (data.modelList) {
      setLoading(false);
    }
  }, [data.modelList, searchParams]);

  if (data.profile === null) {
    return <NotFound>Not Found</NotFound>;
  }

  const arrayLength = Math.floor(5000 / (data.profile?.username?.length ?? 1 * 10));
  const textForBG = [...new Array(arrayLength)].map(() => data.profile?.username ?? "");
  const isAvatar = data.profile?.avatar && data.profile?.avatar !== "";

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <div className="flex-1 relative">
          <div className="block absolute top-0 left-0 w-full h-full leading-[88%] bg-tonehunt-gray-darker font-satoshi-bold -z-10 uppercase text-[80px] overflow-hidden break-all text-shadow-bg text-tonehunt-gray-darker">
            {textForBG}
          </div>
          <div className="w-full px-3 py-10 xl:max-w-3xl xl:m-auto">
            <div className="flex flex-col z-1">
              <div className="flex-1">
                <div className="flex justify-center">
                  {isAvatar ? (
                    <img
                      className="w-32 h-32 rounded-full bg-tonehunt-gray-light mb-5 object-cover"
                      src={data.profile?.avatar ?? ""}
                      title={data.profile?.username ?? "avatar"}
                      alt={data.profile?.username ?? "avatar"}
                    />
                  ) : (
                    <UserIcon className="w-32 h-32 p-6 rounded-full bg-tonehunt-gray-light mb-5" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-center">
                  <h1 className="text-5xl font-satoshi-bold mb-6">{data.profile?.username}</h1>
                </div>

                <div className="flex justify-center mb-6">
                  <span className="text-xl font-satoshi-regular text-tonehunt-gray-lighter">
                    {data.profile?.bio ?? ""}
                  </span>
                </div>

                <div className="flex justify-center flex-row mb-6 gap-6">
                  <div>
                    <span className="font-satoshi-bold">
                      {data.profile?.followers.length}{" "}
                      <span className="text-tonehunt-gray-lighter">
                        {data.profile?.followers.length === 1 ? `Follower` : `Followers`}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span className="font-satoshi-bold">
                      {data.profile?.following.length} <span className="text-tonehunt-gray-lighter">Following</span>
                    </span>
                  </div>
                </div>

                {data.user && data.profile?.username && data.profile?.id !== data.sessionProfile?.id ? (
                  <FollowButton
                    profileId={data.profile.id}
                    profileUsername={data.profile.username}
                    isFollowing={
                      !!data.sessionProfile?.following.find((following) => following.targetId === data.profile?.id)
                    }
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="w-full px-3 py-10 xl:max-w-3xl xl:m-auto">
            <div className="flex justify-center">
              <div className="w-full">
                {loading ? (
                  <div className="flex justify-center px-10 py-60">
                    <Loading size="48" />
                  </div>
                ) : null}
                {!loading ? (
                  <ModelsListComponent
                    data={data.modelList.models}
                    total={data.modelList.total}
                    currentPage={data.modelList.page}
                    limit={MODELS_LIMIT}
                    handlePageClick={handlePageClick}
                    showMenu={false}
                    showFilters={false}
                    user={data.user}
                    profile={data.sessionProfile}
                    emptyMessage={
                      data.profile && data.sessionProfile && data.profile.id === data.sessionProfile.id
                        ? "You haven't uploaded any models yet."
                        : `${data.profile?.username ?? "This user"} hasn't uplaoded any models yet.`
                    }
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

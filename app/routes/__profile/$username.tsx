import type { PropsWithChildren } from "react";
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
import { MODELS_LIMIT } from "~/components/routes/ModelListPage";
import { DEFAULT_CACHE_HEADER } from "~/utils/response";
import type { ProfileWithFavorites } from "~/services/profile";
import { getProfileWithFavorites } from "~/services/profile";

export const meta: MetaFunction<LoaderData> = ({ data, location }) => {
  const d = data as LoaderData;

  const title = `${d.profile?.username}'s Profile | ToneHunt`;
  const description = `${d.profile?.username}'s models include ${d.modelList.models[0]?.title} and ${d.modelList.models[1]?.title}. ${d.profile?.bio}`;

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
  profile?: Profile | null | undefined;
  profileWithFavorites: ProfileWithFavorites | null;
  modelList: {
    models: any;
    total: number;
    page: number;
  };
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { session } = await getSession(request);
  const user = session?.user;
  const url = new URL(request.url);

  // GET PAGE
  let page = Number(url.searchParams.get("page")) ?? 1;
  if (!page || page === 0) page = 1;
  const offset = (page - 1) * MODELS_LIMIT;

  const profileReq = params.username
    ? await db.profile.findUnique({
        where: {
          username: params.username,
        },
      })
    : Promise.resolve(null);

  const [profileWithFavorites, profile] = await Promise.all([getProfileWithFavorites(session), profileReq]);

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
      profileWithFavorites,
      modelList: {
        models: models.data,
        total: models.total,
        page: page - 1,
      },
    },
    {
      headers: {
        ...DEFAULT_CACHE_HEADER,
      },
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
  const data = useLoaderData();
  const [loading, setLoading] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageClick = (selectedPage: number) => {
    setLoading(true);
    searchParams.set("page", String(selectedPage + 1));
    setSearchParams(searchParams);
  };

  if (data.profile === null) {
    return <NotFound>User not found</NotFound>;
  }

  const { user, profile, modelList } = data;

  const arrayLength = Math.floor(5000 / (profile.username.length * 10));
  const textForBG = [...new Array(arrayLength)].map(() => profile.username);

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
                  <UserIcon className="w-40 h-40 p-6 rounded-full bg-tonehunt-gray-light mb-5" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-center">
                  <h1 className="text-5xl font-satoshi-bold mb-5">{profile.username}</h1>
                </div>
                <div className="flex justify-center">
                  <span className="text-lg font-satoshi-regular text-tonehunt-gray-lighter">
                    {profile.bio ?? "No description available"}
                  </span>
                </div>
                {/* LOGIC NOT IN PLACE YET. LEAVING FOR REFERENCE */}
                {/* <div className="flex justify-center flex-row">
                  <div>
                    <span className="text-lg font-satoshi-regular mb-5">241 Followers</span>
                  </div>
                  <div>
                    <span className="text-lg font-satoshi-regular mb-5">241 Following</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <h1 className="text-3xl font-satoshi-bold">+ FOLLOW BUTTON</h1>
                </div> */}
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
                    data={modelList.models}
                    total={modelList.total}
                    currentPage={modelList.page}
                    limit={MODELS_LIMIT}
                    handlePageClick={handlePageClick}
                    showMenu={false}
                    showFilters={false}
                    user={user}
                    profile={data.profileWithFavorites}
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

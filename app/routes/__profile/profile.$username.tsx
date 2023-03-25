import { useState } from "react";
import { db } from "~/utils/db.server";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { stringify as qs_stringify } from "qs";
import { getSession } from "~/auth.server";
import { FaceFrownIcon, UserIcon } from "@heroicons/react/24/outline";

import ModelsListComponent from "~/components/ModelList";
import Loading from "~/components/ui/Loading";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@prisma/client";
import { getModels } from "~/services/models";

export type LoaderData = {
  user?: User | null | undefined;
  profile?: Profile | null | undefined;
  modelList: {
    models: any;
    total: number;
    page: number;
  };
};

// THE AMOUNT OF MODELS PER PAGE
const MODELS_LIMIT = 8;

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { session } = await getSession(request);
  const user = session?.user;
  const url = new URL(request.url);

  // GET PAGE
  let page = Number(url.searchParams.get("page")) ?? 1;
  if (!page || page === 0) page = 1;
  const offset = (page - 1) * MODELS_LIMIT;

  const profile = params.username
    ? await db.profile.findUnique({
        where: {
          username: params.username,
        },
      })
    : null;

  // GET MODELS
  const models = profile
    ? await getModels({ limit: MODELS_LIMIT, next: offset, profileId: profile.id, user })
    : {
        data: [],
        total: 0,
      };

  return json<LoaderData>({
    user,
    profile,
    modelList: {
      models: models.data,
      total: models.total,
      page: page - 1,
    },
  });
};

const UserNotFound = () => (
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
                <h1 className="text-3xl font-satoshi-bold my-5 uppercase">User not found</h1>
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

  if (data.profile === null) {
    return <UserNotFound />;
  }

  const { user, profile, modelList } = data;

  let textForBG = "";
  for (let x = 0; x < 30; x++) {
    textForBG += `${profile?.username} `;
  }

  const handlePageClick = (selectedPage: number) => {
    setLoading(true);
    const params: any = {
      page: selectedPage + 1,
    };
    const query = qs_stringify(params);
    window.location.href = `/profile/${profile.username}?${query}`;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <div className="flex-1 relative">
          <div className="block absolute top-0 left-0 w-full h-full bg-tonehunt-gray-darker -z-10 uppercase text-8xl font-bold overflow-hidden break-all text-shadow-bg text-tonehunt-gray-darker">
            {textForBG}
          </div>
          <div className="w-full px-3 py-10 xl:max-w-3xl xl:m-auto">
            <div className="flex flex-col z-30">
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

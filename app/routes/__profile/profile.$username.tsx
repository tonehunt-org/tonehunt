import { db } from "~/utils/db.server";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { stringify as qs_stringify } from "qs";
import { getSession } from "~/auth.server";
import { FaceFrownIcon, UserIcon } from "@heroicons/react/24/outline";

import ModelsListComponent from "~/components/ModelList";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@prisma/client";

export type LoaderData = {
  user?: User | null | undefined;
  profile?: Profile | null | undefined;
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { session } = await getSession(request);
  const user = session?.user;

  console.log(params);
  const profile = params.username
    ? await db.profile.findUnique({
        where: {
          username: params.username,
        },
        select: {
          username: true,
          avatar: true,
          bio: true,
        },
      })
    : null;

  return json<LoaderData>({
    user,
    profile,
  });
};

export default function UserProfilePage() {
  const data = useLoaderData();

  if (data.profile === null) {
    return (
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
  }

  const { user, profile } = data;
  let textForBG = "";
  for (let x = 0; x < 30; x++) {
    textForBG += `${profile?.username} `;
  }

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
                {/* LOGIC NOT IN PLACE YET */}
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
              <h1 className="text-3xl font-satoshi-bold mb-5">TABLE HERE</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

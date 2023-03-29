import * as timeago from "timeago.js";
import FavoriteButton from "~/components/FavoriteButton";
import DownloadButton from "~/components/DownloadButton";
import ShareButton from "~/components/ShareButton";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NotFound } from "./$username";
import type { Category, Favorite, Model, ModelDownload, Profile } from "@prisma/client";
import { db } from "~/utils/db.server";
import { UserIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { getCategoryProfile } from "~/services/categories";
import { getSession } from "~/auth.server";
import { getProfile } from "~/services/profile";
import type { User } from "@supabase/supabase-js";

type LoaderData = {
  model: Model & {
    profile: Profile;
    category: Category;
    favorites: { id: Favorite["id"] }[];
    downloads: { id: ModelDownload["id"] }[];
  };
  favorite: Favorite | null;
  user?: User;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { session } = await getSession(request);
  const modelReq = db.model.findFirst({
    where: {
      id: params.modelId as string,
    },
    include: {
      downloads: {
        select: {
          id: true,
        },
      },
      profile: true,
      category: true,
      favorites: {
        select: {
          id: true,
        },
      },
    },
  });

  const profileReq = session ? getProfile(session) : Promise.resolve(null);

  const [model, profile] = await Promise.all([modelReq, profileReq]);

  const favorite = profile
    ? await db.favorite.findFirst({
        where: {
          modelId: params.modelId,
          profileId: profile.id,
        },
      })
    : null;

  if (!model) {
    throw new Response("", { status: 404 });
  }

  return json<LoaderData>({ model, favorite, user: session?.user });
};

export default function ModelDetailPage() {
  const data = useLoaderData<LoaderData>();
  const shareButtonRef = useRef(null);

  const textForBG = [...new Array(30)].map(() => data.model.title);

  return (
    <section className="w-full">
      <header className="pt-[80px] text-center relative">
        <div className="relative z-10">
          <div className="pb-[40px]">
            <img
              className="m-auto w-32 h-32"
              src={getCategoryProfile(data.model.category.slug).icon}
              alt={data.model.category.title}
            />
          </div>

          <h4 className="mb-0 pb-[12] leading-[19px] text-[14px] font-satoshi-bold uppercase text-tonehunt-green">
            {data.model.category.title}
          </h4>
          <h3 className="font-satoshi-bold text-[47px] pb-8">{data.model.title}</h3>

          <div className="flex gap-[12px] justify-center pb-16">
            <DownloadButton count={data.model.downloads.length} onClick={() => {}} />

            <FavoriteButton
              count={data.model.favorites.length}
              className="bg-tonehunt-gray-darker"
              favorited={!!data.favorite && data.favorite?.deleted !== true}
              modelId={data.model.id}
              disabledReason={data.user ? undefined : "You must be logged in"}
            />

            <ShareButton
              ref={shareButtonRef}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  alert("Url copied to clipboard");
                } catch (e) {}
              }}
              className="bg-tonehunt-gray-darker"
            />
          </div>
        </div>

        <div className="block absolute top-0 left-0 w-full h-full leading-[88%] bg-tonehunt-gray-darker font-satoshi-bold z-0 uppercase text-[80px] overflow-hidden break-all text-shadow-bg text-tonehunt-gray-darker">
          {textForBG}
        </div>
      </header>

      <div className="pt-16 flex gap-[40px] max-w-[990px] m-auto px-4">
        <div className="border border-white/20 rounded-2xl p-4 text-center w-[270px]">
          <UserIcon className="bg-tonehunt-gray-light h-[110px] w-[110px] m-auto mb-4 rounded-full p-4" />
          <h4 className="text-xl leading-[27px] opacity-50 mb-8">{data.model.profile.username}</h4>

          <Link
            to={`/${data.model.profile.username}`}
            className="block hover:bg-tonehunt-gray-light text-base text-white/70 py-3 px-5 bg-tonehunt-gray-medium rounded-xl"
          >
            Profile
          </Link>
        </div>

        <div className="flex-grow">
          <h4 className="pb-2">{data.model.ampName}</h4>
          <p className="text-[22px] opacity-70 pb-[40px]">{data.model.description}</p>

          <h5 className="text-xs uppercase leading-4 opacity-60 font-satoshi-bold pb-4">Tags</h5>

          <ul className="pb-[44px] flex gap-1">
            {data.model.tags?.map((tag) => {
              return (
                <li key={tag}>
                  <Link
                    to={`/?tags=${tag}`}
                    prefetch="intent"
                    className="text-base leading-[22px] px-2 py-1 rounded-lg border border-white/20"
                  >
                    #{tag}
                  </Link>
                </li>
              );
            })}
          </ul>

          <span className="opacity-60 text-sm leading-[19px]">Uploaded {timeago.format(data.model.createdAt)}</span>
        </div>
      </div>
    </section>
  );
}

export const CatchBoundary = () => {
  const data = useCatch();

  if (data.status === 404) {
    return <NotFound>Model not found.</NotFound>;
  }

  return <div>An unknown error occurred</div>;
};

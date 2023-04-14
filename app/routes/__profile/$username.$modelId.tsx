import * as timeago from "timeago.js";
import FavoriteButton from "~/components/FavoriteButton";
import DownloadButton from "~/components/DownloadButton";
import ShareButton from "~/components/ShareButton";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NotFound } from "./$username";
import type { Category, Favorite, Model, ModelDownload, Profile } from "@prisma/client";
import { db } from "~/utils/db.server";
import { UserIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { getCategoryProfile } from "~/services/categories";
import { getSession } from "~/auth.server";
import type { ProfileWithFollows } from "~/services/profile";
import { getProfile, getProfileWithFollows } from "~/services/profile";
import type { User } from "@supabase/supabase-js";
import ButtonLink from "~/components/ui/ButtonLink";
import FollowButton from "~/components/FollowButton";

export const meta: MetaFunction<LoaderData> = ({ data, location, parentsData }) => {
  const d = data as LoaderData;

  const title = `${d.model.title} | ToneHunt`;
  const description = `${d.model.title} is a model by ${d.model.profile.username}. ${d.model.description}`;

  return {
    title,
    description,

    "og:title": title,
    "og:url": `${location.pathname}${location.search}`,
    "og:description": description,
    "twitter:image:alt": description,
  };
};

type LoaderData = {
  model: Model & {
    profile: Profile;
    category: Category;
    favorites: { id: Favorite["id"] }[];
    downloads: { id: ModelDownload["id"] }[];
  };
  favorite: Favorite | null;
  user?: User;
  profileWithFollows: ProfileWithFollows | null;
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
      license: true,
    },
  });

  const profileReq = session ? getProfile(session) : Promise.resolve(null);

  const [model, profile] = await Promise.all([modelReq, profileReq]);

  // TODO: we're doing duplicate calls to the db that are unnecessary. It's fine for now, but
  // we need to optimize
  const profileWithFollows = profile?.username ? await getProfileWithFollows(profile.username) : null;

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

  return json<LoaderData>({ model, favorite, user: session?.user, profileWithFollows });
};

export default function ModelDetailPage() {
  const data = useLoaderData<LoaderData>();
  const shareButtonRef = useRef(null);

  const arrayLength = Math.floor(5000 / (data.model.title.length * 10));
  const textForBG = [...new Array(arrayLength)].map(() => data.model.title);

  const reportMail = {
    subject: `Report model: ${data.model.id} - ${data.model.title}`,
    body: "I am the owner of this content and I did not give permission for upload. This model breaks the user agreement with regards to algorithmic captures",
  };

  return (
    <section className="w-full">
      <header className="pt-[40px] lg:pt-[80px] text-center relative">
        <div className="relative z-10">
          <div className="pb-[20px] lg:pb-[40px]">
            <img
              className="m-auto w-20 h-20 lg:w-32 lg:h-32"
              src={getCategoryProfile(data.model.category.slug, data.model.filecount ?? undefined).icon}
              alt={data.model.category.title}
            />
          </div>

          <h4 className="mb-0 pb-[12] leading-[19px] text-[14px] font-satoshi-bold uppercase text-tonehunt-green">
            {data.model.filecount && data.model.filecount > 1
              ? `${data.model.filecount} ${data.model.category.pluralTitle}`
              : data.model.category.title}
          </h4>
          <h3 className="font-satoshi-bold text-2xl lg:text-[47px] pb-8 max-w-[990px] m-auto px-4 leading-tight">
            {data.model.title}
          </h3>

          <div className="flex gap-[12px] justify-center pb-8 lg:pb-16">
            <DownloadButton
              count={data.model.downloads.length}
              className="bg-tonehunt-gray-darker"
              modelId={data.model.id}
              modelName={data.model.title}
            />

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

      <div className="pt-8 lg:pt-16 md:flex md:flex-row-reverse gap-[40px] max-w-[990px] m-auto px-4">
        <div className="flex-grow">
          <div className="pb-10">
            <h5 className="text-xs font-satoshi-bold uppercase text-white/40 pb-2">Make and model</h5>
            <h4 className=" font-satoshi-bold text-lg">{data.model.ampName}</h4>
          </div>

          <div className="pb-10">
            <h5 className="text-xs font-satoshi-bold uppercase text-white/40 pb-2">Description</h5>
            <p className="text-[18px] lg:text-[22px]  whitespace-pre-line">{data.model.description}</p>
          </div>

          {data.model.link ? (
            <div className="pb-10">
              <h5 className="text-xs font-satoshi-bold uppercase text-white/40 pb-2">Preview</h5>
              <iframe
                width="420"
                height="315"
                width="100%"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                frameBorder="0"
                src={data.model.link}
                title={`Demonstration for ${data.model.title}`}
              />
            </div>
          ) : null}

          <time dateTime={data.model.createdAt} className="block pb-10 opacity-60 text-sm leading-[19px]">
            Uploaded {timeago.format(data.model.createdAt)}
          </time>

          {data.model.tags.length > 0 ? (
            <div>
              <h5 className="text-xs uppercase leading-4 opacity-40 font-satoshi-bold pb-4">Tags</h5>

              <ul className="m-0 p-0 pb-[44px] flex gap-1.5 flex-wrap ">
                {data.model.tags?.map((tag) => {
                  return (
                    <li key={tag}>
                      <Link
                        to={`/?tags=${tag}`}
                        prefetch="intent"
                        className="px-2 py-1 rounded-lg border border-white/20 inline-block"
                      >
                        #{tag}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {data.model.license ? (
            <div className="mb-4">
              <h5 className="text-xs uppercase leading-4 opacity-40 font-satoshi-bold pb-2">License</h5>
              <p className="font-satoshi-light text-sm text-white/40">
                <span className="font-satoshi-medium inline mr-1">{data.model.license.name}:</span>
                {data.model.license.description}
              </p>
            </div>
          ) : null}
          <div className="flex justify-start mt-10 mb-5 text-white/60">
            <ButtonLink
              to={`mailto:contact@tonehunt.org?subject=${reportMail.subject}&body=${reportMail.body}`}
              className="text-tiny uppercase px-3 py-2"
            >
              Report model
            </ButtonLink>
          </div>
        </div>

        <div className="md:w-[270px] flex-none mb-5 lg:mb-0 w-full pt-10 md:pt-0">
          <div className="border border-white/20 rounded-2xl p-4 text-center sticky top-5">
            <UserIcon className="bg-tonehunt-gray-light h-[110px] w-[110px] m-auto mb-4 rounded-full p-4" />
            <h4 className="text-xl leading-[27px] opacity-50 mb-8">{data.model.profile.username}</h4>

            <div className="flex items-center gap-4">
              {data.user && data.model.profile.id !== data.user.id ? (
                <div className="flex-1">
                  <FollowButton
                    isFollowing={
                      !!data.profileWithFollows?.following.find(
                        (following) => following.targetId === data.model.profile?.id
                      )
                    }
                    showUsername={false}
                    profileId={data.model.profile.id}
                    profileUsername={data.model.profile.username ?? ""}
                    className="block w-full hover:bg-tonehunt-gray-light text-sm text-white/70 py-3 px-5 bg-tonehunt-gray-medium active:bg-tonehunt-gray-light rounded-xl "
                    formClassName="block"
                  />
                </div>
              ) : null}

              <div className="flex-1">
                <Link
                  to={`/${data.model.profile.username}`}
                  prefetch="intent"
                  className="block hover:bg-tonehunt-gray-light text-sm text-white/70 py-3 px-5 bg-tonehunt-gray-medium rounded-xl font-satoshi-bold"
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
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

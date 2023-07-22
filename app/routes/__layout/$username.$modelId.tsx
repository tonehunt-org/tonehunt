import * as timeago from "timeago.js";
import FavoriteButton from "~/components/FavoriteButton";
import DownloadButton from "~/components/DownloadButton";
import ShareButton from "~/components/ShareButton";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
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
import { formatYoutubeLink } from "~/utils/link";
import NotFound from "~/components/NotFound";
import Avatar from "~/components/Avatar";
import { twMerge } from "tailwind-merge";
import { categoryColor } from "~/utils/categories";

export const meta: MetaFunction<LoaderData> = ({ data, location, parentsData }) => {
  if (!data?.model) {
    // TODO: should throw error to trigger not found page
    return {
      title: "Not Found",
    };
  }

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
  const { session, supabase } = await getSession(request);

  const modelReq = db.model.findFirst({
    where: {
      id: params.modelId as string,
      deleted: false,
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

  if (model.profile && model.profile.avatar && model.profile.avatar !== "") {
    const { data } = supabase.storage.from("avatars").getPublicUrl(model.profile.avatar);
    model.profile.avatar = data.publicUrl ?? null;
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
      <header className=" relative rounded-xl overflow-hidden px-3 border border-white/5 mb-10 pt-2">
        <div className="relative z-10 px-10 pt-10">
          <div className="pb-[20px] ">
            <div className="flex items-center justify-between flex-col md:flex-row">
              <figure className="flex-1 md:flex-grow">
                <div className="inline-block text-center">
                  <img
                    className=" w-20 h-20 lg:w-32 lg:h-32"
                    src={getCategoryProfile(data.model.category.slug, data.model.filecount ?? undefined).icon}
                    alt={data.model.category.title}
                  />
                  <figcaption
                    className={twMerge(
                      `leading-[19px] text-[14px] font-satoshi-bold uppercase text-tonehunt-green pb-5 pt-5`,
                      `text-tonehunt-${categoryColor(data.model.category.slug)}`
                    )}
                  >
                    {data.model.filecount && data.model.filecount > 1
                      ? `${data.model.filecount} ${data.model.category.pluralTitle}`
                      : data.model.category.title}
                  </figcaption>
                </div>
              </figure>

              <div className="flex gap-[12px] pb-[59px]">
                <FavoriteButton
                  count={data.model.favorites.length}
                  className="bg-tonehunt-gray-darker"
                  favorited={!!data.favorite && data.favorite?.deleted !== true}
                  modelId={data.model.id}
                  disabledReason={data.user ? undefined : "You must be logged in"}
                />

                <DownloadButton
                  count={data.model.downloads.length}
                  className="bg-tonehunt-gray-darker"
                  modelId={data.model.id}
                  modelName={data.model.title}
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
          </div>

          <h3 className="font-satoshi-bold text-2xl lg:text-[38px] leading-tight mb-5 text-center md:text-left">
            <span className="relative z-10 shadow-sm">{data.model.title}</span>
          </h3>

          <time
            dateTime={data.model.createdAt}
            className="block pb-10 opacity-60 text-sm leading-[19px] text-center md:text-left"
          >
            Uploaded {timeago.format(data.model.createdAt)}
          </time>

          <ButtonLink
            variant="link"
            to={`/${data.model.profile.username}`}
            className="inline-flex rounded-full items-center gap-5 mb-10 border-none hover:bg-tonehunt-gray-medium -translate-x-2 px-2 py-2"
          >
            <Avatar size={10} src={data.model.profile.avatar} border />
            <h3 className="font-satoshi-bold pr-2">{data.model.profile.username}</h3>
          </ButtonLink>
        </div>

        <div className="block absolute top-0 left-0 w-full h-full leading-[88%] bg-tonehunt-gray-darker font-satoshi-bold z-0 uppercase text-[80px] overflow-hidden break-all text-shadow-bg text-tonehunt-gray-darker select-none">
          <div style={{ width: "calc(100% + 30px)", transform: "translateX(-15px)" }}>{textForBG}</div>
        </div>
      </header>

      <div className="md:flex md:flex-row-reverse gap-[40px] max-w-[990px] m-auto px-4">
        <div className="flex-grow">
          <div className="pb-10">
            <h5 className="text-xs font-satoshi-bold uppercase text-white/40 pb-2">Make and model</h5>
            <h4 className=" font-satoshi-bold text-lg">{data.model.ampName}</h4>
          </div>

          <div className="pb-10">
            <h5 className="text-xs font-satoshi-bold uppercase text-white/40 pb-2">Description</h5>
            <p className="text-[18px] lg:text-[20px]  whitespace-pre-line">{data.model.description}</p>
          </div>

          {data.model.link ? (
            <div className="pb-10">
              <h5 className="text-xs font-satoshi-bold uppercase text-white/40 pb-2">Preview</h5>
              <iframe
                width="100%"
                height="400px"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                src={formatYoutubeLink(data.model.link)}
                title={`Demonstration for ${data.model.title}`}
              />
            </div>
          ) : null}

          {data.model.tags.length > 0 ? (
            <div>
              <h5 className="text-xs uppercase leading-4 opacity-40 font-satoshi-bold pb-4">Tags</h5>

              <ul className="m-0 p-0 pb-[44px] flex gap-1.5 flex-wrap ">
                {data.model.tags?.map((tag) => {
                  return (
                    <li key={tag}>
                      <ButtonLink
                        to={`/?tags=${tag}`}
                        prefetch="intent"
                        className="px-2 py-1 rounded-lg border border-white/20 inline-block font-satoshi-regular text-white/80"
                      >
                        #{tag}
                      </ButtonLink>
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

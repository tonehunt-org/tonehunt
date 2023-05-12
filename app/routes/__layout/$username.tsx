import { db } from "~/utils/db.server";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getSession } from "~/auth.server";
import { UserIcon } from "@heroicons/react/24/outline";

import type { User } from "@supabase/supabase-js";
import type { Category, Profile } from "@prisma/client";
import { getModels } from "~/services/models";
import { MODELS_LIMIT } from "~/utils/constants";
import type { ProfileWithFollows } from "~/services/profile";
import { getProfileWithFollows } from "~/services/profile";
import FollowButton from "~/components/FollowButton";
import { getSortFilter } from "~/utils/loader";
import ButtonLink from "~/components/ui/ButtonLink";
import NotFound from "~/components/NotFound";
import { twMerge } from "tailwind-merge";
import { socialToIcon, socialLinks } from "~/utils/profile";
import { isValidUrl } from "~/utils/link";

export const meta: MetaFunction<ProfileLoaderData> = ({ data, location }) => {
  const d = data as ProfileLoaderData;

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

export type ProfileLoaderData = {
  user?: User | null | undefined;
  profile?: ProfileWithFollows | null | undefined;
  categories: Category[];
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

  const [sessionProfile, profile, { offset, sortDirection, page, categoryId, categories }] = await Promise.all([
    sessionProfileReq,
    getProfileWithFollows(params.username as string),
    getSortFilter(url),
  ]);

  if (profile && profile.avatar && profile?.avatar !== "") {
    const { data } = supabase.storage.from("avatars").getPublicUrl(profile.avatar);
    profile.avatar = data.publicUrl ?? null;
  }

  // Get public urls for avatars
  // @ts-ignore
  profile.followers = profile?.followers.map((f) => {
    if (!f.profile.avatar) {
      return f;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(f.profile.avatar);

    return {
      ...f,
      profile: {
        ...f.profile,
        avatar: data.publicUrl,
      },
    };
  });

  // Get public urls for avatars
  // @ts-ignore
  profile.following = profile?.following.map((f) => {
    if (!f.target.avatar) {
      return f;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(f.target.avatar);

    return {
      ...f,
      target: {
        ...f.target,
        avatar: data.publicUrl,
      },
    };
  });

  // GET MODELS
  const models = profile
    ? await getModels({ limit: MODELS_LIMIT, next: offset, profileId: profile.id, user, categoryId, sortDirection })
    : {
        data: [],
        total: 0,
      };

  return json<ProfileLoaderData>(
    {
      categories,
      user,
      profile,
      sessionProfile,
      modelList: {
        models: models.data,
        total: models.total,
        page,
      },
    },
    {
      status: !profile ? 404 : 200,
    }
  );
};

export default function UserProfilePage() {
  const data = useLoaderData<ProfileLoaderData>();

  if (data.profile === null) {
    return <NotFound>Not Found</NotFound>;
  }

  const arrayLength = Math.floor(5000 / (data.profile?.username?.length ?? 1 * 10));
  const textForBG = [...new Array(arrayLength)].map(() => data.profile?.username ?? "");
  const isAvatar = data.profile?.avatar && data.profile?.avatar !== "";

  const profileSocials =
    data.profile?.socials && typeof data.profile?.socials === "object" && Array.isArray(data.profile?.socials)
      ? data.profile.socials
      : [];
  const socials = profileSocials.map((social) => ({ ...social, link: `${socialLinks(social.social)}${social.link}` }));

  const renderActionButton = () => {
    if (data.user && data.profile?.username && data.profile?.id !== data.sessionProfile?.id) {
      return (
        <FollowButton
          profileId={data.profile.id}
          profileUsername={data.profile.username}
          isFollowing={!!data.sessionProfile?.following.find((following) => following.targetId === data.profile?.id)}
          variant="primary-alt"
        />
      );
    }

    if (data.user && data.sessionProfile?.id && data.profile?.id && data.profile?.id === data.sessionProfile?.id) {
      return (
        <ButtonLink variant="button-primary-alt" to="/account/profile">
          Edit Profile
        </ButtonLink>
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <div className="flex-1 relative">
          <div className="border border-white/5 rounded-xl rounded-b-none text-center block absolute top-0 left-0 w-full h-full leading-[88%] bg-tonehunt-gray-darker font-satoshi-bold -z-10 uppercase text-[80px] overflow-hidden break-all text-shadow-bg text-tonehunt-gray-darker">
            <div style={{ width: "calc(100% + 30px)", transform: "translateX(-15px)" }}>{textForBG}</div>
          </div>

          <div className="w-full px-3 py-10 xl:max-w-3xl xl:m-auto">
            <div className="flex flex-col z-1 px-10">
              <div className="flex-1 flex flex-col lg:flex-row items-center">
                <div className="flex justify-start flex-grow">
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

                {renderActionButton()}
              </div>

              <div className="flex-1 pt-5">
                <div className="flex justify-center lg:justify-start">
                  <h1 className="text-5xl font-satoshi-bold mb-10">{data.profile?.username}</h1>
                </div>

                {socials.length > 0 ? (
                  <ul className="list-none p-0 m-0 mb-10 flex items-center gap-5 text-white">
                    {socials
                      .sort((a, b) => {
                        // Website alreasy first
                        if (a.social === "website") {
                          return -1;
                        }

                        return 0;
                      })
                      .map((entry) => {
                        return isValidUrl(entry.link) ? (
                          <li className="w-6 h-6" key={entry.link}>
                            <a
                              href={entry.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="opacity-50 hover:opacity-90"
                            >
                              {socialToIcon(entry.social)}
                            </a>
                          </li>
                        ) : null;
                      })}
                  </ul>
                ) : null}

                {data.profile?.bio ? (
                  <div className="flex mb-6">
                    <div className="max-h-[280px] overflow-hidden text-xl font-satoshi-regular text-tonehunt-gray-lighter whitespace-pre-wrap">
                      {data.profile.bio}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <nav>
          <ul className="list-none p-0 m-0 flex">
            <ProfileTab
              count={data.modelList.total}
              title={data.modelList.total === 1 ? "Model" : "Models"}
              href={`/${data.profile?.username}`}
              end
            />
            <ProfileTab
              count={data.profile?.followers.length ?? 0}
              title={data.profile?.followers.length === 1 ? `Follower` : `Followers`}
              href={`/${data.profile?.username}/followers`}
            />
            <ProfileTab
              count={data.profile?.following.length ?? 0}
              title="Following"
              href={`/${data.profile?.username}/following`}
            />
          </ul>
        </nav>

        <div className="pb-10 pt-5">
          <Outlet context={{ ...data }} />
        </div>
      </div>
    </div>
  );
}

const ProfileTab = ({ count, title, href, end }: { count: number; title: string; href: string; end?: boolean }) => {
  return (
    <li className="flex-1">
      <NavLink
        preventScrollReset
        className={({ isActive }) => {
          return twMerge(
            "block py-5 text-center hover:bg-white/5 border-t border-white/0",
            isActive ? "border-tonehunt-purple border-t text-tonehunt-purple" : ""
          );
        }}
        to={href}
        end={end}
      >
        <strong className="font-satoshi-bold">{count}</strong> <span className="opacity-70">{title}</span>
      </NavLink>
    </li>
  );
};

import { Link, useOutletContext } from "@remix-run/react";
import type { ProfileLoaderData } from "../$username";
import Avatar from "~/components/Avatar";
import FollowButton from "~/components/FollowButton";
import EmptyFeed from "~/components/EmptyFeed";

export default function ProfileFollowersPage() {
  const data = useOutletContext<ProfileLoaderData>();

  const isOwnProfile = data.user && data.sessionProfile && data.profile && data.sessionProfile?.id === data.profile?.id;

  return data.profile?.followers.length !== 0 ? (
    <ul className="py-10 list-none p-0 m-0">
      {data.profile?.followers.map((user) => {
        return (
          <li
            key={user.profile.id}
            className={`transition ease-in-out flex-1 bg-tonehunt-gray-medium text-white mb-5 rounded-xl text-to p-5`}
          >
            <div className="flex items-center">
              <Link
                prefetch="intent"
                to={`/${user.profile.username}`}
                className="hover:underline flex items-center gap-5"
              >
                <Avatar padding={2} size={14} src={user.profile.avatar} title={user.profile.username} />
                <h5 className=" font-satoshi-bold text-lg">{user.profile.username}</h5>
              </Link>

              {data.user && user.profile.id !== data.user?.id ? (
                <div className="text-right flex-1">
                  <FollowButton
                    showUsername={false}
                    profileId={user.profile.id}
                    profileUsername={user.profile.username}
                    isFollowing={!!data.sessionProfile?.following.find((f) => f.targetId === user.profile?.id)}
                    formClassName="inline-block"
                  />
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  ) : (
    <div className="mt-10">
      <EmptyFeed
        headline={
          isOwnProfile ? (
            "You do not have any followers yet"
          ) : (
            <>
              <strong className="font-satoshi-bold">{data.profile.username}</strong> does not have any followers yet
            </>
          )
        }
      />
    </div>
  );
}

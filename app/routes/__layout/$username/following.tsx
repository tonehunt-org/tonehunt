import { Link, useOutletContext } from "@remix-run/react";
import type { ProfileLoaderData } from "../$username";
import Avatar from "~/components/Avatar";
import Button from "~/components/ui/Button";
import FollowButton from "~/components/FollowButton";

export default function ProfileFollowersPage() {
  const data = useOutletContext<ProfileLoaderData>();

  return (
    <ul className="py-10 list-none p-0 m-0">
      {data.profile?.following.map((user) => {
        return (
          <li
            key={user.target.id}
            className={`transition ease-in-out flex-1 bg-tonehunt-gray-medium text-white mb-5 rounded-xl text-to p-5`}
          >
            <div className="flex items-center">
              <Link
                prefetch="intent"
                to={`/${user.target.username}`}
                className="hover:underline flex items-center gap-5"
              >
                <Avatar padding={2} size={14} src={user.target.avatar} title={user.target.username} />
                <h5 className=" font-satoshi-bold text-lg">{user.target.username}</h5>
              </Link>

              {data.user ? (
                <div className="text-right flex-1">
                  <FollowButton
                    showUsername={false}
                    profileId={user.target.id}
                    profileUsername={user.target.username}
                    isFollowing={!!data.profile?.following.find((f) => f.targetId === user.target.id)}
                    formClassName="inline-block"
                  />
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

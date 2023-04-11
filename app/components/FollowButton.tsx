import { useFetcher } from "@remix-run/react";
import type { ButtonProps } from "./ui/Button";
import Button from "./ui/Button";

type FollowButtonProps = ButtonProps & {
  profileId: string;
  profileUsername: string;
  isFollowing?: boolean;
};

export default function FollowButton({
  profileId,
  profileUsername,
  isFollowing = false,
  ...buttonProps
}: FollowButtonProps) {
  const followFetcher = useFetcher();

  return isFollowing ? (
    <followFetcher.Form method="post" action={`/${profileUsername}/unfollow`}>
      <Button variant="primary-alt" className="mx-auto block" {...buttonProps}>
        + Unfollow {profileUsername}
      </Button>
    </followFetcher.Form>
  ) : (
    <followFetcher.Form method="post" action={`/${profileUsername}/follow`}>
      <Button variant="primary-alt" className="mx-auto block" {...buttonProps}>
        + Follow {profileUsername}
      </Button>
    </followFetcher.Form>
  );
}

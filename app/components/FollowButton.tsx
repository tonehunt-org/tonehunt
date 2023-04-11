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

  const loading = followFetcher.state === "submitting" || followFetcher.state === "loading";

  return isFollowing ? (
    <followFetcher.Form method="post" action={`/${profileUsername}/unfollow`}>
      <Button variant="primary-alt" className="mx-auto block " {...buttonProps} loading={loading}>
        Unfollow
      </Button>
    </followFetcher.Form>
  ) : (
    <followFetcher.Form method="post" action={`/${profileUsername}/follow`}>
      <Button variant="primary-alt" className="mx-auto block" {...buttonProps} loading={loading}>
        + Follow {profileUsername}
      </Button>
    </followFetcher.Form>
  );
}

import { useFetcher } from "@remix-run/react";
import type { ButtonProps } from "./ui/Button";
import Button from "./ui/Button";

type FollowButtonProps = ButtonProps & {
  profileId: string;
  profileUsername?: string | null;
  showUsername?: boolean;
  isFollowing?: boolean;
  formClassName?: string;
};

export default function FollowButton({
  profileId,
  profileUsername,
  showUsername = true,
  isFollowing = false,
  formClassName,
  ...buttonProps
}: FollowButtonProps) {
  const followFetcher = useFetcher();

  const loading = followFetcher.state === "submitting" || followFetcher.state === "loading";

  return isFollowing ? (
    <followFetcher.Form method="post" action={`/${profileUsername}/unfollow`} className={formClassName}>
      <Button variant="secondary" className="mx-auto block " {...buttonProps} loading={loading}>
        Unfollow
      </Button>
    </followFetcher.Form>
  ) : (
    <followFetcher.Form method="post" action={`/${profileUsername}/follow`} className={formClassName}>
      <Button variant="primary-alt" className="mx-auto block" {...buttonProps} loading={loading}>
        + Follow{showUsername ? ` ${profileUsername}` : ""}
      </Button>
    </followFetcher.Form>
  );
}

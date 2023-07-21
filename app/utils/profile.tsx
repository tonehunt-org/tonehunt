import { LinkIcon } from "@heroicons/react/24/solid";
import FacebookIcon from "~/components/icons/Facebook";
import GithubIcon from "~/components/icons/Github";
import InstagramIcon from "~/components/icons/Instagram";
import TwitterIcon from "~/components/icons/Twitter";
import YoutubeIcon from "~/components/icons/Youtube";
import type { Social } from "~/services/profile";

export const socialToIcon = (social: Social["social"]) => {
  switch (social) {
    case "facebook": {
      return <FacebookIcon />;
    }
    case "instagram": {
      return <InstagramIcon />;
    }
    case "twitter": {
      return <TwitterIcon />;
    }
    case "github": {
      return <GithubIcon />;
    }
    case "youtube": {
      return <YoutubeIcon />;
    }

    case "website": {
      return <LinkIcon />;
    }
  }
};

export const socialLinks = (social: Social["social"]) => {
  switch (social) {
    case "facebook": {
      return "https://www.facebook.com/";
    }
    case "instagram": {
      return "https://www.instagram.com/";
    }
    case "twitter": {
      return "https://www.twitter.com/";
    }
    case "github": {
      return "https://www.github.com/";
    }
    case "youtube": {
      return "https://www.youtube.com/";
    }
    default:
      return "";
  }
};

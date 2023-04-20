import Header from "~/components/Header";
import Footer from "~/components/Footer";
import type { User } from "@supabase/supabase-js";
import type { Counts, Profile } from "@prisma/client";
import type { PropsWithChildren } from "react";
import { Form, Link, NavLink } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import {
  StarIcon,
  QueueListIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UserIcon,
  HomeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import Button from "~/components/ui/Button";
import RelatedDropdown from "~/components/RelatedDropdown";
import { ModelListCountTitle } from "~/components/routes/ModelListPage";
import { ArticlesBlock } from "~/components/Sidebar";
import Asidebar from "~/components/Asidebar";
import MainNav from "~/components/MainNav";

interface DefaultLayoutType {
  user?: User | null | undefined;
  profile?: Profile | null | undefined;
  className?: string | null;
  counts: Counts[];
}

const nav1 = [
  {
    title: "Following",
    href: "/",
    icon: HomeIcon,
    requiresAuth: true,
  },
  {
    title: "Favorites",
    href: "/account/my-favorites",
    icon: StarIcon,
    requiresAuth: true,
  },
  {
    title: "My Models",
    href: "/account/my-models",
    requiresAuth: true,
    icon: QueueListIcon,
  },
];

const nav2 = [
  { title: "All Models", href: "/all", icon: GlobeAltIcon },
  { title: "Trending", href: "/trending", icon: ArrowTrendingUpIcon },
  { title: "Popular", href: "/popular", icon: ChartBarIcon },
];

const DefaultLayout = (props: PropsWithChildren<DefaultLayoutType>) => {
  const { user, profile } = props;

  return (
    <div className="">
      <Header user={user} profile={profile} />

      <div className="flex p-3 h-fit">
        <MainNav user={user} profile={profile} />

        <div className="w-full max-w-3xl mb-8 mt-8 lg:mb-16 lg:mt-5 xl:mb-16 px-3">{props.children}</div>

        <Asidebar counts={props.counts} />
      </div>

      <Footer />
    </div>
  );
};

export default DefaultLayout;

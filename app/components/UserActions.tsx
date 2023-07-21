import { Popover } from "@headlessui/react";
import { Form, Link, useLocation } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import Button from "./ui/Button";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import LoginForm from "./LoginForm";

type UserActionsProps = {
  user?: User | null | undefined;
  username?: string;
};

export default function UserActions({ user, username }: UserActionsProps) {
  const location = useLocation();

  return user ? (
    <></>
  ) : (
    <Popover className="hidden relative xl:block">
      <Popover.Button as={Button} variant="primary">
        Login or Sign Up
      </Popover.Button>
      <Popover.Panel className="absolute right-0  z-50 bg-zinc-900 border border-white/5 drop-shadow-xl rounded-xl p-5 w-72 shadow-lg">
        <LoginForm redirectTo={`${location.pathname}${location.search}`} />
      </Popover.Panel>
    </Popover>
  );
}

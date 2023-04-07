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
    <div className="flex gap-3 items-center px-5 py-3 -ml-5">
      <Popover className="relative">
        <Popover.Button className="flex items-center gap-2 focus:ring-transparent focus:outline-none font-satoshi-bold">
          {username} <ChevronDownIcon className="h-4 w-4 mt-1" />
        </Popover.Button>
        <Popover.Panel
          as="ul"
          className="list-none m-0 absolute right-0 mt-2 z-50 bg-zinc-900 border-2 border-white rounded-lg p-5 w-72 shadow-lg flex flex-col gap-3"
        >
          <li className="inline lg:hidden">
            <Link to="/models/new" prefetch="intent">
              New Model
            </Link>
          </li>
          <li>
            <Link to="/account/profile" prefetch="intent">
              Edit Profile
            </Link>
          </li>
          <li>
            <Link to="/account/change-password" prefetch="intent">
              Change Password
            </Link>
          </li>
          <li>
            <Form method="post" action="/logout">
              <Button variant="link">Logout</Button>
            </Form>
          </li>
        </Popover.Panel>
      </Popover>
    </div>
  ) : (
    <Popover className="relative">
      <Popover.Button as={Button} variant="primary">
        Login
      </Popover.Button>
      <Popover.Panel className="absolute right-0 mt-2 z-20 bg-zinc-800 border-2 border-white rounded-lg p-5 w-72 shadow-lg">
        <LoginForm redirectTo={`${location.pathname}${location.search}`} />
      </Popover.Panel>
    </Popover>
  );
}

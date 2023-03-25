import { Popover } from "@headlessui/react";
import { Form, Link, useLocation, useSearchParams } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

type UserActionsProps = {
  user?: User | null | undefined;
  username?: string;
};

export default function UserActions({ user, username }: UserActionsProps) {
  const location = useLocation();
  const [action, setAction] = useState<"login" | "sign-up">("login");
  const [searchParams, setSearchParams] = useSearchParams();

  const onUploadModalClick = () => {
    searchParams.set("create", "");
    setSearchParams(searchParams);
  };

  const loginForm = (
    <Form method="post" action={`/login?redirectTo=${location.pathname}`} className="flex flex-col gap-3">
      <Input name="email" label="Email" type="email" required />
      <Input name="password" label="Password" type="password" required />
      <Button type="submit" className="mt-3">
        Log in
      </Button>
      <div className="text-center flex items-center justify-center">
        <Link to="/sign-up" onClick={() => setAction("sign-up")}>
          Sign Up
        </Link>
      </div>
    </Form>
  );

  return user ? (
    <div className="flex gap-3 items-center px-5 py-3 -ml-5">
      <Popover className="relative">
        <Popover.Button className="flex items-center gap-2 focus:ring-transparent focus:outline-none font-satoshi-bold">
          {username} <ChevronDownIcon className="h-4 w-4 mt-1" />
        </Popover.Button>
        <Popover.Panel
          as="ul"
          className="list-none m-0 absolute right-0 mt-2 z-10 bg-zinc-900 border-2 border-white rounded-lg p-5 w-72 shadow-lg flex flex-col gap-3"
        >
          <li className="inline lg:hidden">
            <Button variant="link" onClick={onUploadModalClick}>
              Upload model
            </Button>
          </li>
          <li>
            <Link to="/change-password" prefetch="intent">
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
      <Popover.Panel className="absolute right-0 mt-2 z-10 bg-zinc-800 border-2 border-white rounded-lg p-5 w-72 shadow-lg">
        {loginForm}
      </Popover.Panel>
    </Popover>
  );
}

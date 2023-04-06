import { Link, useFetcher } from "@remix-run/react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Alert from "./ui/Alert";
import type { LoginActionData } from "~/routes/__layout/login";

type LoginFormProps = {
  redirectTo?: string;
  hideSignup?: boolean;
};

export default function LoginForm({ redirectTo = "/", hideSignup }: LoginFormProps) {
  const loginFetcher = useFetcher<LoginActionData>();

  return (
    <>
      <loginFetcher.Form method="post" action={`/login?redirectTo=${redirectTo}`} className="flex flex-col gap-3">
        {loginFetcher.data?.error ? (
          <div className="pb-5">
            <Alert variant="error" title={loginFetcher.data.error} />
          </div>
        ) : null}

        <Input autoComplete="email" name="email" label="Email" type="email" required />

        <div>
          <Input autoComplete="password" name="password" label="Password" type="password" required className="mb-1" />
          <div className="text-center mb-5">
            <Link to="/forgot-password" prefetch="intent" className="text-sm hover:underline ">
              Forgot Password
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="mt-2"
          loading={loginFetcher.state === "submitting" || loginFetcher.state === "loading"}
        >
          Log in
        </Button>
      </loginFetcher.Form>

      {hideSignup ? null : (
        <div className="text-center flex items-center justify-center pt-8 pb-5 gap-5">
          <span className="text-white/70">Don't have an account?</span>
          <Link to="/sign-up" prefetch="intent" className="hover:underline">
            Sign Up
          </Link>
        </div>
      )}
    </>
  );
}

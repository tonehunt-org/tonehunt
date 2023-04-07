import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { getSession } from "~/auth.server";
import LoginForm from "~/components/LoginForm";
import Alert from "~/components/ui/Alert";

export const meta: MetaFunction = ({ location }) => ({
  title: "Login | ToneHunt",
  description: "Login to ToneHunt and start uploading your models!",

  "og:title": "Login | ToneHunt",
  // "og:image": "http://euro-travel-example.com/thumbnail.jpg", // TODO
  "og:url": `${location.pathname}${location.search}`,
  // "twitter:card": "summary_large_image", // TODO

  // <!--  Non-Essential, But Recommended -->
  "og:description": "Login to ToneHunt and start uploading your models!",
  "twitter:image:alt": "Login to ToneHunt and start uploading your models!",
});

export type LoginActionData = {
  error?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await getSession(request);
  const url = new URL(request.url);

  if (session?.user) {
    return redirect(url.searchParams.get("redirectTo") ?? "/");
  }

  return json({});
};

export const action: ActionFunction = async ({ request, context }) => {
  const { supabase, response } = await getSession(request);

  const formData = await request.formData();
  const url = new URL(request.url);

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return json<LoginActionData>({ error: error.message });
  }

  return redirect(url.searchParams.get("redirectTo") ?? "/", { headers: response.headers });
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const isConfirmation = searchParams.get("confirmation") !== null;

  return (
    <div className="max-w-xl m-auto">
      {isConfirmation ? (
        <div className="pb-10">
          <Alert variant="success" title="Thanks for confirming your email." />
        </div>
      ) : null}

      <h2 className="text-3xl font-satoshi-medium pb-10">Login</h2>

      <LoginForm hideSignup={isConfirmation} />
    </div>
  );
}

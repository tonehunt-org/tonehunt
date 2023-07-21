import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Logo from "~/components/Logo";
import { db } from "~/utils/db.server";
import Alert from "~/components/ui/Alert";
import { Link } from "@remix-run/react";
import type { Counts } from "@prisma/client";
import { ModelListCountTitle } from "~/components/routes/ModelListPage";
import { isNotAllowed } from "~/utils/username";

export const meta: MetaFunction = ({ location }) => ({
  title: "Sign Up | ToneHunt",
  description: "Sign Up to ToneHunt and share your models with the world.",

  "og:title": "Sign Up | ToneHunt",
  // "og:image": `${location.}`
  "og:url": `${location.pathname}${location.search}`,
  // "twitter:card": "summary_large_image", // TODO

  // <!--  Non-Essential, But Recommended -->
  "og:description": "Sign Up to ToneHunt and share your models with the world.",
  "twitter:image:alt": "Sign Up to ToneHunt and share your models with the world.",
});

type ActionData = {
  error?: string;
  success?: boolean;
};

type LoaderData = {
  counts: Counts[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const counts = await db.counts.findMany();

  return json<LoaderData>({ counts });
};

const USERNAME_REGEX = /^\w(?:\w|[.-](?=\w)){3,31}$/;

export const action: ActionFunction = async ({ request, context }) => {
  const { supabase, response } = await getSession(request);
  const formData = await request.formData();

  const username = formData.get("username") as string | null;

  if (!username || !USERNAME_REGEX.test(username)) {
    return json<ActionData>({ error: "Invalid username" });
  }

  const usernameErrorMessage = "Username already exist. Please try a new one.";

  try {
    if (isNotAllowed(username)) {
      return json<ActionData>({ error: usernameErrorMessage }, { status: 500 });
    }

    const usernameFlag = await db.profile.findUnique({
      where: {
        username: username,
      },
    });

    if (usernameFlag) {
      return json<ActionData>({ error: usernameErrorMessage }, { status: 500 });
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      options: {
        emailRedirectTo: `${process.env.ORIGIN}/login?confirmation`,
      },
    });

    if (!data.user || error) {
      return json<ActionData>({ error: error?.message }, { status: 500 });
    }

    await db.profile.update({
      where: {
        id: data.user?.id,
      },
      data: { username },
    });
  } catch (error) {
    const errorGeneralMessage = "Unexpected error. Please try again.";
    return json<ActionData>({ error: errorGeneralMessage }, { status: 500 });
  }

  return json<ActionData>({ success: true }, { headers: response.headers });
};

export default function SignUpPage() {
  const actionData = useActionData<ActionData>();
  const data = useLoaderData<LoaderData>();
  const navigation = useNavigation();

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-screen p-4">
      {/* LEFT PANEL */}
      <div
        className="w-full lg:w-1/2 rounded-lg"
        style={{
          background: "radial-gradient(farthest-side at 20% 10%, red, #4000c7)",
        }}
      >
        {/* LOGO AREA */}
        <div className="flex items-center justify-center align-middle h-full">
          <div className=" bg-black/30 backdrop-blur-md w-4/5 p-10 m-10 lg:p-20 lg:m-0 rounded-lg">
            <h2 className="">
              <div className="mb-24">
                <Logo className="w-full" />
              </div>
              <ModelListCountTitle className="lg:text-4xl font-satoshi-regular lg:leading-[1.4]" counts={data.counts} />
            </h2>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 items-center flex-col justify-center relative lg:pl-4">
        <div className="flex items-center justify-center align-middle h-full">
          <div className="block">
            {!actionData?.success ? (
              <div className="max-w-lg pt-10">
                <div className="text-3xl font-satoshi-medium mt-5 ">
                  Register for an account to start sharing your models!
                </div>
              </div>
            ) : null}

            {actionData?.error ? (
              <div className="pt-10 w-full max-w-lg">
                <Alert title="There was an error" description={actionData?.error} variant="error" />
              </div>
            ) : null}

            {actionData?.success ? (
              <>
                <div className="text-lg">Thanks for signing up! Check your email for an to confirm your account.</div>
              </>
            ) : (
              <Form method="post" className="flex flex-col gap-3 max-w-xl pt-10">
                <Input
                  name="username"
                  autoComplete="username"
                  label="Username"
                  type="text"
                  required
                  pattern="^\w(?:\w|[.-](?=\w)){3,31}$"
                  invalidMessage="A valid username is required"
                />

                <Input
                  name="email"
                  autoComplete="email"
                  label="Email"
                  type="email"
                  required
                  invalidMessage="A valid email is required"
                />

                <Input name="password" autoComplete="password" type="password" label="Password" required />

                <div className="pt-5">
                  <Button type="submit" className="w-full" loading={navigation.state === "submitting"}>
                    Sign Up
                  </Button>

                  <div className="flex-grow pt-10 text-center">
                    <Link to="/login" className="hover:underline pl-3" prefetch="intent">
                      Already have an account? Login here.
                    </Link>
                  </div>
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Logo from "~/components/Logo";
import { db } from "~/utils/db.server";
import Alert from "~/components/ui/Alert";

type ActionData = {
  error?: string;
};

export const action: ActionFunction = async ({ request, context }) => {
  const { supabase, response } = await getSession(request);
  const formData = await request.formData();
  const url = new URL(request.url);

  const usernameParam = formData.get("username") as string;

  try {
    const usernameFlag = await db.profile.findUnique({
      where: {
        username: usernameParam,
      },
    });

    if (usernameFlag) {
      const usernameErrorMessage = "Username already exist. Please try a new one.";
      return json<ActionData>({ error: usernameErrorMessage }, { status: 500 });
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      options: {
        emailRedirectTo: "http://localhost:3000/confirm-email",
      },
    });

    if (!data.user || error) {
      return json<ActionData>({ error: error?.message }, { status: 500 });
    }

    await db.profile.update({
      where: {
        id: data.user?.id,
      },
      data: {
        username: usernameParam,
      },
    });
  } catch (error) {
    const errorGeneralMessage = "Unexpected error. Please try again.";
    return json<ActionData>({ error: errorGeneralMessage }, { status: 500 });
  }

  return redirect(url.searchParams.get("redirectTo") ?? "/", { headers: response.headers });
};

export default function SignUpPage() {
  const navigation = useNavigation();
  const actionData = useActionData<ActionData>();

  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow">
        <div
          className="flex-grow flex items-center justify-center rounded-lg m-3"
          style={{
            flexBasis: "50%",
            background: "radial-gradient(farthest-side at 20% 10%, red, #4000c7)",
          }}
        >
          <div className=" bg-white bg-opacity-30 w-4/5 p-20 rounded-lg">
            <h2 className="">
              <span className="">
                <Logo className="w-full" />
              </span>{" "}
              <div className="mt-8 text-6xl font-satoshi-bold text-black ">The tone is in the stack.</div>
              <div className="text-xl font-satoshi-regular mt-8">
                Find amps, pedals, and packs for
                <br />
                <a
                  href="https://github.com/sdatkinson/neural-amp-modeler"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Neural Amp Modeler.
                </a>
              </div>
            </h2>
          </div>
        </div>
        <div
          className="flex-grow  flex items-center flex-col justify-center relative"
          style={{ top: "-50px", flexBasis: "50%" }}
        >
          <div className="max-w-lg pt-10" style={{ width: "500px" }}>
            <div className="text-3xl font-satoshi-medium mt-5 text-center">
              Register for an account to start sharing you stack!
            </div>
          </div>

          {actionData?.error ? (
            <div className="pt-10 w-full max-w-lg">
              <Alert title="There was an error" description={actionData?.error} variant="error" />
            </div>
          ) : null}

          <Form method="post" className="flex flex-col gap-3 max-w-xl pt-10" style={{ width: "500px" }}>
            <Input name="email" label="Email" type="email" required />
            <Input name="username" label="Username" required />
            <Input name="password" type="password" label="Password" required />
            <div className="flex justify-start items-center gap-5">
              {/* <Link to="/login">Login</Link> */}
              <Button type="submit" className="mt-3 w-full" loading={isSubmitting}>
                Sign Up
              </Button>
            </div>
            <div className="text-center pt-12 text-tonehunt-gray-lighter">Already have an account? Login here.</div>
            <div className="text-center py-1 text-tonehunt-gray-lighter">Return to Homepage</div>
          </Form>
        </div>
      </div>
    </div>
  );
}

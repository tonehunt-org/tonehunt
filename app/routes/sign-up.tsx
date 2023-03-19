import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { Form, Link, useLocation } from "@remix-run/react";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Header from "~/components/Header";
import Logo from "~/components/Logo";

export const action: ActionFunction = async ({ request, context }) => {
  const { supabase, response } = await getSession(request);
  const formData = await request.formData();

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo: "/confirm-email",
    },
  });

  if (!data.user || error) {
    return new Response("Error creating user", { status: 500 });
  }

  await supabase.from("profiles").insert({
    id: data.user?.id,
    username: formData.get("username") as string,
  });

  // return redirect(url.searchParams.get("redirectTo") ?? "/", { headers: response.headers });
  return json({}, { headers: response.headers });
};

export default function SignUpPage() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-grow">
        <div
          className="flex-grow flex items-center justify-center rounded-lg m-3"
          style={{
            flexBasis: "40%",
            background: "radial-gradient(farthest-side at 20% 10%, red, blue)",
            // "radial-gradient(circle, rgba(64,0,199,1) 0%, rgba(145,180,232,1) 28%, rgba(99,79,213,1) 64%, rgba(148,187,233,1) 95%)",
          }}
        >
          <div className=" bg-white bg-opacity-30 w-4/5 p-20 rounded-lg">
            <h2 className="">
              <span className="">
                <Logo height="80" />
              </span>{" "}
              <div className="mt-8 text-6xl font-extrabold text-black ">The tone is in the stack.</div>
              <div className="text-2xl font-light mt-8">
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
          style={{ top: "-50px", flexBasis: "60%" }}
        >
          <div className="max-w-lg pt-10" style={{ width: "500px" }}>
            <div className="text-lg font-extralight mt-5">Register for an account to start sharing you stack!</div>
          </div>
          <Form
            method="post"
            action={`/sign-up?redirectTo=${location.pathname}${location.search}`}
            className="flex flex-col gap-3 max-w-xl pt-10"
            style={{ width: "500px" }}
          >
            <Input name="email" label="Email" type="email" required />
            <Input name="username" label="Username" required />
            <Input name="password" type="password" label="Password" required />
            <div className="flex justify-start items-center gap-5">
              {/* <Link to="/login">Login</Link> */}
              <Button type="submit" className="mt-3">
                Sign Up
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useParams } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import type { AuthError, Session, User } from "@supabase/supabase-js";

type ActionData = {
  error?: AuthError | null;
  data?: {
    user: User | null;
    session: Session | null;
  };
};

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const response = new Response();

  const supabase = createServerClient(context.SUPABASE_URL as string, context.SUPABASE_ANON_KEY as string, {
    request,
    response,
  });

  if (formData.get("sign-up")) {
    const { data, error } = await supabase.auth.signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      options: {
        data: {
          username: formData.get("username") as string,
        },
      },
    });

    if (error) {
      return json<ActionData>({ data, error });
    }

    return redirect("/", {
      headers: response.headers,
    });
  } else {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    return redirect("/", { headers: response.headers });
  }
};

export default function LoginPage() {
  const params = useParams();
  const actionData = useActionData<ActionData>();

  const loginForm = (
    <>
      <h2 className="text-2xl font-bold">Login</h2>
      <Form className="" method="post">
        <label className="block">
          email
          <input
            type="text"
            name="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Email"
            required
          />
        </label>
        <label className="block">
          email
          <input
            type="password"
            name="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Password"
            required
          />
        </label>

        <button type="submit" name="login">
          Login
        </button>
      </Form>

      <div>or</div>
      <Link to={`/login/signup`} prefetch="intent">
        Sign Up
      </Link>
    </>
  );

  const signupForm = (
    <>
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <Form method="post">
        <label className="block">
          Username
          <input
            name="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </label>
        <label className="block">
          Email
          <input
            name="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            type="email"
          />
        </label>
        <label className="block">
          Password
          <input
            name="password"
            type="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </label>
        <button
          type="submit"
          name="sign-up"
          value="true"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Sign Up
        </button>
        <div>or</div>
        <Link to={`/login`} prefetch="intent">
          Login
        </Link>
      </Form>
    </>
  );

  return (
    <>
      <div>
        {actionData?.error ? actionData.error.message : null}
        {actionData?.data ? actionData.data.user?.email : null}
      </div>
      {params.signup ? signupForm : loginForm}
    </>
  );
}

import type { ActionFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { getSession } from "~/auth.server";

export const action: ActionFunction = async ({ request, context }) => {
  const { supabase, response } = await getSession(request, context);
  const formData = await request.formData();
  const url = new URL(request.url);

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
  return (
    <div>
      Check your email for a confirmation link.{" "}
      <Link to="/" prefetch="intent">
        Back To Models
      </Link>
    </div>
  );
}

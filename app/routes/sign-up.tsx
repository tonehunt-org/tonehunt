import type { ActionFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { getSession } from "~/auth.server";

export const action: ActionFunction = async ({ request, context }) => {
  const { supabase, response } = await getSession(request, context);
  const formData = await request.formData();

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!data.user || error) {
    return new Response("Error creating user", { status: 500 });
  }

  await supabase.from("profiles").insert({
    id: data.user?.id,
    username: formData.get("username") as string,
  });

  return redirect("/", { headers: response.headers });
};

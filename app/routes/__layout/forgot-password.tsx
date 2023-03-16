import type { ActionFunction } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import { getSession } from "~/auth.server";
import Alert from "~/components/ui/Alert";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";

type ActionData = {
  error?: string;
  success?: boolean;
};

// TODO: make this work
export const action: ActionFunction = async ({ request, context }) => {
  const { supabase, session } = await getSession(request, context);
  const formData = await request.formData();

  if (!session?.user) {
    return redirect("/");
  }

  const email = formData.get("email") as string | null;

  if (!email) {
    return json<ActionData>({ error: "Missing email" });
  }

  // const { error } = await supabase.auth.resetPasswordForEmail(email, {
  //   redirectTo: 'https://example.com/update-password',
  // })

  // if (error) {
  //   return json<ActionData>({ error: "Error updating password" });
  // }
  // return json<ActionData>({ success: true });
};

export default function ForgotPasswordPage() {
  const actionData = useActionData<ActionData>();

  return (
    <Form method="post" className="max-w-3xl m-auto flex flex-col gap-3">
      {actionData?.success ? <Alert title="An email has been sent" /> : null}
      <h2 className="text-2xl font-bold pb-5">Forgot Password</h2>
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="Enter your acaccount email"
        required
      />
      <div className="pt-3">
        <Button type="submit">Reset Password</Button>
      </div>
    </Form>
  );
}

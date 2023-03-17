import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { getSession } from "~/auth.server";
import Alert from "~/components/ui/Alert";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";

type ActionData = {
  error?: string;
  success?: boolean;
};

export const action: ActionFunction = async ({ request, context }) => {
  const { supabase, session } = await getSession(request);
  const formData = await request.formData();

  if (!session?.user) {
    return redirect("/");
  }

  const newPassword = formData.get("new-password") as string | null;

  if (!newPassword) {
    return json<ActionData>({ error: "Missing new password" });
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return json<ActionData>({ error: "Error updating password" });
  }

  return json<ActionData>({ success: true });
};

export default function ChangePasswordPage() {
  const actionData = useActionData<ActionData>();

  return (
    <Form method="post" className="max-w-3xl m-auto flex flex-col gap-3">
      {actionData?.success ? <Alert title="Password changed" /> : null}
      <h2 className="text-2xl font-bold pb-5">Change Password</h2>
      <Input label="New Password" type="password" name="new-password" required />
      <div className="pt-3">
        <Button type="submit">Change Password</Button>
      </div>
    </Form>
  );
}

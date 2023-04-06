import { useEffect, useRef, useState } from "react";
import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
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
  const confirmPassowrd = formData.get("confirm-password") as string | null;

  if (newPassword !== confirmPassowrd) {
    return json<ActionData>({ error: "Passwords do not match" });
  }

  if (!newPassword) {
    return json<ActionData>({ error: "Missing new password" });
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return json<ActionData>({ error: `Error updating password > ${error}` });
  }

  return json<ActionData>({ success: true });
};

export default function ChangePasswordPage() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const [formValidity, setFormValidity] = useState(false);

  const handleFormChange = (e: any) => {
    setFormValidity(e.currentTarget.checkValidity());
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <h1 className="w-full text-center text-2xl lg:text-3xl font-satoshi-bold mb-10">Change Password</h1>
      </div>
      {actionData?.success ? (
        <div className="flex justify-center">
          <div className="w-full">
            <Alert title="Password changed successfully." variant="success" />
          </div>
        </div>
      ) : null}

      {actionData?.error ? (
        <div className="flex justify-center">
          <div className="w-full">
            <Alert title="There was an error" description={actionData?.error} variant="error" />
          </div>
        </div>
      ) : null}

      <div className="flex flex-col mt-5">
        <div className="flex-1">
          <Form method="post" onChange={handleFormChange}>
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-10">
              <div className="w-full">
                <div className="flex flex-col gap-3">
                  <div>
                    <Input label="New Password" autoComplete="password" type="password" name="new-password" required />

                    <Input
                      label="Confirm Password"
                      autoComplete="password"
                      type="password"
                      name="confirm-password"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-5">
              <Button disabled={!formValidity} type="submit" className="" loading={navigation.state === "submitting"}>
                Change Password
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

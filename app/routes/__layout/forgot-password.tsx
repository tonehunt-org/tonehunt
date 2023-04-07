import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { getSession } from "~/auth.server";
import Alert from "~/components/ui/Alert";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";

export const meta: MetaFunction = () => {
  return {
    title: `Forgot Password | ToneHunt`,
  };
};

type ActionData = {
  error?: string;
  success?: boolean;
};

export const action: ActionFunction = async ({ request, context }) => {
  const { supabase } = await getSession(request);
  const formData = await request.formData();
  const url = new URL(request.url);

  const email = formData.get("email") as string | null;

  if (!email) {
    return json<ActionData>({ error: "Missing email" });
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.ORIGIN}/auth/hash-signin`,
  });

  if (error) {
    return json<ActionData>({ error: error.message });
  }

  return json<ActionData>({ success: true });
};

export default function ForgotPasswordPage() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();

  return (
    <Form method="post" className="max-w-3xl m-auto flex flex-col gap-3">
      {actionData?.success ? (
        <Alert title="An email has been sent with instructions on how to reset your password" variant="success" />
      ) : null}

      {actionData?.error ? <Alert title={actionData.error} variant="error" /> : null}

      <h2 className="text-2xl font-bold pb-5">Forgot Password</h2>
      <Input label="Email" type="email" name="email" placeholder="Enter your account email" required />

      <div className="text-right">
        <Button type="submit" className="mt-2" loading={navigation.state === "submitting"}>
          Reset Password
        </Button>
      </div>
    </Form>
  );
}

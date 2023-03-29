import { useState } from "react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useNavigate, useActionData } from "@remix-run/react";
import { getSession } from "~/auth.server";
import Alert from "~/components/ui/Alert";
import { db } from "~/utils/db.server";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

type LoaderData = {
  profile: any;
  user: any;
};

type ActionData = {
  error?: string;
  success?: boolean;
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { session } = await getSession(request);
  const user = session?.user;

  const profile = await db.profile.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!profile || profile.id !== user?.id) {
    return redirect("/");
  }

  return json<LoaderData>({ profile, user });
};

export const action: ActionFunction = async ({ request, context }) => {
  const { session } = await getSession(request);
  const formData = await request.formData();

  const profileId = formData.get("id") as string;
  const user = session?.user;

  if (user?.id === profileId) {
    try {
      const params = {
        firstname: formData.get("firstname") as string,
        lastname: formData.get("lastname") as string,
        bio: formData.get("bio") as string,
      };

      await db.profile.update({
        where: {
          id: profileId,
        },
        data: params,
      });
    } catch (error) {
      return json<ActionData>({ error: "Error updating profile. Please try again." }, { status: 500 });
    }
  }
  return json<ActionData>({ success: true });
};

export default function ProfileInformationPage() {
  const data = useLoaderData<LoaderData>();
  const { profile, user } = data;

  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();

  const [formValidity, setFormValidity] = useState(false);

  const handleFormChange = (e: any) => {
    setFormValidity(e.currentTarget.checkValidity());
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <h1 className="w-full text-center text-2xl lg:text-3xl font-satoshi-bold mb-10">Edit Profile</h1>
      </div>

      {actionData?.success ? (
        <div className="flex justify-center">
          <div className="w-full ">
            <Alert title="Profile updated successfully." variant="success" />
          </div>
        </div>
      ) : null}

      {actionData?.error ? (
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
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
                    <Input name="username" label="Username" defaultValue={profile.username} disabled />
                  </div>
                  <div>
                    <Input name="email" label="Email" defaultValue={user.email} disabled />
                  </div>
                  <div>
                    <Input name="firstname" label="Firstname" defaultValue={profile.firstname} />
                  </div>
                  <div>
                    <Input name="lastname" label="Lastname" defaultValue={profile.lastname} />
                  </div>
                  <div>
                    <Input name="bio" label="Bio" style={{ height: "168px" }} multiline defaultValue={profile.bio} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex">
              <Input name="id" type="hidden" defaultValue={profile.id} />
            </div>

            <div className="flex justify-end pt-5">
              <Button disabled={!formValidity} type="submit" className="">
                Update Profile
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

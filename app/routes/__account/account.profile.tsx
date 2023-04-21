import { useState } from "react";
import type { Prisma } from "@prisma/client";
import type { LoaderFunction, ActionFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import { getSession } from "~/auth.server";
import Alert from "~/components/ui/Alert";
import { db } from "~/utils/db.server";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import AvatarButton from "~/components/AvatarButton";
import { find } from "lodash";

export const meta: MetaFunction<LoaderData> = ({ data }) => {
  return {
    title: `Edit Profile | ToneHunt`,
    description: `Edit my profile.`,
  };
};

type LoaderData = {
  profile: any;
  user: any;
};

type ActionData = {
  error?: string;
  success?: boolean;
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { session, supabase } = await getSession(request);
  const user = session?.user;

  if (!session) {
    return redirect("/login?redirectTo=/account/profile");
  }

  const profile = await db.profile.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!profile || profile.id !== user?.id) {
    return redirect("/");
  }

  // GET AVATAR PUBLIC URL
  if (profile.avatar && profile?.avatar !== "") {
    const { data } = supabase.storage.from("avatars").getPublicUrl(profile.avatar);
    profile.avatar = data.publicUrl ?? null;
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
      const facebookLink = formData.get("facebook") as string;
      const twitterLink = formData.get("twitter") as string;
      const instagramLink = formData.get("instagram") as string;
      const youtubeLink = formData.get("youtube") as string;
      const githubLink = formData.get("github") as string;
      const websiteLink = formData.get("website") as string;

      const socials = [] as Prisma.JsonArray;
      if (facebookLink && facebookLink !== "") {
        socials.push({ social: "facebook", link: facebookLink });
      }

      if (twitterLink && twitterLink !== "") {
        socials.push({ social: "twitter", link: twitterLink });
      }

      if (instagramLink && instagramLink !== "") {
        socials.push({ social: "instagram", link: instagramLink });
      }

      if (youtubeLink && youtubeLink !== "") {
        socials.push({ social: "youtube", link: youtubeLink });
      }

      if (githubLink && githubLink !== "") {
        socials.push({ social: "github", link: githubLink });
      }

      if (websiteLink && websiteLink !== "") {
        socials.push({ social: "website", link: websiteLink });
      }

      const params = {
        firstname: formData.get("firstname") as string,
        lastname: formData.get("lastname") as string,
        bio: formData.get("bio") as string,
        socials,
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
  const navigation = useNavigation();

  const [formValidity, setFormValidity] = useState(false);

  const handleFormChange = (e: any) => {
    setFormValidity(e.currentTarget.checkValidity());
  };

  const socials =
    profile?.socials && typeof profile?.socials === "object" && Array.isArray(profile?.socials) ? profile.socials : [];

  const defaultFacebook = find(socials, { social: "facebook" });
  const defaultTwitter = find(socials, { social: "twitter" });
  const defaultInstagram = find(socials, { social: "instagram" });
  const defaultYouTube = find(socials, { social: "youtube" });
  const defaultGithub = find(socials, { social: "github" });
  const defaultWebsite = find(socials, { social: "website" });

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

      <div className="flex flex-col mt-5 justify-center relative">
        <AvatarButton profile={profile} />
      </div>

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
                  <div>
                    <Input
                      name="facebook"
                      label="Facebook URL"
                      defaultValue={defaultFacebook ? defaultFacebook.link : ""}
                    />
                  </div>
                  <div>
                    <Input
                      name="twitter"
                      label="Twitter URL"
                      defaultValue={defaultTwitter ? defaultTwitter.link : ""}
                    />
                  </div>
                  <div>
                    <Input
                      name="instagram"
                      label="Instagram URL"
                      defaultValue={defaultInstagram ? defaultInstagram.link : ""}
                    />
                  </div>
                  <div>
                    <Input
                      name="youtube"
                      label="YouTube URL"
                      defaultValue={defaultYouTube ? defaultYouTube.link : ""}
                    />
                  </div>
                  <div>
                    <Input name="github" label="Github URL" defaultValue={defaultGithub ? defaultGithub.link : ""} />
                  </div>
                  <div>
                    <Input
                      name="website"
                      label="Website URL"
                      defaultValue={defaultWebsite ? defaultWebsite.link : ""}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex">
              <Input name="id" type="hidden" defaultValue={profile.id} />
            </div>
            <div className="flex justify-end pt-5">
              <Button
                disabled={!formValidity}
                loading={navigation.state === "submitting"}
                type="submit"
                className=""
                onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
              >
                Update Profile
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

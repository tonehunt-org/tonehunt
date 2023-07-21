import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { getSession } from "~/auth.server";
import { db } from "~/utils/db.server";
import type { Counts, Profile } from "@prisma/client";
import DefaultLayout from "~/layouts/DefaultLayout";

type LoaderData = {
  user?: User | null | undefined;
  profile?: Profile | null | undefined;
  counts: Counts[];
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session, supabase } = await getSession(request);

  const profileReq = db.profile.findFirst({ where: { id: session?.user.id } });
  const countsReq = db.counts.findMany();

  const [profile, counts] = await Promise.all([profileReq, countsReq]);

  // GET AVATAR PUBLIC URL
  if (profile && profile.avatar && profile?.avatar !== "") {
    const { data } = supabase.storage.from("avatars").getPublicUrl(profile.avatar);
    profile.avatar = data.publicUrl ?? null;
  }

  return json<LoaderData>({
    user: session?.user,
    profile,
    counts,
  });
};

export default function Layout() {
  const data = useLoaderData<LoaderData>();

  return (
    <DefaultLayout user={data.user} profile={data.profile} counts={data.counts}>
      <Outlet />
    </DefaultLayout>
  );
}

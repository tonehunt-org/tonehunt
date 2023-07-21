import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
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
  const { session, response, supabase } = await getSession(request);
  const user = session?.user;
  const url = new URL(request.url);

  if (!user) {
    return redirect(`/login?redirectTo=${url.pathname}${url.search}`, { headers: response.headers });
  }

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
    <DefaultLayout hideAsidebar user={data.user} profile={data.profile} counts={data.counts}>
      <Outlet />
    </DefaultLayout>
  );
}

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { getSession } from "~/auth.server";
import { db } from "~/utils/db.server";
import type { Profile } from "@prisma/client";
import DefaultLayout from "~/layouts/DefaultLayout";

type LoaderData = {
  user?: User | null | undefined;
  profile?: Profile | null | undefined;
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session } = await getSession(request);

  const profile = await db.profile.findFirst({ where: { id: session?.user.id } });

  return json<LoaderData>({
    user: session?.user,
    profile,
  });
};

export default function Layout() {
  const data = useLoaderData<LoaderData>();

  return (
    <DefaultLayout user={data.user} profile={data.profile}>
      <Outlet />
    </DefaultLayout>
  );
}

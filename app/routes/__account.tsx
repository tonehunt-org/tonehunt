import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { getSession } from "~/auth.server";
import { db } from "~/utils/db.server";
import type { Category, Tag } from "@prisma/client";
import type { Profile } from "@prisma/client";
import DefaultLayout from "~/layouts/DefaultLayout";
import { getSampleTags } from "~/services/tags";

type LoaderData = {
  user?: User | null | undefined;
  profile?: Profile | null | undefined;
  categories: Category[];
  tags: Tag[];
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session, response } = await getSession(request);
  const user = session?.user;

  if (!user) {
    return redirect("/", { headers: response.headers });
  }

  const profileReq = db.profile.findFirst({ where: { id: session?.user.id } });
  const categoriesReq = db.category.findMany({ where: { NOT: { title: "IR" } } }); // Ignoring IRs for now

  // FOR NOW WE'LL BE USING THIS TAGS UNTIL WE HAVE ENOUGH DATA
  const tags = getSampleTags();

  const [profile, categories] = await Promise.all([profileReq, categoriesReq]);

  return json<LoaderData>({
    user: session?.user,
    categories,
    profile,
    tags,
  });
};

export default function Layout() {
  const data = useLoaderData<LoaderData>();

  return (
    <DefaultLayout user={data.user} profile={data.profile} categories={data.categories} tags={data.tags}>
      <Outlet />
    </DefaultLayout>
  );
}

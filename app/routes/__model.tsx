import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { getSession } from "~/auth.server";
import { db } from "~/utils/db.server";
import type { Category } from "@prisma/client";
import ProfileLayout from "~/layouts/ProfileLayout";
import useProfile from "~/hooks/useProfile";
import type { Tag } from "~/services/tags";
import { getTags } from "~/services/tags";

type LoaderData = {
  user?: User | null | undefined;
  categories: Category[];
  tags: Tag[];
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session } = await getSession(request);

  const categoriesReq = db.category.findMany({ where: { NOT: { title: "IR" } } }); // Ignoring IRs for now
  const tagsReq = getTags();

  const [categories, tags] = await Promise.all([categoriesReq, tagsReq]);

  return json<LoaderData>({
    user: session?.user,
    tags,
    categories,
  });
};

export default function Layout() {
  const data = useLoaderData<LoaderData>();
  const profile = useProfile();

  return (
    <ProfileLayout user={data.user} profile={profile}>
      <Outlet />
    </ProfileLayout>
  );
}

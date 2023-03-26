import { getSession } from "~/auth.server";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { User } from "@supabase/supabase-js";

export type LoaderData = {
  user?: User | null;
};

export const modelListLoader: LoaderFunction = async ({ request }) => {
  const { session, response } = await getSession(request);
  const user = session?.user;

  if (!user) {
    return redirect("/", { headers: response.headers });
  }

  return json<LoaderData>({
    user,
  });
};

const MyModelsPage = () => {
  const data = useLoaderData();
  return (
    <div className="w-full">
      <div className="flex">
        <h1 className="w-full text-center text-2xl lg:text-3xl font-satoshi-bold mb-10">My Models</h1>
      </div>
      <div className="flex">
        <div className="w-full">TABLE HERE</div>
        <div className="w-full">{data.user?.username}</div>
      </div>
    </div>
  );
};

export default MyModelsPage;

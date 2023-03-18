import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { getSession } from "~/auth.server";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

type LoaderData = {
	user?: User;
	username?: string | null;
};

export const loader: LoaderFunction = async ({ request, context }) => {
	const { session, supabase } = await getSession(request);

	const { data } = await supabase.from("profiles").select().eq("id", session?.user.id).limit(1).single();

	return json<LoaderData>({
		user: session?.user,
		username: data?.username,
	});
};

export default function Layout() {
	const data = useLoaderData<LoaderData>();

	return (
		<div>
			<Header user={data.user} profile={null} />
			<div className="flex-1 p-5">
				<Outlet />
			</div>
			<Footer />
		</div>
	);
}

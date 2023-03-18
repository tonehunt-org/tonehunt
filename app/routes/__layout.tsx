import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { getSession } from "~/auth.server";
import Logo from "~/components/Logo";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import UserActions from "~/components/UserActions";

import Header from "~/components/Header";

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
	const navigate = useNavigate();

	return (
		<div>
			<Header />
			{/* <div className="flex px-5 py-5 items-center border-b border-gray-700">
				<Link to="/" prefetch="intent">
					<h1 className="text-3xl absolute" style={{ left: "110%", top: "110%" }}>
						Tonestack
					</h1>
					<Logo />
				</Link>

				{data.user ? (
					<div className="pl-5">
						<Button variant="secondary" onClick={() => navigate("/models/new")}>
							Upload
						</Button>
					</div>
				) : null}

				<Form method="get" action="/" className="flex-grow text-center px-10">
					<Input
						name="search"
						placeholder="Enter Search ..."
						className="inline-block mr-3"
						style={{ maxWidth: "420px" }}
					/>
					<Button type="submit">Search</Button>
				</Form>
				<div>
					<UserActions user={data.user} username={data?.username ?? undefined} />
				</div>
			</div> */}

			<div className="p-5">
				<Outlet />
			</div>
		</div>
	);
}

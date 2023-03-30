import type { Profile } from "@prisma/client";
import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { Provider } from "jotai";
import { getSession } from "./auth.server";
import { getProfile } from "./services/profile";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "ToneHunt - Find amps, pedals, and packs for Neural Amp Modeler.",
  viewport: "width=device-width,initial-scale=1",
});

export type RootLoaderData = {
  profile?: Profile;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await getSession(request);

  if (!session) {
    return json<RootLoaderData>({});
  }

  const profile = await getProfile(session);

  if (!profile) {
    return json<RootLoaderData>({});
  }

  return json<RootLoaderData>({ profile });
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-[#141414] text-white min-h-screen">
        <Provider>
          <div className="absolute w-full top-0 left-0">
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </div>
        </Provider>
      </body>
    </html>
  );
}

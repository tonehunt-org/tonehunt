import { Analytics } from "@vercel/analytics/react";
import type { Profile } from "@prisma/client";
import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { Provider } from "jotai";
import { getSession } from "./auth.server";
import { getProfile } from "./services/profile";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "shortcut icon",
    href: "/icons/favicon.png",
  },
  { rel: "icon", sizes: "192x192", href: "/icons/app-icon.png" },
  { rel: "apple-touch-icon", href: "icons/apple-icon.png" },
];

export const meta: MetaFunction = ({ data }) => ({
  charset: "utf-8",
  description: "ToneHunt - Find amps, pedals, and other models for Neural Amp Modeler.",
  viewport: "width=device-width, initial-scale=1, user-scalable=no",
  keywords:
    "ToneHunt, Neural Amp Modeler, NAM, models, guitar, ToneX, guitar tone, plugin, peavey, mesa, dumble, fender, vox, high gain, low gain, tone",

  "og:site_name": "ToneHunt",
  "og:type": "article",
  "og:image": `${data.ENV.ORIGIN}/social_banner.jpg`,
  "og:image:secure_url": `${data.ENV.ORIGIN}/social_banner.jpg`,

  "msapplication-square310x310logo": "/icons/ms-icon.png",
});

export type RootLoaderData = {
  profile?: Profile;
  ENV: {
    ORIGIN: string;
    RECAPTCHA_SITE_KEY: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await getSession(request);

  const ENV = {
    ORIGIN: process.env.ORIGIN as string,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY as string,
  };

  if (!session) {
    return json<RootLoaderData>({ ENV });
  }

  const profile = await getProfile(session);

  if (!profile) {
    return json<RootLoaderData>({ ENV });
  }

  return json<RootLoaderData>({
    profile,
    ENV,
  });
};

export default function App() {
  const data = useLoaderData<RootLoaderData>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-[#141414] text-white min-h-screen">
        <GoogleReCaptchaProvider
          reCaptchaKey={data.ENV.RECAPTCHA_SITE_KEY}
          scriptProps={{
            async: false,
            defer: true,
            appendTo: "head",
            nonce: undefined,
          }}
        >
          <Provider>
            <div className="absolute w-full top-0 left-0">
              <Outlet />
              <ScrollRestoration />

              <Analytics />

              <script
                dangerouslySetInnerHTML={{
                  __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
                }}
              />

              <Scripts />
              <LiveReload />
            </div>
          </Provider>
        </GoogleReCaptchaProvider>
      </body>
    </html>
  );
}

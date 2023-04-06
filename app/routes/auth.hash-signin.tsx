import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLocation, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { setSession } from "~/auth.server";
import Loading from "~/components/ui/Loading";

/*
  This whole route exists because Supabase redirects to a URL with all the data in a hash fragment
  in the url and not search params. This is an issue because the application expects all interaction with
  Supbase to be server side only.
*/

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const accessToken = url.searchParams.get("access_token") as string | null;
  const refreshToken = url.searchParams.get("refresh_token") as string | null;

  if (!accessToken || !refreshToken) {
    return new Response();
  }

  const { response } = await setSession(request, accessToken, refreshToken);

  return redirect("/account/change-password", { headers: response.headers });
};

export default function HashSignInPage() {
  const location = useLocation();
  const searchParams = location.hash.slice(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Read data from url hash and redirect to this route's loader for signing the user in
    if (searchParams) {
      const url = `${location.pathname}?${searchParams}`;
      navigate(url);
    }
  }, [searchParams]);

  return (
    <div className="p-10 flex items-center gap-5">
      <span>Signing In</span> <Loading />
    </div>
  );
}

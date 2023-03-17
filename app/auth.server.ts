import { createServerClient } from "@supabase/auth-helpers-remix";
import type { Database } from "./types/supabase";

export const getSession = async (request: Request) => {
  const response = new Response();

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string,
    { request, response }
  );

  const session = await supabase.auth.getSession();

  return { session: session?.data.session, response, supabase };
};

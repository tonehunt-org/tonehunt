import { createServerClient } from "@supabase/auth-helpers-remix";
import type { Database } from "./types/supabase";

export const getSession = async (request: Request, context: any) => {
  const response = new Response();

  const supabase = createServerClient<Database>(
    context.SUPABASE_URL as string,
    context.SUPABASE_ANON_KEY as string,
    { request, response }
  );

  const session = await supabase.auth.getSession();

  return { session: session?.data.session, response, supabase };
};

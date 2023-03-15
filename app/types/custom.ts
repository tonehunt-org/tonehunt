import type { Database } from "./supabase";

export type Model = Database["public"]["Tables"]["models"]["Row"];

import type { Database } from "./supabase";

export type Model = Database["public"]["Tables"]["models"]["Row"];

export type SortDirection = "asc" | "desc";

export type WithTimestampsAsString<T> = Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

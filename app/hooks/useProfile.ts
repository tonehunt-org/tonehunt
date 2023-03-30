import type { Profile } from "@prisma/client";
import { useMatches } from "@remix-run/react";

export default function useProfile() {
  const matches = useMatches();

  const root = matches.find((match) => match.id === "root");

  return root?.data.profile as Profile | undefined;
}

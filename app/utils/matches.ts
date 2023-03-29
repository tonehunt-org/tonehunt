import type { RouteMatch } from "@remix-run/react";
import type { RootLoaderData } from "~/root";

export const getRootProfile = (matches: RouteMatch[]) => {
  return (matches.find((match) => match.id === "root")?.data as RootLoaderData).profile;
};

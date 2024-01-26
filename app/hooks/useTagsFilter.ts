import { useSearchParams } from "@remix-run/react";

export default function useTagsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const setTagsFilter = (tags: string[]) => {
    if (tags.length === 0 && searchParams.has("tags")) {
      searchParams.delete("tags");
    } else {
      // filter out duplicate tags
      searchParams.set("tags", Array.from(new Set(tags)).join(","));
    }
    searchParams.delete("page")
    setSearchParams(searchParams);
  };
  const tagsFilter = searchParams.get("tags")?.split(",") ?? [];

  return [tagsFilter, setTagsFilter] as const;
}

import { getCategories } from "~/services/categories";
import { MODELS_LIMIT } from "./constants";
import { find } from "lodash";
import { SortDirection } from "~/types/custom";

export const getSortFilter = async (url: URL) => {
  // GET PAGE
  let page = +(url.searchParams.get("page") ?? "0");
  const offset = page * MODELS_LIMIT;

  // GET SORT DIRECTION
  const sortDirection: SortDirection = url.searchParams.get("sortDirection") === "asc" ? "asc" : "desc";

  // GET FILTER
  const filter = url.searchParams.get("filter") ?? "all";

  const categories = await getCategories();
  const selectedCategory = find(categories, ["slug", filter]);
  const categoryId = selectedCategory?.id ?? null;
  const tags = url.searchParams.get("tags")?.split(",") ?? [];

  return { offset, sortDirection, filter, page, categoryId, categories, tags };
};

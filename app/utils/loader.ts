import { getCategories } from "~/services/categories";
import { MODELS_LIMIT } from "./constants";
import { find } from "lodash";

export const getSortFilter = async (url: URL) => {
  // GET PAGE
  let page = +(url.searchParams.get("page") ?? "0");
  const offset = page * MODELS_LIMIT;

  // GET SORT DIRECTION
  const sortDirectionParam = url.searchParams.get("sortDirection") ?? "desc";
  const sortDirection = sortDirectionParam === "asc" || sortDirectionParam === "desc" ? sortDirectionParam : "desc";

  // GET FILTER
  const filter = url.searchParams.get("filter") ?? "all";

  const categories = await getCategories();
  const selectedCategory = find(categories, ["slug", filter]);
  const categoryId = selectedCategory?.id ?? null;

  return { offset, sortDirection, filter, page, categoryId, categories };
};

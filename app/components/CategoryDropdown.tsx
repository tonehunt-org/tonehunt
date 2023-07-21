import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ModelSortDropdown from "./ModelSortDropdown";
import { getCategoryIcon } from "~/services/categories";
import type { Category } from "@prisma/client";
import { useLocation, useSearchParams } from "@remix-run/react";

type CategoryDropdownProps = {
  categories: Category[];
};

export default function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const location = useLocation();
  const [filterParams] = useSearchParams();

  const defaultFilter = filterParams.get("filter") ?? "all";

  const items = [{ title: "All", href: "", default: defaultFilter === "all" }].concat(
    categories.map((c) => {
      const params = new URLSearchParams(filterParams);
      params.set("filter", c.slug);
      params.delete("page"); // Ensure we don't end up out of bounds

      return {
        title: c.pluralTitle ?? "",
        href: `${location.pathname}?${params}`,
        default: c.slug === defaultFilter,
        slug: c.slug,
      };
    })
  );

  return (
    <ModelSortDropdown
      icon={<ChevronDownIcon className="w-4 h-4" />}
      renderItem={(item) => {
        return (
          <span className="flex items-center gap-3 py-1">
            <img className="w-6 h-6" src={getCategoryIcon(item.slug ?? "")} alt={item.title ?? ""} />
            <span className="truncate">{item.title} </span>
          </span>
        );
      }}
      items={items}
    />
  );
}

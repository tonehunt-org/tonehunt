import { useState } from "react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { db } from "~/utils/db.server";
import { find, map } from "lodash";
import { stringify as qs_stringify } from "qs";
import { getSession } from "~/auth.server";

import ModelsListComponent from "~/components/ModelList";
import Loading from "~/components/ui/Loading";

type LoaderData = {
  models: any;
  user?: User | null;
  total: number;
  page: number;
  filter: string;
  categories: any;
  sortBy: string;
  sortDirection: string;
  username: string | null;
};

// THE AMOUNT OF MODELS PER PAGE
const MODELS_LIMIT = 12;

const sortByOptions = [
  { slug: "newest", field: "createdAt" },
  { slug: "popular", field: "createdAt" }, // WE NEED TO ADD A COLUMN FOR THIS
  { slug: "name", field: "title" },
];

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session } = await getSession(request);

  const url = new URL(request.url);

  // GET PAGE
  let page = Number(url.searchParams.get("page")) ?? 1;
  if (!page || page === 0) page = 1;
  const offset = (page - 1) * MODELS_LIMIT;

  // GET SORT BY
  const sortByParam = url.searchParams.get("sortBy") ?? "newest";
  const selectedSortBy = find(sortByOptions, ["slug", sortByParam]);
  const sortBy = selectedSortBy?.field ?? "createdAt";

  // GET SORT DIRECTION
  const sortDirectionParam = url.searchParams.get("sortDirection") ?? "desc";
  const sortDirection = sortDirectionParam === "asc" || sortDirectionParam === "desc" ? sortDirectionParam : "desc";

  // GET USERNAME
  const usernameParam = url.searchParams.get("username") ?? null;

  // GET FILTER
  const filter = url.searchParams.get("filter") ?? "all";

  // GET CATEGORIES
  const categories = await getCategories();
  const selectedCategory = find(categories, ["slug", filter]);
  const categoryId = selectedCategory?.id ?? null;

  // GET MODELS
  const models = await getModels(offset, categoryId, sortBy, sortDirection, usernameParam);

  return json<LoaderData>({
    models: models.data,
    total: models.total,
    user: session?.user,
    page: page - 1,
    filter,
    categories,
    sortBy: selectedSortBy?.slug ?? "newest",
    sortDirection,
    username: usernameParam,
  });
};

const getCategories = async () => {
  const categories = await db.category.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
    },
    orderBy: [
      {
        order: "asc",
      },
    ],
  });

  return categories;
};

const getModels = async (
  next: number,
  categoryId: number | null,
  sortBy: string,
  sortDirection: string,
  username: string | null
) => {
  const models = await db.$transaction([
    db.model.count({
      where: {
        private: false,
        active: true,
        ...(categoryId && {
          categoryId: categoryId,
        }),
        ...(username && {
          profile: {
            username: username,
          },
        }),
      },
    }),
    db.model.findMany({
      where: {
        private: false,
        active: true,
        ...(categoryId && {
          categoryId: categoryId,
        }),
        ...(username && {
          profile: {
            username: username,
          },
        }),
      },
      select: {
        _count: {
          select: {
            favorites: true,
          },
        },
        id: true,
        title: true,
        description: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        filename: true,
        profile: {
          select: {
            id: true,
            username: true,
          },
        },
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: [
        {
          [sortBy]: sortDirection,
        },
      ],
      skip: next,
      take: MODELS_LIMIT,
    }),
  ]);

  return {
    total: models[0] ?? 0,
    data: models[1],
  };
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const [loading, setLoading] = useState<boolean>(false);

  const filterOptions = [{ id: 0, title: "All", slug: "all" }, ...data.categories];
  const findFilter = find(filterOptions, ["slug", data.filter]);

  const defaultFilter = findFilter
    ? { value: String(findFilter.id), description: findFilter.title }
    : { value: "0", description: "All" };

  const selectOptions = map(filterOptions, (option) => ({
    value: String(option.id),
    description: option.title,
    selected: defaultFilter.value === String(option.id),
  }));
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter.value);

  const handlePageClick = (selectedPage: number) => {
    setLoading(true);

    const params: any = {
      page: selectedPage + 1,
      filter: data.filter,
      sortBy: data.sortBy,
      sortDirection: data.sortDirection,
    };

    if (data.username) {
      params.username = data.username;
    }

    const query = qs_stringify(params);
    window.location.href = `/?${query}`;
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value;
    setSelectedFilter(selectedFilter);

    const findFilter = find(filterOptions, ["id", Number(selectedFilter)]);

    const params: any = {
      page: 1,
      filter: findFilter.slug,
      sortBy: data.sortBy,
      sortDirection: data.sortDirection,
    };

    if (data.username) {
      params.username = data.username;
    }

    const query = qs_stringify(params);
    window.location.href = `/?${query}`;
  };

  const onSortChange = (sortBy: string) => {
    const params: any = {
      page: 1,
      filter: findFilter.slug,
      sortBy: sortBy,
      sortDirection: data.sortDirection,
    };

    if (data.username) {
      params.username = data.username;
    }

    const query = qs_stringify(params);
    window.location.href = `/?${query}`;
  };

  console.log("user:", data.user);

  // WE ARE MAKING MODEL LIST THE DEFAULT FOR NOW
  return (
    <div className="w-full">
      <div className="flex">
        <h1 className="w-full text-center text-2xl lg:text-3xl font-satoshi-bold mb-10">
          Find amps, pedals, and packs for NAM
        </h1>
      </div>
      <div className="flex">
        <div className="w-full">
          {loading ? (
            <div className="flex justify-center px-10 py-60">
              <Loading size="48" />
            </div>
          ) : null}
          {!loading ? (
            <ModelsListComponent
              data={data.models}
              total={data.total}
              currentPage={data.page}
              limit={MODELS_LIMIT}
              handlePageClick={handlePageClick}
              filterOptions={selectOptions}
              selectedFilter={selectedFilter}
              setSelectedFilter={handleFilterChange}
              selectedSortBy={data.sortBy}
              onSortChange={onSortChange}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

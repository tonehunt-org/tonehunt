import { useState } from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { find, map } from "lodash";
import { stringify as qs_stringify } from "qs";

import type { SelectOption } from "~/components/ui/Select";
import ModelsListComponent from "~/components/ModelList";
import Loading from "~/components/ui/Loading";
import type { Counts } from "@prisma/client";

// THE AMOUNT OF MODELS PER PAGE
export const MODELS_LIMIT = 20;

type ModelListPageProps = {
  counts: Counts[];
};

export default function ModelListPage({ counts }: ModelListPageProps) {
  const data = useLoaderData();
  const [loading, setLoading] = useState<boolean>(false);

  const modelList = data.modelList;

  const filterOptions = [{ id: 0, title: "All", slug: "all" }, ...modelList.categories];
  const findFilter = find(filterOptions, ["slug", modelList.filter]);

  const defaultFilter = findFilter
    ? { value: String(findFilter.id), description: findFilter.title }
    : { value: "0", description: "All" };

  const selectOptions: SelectOption[] = map(filterOptions, (option) => ({
    value: String(option.id),
    description: option.title,
  }));
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter.value);

  if (!modelList) {
    return <></>;
  }

  const handlePageClick = (selectedPage: number) => {
    setLoading(true);

    const params: any = {
      page: selectedPage + 1,
      filter: modelList.filter,
      sortBy: modelList.sortBy,
      sortDirection: modelList.sortDirection,
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
      sortBy: modelList.sortBy,
      sortDirection: modelList.sortDirection,
    };

    if (data.username) {
      params.username = data.username;
    }

    if (data.tags) {
      params.tags = data.tags;
    }

    const query = qs_stringify(params);
    window.location.href = `/?${query}`;
  };

  const onSortChange = (sortBy: string) => {
    const params: any = {
      page: 1,
      filter: findFilter.slug,
      sortBy: sortBy,
      sortDirection: modelList.sortDirection,
    };

    if (data.username) {
      params.username = data.username;
    }

    if (data.tags) {
      params.tags = data.tags;
    }

    const query = qs_stringify(params);
    window.location.href = `/?${query}`;
  };

  // WE ARE MAKING MODEL LIST THE DEFAULT FOR NOW
  return (
    <div className="w-full">
      <div className="flex">
        <h1 className="w-full text-2xl lg:text-[57px] lg:leading-[110%] font-satoshi-bold mb-20">
          Explore over{" "}
          <Link
            prefetch="intent"
            to="/?page=1&filter=amp&sortBy=newest&sortDirection=desc"
            className="border-tonehunt-green border-b-8 hover:text-tonehunt-green"
          >
            {counts.find((count) => count.name === "amps")?.count}
          </Link>{" "}
          amps,{" "}
          <Link
            prefetch="intent"
            to="/?page=1&filter=full-rig&sortBy=newest&sortDirection=desc"
            className="border-tonehunt-purple border-b-8 hover:text-tonehunt-purple"
          >
            {counts.find((count) => count.name === "fullrigs")?.count}
          </Link>{" "}
          full rigs,{" "}
          <Link
            prefetch="intent"
            to="/?page=1&filter=pedal&sortBy=newest&sortDirection=desc"
            className="border-tonehunt-yellow border-b-8 hover:text-tonehunt-yellow"
          >
            {counts.find((count) => count.name === "pedals")?.count}
          </Link>{" "}
          pedals, and many other NAM models
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
              data={modelList.models}
              total={modelList.total}
              currentPage={modelList.page}
              limit={MODELS_LIMIT}
              handlePageClick={handlePageClick}
              filterOptions={selectOptions}
              selectedFilter={selectedFilter}
              setSelectedFilter={handleFilterChange}
              selectedSortBy={modelList.sortBy}
              onSortChange={onSortChange}
              user={data.user}
              profile={data.profile}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

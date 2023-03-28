import Button from "~/components/ui/Button";
import ModelListItem from "./ModelListItem";
import ReactPaginate from "react-paginate";
import Select from "./ui/Select";
import type { SelectOption } from "~/components/ui/Select";
import type { User } from "@supabase/supabase-js";
import type { Model } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useSubmit } from "@remix-run/react";

interface ModelListType {
  data: Model[];
  total: number;
  currentPage: number;
  limit: number;
  handlePageClick: (arg: number) => void;
  filterOptions?: SelectOption[];
  selectedFilter?: string | undefined | null;
  setSelectedFilter?: (arg: React.ChangeEvent<HTMLSelectElement>) => void | undefined;
  showFilters?: boolean;
  showMenu?: boolean;
  selectedSortBy?: string;
  onSortChange?: (arg: string) => void | undefined;
  user?: User | null | undefined;
}

const ModelsListComponent = ({
  data = [],
  total = 0,
  currentPage = 0,
  limit,
  handlePageClick,
  filterOptions = [],
  selectedFilter = null,
  setSelectedFilter = undefined,
  showFilters = true,
  showMenu = true,
  selectedSortBy = "newest",
  onSortChange = undefined,
  user = null,
}: ModelListType) => {
  const pageCount = Math.ceil(total / limit);
  const paginationButtonLinkStyle =
    "px-3 py-1 border border-gray-600 rounded-lg relative w-[40px] h-[40px] inline-flex items-center justify-center text-white/60";

  const activeSortStyle = "bg-tonehunt-gray-medium hover:bg-tonehunt-gray-medium";

  const submit = useSubmit();

  const onFavoriteClick = (modelId: string, favoriteId: string | null) => {
    if (!user) return;

    let formData = new FormData();
    formData.append("modelId", modelId);
    formData.append("profileId", user.id);
    if (favoriteId) {
      formData.append("favoriteId", favoriteId);
    }
    submit(formData, { method: "post", action: "/favorites/add" });
  };

  return (
    <div>
      <div className="flex mb-2">
        {/* SORT AREA */}
        {showMenu ? (
          <div className="flex-none items-center">
            <div className="flex items-center mt-2">
              <Button
                type="button"
                variant="secondary"
                className={`font-satoshi-bold mr-2 text-xs border-0 ${
                  selectedSortBy === "newest" ? activeSortStyle : "text-tonehunt-gray-disable"
                }`}
                onClick={() => (onSortChange ? onSortChange("newest") : null)}
              >
                NEWEST
              </Button>
              <Button
                type="button"
                variant="secondary"
                className={`font-satoshi-bold mr-2 text-xs border-0 ${
                  selectedSortBy === "popular" ? activeSortStyle : "text-tonehunt-gray-disable hover:text-white"
                }`}
                onClick={() => (onSortChange ? onSortChange("popular") : null)}
              >
                POPULAR
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="hidden md:block font-satoshi-bold text-tonehunt-gray-disable mr-8 text-xs border-0 hover:text-white"
              >
                COLLECTIONS ONLY
              </Button>
            </div>
          </div>
        ) : null}

        {/* CATEGORIES AREA */}
        {showFilters ? (
          <div className="flex-grow">
            <div className="flex justify-end">
              <Select
                options={filterOptions}
                onChange={setSelectedFilter || undefined}
                defaultSelected={selectedFilter ?? ""}
                showEmptyOption={false}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* MODELS LIST */}
      <div className="flex flex-col">
        {data.length === 0 ? <span>No results</span> : null}
        {data.length > 0
          ? data.map((model: any) => <ModelListItem key={model.id} {...{ model, onFavoriteClick }} />)
          : null}
      </div>
      {/* PAGINATION AREA */}
      {pageCount > 1 ? (
        <div className="flex mt-5">
          <div className="flex-1">
            <ReactPaginate
              breakLabel="..."
              nextLabel={
                <ChevronRightIcon className="w-4 h-4 absolute inline left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
              }
              onPageChange={(event) => handlePageClick(event.selected)}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel={
                <ChevronLeftIcon className="w-4 h-4 absolute inline left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
              }
              renderOnZeroPageCount={() => {}}
              forcePage={currentPage}
              containerClassName="flex flex-row justify-end"
              pageClassName="mx-1"
              pageLinkClassName={paginationButtonLinkStyle}
              previousClassName="mr-1"
              previousLinkClassName={paginationButtonLinkStyle}
              nextClassName="ml-1"
              nextLinkClassName={paginationButtonLinkStyle}
              disabledClassName="text-gray-600"
              activeClassName="font-satoshi-bold text-white"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ModelsListComponent;

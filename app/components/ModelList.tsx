import ModelListItem from "./ModelListItem";
import ReactPaginate from "react-paginate";
import Select from "./ui/Select";
import type { SelectOption } from "~/components/ui/Select";
import type { User } from "@supabase/supabase-js";
import type { Model } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { ProfileWithFavorites } from "~/services/profile";
import { useLocation } from "@remix-run/react";
import ButtonLink from "./ui/ButtonLink";
import { sortBy } from "lodash";
import Button from "./ui/Button";

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
  selectedSortBy?: "newest" | "popular" | "following";
  onSortChange?: (arg: string) => void | undefined;
  user?: User | null | undefined;
  profile: ProfileWithFavorites | null;
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
  selectedSortBy = "following",
  onSortChange = undefined,
  user = null,
  profile,
}: ModelListType) => {
  const pageCount = Math.ceil(total / limit);
  const paginationButtonLinkStyle =
    "px-2 py-0.5 border border-white/20 hover:border-white/70  rounded-lg relative w-[36px] h-[36px] inline-flex items-center justify-center text-white/60";

  const activeSortStyle = "bg-tonehunt-gray-medium hover:bg-tonehunt-gray-medium";
  const location = useLocation();

  const followSearchParams = new URLSearchParams(location.search);
  const newestSearchParams = new URLSearchParams(location.search);
  const popularSearchParams = new URLSearchParams(location.search);

  followSearchParams.delete("sortBy");
  newestSearchParams.set("sortBy", "newest");
  popularSearchParams.set("sortBy", "popular");

  return (
    <div>
      <div className="flex mb-2 lg:flex-nowrap flex-wrap gap-5">
        {/* SORT AREA */}
        {showMenu ? (
          <div className="flex-none items-center">
            <div className="flex items-center mt-2">
              <ButtonLink
                to={`${location.pathname}?${followSearchParams.toString()}`}
                className={`font-satoshi-bold mr-2 text-xs border-0 ${
                  selectedSortBy === "following" ? activeSortStyle : "text-tonehunt-gray-disable"
                }`}
              >
                FOLLOWING
              </ButtonLink>
              <ButtonLink
                to={`${location.pathname}?${newestSearchParams.toString()}`}
                className={`font-satoshi-bold mr-2 text-xs border-0 ${
                  selectedSortBy === "newest" ? activeSortStyle : "text-tonehunt-gray-disable"
                }`}
              >
                NEWEST
              </ButtonLink>
              <ButtonLink
                type="button"
                to={`${location.pathname}?${popularSearchParams.toString()}`}
                className={`font-satoshi-bold mr-2 text-xs border-0 ${
                  selectedSortBy === "popular" ? activeSortStyle : "text-tonehunt-gray-disable hover:text-white"
                }`}
              >
                POPULAR
              </ButtonLink>
            </div>
          </div>
        ) : null}

        {/* CATEGORIES AREA */}
        {showFilters ? (
          <div className="flex-grow flex justify-end items-center">
            <div className="w-full sm:w-auto">
              <Select
                options={filterOptions}
                onChange={setSelectedFilter || undefined}
                defaultSelected={selectedFilter ?? ""}
                showEmptyOption={false}
                fullWidth
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* MODELS LIST */}
      <div className="flex flex-col">
        {data.length === 0 ? (
          selectedSortBy === "following" ? (
            <div className="w-full max-w-2xltext-center flex flex-col gap-10 relative">
              <div className="z-0 relative">
                <div className="flex-1 p-3 bg-tonehunt-gray-medium text-white rounded-xl text-to h-[64px] opacity-50 mb-5" />
                <div className="flex-1 p-3 bg-tonehunt-gray-medium text-white rounded-xl text-to h-[64px] opacity-20 mb-5" />
                <div className="flex-1 p-3 bg-tonehunt-gray-medium text-white rounded-xl text-to h-[64px] opacity-10 mb-5" />
                <div className="flex-1 p-3 bg-tonehunt-gray-medium text-white rounded-xl text-to h-[64px] opacity-5 mb-5" />
              </div>

              <div className="absolute top-[100px] left-1/2 z-10 -translate-x-1/2 text-center ">
                <div className="text-xl mb-10">You are not yet following anyone.</div>
                <div>
                  <ButtonLink to={`${location.pathname}?${popularSearchParams.toString()}`} variant="button-primary">
                    Find interesting users to follow
                  </ButtonLink>
                </div>
              </div>
            </div>
          ) : (
            <span>No results</span>
          )
        ) : null}
        {data.length > 0
          ? data.map((model: any) => <ModelListItem key={model.id} profile={profile} model={model} />)
          : null}
      </div>
      {/* PAGINATION AREA */}
      {pageCount > 1 ? (
        <div className="flex mt-5">
          <div className="flex-1">
            <ReactPaginate
              breakLabel="..."
              breakLinkClassName={paginationButtonLinkStyle}
              nextLabel={
                <ChevronRightIcon className="w-4 h-4 absolute inline left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
              }
              onPageChange={(event) => {
                handlePageClick(event.selected);
              }}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              previousLabel={
                <ChevronLeftIcon className="w-4 h-4 absolute inline left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
              }
              renderOnZeroPageCount={() => null}
              forcePage={currentPage}
              containerClassName="flex flex-row justify-center lg:justify-center flex-wrap"
              pageClassName="mx-1"
              pageLinkClassName={paginationButtonLinkStyle}
              previousClassName="mr-1"
              previousLinkClassName={paginationButtonLinkStyle}
              nextClassName="ml-1"
              nextLinkClassName={paginationButtonLinkStyle}
              disabledLinkClassName="text-white/30 border-white/30 hover:border-white/30 cursor-not-allowed"
              activeLinkClassName="font-satoshi-bold bg-white/10 text-black/80"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ModelsListComponent;

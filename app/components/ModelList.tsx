import ModelListItem from "./ModelListItem";
import ReactPaginate from "react-paginate";
import type { User } from "@supabase/supabase-js";
import type { Category, Model } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { ProfileWithSocials } from "~/services/profile";
import { useLocation, useSearchParams } from "@remix-run/react";
import ModelSortDropdown from "./ModelSortDropdown";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import CategoryDropdown from "./CategoryDropdown";
import EmptyFeed from "./EmptyFeed";

interface ModelListType {
  data: Model[];
  total: number;
  currentPage: number;
  limit: number;
  user?: User | null | undefined;
  profile: ProfileWithSocials | null;
  emptyMessage?: string;
  emptyFilterMessage?: string;
  categories: Category[];
  hideSortOrder?: boolean;
  title?: string;
  showTitle?: boolean;
  hideCategories?: boolean;
}

const ModelsListComponent = ({
  data = [],
  total = 0,
  currentPage = 0,
  categories,
  limit,
  user = null,
  profile,
  hideSortOrder = false,
  emptyMessage = "No results",
  emptyFilterMessage = "There are no models for this category yet",
  title = "",
  showTitle = false,
  hideCategories = false,
}: ModelListType) => {
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [followSearchParams] = useSearchParams();
  const [newestSearchParams] = useSearchParams();
  const [popularSearchParams] = useSearchParams();

  followSearchParams.set("sortBy", "following");
  newestSearchParams.set("sortBy", "newest");
  popularSearchParams.set("sortBy", "popular");

  const pageCount = Math.ceil(total / limit);
  const paginationButtonLinkStyle =
    "px-2 py-0.5 border border-white/20 hover:border-white/70  rounded-lg relative w-[36px] h-[36px] inline-flex items-center justify-center text-white/60";

  const pageIsEmpty = data.length === 0;

  const [newestParams] = useSearchParams();
  const [oldestParams] = useSearchParams();
  newestParams.delete("sortDirection");
  oldestParams.set("sortDirection", "asc");

  const renderEmpty = () => {
    if (!searchParams.get("filter")) {
      // return <div className="text-lg text-center py-10">{emptyMessage}</div>;
      return <EmptyFeed headline={emptyMessage} />;
    }

    if (searchParams.get("filter")) {
      return (
        <EmptyFeed
          headline={
            profile && !emptyMessage ? (
              <>
                <strong className="font-satoshi-bold">{profile.username}</strong> hasn't uploaded this model category
                yet
              </>
            ) : (
              emptyFilterMessage ?? "These types of models haven't been uploaded yet"
            )
          }
        />
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="w-full md:w-1/2">
          <h1 className="text-xl text-white font-satoshi-bold mb-1 text-center md:text-left md:mb-5">
            {showTitle ? title : ""}
          </h1>
        </div>
        <div className="w-full md:w-1/2">
          {pageIsEmpty && !searchParams.get("filter") ? null : (
            <ul className="list-none p-0 m-0 flex gap-3 items-center justify-center md:justify-end mb-5">
              {hideSortOrder ? null : (
                <li>
                  <ModelSortDropdown
                    icon={<ArrowsUpDownIcon className="w-4- h-4" />}
                    renderItem={(item) => item.title}
                    items={[
                      {
                        title: "Newest",
                        href: `${location.pathname}?${newestParams}`,
                        default: !searchParams.get("sortDirection") || searchParams.get("sortDirection") === "desc",
                      },
                      {
                        title: "Oldest",
                        href: `${location.pathname}?${oldestParams}`,
                        default: searchParams.get("sortDirection") === "asc",
                      },
                    ]}
                  />
                </li>
              )}

              <li>{hideCategories ? null : <CategoryDropdown categories={categories} />}</li>
            </ul>
          )}
        </div>
      </div>

      {/* MODELS LIST */}
      <div className="flex flex-col">
        {pageIsEmpty ? renderEmpty() : null}

        {data.length > 0
          ? data.map((model: any) => {
              return <ModelListItem key={model.id} profile={profile} model={model} />;
            })
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
                if (event.selected === 0) {
                  searchParams.delete("page");
                } else {
                  searchParams.set("page", String(event.selected));
                }
                setSearchParams(searchParams);
              }}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              previousLabel={
                <ChevronLeftIcon className="w-4 h-4 absolute inline left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
              }
              renderOnZeroPageCount={() => null}
              forcePage={currentPage}
              containerClassName="flex flex-row justify-center lg:justify-end flex-wrap"
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

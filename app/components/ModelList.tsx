import Button from "~/components/ui/Button";
import ModelListItem from "./ModelListItem";
import ReactPaginate from "react-paginate";
import Select from "./ui/Select";

const ModelsListComponent = ({
  data = [],
  total = 0,
  currentPage = 0,
  limit,
  handlePageClick,
  filterOptions,
  selectedFilter,
  setSelectedFilter,
}: any) => {
  const pageCount = Math.ceil(total / limit);
  const paginationButtonLinkStyle = "px-3 py-1 border border-gray-600 rounded-sm";

  return (
    <div>
      <div className="flex">
        {/* SORT AREA */}
        <div className="flex-none items-center">
          <div className="flex items-center mt-4">
            <Button type="button" variant="link" className="mr-8">
              NEWEST
            </Button>
            <Button type="button" variant="link" className="mr-8">
              POPULAR
            </Button>
            <Button type="button" variant="link" className="mr-8">
              MY FAVORITES
            </Button>
            <Button type="button" variant="link" className="mr-8">
              MY MODELS
            </Button>
          </div>
        </div>

        {/* CATEGORIES AREA */}
        <div className="flex-grow">
          <div className="flex justify-end">
            <Select
              className="w-28"
              options={filterOptions}
              onChange={setSelectedFilter}
              defaultSelected={selectedFilter}
              showEmptyOption={false}
            />
          </div>
        </div>
      </div>
      {/* <div className="flex">
        <Form method="get" action="/" className="flex-grow text-center px-10">
          <Input
            name="search"
            placeholder="Enter Search ..."
            className="inline-block mr-3"
            style={{ maxWidth: "420px" }}
          />
          <Button type="submit">Search</Button>
        </Form>
      </div> */}

      {/* MODELS LIST */}
      <div className="flex flex-col">
        {data.length === 0 ? <span>No results</span> : null}
        {data.length > 0 ? data.map((model: any) => <ModelListItem key={model.id} model={model} />) : null}
      </div>
      {/* PAGINATION AREA */}
      <div className="flex mt-5">
        <div className="flex-1">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={(event) => handlePageClick(event.selected)}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={() => {}}
            forcePage={currentPage}
            containerClassName="flex flex-row justify-end"
            pageClassName="mx-1"
            pageLinkClassName={paginationButtonLinkStyle}
            previousClassName="mr-1"
            previousLinkClassName={paginationButtonLinkStyle}
            activeClassName="text-black bg-white rounded-sm"
            nextClassName="ml-1"
            nextLinkClassName={paginationButtonLinkStyle}
            disabledClassName="text-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ModelsListComponent;

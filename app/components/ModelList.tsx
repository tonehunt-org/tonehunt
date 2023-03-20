import Button from "~/components/ui/Button";
import ModelListItem from "./ModelListItem";
import ReactPaginate from "react-paginate";

const ModelsListComponent = ({ data = [], total = 0, currentPage = 0, limit, handlePageClick }: any) => {
  const pageCount = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex">
        {/* SORT AREA */}
        <div className="flex-none mb-8">
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

        {/* CATEGORIES AREA */}
        <div className="flex-grow justify-end">
          <div className="flex justify-end">
            <Button type="button" variant="link" className="mr-4">
              ALL
            </Button>
            <Button type="button" variant="link" className="mr-4">
              AMPS
            </Button>
            <Button type="button" variant="link" className="mr-4">
              PACKS
            </Button>
            <Button type="button" variant="link" className="mr-4">
              PEDALS
            </Button>
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
            renderOnZeroPageCount={null}
            forcePage={currentPage}
            containerClassName="flex flex-row justify-end"
            pageClassName="mx-1"
            pageLinkClassName="px-3 py-1 border border-gray-600"
            previousClassName="mr-1"
            previousLinkClassName="px-3 py-1 border border-gray-600"
            activeClassName="text-black bg-white"
            nextClassName="ml-1"
            nextLinkClassName="px-3 py-1 border border-gray-600"
            disabledClassName="text-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ModelsListComponent;

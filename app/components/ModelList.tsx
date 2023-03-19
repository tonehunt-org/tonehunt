import Button from "~/components/ui/Button";
import ButtonLink from "~/components/ui/ButtonLink";
import * as timeago from "timeago.js";
import ModelListItem from "./ModelListItem";

const ModelsListComponent = ({ data = [], total = 0, currentPage = 0, limit, onNextPage, onPreviousPage }: any) => {
  const showNextButton = data.length >= limit;
  const showPrevious = data.length <= limit && currentPage !== 0;

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
      <div className="flex justify-end">
        {showPrevious ? (
          <Button type="button" variant="link" className="mr-4" onClick={onPreviousPage}>
            PREVIOUS PAGE
          </Button>
        ) : null}
        {showNextButton ? (
          <Button type="button" variant="link" className="mr-4" onClick={onNextPage}>
            NEXT PAGE
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default ModelsListComponent;

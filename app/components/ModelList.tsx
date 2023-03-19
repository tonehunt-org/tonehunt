import Button from "~/components/ui/Button";
import ButtonLink from "~/components/ui/ButtonLink";
import * as timeago from "timeago.js";

const ModelsListComponent = ({ data }: any) => {
  const renderModelItem = (model) => {
    return (
      <div className="flex-1 p-5 bg-stone-800 text-white mb-5 rounded-md">
        <div className="flex">
          <div className="w-3/4">
            <div className="flex flex-col">
              <div className="flex-1">
                <div className="flex align-middle">
                  <div className="w-10 h-10 inline-block mr-2 border border-gray-600 rounded-md">Icon</div>
                  <span className="font-bold text-3xl">{model.title}</span>
                </div>
              </div>
              <div className="flex-1">
                <span className="inline-block mr-4">{model.profile.username}</span>
                <span className="inline-block mr-4">{timeago.format(new Date(model?.createdAt!))}</span>
              </div>
            </div>
          </div>
          <div className="w-1/4 pl-4">
            <div className="flex items-center h-full">
              <div className="flex-1">
                <div className="flex justify-end">
                  <Button type="button" variant="link" className="ml-8">
                    Favorite
                  </Button>
                  <Button type="button" variant="link" className="ml-8">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex">
        {/* SORT AREA */}
        <div className="flex-none mb-8">
          <Button type="button" variant="link" className="mr-8">
            Newest
          </Button>
          <Button type="button" variant="link" className="mr-8">
            Popular
          </Button>
          <Button type="button" variant="link" className="mr-8">
            Own Models
          </Button>
        </div>

        {/* TAGS AREA */}
        <div className="flex-grow justify-end">
          <div className="flex justify-end">
            <Button type="button" variant="link" className="mr-4">
              Tag 1
            </Button>
            <Button type="button" variant="link" className="mr-4">
              Tag 2
            </Button>
            <Button type="button" variant="link" className="mr-4">
              Tag 3
            </Button>
            <Button type="button" variant="link" className="mr-4">
              Tag 4
            </Button>
            <Button type="button" variant="link" className="mr-4">
              Tag 5
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
        {data.models?.length === 0 ? <span>No results</span> : null}
        {data.models?.length > 0 ? data.models.map((model) => renderModelItem(model)) : null}
      </div>
      {/* PAGINATION AREA */}
      <div className="flex justify-end">
        <span>Pagination Area</span>
      </div>
    </div>
  );
};

export default ModelsListComponent;

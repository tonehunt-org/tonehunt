import Button from "~/components/ui/Button";
import ButtonLink from "~/components/ui/ButtonLink";
import * as timeago from "timeago.js";

const ModelListItem = ({ model }: any) => {
  return (
    <div key={model.id} className="flex-1 p-5 bg-stone-800 text-white mb-5 rounded-md">
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

export default ModelListItem;

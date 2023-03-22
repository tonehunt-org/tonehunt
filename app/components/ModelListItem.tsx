import Button from "~/components/ui/Button";
import * as timeago from "timeago.js";
import { StarIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import iconCab from "~/assets/categories_icons/icon-cab.svg";
import iconFullrigPack from "~/assets/categories_icons/icon-fullrig-pack.svg";
import iconPedal from "~/assets/categories_icons/icon-pedal.svg";
import iconIr from "~/assets/categories_icons/icon-ir.svg";

const ModelListItem = ({ model }: any) => {
  const getIcon = (catSlug: string) => {
    let icon = iconCab;
    switch (catSlug) {
      case "amps":
      default:
        icon = iconCab;
        break;
      case "packs":
        icon = iconFullrigPack;
        break;
      case "pedals":
        icon = iconPedal;
        break;
      case "irs":
        icon = iconIr;
        break;
    }
    return icon;
  };

  const catIcon = getIcon(model.category.slug);

  return (
    <div
      key={model.id}
      className="transition ease-in-out flex-1 p-5 bg-tonestack-gray-medium text-white mb-5 rounded-xl"
    >
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 lg:flex-grow">
          <div className="flex flex-row align-middle">
            <div className="flex-none items-center">
              <div className="w-14 h-14 inline-block mr-4 rounded-xl">
                <img className="w-full h-auto" src={catIcon} alt="cab" title="cab" />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex flex-col align-middle">
                <div className="flex-1">
                  <span className="font-satoshi-bold text-xl">{model.title}</span>
                </div>
                <div className="flex-1">
                  <span className="inline-block mr-4 font-satoshi-bold uppercase text-xs">5 models collection</span>
                  <span className="inline-block mr-4 text-sm font-satoshi-bold">{model.profile.username}</span>
                  <span className="inline-block mr-4 text-sm font-satoshi-light">
                    {timeago.format(new Date(model?.createdAt!))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 lg:flex-none lg:pl-4">
          <div className="flex items-center h-full">
            <div className="flex-1">
              <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
                <Button type="button" variant="secondary" className="ml-2">
                  <StarIcon className="w-5 h-5 inline-block mr-1" />
                  <span className="inline-block text-sm font-satoshi-light">999</span>
                </Button>
                <Button type="button" variant="secondary" className="ml-2">
                  <ArrowDownTrayIcon className="w-5 h-5 inline-block mr-1" />
                  <span className="inline-block text-sm font-satoshi-light">999</span>
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

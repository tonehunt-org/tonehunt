import iconFullrigPack from "~/assets/categories_icons/icon-fullrig-pack.svg";
import FavoriteButton from "~/components/FavoriteButton";
import DownloadButton from "~/components/DownloadButton";
import ShareButton from "~/components/ShareButton";
import Button from "~/components/ui/Button";
import { Link } from "@remix-run/react";

export default function ModelDetailPage() {
  const textForBG = [...new Array(30)].map(() => "test model");

  return (
    <section className="w-full">
      <header className="pt-[80px] text-center relative">
        <div className="relative z-10">
          <div className="pb-[40px]">
            <img className="m-auto w-32 h-32" src={iconFullrigPack} alt="Model Type: TODO" />
          </div>

          <h4 className="mb-0 pb-[12] leading-[19px] text-[14px] font-satoshi-bold uppercase text-tonehunt-green">
            Full Rig Model
          </h4>
          <h3 className="font-satoshi-bold text-[47px] pb-8">VOX AC 30 '92</h3>

          <div className="flex gap-[12px] justify-center pb-16">
            <DownloadButton count={0} onClick={() => {}} />
            <FavoriteButton count={0} onClick={() => {}} className="bg-tonehunt-gray-darker" />
            <ShareButton onClick={() => {}} className="bg-tonehunt-gray-darker" />
          </div>
        </div>

        <div className="block absolute top-0 left-0 w-full h-full leading-[88%] bg-tonehunt-gray-darker font-satoshi-bold z-0 uppercase text-[80px] overflow-hidden break-all text-shadow-bg text-tonehunt-gray-darker">
          {textForBG}
        </div>
      </header>

      <div className="pt-16 flex gap-[40px] max-w-[990px] m-auto px-4">
        <div className="border border-white/20 rounded-2xl p-4 text-center w-[270px]">
          <div className="rounded-full bg-tonehunt-gray-light h-[110px] w-[110px] m-auto mb-4 "></div>
          <h4 className="text-xl leading-[27px] opacity-50 mb-8">scottcorgan</h4>

          <Link
            to="/"
            className="block hover:bg-tonehunt-gray-light text-base text-white/70 py-3 px-5 bg-tonehunt-gray-medium rounded-xl"
          >
            Profile
          </Link>
        </div>

        <div className="flex-grow">
          <h4 className="text-[22px] opacity-70 pb-[40px]">
            Captured through a magical Neve preamp with my beloved 4x12 box
          </h4>

          <h5 className="text-xs uppercase leading-4 opacity-60 font-satoshi-bold pb-4">Tags</h5>
          <ul className="pb-[44px]">
            <li>
              <Link
                to="/"
                prefetch="intent"
                className="text-base leading-[22px] px-2 py-1 rounded-lg border border-white/20"
              >
                #Metal
              </Link>
            </li>
          </ul>

          <span className="opacity-60 text-sm leading-[19px]">Uploaded 15 hours ago</span>
        </div>
      </div>
    </section>
  );
}

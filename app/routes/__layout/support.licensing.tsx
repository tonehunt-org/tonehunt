import { Link } from "@remix-run/react";

export default function LicensingInfoPage() {
  return (
    <div className="flex flex-col">
      <div className="w-full">
        <h1 className="w-full text-center text-2xl lg:text-3xl font-satoshi-bold mb-10">Licensing</h1>
      </div>
      <div className="w-full">
        <p className="leading-loose text-justify">
          Licensing can be a complicated issue, however we have tried to make it as simple as possible. If you are here
          chances are you want to share your AI models and presets. However you may want control over what can be done
          with those models and presets. We recommend you check out{" "}
          <Link
            to="https://creativecommons.org/about/cclicenses/"
            target="_new"
            className="inline mx-1 text-tonehunt-blue-light hover:underline font-satoshi-bold"
          >
            the creative commons website
          </Link>{" "}
          for your options in that regard. <span className="inline font-satoshi-bold text-tonehunt-yellow">CC-BY</span>{" "}
          is often a good choice as it's one of the least restrictive. Alternatively you can consider our{" "}
          <span className="inline font-satoshi-bold text-tonehunt-yellow">Tone Hunt</span> license, this specifies that:
        </p>
        <p className="leading-loose text-justify mt-5 bg-tonehunt-gray-medium p-5 rounded-lg font-satoshi-light italic">
          “The user may download and load the data file into software, and utilize or publish the outputs from said
          software resulting from use of the aforementioned data file without royalty or restriction. The user may not
          upload, or otherwise republish, or distribute the data file without express permission from the author of the
          aforementioned data file”.
        </p>
        <p className="leading-loose text-justify mt-5">
          Please note, Tone Hunt does not, and will never take ownership of the content on this website. We are a free
          and open source community, dedicated to hosting resources for musicians. Authors (uploaders) retain whichever
          rights they wish when uploading to Tone Hunt.
        </p>
        <p className="leading-loose text-justify mt-5">
          More information:{" "}
          <Link
            to="https://creativecommons.org/about/cclicenses/"
            target="_new"
            className="inline mx-1 text-tonehunt-blue-light hover:underline font-satoshi-bold"
          >
            https://creativecommons.org/about/cclicenses/
          </Link>{" "}
        </p>
      </div>
    </div>
  );
}

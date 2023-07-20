import type { MetaFunction } from "@remix-run/node";

import iconCab from "~/assets/categories_icons/icon-cab.svg";
import iconFullrig from "~/assets/categories_icons/icon-fullrig.svg";
import iconPedal from "~/assets/categories_icons/icon-pedal.svg";
import iconOutboard from "~/assets/categories_icons/icon-outboard.svg";

export const meta: MetaFunction = ({ location }) => {
  const description =
    "Tonehunt is dedicated to simplifying the process of finding models for the Neural Amp Modeler (NAM). We understand how frustrating it can be to search for hours and come up empty-handed. That's why we've created an extensive platform to share and find models for NAM. Whether you're a seasoned producer or a beginner, our comprehensive collection of models will help you find get the tone you're looking for, from guitar, to outboard studio preamps. In the spirit of NAM's open source philosophy, our aim at ToneHunt is to add value to the life of the musician/products/engineer under the guidance of the following values: Always Free, Always Open, Always Secure, Always Collaborative. It is very important to us that we have a place that we can provide an equitable destination for creating the sound that you, me or anyone is looking for.";

  return {
    title: "About | ToneHunt",
    description,

    "og:title": "About | ToneHunt",
    "og:url": `${location.pathname}${location.search}`,
    "og:description": description,
    "twitter:image:alt": description,
  };
};

export default function AboutPage() {
  return (
    <div className="text-lg leading-relaxed">
      <div className="flex items-center gap-3 pb-10">
        <img src={iconCab} alt="ToneHunt Amps" />
        <img src={iconPedal} alt="ToneHunt Pedals" />
        <img src={iconFullrig} alt="ToneHunt Full Rigs" />
        <img src={iconOutboard} alt="ToneHunt Outboard Gear" />
      </div>
      <h2 className="text-4xl font-satoshi-bold pb-10">About ToneHunt</h2>

      <p className="mb-10">
        Tonehunt is dedicated to simplifying the process of finding models{" "}
        <a
          href="https://github.com/sdatkinson/neural-amp-modeler"
          className="hover:underline text-tonehunt-blue-light font-satoshi-bold"
          target="_blank"
          rel="noopener noreferrer"
        >
          for the Neural Amp Modeler (NAM)
        </a>
        . We understand how frustrating it can be to search for hours and come up empty-handed. That's why we've created
        an extensive platform to share and find models for NAM.
      </p>

      <p className="mb-10">
        Whether you're a seasoned producer or a beginner, our comprehensive collection of models will help you find get
        the tone you're looking for, from guitar, to outboard studio preamps.
      </p>

      <h3 className="text-3xl font-satoshi-medium pb-10">Our Values</h3>

      <p className="pb-5">
        In the spirit of NAM's open source philosophy, our aim at ToneHunt is to add value to the life of the
        musician/products/engineer under the guidance of the following values:
      </p>

      <ul className="list-disc pl-10 pb-10">
        <li>
          Always <strong className="font-satoshi-bold">Free</strong>
        </li>
        <li>
          Always <strong className="font-satoshi-bold">Open</strong>
        </li>
        <li>
          Always <strong className="font-satoshi-bold">Secure</strong>
        </li>
        <li>
          Always <strong className="font-satoshi-bold">Collaborative</strong>
        </li>
      </ul>

      <p className="pb-10">
        It is very important to us that we have a place that we can provide an equitable destination for creating the
        sound that you, me or anyone is looking for.
      </p>

      <h3 className="text-3xl font-satoshi-medium pb-10">Who Is Building ToneHunt</h3>

      <p className="pb-10">
        ToneHunt is and will always be a collaborative effort by many people passionate about music, open source, people
        and software. There are many collaborators that are making ToneHunt possible. We will soon have a list here that
        will include everyone who has ever contributed to ToneHunt.
      </p>

      <p className="pb-10">
        Since ToneHunt is an open initiative, you can find all the technology used to build the platform in our{" "}
        <a
          href="https://github.com/tonehunt-org/tonehunt"
          className="hover:underline text-tonehunt-blue-light font-satoshi-bold"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github Repo
        </a>
        .
      </p>

      <p>
        If you're interested in following along with all things ToneHunt, or even to collaborate with us as we continue
        to build and make it better, you can{" "}
        <a
          href="https://discord.gg/anM9ytZTSu"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-tonehunt-blue-light font-satoshi-bold"
        >
          join the Discord server
        </a>
        .
      </p>
    </div>
  );
}

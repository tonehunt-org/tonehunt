import { StarIcon, UserCircleIcon, UserIcon, RectangleStackIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import imgArticle1 from "~/assets/articles/article_1.jpg";
import imgArticle2 from "~/assets/articles/article_2.jpg";
import imgArticle3 from "~/assets/articles/article_3.jpg";
import imgDiscord from "~/assets/articles/icon_discord.jpg";
import ButtonLink from "./ui/ButtonLink";
import type { SampleTag } from "~/services/tags";

type SidebarProps = {
  user?: User | null | undefined;
  username?: string | null | undefined;
  tags: SampleTag[];
};

const Sidebar = ({ user, username, tags }: SidebarProps) => {
  const UserBlock = () => {
    return (
      <div className="w-full">
        <div className="flex flex-row mb-6 items-center">
          <UserIcon className="block w-11 h-11 rounded-full p-2 bg-tonehunt-green mr-4" />
          <h3 className="font-satoshi-bold text-lg">{username}</h3>
        </div>
        <div className="flex flex-col">
          <div className="flex-1 border-b border-gray-600 pb-3 mb-3">
            <div className="flex flex-row items-center">
              <Link to="/account/my-models" prefetch="intent" className="hover:underline">
                <RectangleStackIcon className="inline w-5 h-5  mr-2" />
                <span className="font-satoshi-regular text-sm">My models</span>
              </Link>
            </div>
          </div>
          <div className="flex-1 border-b border-gray-600 pb-3 mb-3">
            <div className="flex flex-row items-center">
              <Link to="/account/my-favorites" prefetch="intent" className="hover:underline">
                <StarIcon className="inline w-5 h-5 mr-2" />
                <span className="font-satoshi-regular text-sm">My favorites</span>
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-row items-center">
              <Link to={`/${username}`} prefetch="intent" className="hover:underline">
                <UserCircleIcon className="inline w-5 h-5 mr-2" />
                <span className="font-satoshi-regular text-sm">View Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TagsBlock = () => {
    return (
      <div className="w-full">
        <div className="flex">
          <h1 className="font-satoshi-bold text-xl mb-4">Popular tags</h1>
        </div>
        <div className="flex flex-row flex-wrap gap-2 ">
          {tags.map((tag) => (
            <ButtonLink key={tag.id} variant="button" size="small" to={`/?tags=${tag.name}`}>
              #{tag.name}
            </ButtonLink>
          ))}
        </div>
      </div>
    );
  };

  const ArticlesBlock = () => {
    return (
      <div className="w-full">
        <div className="flex">
          <h1 className="font-satoshi-bold text-xl mb-4">Tips &amp; Tricks</h1>
        </div>

        <div className="flex flex-col">
          <div className="flex-1  pb-3 mb-3">
            <a href="https://github.com/sdatkinson/neural-amp-modeler" target="_new">
              <div className="flex flex-row items-center">
                <div className="inline w-14 h-14 mr-2 bg-tonehunt-purple rounded-xl overflow-hidden flex-none">
                  <img
                    className="object-cover w-14 h-14"
                    src={imgArticle1}
                    alt="capture_image"
                    title="How to capture your own rig"
                  />
                </div>
                <span className="font-satoshi-bold text-sm hover:underline">How to capture your own rig</span>
              </div>
            </a>
          </div>
          <div className="flex-1  pb-3 mb-3">
            <a href="https://github.com/sdatkinson/neural-amp-modeler" target="_new">
              <div className="flex flex-row items-center">
                <div className="inline w-14 h-14 mr-2 bg-tonehunt-orange rounded-xl overflow-hidden flex-none">
                  <img
                    className="object-cover w-14 h-14"
                    src={imgArticle2}
                    alt="train_image"
                    title="How to train a model"
                  />
                </div>
                <span className="font-satoshi-bold text-sm hover:underline">How to train a model</span>
              </div>
            </a>
          </div>
          <div className="flex-1  pb-3 mb-3">
            <a href="https://github.com/sdatkinson/NeuralAmpModelerPlugin" target="_new">
              <div className="flex flex-row items-center">
                <div className="inline w-14 h-14 mr-2 bg-tonehunt-green rounded-xl overflow-hidden flex-none">
                  <img className="object-cover w-14 h-14" src={imgArticle3} alt="nam_image" title="Download NAM" />
                </div>
                <span className="font-satoshi-bold text-sm hover:underline">
                  Download the Neural Amp Modeling Plugin
                </span>
              </div>
            </a>
          </div>
          <div className="flex-1  pb-3 mb-3">
            <a href="https://discord.gg/anM9ytZTSu" target="_new">
              <div className="flex flex-row items-center">
                <div className="inline w-14 h-14 mr-2 bg-tonehunt-green rounded-xl overflow-hidden flex-none">
                  <img className="object-cover w-14 h-14" src={imgDiscord} alt="discord" title="Join our Discord" />
                </div>
                <span className="font-satoshi-bold text-sm hover:underline">Join the ToneHunt Discord</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-4 sticky top-0">
      {user?.id ? (
        <div className="w-full text-white rounded-xl p-4 mb-8 border border-gray-600">
          <UserBlock />
        </div>
      ) : null}
      <div className="w-full text-white mb-8">
        <TagsBlock />
      </div>
      <div className="w-full text-white mb-8">
        <ArticlesBlock />
      </div>
    </div>
  );
};

export default Sidebar;

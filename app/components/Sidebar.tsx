import { StarIcon, UserCircleIcon, UserIcon, RectangleStackIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";

type SidebarProps = {
  user?: User | null | undefined;
  username?: string | null | undefined;
};

const Sidebar = ({ user, username }: SidebarProps) => {
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
              <Link to="#" prefetch="intent" className="hover:underline">
                <StarIcon className="inline w-5 h-5 mr-2" />
                <span className="font-satoshi-regular text-sm">My favorites</span>
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-row items-center">
              <Link to="/account/profile" prefetch="intent" className="hover:underline">
                <UserCircleIcon className="inline w-5 h-5 mr-2" />
                <span className="font-satoshi-regular text-sm">View Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-4">
      {user?.id ? (
        <div className="w-full text-white rounded-xl p-4 mb-8 border border-gray-600">
          <UserBlock />
        </div>
      ) : null}
      <div className="w-full text-white rounded-xl p-2 mb-8 border border-gray-600">
        <span className="block p-20 text-center">TAGS AREA</span>
      </div>
      <div className="w-full text-white rounded-xl p-2 mb-8 border border-gray-600">
        <span className="block p-20 text-center">ARTICLES</span>
      </div>
    </div>
  );
};

export default Sidebar;

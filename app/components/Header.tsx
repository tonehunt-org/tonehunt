import { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import Logo from "~/components/Logo";
import Button from "~/components/ui/Button";
import UserActions from "~/components/UserActions";
import Searchbar from "./Searchbar";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@prisma/client";
import ButtonLink from "./ui/ButtonLink";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Drawer } from "./ui/Drawer";
import MainNav from "~/components/MainNav";

interface HeaderType {
  user?: User | undefined | null;
  profile?: Profile | null | undefined;
}

const Header = ({ user, profile }: HeaderType) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const navigate = useNavigate();

  const menuItemsStyle = "border-0 hover:bg-transparent hover:text-gray-300";
  const menuItemsInlineStyle = { paddingLeft: "15px", paddingRight: "15px" };
  const mobileMenuIconStyle = { paddingLeft: "15px", paddingRight: "15px", marginRight: "-15px" };

  return (
    <header>
      <div className="flex items-center bg-black p-4 lg:p-0">
        <div className="flex-1 lg:flex-grow lg:pl-4">
          <Link to="/" prefetch="intent">
            <h1 className="text-3xl absolute hidden" style={{ left: "110%", top: "110%" }}>
              ToneHunt
            </h1>
            <Logo className="w-36 lg:w-44" />
          </Link>
        </div>

        <div className="hidden lg:block flex-grow">
          <div className="flex justify-center align-middle content-center">
            <div className="block w-full">
              <Searchbar name="search" placeholder="Search for amps, packs, pedals..." className="my-4" />
            </div>
          </div>
        </div>

        <div className="flex-1 lg:flex-grow pl-5 pr-1 lg:pr-4 ">
          <div className="flex justify-end align-middle content-center">
            <div className="hidden xl:hidden lg:mr-4">
              <div className="inline">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/")}
                  className={menuItemsStyle}
                  style={menuItemsInlineStyle}
                >
                  Discover
                </Button>
              </div>
              <div className="inline">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/")}
                  className={menuItemsStyle}
                  style={menuItemsInlineStyle}
                >
                  Tips &amp; Tricks
                </Button>
              </div>
            </div>

            <div>
              <UserActions user={user} username={profile?.username ?? undefined} />
            </div>
            {user ? (
              <div className="hidden xl:block">
                <ButtonLink variant="button-primary" to="/models/new">
                  Upload Model
                </ButtonLink>
              </div>
            ) : null}
            <div className="block xl:hidden">
              <Button
                variant="secondary"
                onClick={() => setShowMenu(!showMenu)}
                className={menuItemsStyle}
                style={mobileMenuIconStyle}
              >
                <Bars3Icon className="w-7 h-7" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex lg:hidden bg-[#222222] px-5 justify-center">
        <Searchbar name="search" placeholder="Search for amps, packs, pedals..." className="my-4" />
      </div>
      <Drawer
        setShowDrawer={() => setShowMenu(!showMenu)}
        showDrawer={showMenu}
        placement="right"
        titleBg="bg-tonehunt-gray-dark"
        title={<div className="uppercase h-20 flex items-center font-satoshi-bold ml-6">Menu</div>}
      >
        <div className="bg-tonehunt-gray-dark text-white h-full p-6">
          <MainNav user={user} profile={profile} isMobile={true} setShowMenu={setShowMenu} />
        </div>
      </Drawer>
    </header>
  );
};

export default Header;

import { Link, useNavigate, useSearchParams } from "@remix-run/react";
import Logo from "~/components/Logo";
import Button from "~/components/ui/Button";
import UserActions from "~/components/UserActions";
import Searchbar from "./Searchbar";
import type { User } from "@supabase/supabase-js";

interface HeaderType {
  user?: User | undefined;
  username?: string | null;
}

const Header = ({ user, username }: HeaderType) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const menuItemsStyle = "border-0 hover:bg-transparent hover:text-gray-300";
  const menuItemsInlineStyle = { paddingLeft: "15px", paddingRight: "15px" };

  return (
    <>
      <div className="flex items-center bg-black p-4 lg:p-0">
        <div className="flex-1 lg:flex-grow lg:pl-4">
          <Link to="/" prefetch="intent">
            <h1 className="text-3xl absolute hidden" style={{ left: "110%", top: "110%" }}>
              ToneHunt
            </h1>
            <Logo className="w-40 lg:w-56" />
          </Link>
        </div>
        <div className="hidden lg:block flex-none">
          <div className="flex justify-center align-middle content-center">
            <div className="block w-96">
              <Searchbar name="search" placeholder="Search for amps, packs, pedals ..." className="my-4" />
            </div>
          </div>
        </div>
        <div className="flex-1 lg:flex-grow pl-5 pr-1 lg:pr-4 ">
          <div className="flex justify-end align-middle content-center">
            <div className="hidden xl:inline-block lg:mr-4">
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

            {user ? (
              <div>
                <Button
                  variant="primary"
                  onClick={() => {
                    searchParams.set("create", "");
                    setSearchParams(searchParams);
                  }}
                >
                  Upload model
                </Button>
              </div>
            ) : null}
            <div>
              <UserActions user={user} username={username ?? undefined} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex lg:hidden bg-[#222222] px-5 justify-center">
        <Searchbar name="search" placeholder="Search for amps, packs, pedals ..." className="my-4" />
      </div>
    </>
  );
};

export default Header;

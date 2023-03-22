import { Link, useNavigate } from "@remix-run/react";
import Logo from "~/components/Logo";
import Button from "~/components/ui/Button";
import UserActions from "~/components/UserActions";
import Searchbar from "./Searchbar";

const Header = ({ data }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center bg-black p-3 lg:p-0">
        <div className="flex-1 lg:flex-none">
          <Link to="/" prefetch="intent">
            <h1 className="text-3xl absolute hidden" style={{ left: "110%", top: "110%" }}>
              Tonestack
            </h1>
            <Logo />
          </Link>
        </div>
        <div className="hidden lg:block flex-grow">
          <div className="flex justify-center align-middle content-center">
            <div className="block w-96">
              <Searchbar name="search" placeholder="Search for amps, packs, pedals ..." className="my-4" />
            </div>
          </div>
        </div>
        <div className="flex-1 lg:flex-none px-10">
          <div className="flex justify-end align-middle content-center">
            {data.user ? (
              <div>
                <Button variant="secondary" onClick={() => navigate("/models/new")}>
                  Upload
                </Button>
              </div>
            ) : null}
            <div>
              <UserActions user={data.user} username={data.profile?.username ?? undefined} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex lg:hidden bg-[#222222] px-3 justify-center">
        <Searchbar name="search" placeholder="Search for amps, packs, pedals ..." className="my-4" />
      </div>
    </>
  );
};

export default Header;

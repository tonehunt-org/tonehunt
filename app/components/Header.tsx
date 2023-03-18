import { Link, useNavigate } from "@remix-run/react";
import Logo from "~/components/Logo";
import Button from "~/components/ui/Button";
import UserActions from "~/components/UserActions";

const Header = (user = null, profile = null) => {
	const navigate = useNavigate();

	return (
		<>
			<div className="flex px-5 py-5 items-center border-b border-gray-700">
				<div className="flex-none">
					<Link to="/" prefetch="intent">
						<h1 className="text-3xl absolute" style={{ left: "110%", top: "110%" }}>
							Tonestack
						</h1>
						<Logo />
					</Link>
				</div>

				<div className="flex-grow px-10">
					<div className="flex justify-end align-middle content-center">
						{user ? (
							<div>
								<Button variant="secondary" onClick={() => navigate("/models/new")}>
									Upload
								</Button>
							</div>
						) : null}
						<div>
							<UserActions user={user} username={profile?.username ?? undefined} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Header;

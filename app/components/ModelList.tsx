import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation, Form, useSearchParams } from "@remix-run/react";
import Table from "~/components/ui/Table";
import ModelEntryActions from "~/components/ModelEntryActions";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Button from "~/components/ui/Button";
import ButtonLink from "~/components/ui/ButtonLink";
import * as timeago from "timeago.js";
import Input from "~/components/ui/Input";

const ModelsListComponent = ({ data }: any) => {
	const results = (
		<Table
			columns={[
				{
					title: "Model Name",
					renderCell: (model: any) => {
						return (
							<div className="flex items-center">
								<details>
									<summary className="cursor-pointer">
										<span className="pl-2">{model?.title}</span>
									</summary>

									<div className="p-3">
										<h4 className="font-bold">Amp</h4>
										<div>{model?.ampName}</div>

										<h4 className="font-bold pt-3">Description</h4>
										<div>{model?.description}</div>
									</div>
								</details>
							</div>
						);
					},
				},
				{
					title: "User",
					className: "w-64",
					renderCell: (model) => {
						return <>{model?.profile?.username}</>;
					},
				},
				{
					title: "Uploaded",
					className: "w-32",
					renderCell: (model) => {
						return <>{timeago.format(new Date(model?.createdAt!))}</>;
					},
				},
				{
					title: "Download",
					className: "w-10",
					renderCell: (model) => {
						return (
							<div className="flex items-center">
								<a href={`/models/${model.id}/download`} download className="inline-block">
									<ArrowDownTrayIcon className="w-5 h-5" />
								</a>
								{data.user?.id === model.profile_id ? (
									<div className="ml-3">
										<ModelEntryActions model={model} />
									</div>
								) : null}
							</div>
						);
					},
				},
			]}
			data={data.models ?? []}
		/>
	);

	return (
		<div>
			<nav className="max-w-6xl m-auto mb-16 mt-16">
				<Form method="get" action="/" className="flex-grow text-center px-10">
					<Input
						name="search"
						placeholder="Enter Search ..."
						className="inline-block mr-3"
						style={{ maxWidth: "420px" }}
					/>
					<Button type="submit">Search</Button>
				</Form>
			</nav>
			<div className="flex flex-col max-w-6xl m-auto">
				<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
						<div className="overflow-hidden">{data.models?.length === 0 ? <>No results</> : results}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModelsListComponent;

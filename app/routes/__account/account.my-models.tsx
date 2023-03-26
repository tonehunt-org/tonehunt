import { getSession } from "~/auth.server";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { User } from "@supabase/supabase-js";
import { db } from "~/utils/db.server";
import { map } from "lodash";
import * as timeago from "timeago.js";
import Button from "~/components/ui/Button";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

type LoaderData = {
  user: User | null | undefined;
  models: any;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await getSession(request);
  const user = session?.user;

  const models = await db.model.findMany({
    where: {
      profileId: user?.id,
      deleted: false,
    },
    select: {
      id: true,
      title: true,
      description: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      filename: true,
      private: true,
      active: true,
      category: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  return json<LoaderData>({
    user,
    models,
  });
};

const MyModelsPage = () => {
  const data = useLoaderData();
  const submit = useSubmit();

  const onDeleteClick = (modelId: string) => {
    if (window.confirm("Do you really want to delete this model?")) {
      console.log("remove:", modelId);
      let formData = new FormData();
      formData.append("modelId", modelId);
      submit(formData, { method: "post", action: "/models/delete" });
    }
  };

  const renderItems = map(data.models, (model) => {
    return (
      <div key={model.id} className="flex-1 bg-tonehunt-gray-medium p-3 mb-5 rounded-xl">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/4">
            <span className="block w-full font-satoshi-bold text-2xl mb-1">{model.title}</span>
            <span className="block w-full font-satoshi-light text-sm mb-1">
              <span className="font-satoshi-bold">Category</span>: {model.category.title}
            </span>
            <span className="block w-full font-satoshi-light text-sm mb-1">
              <span className="font-satoshi-bold">Created</span>: {timeago.format(new Date(model.createdAt!))}
            </span>
            <span className="block w-full font-satoshi-light text-sm mb-1">
              <span className="font-satoshi-bold">Updated</span>: {timeago.format(new Date(model?.updatedAt!))}
            </span>
            <span className="block w-full font-satoshi-light text-sm mb-1">
              <span className="font-satoshi-bold">File</span>: {model.filename}
            </span>
            <span className="block w-full font-satoshi-light text-sm ">
              <span className="font-satoshi-bold">Status</span>:{" "}
              <span className={`${model.active ? "text-green-500" : "text-yellow-500"}`}>
                {model.active ? "Published" : "Hidden"}
              </span>
            </span>
          </div>
          <div className="w-full lg:w-1/4 lg:pl-3">
            <div className="flex items-center h-full justify-center">
              <Button
                type="button"
                variant="secondary"
                className="ml-2 bg-cyan-600 hover:bg-cyan-800 border-none"
                onClick={() => console.log("edit")}
              >
                <PencilSquareIcon className="w-5 h-5 inline-block" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="ml-2 bg-red-600 hover:bg-red-800 border-none"
                onClick={() => onDeleteClick(model.id)}
              >
                <TrashIcon className="w-5 h-5 inline-block" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="w-full">
      <div className="flex">
        <h1 className="w-full text-center text-2xl lg:text-3xl font-satoshi-bold mb-10">My Models</h1>
      </div>
      <div className="flex flex-col">{renderItems}</div>
    </div>
  );
};

export default MyModelsPage;

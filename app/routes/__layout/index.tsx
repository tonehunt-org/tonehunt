import { useState } from "react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { db } from "~/utils/db.server";

import ModelsListComponent from "~/components/ModelList";
import Loading from "~/components/ui/Loading";

type LoaderData = {
  models: any;
  user?: User | null;
  total: number;
  page: number;
};

const MODELS_LIMIT = 4;

export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  let page = Number(url.searchParams.get("page")) ?? 1;
  if (page === 0) page = 1;

  const offset = (page - 1) * MODELS_LIMIT;

  const models = await getModels(offset);

  return json<LoaderData>({
    models: models.data,
    total: models.total,
    user: null,
    page: page - 1,
  });
};

const getModels = async (next: number) => {
  const models = await db.$transaction([
    db.model.count({
      where: {
        private: false,
      },
    }),
    db.model.findMany({
      where: {
        private: false,
      },
      select: {
        _count: {
          select: {
            favorites: true,
          },
        },
        id: true,
        title: true,
        description: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        filename: true,
        profile: {
          select: {
            id: true,
            username: true,
          },
        },
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
      skip: next,
      take: MODELS_LIMIT,
    }),
  ]);

  return {
    total: models[0] ?? 0,
    data: models[1],
  };
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const [loading, setLoading] = useState<boolean>(false);

  const handlePageClick = (selectedPage: number) => {
    setLoading(true);
    window.location.href = `/?page=${selectedPage + 1}`;
  };

  // WE ARE MAKING MODEL LIST THE DEFAULT FOR NOW
  return (
    <div className="w-full">
      <div className="flex">
        <h1 className="text-5xl font-bold mb-10">Browse NAM Models</h1>
      </div>
      <div className="flex">
        <div className="w-3/4">
          {loading ? (
            <div className="flex justify-center px-10 py-60">
              <Loading size="48" />
            </div>
          ) : null}
          {!loading ? (
            <ModelsListComponent
              data={data.models}
              total={data.total}
              currentPage={data.page}
              limit={MODELS_LIMIT}
              handlePageClick={handlePageClick}
            />
          ) : null}
        </div>
        <div className="w-1/4 px-4">
          <div className="w-full text-white rounded-md p-2 mb-8 border border-gray-600">
            <span className="block p-20 text-center">Block 1</span>
          </div>
          <div className="w-full text-white rounded-md p-2 mb-8 border border-gray-600">
            <span className="block p-20 text-center">Block 2</span>
          </div>
          <div className="w-full text-white rounded-md p-2 mb-8 border border-gray-600">
            <span className="block p-20 text-center">Block 3</span>
          </div>
        </div>
      </div>
    </div>
  );
}

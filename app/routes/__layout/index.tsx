import { useState } from "react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation, useSearchParams, useNavigate } from "@remix-run/react";
// import type { Model } from "~/types/custom";
import type { User } from "@supabase/supabase-js";
import { db } from "~/utils/db.server";

import ModelsListComponent from "~/components/ModelList";

type LoaderData = {
  models: any;
  user?: User | null;
  total: number;
  page: number;
};

const MODELS_LIMIT = 3;

export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? 0;

  const offset = Number(page) === 0 ? Number(page) : Number(page) * MODELS_LIMIT;

  const models = await getModels(offset);

  return json<LoaderData>({
    models: models.data,
    total: models.total,
    user: null,
    page: Number(page),
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

  const onNextPage = () => {
    const nextPage = data.page ? data.page + 1 : 1;
    window.location.href = `/?page=${nextPage}`;
  };

  const onPreviousPage = () => {
    const previousPage = data.page !== 0 ? data.page - 1 : 0;
    window.location.href = `/?page=${previousPage}`;
  };

  // WE ARE MAKING MODEL LIST THE DEFAULT FOR NOW
  return (
    <div className="w-full">
      <div className="flex">
        <h1 className="text-5xl font-bold mb-10">Browse NAM Models</h1>
      </div>
      <div className="flex">
        <div className="w-3/4">
          {loading ? "Loading..." : null}
          {!loading ? (
            <ModelsListComponent
              data={data.models}
              total={data.total}
              currentPage={data.page}
              onNextPage={onNextPage}
              onPreviousPage={onPreviousPage}
              limit={MODELS_LIMIT}
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

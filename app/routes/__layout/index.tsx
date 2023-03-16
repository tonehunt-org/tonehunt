import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import { getSession } from "~/auth.server";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import * as timeago from "timeago.js";
import type { Model } from "~/types/custom";
import Table from "~/components/ui/Table";
import type { User } from "@supabase/supabase-js";
import ModelEntryActions from "~/components/ModelEntryActions";
import ButtonLink from "~/components/ui/ButtonLink";
import Button from "~/components/ui/Button";

type LoaderData = {
  models: Model[] | null;
  user?: User | null;
  count: number;
  page: number;
  hasMore: boolean;
};

const PAGE_SIZE = 30;

export const loader: LoaderFunction = async ({ request, context }) => {
  const { supabase, session } = await getSession(request, context);
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const userFilter = url.searchParams.get("user");
  const page = url.searchParams.get("page") ? +(url.searchParams.get("page") ?? 0) : 0;
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE;

  let query = supabase.from("models").select(`* , profiles(username)`, { count: "exact" });

  if (search) {
    // TODO: need to be able to search more than the title
    const searchTerms = search.split(" ").join(" | "); // Searches with 2 words of each other
    query = query.textSearch("title", searchTerms);
  }

  if (userFilter) {
    query = query.eq("profile_id", userFilter);
  }

  const response = await query
    .order("created_at", { ascending: false })
    .range(from, to)
    .limit(PAGE_SIZE);

  const data = response.data;
  const count = response.count ?? 0;

  return json<LoaderData>({
    models: data,
    user: session?.user,
    count,
    page,
    hasMore: count > to,
  });
};
export default function Index() {
  const data = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const page = +(searchParams.get("page") ?? 0);

  const results = (
    <Table
      columns={[
        {
          title: "Model Name",
          renderCell: (model) => {
            return (
              <div className="flex items-center">
                <details>
                  <summary className="cursor-pointer">
                    <span className="pl-2">{model.title}</span>
                  </summary>

                  <div className="p-3">
                    <h4 className="font-bold">Amp</h4>
                    <div>{model.amp_name}</div>

                    <h4 className="font-bold pt-3">Description</h4>
                    <div>{model.description}</div>
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
            return <>{model.profiles.username}</>;
          },
        },
        {
          title: "Uploaded",
          className: "w-32",
          renderCell: (model) => {
            return <>{timeago.format(new Date(model.created_at!))}</>;
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
        <ul className="list-one p-0 flex items-center gap-5 justify-center">
          <li>
            <ButtonLink
              to="/"
              prefetch="intent"
              active={
                !searchParams.get("user") &&
                location.pathname === "/" &&
                !searchParams.get("search")
              }
            >
              Newest
            </ButtonLink>
          </li>

          {data.user ? (
            <li>
              <ButtonLink
                to={`/?user=${data.user?.id}`}
                prefetch="intent"
                active={!!searchParams.get("user")}
              >
                Mine
              </ButtonLink>
            </li>
          ) : null}
          {searchParams.get("search") ? (
            <li>
              <ButtonLink to={`/?search=${searchParams.get("search")}`} prefetch="intent" active>
                Search: {searchParams.get("search")}
              </ButtonLink>
            </li>
          ) : null}
        </ul>
      </nav>
      <div className="flex flex-col max-w-6xl m-auto">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              {data.models?.length === 0 ? <>No results</> : results}
            </div>

            {/* move into component */}
            {data.hasMore || data.page > 0 ? (
              <div className="flex items-center gap-3 justify-center py-5">
                {data.page > 0 ? (
                  <Form method="get" className="flex justify-center">
                    <Button type="submit" name="page" value={page - 1} variant="secondary">
                      Previous Page
                    </Button>
                  </Form>
                ) : null}
                {data.hasMore ? (
                  <Form method="get" className="flex justify-center">
                    <Button type="submit" name="page" value={page + 1} variant="secondary">
                      Next Page
                    </Button>
                  </Form>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

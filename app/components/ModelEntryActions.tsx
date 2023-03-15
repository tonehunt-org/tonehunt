import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Form, Link, useLocation } from "@remix-run/react";
import type { Model } from "~/types/custom";
import Button from "./ui/Button";

type ModelEntryActionsProps = {
  model: Model;
};

export default function ModelEntryActions({ model }: ModelEntryActionsProps) {
  const location = useLocation();

  return (
    <div className="flex gap-3 items-center">
      <Link prefetch="intent" to={`/models/${model.id}/edit`} className="text-center">
        <PencilSquareIcon className="w-5 h-5" />
      </Link>
      <Form
        method="post"
        action={`/models/${model.id}/delete?redirectTo=${location.pathname}`}
        className="text-center"
      >
        <Button type="submit" variant="link">
          <TrashIcon className="w-5 h-5 text-red-500" />
        </Button>
      </Form>
    </div>
  );
}

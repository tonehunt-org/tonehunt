import { Form, useNavigate } from "@remix-run/react";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import type { Model } from "~/types/custom";

type ModelFormProps = {
  model?: Model;
  action?: string;
};

export default function ModelForm({ model, action }: ModelFormProps) {
  const navigate = useNavigate();

  return (
    <Form action={action} className="flex flex-col gap-3" method="post" encType="multipart/form-data">
      <Input label="Title" name="title" defaultValue={model?.title} />
      <Input label="Amp Name" name="ampName" defaultValue={model?.amp_name ?? undefined} />
      <Input label="Description" name="description" defaultValue={model?.description ?? undefined} />

      {!model ? (
        <Input label="Model File" type="file" name="model" accept=".nam" />
      ) : (
        <>
          <span className="block">File: </span> {model.filename}
        </>
      )}

      <div>
        <Button type="submit" className="mt-3 mr-3">
          {model ? "Save Model" : "New Model"}
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </Form>
  );
}

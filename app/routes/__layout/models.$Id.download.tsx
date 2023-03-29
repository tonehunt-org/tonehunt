import type { LoaderFunction } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { db } from "~/utils/db.server";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { supabase, session } = await getSession(request);
  const returnUrl = request.headers.get("Referer");
  const user = session?.user;

  const modelId = params.Id as string;

  try {
    const model = await db.model.findUnique({
      where: {
        id: modelId,
      },
    });

    const filename = model?.modelPath ?? "";

    const { data } = await supabase.storage.from("models").download(filename);

    if (!data) {
      return new Response("", { status: 500 });
    }

    await db.modelDownload.create({
      data: {
        modelId: modelId,
        ...(user?.id && { profileId: user.id }),
      },
    });

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename=${model?.title}.zip`,
        "Content-Type": data.type as string,
      },
    });
  } catch (error) {
    console.log(error);
    return redirect(returnUrl ?? "/", {});
  }
};

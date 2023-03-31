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

    // Only count downloads for logged in users
    if (user?.id) {
      // Unique id per user per model
      const downloadId = `${modelId}:${user?.id}`;

      // Only count a download once for a given model for a given user
      await db.modelDownload.upsert({
        where: {
          id: downloadId,
        },
        create: {
          id: downloadId,
          modelId: modelId,
          ...(user?.id && { profileId: user.id }),
        },
        update: {
          modelId: modelId,
          ...(user?.id && { profileId: user.id }),
        },
      });
    }

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

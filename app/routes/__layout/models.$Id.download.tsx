import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { db } from "~/utils/db.server";
import { redirect } from "@remix-run/node";

export type ModelDownloadLoaderData = {
  downloadUrl?: string;
  error?: string;
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { supabase, session } = await getSession(request);
  const user = session?.user;

  const modelId = params.Id as string;

  try {
    const model = await db.model.findUnique({
      where: {
        id: modelId,
      },
    });

    const filename = model?.modelPath ?? "";

    const { data } = supabase.storage.from("models").getPublicUrl(filename);

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

    return json<ModelDownloadLoaderData>({ downloadUrl: data.publicUrl });
  } catch (error: any) {
    console.log("ERROR GENERATING DOWNLOAD LINK", error);
    return json<ModelDownloadLoaderData>({ error: error.message });
  }
};

import type { ActionFunction } from "@remix-run/node";
import { getSession } from "~/auth.server";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { session } = await getSession(request);

  if (!session) {
    return new Response("", { status: 401 });
  }

  const sessionProfileReq = db.profile.findFirst({
    where: { id: session.user.id },
    select: { id: true },
  });
  const targetProfileReq = db.profile.findFirst({
    where: { username: params.username },
    select: {
      id: true,
    },
  });

  const [sessionProfile, targetProfile] = await Promise.all([sessionProfileReq, targetProfileReq]);

  if (!sessionProfile) {
    return new Response("", { status: 401 });
  }

  if (!targetProfile) {
    return new Response("", { status: 400 });
  }

  await db.follow.updateMany({
    where: {
      profileId: sessionProfile.id,
      targetId: targetProfile.id,
    },
    data: {
      deleted: true,
    },
  });

  return new Response("");
};

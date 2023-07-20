import type { LoaderFunction } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const ampCountReq = db.model.aggregate({
    _sum: {
      filecount: true,
    },
    where: {
      OR: [{ categoryId: 1 }, { categoryId: 5 }],
      deleted: false,
      private: false,
      active: true,
    },
  });

  const pedalCountReq = db.model.aggregate({
    _sum: {
      filecount: true,
    },
    where: {
      OR: [{ categoryId: 3 }, { categoryId: 7 }],
      deleted: false,
      private: false,
      active: true,
    },
  });

  const outboardCountReq = db.model.aggregate({
    _sum: {
      filecount: true,
    },
    where: {
      OR: [{ categoryId: 9 }, { categoryId: 10 }],
      deleted: false,
      private: false,
      active: true,
    },
  });

  const fullRigCountReq = db.model.aggregate({
    _sum: {
      filecount: true,
    },
    where: {
      OR: [{ categoryId: 2 }, { categoryId: 6 }],
      deleted: false,
      private: false,
      active: true,
    },
  });

  const irCountReq = db.model.aggregate({
    _sum: {
      filecount: true,
    },
    where: {
      OR: [{ categoryId: 4 }, { categoryId: 8 }],
      deleted: false,
      private: false,
      active: true,
    },
  });

  const [ampCount, pedalCount, outboardCount, fullRigCount, irCount] = await Promise.all([
    ampCountReq,
    pedalCountReq,
    outboardCountReq,
    fullRigCountReq,
    irCountReq,
  ]);

  await db.$transaction([
    db.counts.update({
      where: {
        name: "amps",
      },
      data: {
        count: ampCount._sum.filecount ?? 0,
      },
    }),
    db.counts.update({
      where: {
        name: "pedals",
      },
      data: {
        count: pedalCount._sum.filecount ?? 0,
      },
    }),
    db.counts.update({
      where: {
        name: "fullrigs",
      },
      data: {
        count: fullRigCount._sum.filecount ?? 0,
      },
    }),
    db.counts.update({
      where: {
        name: "outboards",
      },
      data: {
        count: outboardCount._sum.filecount ?? 0,
      },
    }),
    db.counts.update({
      where: {
        name: "irs",
      },
      data: {
        count: irCount._sum.filecount ?? 0,
      },
    }),
  ]);

  return json({
    counts: {
      ampCount,
      pedalCount,
      outboardCount,
      fullRigCount,
      irCount,
    },
  });
};

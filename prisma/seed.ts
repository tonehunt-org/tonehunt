import { PrismaClient } from "@prisma/client";

import { Categories } from "./seeders/categories";
import { Licenses } from "./seeders/licenses";
import { Tags } from "./seeders/tags";
import { Models } from "./seeders/models";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // CREATE CATEGORIES
  await Promise.all(
    Categories.map(async (c) => {
      const category = await prisma.category.upsert({
        where: { id: c.id },
        update: {},
        create: c,
      });
      console.log(`Created category with id: ${category.id}`);
    })
  );

  // CREATE LICENSES
  await Promise.all(
    Licenses.map(async (l) => {
      const license = await prisma.license.upsert({
        where: { id: l.id ?? 0 },
        update: {},
        create: l,
      });
      console.log(`Created license with id: ${license.id}`);
    })
  );

  // CREATE TAGS
  await Promise.all(
    Tags.map(async (t) => {
      const tag = await prisma.tag.upsert({
        where: { id: 0 },
        update: {},
        create: t,
      });
      console.log(`Created tag with id: ${tag.id}`);
    })
  );

  // CREATE PROFILES
  await Promise.all(
    Models.map(async ({ profileId }) => {
      const profile = await prisma.profile.upsert({
        where: { id: profileId },
        update: {},
        create: {
          id: profileId,
        },
      });
      console.log(`Created profile with id: ${profile.id}`);
    })
  );

  // CREATE MODELS
  await Promise.all(
    Models.map(async (m) => {
      const model = await prisma.model.create({
        data: m,
      });
      console.log(`Created model with id: ${model.id}`);
    })
  );

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

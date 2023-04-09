import { PrismaClient } from "@prisma/client";

import { Categories } from "./seeders/categories";
import { Licenses } from "./seeders/licenses";
import { Tags } from "./seeders/tags";
import { Models } from "./seeders/models";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // CREATE CATEGORIES
  for (const c of Categories) {
    const category = await prisma.category.create({ data: c });
    console.log(`Created category with id: ${category.id}`);
  }

  // CREATE LICENSES
  for (const l of Licenses) {
    const license = await prisma.license.create({ data: l });
    console.log(`Created license with id: ${license.id}`);
  }

  // CREATE TAGS
  for (const t of Tags) {
    const tag = await prisma.tag.create({ data: t });
    console.log(`Created tag with id: ${tag.id}`);
  }

  // CREATE MODELS
  for (const m of Models) {
    const model = await prisma.model.create({ data: m });
    console.log(`Created model with id: ${model.id}`);
  }

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

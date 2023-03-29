import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // CREATE SAMPLE CATEGORIES
  for (const c of new_categories) {
    const category = await prisma.category.create({ data: c });
    console.log(`Created category with id: ${category.id}`);
  }
  console.log(`Seeding finished.`);
}

const new_categories = [
  { id: 5, title: "Amps Collection", slug: "amps-collection", order: 5 },
  { id: 6, title: "Fullrigs Collection", slug: "fullrigs-collection", order: 6 },
  { id: 7, title: "Pedals Collection", slug: "pedals-collection", order: 7 },
  { id: 8, title: "IRs Collection", slug: "irs-collection", order: 8 },
  { id: 9, title: "Outboard", slug: "outboard", order: 9 },
  { id: 10, title: "Outboard Collection", slug: "outboard-collection", order: 10 },
];

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

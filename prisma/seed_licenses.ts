import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // CREATE LICENSES
  for (const l of sampleLicenses) {
    const license = await prisma.license.create({ data: l });
    console.log(`Created license with id: ${license.id}`);
  }
  console.log(`Seeding finished.`);
}

const sampleLicenses = [
  { id: 1, name: "Tone Hunt" },
  { id: 2, name: "CC BY" },
  { id: 3, name: "CC BY-SA" },
  { id: 4, name: "CC BY-NC" },
  { id: 5, name: "CC BY-NC-SA" },
  { id: 6, name: "CC BY-ND" },
  { id: 7, name: "CC BY-NC-ND" },
  { id: 8, name: "CC0" },
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

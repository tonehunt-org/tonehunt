import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // CREATE SAMPLE CATEGORIES
  for (const c of sampleCategories) {
    const category = await prisma.category.create({ data: c });
    console.log(`Created category with id: ${category.id}`);
  }

  // CREATE SAMPLE MODELS
  for (const m of sampleModels) {
    const model = await prisma.model.create({ data: m });
    console.log(`Created model with id: ${model.id}`);
  }
  console.log(`Seeding finished.`);
}

const sampleCategories = [
  {
    id: 1,
    title: "Amp",
    slug: "amp",
    icon: "icon_amp.svg",
    order: 1,
  },
  {
    id: 2,
    title: "Pedal",
    slug: "pedal",
    icon: "icon_pedal.svg",
    order: 2,
  },
  {
    id: 3,
    title: "Pack",
    slug: "pack",
    icon: "icon_pack.svg",
    order: 3,
  },
  {
    id: 4,
    title: "IR",
    slug: "ir",
    icon: "icon_ir.svg",
    order: 4,
  },
];

/*
    FOR profileId, MAKE SURE TO USE THE ID OF AN EXISTING USER IN auth.user AND THAT A RECORD
    EXIST IN PROFILE TABLE WITH THE SAME ID. 
*/
const sampleModels = [
  {
    title: "Rectifier 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
    ampName: "Mesa",
    modelPath: "Clean Channel",
    filename: "file_1.nam",
    profileId: "c33120be-fd15-43ae-ad8b-7f293b54dc4e",
    categoryId: 1,
    tags: "high gain, metal, mesa, rectifier",
  },
  {
    title: "Rectifier 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
    ampName: "Mesa",
    modelPath: "Crunch Channel",
    filename: "file_2.nam",
    profileId: "c33120be-fd15-43ae-ad8b-7f293b54dc4e",
    categoryId: 1,
    tags: "high gain, metal, mesa, rectifier, crunch",
  },
  {
    title: "Rectifier 3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
    ampName: "Mesa",
    modelPath: "Lead Channel",
    filename: "file_3.nam",
    profileId: "c33120be-fd15-43ae-ad8b-7f293b54dc4e",
    categoryId: 1,
    tags: "high gain, metal, mesa, rectifier, lead",
  },
  {
    title: "EVH 5150 Clean",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
    ampName: "EVH",
    modelPath: "Clean Channel",
    filename: "file_4.nam",
    profileId: "c33120be-fd15-43ae-ad8b-7f293b54dc4e",
    categoryId: 1,
    tags: "clean, metal, evh, 5150",
  },
  {
    title: "EVH 5150 Dist 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
    ampName: "EVH",
    modelPath: "Dist 1 Channel",
    filename: "file_5.nam",
    profileId: "c33120be-fd15-43ae-ad8b-7f293b54dc4e",
    categoryId: 1,
    tags: "crunch, metal, evh, 5150",
  },
  {
    title: "EVH 5150 Dist 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
    ampName: "EVH",
    modelPath: "Dsit 2 Channel",
    filename: "file_6.nam",
    profileId: "650cbb55-776b-4a79-a2b3-ea9e085e6324",
    categoryId: 1,
    tags: "crunch, metal, evh, 5150",
  },
  {
    title: "Orange Dark Terror",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
    ampName: "Orange",
    modelPath: "Crunch Channel",
    filename: "file_7.nam",
    profileId: "650cbb55-776b-4a79-a2b3-ea9e085e6324",
    categoryId: 1,
    tags: "crunch, metal, rock, orange, dark terror",
  },
  {
    title: "Orange Tiny Terror",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
    ampName: "Orange",
    modelPath: "Crunch Channel",
    filename: "file_8.nam",
    profileId: "650cbb55-776b-4a79-a2b3-ea9e085e6324",
    categoryId: 1,
    tags: "crunch, metal, rock, orange, tiny terror",
  },
  {
    title: "Orange Rockverb",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
    ampName: "Orange",
    modelPath: "Crunch Channel",
    filename: "file_9.nam",
    profileId: "650cbb55-776b-4a79-a2b3-ea9e085e6324",
    categoryId: 1,
    tags: "crunch, metal, rock, orange, rockverb",
  },
  {
    title: "Fender Deluxe",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
    ampName: "Fender",
    modelPath: "Crunch Channel",
    filename: "file_10.nam",
    profileId: "650cbb55-776b-4a79-a2b3-ea9e085e6324",
    categoryId: 1,
    tags: "clean, rock, pop, fender, deluxe",
  },
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

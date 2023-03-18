import { PrismaClient } from "@prisma/client";
import sample from "lodash/sample";

const prisma = new PrismaClient();

async function main() {

    console.log('Start seeding...');

    // CREATE SAMPLE TAGS
    for (const t of sampleTags) {
        const tag = await prisma.tag.create({ data: t });
        console.log(`Created tag with id: ${tag.id}`);
    }

    // CREATE SAMPLE MODELS
    for (const m of sampleModels) {
        const model = await prisma.model.create({ data: m });
        console.log(`Created model with id: ${model.id}`);

        // CREATES A MODEL TAG
        const randomTag = sample(sampleTags);
        const modelTag = await prisma.modelTag.create({
            data: {
                tagId: randomTag?.id || 1,
                modelId: model.id,
            }
        });
        console.log(`Created modelTag with id: ${modelTag.id}`);
    }
    console.log(`Seeding finished.`)
}


const sampleTags =  [
    {
        id: 1,
        title: "Clean",
    },
    {
        id: 2,
        title: "Crunch",
    },
    {
        id: 3,
        title: "High Gain",
    },
    {
        id: 4,
        title: "Amp",
    },
    {
        id: 5,
        title: "Full Rig",
    },
];

/*
    FOR profileId, MAKE SURE TO USE THE ID OF AN EXISTING USER IN auth.user AND THAT A RECORD
    EXIST IN PROFILE TABLE WITH THE SAME ID. 
*/
const sampleModels =  [
    {
        title: 'Rectifier 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.',
        ampName: 'Mesa',
        modelPath: 'Clean Channel',
        filename: 'file_1.nam',
        profileId: 'c33120be-fd15-43ae-ad8b-7f293b54dc4e',
    },
    {
        title: 'Rectifier 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.',
        ampName: 'Mesa',
        modelPath: 'Crunch Channel',
        filename: 'file_2.nam',
        profileId: 'c33120be-fd15-43ae-ad8b-7f293b54dc4e',
    },
    {
        title: 'Rectifier 3',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.',
        ampName: 'Mesa',
        modelPath: 'Lead Channel',
        filename: 'file_3.nam',
        profileId: 'c33120be-fd15-43ae-ad8b-7f293b54dc4e',
    },
    {
        title: 'EVH 5150 Clean',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.',
        ampName: 'EVH',
        modelPath: 'Clean Channel',
        filename: 'file_4.nam',
        profileId: 'c33120be-fd15-43ae-ad8b-7f293b54dc4e',
    },
    {
        title: 'EVH 5150 Dist 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.',
        ampName: 'EVH',
        modelPath: 'Dist 1 Channel',
        filename: 'file_5.nam',
        profileId: 'c33120be-fd15-43ae-ad8b-7f293b54dc4e',
    },
    {
        title: 'EVH 5150 Dist 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.',
        ampName: 'EVH',
        modelPath: 'Dsit 2 Channel',
        filename: 'file_6.nam',
        profileId: '650cbb55-776b-4a79-a2b3-ea9e085e6324',
    },
    {
        title: 'Orange Dark Terror',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.',
        ampName: 'Orange',
        modelPath: 'Crunch Channel',
        filename: 'file_7.nam',
        profileId: '650cbb55-776b-4a79-a2b3-ea9e085e6324',
    },
    {
        title: 'Orange Tiny Terror',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.',
        ampName: 'Orange',
        modelPath: 'Crunch Channel',
        filename: 'file_8.nam',
        profileId: '650cbb55-776b-4a79-a2b3-ea9e085e6324',
    },
    {
        title: 'Orange Rockverb',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.',
        ampName: 'Orange',
        modelPath: 'Crunch Channel',
        filename: 'file_9.nam',
        profileId: '650cbb55-776b-4a79-a2b3-ea9e085e6324',
    },
    {
        title: 'Fender Deluxe',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.',
        ampName: 'Fender',
        modelPath: 'Crunch Channel',
        filename: 'file_10.nam',
        profileId: '650cbb55-776b-4a79-a2b3-ea9e085e6324',
    },
];

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
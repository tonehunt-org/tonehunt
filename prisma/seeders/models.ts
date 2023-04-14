import type { createUser } from "../seed";

export const getModelList = (profileIds: string[]) => {
  return [
    {
      title: "Rectifier 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
      ampName: "Mesa",
      modelPath: "Clean Channel",
      filename: "file_1.nam",
      profileId: profileIds[Math.floor(Math.random() * profileIds.length)],
      categoryId: 1,
      tags: ["rock", "metal", "scooped"],
      licenseId: 1,
    },
    {
      title: "Rectifier 2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
      ampName: "Mesa",
      modelPath: "Crunch Channel",
      filename: "file_2.nam",
      profileId: profileIds[Math.floor(Math.random() * profileIds.length)],
      categoryId: 1,
      tags: ["djent", "metal", "high-gain"],
      licenseId: 1,
    },
    {
      title: "Dual Rectifier Collection",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
      ampName: "Mesa",
      modelPath: "Lead Channel",
      filename: "file_3.zip",
      profileId: profileIds[Math.floor(Math.random() * profileIds.length)],
      categoryId: 5,
      tags: ["vintage", "metal", "high-gain"],
      licenseId: 1,
    },
    {
      title: "EVH 5150 Clean",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
      ampName: "EVH",
      modelPath: "Clean Channel",
      filename: "file_4.nam",
      profileId: profileIds[Math.floor(Math.random() * profileIds.length)],
      categoryId: 1,
      tags: ["djent", "metal", "high-gain"],
      licenseId: 1,
    },
    {
      title: "EVH 5150 Dist 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
      ampName: "EVH",
      modelPath: "Dist 1 Channel",
      filename: "file_5.nam",
      profileId: profileIds[Math.floor(Math.random() * profileIds.length)],
      categoryId: 1,
      tags: ["djent", "metal", "high-gain"],
      licenseId: 1,
    },
    {
      title: "EVH 5150 Collection",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
      ampName: "EVH",
      modelPath: "Dsit 2 Channel",
      filename: "file_6.zip",
      profileId: profileIds[Math.floor(Math.random() * profileIds.length)],
      categoryId: 5,
      tags: ["djent", "metal", "high-gain"],
      licenseId: 1,
    },
    {
      title: "Orange Dark Terror",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
      ampName: "Orange",
      modelPath: "Crunch Channel",
      filename: "file_7.nam",
      profileId: profileIds[Math.floor(Math.random() * profileIds.length)],
      categoryId: 1,
      tags: ["crunch", "bright"],
      licenseId: 1,
    },
    {
      title: "Orange Tiny Terror",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
      ampName: "Orange",
      modelPath: "Crunch Channel",
      filename: "file_8.nam",
      profileId: profileIds[Math.floor(Math.random() * profileIds.length)],
      categoryId: 1,
      tags: ["crunch", "bright", "raw"],
      licenseId: 1,
    },
    {
      title: "Orange Rockverb",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
      ampName: "Orange",
      modelPath: "Crunch Channel",
      filename: "file_9.nam",
      profileId: profileIds[Math.floor(Math.random() * profileIds.length)],
      categoryId: 1,
      tags: ["crunch", "fuzzy", "rock"],
      licenseId: 1,
    },
    {
      title: "Fender Deluxe",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
      ampName: "Fender",
      modelPath: "Crunch Channel",
      filename: "file_10.nam",
      profileId: profileIds[Math.floor(Math.random() * profileIds.length)],
      categoryId: 1,
      tags: ["clean", "bright", "vintage", "fenderish"],
      licenseId: 1,
    },
    {
      title: "Ibanez Tube Screamer",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
      ampName: "Ibanez",
      modelPath: "Boosted",
      filename: "file_10.nam",
      profileId: profileIds[Math.floor(Math.random() * profileIds.length)],
      categoryId: 3,
      tags: ["vintage", "crunch"],
      licenseId: 1,
    },
    {
      title: "Boss Blues Driver",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mollis ex ut lacus scelerisque commodo.",
      ampName: "Boss",
      modelPath: "BD-2",
      filename: "file_10.nam",
      profileId: profileIds[Math.floor(Math.random() * profileIds.length)],
      categoryId: 3,
      tags: ["crunch", "blues", "breakup"],
      licenseId: 1,
    },
  ];
};

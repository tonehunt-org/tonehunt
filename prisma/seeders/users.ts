import type { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const usernames = ["one", "two", "three", "four", "five", "six"];

export async function createUser(prisma: PrismaClient) {
  const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_ANON_KEY as string);

  const profileIds = [];

  for (let name of usernames) {
    const { data, error } = await supabase.auth.signUp({
      email: `${name}@tonehunt.org`,
      password: "password",
    });

    console.log(data, error);

    if (error) {
      throw new Error(`Unable to create user ${name}: ${error?.message}`);
    }

    // Manually creating profiles to simulate the trigger in production
    const profile = await prisma.profile.create({
      data: {
        id: data.user?.id,
        username: name,
        firstname: name,
        lastname: "person",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consectetur sapien et tincidunt pellentesque.",
      },
    });

    profileIds.push(profile.id);
  }

  return profileIds;

  // const creates = usernames.map(async (name) => {
  //   const { data, error } = await supabase.auth.signUp({
  //     email: `${name}@tonehunt.org`,
  //     password: "password",
  //   });

  //   if (error) {
  //     throw new Error(`Unable to create user ${name}: ${error?.message}`);
  //   }

  //   // Manually creating profiles to simulate the trigger in production
  //   const profile = await prisma.profile.create({
  //     data: {
  //       id: data.user?.id,
  //       username: name,
  //       firstname: name,
  //       lastname: "person",
  //       bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consectetur sapien et tincidunt pellentesque.",
  //     },
  //   });

  //   return { ...data, profile };
  // });

  // const userData = await Promise.all(creates);

  // console.log("🙋 Created users");

  // return userData;
}

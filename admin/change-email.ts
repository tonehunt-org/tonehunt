import { createClient } from "@supabase/supabase-js";
import prompt from "prompt";

require("dotenv").config();

async function main() {
  console.log("\nChanging user email\n\n");
  prompt.start();

  const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SERVICE_ROLE_KEY as string);

  const { userId, email } = await prompt.get(["userId", "email"]);

  const { data, error } = await supabase.auth.admin.updateUserById(userId as string, {
    email: email as string,
    email_confirm: true,
  });

  if (error) {
    throw error;
  }

  if (data.user) {
    console.log(`\n✅ Email changed to ${email}`);
  }
}

main()
  .then(() => {
    console.log("\n Done!\n\n");
  })
  .catch((e) => {
    console.error("ERROR changing email:", e);
  });

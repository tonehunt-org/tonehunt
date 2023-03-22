<img src="https://media.discordapp.net/attachments/1085939013476692068/1086041031570632744/Bildschirmfoto_2023-03-16_um_22.38.48.png?width=2040&height=1318">

Tonestack is a web application designed to be a central repository for Neural Amp Modeler (NAM) models.

## Technologies Used

* Supabase: The cloud database used to store and manage user data and NAM models.
* Prisma: The ORM used to manage and query the application's database.
* Remix: The web framework used to build the application.
* Tailwind CSS: The CSS framework used for styling the application.

## How to setup your local development environment

1. Clone the project

Clone the existing project to your local machine using Git. Open your terminal and run the following command:
```
git clone https://github.com/scottcorgan/tonestack.git
```

2. Install dependencies

Navigate to the project directory in your terminal and install the project dependencies using the following command:
```
npm install
```

This will install all the necessary dependencies for the project, including Remix, Supabase, and Prisma.

3. Set up a Supabase account

Go to supabase.io and create an account. Follow the instructions to create a new project and database.

4. Setup Triggers & Functions in Supabase

    **Create a new Function**

    1. From the left side panel, select `Database`
    2. Select `Functions` and click `Create a new function`
    3. Enter the following:

    * Name of function: can be anything
    * Schema: select `public`
    * Return type: select `trigger`
    * Definition: enter the following:

    ```
    begin
      insert into public."Profile"(id)
      values(new.id);
      return new;
    end;
    ```

    4. Click on Show advanced settings
    5. Select SECURITY DEFINER
    6. Click Confirm

    **Create a Trigger**

    1. Select `Triggers` from the same previous list
    2. Select `Create a new trigger`
    3. Enter the following:

    * Name of trigger: can be anything
    * Table: select `users auth`
    * Events: select `Insert`
    * Trigger type: select `After the event`
    * Orientation: select `Row`
    * Function to trigger: select the newly created Function from the steps above
    * Click `Confirm`

4. Set up Supabase credentials

After creating a new project and database, go to your Supabase dashboard and click on the "Settings" tab.
Under the "API" section, you will find your Supabase URL and public and secret keys. Copy these credentials as you will need them later to connect your Remix app with Supabase.
Under the "Database" section, you will find the Connection String to connect to your database.

5. Set up environment variables

Rename the .env.example file as .env file and set the necessary environment variables:
```
SUPABASE_URL=<your Supabase URL>
SUPABASE_KEY=<your Supabase secret key>
DATABASE_UEL=<your Database Connection String>
```

Replace `your Supabase URL`, `your Supabase secret key` and `your Database URL` with your actual Supabase URL, secret key and connection string, respectively.
*Use port 5432 instead of 6543 in your connection string because pooling should not be used for migrations*

6. Set up the database

Make sure the Prisma CLI is installed by running `npm install prisma -D` or `yarn add prisma -D` in your project directory.
Run the following command in your terminal to set up the database:
```
npx prisma migrate dev
```

This will run the Prisma migrations and create the necessary tables in your database.

5. Start the server

Run the following command to start the server:
```
npm run dev
```

This will start the server in development mode and allow you to access the app in your browser at http://localhost:3000.

6. Interact with the app

You can now interact with the app in your browser. The app should be connected to your database and Supabase, allowing you to upload, share, and manage neural amp modeler models.

## How to contribute

Here are some guidelines to follow when contributing to this project:

1. Familiarize yourself with the project
Before you start contributing to a project, it's important to understand the project's goals and vision. Read the project documentation and familiarize yourself with the codebase. This will help you understand how your contributions can align with the project's goals.

2. Check for existing issues
Check the project's issue tracker to see if there are any open issues that you can work on. This can include bugs, feature requests, or improvements to existing functionality. Make sure to read through the issue description and comments to ensure that you understand the problem or request.

3. Discuss your ideas
Before starting work on an issue, it's a good idea to discuss your ideas with the project maintainers or other contributors. This can help you get feedback on your proposed solution and ensure that you're heading in the right direction.

4. Fork the repository
Once you've identified an issue to work on, fork the project repository on GitHub. This will create a copy of the project under your GitHub account that you can work on.

5. Create a branch
Create a new branch in your forked repository to work on your changes. Make sure to give your branch a descriptive name that reflects the changes you're making.

6. Make your changes
Make the necessary changes to the codebase to address the issue you're working on. Make sure to follow the project's coding style and guidelines.

7. Write tests
If the project has a test suite, write tests to ensure that your changes don't break existing functionality. If the project doesn't have tests, consider adding them as part of your contribution.

8. Commit your changes
Once you've made your changes and written tests, commit your changes with a descriptive commit message that explains the changes you've made.

9. Push your changes
Push your changes to your forked repository on GitHub.

10. Submit a pull request
Submit a pull request (PR) to the original project repository on GitHub. Make sure to give your PR a descriptive title and description that explains the changes you've made. The project maintainers will review your changes and provide feedback.

11. Address feedback
If the project maintainers request changes, make the necessary changes and push them to your forked repository. This will automatically update your PR. Continue addressing feedback until your changes are accepted.

12. Celebrate!
Congratulations, you've contributed to ToneStack! Your contributions will help improve the project for other users and help you grow as a developer.

## Troubleshooting

1. If you encounter an error where Prisma cannot find certain properties and types after making changes to your schemas, it's likely that you need to regenerate your types.
To do so, run the following command:
```
npm run generateTypes
```

This command will generate TypeScript types based on your Prisma schema. By running this command every time you make changes to your schemas, you can ensure that Prisma can properly find all necessary properties and types.

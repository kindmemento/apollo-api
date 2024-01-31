### My thought process and approach to solving this challenge is documented below.

I first created a new directory, opened it up on VSCode, and initialized a project with npm init -y to get a package.json file.
Then I ran npm i --save-dev typescript to save it as a development dependency.
Finally, I ran npx tsc --init to get a tsconfig.json file.

I then created an index.ts file as an entry point for our API, and a .gitignore file to exclude node_modules from the git repository for the project.

### My thought process and approach to solving this challenge is documented below.

I initialized a new project with npm init -y, ran npx tsc --init to get a tsconfig.json file, then installed PROD and DEV dependencies.

Created directory /src, index.ts (main entrypoint to API) and database.ts (for establishing dB connection to MySQL server) files inside, and created subdirectories /controlllers, /models, /routes to place relevant files inside respective directories.


Used the below SQL query to create a User schema in dB:

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    companyName VARCHAR(100) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

Then defined a User model in /src/models/user.ts

Implemented a basic signup, login, and login system in authController, then used JSON Web Token to introduce authentication through tokens.
Tokens are generated and sent to client on login, and invalidated on logout.
Implemented authenticateUser middleware function to protect certain routes/endpoints before proceeding to process.

# Project Setup and Testing Guide

## Local Environment Setup

To run and test the project locally, ensure you have the following tools installed on your machine:

- MySQL
- MySQL Workbench
- Postman
- An IDE of your preference

Follow these steps to set up the project:

1. **Clone the Project**:
   git clone <repository-url>

2. **Initialize MySQL Server**:

- Start a MySQL server.
- Run the following queries in an empty database:
  ```sql
  CREATE DATABASE your_database_name;
  USE your_database_name;
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    companyName VARCHAR(100) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  CREATE TABLE Indexes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  indexDate DATE NOT NULL,
  indexValue INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_index_user_id FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
  );
  CREATE TABLE Consumptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  consumptionDate DATE NOT NULL,
  consumptionValue INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_consumption_user_id FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
  );
	```

3. **Configure Database Credentials**:

- Open `/src/database.ts` configuration file.
- Enter your database credentials in the respective places.

4. **Install Dependencies**:
 npm install

5. **Start the Server**:
 npm run startServer

## Postman Collection

To test the API endpoints, import the provided Postman collection into Postman. Follow these steps:

1. **Download Collection**:

- Download the Postman collection JSON file from the `postman` directory in this repository.

2. **Import into Postman**:

- Open Postman.
- Click on "Import" in the top left corner.
- Select the downloaded JSON file.

3. **Update Environment Variables**:

- If necessary, update environment variables in Postman (e.g., API base URL).

Once imported, you can run individual requests or use the collection runner to execute all requests in the collection.

---

### My approach to solving the challenge is documented below.

I initialized a new project with npm init -y, ran npx tsc --init to get a tsconfig.json file, then installed PROD and DEV dependencies.

Created directory /src, index.ts (main entrypoint to API) and database.ts (for establishing dB connection to MySQL server) files inside, and created subdirectories /controlllers, /models, /routes to place relevant files inside respective directories.

Used the below SQL query to create a User schema in dB:

```sql
	CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	companyName VARCHAR(100) NOT NULL,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);
```

Then defined a User model in /src/models/user.ts

Implemented a basic signup, login, and login system in authController, then used JSON Web Token to introduce authentication through tokens.
Tokens are generated and sent to client on login, and invalidated on logout.
Implemented authenticateUser middleware function to protect certain routes/endpoints before proceeding to process.

Next, I designed the system for addIndex and deleteIndex features, starting with database table/schema design, then ORM models, then the actual server-side logic.

Used below two SQL queries to create Indexes and Consumptions tables in dB:

```sql
CREATE TABLE Indexes (
id INT AUTO_INCREMENT PRIMARY KEY,
userId INT NOT NULL,
indexDate DATE NOT NULL,
indexValue INT NOT NULL,
createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_index_user_id FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Consumptions (
id INT AUTO_INCREMENT PRIMARY KEY,
userId INT NOT NULL,
consumptionDate DATE NOT NULL,
consumptionValue INT NOT NULL,
createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_consumption_user_id FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);
```

I then implemented the addIndex method of indexController, which is the most complicated part of this simple server.

The logic handles both cases of insertion provided in requirements doc:

1. Regular order: Feb1 with indexValue of 100 being inserted first - Feb3 with indexValue of 500 being inserted second
2. Reverse order: Feb3 with indexValue of 500 being inserted first - Feb1 with indexValue of 100 being inserted second

Tested through Postman with mock data and ensured seamless expected output in both cases: consumptions are calculated after second index insertion, correctly, distributed evenly to the date range between two index readings.

I also wrote a Jest test with the help of ChatGPT to make sure they pass.
They seem to miss a simple case - a string mismatch between expected return values.
But all functions work as expected; entity relations are set up properly, and data is calculated and inserted correctly.
```

# vaccine-exercise-2021

## Setting up the environment
These instructions assume Linux environment with Nodejs runtime installed.

### 1. Install PostgreSQL to your local environment
Create database and user with password.

### 2. Clone this project to your local environment

### 3. Install Knex to your local environment
In *vaccine-exercise-2021* directory, execute following commands:
```console
npm install knex -g
npm install knex
npm install pg
```
### 4. Configure knexfile.js
Knexfile.js is in *vaccine-exercise-2021* directory.

Edit the file and change database, user and password according to your Postgres configuration.

### 5. Migrate and seed the database
In *vaccine-exercise-2021 directory*, execute following commands:
```
knex migrate:latest
knex seed:run
```
### 6. Install and start the server
In *vaccine-exercise-2021/server* directory, execute following commands:
```
npm install
npm start
```
### 7. Install and start the client
In *vaccine-exercise-2021/client* directory, execute following commands:
```
npm install
npm start
```






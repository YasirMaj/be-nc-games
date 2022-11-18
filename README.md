# Northcoders House of Games API

## Introduction

The purpose of this repo is to build a RESTful API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

The database will be made in PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Summary

Data about games is posted in reviews which contain the title of the game, name of designer, owner of the review, review image held as a url, review body, category, date review created, votes and can have related comments. Reviews can also be searched by category, sorted by any column and ordered either by ascending or descending value. Both comments and reviews are linked to users.

## Link

### You can visit this project live here: https://games.cyclic.app

A list of endpoints are provided: [here](https://games.cyclic.app/api).

# Setup

In order to set up locally, you will need to follow these steps:

### 1. Clone this repository
```
git clone https://github.com/YasirMaj/be-nc-games
```

### 2. Install dependencies 
run the code:
```
npm install
```
**This will install the following as listed on the `package.json` file:**
```
"dependencies": {
"dotenv": "^16.0.0",
"express": "^4.18.2",
"pg": "^8.7.3",
"pg-format": "^1.0.4"
},

"devDependencies": {
"husky": "^8.0.0",
"jest": "^27.5.1",
"jest-extended": "^2.0.0",
"jest-sorted": "^1.0.14",
"supertest": "^6.3.1"
},
```

### 3. Create .env files for development and test
Developers must add these 2 files in order to successfully connect to the two databases locally: 

**.env.test**<br>This file should contain:
```
PGDATABASE=nc_games_test
```
**.env.development**<br>This file should contain:
```
PGDATABASE=nc_games
```

### 4. Create databases
Create your local databases by running this command:
```
npm run setup-dbs
```

### 5. Seed your database
Seed your local databases by running this command:
```
npm run seed
```

### 6. Check successful setup
This can be done by running the tests suite using this command:
```
npm test
```

### 7. Run the app
This can be done by using the following command:
```
npm start
```

## Project details
This project was built using the following versions:<br>
`Node.js v19.1.0`<br>
`psql 12.12`










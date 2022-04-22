# Setup

Install dependencies and the migration tool :
```sh
npm i
npm i -g db-migrate db-migrate-mysql
```
Copy the environnement variables : 
```
cp .env.sample .env
```
This `.env` file allows to change the way the Node server connects to the database, but you probably won't have to change any of those variables unless you want to deploy the app yourself and connect it to a specific DB.

Install MySQL on your OS and create two databases on your MySQL instance :
- p3_api_database
- p3_api_database_test

Then, change the `DB_*` variables in `.env` file to match your own MySQL DB settings

### Run the app

```sh
npm run migrate-db
npm run dev
```

### Run the automated tests

```sh
npm run test:migrate-db
npm run test
```

# Database migrations

If, while developping, you must change the structure of the database to fit new requirements, 
you HAVE TO write a database migration script in order for the changes to be propagated 
in contributors local databases but also in the pre-prod/prod environments' DBs.

Here's an exemple of the helper command usage : 
```
NAME=splitNameOnContacts npm run create-db-migration
```
(Replace the NAME variable value by the name of your change). It will create two SQL files in the `migrations/sqls` folder. One file is executed on the DB when applying changes (migrating up) and the other is run when rolling back changes (migrating down).

To apply the changes that have not yet been synced to the database :
```
npm run migrate-db
```

To rollback the last migration : 
```
npm run rollback-last-db-migration
```
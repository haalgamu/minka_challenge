## Description

[ZEF](https://gist.github.com/zrumenjak/dfbd960482918a5ac0edf65c7453a14a) is a code challenge. The following technologies were used:
* NodeJS v16.17
* NestJS v9.0
* PostgreSQL v14.5
* AWS SQS
* Docker v20.10
* Terraform v1.2.9 

The directories are:
* **src**: Directory where all the application modules are located. Each module is composed of controller, services and dto's.
* **src/test**: Contains unit tests
* **infrastructure**: Contains the terraform scripts
* **test**: Contains the e2e tests.
* **./docker-compose-yaml**: Docker file to deploy each of the services needed to run the application. The variables required for each service should be reviewed, mainly the AWS variables for ***zef_terraform***.

The steps for running in the local environment are:
1. ```$ docker compose run --rm zef_terraform init ```
2. ```$ docker compose run --rm zef_terraform plan ```
3. ```$ docker compose run --rm zef_terraform apply ```
4. ```$ docker compose up -d```
5. Run the migrations.

Note: Add the local variables in **docker-compose.yaml** before following the above steps.

To test the functionalities follow the steps below:
1. Create 2 new users. /auth/register_member
2. Create a project for each user. /projects
3. Buy SKN coins for one user. /investments/buy/skn
4. Invest. /investments/invest/{projectId}
5. Withdraw. /investments/withdraw/{projectId}
6. View a user's balances. /investments/balance

## Documentation

If the application is running, you can go to [Swagger documentation](http://localhost:3000/api) to access the endpoint documentation, and use it for testing.

## Installation

```bash
$ npm install
```

## Migrations
To create the first user, project and currency, the migration must be executed. To do this, locally and with the appropriate environment variables for the DB, run the command:
```bash
$ npm run migration:run
```
This command create a user with credentials: "owner@zef.com", "password".

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Running the app on Docker
```bash
# development
docker compose up -d
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Infrastructure

```bash
# Initialize
$ docker compose run --rm zef_terraform init

# Validate the configuration
$ docker compose run --rm zef_terraform validate

# Generate the plan
$ docker compose run --rm zef_terraform plan

# Apply
$ docker compose run --rm zef_terraform apply
```
## License

ZEF is *MIT licensed*.

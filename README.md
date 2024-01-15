## Deliverable Deadlines

- D2: 6.12.2023 
- D3: 14.12.2023
- D4: 10.1.2024

All at 23:59 Amsterdam time.

## Technology Stack

- Database: MariaDB
- Back-end: TypeScript + Express.js (+ Node.js)
- Front-end: HTML + CSS + JavaScript

Each runing in a Docker container.

MariaDB was chosen because it is free and open sourced as well as because of the SQL being the universal standard for most database managment systems.

Express.js was chosen because it offers a lot of flexibility in the approach and has a plethora of community support and online resources. TypeScript was chosen to ensure type safety and other good practices.

The standard front-end stack of HTML, CSS, and JavaScript was (again) chosen due to it being the universal standard for web applications. We opted not to use a framework due to not having extremely complicated requirements, to have full control over our code and style, as well as to gain more experience with vanilla JavaScript.

## (Back-end) API Specification

Can be found [here](spec.yml)

## REST Maturity


## Running The Application(s)

1. Copy the `.env` file from `.env.example`.

```bash
cp .env.example .env
```

2. (Optionally) remove the following line in `docker-compose` to not seed the database.

```dockerfile
- "./data/mariadb/sql:/docker-entrypoint-initdb.d"
```


3. Make sure Docker Engine is running and then build and run the docker-compose.

```bash
docker compose up --build
```
This will build and run the database, the back-end, and the front-end containers, in that order.


## Requirements

<!-- TODO documentation -->
- **REQ 1** - The API has 1-to-1 mappings of the operations specified in the list of functionalities to endpoints. They are identified in the API specification under the `General`, `Emission`, `Temperature`, `Energy`, and `Country` labels.
- **REQ 2** - The API implements conversion of resources to either JSON or CSV representations. Errors and other types of responses are provided in JSON representation.
- **REQ 3** - The API specification is appropriately documented and is available as mentioned above.
- **REQ 4** - The back-end and Database were implemented and documented.
- **REQ 5** - The front-end was implemented and provides all functionalities provided by the back-end.
- **REQ 6** - The 3 tiers make use of the `.env` file and its variables and are implemented as Docker Containers and can all be run through Docker Compose as mentioned above.
- **REQ 7** - This document is the first part of the report describing the used technologies, requirements fulfillment, REST maturity, and work distribution.


## Bonus Work

### Additional Endpoints

### Containerization

### Design Principles

## Work Distribution

- Stipe
  - first thing
  - second thing
- Andro
  - first thing
  - second thing
- Christopher
  - first thing
  - second thing
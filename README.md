# Emissions Data Web Application

2023-24 Web Engineering Project - Group 23 

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

We created an endpoint `records/fill` that accepts a POST request with a URL parameter for the emissions CSV. The API will fetch the CSV, process it (remove columns, choose only specific years, etc.), create corresponding entities for each entry, and save them to the database. In short, it will fill the databse from a CSV located at the provided URL.

### Containerization

As mentioned, the three tiers: database, back-end, and front-end, are all implemented in separate dockerfiles and run as separate containers, in the above order.

### Design and Implementation Principles and Patterns

#### Back-end and database

- The model-view-controller pattern was implemented to divide the database models, the API models, and the logic between them.
- API models contain functions to be converted from and to databse models where necessary to prevent type errors.
- `TypeORM` was used in order to separate the model logic from the database logic, which decreases unnecessary coupling between the back-end and database. 
- The `class-transformer` and `class-validator` libraries were extensively used in validating request data before utilizing it.
- `Helper`, `query` (in some cases generic), `validate`, and `error` functions and/or middleware were implemented to avoid code duplication, promote code reusability for common tasks and meaningfully divide responsibilities.
- The routes are separated, use the same generic interface for consistency, and contain validation and error middleware where necessary.
- Environment variables were used in initialization of the back-end and the database.
- The code is commented and the (Open)API specification is provided.
- TypeScript was used to ensure type safety and other good practices.

#### Front-end

- Simplistic UI was created for frontend that showcases all the functionalities implemented in the back-end.
- Vanilla Javascript was used to create the front-end functionality due to the following:
  - It requires no dependencies as React and Vue do, thus simplifying the web development.
  - Due to no dependecies, the content on the frontend loads faster, meaning it is more time efficient which is appreciated a lot by nowaday users.
  - It helped us to properly learn the fundamentals of Javascript due to having no additional complex and abstract features.
- We have chosen to use Javascript for front-end rather tan Typescript due to one simple reason: its dynamic typing. The dynamic typing enabled us to create custom elements that can work with variables/objects whose typing is not easily predictable whereas with Typescript we would not even be able to render these elements.
- In order to render the UI elements, next to Vanilla Javascript, HTML was used.
- Our frontend involved using the following web development components:
  - Custom elements - HTML elements with custom behavior that are defined using Javascript.
  - Shadow DOM - closed-off "sub-page" that enables encapsulation of custom element's structure and its styling. This way any code written outside of Shadow DOM was not affected by its styles and scripts and vice versa.
  - Templates - HTML elements that enable support of variable data stored in "slots" and can be re-used multiple times. This enabled us to write all necessary information, fetched from back-end, using Javascript in a reusable HTML element.
- Our frontend was separated in three modules:
  - components - a module responsible for defining all the necessary web development components that will be rendered on the web page.
  - api - a module responsible for sending correct API calls to the back-end based on the user's input in the UI.
  - model - a module responsible for defining objects that contain the information that the users want, namely records.

## Work Distribution

- Stipe
  
  In order of contribution:
  - Database + Data
  - Back-end
  - docker-compose
  - README
  - OpenAPI specification

- Andro

  In order of contribution:
  - Front-end
  - Back-end
  - OpenAPI specification
  - README

- Christopher

  In order of contribution:
  - first thing
  - second thing
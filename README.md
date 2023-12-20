
# Car Listing Marketplace API

Welcome to the Car Listing Marketplace API! This API allows users to browse and interact with car listings, make bookings, and more.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Features](#features)
- [Unit Tests](#unit-tests)
- [Docker Compose](#docker-compose)
- [Prisma ORM](#prisma-orm)
- [Swagger API Docs](#swagger-api-docs)
- [Service Design Document](#service-design-document)
- [Future Work](#future-work)


## Introduction

The Car Listing Marketplace API is designed to provide a seamless experience for users to explore car listings, make bookings, and manage their interactions within the marketplace.

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/car-listing-marketplace-api.git
   cd car-listing-marketplace-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the API:

   ```bash
   npm start
   ```

   The API will be available at `http://localhost:3000`.

## Project Structure

The project follows a layered architecture pattern to promote modularity and maintainability. The layers include:

- **API Layer:** Responsible for handling incoming HTTP requests and invoking the appropriate business logic.

- **Business Layer:** Contains the core business logic and orchestrates interactions between different components.

- **Routes Layer:** Defines the API routes and their corresponding controllers.

The persistence layer is kept lightweight as the primary focus is on business logic. Transactions are efficiently handled to ensure data integrity, especially during complex operations.

## Features

- **Car Search:** Users can search for cars based on various criteria such as make, model, pricing, and more.

- **Car Listing:** Superusers can create car listings that are displayed on the marketplace.

- **Booking:** Users can book a car, and cancellations are allowed after the first 24 hours of booking.

- **Swagger API Docs:** Comprehensive API documentation is available using Swagger.

## Unit Tests

The project includes unit tests written using Jest to ensure the reliability and correctness of critical components.

To run the tests:

```bash
npm test
```

## Docker Compose

The development environment is containerized using Docker Compose, making it easy to set up and manage dependencies. The Docker Compose configuration includes the API service and a PostgreSQL database.

To start the development environment:

```bash
docker-compose up
```

## Prisma ORM

Prisma is used as the ORM (Object-Relational Mapping) tool to interact with the database. It simplifies database operations and ensures a smooth integration between the application and the database.

## Swagger API Docs

Explore the API using Swagger documentation available at `http://localhost:3000/api-docs`.

## Service Design Document

Refer to the [Service Design Document](https://amrhassanabdullah.notion.site/CaTrip-Seezer-a3ed466fd65546c1ad027c33b2dd83f7?pvs=4) on Notion for a detailed overview of the project's service design.


## Future Work
- (feat) Pass the userid in the headers to only allow the owner of the booking to actually cancel it.
- **Productization:** Transform the application into a production-ready state with considerations for scalability, performance, and security.
- **Dockerization for Production:** Extend the Docker configuration for production deployment, including orchestration with tools like Kubernetes.
- **Database Indexing:** Optimize database queries by creating appropriate indexes to enhance performance.
- **CI/CD Integration:** Implement Continuous Integration and Continuous Deployment (CI/CD) pipelines to automate testing and deployment processes.
- **Monitoring and Alerting:** Set up monitoring tools to track query latency, data size, and implement alerts for potential issues.
- **Rate Limiting:** Implement rate-limiting mechanisms to control the frequency of API requests and prevent abuse.
- **Microservices Architecture:** Explore migrating to a microservices architecture for improved scalability and maintainability.
- **Distributed Transactions:** Investigate and implement solutions for handling distributed transactions in a microservices environment.
- **Distributed Tracing:** Integrate distributed tracing tools to monitor and analyze transactions across microservices.
Most of these topics are addressed in the [design document](#service-design-document).
# 🔺 DeltaLog

DeltaLog is a web application based on Employee Time & Task Tracking System designed to help organizations to monitor employee attendance, daily tasks & working hours.

The application allows employees to login to the platform, check in at the start of the day, efficiently take note of all the tasks assigned to them during a work day and tasks they plan to complete, and check out at the end of the day.

The application automatically tracks the tasks carried out by the user and total working time, overtime & undertime between check in and check out.

Built as a containerized, decoupled architecture, it leverages a high-performance **React Vite** frontend, a secure **Spring Boot** REST API backend, and a transactional **PostgreSQL** relational database.

The entire ecosystem is orchestrated using Docker and Docker Compose to guarantee environmental consistency between development, testing, and production states.

---

## Architecture Overview

The application is split into three decoupled service layers running on an isolated virtual network bridge:

1. **Frontend (`frontend-ui`)**: A Single Page Application (SPA) built with React, compiled with Vite, and served via an enterprise-grade **Nginx** reverse proxy on port `80`.

2. **Backend (`backend-api`)**:
   A Java 21 **Spring Boot** application running an embedded Apache Tomcat engine on port `8080`, exposed locally on port `9090`.

It manages token-based authentication and handles business domains via Hibernate/JPA.

3. **Database (`postgres-db`)**:
   An alpine-isolated **PostgreSQL 16** instance exposed locally on port `5433` to prevent conflicts with native local host database engines.

## NETWORK ACCESS PORTS

**Frontend UI**
Internal port: 80
External port: 80

**Backend API**
Internal port: 8080
External port: 9090

**Database (PostgreSQL)**
Internal port: 5432
External port: 5433
note: Flyway has been implemented for versioning & db schema tracking \*\*

---

## Prerequisites

Before launching the application, ensure you have the following software utilities installed on your machine:

- **Docker Desktop** (v20.10.0 or higher)
- **Docker Compose** (v2.20.0 or higher)
- _Optional for local native development:_ **Java 21 JDK** & **Node.js (v20+)**

---

## Configuration & Environment Variables

The application relies on a shared, unified environment file to coordinate database credentials, container networking mappings, and profile specifications.

Create a hidden file at **`backend/infra/.env`** and configure your parameters:

```env
# Database Initialization Parameters
DB_USERNAME=your_secure_user
DB_PASSWORD=your_secure_password

# Spring Boot Framework Drivers
SERVER_ADDRESS=0.0.0.0
SPRING_PROFILES_ACTIVE=default
```

## Launching the Application

The entire multi-container stack can be managed using standard Docker Compose life-cycle commands.
Execute all terminal actions from the project's root folder where the `docker-compose.yml` file lives.

1. Initial Setup and Bootstrapping:
   To compile the source code, download dependency binaries, build image layers, and link data volumes for the first time: 
   
   **`docker compose up --build`**

2. Standard Background Boot:
   To start your application services silently in detached background daemon mode: 
   
   **`docker compose up -d`**

3. Graceful Tear-down:
   To stop execution processes safely and close virtual container interfaces without breaking database storage state pools: 
   
   **`docker compose down`**

4. Hard Structural Factory Reset:
   If you modify database structural keys or need to wipe the relational cache storage completely to start from scratch: 
   
   **`docker compose down -v`**

5. Access postgres db (via terminal):
   **`docker exec -it deltalog-postgres psql -U postgres -d deltalog`**

   To view db data (docker): **`\dt`**
   
   <img width="1470" height="510" alt="image" src="https://github.com/user-attachments/assets/6e7969cc-d0ca-47b0-bfe0-f4d7ed98fc96" />
   

## Default admin access (login)
**email: admin@deltalog.com**
**password: 123456**

## Network Exposure Access Points
Once Docker reports that all healthy checks have successfully resolved, the platform layers are available globally across your web browsers.
Go to `localhost` or `localhost:80`


**Congrats you are now running Delta Log on your machine!**

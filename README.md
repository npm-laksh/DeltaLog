# 🔺 DeltaLog

DeltaLog is a full-stack enterprise resource and log management application. Built as a containerized, decoupled architecture, it leverages a high-performance **React Vite** frontend, a secure **Spring Boot** REST API backend, and a transactional **PostgreSQL** relational database.

The entire ecosystem is orchestrated using Docker and Docker Compose to guarantee environmental consistency between development, testing, and production states.

---

## 🏗️ Architecture Overview

The application is split into three decoupled service layers running on an isolated virtual network bridge:

1. **Frontend (`frontend-ui`)**: A Single Page Application (SPA) built with React, compiled with Vite, and served via an enterprise-grade **Nginx** reverse proxy on port `80`.
2. **Backend (`backend-api`)**: A Java 21 **Spring Boot** application running an embedded Apache Tomcat engine on port `8080`, exposed locally on port `9090`. It manages token-based authentication and handles business domains via Hibernate/JPA.
3. **Database (`postgres-db`)**: An alpine-isolated **PostgreSQL 16** instance exposed locally on port `5433` to prevent conflicts with native local host database engines.

---

## 🛠️ Prerequisites

Before launching the application, ensure you have the following software utilities installed on your machine:

* **Docker Desktop** (v20.10.0 or higher)
* **Docker Compose** (v2.20.0 or higher)
* *Optional for local native development:* **Java 21 JDK** & **Node.js (v20+)**

---

## ⚙️ Configuration & Environment Variables

The application relies on a shared, unified environment file to coordinate database credentials, container networking mappings, and profile specifications. 

Create a hidden file at **`backend/infra/.env`** and configure your parameters:

```env
# Database Initialization Parameters
DB_USERNAME=your_secure_user
DB_PASSWORD=your_secure_password

# Spring Boot Framework Drivers
SERVER_ADDRESS=0.0.0.0
SPRING_PROFILES_ACTIVE=default

🚀 Launching the ApplicationThe entire multi-container stack can be managed using standard Docker Compose life-cycle commands. Execute all terminal actions from the project's root folder where the docker-compose.yml file lives.

1. Initial Setup and BootstrappingTo compile the source code, download dependency binaries, build image layers, and link data volumes for the first time:Bashdocker compose up --build

2. Standard Background BootTo start your application services silently in detached background daemon mode:Bashdocker compose up -d

3. Graceful Tear-downTo stop execution processes safely and close virtual container interfaces without breaking database storage state pools:Bashdocker compose down

4. Hard Structural Factory ResetIf you modify database structural keys or need to wipe the relational cache storage completely to start from scratch:Bashdocker compose down -v

🎯 Network Exposure Access PointsOnce Docker reports that all healthy checks have successfully resolved, the platform layers are available globally across your web browsers:Service ComponentHost Network Access URLInternal Container PortExternal Exposed Host PortReact UI App Layerhttp://localhost8080Spring REST APIhttp://localhost:909080809090PostgreSQL Enginelocalhost:543354325433🔧 

Production Mechanics to Know🔄 SPA Routing Preservation (Nginx)The frontend container utilizes a dedicated internal nginx.conf routing configuration profile that catches client-side routing calls. 

When deep URLs (e.g., /manage-user) are actively refreshed by users, Nginx falls back to serving index.html seamlessly instead of failing with a native browser 404 Not Found response.

⏳ Database Handshake Health Check GuardsThe backend container includes an automated pipeline mechanism check via depends_on -> condition: service_healthy. Spring Boot is actively held in a paused state until PostgreSQL completely passes internal port availability checks via pg_isready. 

This guarantees that Spring never boots prematurely or throws a java.net.UnknownHostException.🗄️ Relational Data PersistenceDatabase data state changes are securely synchronized to a local virtual volume mount system (postgres_data). Tearing down, stopping, or updating service containers will never compromise or delete application tables or stored login records.
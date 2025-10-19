# Architecture Design

The system follows a **3-tier architecture**:

1. **Frontend Layer** – React-based UI for users and admins.
2. **Backend Layer** – Spring Boot REST API.
3. **Database Layer** – MySQL with JPA.

Additional components:

- JWT for authentication.
- Email service for confirmations.
- QR code generator microservice (optional).

## System Architecture

![System Architecture Diagram](architecture-diagrams/system-architecture.png)

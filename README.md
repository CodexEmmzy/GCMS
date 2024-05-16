# Game Center Management Software

## Introduction
Welcome to the application view of our Game Center Management Software. This section provides a concise overview of the application's modules, their interactions, and the overarching architectural design.

## Application View

### General Context
#### Objectives
The primary goal of our Game Center Management Software is to optimize the gaming experience, streamlining session management for both gamers and administrators.

#### Actors
These actors play crucial roles in the Game Center Management Software project, encompassing both internal organizational entities and external users interacting with the system. The distinction between internal and external actors helps in defining their roles and responsibilities within the gaming center environment.

**Internal Actors:**

| Actor                | Description                                                                                                                                                                                                                                                                                        | Role                                       |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| Administration System | This internal actor is responsible for managing and coordinating session bookings within the gaming center. They interact with the system to allocate sessions to users, ensuring a streamlined process for gamers.                                                                      | Facilitates session bookings for users.   |
| Users                | Internal users, such as gamers, engage with the system to start and enjoy gaming sessions. They follow the designated process, from booking a session to activating it, making use of the features provided by the Game Center Management Software.                                        | Utilizes the system to access gaming sessions. |

**External Actors:**

| Actor         | Description                                                                                                                     | Role                                         |
|---------------|---------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|
| Web Client    | This external actor serves as the entry point for users accessing the gaming center remotely. Users can start sessions by interacting with the web client, providing a user-friendly interface for session initiation.                     | Represents the website where users initiate sessions. |
| Desktop Client | The desktop client is an external actor responsible for managing the display system within the gaming center. Admins use this client to book sessions and control the automatic display switch. It plays a vital role in the overall administration and operation of the gaming center. | Controls display and enables admin session bookings. |

### Planning
Application launch before 30th of March

### Application Modules

| Modules             | Technology Stack                                       |
|---------------------|--------------------------------------------------------|
| Frontend            | - Framework: React Typescript                          |
|                     | - Styling: TailwindCSS, SCSS                           |
| Backend             | - Language: Python (Django or Flask)/ Typescript Node  |
|                     | - API: RESTful/ GraphQL API for smooth communication   |
| Database            | - Language: PostgreSQL                                  |
|                     | - Data Stored: User profiles, session data, admin records |
| Session Management  | - Realtime Communication: WebSockets                   |
|                     | - Session Durations: Python timer libraries            |
| Desktop Compatibility | - Framework: Electron.js for desktop application        |
| Notifications       | - Service: Firebase Cloud Messaging                     |
|                     | - Delivery: Push notifications for timely alerts        |
| Admin Dashboard     | - Backend: Node (Express)                               |
|                     | - Frontend: React                                       |
| Security            | - Encryption: SSL/TLS for data in transit               |
|                     | - Authentication: JWT for user authentication and authorization |
| Automatic Display Switch (Desktop App) | - Control: Python (PyQt or Tkinter)         |
|                                          | - Communication: HDMI CEC library (e.g., pyCEC) |

### Target Architecture

#### General Application Architecture
The Game Center Management Software adopts a microservices architecture, facilitating modularity and scalability. It leverages client-server principles for user interactions and employs microservices for distinct functionalities like session management, notification, and admin operations. Major data flows include session bookings, QR code scanning, and real-time analytics. The architecture adheres to a responsive design approach, ensuring seamless user experiences across various devices. The application follows an open API structure, allowing potential integration with third-party systems.

#### Detailed Application Architecture
The application components are categorized into microservices, each responsible for specific functionalities. The static view showcases modules like Session Management, Notification Service, Admin Dashboard, and QR Code Generation. These components interact through well-defined APIs, enabling seamless communication. The dynamic view illustrates the flow of actions, from session booking to automatic display switching, emphasizing logical connections between microservices. Notably, the system prioritizes modularity, enabling independent development and deployment of each microservice.

#### Principles that Dictated the Choices
The chosen microservices architecture aligns with the principles of modularity, scalability, and flexibility. The decision to use Python for the service managing display switching reflects a practical consideration based on its compatibility with this specific task. The adoption of GraphQL for communication enhances efficiency, allowing clients to request only the required data. The architecture's intention is to provide a responsive, modular, and extensible system, promoting adaptability to future requirements.

#### Static View
The static view of the application architecture highlights modules like Session Management, Notification Service, Admin Dashboard, and QR Code Generation. These components are organized based on their functionalities, ensuring a clear and concise representation of the system's structure. Each module encapsulates specific responsibilities, promoting a modular and maintainable design. The static view serves as a foundational guide for developers and stakeholders to comprehend the overall architecture at a glance.

#### Dynamic View
The dynamic view of the Game Center Management Software illustrates the interaction of application modules in various domains during different stages of user engagement. It outlines the main application flows, emphasizing how components dynamically communicate over time. For instance, it visualizes the progression from a gamer booking a session to the activation of the session through QR code scanning, session timer initiation, and finally, the automatic display switch. This view aids in understanding the temporal relationships between modules, offering insights into the system's behavior.

#### Matrix of Application Flows
This matrix provides an overview of the main network flows within the Game Center Management Software. It outlines the source and destination of data exchanges, network types, protocols used, and the read/write/call attributes. Understanding these flows is crucial for system architects, developers, and administrators to ensure efficient communication and data transfer between different components.

| Source                | Destination                             | Protocol         | Mode (R/W/C) |
|-----------------------|-----------------------------------------|------------------|--------------|
| Gamer (Device)        | Session Management (Microservice)       | HTTP/GraphQL     | Call (C)     |
| Session Management    | Notification Service (Microservice)     | HTTP/GraphQL     | Call (C)     |
| Notification Service  | Gamer (Device)                          | Push (Firebase)  | Write (W)    |
| Admin Dashboard (Browser) | Session Management (Microservice)    | HTTP/GraphQL     | Read (R)     |
| Admin Dashboard (Browser) | Database (PostgreSQL)                  | SQL              | Read/Write (RW) |
| QR Code Generation    | Gamer (Device)                          | QR Code          | Read (R)     |
| Display Switch Service | TV Display System                       | HDMI CEC         | Write (W)    |

### Microservices View

#### Essentially Classes
This table organizes the classes, their properties, and their relationships for a clearer and more professional presentation

| Classes        | Properties                                | Relationship                                                                                            |
|----------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------|
| Session        | SessionID, StartTime, EndTime, Status, QRCode | Stored in the "session_data" table. Each session has a unique QR code for access and is linked to admin-assigned TVs. |
| Admin          | AdminID, AdminName, AccessLevel          | Information stored in the "admin_records" table. AccessLevel defines the administrative privileges.    |
| Booking        | BookingID, SessionID, BookingTime        | Associated with the "booking_records" table, recording booking times and linking sessions to TVs.     |
| Notification   | NotificationID, SessionID, Message, Timestamp | Stored in the "notification_data" table. Notifications related to session alerts and details are recorded. |
| DashboardData  | ActiveSessions, SessionDurations, UsagePatterns | Aggregated data retrieved from various tables, providing real-time insights into the gaming center's operations. |
| SystemLog      | LogID, LogType, LogMessage, Timestamp   | Recorded in the "system_logs" table. Stores system logs for monitoring, issue detection, and debugging. |
| QRCode         | QRCodeID, SessionID, CodeData            | QR codes associated with specific sessions are stored in the "qrcode_data" table.                        |

#### System Components

#### Microservices and Their Roles

- **Session Management Service:**
  - Responsible for handling session-related tasks.
  - Communicates with the Database Service to retrieve and update session information.
  - Sends notifications through the Notification Service for timely alerts.

- **QR Code Generation Service:**
  - Generates unique QR codes for each gaming session.
  - Utilizes the QR Code Data Service to store QR code information.
  - Communicates with the Session Management Service to associate QR codes with sessions.

- **Notification Service:**
  - Manages the delivery of notifications to users.
  - Receives notification triggers from the Session Management Service.
  - Utilizes Firebase Cloud Messaging to send push notifications to users' devices.

- **Admin Dashboard Service:**
  - Provides real-time insights and data analytics.
  - Retrieves data from the Database Service for display on the admin dashboard.
  - Allows administrators to manage bookings, allocate TVs, and handle operational tasks.

- **Display Control Service:**
  - Controls the automatic display switch functionality.
  - Interfaces with the Python service responsible for changing display settings.
  - Receives signals from the Session Management Service to trigger display changes.

- **Database Service:**
  - Stores and retrieves essential data for various services.
  - Used by the Session Management, QR Code Generation, and Admin Dashboard services.
  - Ensures data integrity and supports real-time analytics.

### Communication Flow

#### Session Initiation:
- User books a session at the counter.
- Admin Dashboard Service updates booking information in the Database Service.
- QR Code Generation Service generates a unique QR code for the session.
- Session Management Service associates the QR code with the session in the Database Service.

#### User Access:
- User scans the QR code displayed on the TV using their device.
- QR Code Generation Service validates the QR code with the Database Service.
- Session Management Service initiates the gaming session and starts the session timer.

#### Notification Alerts:
- Session Management Service monitors the session timer.
- When the session is about to end, Notification Service sends timely alerts to the user.

#### Admin Insights:
- Admin Dashboard Service regularly retrieves data from the Database Service.
- Provides real-time insights into active sessions, session durations, and overall usage patterns.

#### Automatic Display Switch:
- Session Management Service signals the Display Control Service when the session ends.
- Display Control Service communicates with the Python service to execute the automatic display switch.

### Microservices and Tools Overview:

This table organizes the services, their respective technologies, and the associated DevOps tools for a more professional and structured overview.

| Service                      | Language         | Framework       | Database               | DevOps                                                                                    |
|------------------------------|------------------|-----------------|------------------------|-------------------------------------------------------------------------------------------|
| Session Booking Service      | TypeScript (Node.js) | Express       | PostgreSQL             | Git for version control, Jenkins for continuous integration, Docker for containerization |
| QR Code Generation Service   | TypeScript (Node.js) | Express       | MongoDB (for QR code data) | Git for version control, Jenkins for continuous integration, Docker for containerization |
| Session Management Service   | TypeScript (Node.js) | Express       | Redis (for in-memory data) | Git for version control, Jenkins for continuous integration, Docker for containerization |
| Notification Service         | TypeScript       | NestJS        | Firebase Cloud Messaging | Git for version control, Jenkins for continuous integration, Docker for containerization |
| Admin Dashboard Service      | TypeScript       | Express       | PostgreSQL             | Git for version control, Jenkins for continuous integration, Docker for containerization |
| Automatic Display Switch Service | Python         | Flask/Django  | PostgreSQL/MongoDB     | Git for version control, Jenkins for continuous integration, Docker for containerization |
| Monitoring and Backup Service | TypeScript (Node.js) | Express       | PostgreSQL             | Git for version control, Jenkins for continuous integration, Docker for containerization, Prometheus for monitoring |

### Developer Operations

#### Continuous Integration/Continuous Deployment (CI/CD)
- Implement CI/CD pipelines using Jenkins to automate building, testing, and deployment processes.

#### Version Control:
- Use Git as the version control system to manage and track changes in the codebase.

#### Containerization:
- Dockerize each microservice for consistency across development, testing, and production environments.

#### Orchestration:
- Utilize Kubernetes for orchestrating and managing containerized applications, ensuring scalability and resilience.

#### Infrastructure as Code (IaC):
- Implement Infrastructure as Code using tools like Terraform for managing and provisioning infrastructure.

#### Monitoring and Logging:
- Use Prometheus for monitoring microservices, ensuring proactive issue detection.
- Implement logging frameworks to track errors and facilitate debugging.

#### Security:
- Integrate security practices into CI/CD pipelines.
- Implement SSL/TLS encryption for secure data in transit.

#### Collaboration and Communication:
- Utilize communication tools like Slack and collaborative platforms for effective team communication.

#### Automated Testing:
- Implement automated testing frameworks for unit tests, integration tests, and end-to-end tests.

#### Scalability:
- Design microservices to be independently scalable to meet varying demand.

#### Backup and Recovery:
- Establish regular data backups and implement secure recovery plans for quick system restoration.

In conclusion, this proposed architecture for the Game Center Management Software aims to deliver an immersive gaming experience for users while empowering administrators with efficient tools for operation. By adhering to established business, software, and system architecture principles, we aim to create a solution that not only meets but exceeds the expectations set forth in the official documentation. Note any other features will be addressed during project initiation.

# E-Commerce Platform

e-commerce platform built with Node.js and TypeScript, featuring comprehensive logging capabilities.

## Project Overview

This e-commerce platform is designed to provide a scalable and maintainable solution for online retail operations. It utilizes modern technologies and best practices to ensure reliability and performance.

## Technologies Used

| Category          | Technology                       | Purpose                                                       |
| :---------------- | :------------------------------- | :------------------------------------------------------------ |
| **Backend**       | **Node.js, Express.js**          | Core JavaScript runtime and web framework.                    |
| **Language**      | **TypeScript**                   | Static typing for improved safety and developer experience.   |
| **Database**      | **PostgreSQL**                   | Robust, open-source relational database.                      |
| **ORM**           | **Drizzle ORM**                  | Type-safe, modern ORM for PostgreSQL interactions.            |
| **Validation**    | **Joi**                          | Runtime validation for request schemas.                       |
| **Security**      | **Bcrypt, JSON Web Token (JWT)** | Password hashing and authentication.                          |
| **File Handling** | **Multer**                       | Middleware for parsing `multipart/form-data` (image uploads). |
| **Logging**       | **Winston**                      | Comprehensive, structured logging.                            |

## Project Structure

The project follows a **Modular (Feature-Based) Architecture** for scalability.

```
project-root/
├── logs/                          # Log files (access, combined, error)
├── drizzle/                       # Local storage for product images (using Multer)
│   ├── migration/
│   ├── db.ts
│   └── schema.ts
├── uploads/                       # Local storage for product images (using Multer)
├── src/
│   ├── modules/                   # Feature-based architecture
│   │   ├── auth/                  # User registration and login
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.service.ts
│   │   ├── products/              # Product CRUD, search, and image upload
│   │   │   ├── product.controller.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── product.validation.ts
│   │   │   └── product.service.ts
│   │   └── orders/                # Order placement and history (Transactional)
│   │       ├── order.controller.ts
│   │       ├── order.routes.ts
│   │       ├── order.validation.ts
│   │       └── order.service.ts
│   ├── middlewares/               # Auth (JWT), Authorization (Role), error handler, Multer Upload
│   ├── types/                     # add custom types for authentication
│   ├── utils/
│   │   ├── response.ts            # Handling standardized API responses
│   │   └── winston_log.ts         # Logging configuration
│   ├── app.ts                     # Express application setup and middleware registration
│   └── index.ts                   # Application entry point
├── .env.example
├── drizzle.config.ts
├── env.ts
├── package.json
└── tsconfig.json
```

## Features

### API Endpoints

| Feature      | Endpoint                     | Method   | Authorization | Description                                                 |
| :----------- | :--------------------------- | :------- | :------------ | :---------------------------------------------------------- |
| **Auth**     | `/auth/register`             | `POST`   | Public        | Creates a new user account.                                 |
| **Auth**     | `/auth/login`                | `POST`   | Public        | Authenticates user and returns a JWT.                       |
| **Catalog**  | `/products`                  | `GET`    | Public        | Lists all products with optional **pagination and search**. |
| **Details**  | `/products/:id`              | `GET`    | Public        | Retrieves detailed information for a single product.        |
| **Admin**    | `/products`                  | `POST`   | Admin         | **Creates** a new product with input validation.            |
| **Admin**    | `/products/:id`              | `PUT`    | Admin         | **Updates** an existing product.                            |
| **Admin**    | `/products/:id`              | `DELETE` | Admin         | **Deletes** a product.                                      |
| **Admin**    | `/products/:id/upload-image` | `POST`   | Admin         | Uploads and links a product image.                          |
| **Uploads**  | `/uploads`                   | `GET`    | Public        | View uploaded images.                                       |
| **Ordering** | `/orders`                    | `POST`   | User          | **Places a new order** (uses a database transaction).       |
| **History**  | `/orders`                    | `GET`    | User          | Views the authenticated user's order history.               |

### Architectural Highlights

- **Transactional Integrity:** Order placement is secured using a PostgreSQL transaction (via Drizzle) to guarantee stock level updates and order creation succeed or fail together.
- **Role-Based Access Control (RBAC):** Middleware enforces `Admin` status for sensitive endpoints (e.g., product creation, deletion).
- **Strong Input Validation:** All inputs are validated using Joi schemas to ensure data integrity and security.

---

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn package manager
- **PostgreSQL Database** instance

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Gabin100/e_commerce_platform.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Create a `.env` file based on `.env.example`
   - Set up your environment-specific variables

4. Start the development server:

   ```bash
   npm run dev
   ```

5. migrating database tables:

- create database name: e_commerce_platform_db
- ```bash
  npm run db:migrate
  ```

```

## Logging

The application uses Winston for logging with three different log types:

- Access logs: HTTP request logging
- Error logs: Application errors and exceptions
- Combined logs: All log levels combined

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Gabin100 - GitHub: [@Gabin100](https://github.com/Gabin100)

Project Link: [https://github.com/Gabin100/e_commerce_platform](https://github.com/Gabin100/e_commerce_platform)
```

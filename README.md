# E-Commerce Platform

A robust e-commerce platform built with Node.js and TypeScript, featuring comprehensive logging capabilities.

## Project Overview

This e-commerce platform is designed to provide a scalable and maintainable solution for online retail operations. It utilizes modern technologies and best practices to ensure reliability and performance.

## Technologies Used

- Node.js
- TypeScript
- Winston (for logging)

## Project Structure

```
├── logs/
│   ├── access/      # Access logs
│   ├── combined/    # Combined logs
│   └── error/       # Error logs
├── src/
│   ├── app.ts       # Application setup
│   ├── env.ts       # Environment configuration
│   ├── index.ts     # Entry point
│   └── utils/
│       └── winston_log.ts  # Logging configuration
├── package.json     # Project dependencies
└── tsconfig.json   # TypeScript configuration
```

## Features

- Structured logging system with separate access, error, and combined logs
- TypeScript for enhanced type safety and better development experience
- Environment-based configuration
- Modular architecture for scalability

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

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

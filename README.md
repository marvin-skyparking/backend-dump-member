# Backend Dump Member

## Overview

Dump SKY PARKING REGISTER DATA

## Getting Started

To get started with this project, follow the steps below:

### Prerequisites

Make sure you have the following installed:

- Node.js (version 20.11 or higher)
- Yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>

2. Navigate to the project directory:

   ```bash
   cd <project-directory>

3. Install dependencies:
   ```bash
   yarn install




# Available Scripts

This project includes several scripts to help with development, building, and managing the database. Below is a summary of each script and its purpose.

## Scripts

- **`build`**: Compile TypeScript files to JavaScript.
  ```bash
  yarn build

- **`start`**: Start the server in development mode with automatic reloading
  ```bash
  yarn start

- **`dev`**: Start the dev server in development mode with automatic reloading
  ```bash
  yarn dev

- **`Create Migration`**: Generate a new Sequelize migration file. Replace <migration-name> with the name of your migration.
  ```bash
  yarn migration:generate --name <migration-name>

- **`Migration Database`**: Apply all pending migrations to the database.
  ```bash
  yarn migrate

- **`migration:undo:`**:  Undo the last applied migration
  ```bash
  yarn migration:undo

- **`migration:undo:all`**:  Undo the last applied migration
  ```bash
  yarn migration:undo:all



  

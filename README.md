# WTWR (What to Wear?) – Backend

This repository contains the backend for the **WTWR (What to Wear?)** application.

The server provides a secure REST API that allows users to register, log in, and manage clothing items based on current weather conditions. It is built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**, and uses **JWT authentication** to protect private routes.

## Features

- User registration and login
- JWT authentication and protected routes
- CRUD operations for clothing items
- Like and unlike clothing items
- MongoDB database integration
- Request validation with Celebrate/Joi
- Centralized error handling
- RESTful API

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Celebrate / Joi
- ESLint

## Running the Project

Install dependencies:

```bash
npm install
```

Start the production server:

```bash
npm run start
```

Start the development server:

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| POST   | `/signup`              | Register a new user                |
| POST   | `/signin`              | Log in and receive a JWT           |
| GET    | `/users/me`            | Get the current user's profile     |
| PATCH  | `/users/me`            | Update the current user's profile  |
| GET    | `/items`               | Get all clothing items             |
| POST   | `/items`               | Create a clothing item             |
| DELETE | `/items/:itemId`       | Delete a clothing item             |
| PUT    | `/items/:itemId/likes` | Like a clothing item               |
| DELETE | `/items/:itemId/likes` | Remove a like from a clothing item |

## Live API

Backend API:

https://wtwr-backend-7hd1.onrender.com

## Frontend

Live Demo:

https://filipmcetinje.github.io/se_project_react/

Frontend Repository:

https://github.com/Filipmcetinje/se_project_react

## Backend Repository

https://github.com/Filipmcetinje/se_project_express

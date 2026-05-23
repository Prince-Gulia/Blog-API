# Blog API

A RESTful backend API for a blogging platform built with Node.js, Express, and PostgreSQL. Users can register, authenticate, create posts, and comment on posts with full authorization logic.

## Live URL
https://blog-api-1fy0.onrender.com

## Features
- JWT authentication with access and refresh tokens
- Password hashing with bcrypt
- Full CRUD operations for posts
- Nested comments on posts
- Authorization — users can only edit/delete their own posts and comments
- PostgreSQL with relational data (users, posts, comments)

## Tech Stack
- Node.js
- Express.js
- PostgreSQL (Supabase)
- JSON Web Tokens (JWT)
- bcrypt

## Database Schema
users
  - id, email, password, created_at

posts
  - id, title, content, user_id (FK), created_at

comments
  - id, content, user_id (FK), post_id (FK), created_at

refresh_tokens
  - id, user_id (FK), token, created_at

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/signup | Register a new user | No |
| POST | /auth/login | Login and get tokens | No |
| POST | /auth/refresh | Get new access token | No |
| GET | /auth/profile | Get current user profile | Yes |

### Posts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /posts | Create a new post | Yes |
| GET | /posts | Get all posts | No |
| GET | /posts/:id | Get single post | No |
| PUT | /posts/:id | Update your post | Yes |
| DELETE | /posts/:id | Delete your post | Yes |

### Comments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /posts/:id/comments | Add a comment | Yes |
| DELETE | /posts/:id/comments/:commentId | Delete your comment | Yes |

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL database (Supabase)

### Installation
1. Clone the repo
   git clone https://github.com/Prince-Gulia/blog-api

2. Install dependencies
   npm install

3. Create .env file
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d

4. Run the server
   npm run dev

## Authorization
Protected routes require a Bearer token in the Authorization header:
   Authorization: Bearer your_access_token

Users can only update or delete their own posts and comments.
Any attempt to modify another user's content returns 403 Forbidden.

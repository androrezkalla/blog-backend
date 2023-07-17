# Blog Backend

This is the backend server for a simple blog application. It provides the necessary API endpoints to manage posts and comments.

## Features

- User authentication and authorization
- Create, update, and delete posts
- Create, update, and delete comments
- Get a list of all posts or comments
- Get a single post or comment by ID

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- npm (Node Package Manager)
- PostgreSQL database

## Installation

To install and set up the Blogging Platform, follow these steps:

1. Clone the repository:

git clone https://github.com/your-username/blog-backend.git

2. Install the dependencies:

```
cd blog-backend
npm install
```

3. Set up the database:

- Create a PostgreSQL database.
- Update the database configuration in the `.env` file with your database credentials:

```
SESSION_SECRET=<session-secret>
DATABASE_URL=<database-url>
```

5. Run the databse migrations
```
npx sequelize-cli db:migrate

```

4. Run the application:

```
npm start
```

The server will start running on http://localhost:4000.

## Usage

You can use tools like Postman or cURL to interact with the API endpoints. Here are the available endpoints:

- **Authentication**
- `POST /signup` - Create a new user account
- `POST /login` - Log in to an existing user account
- `DELETE /logout` - Log out the currently logged-in user

- **Posts**
- `POST /posts` - Create a new post
- `GET /posts` - Get a list of all posts
- `GET /posts/:postId` - Get a single post by ID
- `PATCH /posts/:postId` - Update a post by ID
- `DELETE /posts/:postId` - Delete a post by ID

- **Comments**
- `GET /comments` - Get a list of all comments
- `GET /comments/:commentId` - Get a single comment by ID
- `GET /posts/:postId/comments` - Get all comments for a specific post
- `POST /posts/:postId/comments` - Create a new comment for a specific post
- `PATCH /comments/:commentId` - Update a comment by ID
- `DELETE /comments/:commentId` - Delete a comment by ID

Make sure to include the necessary authentication headers for authenticated endpoints.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/28379415-fa2f436f-740b-4b4b-a8dc-e1c3e9e5cbb3)

## License

This project is licensed under the [MIT License](LICENSE).
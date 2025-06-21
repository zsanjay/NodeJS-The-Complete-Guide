
# 🚀 Node.js - The Complete Guide

A comprehensive Node.js project repository built while following **"Node.js - The Complete Guide"** course. This repository covers everything from basic server setup to building scalable, real-world Node.js applications with Express, MongoDB, authentication, file uploads, REST APIs, GraphQL, deployment, and more.

---

##  Course Topics Covered

### 1. Node.js Fundamentals
- Node.js runtime, global object, event loop
- Working with core modules: `fs`, `http`, `path`, `os`
- Understanding async programming and callbacks
- Working with streams and buffers

### 2. Event-Driven Architecture
- Using and creating EventEmitters
- Handling events and listeners
- Async flow control

### 3. Express.js Framework
- Creating servers with Express
- Routing (basic and advanced)
- Middleware concepts
- Error handling

### 4. Templating Engines
- Working with Pug, Handlebars, and EJS
- Passing data to views
- Layouts and partials

### 5. Building a Complete Shop Application
- Dynamic routing
- Adding and removing products
- Cart and order management
- MVC architecture

### 6. MongoDB and Mongoose
- Connecting to MongoDB
- CRUD operations
- Schema & Model definitions
- Relationships between collections

### 7. User Authentication & Authorization
- Signup & login with hashing (bcrypt)
- Sessions and cookies
- CSRF protection
- Role-based access control

### 8. Working with Files and Images
- File uploads with `multer`
- Image storage and access
- File handling with `fs`

### 9. RESTful APIs
- Building REST endpoints
- Consuming APIs with Postman
- Status codes and error handling
- Stateless authentication with JWT

### 10. GraphQL APIs
- GraphQL basics and schema design
- Queries, mutations, resolvers
- Authentication with GraphQL
- Advanced input types and relations

### 11. WebSockets with Socket.io
- Real-time communication
- Chat app using Socket.io
- Broadcasting messages

### 12. Deployment
- Preparing for production
- Environment variables
- Deploying on Heroku/Vercel/Render
- Using MongoDB Atlas in cloud

### 13. Payments Integration
- Stripe integration
- Creating payment sessions
- Handling payment success/failure

### 14. Advanced Node.js Concepts
- Async/Await and Promises
- Error logging
- Security best practices

---

## 🛠️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/zsanjay/NodeJS-The-Complete-Guide.git

# Navigate to the specific project
cd NodeJS-The-Complete-Guide/

# Install dependencies
npm install

# Start the server
npm start
```

---

Setting up an Express server
Route handling (GET, POST)
Serving static files
Basic API endpoints
📄 Example: express/app.js

```js
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to Express!');
});

app.get('/api/data', (req, res) => {
  res.json({ data: 'Sample data' });
});

app.listen(3000, () => console.log('Express server running on port 3000'));
```
---

Middleware in Express
app.use() for global middleware
Custom logging middleware
Error-handling middleware


```js
// Custom Logger Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass control to the next middleware
});

// Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
```

---

🌐 Tech Stack

Node.js
Express.js
MongoDB & Mongoose
Socket.io
Stripe API
GraphQL
Templating Engines: Pug, EJS, Handlebars
Authentication: Sessions, Cookies, JWT & bcrypt
Deployment: Heroku / Render / Vercel

---

✍️ Author

Sanjay Mehta

LinkedIn
GitHub

---

🙌 Acknowledgements

Based on the course Node.js - The Complete Guide (MVC, REST APIs, GraphQL, Deno) by Academind / Maximilian Schwarzmüller.


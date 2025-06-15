
# Node.js The Complete Guide Project 🚀

This project demonstrates the foundational concepts of Node.js including the native `http` module, usage of the Express framework, and middleware handling.

---

Node version frontend - v10.24.1
Node version backend - v16.20.0


## 📚 Topics Covered

### ✅ 1. Node.js Core Concepts
- Non-blocking I/O
- Event-driven architecture
- `require()` and CommonJS modules
- `fs`, `path`, and `url` modules

### ✅ 2. Native HTTP Module (`http`)
- Creating a server using `http.createServer`
- Handling basic routing with if-else
- Sending HTML and JSON responses manually

---

```js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello from Node.js!');
  } else if (req.url === '/api') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Hello API' }));
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000, () => console.log('Server running at http://localhost:3000'));
```

---
✅ 3. Express.js

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

✅ 4. Middleware in Express
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

🛠️ How to Run

Install dependencies:
npm install
Start the Express server:
npm start
Visit:
http://localhost:3000/

---

📦 Dependencies

express
nodemon (dev)

---

🙌 Author

Sanjay Mehta
GitHub: @zsanjay

---
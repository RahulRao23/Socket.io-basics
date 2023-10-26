// blog_app/index.js
const express = require('express');
const { dbConnect } = require('./config/dbConnect');

/* Get all routes */
const userRouter = require('./src/routes/user.routes');

const app = express();
const PORT = 3000;

/* Establish DB connection */
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from an Express API!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

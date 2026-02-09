const express = require('express');
const todoroutes = require('./routes/todo.routes');
const dotenv = require('dotenv');
const conn = require('./config/db.js');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const path = require("path");
const ROOT_DIR = path.resolve();
dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/todos", todoroutes);

app.get('/', (req, res) =>{
    res.send("Hello World! Server running!");
})


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(ROOT_DIR, "Frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(ROOT_DIR, "Frontend", "dist", "index.html")
    );
  });
}



app.listen(PORT,() => {
    conn.connectDB();
    console.log("Server running on http://localhost:${PORT}");
});
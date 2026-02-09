const express = require('express');
const todoroutes = require('./routes/todo.routes');
const dotenv = require('dotenv');
const conn = require('./config/db.js');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/todos", todoroutes);

app.get('/', (req, res) =>{
    res.send("Hello World! Server running!");
})


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,  "Frontend", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
  });
}



app.listen(PORT,() => {
    conn.connectDB();
    console.log("Server running on http://localhost:${PORT}");
});
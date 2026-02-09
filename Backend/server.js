const express = require("express");
const todoroutes = require("./routes/todo.routes");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// database
connectDB();

// api routes
app.use("/api/todos", todoroutes);

// production frontend serving
const ROOT_DIR = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(ROOT_DIR, "Frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(ROOT_DIR, "Frontend", "dist", "index.html")
    );
  });
}

// server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

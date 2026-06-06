const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { errorConverter, errorHandler } = require("./middlewares/error");
const cors = require("cors");
const path = require("path");
dotenv.config();
const routes = require("./routes");
const logger = require("./config/logger");
// const fs = require("fs");


const app = express();
app.use(cors());
app.use(express.json({ limit: "100mb" }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
  useNewUrlParser: true,
});

mongoose.connection.on("error", (error) => {
  console.log("connection failed", error);
  logger.error("connection failed");
});

mongoose.connection.on("connected", (connected) => {
  console.log("connected with data base....");
  logger.info("connected with data base");
});

// Use your API routes
app.use("/aviation-app/api/v1", routes);

app.use(express.static(path.resolve(__dirname, "public")));
/* Front end build */
app.use(express.static(path.join(__dirname, "client/out")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/out", "index.html"));
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/out", "[slug].html"));
});
// // convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;

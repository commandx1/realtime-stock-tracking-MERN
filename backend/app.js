const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const categoryRoutes = require("./routes/category-router");
const productRoutes = require("./routes/product-router");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

io.sockets.on("connection", (socket) => {
  socket.on("updateProduct", (data) => {
    io.sockets.emit("product", data);
  });
});

app.use((req, res, next) => {
  res.status(404).send({
    message: "Sayfa Bulunamadı...",
  });
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Bilinmeyen bir hata meydana geldi." });
});

const port = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3krv8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => {
    server.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });

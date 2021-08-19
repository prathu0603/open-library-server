const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();

// Config
const app = express();
const PORT = process.env.PORT;

// DB Setting
const url = process.env.MONGO_URL;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;
con.on("open", () => console.log("MongoDB Connected !"));

// MiddleWare
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(cors());

app.use("/", require("./Routes/book.js"));

app.get("/", (request, response) => {
  response.send("Ebook Project");
});

app.listen(PORT, () => console.log("Server Started"));

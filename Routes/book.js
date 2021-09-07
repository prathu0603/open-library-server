const express = require("express");
const Book = require("../Models/book.js");
const cloudinary = require("cloudinary").v2;

// cloudinary Config
cloudinary.config({
  cloud_name: "prathu0603",
  api_key: "288858815555214",
  api_secret: "dX0I77nqvDuGOCe15-Q_VlitlIc",
  // secure: true
});

const router = express.Router();

router.route("/books").get(async (request, response) => {
  const bookData = await Book.find();
  response.status(200).send(bookData);
});

router.route("/create-book").post(async (request, response) => {
  try {
    //   Get File Data From Client
    const imageData = request.body.image;
    const pdfData = request.body.pdf;
    const { name, desc, category, price } = request.body;

    // Upload Files To Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageData, {
      upload_preset: "dev_upload",
    });
    const pdfUpload = await cloudinary.uploader.upload(pdfData, {
      upload_preset: "dev_upload",
    });
    // console.log(
    //   `Image Link : ${imageUpload.secure_url}, Pdf Link : ${pdfUpload.secure_url}, Name : ${name} , desc : ${desc}, category : ${category}`
    // );
    const book = new Book({
      name,
      category,
      desc,
      price,
      image: imageUpload.secure_url,
      pdf: pdfUpload.secure_url,
    });
    await book.save();
    response.status(200).send("Book Data Uploaded");
  } catch (err) {
    console.error(err);
    response.status(500).json({ err: "Something went wrong" });
  }
});

router.route("/admin").post(async (request, response) => {
  const { password } = request.body;
  try {
    if (password === "let123") {
      return response.status(200).send("Access Granted");
    } else return response.status(401).send("Unauthorized");
  } catch (error) {
    console.error(error);
    response.status(500).send("Server Error");
  }
});

module.exports = router;

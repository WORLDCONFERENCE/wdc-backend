const express = require("express");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRouter = require("./router/authRouter");
const cors = require("cors");
const bodyParser = require("body-parser");
const Major = require("./router/MajorRoutes");
const { BlobServiceClient } = require('@azure/storage-blob');
const userRoutes = require("./router/userRoutes");
const AwardRoutes = require("./router/AwardRoutes");
const Routes = require("./router/paymentData.js");
dotenv.config();
// const __dirname=path.resolve();
const app = express();

app.use("/files", express.static(path.join(__dirname, "/files")));
app.use("/abstract", express.static(path.join(__dirname, "/abstract")));
app.use("/Resume", express.static(path.join(__dirname, "/Resume")));
app.use("/photo", express.static(path.join(__dirname, "/photo")));
app.use("/cv", express.static(path.join(__dirname, "/cv")));
app.use("/biography", express.static(path.join(__dirname, "/biography")));



mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGO_DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex:true
  },
  (err) => {
    if (err) console.log(err);
    console.log("Database connection successfully");
  }
);

mongoose.connection.on("disconnected", () => {
  console.log("Mongodb is disConnected");
});



app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

const connectionString = process.env.CONNECTIONSTRING;

const containerName = process.env.CONTAINERNAME;
const FilesName = process.env.FILES;
const Abstract = process.env.ABSTRACT;
const Photo = process.env.PHOTO;
const CvName = process.env.CV;
const Biography = process.env.BIOGRAPHY;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "files");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    // Get the file from the request
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Get a reference to the container
    const containerClient = blobServiceClient.getContainerClient(FilesName);

    // Get a reference to the blob
    const blobName = file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file to Azure Storage Blob
    const uploadResponse = await blockBlobClient.uploadFile(file.path);

    // // Delete the temporary file
    // fs.unlinkSync(file.path);

    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('An error occurred while uploading the file.');
  }

});

const storages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "abstract");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const uploads = multer({ storage: storages });
app.post("/api/document", uploads.single("file"), async (req, res) => {

  try {
    // Get the file from the request
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Get a reference to the container
    const containerClient = blobServiceClient.getContainerClient(Abstract);

    // Get a reference to the blob
    const blobName = file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file to Azure Storage Blob
    const uploadResponse = await blockBlobClient.uploadFile(file.path);

    // // Delete the temporary file
    // fs.unlinkSync(file.path);

    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('An error occurred while uploading the file.');
  }

});

const storages1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Resume");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const uploads1 = multer({ storage: storages1 });
app.post("/api/resume", uploads1.single("file"), async (req, res) => {
  try {
    // Get the file from the request
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Get a reference to the container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get a reference to the blob
    const blobName = file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file to Azure Storage Blob
    const uploadResponse = await blockBlobClient.uploadFile(file.path);

    // // Delete the temporary file
    // fs.unlinkSync(file.path);

    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('An error occurred while uploading the file.');
  }

});

const storages2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "photo");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const uploads2 = multer({ storage: storages2 });
app.post("/api/photo", uploads2.single("file"), async (req, res) => {
  try {
    // Get the file from the request
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Get a reference to the container
    const containerClient = blobServiceClient.getContainerClient(Photo);

    // Get a reference to the blob
    const blobName = file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file to Azure Storage Blob
    const uploadResponse = await blockBlobClient.uploadFile(file.path);

    // // Delete the temporary file
    // fs.unlinkSync(file.path);

    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('An error occurred while uploading the file.');
  }


});

const storages3 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "cv");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const uploads3 = multer({ storage: storages3 });
app.post("/api/cv", uploads3.single("file"), async (req, res) => {
  try {
    // Get the file from the request
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Get a reference to the container
    const containerClient = blobServiceClient.getContainerClient(CvName);

    // Get a reference to the blob
    const blobName = file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file to Azure Storage Blob
    const uploadResponse = await blockBlobClient.uploadFile(file.path);

    // // Delete the temporary file
    // fs.unlinkSync(file.path);

    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('An error occurred while uploading the file.');
  }

});

const storages4 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "biography");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const uploads4 = multer({ storage: storages4 });
app.post("/api/biography", uploads4.single("file"), async (req, res) => {
  try {
    // Get the file from the request
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Get a reference to the container
    const containerClient = blobServiceClient.getContainerClient(Biography);

    // Get a reference to the blob
    const blobName = file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file to Azure Storage Blob
    const uploadResponse = await blockBlobClient.uploadFile(file.path);

    // // Delete the temporary file
    // fs.unlinkSync(file.path);

    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('An error occurred while uploading the file.');
  }

});

app.use("/router", authRouter);
app.use("/major", Major);
app.use("/routes", userRoutes);
app.use("/award", AwardRoutes);
app.use("/", Routes);

app.get("/", (req, res) => {
  res.send("Hii this is a backend check");
});

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Port can be successfully connected ${process.env.PORT}`);

});

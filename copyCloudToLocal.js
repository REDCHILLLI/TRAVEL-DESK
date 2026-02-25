import mongoose from "mongoose";
import Tour from "./models/Tour.js";
import Blog from "./models/Blog.js";

async function copyCloudToLocal() {
  try {
    // 1️⃣ Connect to CLOUD MongoDB
    const cloudConn = await mongoose.createConnection(
      "mongodb+srv://shuence:shubham02@travelworld.mj2z7vq.mongodb.net/tours_booking",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connected to CLOUD MongoDB");

    // 2️⃣ Connect to LOCAL MongoDB
    const localConn = await mongoose.createConnection(
      "mongodb://127.0.0.1:27017/travelworld",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connected to LOCAL MongoDB");

    // 3️⃣ Define cloud and local models
    const CloudTour = cloudConn.model("Tour", new mongoose.Schema({}, { strict: false }), "tours");
    const CloudBlog = cloudConn.model("Blog", new mongoose.Schema({}, { strict: false }), "blogs");

    const LocalTour = localConn.model("Tour", new mongoose.Schema({}, { strict: false }), "tours");
    const LocalBlog = localConn.model("Blog", new mongoose.Schema({}, { strict: false }), "blogs");

    // 4️⃣ Fetch data from cloud
    const tours = await CloudTour.find().lean();
    const blogs = await CloudBlog.find().lean();

    // 5️⃣ Insert into local MongoDB
    if (tours.length > 0) await LocalTour.insertMany(tours);
    if (blogs.length > 0) await LocalBlog.insertMany(blogs);

    console.log(`Copied ${tours.length} tours and ${blogs.length} blogs to local MongoDB`);
    process.exit();
  } catch (err) {
    console.error("Error copying data:", err);
    process.exit(1);
  }
}

copyCloudToLocal();

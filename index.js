import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoute from "./router/auth.js";
import tourRoute from "./router/tours.js";
import userRoute from "./router/users.js";
import reviewRoute from "./router/review.js";
import bookingRoute from "./router/bookings.js";
import searchRoute from "./router/Search.js";
import contactRoute from "./router/contact.js";
import blogRoute from "./router/blog.js";
import commentRoute from "./router/comment.js";
import walletRoute from "./router/wallet.js";
import complaintRoute from "./router/Complaint.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

mongoose.set("strictQuery", false);

async function connect() {
    try {   
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB Database Connected");
    } catch (err) {
        console.log("MongoDB Database Connection Failed");
    }
}

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};


mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected locally"))
    .catch(err => console.log("MongoDB connection failed:", err));


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.get("/test-cookie", (req, res) => {
    console.log("Cookies:", req.cookies); // check if access_token is received
    res.json({ cookies: req.cookies });
});

app.use("/api/auth", authRoute);
app.use("/api/tours", tourRoute);
app.use("/api/search", searchRoute);
app.use("/api/users", userRoute);
app.use("/api/review", reviewRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/contact", contactRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/comment", commentRoute);
app.use("/api/wallet", walletRoute);
app.use("/api/complaint", complaintRoute);


app.listen(port, () => {
    connect();
    console.log("Server is listening on port", port);
});
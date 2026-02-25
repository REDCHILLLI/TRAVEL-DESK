import jwt from "jsonwebtoken";
import User from "../models/User.js";

const errorHandler = (res, statusCode, message) => {
    return res.status(statusCode).json({ message });
};

const verifyToken = async(req, res, next) => {
    const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];

    console.log("Token from cookie:", token); // ✅ see if token arrives
    if (!token) return errorHandler(res, 401, "No token provided");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // ✅ check payload

        const user = await User.findById(decoded.userId);
        console.log("User found:", user); // ✅ check user in DB
        if (!user) return errorHandler(res, 401, "Invalid token");

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return errorHandler(res, 401, "Invalid token");
    }
};


export const verifyUser = (req, res, next) => {
    console.log("req.user:", req.user);
    if (req.user) {
        next();
    } else {
        return errorHandler(res, 403, "Access denied");
    }
};

export const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return errorHandler(res, 403, "Access denied");
    }
};

export default verifyToken;
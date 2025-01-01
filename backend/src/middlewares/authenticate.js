import jwt from 'jsonwebtoken';
import { Config } from '../config/index.js';

const authenticate = (req, res, next) => {
    // Get token from Authorization header
    const token = req.cookies['jwt-token'] || req.headers.authorization?.split(' ')[1];

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ success: false, message: "Authentication failed, token not found" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, Config.ACCESS_TOKEN_SECRET);

        // Attach the decoded user information to the request
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authenticate;

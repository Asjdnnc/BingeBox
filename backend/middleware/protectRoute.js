import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Check for token in cookies
    const token = req.cookies["netflix-jwt"];
    console.log("Token found in cookies:", token); // Debugging log

    if (!token) {
      console.log("No token found in cookies");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No Token Provided" });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token payload:", decoded); // Debugging log
    } catch (error) {
      console.log("Token verification failed:", error.message); // Debugging log
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid Token" });
    }

    // Validate userId exists in decoded payload
    if (!decoded.userId) {
      console.log("Token does not contain userId");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Malformed Token" });
    }

    // Find the user associated with the token
    const user = await User.findById(decoded.userId).select("-password");
    console.log("User found in database:", user); // Debugging log

    if (!user) {
      console.log("User not found for token:", decoded.userId); // Debugging log
      return res
        .status(404)
        .json({ success: false, message: "Unauthorized - User Not Found" });
    }

    // Attach the user to the request object
    req.user = user;
    console.log("User attached to req:", req.user); // Debugging log

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message); // Debugging log
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

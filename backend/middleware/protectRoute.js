import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Check for token in cookies
    const token = req.cookies["netflix-jwt"];
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
    } catch (error) {
      console.log("Token verification failed:", error.message);
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
    if (!user) {
      console.log("User not found for token:", decoded.id);
      return res
        .status(404)
        .json({ success: false, message: "Unauthorized - User Not Found" });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

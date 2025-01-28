import express from "express";
import {
  authCheck,
  logout,
  signin,
  signup,
} from "../controller/auth.control.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/protected-route", protectRoute, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Access granted",
    user: req.user,
  });
});
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/signup", signup);
router.get("/authCheck",protectRoute, authCheck);

export default router;

import express from "express";
import {
  authCheck,
  logout,
  signin,
  signup,
} from "../controller/auth.control.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/logout", logout);
router.post("/signup", signup);
router.get("/authCheck", authCheck);

export default router;

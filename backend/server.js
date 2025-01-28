import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";

import { ENV_VARS } from "./config/envVar.js";
import connectDB from "./config/db.js";

const app = express();
const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "https://binge-box-pi.vercel.app",  // Allow requests from your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allow these methods
  credentials:true,
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
}));

app.use("/api/auth", authRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/tv", tvRoutes);
app.use("/api/search", searchRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connectDB();
});

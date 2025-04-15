import express from 'express';
import { connectDB } from './config/database.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import moodRouter from './routes/mood.js';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

const app = express();
dotenv.config()

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});

const PORT = process.env.PORT
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    preflightContinue: false,
  })
);

app.use("/", apiLimiter);
app.use("/", authRouter);
app.use("/mood", moodRouter)

if ( process.env.NODE_ENV ==="production" ) {
  app. use(express.static(path.join(__dirname,"../client/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Listening on port 4000");
    });
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });

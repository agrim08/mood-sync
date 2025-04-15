import express from 'express';
import { connectDB } from './config/database.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import moodRouter from './routes/mood.js';
import rateLimit from 'express-rate-limit';

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});

app.use(express.json());
app.use(cookieParser())

app.use("/", apiLimiter);
app.use("/", authRouter);
app.use("/", moodRouter)

connectDB()
  .then(() => {
    app.listen(4000, () => {
      console.log("Listening on port 4000");
    });
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });

import express from "express";
import User from "../models/user.js";
import {userAuth} from "../middleware/userAuth.js";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

const authRouter = express.Router();

dotenv.config()

authRouter.post("/signup", async (req, res) => {
    try {
      const { username, emailId, password } = req.body;
      const user = await User.findOne({ emailId });
      if (user) {
        return res.status(400).send("User already exists");
      }

      const newUser = new User({
        username,
        emailId,
        password,
      });
  
      await newUser.save();
  
      const token = await newUser.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      return res.status(201).json({ message: "User created successfully", data: newUser });

    } catch (err) {
      console.log(err);
      res.status(500).send("INTERNAL SERVER ERROR");
    }
  });

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid password");
        }
        const token = await user.getJWT();
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000), 
        });
        return res.status(200).json({ message: "Login successful", data: user });

    } catch (err) {
        console.log(err);
        res.status(500).send("INTERNAL SERVER ERROR: ");
    }
})

authRouter.get("/logout", async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).send("Logout successful");
    } catch (err) {
        console.log(err);
        res.status(500).send("INTERNAL SERVER ERROR: ");
    }
})

authRouter.post('/forgot_password',async (req, res) => {
    const { emailId } = req.body;
    if (!emailId) return res.status(400).json({ error: 'Email is required.' });

    try {
        const user = await User.findOne({ emailId });
        if (!user) return res.status(404).json({ error: 'No user found with that email.' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000;
        
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = otpExpires;
        await user.save();
    
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
});
  
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.emailId,
        subject: 'Your Password Reset OTP',
        text: `Your OTP for password reset is ${otp}. It expires in 10 minutes.`,
      });
        res.status(200).json({ message: 'OTP sent to your email address.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

authRouter.post("/reset_password",async (req, res) => {
    const { emailId, newPassword, otp } = req.body;
  
    try {
      const user = await User.findOne({ emailId });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (
        !user.resetPasswordOTP ||
        user.resetPasswordOTP !== otp ||
        user.resetPasswordOTPExpires < Date.now()
      ) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }
  
      user.password = newPassword;
  
      user.resetPasswordOTP = null;
      user.resetPasswordOTPExpires = null;
  
      await user.save();
  
      return res.status(200).json({ message: "Password reset successful." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
  });

authRouter.get("/user_details", userAuth, async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).select("username emailId");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({
        user:user
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
  });


  authRouter.post("/send_mail", userAuth, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('username emailId');
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const reportLink = `http://localhost:5173/stats`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.emailId,
        subject: 'Your Weekly Mood Report',
        html: `
          <p>Hello ${user.username},</p>
          <p>Your weekly mood report is now available.</p>
          <p><a href="${reportLink}">View your weekly report</a></p>
        `,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
  
      res.status(200).json({ message: 'Weekly report email sent.', info });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
  });

export default authRouter;
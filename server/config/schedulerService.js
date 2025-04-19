import schedule from 'node-schedule';
import nodemailer from 'nodemailer';
import Mood from '../models/mood.js';
import WeeklyInsight from '../models/weeklyReport.js';
import User from '../models/user.js';
import { generateWeeklyInsights } from './genAi.js';
import dotenv from 'dotenv';

dotenv.config(); 

// Run every Sunday at midnight
export function startWeeklyInsightScheduler() {
  schedule.scheduleJob('0 0 * * 0', async function() {
    try {
      console.log('Running weekly insight generation job...');
      
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      
      const users = await User.find({}).select('_id username emailId');
      
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      for (const user of users) {
        try {
          const existingInsight = await WeeklyInsight.findOne({
            user: user._id,
            weekStartDate: { $gte: startDate, $lte: endDate }
          });
          
          if (existingInsight) {
            console.log(`Weekly insights already exist for user ${user._id}`);
            await sendWeeklyEmail(transporter, user);
            continue;
          }
          
          const moodEntries = await Mood.find({
            user: user._id,
            date: { $gte: startDate, $lte: endDate }
          }).sort({ date: 1 });
          
          if (moodEntries.length === 0) {
            console.log(`No mood entries found for user ${user._id}`);
            continue;
          }
          
          const insights = await generateWeeklyInsights(moodEntries);
          
          const newInsight = new WeeklyInsight({
            user: user._id,
            weekStartDate: startDate,
            weekEndDate: endDate,
            moodTrends: insights.moodTrends,
            improvementTips: insights.improvementTips,
            userInsights: insights.userInsights,
            additionalFeedback: insights.additionalFeedback
          });
          
          await newInsight.save();
          console.log(`Weekly insights generated for user ${user._id}`);
          
          await sendWeeklyEmail(transporter, user);
        } catch (userError) {
          console.error(`Error processing user ${user._id}:`, userError);
        }
      }
      
      console.log('Weekly insight generation job completed');
    } catch (error) {
      console.error('Error in weekly insight generation job:', error);
    }
  });
}

async function sendWeeklyEmail(transporter, user) {
  try {
    const reportLink = `http://localhost:5173/stats`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.emailId,
      subject: 'Your Weekly Mood Report',
      html: `
        <p>Hello ${user.username},</p>
        <p>Your weekly mood report is now available. <a href="${reportLink}">Login to your account</a> to view it.</p>
        <p>Thank you for using our service.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.username}:`, info.response);
    return info;
  } catch (error) {
    console.error(`Error sending email to ${user.username}:`, error);
    throw error;
  }
}

export async function sendManualWeeklyEmail(userId) {
  try {
    const user = await User.findById(userId).select('username emailId');
    if (!user) {
      throw new Error("User not found");
    }
    
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    return await sendWeeklyEmail(transporter, user);
  } catch (error) {
    console.error('Error sending manual email:', error);
    throw error;
  }
}
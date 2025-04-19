// services/schedulerService.js
import schedule from 'node-schedule';
import Mood from '../models/mood.js';
import WeeklyInsight from '../models/weeklyReport.js';
import User from '../models/user.js'; // Assuming you have a User model
import { generateWeeklyInsights } from './genAi.js';

// Run every Sunday at midnight
export function startWeeklyInsightScheduler() {
  schedule.scheduleJob('0 0 * * 0', async function() {
    try {
      console.log('Running weekly insight generation job...');
      
      // Get end date (now) and calculate start date (7 days ago)
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      
      // Get all users
      const users = await User.find({});
      
      for (const user of users) {
        // Check if insights already exist for this week
        const existingInsight = await WeeklyInsight.findOne({
          user: user._id,
          weekStartDate: { $gte: startDate, $lte: endDate }
        });
        
        if (existingInsight) {
          console.log(`Weekly insights already exist for user ${user._id}`);
          continue;
        }
        
        // Get all mood entries for the week
        const moodEntries = await Mood.find({
          user: user._id,
          date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });
        
        if (moodEntries.length === 0) {
          console.log(`No mood entries found for user ${user._id}`);
          continue;
        }
        
        // Generate insights using Gemini
        const insights = await generateWeeklyInsights(moodEntries);
        
        // Save insights to database
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
      }
      
      console.log('Weekly insight generation job completed');
    } catch (error) {
      console.error('Error in weekly insight generation job:', error);
    }
  });
}
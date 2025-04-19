// routes/weeklyInsightRoutes.js
import express from 'express';
import Mood from '../models/mood.js';
import WeeklyInsight from '../models/weeklyReport.js';
import { userAuth } from '../middleware/userAuth.js';
import { generateWeeklyInsights } from '../config/genAi.js';

const weeklyInsightRouter = express.Router();

// Generate weekly insights manually
weeklyInsightRouter.post('/generate-insights', userAuth, async (req, res) => {
  try {
    const { weekStartDate } = req.body;
    if (!weekStartDate) {
      return res.status(400).json({ error: 'Week start date is required' });
    }

    const start = new Date(weekStartDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    // Check if insights already exist for this week
    const existingInsight = await WeeklyInsight.findOne({
      user: req.user._id,
      weekStartDate: { $gte: start, $lte: end }
    });

    if (existingInsight) {
      return res.status(200).json({
        message: 'Weekly insights already exist for this period',
        insight: existingInsight
      });
    }

    // Get all mood entries for the week
    const moodEntries = await Mood.find({
      user: req.user._id,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    if (moodEntries.length === 0) {
      return res.status(404).json({ error: 'No mood entries found for the selected week' });
    }

    // Generate insights using Gemini
    const insights = await generateWeeklyInsights(moodEntries);

    // Save insights to database
    const newInsight = new WeeklyInsight({
      user: req.user._id,
      weekStartDate: start,
      weekEndDate: end,
      moodTrends: insights.moodTrends,
      improvementTips: insights.improvementTips,
      userInsights: insights.userInsights,
      additionalFeedback: insights.additionalFeedback
    });

    const savedInsight = await newInsight.save();

    res.status(201).json({
      message: 'Weekly insights generated successfully',
      insight: savedInsight
    });
  } catch (error) {
    console.error('Error generating weekly insights:', error);
    res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

// Get all weekly insights for the user
weeklyInsightRouter.get('/get-all-insights', userAuth, async (req, res) => {
  try {
    const insights = await WeeklyInsight.find({ user: req.user._id }).sort({ weekStartDate: -1 });
    res.status(200).json({ insights });
  } catch (error) {
    console.error('Error fetching weekly insights:', error);
    res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

// Get a specific week's insights
weeklyInsightRouter.get('/get-insight/:weekStartDate', userAuth, async (req, res) => {
  try {
    const { weekStartDate } = req.params;
    if (!weekStartDate) {
      return res.status(400).json({ error: 'Week start date is required' });
    }

    const start = new Date(weekStartDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const insight = await WeeklyInsight.findOne({
      user: req.user._id,
      weekStartDate: { $gte: start, $lte: end }
    });

    if (!insight) {
      return res.status(404).json({ error: 'No insights found for the selected week' });
    }

    res.status(200).json({ insight });
  } catch (error) {
    console.error('Error fetching weekly insight:', error);
    res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

export default weeklyInsightRouter;
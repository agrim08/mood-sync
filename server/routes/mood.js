// routes/moods.js
import express from 'express';
import Mood from '../models/mood.js';
import { userAuth } from '../middleware/userAuth.js';

const moodRouter = express.Router();

moodRouter.post('/add_mood', userAuth, async (req, res) => {
    try {
      const { mood, journal, date } = req.body;
      const entryDate = date ? new Date(date) : new Date();
      const start = new Date(entryDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(entryDate);
      end.setHours(23, 59, 59, 999);
      const existingEntry = await Mood.findOne({
        user: req.user._id,
        date: { $gte: start, $lte: end },
      });
      if (existingEntry) {
        return res.status(400).json({ error: 'Mood for this date already exists.' });
      }
      const newMood = new Mood({
        user: req.user._id,
        mood,
        journal,
        date: entryDate,
      });
      const savedMood = await newMood.save();
      res.status(201).json({
        message: 'Mood entry created successfully.',
        mood: savedMood,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
    }
  });

moodRouter.get('/get_all_mood/:userId',userAuth ,async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.params.userId }).sort({ date: -1 });
    res.status(200).json({ moods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

moodRouter.get('/get_mood/date/:userId', userAuth ,async (req, res) => {
    try {
      const { date } = req.query; 
      if (!date) {
        return res.status(400).json({ error: 'Date query parameter is required.' });
      }
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      const moods = await Mood.find({
        user: req.params.userId,
        date: {
          $gte: start,
          $lt: end,
        },
      }).sort({ date: -1 });
  
      res.status(200).json({ moods });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
    }
  });

  moodRouter.put('/edit_mood/:moodId', userAuth, async (req, res) => {
    try {
      const { mood, journal } = req.body;
      const updatedMood = await Mood.findOneAndUpdate(
        { _id: req.params.moodId, user: req.user._id },
        { mood, journal },
        { new: true, runValidators: true }
      );
      if (!updatedMood) {
        return res.status(404).json({ error: 'Mood entry not found.' });
      }
      res.status(200).json({
        message: 'Mood entry updated successfully.',
        mood: updatedMood,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
    }
  });

moodRouter.get('/summary/:userId', userAuth ,async (req, res) => {
    try {
      const { userId } = req.params;
      const summary = await Mood.aggregate([
        {
          $match: { user: mongoose.Types.ObjectId(userId) }
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
              mood: '$mood'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: { year: '$_id.year', month: '$_id.month' },
            moods: {
              $push: {
                mood: '$_id.mood',
                count: '$count'
              }
            }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
      
      res.status(200).json({ summary });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
    }
  });

moodRouter.get('/summary/weekly/:userId', userAuth ,async (req, res) => {
    try {
      const { userId } = req.params;
      const weeklySummary = await Mood.aggregate([
        {
          $match: { user: mongoose.Types.ObjectId(userId) }
        },
        {
          $group: {
            _id: {
              year: { $isoWeekYear: '$date' },
              week: { $isoWeek: '$date' },
              mood: '$mood'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: { year: '$_id.year', week: '$_id.week' },
            moods: {
              $push: {
                mood: '$_id.mood',
                count: '$count'
              }
            }
          }
        },
        { $sort: { '_id.year': 1, '_id.week': 1 } }
      ]);
  
      res.status(200).json({ weeklySummary });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
    }
  });

export default moodRouter;

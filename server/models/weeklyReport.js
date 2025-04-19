import mongoose from 'mongoose';

const { Schema } = mongoose;

const WeeklyInsightSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weekStartDate: {
    type: Date,
    required: true,
  },
  weekEndDate: {
    type: Date,
    required: true,
  },
  moodTrends: {
    type: String,
    required: true,
  },
  improvementTips: {
    type: String,
    required: true,
  },
  userInsights: {
    type: String,
    required: true,
  },
  additionalFeedback: {
    type: String,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  }
});

WeeklyInsightSchema.index({ user: 1, weekStartDate: 1 }, { unique: true });

export default mongoose.model('WeeklyInsight', WeeklyInsightSchema);
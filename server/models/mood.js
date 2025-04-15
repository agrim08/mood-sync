import mongoose from 'mongoose';

const { Schema } = mongoose;
const moodEnum = ['Happy', 'Sad', 'Angry', 'Anxious', 'Calm'];

const MoodSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  mood: {
    type: String,
    enum: moodEnum,
    required: true,
  },
  journal: {
    type: String,
    maxlength: 140,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Mood', MoodSchema);

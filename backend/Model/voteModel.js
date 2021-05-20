import mongoose from 'mongoose';

const voteSchema = mongoose.Schema({
  food: {
    type: String,
    required: true,
  },
  points: {
    type: String,
    required: true,
  },
});

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;

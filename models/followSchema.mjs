import mongoose from "mongoose";


const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'artist',
    index: true,
    required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userData',
    index: true,
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure that the combination of follower and following is unique
followSchema.index({ follower: 1, following: 1 }, { unique: true });

export default mongoose.model('Follow', followSchema);

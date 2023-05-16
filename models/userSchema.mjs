import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    languages: {
      type: [String],
      default: [],
    },
    likedSongs: {
      type: [String],
      ref:'songs'
    },
    playlist: {
      type: [String],
      default: [],
    },
 
    imgUrl: {
      type: String,
    },
    album: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    // eslint-disable-next-line comma-dangle
  }
);

export default mongoose.model('userData',userSchema)
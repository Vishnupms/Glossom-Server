import mongoose from "mongoose";

const ArtistModel= new mongoose.Schema(
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
      songs: {
        type: [String],
        default: [],
      },
      languages: {
        type: [String],
        default: [],
      },
      likedSongs: {
        type: [String],
        default: [],
      },
      playlist: {
        type: [String],
        default: [],
      },
      imgURL: {
        type: String,
      },
      album: {
        type: Array,
        default: [],
      },
      isBanned: {
        type: Boolean,
        default: false,
      },
      isVerified: {
        type: Boolean,
        default: false,
      }
    },
    {
      timestamps: true,
    }
  );
  
  export default mongoose.model('artist',ArtistModel)
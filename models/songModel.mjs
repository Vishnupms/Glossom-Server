import mongoose from "mongoose";

const SongModel = new mongoose.Schema(
    {
      name: { type: String, required: true },
      artist: { type: String, required: true },
      songURL: { type: String, required: true },
      imgURL: { type: String,required:true },
      language: { type: String, required: true },
      album: { type: String, },
      category: { type:String, required:true }
    },
    {
      timestamps: true,
    },
  
  );
  
 export default mongoose.model('songs',SongModel)
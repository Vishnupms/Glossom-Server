import mongoose from "mongoose";

const SongModel = new mongoose.Schema(
    {
      name: { type: String, required: true },
      artist: { type: String, required: true },
      songURL: { type: String, required: true },
      artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'artist', required: true },
      imgURL: { type: String,required:true },
      language: { type: String, required: true },
      album: { type: String, },
      views:{type:Number,default:0},
      playTime:{type:Number},
      category: { type:String, required:true },
      IsHide: { type: Boolean, default: false }
    },
    {
      timestamps: true,
    },
  
  );
  
 export default mongoose.model('songs',SongModel)
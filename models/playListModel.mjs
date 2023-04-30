import mongoose from "mongoose";

const PlaylistModel = new mongoose.Schema({
  title: {
    type: String,
    
  },
  description: {
    type: String,
  },
    owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userData",
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "songs",
    
      
    },
  ],
  imgURL:{
    type:String,

  },


},
{
  timestamps:true
});

PlaylistModel.index({ owner: 1 }, { unique: false });

export default mongoose.model('playlist',PlaylistModel)
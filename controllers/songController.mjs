import artistModel from "../models/artistModel.mjs";
import songModel from "../models/songModel.mjs";
import mongoose from "mongoose";

export const artistAddTrack = async (req, res) => {
  try {
    const artistId = req.decodedToken.artistId;
    console.log(req.body, "body");
    console.log(artistId);
    const artist = await artistModel.findOne({ _id: artistId });
    const addSong = new songModel({
      name: req.body.datas.songName,
      artist: req.body.name,
      artistId: artist._id,
      songURL: req.body.audio,
      imgURL: req.body.img,
      album: req.body.datas.albumName,
      language: req.body.datas.language,
      category: req.body.category,
    });

    const savedSong = await addSong.save();

    const savedArtist = await artistModel.updateOne(
      {
        _id: artistId,
      },
      { $push: { songs: savedSong._id } }
    );

    return res.status(200).send({
      success: true,
      message: "song uploaded successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message, success: false });
  }
};

export const getAllSongs = async (req, res) => {
  try {
    const data = await songModel.find().sort({ createdAt: -1 });
    if (data) {
      return res.json({ success: true, songs: data });
    } else {
      return res.json({ success: false, message: "Songs not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};

export const getAllSongsOfAnArtist = async (req, res) => {
  const id = req.decodedToken.artistId;
console.log(id,"idd")
  try {
    const Artist = await artistModel.findById(id);
    // const data = await song.find({ artist: Artist.name, IsHide: false });
    
    const data = await songModel.find({artistId: Artist._id})
    console.log(data,"hereeeeee")

    if (data) {
      return res.json({ success: true, songs: data });
    } else {
      console.log("reached")
      return res.json({ success: false, message: "Songs not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};

export const setView = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid song ID");
  }
  try {
    const song = await songModel.findById(id);

    if (!song) {
      return res.status(404).send("Song not found");
    }

    song.views++;
    await song.save();
    return res.status(200).send("View count incremented");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
//......................delete.................
export const deleteSongAsArtist = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const deletedSong = await songModel.deleteOne({ _id: id });
    console.log(deletedSong, "dele5ted");
    if (deletedSong) {
      return res.json({
        success: true,
        message: "Song is Successfully deleted",
      });
    } else {
      return res.json({ success: false, message: "Cannot delete this song" });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};

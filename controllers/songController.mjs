import artistModel from "../models/artistModel.mjs";
import songModel from "../models/songModel.mjs";

export const artistAddTrack = async (req, res) => {
  try {
    const artistId = req.params.id;
    const addSong = new songModel({
      name: req.body.data.songName,
      artist: req.body.name,
      songURL: req.body.audio,
      imgURL: req.body.img,
      album:req.body.data.albumName,
      language: req.body.data.language,
      category: req.body.category,

    });

    const savedSong = await addSong.save()

    const savedArtist = await artistModel.updateOne(
      {
        _id: artistId,
      },
      { $push: { songs: savedSong._id } }
    );
    console.log(savedArtist);
    return res.status(200).send({
      success: true,
      message: "send successfull",
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
      return res.json({ success: false, message: 'Songs not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};

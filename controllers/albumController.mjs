import albumModel from "../models/albumModel.mjs";
import songModel from "../models/songModel.mjs";
import artistModel from "../models/artistModel.mjs";

export const createAlbum = async (req, res) => {
  try {
    let { artistId } = req.decodedToken
    const { name, songId, imgURL } = req.body;

    const existingAlbums = await albumModel.find({ createdBy: artistId });
    const existingAlbum = existingAlbums.find((album) => album.title === name);
    if (existingAlbum) {
      return res.status(400).send({ message: "Album with the same name already exists", success: false });
    }

    const newAlbum = new albumModel({
      title: name,
      songs: songId,
      imageUrl: imgURL,
      createdBy: artistId,
    });
    await newAlbum.save();

    const albums = await albumModel.find({ createdBy: artistId }).populate("songs");
    res.status(200).send({ message: "Album created successfully", album: albums, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error in creating album", success: false });
  }
};
export const getAllAlbum = async(req,res)=>{
    
  try {

    const album = await albumModel.find().populate("songs")
    res
    .status(200)
    .send({
        message:"album get successfully",
        success:true,
        data:album,
    
    });
} catch (error) {

    res
    .status(200)
    .send({
        message:"error in getting playlist",
        success: false
    })
    
}
}

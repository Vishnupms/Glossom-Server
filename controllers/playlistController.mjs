import playListModel from "../models/playListModel.mjs"


export const addPlaylist = async(req,res)=>{
    try {
        const id = req.decodedToken.userId
        const count = await playListModel.find({owner:id}).count()
        let name = `My Playlist #${count+1}`
        const newPlaylist = new playListModel({
            title: name,
            owner: id
        })
        await newPlaylist.save()
        res
        .status(200)
        .send({message:"Playlist created successfully",success:true})
     
    } catch (error) {
    
        res
        .status(200)
        .send({message:"error in creating playlist",success:false})

    }
}
//...................GET ALL PLAYLIST...............
export const getAllPlaylist = async(req,res)=>{
    
    try {
        const id = req.decodedToken.userId
        const playlist = await playListModel.find({owner:id}).sort({ createdAt: -1 });
        res
        .status(200)
        .send({
            message:"playlist get successfully",
            success:true,
            data:playlist
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
export const deletePlaylist = async(req,res)=>{
    try{
        const userId = req.decodedToken.userId;
        const playId = req.params.id;
        const playlist = await playListModel.findByIdAndDelete({_id: playId, owner: userId});
        res.status(200).send({
            message:"Playlist deleted successfully",
            success:true,
        });
    }
    catch (error) {
        res.status(500).send({
            message:"Error in deleting playlist",
            success: false
        });
    }
}

export const getPlaylist= async(req,res)=>{
    try{
        const userId = req.decodedToken.userId;
        const playId = req.params.id;
        const playlist = await playListModel.findOne({_id: playId, owner: userId});
        res.status(200).send({
            message:"Playlist GET successfully",
            success:true,
            playlist:playlist
        });
    }
    catch (error) {
    
        res.status(500).send({
            message:"Error in deleting playlist",
            success: false
        });
    }
}

export const addSongToPlaylist = async (req, res) => {
    try {

      playListModel.findOne({ _id: req.body.playid }).then((playlist) => {

        if (playlist.songs.includes(req.body.songid)) {
          res.status(200).send({
            message: "Song already Exists",
            success: false,
          });
        } else {
          playlist.songs.push(req.body.songid);
          playlist.save();
          res.status(200).send({
            message: "Song Added successfully",
            success: true,
          });
        }
      });
    } catch (error) {

      res.status(200).send({
        message: "Error in adding Songs",
        success: false,
      });
    }
  }
  export const getPlaylistSongs = async(req,res)=>{
    try{
        const Id = req.params.id
      
        const playlist = await playListModel.find({_id:Id}).populate("songs")
   
        res.status(200).send({
            message:"songs fetched successfully",
            success:true,
            data:playlist
        });

    }
    catch(error){
    }
  }
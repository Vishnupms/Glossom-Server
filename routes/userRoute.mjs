import express, { Router } from "express";
import * as controller from "../controllers/userController.mjs";
import * as playlist from "../controllers/playlistController.mjs";
import * as follow from "../controllers/followController.mjs";
import * as song from "../controllers/songController.mjs";
import * as album from "../controllers/albumController.mjs";


import { auth } from "../middlewares/Auth.mjs";

const router = express.Router();

router.post("/signup", controller.userSignup);
router.post("/sendOtp", controller.sendOtp);
router.post("/resendotp", controller.resendOtp);
router.post("/login", controller.userLogin);

router.get("/verifyUser", auth, controller.checkUser);
router.post("/updateProfile/:id", controller.updateProfile);
router.get("/getProfile/:id", controller.getProfile);


router.get("/get-all-songs", auth, song.getAllSongs);
router.get("/get-all-album", auth, album.getAllAlbum);



//................PLAYLIST..........................

router.post("/add-playlist", auth, playlist.addPlaylist);
router.get("/get-all-playlist", auth, playlist.getAllPlaylist);
router.post("/delete-playlist/:id", auth, playlist.deletePlaylist);
router.get("/get-playlist/:id", auth, playlist.getPlaylist);
router.post("/add-to-playlist", auth, playlist.addSongToPlaylist);
router.get("/get-playlist-songs/:id", auth, playlist.getPlaylistSongs);

//...................Like song................................
router.post("/like-song/:userId/:trackId", auth, controller.likeSongs);
router.get("/check-liked/:id/:songId", auth, controller.checkLiked);
router.get("/get-liked-songs", auth, controller.getLikedSongs);

//...................follow artist...........................
router.post("/follow-artist/:id/:artistId", auth, follow.followArtist);
router.get("/is-following/:id/:artistId", auth, follow.isfollowing);
router.delete("/unfollow-artist/:id/:artistId", auth, follow.unFollowing);
//....................setView...................
router.post("/set-view/:id", auth, song.setView);

export default router;

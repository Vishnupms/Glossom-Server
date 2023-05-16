import express, { Router } from 'express'
import * as controller from '../controllers/artistController.mjs'
import * as music from '../controllers/songController.mjs'
import * as album from '../controllers/albumController.mjs'
import * as follow from '../controllers/followController.mjs'
import { auth } from '../middlewares/Auth.mjs';


const router = express.Router();



router.post("/signup",controller.artistSignup)
router.post("/login",controller.artistLogin)
router.get("/verifyArtist",auth, controller.checkArtist)
router.post("/add-track",auth, music.artistAddTrack);
router.post("/update-artist-profile/:id", controller.updateProfileArtist);
router.post('/add-album',auth,album.createAlbum)
router.get("/get-my-tracks",auth , music.getAllSongsOfAnArtist);

router.get("/follow-chart/:id",auth, follow.artistChart);
router.delete("/delete-song/:id",auth, music.deleteSongAsArtist);






export default router;
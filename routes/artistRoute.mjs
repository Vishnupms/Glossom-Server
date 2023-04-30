import express, { Router } from 'express'
import * as controller from '../controllers/artistController.mjs'
import * as music from '../controllers/songController.mjs'
import { auth } from '../middlewares/Auth.mjs';
const router = express.Router();



router.post("/signup",controller.artistSignup)
router.post("/login",controller.artistLogin)

router.post("/addtrack/:id", music.artistAddTrack);
router.get('/get-all-tracks', music.getAllSongs);




export default router;
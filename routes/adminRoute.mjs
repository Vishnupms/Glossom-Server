import express, { Router } from 'express'
import * as controller from '../controllers/adminController.mjs'
import { auth } from '../middlewares/Auth.mjs';
const router = express.Router();

router.post("/login",controller.adminLogin)
router.get("/show-users", controller.showUsers)
router.get("/show-artist", controller.showArtist)
router.get("/verify-artist/:id", controller.verifyArtist)
router.get("/block-user/:id", controller.blockUser)

//............CATEGORY...............
router.post("/add-category",auth, controller.addGenre)
router.get("/get-genre",auth, controller.getGenre)

//............Dashboard...............







export default router;
import express, { Router } from 'express'
import * as controller from '../controllers/adminController.mjs'
import { auth } from '../middlewares/Auth.mjs';
const router = express.Router();

router.post("/login",controller.adminLogin)
router.get("/show-users",auth, controller.showUsers)
router.get("/show-artist",auth, controller.showArtist)
router.get("/verify-artist/:id",auth, controller.verifyArtist)
router.get("/block-user/:id",auth, controller.blockUser)
router.get("/verifyAdmin", auth, controller.checkAdmin);


//............CATEGORY...............
router.post("/add-category",auth, controller.addGenre)
router.get("/get-genre",controller.getGenre)

//............Dashboard...............
router.get("/get-all-count",auth,controller.getCount)
router.get("/user-chart",auth, controller.userChart);







export default router;
import { Router } from "express"
import songController from "../controllers/song.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/addSong").post(verifyJWT,upload.fields([
        {
            name: "thumbnail",// will be same on the frontend and the backend
            maxCount: 1
        },
        {
            name: "song",
            maxCount: 1
        }
    ]), songController.addSong);


export default router;
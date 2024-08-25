import { Router } from 'express'
import {verifyJWT} from "../middlewares/auth.middleware.js"
import playlistController from '../controllers/playlist.controller.js'
const router = new Router()


router.route('/createPlaylist').post(verifyJWT, playlistController.createPlaylist)
router.route('/updateplaylist').post(verifyJWT, playlistController.updatePlaylist)
router.route('/deletePlaylist').post(verifyJWT, playlistController.deletePlaylist)
router.route('/getAllPlaylists').get(verifyJWT, playlistController.getAllPlaylists)


export default router
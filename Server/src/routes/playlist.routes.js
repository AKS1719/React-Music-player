import { Router } from 'express'
import {verifyJWT} from "../middlewares/auth.middleware.js"
import playlistController from '../controllers/playlist.controller.js'
const router = new Router()


router.route('/createPlaylist').post(verifyJWT, playlistController.createPlaylist)
router.route('/updatePlaylist').post(verifyJWT, playlistController.updatePlaylist)
router.route('/deletePlaylist').post(verifyJWT, playlistController.deletePlaylist)
router.route('/addToPlaylist').post(verifyJWT, playlistController.addToPlaylist)
router.route('/getAllPlaylists').get(verifyJWT, playlistController.getAllPlaylists)
router.route('/getAllSongs').post(verifyJWT, playlistController.getAllSongsFromPlaylist)


export default router
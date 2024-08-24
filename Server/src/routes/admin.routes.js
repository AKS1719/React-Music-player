import {Router} from 'express'
import admin from '../controllers/admin.controller.js'
import { verifyAdminJWT } from '../middlewares/adminAuth.middleware.js'

const router = Router()

router.route('/registerAdmin').post(admin.registerAdmin)
router.route('/loginAdmin').post(admin.loginAdmin)
router.route('/logoutAdmin').post(verifyAdminJWT,admin.logoutAdmin)
router.route('/getAdmin').get(verifyAdminJWT, admin.getAdmin)

export default router
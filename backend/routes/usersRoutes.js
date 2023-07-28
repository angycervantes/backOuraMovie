const express = require('express')
const router = express.Router()
const { registerUser, updateMylist, loginUser, getUserData, getMyList } = require('../controllers/usersControllers')
const { protect } = require('../middleware/authMiddleware')


router.post ('/', registerUser)
router.put ('/:id', protect, updateMylist)
router.post ('/login', loginUser)
router.get ('/getMe', protect, getUserData)
router.get ('/list', protect, getMyList)

module.exports = router
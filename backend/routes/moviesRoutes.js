const express = require('express')
const router = express.Router()
const { getMovies, createMovies, updateMovies, deleteMovies, getMyList } = require('../controllers/movieControllers')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(getMovies).post(createMovies)
//router.get('/', getMovies)
//router.post('/', createMovies)

router.route('/:id').delete(deleteMovies).put(updateMovies)
//router.put('/:id', updateMovies)
//router.delete('/:id', deleteMovies)



module.exports = router
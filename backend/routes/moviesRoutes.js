const express = require('express')
const router = express.Router()
const { getMovies, createMovies, updateMovies, deleteMovies } = require('../controllers/movieControllers')

router.route('/').get(getMovies).post(createMovies)
//router.get('/', getMovies)
//router.post('/', createMovies)

router.route('/:id').delete(deleteMovies).put(updateMovies)
//router.put('/:id', updateMovies)
//router.delete('/:id', deleteMovies)



module.exports = router
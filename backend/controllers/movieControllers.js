const asyncHandler = require('express-async-handler')
const Movie = require('../models/moviesModel')

const getMovies = asyncHandler( async (req, res) => {

    const movies = await Movie.find()

    res.status(200).json({movies})
})




const createMovies = asyncHandler( async (req, res) =>{

    if(!req.body.original_title){
        res.status(400)
        throw new Error('Porfavor ingresa una película')
    }

    const movie = await Movie.create({
        adult: req.body.adult,
        backdrop_path: req.body.backdrop_path,
        genre_ids: req.body.genre_ids,
        id: req.body.id,
        original_language: req.body.original_language,
        original_title: req.body.original_title,
        overview: req.body.overview,
        poster_path: req.body.poster_path,
        popularity: req.body.popularity,
        title: req.body.title,
        video: req.body.video,
        vote_average: req.body.vote_average,
        vote_count: req.body.vote_average,
        release_date: req.body.release_date
    })

    res.status(201).json(movie)
})


const updateMovies = asyncHandler( async (req, res) =>{

    const movie = await Movie.findById(req.params.id)

    if(!movie) {
        res.status(400)
        throw new Error ('Esa movie no existe')
    }

    const movieUpdated = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true})
    res.status(200).json(movieUpdated)
})



const deleteMovies = asyncHandler( async (req, res) =>{

    const movie = await Movie.findById(req.params.id)

    if(!movie) {
        res.status(400)
        throw new Error ('Esa movie no existe')
    }

    movie.deleteOne()

    res.status(200).json({id: req.params.id})
})


module.exports ={
  getMovies,
  createMovies,
  updateMovies,
  deleteMovies
}
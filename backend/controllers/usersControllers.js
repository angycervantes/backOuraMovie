const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')
const Movie = require('../models/moviesModel')

const registerUser = asyncHandler( async (req, res) => {

    const { email, password, admin, userMovieList } = req.body

    if (!email || !password){
        res.status(400)
        throw new Error ('Faltan datos')
    }

    //verificar si existe el usuario
    const userExists = await User.findOne({ email })

    if (userExists){
        res.status(400)
        throw new Error('Este usuario ya existe')
    }

    //Hash al password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // crear el usuario
    const user = await User.create({
        email,
        password: hashedPassword,
        admin,
        userMovieList
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            email: user.email,
            password: user.password,
            admin: user.admin,
            userMovieList: user.userMovieList
        })
    }else{
        res.status(400)
        throw new Error('No se pudo crear el usuario')
    }

    res.json(req.user)
})


//// update la lista de pelis de usario

const updateMylist = asyncHandler( async (req, res) =>{

    const {idMovieList} = req.body.userMovieList

    const user = await User.findById(req.params.id)

    if(!user) {
        res.status(400)
        throw new Error ('Este usuario no existe')
    }

    //verificar si existe  la pelicula
    const movieExists = await Movie.findOne({_id: idMovieList})

    if (!movieExists){
        res.status(200).json({message: 'No se encontro este id de película'})
    }
    
    //verificar que no se repita en la MI LISTA DE PELIS
    const movieRepetido = await User.findOne({userMovieList: idMovieList})

    if (movieRepetido){
        res.status(200).json({message: 'ya existe la película en tu lista'})
    }

    const mylistUpdated = await User.findByIdAndUpdate( req.params.id, {$push: req.body}, { new: true})
    res.status(200).json(mylistUpdated)
})

//// update para borrar la lista de pelis de usario
// const deleteAMovie = asyncHandler( async (req, res) =>{

//     //const {idMovieList} = req.body.userMovieList
    
//     const user = await User.findById(req.params.id)

//     if(!user) {
//         res.status(400)
//         throw new Error ('Este usuario no existe')
//     }

//     const movieOnList = await User.findOne({userMovieList: req.body.userMovieList })

//     if(!movieOnList) {
//         res.status(400)
//         throw new Error ('Esa película no esta en tu lista')
//     }

//     movieOnList.deleteOne({userMovieList: req.body.userMovieList })

//     //const movieDelete = await User.findByIdAndRemove({userMovieList:req.body.userMovieList})

//     res.status(200).json({movieOnList})
// })


// Logear
const loginUser = asyncHandler( async  (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            email: user.email,
            password: user.password,
            admin: user.admin,
            userMovieList: user.userMovieList,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error ('Credenciales incorrectas')
    }
})

const getUserData = asyncHandler( async (req, res) => {
    /* Parche */
    const moviesList = (req.user.userMovieList)
    const dataMoviesList = await Movie.find({_id: moviesList})
    const u = req.user
    u.userMovieList=dataMoviesList
    res.json(u)
})

const getMyList = asyncHandler( async (req, res) => {
    
    const moviesList = (req.user.userMovieList)

    const dataMoviesList = await Movie.find({_id: moviesList})

    res.json({dataMoviesList})
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: '30m'
    })
}


module.exports = {
    registerUser,
    updateMylist,
    loginUser,
    getUserData,
    getMyList
}
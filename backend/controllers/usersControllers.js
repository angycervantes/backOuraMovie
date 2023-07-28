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

    //const {admin, userMovieList} = req.body

    const user = await User.findById(req.params.id)

    if(!user) {
        res.status(400)
        throw new Error ('Este usuario no existe')
    }


    //verificar si existe  la pelicula
    // const movieExists = await Movie.findOne({ userMovieList })
    

    // if (!movieExists){
    //     res.status(200).json({message: 'No esxiste'})
    // }
    
    const mylistUpdated = await User.findByIdAndUpdate( req.params.id, {$push: req.body}, { new: true})
    res.status(200).json(mylistUpdated)
    
    
    
})


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
    res.json(req.user)
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: '30m'
    })
}

/// No funciono :(
const getMyList = asyncHandler( async (req, res) => {

    const movies = await Movie.find({movie: req.user.userMovieList})

    res.status(200).json({movies})
})

module.exports = {
    registerUser,
    updateMylist,
    loginUser,
    getUserData,
    getMyList
}
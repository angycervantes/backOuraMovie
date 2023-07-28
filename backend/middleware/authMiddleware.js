const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

const protect = asyncHandler( async( req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //vamos a obtener el token del header de autorizacion
            token = req.headers.authorization.split(' ')[1]

            //verificacion el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //obtengo los datos del usuario del token
            req.user = await User.findById(decoded.id).select('-password')

            next()

        } catch (error) {
            console.log(error)
            res.status(400)
            throw new Error ('Acceso no autorizado')
        }
    }

    if(!token){
        res.status(401)
        throw new Error('Acceso no autorizado, no fue proporcionado el token')
    }
})


module.exports = { protect }
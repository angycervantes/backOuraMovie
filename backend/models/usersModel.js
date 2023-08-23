const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Por favor teclea tu correo'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Por favor teclea tu contraseña']
    },
    admin: {
        type: Boolean,
        default: false
    },
    userMovieList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            default: []
        }
    ]
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)
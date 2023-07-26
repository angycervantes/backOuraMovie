const mongoose = require('mongoose')


const movieSchema = mongoose.Schema({
    "adult": Boolean,
    "backdrop_path": String,
    "genre_ids": [],
    "id": Number,
    "original_language": String,
    "original_title": {
        type: String,
        required: [true, 'porfavor teclea un título']
    },
    "overview": String,
    "popularity": Number,
    "poster_path": String,
    "release_date": Date,
    "title": String,
    "video": Boolean,
    "vote_average": Number,
    "vote_count": Number
},{
    timestamps: true
})

module.exports = mongoose.model('Movie', movieSchema)
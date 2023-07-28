const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB  = require('./config/db')
const port = process.env.PORT || 5000  


connectDB()

const app = express()

// cambio para probar git la rama development

app.use(express.json())

app.use(express.urlencoded({extended :false}))

app.use('/api/movies', require('./routes/moviesRoutes'))
app.use('/api/users', require('./routes/usersRoutes'))

app.use(errorHandler)

app.listen(port,() => console.log(`Server started on port ${port}`))
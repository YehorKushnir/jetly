require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')
const path = require('path')

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(router)
app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, console.log('Success ' + PORT))
    } catch (error) {
        console.log(error)
    }
}
start()
import express from "express"
import mongoose from "mongoose"
import 'dotenv/config.js'
import http from 'http'
import userRoute from "./routes/userRoute.mjs"
import adminRoute from "./routes/adminRoute.mjs"
import artistRoute from "./routes/artistRoute.mjs"
import createHttpError, { isHttpError } from 'http-errors';
import cors from 'cors'

const app = express();

//.......................................

const server = http.createServer(app)
app.use(express.json())
app.use(cors())

app.use('/api/user', userRoute)
app.use('/api/admin', adminRoute)
app.use('/api/artist', artistRoute)



app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"))
})
app.use((error, req, res, next) => {
    let errorMessage = "An unknown error occured "
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode || 500).json({ error: errorMessage || "unknown error" })
})

const port = process.env.PORT
mongoose.connect(process.env.DB_STRING).then(() => {
    try {
        server.listen(port, () => {
            console.log(`server connected to http://localhost:${port}`);
        })
    } catch (error) {
        console.log('cannot connect to the server');
    }
}).catch(error => {
    console.log('Invalid Database Connection...!')
})
import express from "express";
import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/music", express.static("/src/Music"));


app.get('/', (req, res) => {
    res.send("Hi this site is working")
})



app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials:true
}))

// setting up routes

import userRouter from "./routes/user.routes.js"
import songRouter from "./routes/songs.routes.js"
import adminRouter from "./routes/admin.routes.js"
import playlistRouter from "./routes/playlist.routes.js"



app.use('/api/v1/users', userRouter)
app.use('/api/v1/songs',songRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/playlist',playlistRouter)

app.use(errorHandler)

export default app;
import express from "express";
import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use("/music", express.static("public/Music"));


app.get('/', (req, res) => {
    res.send("Hi this site is working")
})



app.use(express.static(path.join(__dirname, "..", "public")));
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials:true
}))

// setting up routes

import userRouter from "./routes/user.routes.js"
import songRouter from "./routes/songs.routes.js"
import adminRouter from "./routes/admin.routes.js"



app.use('/api/v1/users', userRouter)
app.use('/api/v1/songs',songRouter)
app.use('/api/v1/admin',adminRouter)

app.use(errorHandler)

export default app;
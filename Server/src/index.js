import dotenv from 'dotenv'

dotenv.config({
    path:'./env'
})

import connectDb from './db/db1.js'
import app from './app.js'

connectDb()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`listening on ${process.env.PORT}`)
            
        })
        app.on('error', (err) => {
            console.error(`Server error: ${err.message}`)
        })
    })
    .catch((err) => {
    console.error(`DB connection error: ${err.message}`)
    })

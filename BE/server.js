import express from 'express'
import 'dotenv/config.js'
import cors from 'cors'
import Routes from './src/routes/index.js'

const PORT = process.env.PORT || 8000

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api',Routes)

app.listen(PORT,(()=>{
    console.log(`Server is running on port ${PORT}`)
}))
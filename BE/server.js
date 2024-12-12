import express from 'express'
import 'dotenv/config.js'
import Routes from './src/routes/index.js'

const PORT = 8000

const app = express()

app.use('/',(req,res)=>{
    res.send('Hello World')
})

app.use('/api',Routes)

app.listen(PORT,(()=>{
    console.log(`Server is running on port ${PORT}`)
}))
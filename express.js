const express = require('express');
const app = express()
const booksRouter = require('./routes/books')
const userRouter = require('./routes/user')

app.use(express.urlencoded())
app.use(express.json())
app.set("view engine", "ejs")

app.use('/api/books', booksRouter)
app.use('/api/user', userRouter)

app.listen(3000)
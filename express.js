const express = require('express');
const app = express()
const booksRouter = require('./routes/books')
const userRouter = require('./routes/user')
const indexRouter = require('./routes/index')

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use('/', indexRouter)
app.use('/api/books', booksRouter)
app.use('/api/user', userRouter)

app.listen(3000)
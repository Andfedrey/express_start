const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Books');
const errorMiddleware = require('./middleware/error')

const booksRouter = require('./routes/books')
const userRouter = require('./routes/user')
const indexRouter = require('./routes/index')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use('/', indexRouter)
app.use('/api/books', booksRouter)
app.use('/api/user', userRouter)

async function start(PORT, UrlDB) {
    try{
        await mongoose.connect(UrlDB);
        app.listen(PORT)
    }catch(e){
        console.log(e)
    }
}

const UrlDB = process.env.UrlDB;
const PORT = process.env.PORT || 3000;
start(PORT, UrlDB)
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const errorMiddleware = require('./middleware/error')

const booksRouter = require('./routes/books')
const userRouter = require('./routes/user')
const indexRouter = require('./routes/index')

const app = express()
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(methodOverride('_method'))
app.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true
  }));
  

app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/api/books', booksRouter)
app.use('/api/user', userRouter)


const User = require('./models/user')

const verify = async(username, password, done) => {
    try{
        const user = await User.findOne({username})
        if(!user) return done(null, false)
        if(user.password !== password) {
            return done(null, false)
        }
        return done(null, user)

    }catch(err){
        return done(err)
    }
       
}

const options = {
    usernameField: 'username',
    passwordField: 'password'
}

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser(async(id, cb) => {
    try {
        const user = await User.findById(id)
        cb(null, user)
    } catch (error) {
        return cb(error)
    }
})


async function start(PORT, UrlDB) {
    try{
        await mongoose.connect(UrlDB);
        app.listen(PORT)
    }catch(e){
        console.log(e)
    }
}

const UrlDB = process.env.UrlDB || 'mongodb://localhost:27017/Books';
const PORT = process.env.PORT || 3030;
start(PORT, UrlDB)
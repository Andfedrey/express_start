const express = require('express');
const router = express.Router()
const info = require('../data/info')
const User = require('../models/user');
const passport = require('passport');

router.get('/login', (req, res) => {
  res.render('user/login', {title: 'user login'})
})

router.post('/login', 
  passport.authenticate('local', {failureRedirect: '/user/login'}),
  (req, res) => {
    console.log('req.user', req.user)
    res.redirect('/')
  }
)


router.post('/signup', (req, res) => {
  
})

router.get('/me', (req, res) => {

})


router.get('/authUser', (req, res) => {
  res.render('user/authentication', {title: 'Autentication user'})
})

router.get('/profile', 
  (req, res, next) => {
    if(!req.isAuthenticated()){
      return res.redirect('user/login')
    }
    next()
  },
  (req, res) => {
    res.render('user/profile', {title: 'Profile', user:req.user})
})

router.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/')
})
module.exports = router
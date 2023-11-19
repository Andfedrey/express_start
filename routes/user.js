const express = require('express');
const router = express.Router()
const info = require('../data/info')
const User = require('../models/user');
const passport = require('passport');
const { v4: uuid } = require('uuid')

router.get('/login', (req, res) => {
  res.render('user/login', {title: 'login', user: req.user})
})

router.post('/login', 
  passport.authenticate('local', {failureRedirect: 'user/login'}),
  (req, res) => {
    console.log('req.user', req.user)
    res.redirect('/')
  }
)

router.get('/signup', (req, res) => {
  res.render('user/signup', {title: 'signup', user: req.user})
})

router.post('/signup', async (req, res) => {
  const {username, password} = req.body;
  const checkName = await User.findOne({username})
  if(checkName){
    res.redirect('user/signup', {title: 'пользовтель с таким именем уже заргестрирован', user: req.user})
  }
  const newUser = new User({username, password})
  try{
    await newUser.save()
    res.status(201).redirect('user/login', {title: 'login', user: req.user})
  }catch(err){
    res.status(500).redirect('user/signup', {title: 'signup', user: req.user})
  }
})




router.get('/authUser', (req, res) => {
  res.render('user/authentication', {title: 'Autentication user'})
})

router.get('/me', 
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
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
})
module.exports = router
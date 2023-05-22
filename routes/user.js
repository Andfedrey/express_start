const express = require('express');
const router = express.Router()
const User = require('../data/user')
const info = require('../data/info')

router.post('/login', (req, res) => {
  const {id, mail} = req.body;
  info.user = new User(id, mail)
  res.status(201)
  res.json(info.user)
})

module.exports = router
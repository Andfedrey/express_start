const express = require('express')
const { v4: uuid } = require('uuid')
const Book = require('../data/book')
const info = require('../data/info')
const fileMulter = require('../middleware/file')
const router = express.Router()
const path = require('path');

router.get('/', (req, res) => {
  const {books} = info;
  res.status(200)
  res.json(books)
})

router.get('/:id', (req, res) => {
  const {books} = info;
  const {id} = req.params;

  const checkId = books.findIndex(el => el.id === id)
  if(checkId !== -1) {
    res.status(200)
    res.json(books[checkId])
  } else {
    res.status(404)
    res.json('Книга не найдена')
  }
})

router.post(
  '/', 
  fileMulter.single('fileBook'),
  (req, res) => {
    const {books} = info;
    const {
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName
    } = req.body;
    const id = uuid()

    const {filename} = req.file;
    if(!filename) {
      res.status(404)
      res.json('Ошибка при загрузке файла')
    }

    const fileBook = filename;

    if(id && title && description && authors && favorite && fileCover && fileName) {
      const newBook = new Book(id, title, description, authors, favorite, fileCover, fileName, fileBook)
      books.push(newBook)
      res.status(201)
      res.json(newBook)
    } else {
      res.status(400)
      res.json('Новая книга не была добавлена')
    }
})

router.put('/:id', (req, res) => {
  const {books} = info;
  const {id} = req.params;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  } = req.body;

  const checkId = books.findIndex(el => el.id === id)
  if(checkId !== -1) {
    books[checkId] = {
      ...books[checkId],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName
    }
    res.status(201)
    res.json(books)
  }else {
    res.status(404)
    res.json('Книга по данному Id не найдена')
  }
})

router.delete('/:id', (req, res) => {
  const {books} = info;
  const {id} = req.params;

  const checkId = books.findIndex(el => el.id === id);
  if(checkId !== -1) {
    books.splice(checkId, 1)
    res.status(200)
    res.json(true)
  } else {
    res.status(404)
    res.json('Книга по данному Id не найдена')
  }
})

router.get('/:id/download', (req, res) => {
  const {books} = info;
  const {id} = req.params;
  const checkId = books.findIndex(el => el.id === id);
  const fileName = books[checkId].fileBook
  
  const road = path.dirname(__dirname)
  res.download(road + "/public/books/" + fileName, function(err) {
    if(err) {
      console.log(err)
      res.status(404)
      res.json('Ошибка при загрузки файла')
    } else {
      console.log('ok')
    }
  })
})


module.exports = router

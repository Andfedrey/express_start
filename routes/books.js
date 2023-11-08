const express = require('express')
const { v4: uuid } = require('uuid')
const Book = require('../data/book')
const info = require('../data/info')
const fileMulter = require('../middleware/file')
const router = express.Router()
const path = require('path');
const Books = require('../models/books')

router.get('/', async (req, res) => {
  const {books} = info;
  try {
    const books = await Books.find().select('-__v')
    res.status(200).render('book/index',{title: "Books", books })
  } catch (error) {
    res.status(500).json(error)
  }
  res.status(200)
  res.render('book/index', {title: 'Books', books})
})

router.get('/addBook', async(req, res) => {
  try {
    res.status(200).render('book/create', {title:'add book'})
  } catch (error) {
    res.status(500)
  }
})

router.get('/:id', async(req, res) => {
  const {id} = req.params;
  try {
    const book = await Books.findById(id).select('-__v');
    res.status(200).render('book/view', {title:"Book", book})
  } catch (error) {
    res.status(404).json(error)
  }
})

router.post('/', fileMulter.single('fileBook'), async (req, res) => {
  const {title, description, authors, favorite, fileCover, fileName} = req.body;
  const id = uuid()
  const fileBook = req?.file?.filename ?? '';
  const newBook = new Books({id, title, description, authors, favorite, fileCover, fileName, fileBook})
  
  if(title, description, authors) {
    try {
      await newBook.save()
      res.status(201).redirect('/api/books')
    } catch (error) {
      res.status(404).json(error)
    }
  } else {
    res.status(500)
  }
})

router.get('/updateBook/:id', async(req, res) => {
  const {id} = req.params;
  try {
    const book = await Books.findById(id).select('-__v');
    res.status(200).render('book/update', {title:'update book', book})
  } catch (error) {
    res.status(500).json(error)
  }
})

router.put('/:id', async(req, res) => {
  const {id} = req.params;
  const {title, description, authors, favorite, fileCover, fileName} = req.body;

    try {
      await Books.findByIdAndUpdate(id, {title, description, authors, favorite: favorite || 'yes', fileCover, fileName});
      res.redirect(`/api/books/${id}`)
    } catch (error) {
      res.status(404).json(error)
    }
})

router.delete('/:id', async(req, res) => {
  const {id} = req.params;
  console.log('CHECK DELETE1')
  try {
    console.log('CHECK DELETE2')
    await Books.deleteOne({_id: id});
    res.status(200).redirect(`/api/books`)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.get('/:id/download', (req, res) => {
  const {books} = info;
  const {id} = req.params;
  console.log(id, 'this is id')
  const checkId = books.findIndex(el => el.id === id);
  const fileName = books[checkId].fileBook``
  const road = path.dirname(__dirname)
  
  res.download(road + "/public/books/" + fileName, `${books[checkId].title}.txt`, (err) => {
    if(err) {
      res.status(404).json(`Ошибка при загрузки файла - ${err}`)
    } else {
      console.log('Файл загружен')
    }
  })
})


module.exports = router

const express = require('express')
const { v4: uuid } = require('uuid')
const Book = require('../data/book')
const info = require('../data/info')
const fileMulter = require('../middleware/file')
const router = express.Router()
const path = require('path');
const Books = require('../models/books')
const books = require('../models/books')

router.get('/', async (req, res) => {
  const {books} = info;
  try {
    const books = await Books.find().select('-__v')
    res.status(200).json(books)
  } catch (error) {
    res.status(500).json(error)
  }
  res.status(200)
  res.render('book/index', {title: 'Books', books})
})

router.get('/:id', async(req, res) => {
  const {id} = req.params;
  try {
    const book = await Books.findById(id).select('-__v');
    res.status(200).json(book)
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
      res.status(201).json(newBook)
    } catch (error) {
      res.status(404).json(error)
    }
  } else {
    res.status(500)
  }
})


router.put('/:id', async(req, res) => {
  const {id} = req.params;
  const {title, description, authors, favorite, fileCover, fileName} = req.body;
  if(title, description, authors) {
    try {
      await Books.findByIdAndUpdate(id, {title, description, authors, favorite: favorite || 'yes', fileCover, fileName});
      res.redirect(`/api/books/${id}`)
    } catch (error) {
      res.status(404).json(error)
    }
  } else {
    res.status(500)
  }
})

router.delete('/:id', async(req, res) => {
  const {id} = req.params;
  
  try {
    await Books.deleteOne({_id: id});
    res.status(200).json('ok')
  } catch (error) {
    res.status(500).json(error)
  }
})


router.get('/create', (req, res) => {
  res.render("book/create", {
      title: "Books | create",
      todo: {},
  });
});



router.get('/:id', (req, res) => {
  const {books} = info;
  const {id} = req.params;

  const checkId = books.findIndex(el => el.id === id)
  if(checkId == -1) {
    res.status(404)
    res.json('Книга не найдена')
  } 
  res.render('book/view', {
    title: 'book | view',
    book: books[checkId]
  })
  res.status(200)
  res.json(books[checkId])
})

router.get('/update/:id', (req, res) =>  {
  const {books} = info;
  const {id} = req.params;
  const checkId = books.findIndex(el => el.id === id)

  if(checkId == -1) {
    res.redirect('/404')
    res.status(404)
    res.json('Книга не найдена')
  } 

  const book = books[checkId]
  res.status(200)
  res.render('book/update', {
    title: 'book | update',
    book
  })
})

router.post('/update/:id', (req, res) => {
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

  console.log(req.body)

  const checkId = books.findIndex(el => el.id === id)

  if(checkId == -1) {
    res.redirect('/404')
    res.status(404)
    res.json('Книга по данному Id не найдена')
  }
  
  
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
    res.redirect('/api/books')

})

router.get('/delete/:id', (req, res) => {
  const {books} = info;
  const {id} = req.params;

  const checkId = books.findIndex(el => el.id === id);
  if(checkId !== -1) {
    books.splice(checkId, 1)
    res.status(200)
    res.redirect('/api/books')
    res.json(true)
  } else {
    res.redirect('/404')
    res.status(404)
    res.json('Книга по данному Id не найдена')
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

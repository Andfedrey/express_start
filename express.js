
const express = require('express');
const { v4: uuid } = require('uuid')
const app = express()

class Book {
  constructor(id, title, description, authors, favorite, fileCover, fileName) {
    this.id = id
    this.title = title
    this.description = description
    this.authors = authors
    this.favorite = favorite
    this.fileCover = fileCover
    this.fileName = fileName
  }
}
class User {
  constructor(id, mail) {
    this.id = id;
    this.mail = mail;
  }
}
const info = {
  user: null,
  books: [new Book(), new Book()]
};

app.post('/api/user/login', (req, res) => {
  const {id, mail} = req.body;
  info.user = new User(id, mail)

  res.status(201)
  res.json(newUser)
})

app.get('/api/books', (req, res) => {
  const {books} = info;
  
  res.status(200)
  res.json(books)
})

app.get('/api/books/:id', (req, res) => {
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

app.post('/api/books', (req, res) => {
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

  if(id && title && description && authors && favorite && fileCover && fileName) {
    const newBook = new Book(id, title, description, authors, favorite, fileCover, fileName)
    books.push(newBook)
    res.status(201)
    res.json(newBook)
  } else {
    res.status(400)
    res.json('Новая книга не была добавлена')
  }
})

app.put('/api/books/:id', (req, res) => {
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

app.delete('/api/books/:id', (req, res) => {
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


app.listen(3000)
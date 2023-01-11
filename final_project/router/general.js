const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  //res.send(JSON.stringify(books,null,4));

  let bookPromise = new Promise((resolve,reject) => {
    resolve(JSON.stringify(books))
  })

  bookPromise.then((data) => {
    res.send(data);
    console.log("Book list Callback");
  })

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  let isbnPromise = new Promise((resolve,reject) => {
    resolve(JSON.stringify(books[isbn]))
  })

  isbnPromise.then((data) => {
    res.send(data);
    console.log("Book by ISBN Callback");
  })
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  let authorPromise = new Promise((resolve,reject) => {
    const booklist = Object.values(books).filter(book => {
      return book.author === author;
    });

    resolve(JSON.stringify(booklist))
  })

  authorPromise.then((data) => {
    res.send(data);
    console.log("Book by author Callback");
  })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  let titlePromise = new Promise((resolve,reject) => {
    const booklist = Object.values(books).filter(book => {
      return book.title === title;
    });

    resolve(JSON.stringify(booklist))
  })

  titlePromise.then((data) => {
    res.send(data);
    console.log("Book by title Callback");
  })

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]['reviews']);
});

module.exports.general = public_users;

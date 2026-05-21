const express = require('express');
const axios = require('axios'); // Required for Tasks 10-13
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists. Please choose another one." });
  }

  users.push({ "username": username, "password": password });
  return res.status(201).json({ message: "User successfully registered. You can now login." });
});

// Task 10: Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
  try {
    // Creating a Promise wrapper to meet the async requirement
    const fetchBooks = () => Promise.resolve(books);
    const availableBooks = await fetchBooks();
    return res.status(200).send(JSON.stringify(availableBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using Promise Callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  const fetchBookByISBN = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(`Book with ISBN ${isbn} not found`);
    }
  });

  fetchBookByISBN
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});
  
// Task 12: Get book details based on Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  const requestedAuthor = req.params.author.toLowerCase();
  
  try {
    const fetchByAuthor = () => {
      return new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        let matchingBooks = [];
        
        keys.forEach(key => {
          if (books[key].author.toLowerCase() === requestedAuthor) {
            matchingBooks.push({
              isbn: key,
              author: books[key].author,
              title: books[key].title,
              reviews: books[key].reviews
            });
          }
        });
        
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(`No books found by author "${req.params.author}"`);
        }
      });
    };

    const result = await fetchByAuthor();
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 13: Get all books based on Title using Async/Await
public_users.get('/title/:title', async function (req, res) {
  const requestedTitle = req.params.title.toLowerCase();
  
  try {
    const fetchByTitle = () => {
      return new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        let matchingBooks = [];
        
        keys.forEach(key => {
          if (books[key].title.toLowerCase() === requestedTitle) {
            matchingBooks.push({
              isbn: key,
              author: books[key].author,
              title: books[key].title,
              reviews: books[key].reviews
            });
          }
        });
        
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(`No books found with the title "${req.params.title}"`);
        }
      });
    };

    const result = await fetchByTitle();
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

module.exports.general = public_users;

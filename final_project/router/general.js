const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Check if books data exists
  if (books) {
    // Using JSON.stringify(object, replacer, space) to format the output neatly
    return res.status(200).send(JSON.stringify(books, null, 4));
  } else {
    return res.status(404).json({ message: "No books found" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;
  
  // Look up the book in the books object using the ISBN as the key
  const book = books[isbn];

  if (book) {
    // Return the book details neatly formatted
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    // Return a 404 error if the book with the specified ISBN is not found
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Retrieve the title from the request parameters
  const requestedTitle = req.params.title.toLowerCase();
  
  // Get all the keys (ISBNs) from the books object
  const keys = Object.keys(books);
  
  // Array to hold any books that match the title
  let matchingBooks = [];

  // Iterate through the books object to find matches
  keys.forEach(key => {
    if (books[key].title.toLowerCase() === requestedTitle) {
      // Append the book details along with its ISBN to the results
      matchingBooks.push({
        isbn: key,
        author: books[key].author,
        title: books[key].title,
        reviews: books[key].reviews
      });
    }
  });

  if (matchingBooks.length > 0) {
    // Return the matching books neatly formatted
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    // Return a 404 error if no books match the title
    return res.status(404).json({ message: `No books found with the title "${req.params.title}"` });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;
  
  // Look up the book in the books object
  const book = books[isbn];

  if (book) {
    // Return only the reviews object of the requested book
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    // Return a 404 error if the book with the specified ISBN doesn't exist
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

module.exports.general = public_users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let usersWithSameName = users.filter((user) => user.username === username);
  return usersWithSameName.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUsers = users.filter((user) => user.username === username && user.password === password);
  return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
          data: username
      }, 'access', { expiresIn: 60 * 60 });

      req.session.authorization = {
          accessToken, username
      }
      
      return res.status(200).send({ message: "User successfully logged in" });
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // Retrieve review from request query string
  const username = req.session.authorization['username']; // Retrieve username from session

  // Validate that a review string was actually passed
  if (!review) {
    return res.status(400).json({ message: "Review content is missing in query parameters (?review=...)" });
  }

  // Check if the book exists in our database
  if (books[isbn]) {
    // If the book doesn't have a reviews object initialized yet, create an empty one
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    // Assign or update the review under the current user's username
    books[isbn].reviews[username] = review;

    return res.status(200).json({ 
      message: `Review for ISBN ${isbn} by user '${username}' has been successfully added/updated.`,
      reviews: books[isbn].reviews 
    });
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username']; // Retrieve username from session

  // Check if the book exists in our database
  if (books[isbn]) {
    // Check if the book actually has any reviews, and specifically one from this user
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      
      // Delete only the review belonging to the current session user
      delete books[isbn].reviews[username];

      return res.status(200).json({ 
        message: `Review for ISBN ${isbn} by user '${username}' has been successfully deleted.`,
        reviews: books[isbn].reviews 
      });
    } else {
      return res.status(404).json({ message: `No review found for user '${username}' under ISBN ${isbn}.` });
    }
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if the username is valid (e.g., check if a user with this name already exists)
  let usersWithSameName = users.filter((user) => user.username === username);
  return usersWithSameName.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Check if username and password match the one we have in records.
  let validUsers = users.filter((user) => user.username === username && user.password === password);
  return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  // Authenticate the user credentials
  if (authenticatedUser(username, password)) {
      // Generate a JWT access token valid for 1 hour
      let accessToken = jwt.sign({
          data: username
      }, 'access', { expiresIn: 60 * 60 });

      // Save the access token and username into the session configuration
      req.session.authorization = {
          accessToken, username
      }
      
      return res.status(200).send({ message: "User successfully logged in" });
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

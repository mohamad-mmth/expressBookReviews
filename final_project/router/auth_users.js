const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"user", "password":"password"},{"username":"user3", "password":"password"}];

const isValid = (username)=>{ //returns boolean
//check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const bookreviews = books[isbn]['reviews'];
  const username = req.session.authorization.username;
  let index = 0;
  //reviewExist
  let userReview;
  if (bookreviews) {
    Object.values(bookreviews).filter((bookreview)=>{
      index++;
      if (bookreview.username === username) {
        userReview = {index, "username":bookreview.username ,"review":bookreview.review}
      }
    });
    let review = req.body.review;
    if (userReview) {
      if(review) {
        books[isbn]['reviews'][userReview.index].review = review;
        res.send(`The review: ${review} has been updated.`);

      } else {
        res.send("Unable to find a Review!");
      }
    }
    else{
      let lastIndex = Object.keys(bookreviews)[Object.keys(bookreviews).length-1];
      books[isbn]['reviews'][parseInt(lastIndex)+1] = {"username":username,"review":review};
      res.send(`New review: ${review} has been added.`);
    }
  } else {
    res.send("Unable to find books!");
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const bookreviews = books[isbn]['reviews'];
  const username = req.session.authorization.username;
  let index = 0;
  //reviewExist
  let userReview;
  if (bookreviews) {
    Object.values(bookreviews).filter((bookreview)=>{
      index++;
      if (bookreview.username === username) {
        userReview = {index, "username":bookreview.username ,"review":bookreview.review}
      }
    });

    if (userReview) {
      delete books[isbn]['reviews'][userReview.index];
      res.send(`your review has been deleted.`);
    }
    else{
      res.send("Unable to find user Review!");
    }
  } else {
    res.send("Unable to find books!");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

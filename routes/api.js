/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
var BookModel = require('../models/book_model.js');

// mongoose connection
mongoose.connect(
  process.env.DB,
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  function(err, db) {
    if (err) {
      console.log('Unable to connect to the server. Please start the server. Error:', err);
    } else {
      console.log('Connected to Server successfully!');
    }
  });

module.exports = function(app) {

  app.route('/api/books')
    .get(function(req, res) {
      BookModel.find(
        (error, books) => {
          if (!error && books) {
            return res.json(books)
          }
        }
      )

      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function(req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.send('missing required field title')
      } else {
        var book = new BookModel({
          title: title
        });
        book.save((error, savedBook) => {
          if (!error && savedBook) {
            return res.json({ "_id": savedBook._id, "title": savedBook.title })
          }
        });
      }
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      BookModel.deleteMany({}, (error) => {
        if (!error) {
          res.send('complete delete successful')
        }
      })
    });



  app.route('/api/books/:id')
    .get(function(req, res) {
      let bookid = req.params.id;
      BookModel.findById(
        bookid,
        (error, book) => {
          if (!error && book) {
            return res.json(book)
          } else {
            res.send('no book exists')
          }
        }
      )
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!bookid) {
        return res.send('missing required field title')
      } else if(!comment || comment==""|| comment==undefined) {
        return res.send('missing required field comment')
      } else {
        BookModel.findById(
          bookid,
          (error, book) => {
            if (!error && book) {
              book.comments.push(comment);
              book.save((error, savedBook) => {
                      if (!error && savedBook) {
                        return res.json(savedBook)
                      }
              });

            } else {
              res.send('no book exists')
            }
          }
        )
      }

    })

    .delete(function(req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      BookModel.findByIdAndRemove(
          bookid,
          (error, book) => {
            if (!error && book) {
              res.send('delete successful')

            } else {
              res.send('no book exists')
            }
          }
        )
    });

};

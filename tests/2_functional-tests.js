/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
var BookModel = require('../models/book_model.js');

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
    test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({  'title': 'Functional Test Title' })
        .end(function (err, res) {       
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          done()
        });
      })
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function (err, res) {       
          assert.equal(res.status, 200);
          assert.isString(res.text, 'response should be a string');
          assert.equal(res.text, 'missing required field title');
          done()
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
            chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){    
              chai.request(server)
              .get('/api/books/5f665eb46e296f6b9b6a504d')
              .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.isString(res.text);
                  assert.equal(res.text, 'no book exists');                  
                  done();
            });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        BookModel.findOne({ title: 'Functional Test Title' }, function (err, book) {
          done();
            test('Test GET /api/books',  function(done){
              chai.request(server)
              .get('/api/books/')
              .send({ '_id': book._id})
              .end(function(err, res){
                  assert.isObject(res.body);
                  assert.equal(res.status, 200);
                  assert.property(res.body, 'title');
                  assert.equal(res.body.title, 'Functional Test Title');
                  assert.property(res.body, 'comments');
                  assert.isArray(res.body.comments);                  
                  done();
                });
              }); 
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
         BookModel.findOne({ title: 'Functional Test Title' }, function (err, book) {
          done();            
              chai.request(server)
              .post('/api/books/')
              .send({ '_id': book._id, 'comment':'Functional Test Comment'})
              .end(function(err, res){
                  assert.isObject(res.body);
                  assert.equal(res.status, 200);
                  assert.property(res.body, 'title');
                  assert.property(res.body, '_id');
                   assert.property(res.body, 'comments');
                   assert.lengthOf(res.body.comments, 1);
                  assert.equal(res.body.comments, ['Functional Test Comment']);
                  assert.property(res.body, 'comments');
                  assert.isArray(res.body.comments);                  
                  done();
                });
        }); 
          
      });

      test('Test POST /api/books/[id] without comment field', function(done){
         BookModel.findOne({ title: 'Functional Test Title' }, function (err, book) {
          done();            
              chai.request(server)
              .post('/api/books/')
              .send({ '_id': book._id})
              .end(function(err, res){
                 assert.equal(res.status, 200);
                  assert.isString(res.text);
                  assert.equal(res.text, 'missing required field comment');  
                  done();
                });
          }); 
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/')
        .send({ '_id': '5f665eb46e296f6b9b6a504d', 'comment':'Functional Test Comment 01'})
        .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isString(res.text);
            assert.equal(res.text, 'missing required field title');  
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        BookModel.findOne({ title: 'Functional Test Title' }, function (err, book) {
          //done();            
              chai.request(server)
              .delete('/api/books/'+book._id)
              .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.isString(res.text);
                  assert.equal(res.text, 'delete successful');  
                  done();
                });
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/5f665eb46e296f6b9b6a504d')
        .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isString(res.text);
            assert.equal(res.text, 'no book exists');  
            done();
          });
      });

    });

  });

});

var mongoose = require('mongoose');
var passport = require('passport');
var Book = mongoose.model('Book');

var path = process.cwd();
var UserHandler = require(path + '/server/components/user/userHandler.server.js');
var userHandler = new UserHandler();

function BookHandler(){
    
    this.getAllBooks = getAllBooks;
    this.saveBook = saveBook;
    this.getUserBooks = getUserBooks;
    this.deleteBook = deleteBook;
    this.getBook = getBook;
    
    function getAllBooks(req, res, next){
        Book.find(function(err, books){
           if(err){return next(err);}

           res.json(books);
        }).populate('user');
    }
    
    function saveBook(req, res, next){
        userHandler.getUserByNameServer(req.payload.username, function(user){
            var book = new Book(req.body);
            book.user = user;
        
            book.save(function(err,book){
            if(err){return next(err);}
        
              res.json(book); 
            });
        });
        
        
    }
    
    function getUserBooks(req, res, next){
        Book.find({user: req.user._id}, function(err,books){
            if(err){return next(err);}
            
            res.json(books);
        }).populate('user');
    }
    
    function deleteBook(req, res, next){
        Book.findById(req.params.id).remove(function(err){
           if(err){return next(err);}
           
           res.json(req.params.id);
        });
    }
    
    function getBook(req, res, next){
        Book.findById(req.params.id, function(err,book){
           if(err){return next(err);}
            
           res.json(book);
        }).populate('user');
    }
    
}

module.exports = BookHandler;
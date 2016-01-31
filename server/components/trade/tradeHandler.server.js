var mongoose = require('mongoose');
var passport = require('passport');
var Trade = mongoose.model('Trade');
var Book = mongoose.model('Book');



function TradeHandler(){
    
    this.saveTrade = saveTrade;
    this.getTradesUser = getTradesUser;
    this.deleteTrade = deleteTrade;
    this.acceptTrade = acceptTrade;
    this.rejectTrade = rejectTrade;
    this.removeBook = removeBookAndRelatedTrades;
    
   
   function saveTrade(req, res, next){
       var trade = new Trade(req.body);
       
       trade.save(function(err,trade){
           if(err){return next(err);}
           
           res.json(trade);
       });
   }
   
   function getTradesUser(req, res, next){
       
       Trade.find({$or: [{ requester: req.user._id },{ receiver: req.user._id }]}, function(err,trades){
           if(err){return next(err)}
           
           res.json(trades);
       }).populate('requester receiver bookRequested bookOffered');
   }
   
   function deleteTrade(req, res, next){
       Trade.findById(req.params.id).remove(function(err){
          if(err){return next(err)}
          
          res.json(req.params.id);
       });
   }
    
    function acceptTrade(req, res, next){
        Trade.findById(req.params.id, function(err, trade){
            if(err){return next(err)}
            
            Book.findById(trade.bookOffered._id, function(err, bookOffered){
                if(err){return next(err)}
                
                Book.findById(trade.bookRequested._id, function(err, bookRequested){
                  if(err){return next(err)}  
                   
                   var user1 = bookOffered.user;
                   var user2 = bookRequested.user;
                   
                   bookRequested.user = user1;
                   bookOffered.user =user2;
                   
                   bookRequested.save(function(err,bookRequested){
                       if(err){return next(err)}
                       
                       bookOffered.save(function(err,bookOffered){
                           if(err){return next(err)}
                           
                           trade.accept();
                           trade.save(function(err,retTrade){
                               if(err){return next(err)}
                                
                                rejectAllPendingTrades(bookOffered, bookRequested, function(trades){
                                    res.json(trades);
                                });
                           });
                       });
                   });
                }).populate('user');
            }).populate('user');
        }).populate('bookOffered bookRequested');
    }
    
    function rejectTrade(req, res, next){
        Trade.findById(req.params.id, function(err, trade){
            if(err){return next(err)}
            
            trade.reject();
            trade.save(function(err, trade){
               if(err){return next(err)}
               
               res.json(trade);
            });
        });
    }
    
    function removeBookAndRelatedTrades(req, res, next){
        //Wrapper for deleting books
        //
        
        Book.findById(req.params.id, function(err, book){
            if(err){ return next(err);}

           rejectAllPendingTrades(book, null, function(trades){
               
               if(trades.length > 0){
                   book.user = null;
               
                   book.save(function(err,book){
                       if(err){return next(err);}
                       
                       res.json(trades);
                   });
               }
               else {
                   book.remove(function(err){
                       if(err){return next(err)}
                       
                       res.json(trades);
                   });
               }
           });
        });
    }
    
    
    function saveAll(arr, cb){
        var toSave = arr.pop();
        
        toSave.save(function(err, item){
           if(err){return err;}
           
           if(arr.length > 0){
             saveAll(arr, cb);  
           } 
           else {
               cb(item);
           }   
        });
    }
    
    function rejectAllPendingTrades(book1, book2, callback){
        Trade.find({
                    $and: [{status: 'pending'},
                            {$or: [{bookOffered: book1._id },
                                   {bookRequested: book1._id},
                                   {bookOffered: book2 != null ? book2._id : book1._id },
                                   {bookRequested: book2 != null ? book2._id : book1._id }]}]
       }, function(err, trades){
           if(err){return err}
           
           trades.forEach(function(trd){
            trd.reject();
           });
           
           saveAll(trades, function(item){
              callback(trades);
           });;
           
        });
    }
    
}

module.exports = TradeHandler;
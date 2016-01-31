angular.module('bookTrader')
    .controller('TradeCtrl', [
      '$scope',
      'auth',
      'user',
      'book',
      'reqBook',
      'trade',
      '$state',
      function($scope, auth, user, book, reqBook, trade, $state){
        var formData = {};
        $scope.formData = formData;
        $scope.books = book.myBooks;
        $scope.reqBook = reqBook;
        $scope.select = selectBook;
        
        
        if(book.myBooks.length == 0){
            book.getUserBooks(auth.currentUser());
        }
        
        $scope.isLoggedIn = auth.isLoggedIn;
        
        function selectBook(bk){
            var newTrade = {
                bookRequested: reqBook._id,
                bookOffered: bk._id,
                requester: bk.user._id,
                receiver: reqBook.user._id
            };
            
            trade.saveTrade(newTrade, function(trd){
                $state.go('home');
            });
        }
    
      }
    ])
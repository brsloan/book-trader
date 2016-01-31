angular.module('bookTrader')
    .controller('MainCtrl', [
      '$scope',
      'auth',
      'book',
      'trade',
      function($scope, auth, book, trade){
        var formData = {};
        $scope.formData = formData;
        $scope.books = book.books;
        
        book.getAllBooks();
        
        $scope.isLoggedIn = auth.isLoggedIn();
        $scope.user = auth.currentUser;
        
        $scope.outgoingTrades = trade.outgoing;
        $scope.incomingTrades = trade.incoming;
        trade.getTradesUser();
        
        $scope.rejectTrade = rejectTrade;
        $scope.acceptTrade = acceptTrade;
        $scope.removeTrade = removeTrade;
        
        $scope.checkUser = function(user){
          return auth.isLoggedIn() && user != auth.currentUser();
        }
        
        function rejectTrade(trd){
          trade.rejectTrade(trd);
        }
        
        function acceptTrade(trd){
          trade.acceptTrade(trd);
        }
        
        function removeTrade(trd){
          trade.deleteTrade(trd);
        }
      }
    ])
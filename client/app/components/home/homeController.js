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
        
        $scope.tradesVisible = false;
        $scope.numberPending = getNumberTradesPending;
        
        $scope.showTrades = function(){
          $scope.tradesVisible = !$scope.tradesVisible;
        };
        
        var activeFilters = ['pending'];
        
        $scope.includeTrade = function(status){
          var statIndex = activeFilters.indexOf(status);
          
          if(statIndex > -1)
            activeFilters.splice(statIndex, 1);
          else
            activeFilters.push(status);  
        }
        
        $scope.filterTrades = function(trd){
          var statIndex = activeFilters.indexOf(trd.status);
          
          if(statIndex > -1)
            return true;
          else
            return false;
        }
        
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
        
        function getNumberTradesPending(){
          var numOut = trade.outgoing.filter(function(trade){
            return trade.status == 'pending';
          }).length;
          
          var numIn = trade.incoming.filter(function(trade){
            return trade.status == 'pending';
          }).length;
          
          return numOut + numIn;
        }
      }
    ])
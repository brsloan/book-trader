angular.module('bookTrader')
    .controller('BookCtrl', [
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
        $scope.reqBook = reqBook;
        
        $scope.isLoggedIn = auth.isLoggedIn;
    
      }
    ])
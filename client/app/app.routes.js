angular.module('bookTrader')
    .config([
      '$stateProvider',
      '$urlRouterProvider',
      function($stateProvider, $urlRouterProvider){
        $stateProvider
          .state('home', {
            url: '/home',
            templateUrl: 'app/components/home/homeView.html',
            controller: 'MainCtrl'
        })
          .state('profile',{
            url: '/user/{username}',
            templateUrl: 'app/components/profile/profileView.html',
            controller: 'ProfileCtrl',
            resolve: {
              thisUser: ['$stateParams', 'user', function($stateParams, user){
                return user.getUser($stateParams.username);
              }]
            }
          })
          .state('myBooks',{
            url: '/user/{username}/books',
            templateUrl: 'app/components/myBooks/myBooksView.html',
            controller: 'MyBooksCtrl',
            resolve: {
              thisUser: ['$stateParams', 'user', function($stateParams, user){
                return user.getUser($stateParams.username);
              }]
            }
          })
          .state('trade',{
            url: '/books/trade/{bookId}',
            templateUrl: 'app/components/trade/tradeView.html',
            controller: 'TradeCtrl',
            resolve: {
              reqBook: ['$stateParams', 'book', function($stateParams, book){
                if(book.books.length == 0){ 
                  return book.getBook($stateParams.bookId); 
                }
              
                return book.books.filter(function(bk){
                  return bk._id == $stateParams.bookId;
                })[0];
              }]
            }
          })
          .state('login',{
            url: '/login',
            templateUrl: '/app/components/login/loginView.html',
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth', function($state, auth){
              if(auth.isLoggedIn()){
                $state.go('home');
              }
            }]
          })
          .state('register', {
            url: '/register',
            templateUrl: '/app/components/register/registerView.html',
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth', function($state, auth){
              if(auth.isLoggedIn()){
                $state.go('home');
              }
            }]
          })
    
        $urlRouterProvider.otherwise('home');
    }]);
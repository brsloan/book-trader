angular.module('bookTrader')
    .controller('MyBooksCtrl', [
      '$scope',
      'auth',
      'user',
      'book',
      'thisUser',
      function($scope, auth, user, book, thisUser){
        var formData = {};
        $scope.formData = formData;
        $scope.books = book.myBooks;
        $scope.saveBook = saveBook;
        $scope.removeBook = removeBook;
        
        book.getUserBooks(thisUser.username);
        
        $scope.isLoggedIn = auth.isLoggedIn();
        
        $scope.canEdit = auth.isLoggedIn && (auth.currentUser() == thisUser.username);
        
        $scope.searchBooks = function(){
            book.searchGoogleBooks($scope.searchTerm, function(data){
                console.log(data);
               $scope.bookResults = data.items; 
            });
        }
        
        $scope.selectBook = function(googBook){
            
            var authorNames = googBook.volumeInfo.authors[0].split(' ');
            var lastName = authorNames[authorNames.length - 1];
            authorNames.pop();
            var firstName = authorNames.join().replace(/,/g,' ');
            
            var newBook = {
                title: googBook.volumeInfo.title,
                image_url: googBook.volumeInfo.imageLinks.thumbnail,
                author: {
                    lastName: lastName,
                    firstName: firstName
                }
            };
            
            book.saveBook(newBook, function(book){
                console.log('new book: ' + book);
            })
            
            $scope.bookResults = [];
        }
        
        function saveBook(){
            book.saveBook(formData, function(book){
            console.log('new book: ' + book);
          });
        }
        
        function removeBook(bk){
            book.removeBook(bk);
        }
        
      }
    ])
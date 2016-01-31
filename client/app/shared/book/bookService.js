angular.module('bookTrader')
    .factory('book', ['$http', 'auth', function($http, auth){
        var o = {
            books: [],
            myBooks: []
        };
        
        o.getAllBooks = getAllBooks;
        o.getUserBooks = getUserBooks;
        o.saveBook = saveBook;
        o.searchGoogleBooks = searchGoogleBooks;
        o.removeBook = removeBook;
        o.getBook = getBook;
        
        return o;
        
        function getAllBooks(callback){
            $http.get('/books').success(function(books){
                angular.copy(books,o.books);
                if(callback)callback(books);
            })
        }
        
        function getUserBooks(user, callback){
            $http.get('/books/user/' + user).success(function(books){
                angular.copy(books,o.myBooks);
               if(callback)callback(books); 
            });
        }
        
        function saveBook(book, callback){
            $http.put('/books', JSON.stringify(book), {
                headers: {Authorization: 'Bearer '+ auth.getToken()}
            }).success(function(book){
                o.books.push(book);
                o.myBooks.push(book);
                if(callback)callback(book);
            });
        }
        
        function searchGoogleBooks(term, callback){
            $http.get('https://www.googleapis.com/books/v1/volumes?q=' + term + 
            '&key=AIzaSyDtlwHnemEixw5_dmsF5DFiE3ETkxFqFg4' + 
            '&fields=items(id,volumeInfo(title,authors,imageLinks))').success(function(data){
                callback(data);
            });
        }
        
        function removeBook(book){
            $http.delete('/books/' + book._id, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).success(function(id){
                var bookIndex = o.myBooks.indexOf(book);
                if(bookIndex > -1)
                    o.myBooks.splice(bookIndex, 1);
                
                //if(callback)callback(id);
            });
        }
        
        function getBook(id){
            return $http.get('/books/' + id).then(function(res){
                return res.data;
            });
        }
        
    }]);
angular.module('bookTrader')
    .factory('bar', ['$http', function($http){
        
        var o = {};
        
        o.getBars = function(location, cb) {
            $http.get('/bars/packaged/' + location).success(function(data){
                var bars = data;

                cb(bars);
            });
        };
        
        return o;
    }]);
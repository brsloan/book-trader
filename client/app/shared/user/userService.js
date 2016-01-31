angular.module('bookTrader')
    .factory('user', ['$http', 'auth', function($http, auth){
       var user = {
           bars: [],
           location: ''
       };
       
       user.getBars = getBars;
       user.addBar = addBar;
       user.removeBar = removeBar;
       user.getLocation = getLocation;
       user.setLocation = setLocation;
       user.getUser = getUser;
       user.saveProfileInfo = saveProfileInfo;
       
       return user;
       
       function getBars(username, cb){
           $http.get('/' + username + '/bars').success(function(data){
              angular.copy(data,user.bars);
              cb();
           })
       }
       
       function addBar(username, barId){
           $http.put('/' + username + '/bars/add/' + barId, '{}', { 
                headers: {Authorization: 'Bearer '+ auth.getToken()}
            }).success(function(data){
                user.bars.push(barId);      
           });
       }
       
       function removeBar(username, barId){
           $http.delete('/' + username + '/bars/remove/' + barId,{
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).then(function(res){
                var barIndex = user.bars.indexOf(barId);
                if(barIndex === -1){return new Error('Cannot remove bar user object does not posess.')}
                user.bars.splice(barIndex, 1);
                return res.data;
           });
       }
       
       function getLocation(username, cb){
           $http.get('/' + username + '/location').success(function(data){
              user.location = data;
              cb(user.location);
           });
       }
       
       function setLocation(username, location){
           $http.put('/' + username + '/location/' + location, {}, {
               headers: {Authorization: 'Bearer ' + auth.getToken()}
           }).success(function(data){
               user.location = location;
           });
       }
        
        function getUser(username){
            return $http.get('/users/' + username).then(function(res){
                return res.data;
            });
        }
        
        function saveProfileInfo(user, callback){
            $http.put('/users/' + user.username + '/profile', JSON.stringify(user), {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).success(function(data){
                if(callback)callback(data);
            })
        }
        
    }]);
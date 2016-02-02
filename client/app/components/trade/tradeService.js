angular.module('bookTrader')
    .factory('trade', ['$http', 'auth', function($http, auth){
        var o = {
            outgoing: [],
            incoming: []
        };
        
        o.getTradesUser = getTradesUser;
        o.saveTrade = saveTrade;
        o.deleteTrade = deleteTrade;
        o.acceptTrade = acceptTrade;
        o.rejectTrade = rejectTrade;
        
        return o;
       
        function getTradesUser(){
            $http.get('/trades/' + auth.currentUser()).success(function(trades){

               var outgoing =  trades.filter(function(trade){
                   return trade.requester.username == auth.currentUser();
               })
               
                var incoming = trades.filter(function(trade){
                   return trade.receiver.username == auth.currentUser();
               })
               
               angular.copy(outgoing, o.outgoing);
               angular.copy(incoming, o.incoming);
               
            });
        }
        
        function saveTrade(trade, callback){
            $http.post('/trades', JSON.stringify(trade),{
                 headers: {Authorization: 'Bearer '+ auth.getToken()}
            }).success(function(trade){
               o.outgoing.push(trade); 
               if(callback)callback(trade);
            });
        }
        
        function deleteTrade(trade){
            $http.delete('/trades/' + trade._id, {
                headers: {Authorization: 'Bearer '+ auth.getToken()}
            }).success(function(id){
               var outIndex = o.outgoing.indexOf(trade);
               if(outIndex != -1){
                   o.outgoing.splice(outIndex, 1);
               } else {
                   var inIndex = o.incoming.indexOf(trade);
                   if(inIndex != -1)
                    o.incoming.splice(inIndex, 1);
               }
            });
        }
        
        function acceptTrade(trade){
            $http.put('/trades/' + trade._id + '/accept', {}, {
                headers: {Authorization: 'Bearer '+ auth.getToken()}
            }).success(function(trd){
                assignStatusToMatchingTrade(trade, 'accepted');
                rejectRelatedTrades(trade);
            });
        }
        
        function rejectTrade(trade){
            $http.put('/trades/' + trade._id + '/reject', {}, {
                headers: {Authorization: 'Bearer '+ auth.getToken()}
            }).success(function(trd){
                assignStatusToMatchingTrade(trade, 'rejected');
            });
        }
        
        
        function rejectRelatedTrades(trade){
            o.incoming.filter(function(trd){
                return trd.status == 'pending' && (trd.bookOffered._id == trade.bookOffered._id || 
                                                    trd.bookRequested._id == trade.bookRequested._id ||
                                                    trd.bookOffered._id == trade.bookRequested._id ||
                                                    trd.bookRequested._id == trade.bookOffered._id );
            }).forEach(function(trd){
                trd.status = 'rejected';
            });
            
            o.outgoing.filter(function(trd){
                return trd.status == 'pending' && (trd.bookOffered._id == trade.bookOffered._id || 
                                                    trd.bookRequested._id == trade.bookRequested._id ||
                                                    trd.bookOffered._id == trade.bookRequested._id ||
                                                    trd.bookRequested._id == trade.bookOffered._id );
            }).forEach(function(trd){
                trd.status = 'rejected';
            });
        }
        
        function assignStatusToMatchingTrade(trade,status){
            var outIndex = o.outgoing.indexOf(trade);
            if(outIndex > -1)
                o.outgoing[outIndex].status = status;
            else {
                var inIndex = o.incoming.indexOf(trade);
                if(inIndex > -1)
                    o.incoming[inIndex].status = status;
            }
        }
        
    }]);
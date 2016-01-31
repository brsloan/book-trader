angular.module('bookTrader')
    .factory('home', ['bar', 'user', 'auth', function(bar, user, auth){
       var o = {
          bars: []
      };
       
       o.getBars = getBars;
       o.addBar = addBar;
       o.cancelBar = cancelBar;
       
       return o;
       
       function getBars(location){
         bar.getBars(location, function(bars){
           angular.copy(bars,o.bars);
           if(auth.isLoggedIn())
              labelBars(auth.currentUser(), function(){
                  user.setLocation(auth.currentUser(), location);
              })
         });
       }
       
       function labelBars (username, cb){
            user.getBars(username, function(){
                for(var i=0;i<user.bars.length;i++){
                    labelMatchingBar(user.bars[i], true);
                }
                cb();
            });  
        }
        
        function labelMatchingBar(barId, isGoing){
          for(var k=0;k<o.bars.length;k++){
              if(o.bars[k].id === barId){
                  o.bars[k].userGoing = isGoing;
                
                  return o.bars[k];
              }
          }
        }
        
        function addBar(barId){
          user.addBar(auth.currentUser(), barId);
          var bar = labelMatchingBar(barId, true);
          bar.bar_goers.push(auth.currentUser());
        }
        
        function cancelBar(barId){
          user.removeBar(auth.currentUser(), barId);
          var bar = labelMatchingBar(barId, false);
          var barIndex = bar.bar_goers.indexOf(auth.currentUser());
          if(barIndex > -1)
            bar.bar_goers.splice(barIndex, 1);
        }
        
        
        
    }]);
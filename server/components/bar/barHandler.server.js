var path = process.cwd();
var UserHandler = require(path + '/server/components/user/userHandler.server.js');
var userHandler = new UserHandler();

var YelpHandler = require(path + '/server/components/bar/yelpHandler.server.js');
var yelpHandler = new YelpHandler();

function barHandler(){
    
    this.getBarsWithUserData = getBarsWithUserData;
    
    function getBarsWithUserData(req, res, next){
        var bars = [];
        var barGoers = [];
        
        getBars();
        
        function getBars(){
            yelpHandler.getBars(req.params.location, function(yelpBars){
                bars = JSON.parse(yelpBars).businesses;
                
                getBarGoers(); 
            });
        }
        
        function getBarGoers(){
           userHandler.getBarGoers(function(newBarGoers){
                barGoers = newBarGoers;
                labelBars();
            });  
        }
        
        function labelBars(){
            for(var i=0;i<barGoers.length;i++){
                for(var k=0;k<barGoers[i].bars.length;k++){
                    labelMatchingBar(barGoers[i].username, barGoers[i].bars[k]);
                }
            }
            res.json(bars);
        }
        
        function labelMatchingBar(barGoer, barId){
            for(var i=0;i<bars.length;i++){
                if(!bars[i].bar_goers){
                    bars[i].bar_goers = [];
                }
                        
                if(bars[i].id === barId){
                    bars[i].bar_goers.push(barGoer);
                }
            }
        }
        
    }
    
}

module.exports = barHandler;
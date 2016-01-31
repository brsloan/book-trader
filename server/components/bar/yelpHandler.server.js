var oauthSignature = require('oauth-signature');
var request = require('request');

function yelpHandler(){
    
    this.getBars = getBars;
    
    function getBars(location, cb){
        
        var method = 'GET';
        var url = 'http://api.yelp.com/v2/search';
        var params = {
                location: location,
                oauth_consumer_key: process.env.YELP_CONSUMER_KEY,
                oauth_token: process.env.YELP_TOKEN,
                oauth_signature_method: "HMAC-SHA1",
                oauth_timestamp: new Date().getTime(),
                oauth_nonce: getRandomString(32),
                term: 'bars'
            };
        var consumerSecret = process.env.YELP_CONSUMER_SECRET;
        var tokenSecret = process.env.YELP_TOKEN_SECRET;
        var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
        params.oauth_signature = signature;
     
        request.get({url: url, 
                    qs: params},
            function(error, response, body){
                if(error){return error;}
                cb(body);
            });
     
        function getRandomString(len){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
            for( var i=0; i < len; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
        
            return text;
        }
    }
    
}

module.exports = yelpHandler;
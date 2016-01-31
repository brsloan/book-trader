var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

function UserHandler(){
    //API Param Functions
    this.getByName = getUserByName;
    
    //API Functions
    this.register = register;
    this.logIn = login;
    this.getUser = getUser;
    this.setProfileInfo = setProfileInfo;
    
    //Controller Functions
    this.getBarGoers = getBarGoers;
    this.getUserByNameServer = getUserByNameServer;
    
    
    function getUserByName(req, res, next, username) {
        var query = User.findOne({username: username}, {hash: 0, salt: 0});
        
        query.exec(function(err,user){
          if(err){return next(err);}
          if(!user){return next(new Error('can\'t find user'));}
          
          req.user = user;
          return next();
        });
    }
    
    
    function register(req, res, next){
      if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
      }
    
      var user = new User();
      user.username = req.body.username;
      user.setPassword(req.body.password);
    
      user.save(function(err){
        if(err){return next(err);}
    
        return res.json({token: user.generateJWT()});
      });
    
    }
    
    function login(req, res, next){
      if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
      }
    
      passport.authenticate('local', function(err, user, info){
        if(err){return next(err);}
    
        if(user){
          return res.json({token: user.generateJWT()});
        } else {
          return res.status(401).json(info);
        }
      })(req,res,next);
    }
    
    function getUser(req, res, next){
      res.json(req.user);
    }
    
    function setProfileInfo(req, res, next){
      if(req.payload.username !== req.user.username){return next(new Error('Cannot change profiles other than yours.'));}
      
      req.user.name = req.body.name;
      req.user.image_url = req.body.image_url;
      req.user.city = req.body.city;
      req.user.state = req.body.state;
      
      req.user.save(function(err,user){
        if(err){return next(err);}
        
        res.json(req.user);
      });
      
    }
    
    
    function getBarGoers(cb){
      User.find({bars: {$gt: 0}}, 'username bars', function(err, users){
        if(err){return err;}
        
        cb(users);
      });
    }
    
    function getUserByNameServer(username, callback){
      console.log('username: ' + username);
      var query = User.findOne({username: username}, {hash: 0, salt: 0});
        
       query.exec(function(err,user){
          if(err){return err;}
          if(!user){return new Error('can\'t find user');}
          
          console.log(user);
          
          callback(user);
        });
    }
    
}

module.exports = UserHandler;
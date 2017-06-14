var express = require('express');
var router=express.Router();
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var cacher = require('sequelize-redis-cache');
var redis = require('redis');
var app = express();




app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var rc = redis.createClient(6379, 'localhost');

var sequelize = new Sequelize('charu', 'root', 'Naveen@368',
{
	host:"127.0.0.1",
	port:3306,
	dialect:"mariadb",
	define: {
        timestamps: false
			}
});
var User = sequelize.define('mani', {
	 
	     "name": 
		        {
                   type: Sequelize.STRING,
				},
				
        
		"email":  
		       {
                     type: Sequelize.STRING,
                     unique: {
                                     args: true,
			                 },
		       },
		
	 "username": 
	           {
                     type: Sequelize.STRING,
                      unique: {
                                  args: true,
                              },
		       }
     
	 
	},{
        indices: [
            {
                unique: true,
                columns: ['username', 'email']
            }
        ]
    });

router.post('/',function(req,res){
console.log(JSON.stringify(req.body.name));
 User.create({
	             "name":req.body.name,
	             "email":req.body.email,
	             "username":req.body.username
 	         }).  
    then(function(a) {  
        res.json(a);  
    }, function(error) {  
        res.send(error);  
    });  
});

router.get('/:email',function(req,res){
	
	var cacheObj = cacher(sequelize, rc)
  .model('mani')
  .ttl(1000);
	cacheObj.findAll({
		where:{
			"email": req.params.email
		},
	}).then(function(jane) {  
        res.json(jane);  
    }, function(error) {  
        res.send(error);  
    });  
});


module.exports = sequelize;
module.exports = User;
//module.exports=mani;
module.exports = router;

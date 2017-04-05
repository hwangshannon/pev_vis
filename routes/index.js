var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var rideSchema = mongoose.Schema({
    time : Number, 
    pedal : Number,
    global_avg: Number,
    veh_avg: Number,
    user_avg: Number,
    user: Number,
    vehicle: Number, 
}); //for ease of access, not data storage efficiency
var Ride = mongoose.model('Ride', rideSchema);
//var ObjectId = require('mongodb').ObjectId;

/* GET home page. */
router.get('/', function(req, res, next) { //haven't started ride
	res.render('index', { title: 'PEV' });
});

router.get('/ride', function(req, res) {
	console.log("Getting your ride");
	//console.log(req.query.id);
	Ride.findById(req.query.id, function (err, my_ride) {
		console.log(my_ride)
		//var veh_avg = my_ride.veh_avg;
		//res.send(veh_avg);
		res.render('index', {
			ride: my_ride,
	  		title: 'All PEVs',
	  		time: my_ride.time,
	  		pedal: my_ride.pedal,
	  		global_avg: my_ride.global_avg,
	  		veh_avg: my_ride.veh_avg,
	  		user_avg: my_ride.user_avg,
	  		user: my_ride.user,
	  		vehicle: my_ride.vehicle,
	  		id: req.query.id
  		}); 
	})
});

router.get('/updateride', function(req, res) {
	console.log("Getting your updated ride");
	//console.log(req.query.id);
	Ride.findById(req.query.id, function (err, my_ride) {
		console.log(my_ride);
		res.send(my_ride);
	})
});

router.post('/', function (req, res, next) {
    var rideID = "";
    var time = 300; //hardocded 10 min ride time in seconds
    var pedal = 0;
    var global_avg = 60;
    var veh_avg = 70;
    var user_avg = 50;

    var ride = new Ride({
		time : time, 
		pedal : pedal,
	    global_avg: global_avg,
	    veh_avg: veh_avg,
	    user_avg: user_avg,
	    user: 1,
	    vehicle: 1
    });
    ride.save(function (err, ride){
    	if (err) return console.error(err);
    	console.log("New ride logged");
    	console.log(ride);
    	res.redirect("/ride?id="+ride.id); //pass ride.id as query to next get request
    });
    
});

router.post('/ride', function (req, res, next) {
	console.log("Updating your ride");
	console.log(req.body.time);
    var time = req.body.time;
   // var pedal = Math.floor((Math.random()*100+1));
	var pedal = 0;
    if (time < 20){
    	pedal = time*4+Math.floor((Math.random()*10+1)); //gen increasing time (lower bound 20, upper bound 90)
    }
    else if (time < 40){
    	pedal = time-Math.floor((Math.random()*10+1));
    }
    else{
    	pedal = 90+Math.floor((Math.random()*10+1));
    }
    var global_avg = parseInt(req.body.global_avg);
    var veh_avg = parseInt(req.body.veh_avg);
    var user_avg = parseInt(req.body.user_avg);
    global_avg = global_avg+(pedal-global_avg)/100; //TODO: change hardocded 100, 50, 10 to reflect actual growing input
    veh_avg = veh_avg+(pedal-veh_avg)/50;
    user_avg = user_avg+(pedal-user_avg)/10;
    Ride.update({_id: req.body.id}, {pedal: pedal, global_avg: global_avg, veh_avg: veh_avg, user_avg: user_avg, time: req.body.time}, { multi: false }, function(err) {
    	if(err) {throw err; }
	});
    //res.redirect("/updateride?id=" + req.body.id); 
});

module.exports = router;

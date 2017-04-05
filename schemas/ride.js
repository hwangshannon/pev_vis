//this file should be unused

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Ride = new Schema({
    //date_posted : {type: Date, default: Date.now},
    time    : Number,
    speed         : Array,
    distance     : Number
});

module.exports = mongoose.model('Ride', Ride);

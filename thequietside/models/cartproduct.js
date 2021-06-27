var mongoose = require('mongoose'); //import mongoose
var Schema = mongoose.Schema; //uses mongoose's schema object

var schema = new Schema({
    cartimagePath: {type: String, required: true},
    carttitle: {type: String, required: true},
    cartdescription: {type: String, required: true},
    cartprice: {type: Number, required: true},
    cartsize: {type: String, required: true}
});
module.exports = mongoose.model('Cartproduct', schema);
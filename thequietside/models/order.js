var mongoose = require('mongoose'); //import mongoose
var Schema = mongoose.Schema; //uses mongoose's schema object


var schema = new Schema({//create a new Schema 
//A schema is a blueprint that will be used for each new entry that will be put into the MongoDB database. Models will be based on this blueprint.
//As an argument, pass javascript object describing this Schema
//This schema will obtain structure data for products
    user:{type: Schema.Types.ObjectId, ref:'User'},
    cart: {type: Object,required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    size:{type: Schema.Types.ObjectId, String, ref:"Size"},
    paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);
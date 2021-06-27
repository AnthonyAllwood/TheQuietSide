var mongoose = require('mongoose'); //import mongoose
var Schema = mongoose.Schema; //uses mongoose's schema object

var schema = new Schema({//create a new Schema 
//A schema is a blueprint that will be used for each new entry that will be put into the MongoDB database. Models will be based on this blueprint.
//As an argument, pass javascript object describing this Schema
//This schema will obtain structure data for products
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    size: {type: String, required: false}

});

module.exports = mongoose.model('Product', schema);




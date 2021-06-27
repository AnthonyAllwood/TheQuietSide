//Seed product data into database
//Create a seeder for each model

//This is a seeder for product model
var Product = require('../models/product');

var mongoose = require('mongoose');

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/thequietsideshop');

var products = [//An array of products
    new Product({
        imagePath: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/i1-80512a09-1261-4e8d-b73e-fe159a0b8304/sportswear-mens-los-angeles-pullover-hoodie-ggDTWX.jpg',
        title: 'Nike Sportswear Los Angeles',
        description: 'Standard fit hoodie with full-zip option for versatility',
        price: 100,
        size: null
    }),
    new Product({
        imagePath: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/d531cad9-996b-4d5a-b252-b02b7425daa2/sportswear-tech-fleece-mens-full-zip-hoodie-5ZtTtk.jpg',
        title: 'Nike Sportswear Tech Fleece',
        description: 'Mens Full-Zip Training Hoodie',
        price: 130,
        size: null
        
    }),
    new Product({
        imagePath: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/3763cca8-f2d5-4e1c-b0bf-0bac85a210c3/therma-mens-full-zip-training-jacket-HHzdG3.jpg',
        title: 'Nike Therma',
        description: 'Mens Full-Zip Training Jacket',
        price: 120,
        size: null
    }),
    new Product({
        imagePath: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/c140e65e-6ea7-4373-8932-909f1788198e/sportswear-mens-pullover-hoodie-FsFfNr.jpg',
        title: 'Nike Sportswear',
        description: 'Mens Pullover Hoodie',
        price: 120, 
        size: null
    }),

];

//Store products within database
//Loop through all products

var done = 0;//helper variable in order to disconnect mongoose after all new products enter the database
for (var i = 0; i < products.length; i++)
{
    products[i].save(function(err, result)//the 'save' method within mongoose allows saving model to database, so mongoose will create a new collection for the product model
    {
        done++;
        if(done === products.length)
        {
            exit();
        }
    });
}

function exit()
{
    mongoose.disconnect();
}

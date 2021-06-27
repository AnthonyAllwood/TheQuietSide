var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Cartproduct = require('../models/cartproduct');


var Product = require('../models/product');
var Order = require('../models/order');
const cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];

  Product.find(function(err, docs)//fetch all products
  {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize)
    {
      productChunks.push(docs.slice(i, i + chunkSize));
    }

    res.render('shop/index', { title: 'Shopping Cart', products: productChunks, /*passes product data to the view in rows/chunks of 3*/ successMsg: successMsg, noMessages: !successMsg}); 
  });
});/*The 'render' function tells Node and Express to send back a response to the browser containing the html code of the index.js file.*/
/*Therefore index.hbs is automatically added because handlebars is setup as the default view engine*/
/*Before sending it back, it also replaces all hooks between double curly braces '{{..}}' with the appropriate data passed as an argument in a javascript object.*/ 

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id; 
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cartSize = res.app.get('cartSize');
  console.log("cartSize", cartSize);

  Product.findById(productId, function(err, product){
    if(err)
    {
      return res.redirect('/');
    }
    var cartproduct = new Product({
      imagePath: product.imagePath,
      title: product.title,
      description: product.description,
      price: product.price,
      size: cartSize.size,
      //sizeid: product.sizeid
    });
    cart.add(cartproduct, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/productpage/:id', function(req, res, next){
    var productId = req.params.id;
    Product.findById(productId, function(err, product){
      if(err)
      {
        return res.redirect('/');
      }
      res.render('shop/productpage', {product: product});
    });

});

router.get('/productsize/:id', function(req, res, next){
  var productId = req.params.id;
  console.log(req.query);
  Product.findById(productId, function(err, product){
    if(err)
    {
      return res.redirect('back');
    }
    var cartproduct = new Cartproduct({
      cartimagePath: product.imagePath,
      carttitle: product.title,
      cartdescription: product.description,
      cartprice: product.price,
      cartsize: req.query.size
    });
    res.app.set('cartSize', req.query);
    
    /*console.log(cartproduct);
    cartproduct.save(function(err,result){
      if(err)
      {
        console.log(err);
        return res.redirect('back');
      }
      console.log('Cart Updated!');
      req.flash('success', 'Cart Updated!');
      res.render('shop/productpage', {product: product});
    });*/

  });
  
  /*var theSize = new Size({
    size: req.body.size
  })*/
      /*console.log(cartproduct);
      res.app.set('orderSize', theSize);
      cartproduct.save(function(err,result){
        if(err)
        {
          return console.log('Not saved');
        }
        console.log('Cart Updated!');
        req.flash('success', 'Cart Updated!');
      });*/
      
});

router.get('/shopping-cart', function(req, res, next){
    if(!req.session.cart)
    {
      return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);

    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
    
});

router.get('/checkout', isLoggedIn, function(req, res, next){
  if(!req.session.cart)
  {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});

});

router.post('/checkout', isLoggedIn, function(req, res, next){
  //Redirect if there is no card, or got to this point in some other way
  if(!req.session.cart)
  {
    return res.redirect('/shopping-cart');
  }
  //Recreate the cart
  var cart = new Cart(req.session.cart);

  orderSize = res.app.get('orderSize');

  //Use Stripe
  var stripe = require("stripe")(
    "sk_test_51HzY60FejuzBXp5nVZShyR0JNdYYfa5eodvkbYPkm2SjdY8Top0XPLFxQNvBydN172fEh3rIZch4b55KH0edf5sc009cipIxCk"
  );
  
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, //Stripe Token Obtained with Stripe.js
    description: "Test Charge"
  }, function(err, charge){
    if(err)
    {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      size: orderSize,
      paymentId: charge.id 
    });
    order.save(function(err, result){
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated())
  {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
 
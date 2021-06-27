const { json } = require("express");

module.exports = function Cart(oldCart) { //Creates initial cart. Starts out as empty javascript object. It then assigns values and it updates as items are added or removed
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    //Adds items to cart 
    this.add = function (item, id)
    {
        //UPDATE THIS FOR BETTER FUNCTIONALITY FOR STORED ITEM IN ACCORDANCE TO SIZE
        var storedItem = this.items[id];
        if(!storedItem)//if item has not been stored before 
        {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        //if item has been stored before 
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.reduceByOne = function(id)
    {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if(this.items[id].qty <= 0)
        {
            delete this.items[id];
        }

    };

    this.removeItem = function(id)
    {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    
    //Turns cart items into an array
    this.generateArray = function()
    {
        var arr = [];
        for (var id in this.items)
        {
            arr.push(this.items[id]);
        }
        return arr;
    };
};
// This is the javascript file that contains the JSON object for the variable called products. All product information,
// including the model, price, image location, and inventory is contained in this file.

var products = 
[
    {
        "model":"Converse Chuck Taylor High Top",
        "price":60.00,
        "image":"./images/converse.jpg",
        "inventory":10
    },
    {
        "model":"Nike Air Force 1 '07",
        "price":90.00,
        "image":"./images/af1.JPEG",
        "inventory":10
    },
    {
        "model":"Reebok Club C 85 Vintage",
        "price":70.00,
        "image":"./images/reebok.jpg",
        "inventory":10
    },
    {
        "model":"Nike Blazer Mid '77",
        "price":100.00,
        "image":"./images/blazer.jpg",
        "inventory":10
    },
    {
        "model":"Adidas Originals Ozweego",
        "price":120.00,
        "image":"./images/ozweego.jpg",
        "inventory":10
    }
];

// Export products to server.js.
if(typeof exports != 'undefined') { 
    exports.products = products;
}
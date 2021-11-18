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
        "model":"Vans Sk8 Hi",
        "price":70.00,
        "image":"./images/vans.jpg",
        "inventory":10
    },
    {
        "model":"Reebok Club C 85",
        "price":70.00,
        "image":"./images/reebok.jpg",
        "inventory":10
    },
    {
        "model":"Nike Blazer Mid '77",
        "price":100.00,
        "image":"./images/blazer.jpg",
        "inventory":10
    }
];

if(typeof exports != 'undefined') { // Export products to server.js.
    exports.products = products;
}
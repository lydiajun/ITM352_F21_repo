/* 
Author: Lydia Jun
Description: This is the javascript file that contains the JSON objects for variables separated by brand. 
All product information, including the brand, price, and image location are contained in this file.
*/

var Chanel = [ 
    {
        "brand" : "BLEU DE CHANEL Eau de Toilette",
        "price" : 135.00,
        "image" : "./images/bleu.jpeg"
    },
    {
        "brand" : "CHANCE BY CHANEL Eau de Parfum",
        "price" : 138.00,
        "image" : "./images/chance.jpeg"
    },
    {
        "brand" : "COCO MADEMOISELLE Eau de Parfum",
        "price" : 138.00,
        "image" : "./images/coco.jpeg"
    }, 
    {
        "brand" : "GABRIELLE CHANEL Eau de Parfum",
        "price" : 138.00,
        "image" : "./images/gabrielle.jpeg"
    }
]
var Dior = [
    {
        "brand" : "Hypnotic Poison",
        "price" : 115.00,
        "image" : "./images/hypnotic.jpeg"
    },
    {
        "brand" : "J'adore Eau de Parfum",
        "price" : 170.00,
        "image" : "./images/jadore.jpeg"
    },
    {
        "brand" : "Miss Dior Eau de Parfum",
        "price" : 138.00,
        "image" : "./images/missdior.jpeg"
    },
    {
        "brand" : "Sauvage Eau de Toilette",
        "price" : 199.00,
        "image" : "./images/sauvage.jpeg"
    }
]
var Gucci = [
    {
        "brand" : "Bloom for Women Eau de Parfum",
        "price" : 138.00,
        "image" : "./images/bloom.png"
    },
    {
        "brand" : "Flora Gorgeous Gardenia Eau de Parfum",
        "price" : 138.00,
        "image" : "./images/flora.jpeg"
    },
    {
        "brand" : "Guilty Pour Femme Eau de Toilette",
        "price" : 110.00,
        "image" : "./images/guilty.png"
    },
    {
        "brand" : "Guilty Pour Homme Eau de Toilette",
        "price" : 135.00,
        "image" : "./images/homme.jpeg"
    },
]   
var YSL = [
    {
        "brand" : "Black Opium Eau de Parfum",
        "price" : 162.00,
        "image" : "./images/black.jpeg"
    },
    {
        "brand" : "L'Homme Cologne Bleu",
        "price" : 140.00,
        "image" : "./images/lhomme.jpg"
    },
    {
        "brand" : "Libre Eau de Parfum",
        "price" : 170.00,
        "image" : "./images/libre.jpeg"
    },
    {
        "brand" : "Mon Paris Eau de Parfum",
        "price" : 128.00,
        "image" : "./images/mon.jpeg"
    }
]

// Products object that contains each brand for easy access in productsdisplay file
var products = {
    "Chanel":Chanel,
    "Dior":Dior,
    "Gucci":Gucci,
    "YSL":YSL
};

// Export the products to server.js
if(typeof module != 'undefined') {
        module.exports.products = products;
}
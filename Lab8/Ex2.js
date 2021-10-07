require("./products_data.js");
var num_products = 5;
var count = 0;
while(count++ != num_products) {
    if (count > num_products/2) {
        console.log("Don't ask for anything else!");
        process.exit();
    }
    if (count > 0.25*num_products && count < 0.75*num_products) {
        console.log(`Item #${count} is sold out!`);
        continue;
    }
    console.log(`${count}. ${eval('name' + count)}`);
}
console.log("That's all we have!");
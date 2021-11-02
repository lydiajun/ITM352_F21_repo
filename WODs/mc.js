var initialAmount = 67;
var Q;
var D;
var N;
var P;

Q = parseInt(initialAmount/25);
amount1 = initialAmount - Q*25;

D = parseInt(amount1/10);
amount2 = amount1 - D*10;

N = parseInt(amount2/5);
amount3 = amount2 - N*5;

P = parseInt(amount3);

var change = {Q, D, N, P};

console.log(change)
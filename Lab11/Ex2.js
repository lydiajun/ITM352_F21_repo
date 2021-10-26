var attributes  =  "Lydia;20;20.5;-19.5";

var pieces = attributes.split(';');

for(part of pieces) {
    console.log(part, typeof part);
}

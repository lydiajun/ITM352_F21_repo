var attributes  =  "Lydia;20;20.5;-19.5";

var parts = attributes.split(';');

for(part of parts) {
    console.log(part, typeof part);
}

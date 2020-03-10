var f = function(a,b){
  return a+b;
}

console.log(f(1,5));

var d = [f];
console.log(d[0](1,5));

var o = {
  'func':f
}
o.func(1,5);

var c = {
  'log':function(name){
    console.log(name);
  }
}
c.log('Hello, world');

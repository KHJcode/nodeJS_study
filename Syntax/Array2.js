var number = [1,2,3,4,5,6,7,8];
var i =0;
var total = 0;
while (number[i] != undefined){
  console.log(number[i]);
  total += number[i];
  i++;
}
console.log(`total : ${total}`);

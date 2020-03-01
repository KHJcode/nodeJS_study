var members = ['hyungjin','haegeun','KIMstudio'];
console.log(members[0]);

var i = 0;

while(members[i] !== undefined){
  console.log('ㅇㅇ',members[i]);
  i++;
}


var roles = {
  'programmer':'kimhyungjin',
  'designer':null,
  'developer': 'we'
};

console.log(roles.developer);


for(var name in roles) {
  console.log('object:',name,'value:',roles[name]);
}

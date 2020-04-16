const low = require('lowdb');
const shortid = require('shortid');
const FileSync = require('lowdb/adapters/Filesync');
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ topic: [], author: []}).write();
/*db.get('author').push({
    id: 1,
    name: 'khj',
    profile: 'developer'
}).write();
db.get('topic').push({
    id: 1,
    title: 'lowdb',
    description: 'lowdb is ...',
    author:1
}).write();
db.get('topic').push({
    id: 2,
    title: 'mysql',
    description: 'mysql is ...',
    author:1
}).write();
console.log(
    db.get('topic')
    .find({title:'lowdb', author:1})
    .value()); 
db.get('topic')
    .find({id:2})
    .assign({title:"MySQL & MariaDB"})
    .write(); 
db.get('topic')
    .remove({id:2})
    .write();*/
var sid = shortid.generate();
db.get('author')
    .push({
        id:sid,
        name: 'khyungjin',
        profile: 'data scientist'
    }).write();
db.get('topic')
    .push({
        id:shortid.generate(),
        title:'PostgreSQL',
        description: 'PostgreSQL is...',
        author:sid
    }).write();
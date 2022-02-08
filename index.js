const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

const PORT = process.env.PORT ?? 8000

const jsonFile = fs.readFileSync('./db.json');

var bodyParser = require('body-parser');
const { reset } = require('nodemon');

var jsonParser = bodyParser.json()
 
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(function(req, res, next) {
  if (req.headers['content-type'] === 'application/json;') {
    req.headers['content-type'] = 'application/json';
  }
  next();
});

app.use(express.json({
  type: 'application/vnd.api+json',
    strict: false
}))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
});

app.get('/api/db.json', (req, res) =>{
  res.sendFile(path.resolve(__dirname, 'db.json'))
});

app.delete(`/api/db.json/:id`, function(req,res){
  const id = req.params.id;
  let data = fs.readFileSync('./db.json', "utf8");
  let todos = JSON.parse(data);
  let index = -1;
  for(var i=0; i < todos.length; i++){
      if(todos[i].id==id){
          index=i;
          break;
      }
  }
  if(index > -1){
      const todo = todos.splice(index, 1)[0];
      data = JSON.stringify(todos);
      fs.writeFileSync("./db.json", data);
      res.send(todo);
  }
  else{
      res.status(404).send();
  }
});

app.post("/api/db.json", jsonParser, function (req, res) {
        
  const title = req.body.title;
  let todo = {title: title, completed: false};
    
  let data = fs.readFileSync('./db.json', "utf8");
  let todos = JSON.parse(data);
    
  const id = Math.max.apply(Math,todos.map(function(o){return o.id;}))
  todo.id = id+1;
  todos.push(todo);
  data = JSON.stringify(todos);
  fs.writeFileSync("./db.json", data);
  res.send(todo);
});

app.put("/api/db.json/:id", function(req, res){
  const todoId = req.body.id
  let todoCompleted = req.body.completed
  console.log(todoCompleted)
  console.log(todoId)
  let data = fs.readFileSync('./db.json', 'utf-8')
  let todos = JSON.parse(data)
  let todo;
    for(var i=0; i<todos.length; i++){
        if(todos[i].id==todoId){
            todo = todos[i];
            break;
        }
    }
    if(todo) {
      todo.completed = todoCompleted;
      data = JSON.stringify(todos);
        fs.writeFileSync("./db.json", data);
        res.send(todo);
    }
  

});




app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));
async function start() {
    app.listen(PORT, () => {
      console.log(`Server started on port http://localhost:${PORT}`)
    })
  };
start();
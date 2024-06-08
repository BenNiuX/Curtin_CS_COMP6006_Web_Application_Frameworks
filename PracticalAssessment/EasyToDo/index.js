const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_USER = process.env.DB_USER;
const DB_PWD = process.env.DB_PWD;
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "https://ajax.googleapis.com"],
      },
    },
  }),
);
app.use(morgan('tiny'));
app.use(timeout('5s'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'pug');

const todoSchema = new mongoose.Schema({
  taskName: String,
  dateCreated: { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', todoSchema);

function verifyTaskName(req, res, next) {
  const schema = Joi.object().keys({
    taskName: Joi.string().min(3).trim().truncate().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details);
  } else {
    next();
  }
}

async function createTask(name) {
  console.log(`create task: ${name}`);
  const newTask = new Todo({ taskName: name });
  const result = await newTask.save();
  console.log(`save new task: ${name}`);
  return result;
}

async function getTasks() {
  const items = [];
  const result = await Todo.find().select({
    taskName: 1,
    dateCreated: 1,
  });
  for (index in result) {
    items.push({
      _id: result[index]._id.toString(),
      taskName: result[index].taskName,
      dateCreated: `${result[index].dateCreated.toLocaleTimeString()} 
                        ${result[index].dateCreated.toLocaleDateString()}`,
    });
  }
  return items;
}

async function deleteTask(id) {
  console.log(`delete task: ${id}`);
  oid = new mongoose.Types.ObjectId(id);
  const result = await Todo.deleteOne(oid);
  return result;
}

app.get('/', (req, res) => {
  getTasks()
    .then((data) => {
      console.log(`Get task size: ${data.length}`);
      res.render('index', { toDoList: data });
    })
    .catch((err) => {
      console.log('Could not get tasks', err);
    });
});

app.post('/todos', verifyTaskName, (req, res) => {
  createTask(req.body.taskName)
    .then((data) => {
      console.log(`create: ${data}`);
      res.redirect('/');
    })
    .catch((err) => {
      console.log('Could not create task', err);
    });
});

app.delete('/todos/:id', (req, res) => {
  deleteTask(req.params.id)
    .then((data) => {
      // console.log(`delete: ${data}`);
      // res.redirect('/');
      // Handled by jquery
      res.send(`Delete id=${req.params.id} success`);
    })
    .catch((err) => {
      console.log('Could not delete task', err);
      res.send(err);
    });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

mongoose
  .connect(`mongodb+srv://${DB_USER}:${DB_PWD}@${DB_URL}/${DB_NAME}`)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB', err);
  });

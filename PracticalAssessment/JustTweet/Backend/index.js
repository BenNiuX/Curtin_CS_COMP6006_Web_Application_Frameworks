const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 3000;
const DB_USER = process.env.DB_USER;
const DB_PWD = process.env.DB_PWD;
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

app.use(cors());
app.use(helmet());
app.use(timeout('5s'));
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
  nameFirst: String,
  nameLast: String,
  nameShort: String,
  city: String,
  state: String,
  registerDate: { type: Date, default: Date.now },
  numPost: { type: Number, default: 0 },
  numFollowing: { type: Number, default: 0 },
  numFollower: { type: Number, default: 0 },
  numLike: { type: Number, default: 0 },
  follower: { type: [String], default: [] },
  following: { type: [String], default: [] },
});

const User = mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
  userId: String,
  content: String,
  createDate: { type: Date, default: Date.now },
  atUsers: { type: [String], default: [] },
  numView: { type: Number, default: 0 },
  numRepost: { type: Number, default: 0 },
  numQuote: { type: Number, default: 0 },
  numLike: { type: Number, default: 0 },
  numBookmark: { type: Number, default: 0 },
});

const Post = mongoose.model('Post', postSchema);

function verifyUserCreated(req, res, next) {
  const schema = Joi.object().keys({
    nameFirst: Joi.string().min(1).trim().required(),
    nameLast: Joi.string().min(1).trim().required(),
    nameShort: Joi.string().min(1).trim().required(),
    city: Joi.string().min(1).trim().required(),
    state: Joi.string().min(1).trim().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details);
  } else {
    next();
  }
}

function verifyUserId(req, res, next) {
  const schema = Joi.object().keys({
    userId: Joi.string().min(24).max(24).trim().required(),
  });
  const result = schema.validate(req.query);
  if (result.error) {
    res.status(400).send(result.error.details);
  } else {
    next();
  }
}

function verifyContent(req, res, next) {
  const schema = Joi.object().keys({
    content: Joi.string().min(3).trim().required(),
    userId: Joi.string().length(24).trim().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details);
  } else {
    next();
  }
}

async function updateNumPost(userId) {
  console.log(`update for ${userId}`);
  const searchPost = { userId: userId };
  const posts = await Post.find(searchPost);
  const numPost = posts.length;
  console.log(`numPost: ${numPost}`);
  const searchUser = { _id: new mongoose.Types.ObjectId(userId) };
  const userInfo = await User.findOne(searchUser);
  userInfo.set({ numPost: numPost });
  await userInfo.save();
}

app.get('/users', (req, res) => {
  console.log(`query users: '${req.query.userId}'`);
  const userId = req.query.userId;
  let searchCon = {};
  if (userId !== undefined) {
    searchCon = { _id: new mongoose.Types.ObjectId(userId) };
  }
  User.find(searchCon)
    .then((data) => {
      console.log(`query users: ${data}`);
      res.send(data);
    })
    .catch((err) => {
      console.log('query user error', err);
      res.status(404).send('Could not query user');
    });
});

app.post('/user', verifyUserCreated, (req, res) => {
  console.log(`create user ${req.body.nameFirst}`);
  const newUser = new User({
    nameFirst: req.body.nameFirst,
    nameLast: req.body.nameLast,
    nameShort: req.body.nameShort,
    city: req.body.city,
    state: req.body.state,
  });
  newUser
    .save()
    .then((data) => {
      console.log(`create user success: ${data}`);
      res.send(data);
    })
    .catch((err) => {
      console.log('create user error', err);
    });
});

app.get('/posts', verifyUserId, (req, res) => {
  console.log(`query param: ${req.query.userId}`);
  const userId = req.query.userId;
  let searchCon = {};
  if (userId !== undefined) {
    searchCon = { userId: userId };
  }
  Post.find(searchCon)
    .sort({ createDate: -1 })
    .then((data) => {
      // console.log(`query posts: ${data}`);
      res.send(data);
    })
    .catch((err) => {
      console.log('Could not query posts', err);
      res.status(404).send('Could not query posts');
    });
});

app.post('/posts', verifyContent, (req, res) => {
  const userId = `${req.body.userId}`;
  console.log(`create post: ${req.body.content} ${userId}`);
  const newPost = new Post({
    content: req.body.content,
    userId: userId,
    numView: Math.floor(Math.random() * 100),
    numRepost: Math.floor(Math.random() * 100),
    numQuote: Math.floor(Math.random() * 100),
    numLike: Math.floor(Math.random() * 100),
    numBookmark: Math.floor(Math.random() * 100)
  });
  newPost
    .save()
    .then((data) => {
      console.log(`save post: ${data}`);
      updateNumPost(userId).then(() => {
          res.send(data);
        }
      );
    })
    .catch((err) => {
      console.log('save post error', err);
      res.status(400).send('create post fail');
    });
});

app.delete('/post/:id', (req, res) => {
  const postId = `${req.params.id}`;
  console.log(`delete post: ${postId}`);
  const oid = new mongoose.Types.ObjectId(postId);
  Post.findOne({ _id: oid })
      .then((data) => {
        const userId = data.userId;
        Post.deleteOne(oid)
        .then((data) => {
          updateNumPost(userId).then(() => {
            res.send(`Delete ${data} success`);
          });
        })
        .catch((err) => {
          console.log('Could not delete task', err);
          res.status(400).send(err);
        });
        
      })
  
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

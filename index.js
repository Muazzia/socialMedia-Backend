require('dotenv').config();
const express = require('express');
require('express-async-errors');
const cors = require('cors');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');


const register = require('./controllers/auth');
const createPost = require('./controllers/posts');


const auth = require('./routes/auth');
const users = require('./routes/users');
const posts = require('./routes/posts');

const verifyToken = require('./middlewares/verifyToken');


const app = express();
app.use(cors({
    exposedHeaders: ['x-auth-token'], // Include 'x-auth-token' in the exposed headers
}));

// Connecting to db
mongoose.connect(process.env.db)
    .then(() => { console.log('Connected to db'); })
    .catch((err) => console.log(err))


app.use(express.json());
app.use(express.static('public/assets'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));


// File Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage });


// routes with files
app.post('/auth/register', upload.single('picturePath'), register);
app.post('/posts', [verifyToken, upload.single('picturePath')], createPost);

// Routes
app.use('/auth', auth);
app.use('/users', users);
app.use('/posts', verifyToken, posts);

// error
app.use(function (err, res, req, next) {
    console.log(err);
    req.status(500).send('Something went bad try again');
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening to ${port}`);
})

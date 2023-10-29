require('dotenv').config();
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");


const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');


const register = require('./controllers/auth');
const createPost = require('./controllers/posts');


const auth = require('./routes/auth');
const users = require('./routes/users');
const posts = require('./routes/posts');

const verifyToken = require('./middlewares/verifyToken');
const verifyObjectId = require('./middlewares/verifyObjectId');
const updatePost = require('./controllers/updatePost');
const configureSocket = require('./socket');
const updateUser = require('./controllers/updateUser');


// cloudinary
const uploadToCloudinary = require('./middlewares/addImageToCloudinary');

const app = express();

const httpServer = createServer(app);
configureSocket(httpServer)



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
app.post('/auth/register', [upload.single('picturePath'), uploadToCloudinary], register);
app.put('/users/:id', [verifyToken, verifyObjectId, upload.single('picturePath'), uploadToCloudinary], updateUser);
app.put('/posts/:id', [verifyToken, upload.single('picturePath'), uploadToCloudinary, verifyObjectId], updatePost)
app.post('/posts', [verifyToken, upload.single('picturePath'), uploadToCloudinary,], createPost);

// Routes
app.use('/auth', auth);
app.use('/users', users);
app.use('/posts', verifyToken, posts);

// error
app.use(function (err, res, req, next) {
    console.log(err);
    req.status(500).send('Something went bad try again', err);
})


const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log(`listening to ${port}`);
})

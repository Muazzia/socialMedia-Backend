const mongoose = require("mongoose");
const { validate, Post } = require("../models/Post");
const { User } = require("../models/User");

const createPost = async (req, res) => {
    const imgSecureUrl = req.imgSecureUrl;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const { userId, description } = req.body;
    const picturePath = req.file ? req.file.originalname : null;
    if (!picturePath) return res.status(400).send('Pls provide Image');

    if (!validateId) return res.status(400).send('Invalid Object id');
    const user = await User.findById(userId);

    const post = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.imgSecureUrl,
        picturePath,
        likes: {},
        comments: [],
        imgSecureUrl,
    })

    await post.save();

    const posts = await Post.find();
    res.send(posts);

}


const validateId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}


module.exports = createPost;    
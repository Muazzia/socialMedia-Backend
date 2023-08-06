const express = require('express');
const mongoose = require('mongoose');
const { Post } = require('../models/Post');
const verifyObjectId = require('../middlewares/verifyObjectId');

const router = express.Router();

router.get('/', async (req, res) => {
    const posts = await Post.find();
    res.send(posts);
})

router.get('/:id/posts', verifyObjectId, async (req, res) => {
    const posts = await Post.findById(req.params.id);
    res.send(posts);
})

router.get('/:id/allposts', verifyObjectId, async (req, res) => {
    const posts = await Post.find({ userId: req.params.id });
    res.send(posts);
})


router.put('/:id/like', verifyObjectId, async (req, res) => {
    if (!req.body.userId) return res.status(400).send('User id is requierd in body');
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) return res.status(400).send('User id is not valid');

    const userId = req.body.userId;
    const post = await Post.findById(req.params.id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
        post.likes.delete(userId);
    } else {
        post.likes.set(userId, true);
    }

    const upadtedPost = await Post.findByIdAndUpdate(req.params.id, { likes: post.likes }, { new: true })

    res.send(upadtedPost);
});


module.exports = router;

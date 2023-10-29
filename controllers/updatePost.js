const { Post } = require("../models/Post");
const Joi = require("joi");

const updatePost = async (req, res) => {
    const imgSecureUrl = req.imgSecureUrl;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const picturePath = req.file ? req.file.originalname : null;
    if (!picturePath) return res.status(400).send('Pls provide Image');


    const posts = await Post.findByIdAndUpdate(req.params.id, {
        description: req.body.description,
        picturePath,
        imgSecureUrl
    }, { new: true })

    res.send(posts);
}


const validate = (post) => {
    const schema = Joi.object({
        description: Joi.string().max(255),
    });
    return schema.validate(post);
}




module.exports = updatePost;    
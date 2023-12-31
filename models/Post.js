const Joi = require('joi');
const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    location: String,
    description: String,
    userPicturePath: String,
    picturePath: String,
    likes: { type: Map, of: Boolean },
    comments: { type: Array, default: [] },
    imgSecureUrl: String,
    imgSecureUrl: String
}, { timestamps: true })

const Post = mongoose.model('Post', schema);

const validate = (post) => {
    const schema = Joi.object({
        userId: Joi.string().max(50).required(),
        description: Joi.string().max(255),
    })

    return schema.validate(post);
}

const validateComments = (comment) => {
    const schema = Joi.object({
        userId: Joi.string().max(100).required(),
        comment: Joi.string().min(1).max(255).required()
    })

    return schema.validate(comment);
}

module.exports.Post = Post;
module.exports.validate = validate;
module.exports.validateComments = validateComments;

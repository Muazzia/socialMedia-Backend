const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const schema = new mongoose.Schema({
    firstName: {
        type: String, required: true, min: 3, max: 50,
    },
    lastName: {
        type: String, min: 3, max: 50,
    },
    email: {
        type: String, time: true, required: true, maxlength: 255, unique: true
    },
    password: { type: String, min: 5, max: 50, required: true },
    picturePath: { type: String, default: "" },
    friends: { type: Array, default: [] },
    location: { type: String, default: "" },
    occupation: { type: String, default: "" },
    viewedProfile: { type: Number, default: Math.floor(Math.random() * 1000) },
    impressions: { type: Number, default: Math.floor(Math.random() * 1000) }

}, { timestamps: true });



schema.methods.getAuthToken = function () {
    return jwt.sign({ _id: this._id, email: this.email }, process.env.jwtKey);
}

const validate = (user) => {
    const schema = Joi.object({
        firstName: Joi.string().required().min(3).max(50),
        lastName: Joi.string().required().min(3).max(50),
        email: Joi.string().required().max(50).trim().email(),
        password: Joi.string().required().min(5).max(50),
        picturePath: Joi.string(),
        friends: Joi.array(),
        location: Joi.string(),
        occupation: Joi.string(),
        viewedProfile: Joi.number(),
        impression: Joi.number(),
    })

    return schema.validate(user);
}

const User = mongoose.model('User', schema);


module.exports.User = User;
module.exports.validate = validate;
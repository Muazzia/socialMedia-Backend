const Joi = require('joi');
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },

}, { timestamps: true });

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    messages: [messageSchema]
});

const validate = (chat) => {
    const schema = Joi.object({
        sender: Joi.string().min(1).max(255),
        receiver: Joi.string().min(1).max(255),
        message: Joi.string().min(1).max(255),
    });
    return schema.validate(chat);
}

module.exports.Chat = mongoose.model('Chat', chatSchema);
module.exports.validateChat = validate;


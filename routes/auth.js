const express = require('express')
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send('Invalid credentials');

    const decoded = await bcrypt.compare(req.body.password, user.password);
    if (!decoded) return res.status(404).send('Invalid credentials');

    const token = jwt.sign({ id: user._id }, process.env.jwtKey);

    user = user.toObject();
    delete user.password;

    res.header('x-auth-token', token).send(user);
});


const validate = (user) => {
    const schema = Joi.object({
        email: Joi.string().required().max(50).trim().email(),
        password: Joi.string().required().min(5).max(50),
    })

    return schema.validate(user);
}

module.exports = router;
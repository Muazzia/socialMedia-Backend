const bcrypt = require('bcrypt');
const _ = require('lodash');
const { validate, User } = require('../models/User');


const register = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const { firstName, lastName, email, password, friends, location, occupation, viewedProfile, impressions } = req.body;
    const picturePath = req.file ? req.file.originalname : null;

    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);

    let user = await User.findOne({ email });
    if (user) return res.status(400).send('Email is already registered');

    user = new User({
        firstName,
        lastName,
        password: hashPass,
        email,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile,
        impressions,
    });

    const token = user.getAuthToken();

    await user.save();

    delete user.password;
    res.header('x-auth-token', token).send(user);
};



module.exports = register;
const Joi = require('joi');
const { User } = require('../models/User');
const bcrypt = require('bcrypt');

// const updateUser = async (req, res) => {
//     const { error } = validate(req.body);
//     if (error) return res.status(400).send(error.message);

//     const picturePath = req.file ? req.file.originalname : null;
//     if (!picturePath) return res.status(400).send('Pls provide Image');

//     const { firstName, lastName, email, password, location, occupation } = req.body;

//     const salt = await bcrypt.genSalt();
//     const hashPass = await bcrypt.hash(password, salt);

//     const user = await User.findByIdAndUpdate(req.params.id, {
//         firstName,
//         lastName,
//         email,
//         password: hashPass,
//         picturePath,
//         location,
//         occupation
//     }, { new: true });

//     if (!user) return res.status(404).send('User not found.');

//     const removedPassUser = user.toObject();
//     delete removedPassUser.password;
//     res.send(removedPassUser);

// }

const updateUser = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const picturePath = req.file ? req.file.originalname : null;
    if (!picturePath) return res.status(400).send('Please provide an image');

    const { firstName, lastName, email, password, location, occupation } = req.body;

    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);

    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found.');

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = hashPass;
    user.picturePath = picturePath;
    user.location = location;
    user.occupation = occupation;

    user = await user.save(); // Manually call save() to trigger middleware

    // Trigger middleware to update associated posts' userPicturePath

    const removedPassUser = user.toObject();
    delete removedPassUser.password;
    res.send(removedPassUser);
}

const validate = (user) => {
    const schema = Joi.object({
        firstName: Joi.string().required().min(3).max(50),
        lastName: Joi.string().required().min(3).max(50),
        email: Joi.string().required().max(50).trim().email(),
        password: Joi.string().required().min(5).max(50),
        location: Joi.string().optional().max(255),
        occupation: Joi.string().optional().max(255)
    })

    return schema.validate(user);
}


module.exports = updateUser
const mongoose = require('mongoose');

const verifyObjectId = (req, res, next) => {
    const id = req.params.id;
    if (mongoose.Types.ObjectId.isValid(id)) {
        if (req.params.friendId) {
            if (!mongoose.Types.ObjectId.isValid(req.params.friendId)) return res.status(400).send('Friend Id is not valid')
        }
        next();
    }
    else {
        return res.status(400).send('Id is not valid');
    }
};

module.exports = verifyObjectId;
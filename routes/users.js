const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const verifyObjectId = require('../middlewares/verifyObjectId');
const { User } = require('../models/User');
const router = express.Router();


router.get('/:id', [verifyToken, verifyObjectId], async (req, res) => {
    const id = req.params.id;
    let user = await User.findById(id);
    if (!user) return res.status(404).send('Not Found');

    user = user.toObject();
    delete user.password;

    res.send(user);
});

router.get('/:id/friends', [verifyToken, verifyObjectId], async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).send('Not Found');

    const friends = await Promise.all(
        user.friends.map(id => User.findById(id))
    );

    const formatedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => ({ _id, firstName, lastName, occupation, location, picturePath })
    );

    res.send(formatedFriends);
});


router.put('/:id/:friendId', [verifyToken, verifyObjectId], async (req, res) => {
    const id = req.params.id;
    const friendId = req.params.friendId;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user && !friend) return res.status(404).send('Invalid Ids');

    if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter(Id => Id !== friendId);
        friend.friends = friend.friends.filter(Id => Id !== id);
    } else {
        user.friends.push(friendId);
        friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const List = await Promise.all(
        user.friends.map(id => User.findById(id))
    );

    const formatedFriends = List.map(({ _id, firstName, lastName, occupation, location, picturePath }) => ({ _id, firstName, lastName, occupation, location, picturePath }));

    res.send(formatedFriends);
})

module.exports = router;
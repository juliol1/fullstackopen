const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', {
        url: 1,
        title: 1,
        author: 1,
    });
    res.json(users);
});

userRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(400).json({ error: 'Username must be unique' });
    }

    if (!password || password.length < 3) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    if (!username || username.length < 3) {
        return res.status(400).json({ error: 'Invalid username' });
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
});

module.exports = userRouter;

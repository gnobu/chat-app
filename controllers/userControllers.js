const expressAsyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const generateToken = require("../config/generateToken");
const User = require('../models/userModel');
const cloudinary = require('cloudinary').v2;
const cloudinaryConfig = require("../config/cloudinaryConfig");

const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please enter all the fields');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        // pic: pic?.public_id,
        pic: {p_id: pic?.public_id, version: pic?.version},
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(400);
        throw new Error('Failed to create the User');
    }
});



const sendSignature = expressAsyncHandler(async (req, res) => {
    const api_key = cloudinaryConfig.api_key;
    const cloud_name = cloudinaryConfig.cloud_name;
    const timestamp = Math.round(Date.now() / 1000) - (55 * 60);
    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp
        },
        cloudinaryConfig.api_secret
    )
    res.json({ api_key, cloud_name, timestamp, signature })
});



const authUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(401);
        throw new Error('Invalid Email or password');
    }
})


// /api/user?search=user'sname
const allUsers = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});

module.exports = {
    registerUser,
    sendSignature,
    authUser,
    allUsers
}
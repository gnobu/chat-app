const expressAsyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const cloudinaryConfig = require("../config/cloudinaryConfig");
const User = require('../models/userModel');
const cloudinary = require('cloudinary').v2;

const protect = expressAsyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed.");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token.");
    }
});

const validatePic = expressAsyncHandler(async (req, res, next) => {
    if (!req.body?.pic) {
        next();
    } else {
        const { public_id, version, signature } = req.body?.pic;

        if (!public_id || !version || !signature) {
            res.status(401);
            throw new Error("Not authorized, incomplete credentials.");
        }

        const expectedSignature = cloudinary.utils.api_sign_request({ public_id, version }, cloudinaryConfig.api_secret);

        if (expectedSignature === signature) {
            next();
        } else {
            res.status(401);
            throw new Error("Not authorized, bad signature.");
        }
    }
})


module.exports = { protect, validatePic };
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const maxAge = 3 * 24 * 60 * 60; // 3 days
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: maxAge });
}

module.exports = generateToken;
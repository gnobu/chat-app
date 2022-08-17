require('dotenv').config();
const express = require('express');
const app = express();

const { PORT } = process.env || 5000;
// const chats = require('./data/data');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cloudinary = require('cloudinary').v2;


connectDB(() => {
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('API is running');
        // res.send(cloudinaryConfig);
    })

    app.use('/api/user', userRoutes);

    app.use('/api/chat', chatRoutes);

    app.use(notFound);

    app.use(errorHandler);

    app.listen(PORT, console.log(`Server running on port http://localhost:${PORT}`));
});

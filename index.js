require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const { PORT } = process.env || 5000;
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');


connectDB(() => {
    app.use(express.json());
    app.use(cors());

    app.get('/', (req, res) => {
        res.send('API is running');
    })

    app.use('/api/user', userRoutes);

    app.use('/api/chat', chatRoutes);

    app.use('/api/message', messageRoutes);

    app.use(notFound);

    app.use(errorHandler);

    app.listen(PORT, console.log(`Server running on port http://localhost:${PORT}`));
});

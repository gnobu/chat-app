const mongoose = require('mongoose');
const { DB_URI, DB_PASSWORD, DB_USERNAME } = process.env;

const db_uri = DB_URI.replace(/\<username\>/g, encodeURIComponent(DB_USERNAME)).replace(/\<password\>/g, encodeURIComponent(DB_PASSWORD))


const connectDB = async (cb) => {
    try {
        const conn = await mongoose.connect(
            db_uri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        // console.log(`MongoDB connected: ${conn.connection.host}`);
        cb();
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;
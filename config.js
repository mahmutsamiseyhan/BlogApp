require('dotenv').config();

const config = {
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE
    },
    email: {
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_USERNAME
    },
    sessionSecret: process.env.SESSION_SECRET
}

module.exports = config;

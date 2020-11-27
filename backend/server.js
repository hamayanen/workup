const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!:( Shutting down...');
    console.log(err.name, err.message);

    process.exit(1);
});

dotenv.config({ path: `${__dirname}/config.env` });

const DB = process.env.DATABASE.replace(
    'kzXgfFbm2WHxYyA',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App runnimg on port ${port}...`)
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLER REJECTION!:( Shutting down...');
    console.log(err.name, err.message);

    server.close(() => {
        process.exit(1);
    });
});
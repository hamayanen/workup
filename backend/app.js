const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');

const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const jobRouter = require('./routes/jobRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'リクエストのしすぎです。1時間後に再度試してください'
});
app.use('/', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(mongoSanitize());

app.use(xss());

app.use(cookieParser());

app.use(cors({
    origin: 'https://127.0.0.1:8080',
    credentials: true
}));


app.use((req, res, next) => {
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'https://127.0.0.1:8080');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/jobs', jobRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`))
});

app.use(globalErrorHandler);

module.exports = app;
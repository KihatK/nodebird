const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const hpp = require('hpp');
const helmet = require('helmet');
const dotenv = require('dotenv');

const db = require('./models');
const passportConfig = require('./passport');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const hashtagRouter = require('./routes/hashtag');
const logger = require('./logger');

const app = express();
db.sequelize.sync();
dotenv.config();
passportConfig();

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
    app.use(helmet());
    app.use(hpp());
}
else {
    app.use(morgan('combined'));
}
app.use(express.static('uploads'));
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'aosifj',
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/posts', postsRouter);
app.use('/api/hashtag', hashtagRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    logger.info('hello');
    logger.error(err.message);
    next(err);
});

app.listen(3065, () => {
    console.log('포트 3065번에서 서버 대기 중입니다.');
})
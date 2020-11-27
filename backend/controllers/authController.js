const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const Email = require('../utils/email');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        secure: false,
        httpOnly: false
    };
    if(process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true,
        cookieOptions.httpOnly = true
    };
    
    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
} 


exports.signup = catchAsync(async (req, res, next) => {
    const { email, password, passwordConfirm } = req.body;

    if(!email && !password) {
        return next(new AppError('メールアドレス、パスワードを入力してください'), 400)
    }

    if(password < 8 && password) {
        return next(new AppError('パスワードは8文字以上で入力してください'), 400)
    }

    if(password !== passwordConfirm) {
        return next(new AppError('パスワードが一致していません', 401))
    }

    const newUser = await User.create({
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        videoID: uuidv4(),
        role: req.body.role
    });

    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, res);
});


exports.login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new AppError('メールアドレスまたは、パスワードを入力してください', 400))
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user || !await user.correctPassword(user.password, password)) {
        return next(new AppError('パスワードが正しくありません', 401));
    }

    createSendToken(user, 200, res);
});


exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() - 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};


exports.updatePassword = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if(!req.body.currentPassword || !req.body.newPassword || !req.body.newPasswordConfirm) {
        return next(new AppError('パスワードを入力してください', 400))
    }

    if(!await user.correctPassword(user.password, req.body.currentPassword)) {
        return next(new AppError('現在のパスワードが正しくありません', 401))
    };

    if(!await(req.body.newPassword === req.body.newPasswordConfirm)) {
        return next(new AppError('新しいパスワードが一致しません', 401))
    };

    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await user.save();

    createSendToken(user, 200, res);
});


exports.forgotPassword = catchAsync(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return next(new AppError('一致するメールアドレスがありません', 404));
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    try {
        const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
        // const resetURL = `https://127.0.0.1:8080/resetPassword/${resetToken}`;

        await new Email(user, resetURL).sendPasswwordReset();

        res.status(200).json({
            status: 'success',
            message: 'トークンを送りました'
        });
    }catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        console.log(err)

        return next(new AppError('メールを送ることに失敗しました。後ほど試してください。', 500))
    }
});


exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.body.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken, 
        passwordResetExpires: {$gt: Date.now()}
    });

    if(!user) {
        return next(new AppError('トークンが無効または期限切れです', 400))
    };

    if(password < 8 && password) {
        return next(new AppError('パスワードは8文字以上で入力してください'), 400)
    };

    if(password !== passwordConfirm) {
        return next(new AppError('パスワードが一致していません', 401))
    };

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    createSendToken(user, 200, res);
});


exports.protect = catchAsync(async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt) {
        token = req.cookies.jwt
    };

    if(!token) {
        return next(new AppError('アクセスするためにログインしてください', 401));
    };

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError('このユーザーはもう存在しません', 401));
    };

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});



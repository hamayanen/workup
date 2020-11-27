const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const argon2 = require('argon2');

const userShema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'メールアドレスを入力してください'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'メールアドレスは正確な型で入力してください']
    },
    role: {
        type: String,
        enum: ['user', 'company'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'パスワードを入力してください'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, '確認用のパスワードを入力してください'],
        validate: {
            validator: function(el) {
                return el === this.password;
            }
        },
        message: 'パスワードが一致していません'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    videoID: {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userShema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await argon2.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userShema.methods.correctPassword = async function(cryptoPassword, userPassword) {
    return await argon2.verify(cryptoPassword, userPassword);
};

userShema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userShema.methods.changePasswordAfter = function(JWTTimestamp) {
    if(passwordChangedAt) {
        const changeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        console.log(changeTimestamp, JWTTimestamp);
        return JWTTimestamp < changeTimestamp;
    };

    return false;
};

userShema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userShema);

module.exports = User;
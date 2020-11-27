const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, '仕事の名前をご入力してください'],
        maxlength: [40, '仕事の名前は40文字以内でご入力してください'],
        minlength: [3, '仕事の名前は3文字以上でご入力してください']
    },
    companyName: {
        type: String,
        required: [true, '会社の名前をご入力してください'],
        trim: true,
    },
    location: {
        type: String,
        require: [true, '場所をご入力してください'],
        trim: true
    },
    monthlySalaryMin: {
        type: Number
    },
    monthlySalaryMax: {
        type: Number
    },
    hourlyWage: {
        type: Number
    },
    employStatus: {
        type: String,
        require: [true, '雇用形態を入力してください'],
        enum: {
            values: ['アルバイト', '派遣社員', '正社員'],
            message: '雇用形態は、アルバイト、派遣社員、契約社員、新卒、正社員の中から'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, '会社説明を入力してください']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;


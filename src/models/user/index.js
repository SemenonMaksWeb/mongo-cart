// Подключение Общее
const mongoose = require("../../bd");
const Schema = mongoose.Schema;
let uniqueValidator = require('mongoose-unique-validator');
let auto_increment = require("../plagins/auto_increment");
const user = new Schema({
    _id: Number,
    name:{
        type: String,
        required: [true, "Название пользователя обязательное поле"],
        unique: true,
    },
    password:{
        type: String,
        required: [true, "Пароль пользователя обязательное поле"],
    },
    token:{
        type: String,
    },
})
// Дефолтные действия
user.pre('save', function(next) {
    auto_increment(user, this, next);
});
user.plugin(uniqueValidator, { message: '{PATH} user является уникальным' });
const user_model = mongoose.model('user', user);
module.exports = user_model;
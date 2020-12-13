// Подключение Общее
const mongoose = require("../../bd");
let uniqueValidator = require('mongoose-unique-validator');
let auto_increment = require("../plagins/auto_increment");
const Schema = mongoose.Schema;
const class_heroes = new Schema({
    _id: Number,
    name:{
        type:String,
        lowercase: true,
        trim: true,
        required: [true, "Названия героя является обязательным значением"],
        unique: true,

    }
});
class_heroes.pre('save', function(next) {
    auto_increment(class_heroes_model, this, next);
});
// Дефолтные действия
class_heroes.plugin(uniqueValidator, { message: 'Названия героя является уникальным' });
const class_heroes_model = mongoose.model('class_heroes', class_heroes);
module.exports = class_heroes_model;
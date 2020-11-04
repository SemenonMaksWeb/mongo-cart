// Подключение Общее
const mongoose = require("../../bd");
let uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
let auto_increment = require("../plagins/auto_increment");
let perk = new Schema({
    _id: Number,
    name:{
        type:String,
        required: [true, "Название перка обязательное поле"],
        unique: true,
    },
    price:{
        type:Number,
        required:[true, "Стоимость перка обязательное поле"],
        min:  [0,"Указать меньше  0 нельзя"],
        max: [10,"Максимально значение не более 10"]
    },
    img:{
        type:String,
        required: [true, "Изображение перка обязательное поле"],
    },
    description:{
        type:String,
        required: [true, "Описание перка обязательное поле"],
    }

})
perk.pre('save', function(next) {
    auto_increment(perk_model, this, next);
});
// Дефолтные действия
perk.plugin(uniqueValidator, {message: "Названия перка уникальное поле"});
const perk_model = mongoose.model('perk', perk);
module.exports = perk_model;
// Подключение Общее
const mongoose = require("../../bd");
let uniqueValidator = require('mongoose-unique-validator');
let auto_increment = require("../plagins/auto_increment");
const Schema = mongoose.Schema;
const heroes = new Schema({
    _id: Number,
    name:{
        type:String,
        required: [true, "Название героя является обязательным значением"],
        unique: true,

    },
    defaultSkin:{
        type:String,
        required: [true, "Дефолтный скин героя является обязательным значением"],
        unique: true,
    },
    description:{
        type:String,
        required: [true, "Описание героя является обязательным значением"],
    },
    cost:{
        type:Number,
        default: 0,
    },
    // НеРАБОЧИЙ МУСОР
    class_id:{
        type: String,
        required: [true, "Класс героя является обязательным значением"],
    },
    perk_id:{
        type: String,
        required: [true, "Перк героя является обязательным значением"],
    }
})
// Дефолтные действия
heroes.pre('save', async function(next) {
    await auto_increment(heroes_model, this, next);
});
heroes.plugin(uniqueValidator);
const heroes_model = mongoose.model('heroes', heroes);
module.exports = heroes_model;
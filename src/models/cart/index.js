// Подключение Общее
const mongoose = require("../../bd");
const Schema = mongoose.Schema;
let uniqueValidator = require('mongoose-unique-validator');
let auto_increment = require("../plagins/auto_increment");
const сart = new Schema({
    _id: Number,
    name:{
        type:String,
        required: [true, "Название карты является обязательным значением"],
        unique: true,
    },
    type:{
        type: String,
        required: [true, "Тип карты является обязательным значением"],
        enum: ["Существо", "Заклинания"],
    },
    class_id:{
        type: Schema.ObjectId,
        ref: "class_heroes",
    },
    img:{
        type:String,
        required: [true, "Изображение карты является обязательным значением"],
        unique: true,
    },
    description:{
        type:String,
        required: [true, "Описание карты является обязательным значением"],
    },
    cost:{
        type:Number,
        required:[true, "Цена карты является обязательным значением"], 
    },
});
сart.pre('save', function(next) {
    auto_increment(cart_model, this, next);
});
// Дефолтные действия
сart.plugin(uniqueValidator);
let cart_model = mongoose.model('cart', сart);
module.exports = cart_model;
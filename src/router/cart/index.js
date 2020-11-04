const express = require('express');
const router = express.Router();
const cart = require("../../models/cart/index");
const class_heroes = require("../../models/heroes/class");
const  paginatios = require("../../pagination/cart")
/**
 *  Получить всё карты возможно + пагинация
 * **/
router.get("/cart", (req,res) =>{
    let  data  = paginatios(req.query.limit, req.query.page);
    console.log(data);
    cart.find().populate("class_id").skip(data.skip).limit(data.limit).exec().then(cart_data =>{
        if(cart_data.length === 0){
            return res.send({info:"карты еще не созданы"});
        }
        return res.send(cart_data);
    }).catch(err =>{
        res.statusCode = 500;
        return res.send({ error: 'Ошибка сервера'  + err});
    })
})
/**
 *  Получить карту по Id
 * **/
router.get("/cart/:id", (req,res) =>{
    if(!Number(req.params.id)){
        return res.send({error: 'Передаваймое значение должно является числом'});
    }
    cart.findById(req.params.id).populate("class_id").exec( (err, cart_data) => {
        if (!cart_data) {
            res.statusCode = 404;
            return res.send({error: 'Карта не найдена'});
        }
        if(!err){
            return res.send({status: 'OK', cart: cart_data});
        }
        else{
            res.statusCode = 500;
            return res.send({ error: 'Ошибка сервера' + err });
        }
    })
})
/**
 *  Получить карту по поиску названию
 * **/
router.get("/cart/search/:name", (req,res) =>{
    cart.find({name: {$regex:req.params.name} }).populate("class_id").exec( (err,cart_data) => {
        if(cart_data.length === 0) {
            res.statusCode = 404;
            return res.send({ error: `Карта по поиску ${req.params.name}  не найдена` });
        }
        if(!err){
            return res.send({ status: 'OK', cart:cart_data });
        }
        else {
            res.statusCode = 500;
            return res.send({ error: 'Ошибка сервера' });
        }
    })
})
/**
 *  Получить карту по полного совпадению классу
 * **/
router.get("/cart/filter/class/:class", (req,res) =>{
    class_heroes.findOne({name: req.params.class}, (err,class_heroes_data)=>{
        console.log(class_heroes_data);
        if(class_heroes_data !== null){ // Есть ли указанный класс
            cart.find({"class_id": class_heroes_data._id}).populate("class_id").exec( (err , cart_data) =>{
                if(!cart_data || cart_data.length === 0 ) {
                    res.statusCode = 404;
                    return res.send({ error: `Карты класса ${req.params.class} не найдена`});
                }
                if (!err){
                    return res.send({ status: 'OK', cart: cart_data });
                }
                else{
                    res.statusCode = 500;
                    return res.send({ error: 'Ошибка сервера' });
                }
            })
        }else {// Нету указанного класса
            res.statusCode = 404;
            return res.send({ error: `Класс ${req.params.class} не найдена`});
        }
    })
})
/**
 *  Удаление карты по Id
 * **/
router.delete("/cart/:id", (req,res) =>{
    cart.findById(req.params.id, (err, cart_data)=>{
        if(cart_data === null){ // Проверка что пользователь найден
            res.statusCode = 404;
            return res.send({ error: `Карта ${req.params.id} Не найден` });
        }
        return cart_data.remove((err) => { // Удаление пользователя
            if (!err) { // Проверка что нету ошибки сервера
                return res.send({ status: 'OK' });
            }else {// ошибка сервера
                res.statusCode = 500;
                return res.send({ error: 'Ошибка сервиса' });
            }
        })
    })
})
/**
 *  Создание карты
 * **/
router.post('/cart', function(req, res) {
    let cart_data = new cart ({
        name: req.body.name,
        type: req.body.type,
        class_id: req.body.class_id,
        img: req.body.img,
        description: req.body.description,
        cost: req.body.cost,
    })
    cart_data.save(function (err) {
        if (!err) {
            res.statusCode = 400;
            return res.send({ status: 'OK', cart:cart_data });
        }
        if(err.name === 'ValidationError') {
            res.statusCode = 404;
            let error_message = [];
            for (const key in err.errors) {
                if(key === "cost" && err.errors[key].kind === "Number"){// Проверка на что цена это число
                    error_message.push({[key]: "Цена карты является числом"});
                }else  if(key === "class_id"){// Проверка Класс карты существует
                    error_message.push({[key]: "Класс карты с указаным id не найден"});
                }else if(key === "type" && err.errors[key].properties.type === "enum"){// Проверка Класс карты существует
                    error_message.push({[key]: "Тип карты могут быть только Существо или Заклинания"});
                }else if(key === "img" && err.errors[key].properties.type === "unique"){// Проверка изображения карты уникальное
                    error_message.push({[key]: "Изображение карты должно быть уникальным"});
                }else if(key === "name" && err.errors[key].properties.type === "unique"){// Проверка название карты уникальное
                    error_message.push({[key]: "Название карты должно быть уникальным"});
                }
                else{
                    error_message.push({[key]: err.errors[key].message});
                }
            }
            res.send({ error: error_message});
        }
        else {
            res.statusCode = 500;
            res.send({ error: 'Ошибка сервера'});
        }
    })
});
module.exports = router;
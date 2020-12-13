const express = require('express');
const router = express.Router();
const cart = require("../../models/cart/index");
const class_heroes = require("../../models/heroes/class");
const paginatios = require("../../middle/cart")
const  getClass = require("../../middle/getclass.js")
/**
 *  Получить всё карты возможно + пагинация
 * **/
router.get("/cart", (req, res) => {
    let data = paginatios(req.query.limit, req.query.page);
    cart.find().skip(data.skip).limit(data.limit).exec().then(async cart_data => {
        if (cart_data.length === 0) {
            return res.send({info: "карты еще не созданы"});
        }
        for (data in cart_data){
            cart_data[data].class_data = await getClass(class_heroes, cart_data[data]);
            console.log(cart_data.class_data)
        }
        return res.send(cart_data);
    }).catch(err => {
        res.statusCode = 500;
        return res.send({error: 'Ошибка сервера' + err});
    })
})
/**
 *  Получить карту по Id
 * **/
router.get("/cart/:id", async (req, res) => {
    if (!Number(req.params.id)) {
        return res.send({error: 'Передаваймое значение должно является числом'});
    }
    let className = await getClass(class_heroes,req.params.id ,res);
    if(className === null){
        return res.send({error: `класс ${req.params.id}  не найден`});
    }
    cart.findById(req.params.id).exec((err, cart_data) => {
        if (!cart_data) {
            res.statusCode = 404;
            return res.send({error: 'Карта не найдена'});
        }
        if (!err) {
            return res.send({cart:{ info:cart_data , class:className} });
        } else {
            res.statusCode = 500;
            return res.send({error: 'Ошибка сервера' + err});
        }
    })
})
/**
 *  Получить карту по поиску названию
 * **/
router.get("/cart/search/:name", (req, res) => {
    let data = paginatios(req.query.limit, req.query.page);
    cart.find({name: {$regex: req.params.name}}).skip(data.skip).limit(data.limit).exec((err, cart_data) => {
        if (cart_data.length === 0) {
            res.statusCode = 404;
            return res.send({error: `Карта по поиску ${req.params.name}  не найдена`});
        }
        if (!err) {
            return res.send({status: 'OK', cart: cart_data});
        } else {
            res.statusCode = 500;
            return res.send({error: 'Ошибка сервера'});
        }
    })
})
/**
 *  Получить карту по  совпадению классу id
 * **/
router.get("/cart/filter/class/:id", async (req, res) => {
    if (!Number(req.params.id)) {
        return res.send({error: 'Передаваймое значение должно является числом'});
    }
    let className = await getClass(class_heroes,req.params.id ,res);
    if(className === null){
        return res.send({error: `класс ${req.params.id}  не найден`});
    }
    let data = paginatios(req.query.limit, req.query.page);
    cart.find({class_id: req.params.id})
        .skip(data.skip)
        .limit(data.limit)
        .exec((err, cart_data) => {
            if (cart_data.length === 0) {
                res.statusCode = 404;
                return res.send({error: `Карта по поиску ${req.params.name}  не найдена`});
            }
            if (!err) {
                return res.send({status: 'OK', cart: {info:cart_data, class:className}});
            } else {
                res.statusCode = 500;
                return res.send({error: 'Ошибка сервера'});
            }
        })
})
/**
 *  Удаление карты по Id
 * **/
router.delete("/cart/:id", (req, res) => {
    cart.findById(req.params.id, (err, cart_data) => {
        if (cart_data === null) { // Проверка что пользователь найден
            res.statusCode = 404;
            return res.send({error: `Карта ${req.params.id} Не найден`});
        }
        return cart_data.remove((err) => { // Удаление пользователя
            if (!err) { // Проверка что нету ошибки сервера
                return res.send({status: 'OK'});
            } else {// ошибка сервера
                res.statusCode = 500;
                return res.send({error: 'Ошибка сервиса'});
            }
        })
    })
})
/**
 *  Создание карты
 * **/
router.post('/cart', async function (req, res) {
    let cart_data = new cart({
        name: req.body.name,
        type: req.body.type,
        class_id: req.body.class_id,
        img: req.body.img,
        description: req.body.description,
        cost: req.body.cost,
    })
    if (cart_data.class_id !== undefined) {
        if (Number(cart_data.class_id)) {
            let a = await class_heroes.findById(cart_data.class_id).exec();
            if (a === null) {
                return res.send({error: 'класс с указанным id не найден'});
            }
        } else {
            return res.send({error: 'класс id является числом'});
        }
    }
    cart_data.save(function (err) {
        if (!err) {
            res.statusCode = 400;
            return res.send({status: 'OK', cart: cart_data});
        }
        if (err.name === 'ValidationError') {
            res.statusCode = 404;
            let error_message = [];
            for (const key in err.errors) {
                if (key === "cost" && err.errors[key].kind === "Number") {// Проверка на что цена это число
                    error_message.push({[key]: "Цена карты является числом"});
                } else if (key === "type" && err.errors[key].properties.type === "enum") {// Проверка Класс карты существует
                    error_message.push({[key]: "Тип карты могут быть только Существо или Заклинания"});
                } else if (key === "img" && err.errors[key].properties.type === "unique") {// Проверка изображения карты уникальное
                    error_message.push({[key]: "Изображение карты должно быть уникальным"});
                } else if (key === "name" && err.errors[key].properties.type === "unique") {// Проверка название карты уникальное
                    error_message.push({[key]: "Название карты должно быть уникальным"});
                } else {
                    error_message.push({[key]: err.errors[key].message});
                }
            }
            res.send({error: error_message, all: err});
        } else {
            res.statusCode = 500;
            res.send({error: 'Ошибка сервера'});
        }
    })
});
module.exports = router;
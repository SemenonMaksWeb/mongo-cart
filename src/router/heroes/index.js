const express = require('express');
const router = express.Router();
const heroes = require("../../models/heroes/index");
const class_heroes = require("../../models/heroes/class");
const perk = require("../../models/perk/index");
router.get("/heroes", (req, res) => {
    heroes.find().select({_id: true, name: true, defaultSkin: true, cost: true}).exec().then((heroes_data) => {
        if (heroes_data.length === 0) {
            return res.send({info: "Герои еще не созданы"});
        }
        return res.send(heroes_data);
    })
})
router.get("/heroes/:id", (req, res) => {
    if(!Number(req.params.id)){
        return res.send({error: 'Передаваймое значение должно является числом'});
    }
    heroes.findById(req.params.id).exec()
        .then(async heroes_data => {
            if (!heroes_data) {
                res.statusCode = 404;
                return res.send({error: 'Карта не найдена'});
            } else {
                let perk_heroes = await perk.findById(heroes_data.perk_id);
                let class_heroes_data = await class_heroes.findById(heroes_data.class_id);
                return res.send({
                    status: 'OK', heroes: {
                        info: heroes_data,
                        class: class_heroes_data,
                        perk: perk_heroes,
                    }
                });
            }
        })
        .catch(err => {
            res.statusCode = 500;
            console.error('Ошибка сервера(%d): %s', res.statusCode, err.message);
            return res.send({error: 'Ошибка сервера ' + err.message});
        })
})
router.delete("/heroes/:id", (req, res) => {
    if(!Number(req.params.id)){
        return res.send({error: 'Передаваймое значение должно является числом'});
    }
    heroes.findById(req.params.id, (err, heroes_data) => {
        if (!heroes_data) { // Проверка что пользователь найден
            res.statusCode = 404;
            return res.send({error: `Герой ${req.params.id} Не найден`});
        }
        return heroes_data.remove((err) => { // Удаление пользователя
            if (!err) { // Проверка что нету ошибки сервера
                console.info(`Герой ${req.params.id} удален`);
                return res.send({status: 'OK'});
            } else {// ошибка сервера
                res.statusCode = 500;
                console.error('Ошибка сервера (%d): %s', res.statusCode, err.message);
                return res.send({error: 'Ошибка сервиса ' + err.message});
            }
        })
    })
})
router.post('/heroes', async function (req, res) {
    let heroes_data = new heroes({
        name: req.body.name,
        defaultSkin: req.body.defaultSkin,
        description: req.body.description,
        skins: req.body.skins,
        cost: req.body.cost,
        perk_id: req.body.perk_id,
        class_id: req.body.class_id,
    })
    let error_message = [];
    if(!Number(heroes_data.perk_id) || !Number(heroes_data.class_id)){
        return res.send({error: "Не коректно введенные данные id перка или класса"});
    }
    await class_heroes.findById(heroes_data.class_id, (err, class_heroes_data) => {
        if (class_heroes_data === null) {
            error_message.push({class_id: "Указаный класс героя не найден"});
        }
    })
    await perk.findById(heroes_data.perk_id, (err, class_heroes_data) => {
        if (class_heroes_data === null) {
            error_message.push({perk_id: "Указаный перк героя не найден"});
        }
    })
    if (error_message.length === 0) {
        heroes_data.save(function (err) {
            if (!err) {
                res.statusCode = 400;
                return res.send({status: 'OK', heroes: heroes_data});
            }
            if (err.name === 'ValidationError') {
                res.statusCode = 400;
                for (const key in err.errors) {
                    if (key === "perk_id" && err.errors[key].kind === "ObjectId") {
                        error_message.push({[key]: "Указаный перк героя не найден"});
                    } else if (key === "cost" && err.errors[key].kind === "Number") {
                        error_message.push({[key]: "Цена героя должно быть число"});
                    } else if (key === "name" && err.errors[key].properties.type === "unique") {
                        error_message.push({[key]: "Название героя уникальное значение"});
                    } else if (key === "defaultSkin" && err.errors[key].properties.type === "unique") {
                        error_message.push({[key]: "Дефолтный скин героя уникальное значение"});
                    } else {
                        error_message.push({[key]: err.errors[key].message});
                    }

                }
                res.send({error: error_message});
            } else {
                res.statusCode = 500;
                res.send({error: 'Ошибка сервера' + err});
            }
        })
    } else {
        return res.send({error: error_message});
    }
});
module.exports = router;
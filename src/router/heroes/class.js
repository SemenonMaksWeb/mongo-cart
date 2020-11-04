const express = require('express');
const router = express.Router();
const class_heroes = require("../../models/heroes/class");

/**
 *  Получить всё классы возможно + пагинация
 * **/
router.get("/heroes_class", (req,res) =>{
    class_heroes.find((err, class_heroes_data) =>{
        if(class_heroes_data.length === 0){
            return res.send({info:"Классы для героев еще не созданы"});
        }
        return res.send(class_heroes_data);
    })
})
/**
 *  Создание класса
 * **/
router.post('/heroes_class', (req, res) =>{
    let class_heroes_data = new class_heroes ({
        name: req.body.name,
    })
    class_heroes_data.save(function (err) {
        if (!err) {
            res.statusCode = 400;
            return res.send({ status: 'OK', class_heroes: class_heroes_data });
        }
        if(err.name === 'ValidationError') {
            res.statusCode = 400;
            let error_message = [];
            for (const key in err.errors) {
                error_message.push({[key]: err.errors[key].message});
            }
            res.send({ error: error_message});
        }
        else {
            res.statusCode = 500;
            res.send({ error: 'Ошибка сервера' +  err});
        }
    })
});
/**
 *  Удаление класса
 * **/
router.delete("/heroes_class/:id", (req,res) =>{
    if(!Number(req.params.id)){
        return res.send({error: 'Передаваймое значение должно является числом'});
    }
    class_heroes.findById(req.params.id, (err, class_heroes_data)=>{
        if(!class_heroes_data){ // Проверка что пользователь найден
            res.statusCode = 404;
            return res.send({ error: `Класс героя ${req.params.id} не найден` });
        }
        return class_heroes_data.remove((err) => { // Удаление пользователя
            if (!err) { // Проверка что нету ошибки сервера
                return res.send({ status: 'OK' });
            }else {// ошибка сервера
                res.statusCode = 500;
                return res.send({ error: 'Ошибка сервиса' + err.message });
            }
        })
    })
})
module.exports = router;
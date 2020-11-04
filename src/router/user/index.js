const express = require('express');
const router = express.Router();
const user = require("../../models/user/index");

/**
 *  Показывает данных для всех user
 */
router.get("/user", (req,res) =>{
    user.find((err, user) =>{
        if(user.length === 0){
            return res.send({info:"Пользователей нету"});
        }
        return res.send(user);
    })
})
/**
 * getUser - Удаляет User
 */
router.delete("/user/:id", (req,res) =>{
    user.findById(req.params.id, (err, user_data)=>{
        if(!user_data){ // Проверка что пользователь найден
            res.statusCode = 404;
            return res.send({ error: `Пользователь ${req.params.id} Не найден` });
        }
        return user_data.remove((err) => { // Удаление пользователя
            if (!err) { // Проверка что нету ошибки сервера
                return res.send({ status: 'OK' });
            }else {// ошибка сервера
                res.statusCode = 500;
                return res.send({ error: 'Ошибка сервиса' });
            }
        })
    })
})

module.exports = router;
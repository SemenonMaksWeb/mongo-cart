const express = require('express');
const router = express.Router();
const perk = require("../../models/perk/index");

router.get("/perk", (req,res) =>{ // Возможно временный router
    perk.find((err, perk_data) =>{
        if(perk_data.length === 0){
            return res.send({info:"Перки для героев еще не созданы"});
        }
        return res.send(perk_data);
    })
})
router.post('/perk', function(req, res) {
    let perk_data = new perk ({
        name: req.body.name,
        img:req.body.img,
        price:req.body.price,
        description:req.body.description,
    })
    perk_data.save(function (err) {
        if (!err) {
            res.statusCode = 400;
            console.info("Перк создан");
            return res.send({ status: 'OK', perk:perk_data });
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
            res.send({ error: 'Ошибка сервера'});
        }
    })
});
router.delete("/perk/:id", (req,res) =>{
    if(!Number(req.params.id)){
        return res.send({error: 'Передаваймое значение должно является числом'});
    }
    perk.findById(req.params.id, (err, perk_data)=>{
        if(!perk_data){ // Проверка что пользователь найден
            res.statusCode = 404;
            return res.send({ error: `Перк ${req.params.id} Не найден` });
        }
        return perk_data.remove((err) => { // Удаление пользователя
            if (!err) { // Проверка что нету ошибки сервера
                return res.send({ status: 'OK' });
            }else {// ошибка сервера
                res.statusCode = 500;
                return res.send({ error: 'Ошибка сервиса'});
            }
        })
    })
})
module.exports = router;
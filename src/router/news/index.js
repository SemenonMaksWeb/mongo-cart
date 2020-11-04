const express = require('express');
const router = express.Router();

router.get("/news", (req,res) =>{
    res.json(
        {message:'Новости'}
    );
})

module.exports = router;
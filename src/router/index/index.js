const express = require('express');
const router = express.Router();
// 

const user = require("../../models/user/index");

router.get("/", (req,res) =>{
    res.json({
       router:{
           user:[
               {
                   method: "GET",
                   url: " /user"
               },
               {
                   method: "DELETE",
                   url: " /user:id"
               },
           ],
           perk:[
               {
                   method: "POST",
                   url: " /perk"
               },
               {
                   method: "GET",
                   url: " /perk"
               },
               {
                   method: "DELETE",
                   url: " /perk:id"
               },
           ],
           news:[
               {
                   method: "GET",
                   url: " /news"
               }
           ],
           class_heroes:[
               {
                   method: "GET",
                   url: " /heroes_class"
               },
               {
                   method: "POST",
                   url: " /heroes_class"
               },
               {
                   method: "DELETE",
                   url: " /heroes_class:id"
               },
           ],
           heroes:[
               {
                   method: "GET",
                   url: " /heroes"
               },
               {
                   method: "GET",
                   url: " /heroes/:id"
               },
               {
                   method: "DELETE",
                   url: " /heroes/:id"
               },
               {
                   method: "POST",
                   url: " /heroes"
               },
           ],
           cart:[
               {
                   method: "GET",
                   url: " /cart"
               },
               {
                   method: "GET",
                   url: " /cart/:id"
               },
               {
                   method: "GET",
                   url: " /cart/search/:name"
               },
               {
                   method: "GET",
                   url: " /cart/filter/class/:class"
               },
               {
                   method: "DELETE",
                   url: "/cart/:id"
               },
               {
                   method: "POST",
                   url: " /cart"
               },
           ]
        }
    });
})

module.exports = router;
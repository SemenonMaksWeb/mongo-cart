// server.js
 
const express  = require('express');
const bodyParser  = require('body-parser');
const app = express();
const pino = require('pino-http')()
app.use(pino)
app.use(express.urlencoded({ extended: true }))

app.use(bodyParser.json());
// Router
const index = require("./src/router/index/index");
const heroes = require("./src/router/heroes/index");
const cart = require("./src/router/cart/index");
const news = require("./src/router/news/index");
const user = require("./src/router/user/index");
const perk = require("./src/router/perk/index");
const class_heroes = require("./src/router/heroes/class");
app.use(index);
app.use(heroes);
app.use(class_heroes);
app.use(cart);
app.use(news);
app.use(user);
app.use(perk);
// Включение сервера
const port = 8000;
app.listen(port, () => {
    console.log('We are live on ' + port);
});
 
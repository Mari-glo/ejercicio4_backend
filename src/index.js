import  express from 'express';
import { engine } from "express-handlebars";
import { __dirname } from './utils.js';

const app = express();
const PORT = 3030;

app.engine("handlebars", engine());
app.set('view engine', "handlebars");
app.set('')

app.get('/', (req, res) =>{
    res.render("index");
});

app.listen(PORT, () =>{
    console.log (`escuchando desde puerto: ${PORT}`);
});
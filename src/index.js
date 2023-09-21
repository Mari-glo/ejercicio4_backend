import  express from 'express';
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import { engine } from "express-handlebars";
import * as path from "path" ;
import  __dirname from './utils.js';
import ProductManager from "./controllers/ProductManager.js";
import { Server } from "socket.io"; 

const app = express();
const PORT = 3030;
const server = app.listen(PORT, () =>{
    console.log (`escuchando desde puerto: ${PORT}`);
});
const io = new Server(server);

const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine("handlebars", engine());
app.set('view engine', "handlebars");
app.set('views', path.resolve(__dirname + "/views"));

app.use('/', express.static(__dirname + "/public"));


app.get("/", async (req, res) => {
    let allProducts = await product.getProducts()
    res.render("index",{
        admin:true,
        title:"desafío 4",
        products : allProducts
    })
});
app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);


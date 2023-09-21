import  express from 'express';
import { engine } from "express-handlebars";
import { Server } from "socket.io"; 
import * as path from "path" ;
import  __dirname from './utils.js';
import ProductManager from "./controllers/ProductManager.js";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";

const app = express();
const PORT = 4000;

const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const httpServer = app.listen(PORT, () =>{
    console.log (`escuchando desde puerto: ${PORT}`);
});

const socketServer = new Server (httpServer)

socketServer.on("connection", socket => {
    console.log("Nuevo Cliente Conectado")

    socket.on("message", data => {
        console.log(data)
    })

    socket.on("newProduct", (newProduct) => {
        product.addProducts(newProduct)
        socketServer.emit("success", "Producto Agregado Correctamente");
    });

    socket.emit("test","mensaje desde servidor a cliente, se valida en consola")

})


app.engine("handlebars", engine());
app.set('view engine', "handlebars");
app.set('views', path.resolve(__dirname + "/views"));

app.use('/', express.static(__dirname + "/public"));

app.use("/realtimeproducts", ProductRouter)


app.get("/", async (req, res) => {
    let allProducts = await product.getProducts()
    res.render("index",{
        admin:true,
        title:"desafío 4",
        products : allProducts
    })
});




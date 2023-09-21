import {promises as fs} from 'fs';
import { nanoid } from 'nanoid';
import ProductManager from './ProductManager.js';

const productAll = new ProductManager;

class CartManager{
    constructor(){
        this.path = "./src/models/carts.json";

    }

    readCarts = async () =>{
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse (carts);

    };
    writeCarts = async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart));

    };

    existe = async(id) => {
        let carts = await this.readCarts();
        return carts.find(carts => carts.id === id)
    }

    addCarts = async () => {
        let cartsOld = await this.readCarts();
        let id = nanoid(4)
        let cartsConcat =[{id :id, products :[]}, ...cartsOld]
        await this.writeCarts(cartsConcat);
        return "carrito Agregado";

    };

    getCartsById = async (id) => {
        let cartById = await this.existe(id);
        if(!cartById) return "no se encontró el carrito";
        return cartById;
    };

    addProductInCart = async (cartId, productId) =>{
        let cartById = await this.existe(cartId);
        if(!cartById) return "no se encontró el carrito";
        let productById= await productAll.existe(productId);
        if(!productById) return "Producto no encontrado";

        let cartsAll = await this.readCarts();
        let cartFilter = cartsAll.filter((cart) => cart.id != cartId);

        if(cartById.products.some (prod => prod.id === productId)){
            let moreProductInCart = cartById.products.find(prod=> prod.id === productId)
            moreProductInCart.cantidad++;
            let cartsConcat = [cartById, ... cartFilter];
            await this.writeCarts(cartsConcat);
            return "se ha sumado un producto";
        }

        cartById.products.push ({id:productById.id, cantidad: 1})
        
        let cartsConcat =[cartById, ... cartFilter];
        await this.writeCarts(cartsConcat);
        return "Producto agregado al carrito";

    };
}


export default CartManager;
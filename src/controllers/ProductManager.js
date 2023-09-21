import {promises as fs} from 'fs';
import { nanoid } from 'nanoid';

class ProductManager {
    constructor() {
        this.path = "./src/models/products.json";
    }

    readProducts = async () =>{
        let products = await fs.readFile(this.path, "utf-8");
        return JSON.parse (products);

    }
    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product));

    }

    existe = async(id) => {
        let products = await this.readProducts();
        return products.find(prod => prod.id === id)
    }

    addProducts = async (product) => {
       let productsOld = await this.readProducts();
       product.id = nanoid (3);         
       let productAll = [...productsOld, product];
       await this.writeProducts(productAll);       
       return "Producto agregado correctamente";
    };

    getProducts = async () => {
        return await this.readProducts()
    };

    getProductsById = async (id) => {
        let productById = await this.existe(id)
        if(!productById) return "no se encontró el producto"
        return productById
    };

    

    updateProduct = async (id, product) =>{
        let productById = await this.existe(id)
        if(!productById) return "Producto no encontrado"
        await this.deleteProducts(id)
        let productsOld = await this.readProducts()
        let products = [{...product, id : id}, ...productsOld]
        await this.writeProducts(products)
        return "producto actualizado correctamente"

    }
    
    deleteProducts = async (id) =>{
        let products = await this.readProducts();
        let existProduct = products.some(prod => prod.id === id)
        if (existProduct){
            let filterProduct = products.filter (prod => prod.id != id)
            await this. writeProducts (filterProduct)
            return "Producto Eliminado"
        }
        return "El Producto que intenta eliminar  no existe"
       
    }
}

export default ProductManager;






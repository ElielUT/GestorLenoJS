import Clientes from "../models/clientes.js"
import Productos from "../models/producto.js"

//GENERALES

//CLIENTES
export async function nuevoCliente({nombre, correo, telefono}){
    const contacto = new Clientes({nombre, correo, telefono})
    const respuestaMongo = await contacto.save()
    return respuestaMongo
}

export async function enClientes() {
    const clientes = Clientes.find()
    return clientes
}

export async function cantClientes(){
    const nCli = await Clientes.countDocuments();
    return nCli;
}

export async function buscarCliente(id) {
    const cliente = await Clientes.findById(id)
    return cliente
}
export async function editarCliente({id, nombre, correo, telefono}) {
    const respuestaMongo = await Clientes.findByIdAndUpdate(id, {nombre, correo, telefono})
    return respuestaMongo
}
export async function borrarCliente(id) {
    const respuestaMongo = await Clientes.findByIdAndDelete(id)
    return respuestaMongo
}

//PRODUCTOS
export async function nuevoProducto({producto, categoria, existencia, precio, proveedor}) {
    const product = new Productos({producto, categoria, existencia, precio, proveedor})
    const respuestaMongo = await product.save()
    return respuestaMongo
}

export async function enProductos() {
    const productos = Productos.find()
    return productos
}

export async function cantProductos() {
    const nPro = await Productos.countDocuments();
    return nPro || 0;
}

export async function cantProveedores() {
    const proveedores = await Productos.distinct('proveedor')
    return proveedores.length || 0
}

export async function sumaExistencias() {
    const resultado = await Productos.aggregate([
        {
            $group: {
                _id: null, // Agrupa todos los documentos en uno solo
                total: { $sum: "$existencia" } // Suma los valores del campo "existencia"
            }
        }
    ]);

    if (resultado.length > 0) {
        return resultado[0].total;
    } else {
        return 0; // Devuelve 0 si no hay productos
    }
}

export async function buscarProducto(id) {
    const producto = await Productos.findById(id)
    return producto
}

export async function editarProducto({id, producto, categoria, existencia, precio, proveedor}) {
    const respuestaMongo = await Productos.findByIdAndUpdate(id, {producto, categoria, existencia, precio, proveedor})
    return respuestaMongo
}

export async function borrarProducto(id) {
    const respuestaMongo = await Productos(id)
    return respuestaMongo
}
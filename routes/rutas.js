import {Router} from "express"
import { cantClientes, cantProductos, enClientes, enProductos, nuevoCliente, nuevoProducto, sumaExistencias, cantProveedores, buscarCliente, buscarProducto, editarCliente, editarProducto, borrarCliente, borrarProducto } from "../bd/operacionesBD.js"

const router = Router()

router.get("/", (req, res)=>{
    res.render("home")
})

router.post("/comprobar", (req, res)=>{
    if(req.body.usuario == "admin" && req.body.password == "12345"){
        res.redirect("/publicidad")
    }else{
        res.redirect("/")
    }
})

router.get("/publicidad", (req, res)=>{
    res.render("publicidad");
})

router.get("/dashboard", async (req, res) =>{
    const nCli = await cantClientes() || 0,
        nPro = await cantProductos() || 0,
        nProv = await cantProveedores() || 0,
        exTot = await sumaExistencias() || 0,
        clientes = await enClientes(),
        productos = await enProductos();
    res.render("dashboard", {nCli, nPro, nProv, exTot, clientes, productos})
})

router.get("/nCli", (req, res) => {
    res.render("nCli")
})

router.get("/nPro", (req, res) => {
    res.render("nPro")
})

router.post("/snc", async (req, res) =>{
    const nombre = req.body.nombre,
        correo = req.body.correo,
        telefono = req.body.telefono;

    await nuevoCliente({nombre, correo, telefono})

    res.redirect("/dashboard")
})

router.post("/snp", async (req, res) => {
    const producto = req.body.producto,
        categoria = req.body.categoria,
        existencia = req.body.existencia,
        precio = req.body.precio,
        proveedor = req.body.proveedor;
    
    await nuevoProducto({producto, categoria, existencia, precio, proveedor})

    res.redirect("/dashboard")
})

router.get("/qr", (req, res) => {
    res.render("qr")
})

router.get("/editarCliente/:id", async (req, res) => {
    const id = req.params.id
    const cliente = await buscarCliente(id)

    res.render("eCli", {cliente})
})

router.get("/editarProducto/:id", async (req, res) => {
    const id = req.params.id
    const product = await buscarProducto(id)

    res.render("ePro", {product})
})

router.post("/ec", async (req, res) => {
    const respuestaMongo = await editarCliente(req.body)

    res.redirect("/dashboard")
})

router.post("/ep", async (req, res) => {
    const respuestaMongo = await editarProducto(req.body)

    res.redirect("/dashboard")
})

router.get("/borrarCliente/:id", async (req, res) => {
    const id = req.params.id
    const respuestaMongo = await borrarCliente(id)

    res.redirect("/dashboard")
})

router.get("/borrarProducto/:id", async (req, res) => {
    const id = req.params.id
    const respuestaMongo = await borrarProducto(id)

    res.redirect("/dashboard")
})

export default router
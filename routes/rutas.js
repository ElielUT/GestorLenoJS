import {Router} from "express"
import { cantClientes, cantProductos, enClientes, enProductos, nuevoCliente, nuevoProducto, sumaExistencias, cantProveedores, buscarCliente, buscarProducto, editarCliente, editarProducto, borrarCliente, borrarProducto } from "../bd/operacionesBD.js"
import session from "express-session"
import 'dotenv/config'
import { subirImgagen } from "../middlewares/subirImagen.js"

const router = Router()

router.get("/", (req, res)=>{
    res.render("home")
})

router.post("/comprobar", (req, res)=>{
    if(req.body.usuario == "admin" && req.body.password == "12345"){
        req.session.inicio = 1;
        res.redirect("/publicidad")
    }else if(req.body.usuario == "user" && req.body.password == "12345"){
        req.session.inicio = 2;
        res.redirect("/publicidad")
    }else{  
        req.session.inicio = false;
        res.redirect("/")
    }
})

router.get("/publicidad", (req, res)=>{
    if(req.session.inicio){
        res.render("publicidad");
    }else{
        res.redirect("/")
    }
})

router.get("/dashboard", async (req, res) =>{
    const nCli = await cantClientes() || 0,
        nPro = await cantProductos() || 0,
        nProv = await cantProveedores() || 0,
        exTot = await sumaExistencias() || 0,
        clientes = await enClientes(),
        productos = await enProductos();
    if(req.session.inicio == 1){
        res.render("dashboard", {nCli, nPro, nProv, exTot, clientes, productos})
    }else if(req.session.inicio == 2){
        res.render("dashboardUser", {nCli, nPro, nProv, exTot, clientes, productos})
    }else{
        res.redirect("/")
    }
})

router.get("/nCli", (req, res) => {
    if(req.session.inicio == 1){
        res.render("nCli")
    }else{
        res.redirect("/")
    }
})

router.get("/nPro",(req, res) => {
    if(req.session.inicio == 1){
        res.render("nPro")
    }else{
        res.redirect("/")
    }
})

router.post("/snc", async (req, res) =>{
    if(req.session.inicio == 1){
        const nombre = req.body.nombre,
            correo = req.body.correo,
            telefono = req.body.telefono;

        await nuevoCliente({nombre, correo, telefono})

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.post("/snp", subirImgagen(),async (req, res) => {
    if(req.session.inicio == 1){
        const datos = req.file
        const producto = req.body.producto,
            categoria = req.body.categoria,
            existencia = req.body.existencia,
            precio = req.body.precio,
            proveedor = req.body.proveedor,
            imagen = datos.filename;
        
        await nuevoProducto({producto, categoria, existencia, precio, proveedor, imagen})

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.get("/qr", (req, res) => {
    if(req.session.inicio){
        res.render("qr")
    }else{
        res.redirect("/")
    }
})

router.get("/editarCliente/:id", async (req, res) => {
    if(req.session.inicio == 1){
        const id = req.params.id
        const cliente = await buscarCliente(id)

        res.render("eCli", {cliente})
    }else{
        res.redirect("/")
    }
})

router.get("/editarProducto/:id", async (req, res) => {
    if(req.session.inicio == 1){
        const id = req.params.id
        const product = await buscarProducto(id)

        res.render("ePro", {product})
    }else{
        res.redirect("/")
    }
})

router.post("/ec", async (req, res) => {
    if(req.session.inicio == 1){
        const respuestaMongo = await editarCliente(req.body)

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.post("/ep", async (req, res) => {
    if(req.session.inicio == 1){
        const respuestaMongo = await editarProducto(req.body)

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.get("/borrarCliente/:id", async (req, res) => {
    if(req.session.inicio == 1){
        const id = req.params.id
        const respuestaMongo = await borrarCliente(id)

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.get("/borrarProducto/:id", async (req, res) => {
    if(req.session.inicio == 1){
        const id = req.params.id
        const respuestaMongo = await borrarProducto(id)

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.get("/salir", (req, res) => {
    if(req.session.inicio){
        req.session.destroy()
        res.clearCookie("inicioSesion",{path:"/"})
        res.redirect("/")
    }else{
        res.redirect("/")
    }
})

export default router
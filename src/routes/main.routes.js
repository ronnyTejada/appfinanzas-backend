import { Router } from 'express'
const router = Router()

//db connect
import { connect } from '../database'

router.post('/postItem', async (req, res) => {
    //PRODUCTOS FUNCTIONS
    const db = await connect()
    if (req.body.producto) {
        await db.collection('productos').insertOne(req.body.producto);
        res.send('item save')
    } else {
        res.send(401)
    }


})
router.get('/getAllProducts', async (req, res) => {
    //PRODUCTOS FUNCTIONS
    const db = await connect()
    if (true) {
        let productos = await db.collection('productos').find({negocioId:req.query.negocio}).toArray();
        console.log(productos)
        res.send(productos)
    } else {
        res.send(401)
    }


})
router.put('/deleteProduct', async (req, res)=>{
    const db = await connect()
    
    if(req.body.productoId){
        await db.collection('productos').deleteOne({ id: req.body.productoId }) 
    }else{
        res.sendStatus(401)
    }
})
router.put('/editProduct', async (req, res)=>{
    const db = await connect()
    
    if(req.body.productId){
        let item = await db.collection('productos').findOne({ id: req.body.productId })
        item.title=req.body.productEdited.title
        item.price=req.body.productEdited.price
        item.category=req.body.productEdited.category
        item.cantidadExistente=req.body.productEdited.cantidadExistente


        await db.collection('productos').update({ id: req.body.productId },item) 
    }else{
        res.sendStatus(401)
    }
})

//NEGOCIOS
router.post('/registrarNegocio', async (req, res) => {
    const db = await connect()
    if (req.body.negocio) {
        await db.collection('negocios').insertOne(req.body.negocio);
        res.send('negocio creado')
    } else {
        res.send(401)
    }


})

router.get('/getNegocios', async (req, res) => {
    
    const db = await connect()
    if (req.query.propietario) {
        let negocios = await db.collection('negocios').find({propietario:req.query.propietario}).toArray();
        res.send(negocios)
    } else {
        res.send(401)
    }


})

//HISTORIAL FUNCTIONS
router.post('/pedidoToHistory', async (req, res) => {
    const db = await connect()
    console.log(req.body.pedido)
    if (req.body.pedido) {
        req.body.pedido.map(async p=>{
            await db.collection('historial').insertOne(p);
            let producto = await db.collection('productos').findOne({'id':p.id});
            producto.ventas+=p.ventas
            await db.collection('productos').update({ 'id': p.id },producto) 


        })
        res.send('pedidos en historial')
    } else {
        res.send(401)
    }


})

router.post('/deudaToHistory', async (req, res) => {
    const db = await connect()
    console.log(req.body.item)
    if (req.body.item) {
        let item= await db.collection('historial').findOne({idH:req.body.item.idH})
        item.pagado=true
        console.log(item)
        await db.collection('historial').update({ id: req.body.item.id },item) 

    } else {
        res.send(401)
    }


})

router.get('/getPedidosFromHistory', async (req, res) => {
    
    const db = await connect()
    if (req.query.negocio) {
        console.log('negocio')
        let pedidos= await db.collection('historial').find({negocioId:req.query.negocio}).toArray();
        res.send(pedidos)
    } else {
        res.send(401)
    }


})

//CLIENTES FUNCTIONS
router.post('/postCliente', async (req, res) => {
    const db = await connect()
    if (req.body.cliente) {
        

        let result = await db.collection('clientes').findOne({id:req.body.cliente.id})
        //si existe modificar compras
        if(result){
            result.compras=req.body.cliente.compras
            await db.collection('clientes').update({ id: req.body.cliente.id },result) 

        }else{
            await db.collection('clientes').insertOne(req.body.cliente);

        }
        res.send('pedidos en historial')
    } else {
        res.send(401)
    }


})
router.get('/getClientes', async (req, res) => {
    
    const db = await connect()
    if (req.query.negocio) {
        
        let clientes= await db.collection('clientes').find({negocioId:req.query.negocio}).toArray();
        console.log(clientes)
        res.send(clientes)
    } else {
        res.send(401)
    }


})
router.put('/selectNegocio', async (req, res)=>{
    const db = await connect()
    console.log('gggggggggg',req.body.newNegocioId,req.body.oldNegocioId )

    if(req.body.newNegocioId &&req.body.oldNegocioId ){
        console.log(req.body.newNegocioId,req.body.oldNegocioId )
        let negocioNew = await db.collection('negocios').findOne({ id: req.body.newNegocioId }) 
        let negocioOld = await db.collection('negocios').findOne({ id: req.body.oldNegocioId }) 

        negocioNew.selected=true
        negocioOld.selected=false

        await db.collection('negocios').update({ id: req.body.newNegocioId},negocioNew) 
        await db.collection('negocios').update({ id: req.body.oldNegocioId},negocioOld) 

    }else{
        res.sendStatus(401)
    }
})

export default router
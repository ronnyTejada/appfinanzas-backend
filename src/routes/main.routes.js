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
        let productos = await db.collection('productos').find().toArray();
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

export default router
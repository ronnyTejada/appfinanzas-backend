import {Router} from 'express'
import { connect } from '../database'
var Crypto = require("crypto");


const router = Router()

router.post('/registrarUser', async (req, res) => {
    const db = await connect()
    if(req.body.user){
        req.body.user.password = Crypto.createHash("sha256").update( req.body.user.password ).digest("base64");
        await db.collection('users').insertOne(req.body.user);
        console.log('registrado')
        res.send('registrado')

    }else{
        res.send(401)
    }
});

router.post('/loginUser', async(req, res)=>{
    const db = await connect()
    console.log(req.body)
    if(req.body.email && req.body.password){
        var query = {}
        query.email=req.body.email
        query.password=Crypto.createHash("sha256").update( req.body.password ).digest("base64");
        let user = await db.collection('users').findOne(query)
        if(user){
            
            res.json({
                mensaje:'correct auth',
                token:user.id
            })
        }else{
            res.json({msj:'username or password invalid'})
        }
    }else{
        res.send(401)
    }
})


export default router
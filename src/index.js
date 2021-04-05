require('@babel/polyfill')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

import {connect} from './database'
import Routes from './routes/main.routes'
//settings
app.set('port', process.env.PORT || 3000)

//MIDDLEWARES
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
// 3
app.use(bodyParser.json());

//Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//RUTAS
app.use('/api',Routes)

async function main(){
    await app.listen(app.get('port'))
    await connect()
    console.log('server on port', app.get('port'))
}

main()



const  { expressjwt: expressJwt } = require('express-jwt');

function authJwt(){
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256']
    }).unless({
        path: [
            // {url:/\/api\/v1\/medicamentos(.*)/,methods:['GET','OPTIONS']},
            // {url:/\/api\/v1\/insumos(.*)/,methods:['GET','OPTIONS']},
            // {url:/\/api\/v1\/equipos(.*)/,methods:['GET','OPTIONS']},
            `${api}/usuarios/login`,
            `${api}/usuarios/registro`
        ]
    })
}

module.exports = authJwt;
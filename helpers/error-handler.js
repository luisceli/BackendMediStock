function errorHandler(err,req,res,next){
    if(err.name === 'UnauthorizaedError'){
        //jwt error de autentificacion
        return res.status(401).json({message: "El usuario no esta autorizado"})
    }

    if(err.name === 'ValidationError'){
        //error de validacion
        return res.status(401).json({message: err})
    }
    // error de servidor default 500
    return res.status(500).json({err});
}

module.exports = errorHandler;
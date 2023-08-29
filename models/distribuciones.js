const mongoose = require('mongoose');

const distribucionesSchema = mongoose.Schema({
    hospital : {
        type: String,
        required: true,
    },
    provincia : {
        type: String,
        required: true,
    },
    ciudad : {
        type: String,
        required: true,
    },
    estimacion_Costo : {
        type: Number,
        required: true,     
    }
});

//Crear nueva variable para utilizar "id", en lugar de "_id"
distribucionesSchema.virtual('id').get(function(){
    return this._id.toHexString(); 
});

distribucionesSchema.set('toJSON', {
    virtuals:true 
});

exports.Distribuciones = mongoose.model('Distribuciones', distribucionesSchema);
exports.distribucionesSchema = distribucionesSchema;
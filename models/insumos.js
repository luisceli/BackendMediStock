const mongoose = require('mongoose');

const insumosSchema = mongoose.Schema({
    nombre_Generico :  {
        type: String,
        required: true,
    },
    sinonimo :  {
        type: String,
        required: true,
    },
    nivel_Riesgo :  {
        type: Number,
        required: true,
    },
    especialidad :  {
        type: String,
        required: true,
    },
    cantidad_Stock :  {
        type: Number,
        required: true,
    },
    estimacion_Cantidad :  {
        type: Number,
        required: true, 
    },
    precio_Unitario_Insumos :  {
        type: Number,
        required: true, 
    },
    estimacion_Costo :  {
        type: Number,
    },
    fecha_Caducidad :  {
        type: Date,
        required: true,
    }
});

//Crear nueva variable para utilizar "id", en lugar de "_id"
insumosSchema.virtual('id').get(function(){
    return this._id.toHexString(); 
});

insumosSchema.set('toJSON', {
    virtuals:true 
});

exports.Insumos = mongoose.model('Insumos', insumosSchema);
exports.insumosSchema = insumosSchema;
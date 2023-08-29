const mongoose = require('mongoose');

const medicamentosSchema = mongoose.Schema({
    denominación_Comun : {
        type: String,
        required: true,
    },
    forma_Farmaceutica : {
        type: String,
        required: true,
    },
    concentracion : {
        type: String,
        required: true,
    },
    cantidad_Stock : {
        type: Number,
        required: true,     
    },
    estimacion_Cantidad : {
        type: Number, 
        required: true 
    },
    precio_Unitario_Medicamentos :  {
        type: Number,
        required: true, 
    },
    estimacion_Costo : {
        type: Number,
    },
    fecha_Caducidad : {
        type: Date,
        required: true,     
    }
});

//Crear nueva variable para utilizar "id", en lugar de "_id"
medicamentosSchema.virtual('id').get(function(){
    return this._id.toHexString(); 
});

medicamentosSchema.set('toJSON', {
    virtuals:true 
});

exports.Medicamentos = mongoose.model('Medicamentos', medicamentosSchema);
exports.medicamentosSchema = medicamentosSchema;
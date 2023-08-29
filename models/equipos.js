const mongoose = require('mongoose');

const equiposSchema = mongoose.Schema({
    nombre_Generico :  {
        type: String,
        required: true,
    },
    especificacion :  {
        type: String,
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
    precio_Unitario_Equipos :  {
        type: Number,
        required: true, 
    },
    estimacion_Costo :  {
        type: Number,
    },
    fecha_Depreciacion :  {
        type: Date,
        required: true,
    }
});

//Crear nueva variable para utilizar "id", en lugar de "_id"
equiposSchema.virtual('id').get(function(){
    return this._id.toHexString(); 
});

equiposSchema.set('toJSON', {
    virtuals:true 
});

exports.Equipos = mongoose.model('Equipos', equiposSchema);
exports.equiposSchema = equiposSchema;
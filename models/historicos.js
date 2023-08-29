const mongoose = require('mongoose');

const historicosSchema = mongoose.Schema({
    cant_Costo_Medicina :  {
        type: Number,
        required: true,
    },
    valor_Costo_Medicina :  {
        type: Number,
        required: true,
    },
    cant_Costo_Insumos :  {
        type: Number,
        required: true,
    },
    valor_Costo_Insumos :  {
        type: Number,
        required: true,
    },
    cant_Costo_Equipos :  {
        type: Number,
        required: true,
    },
    valor_Costo_Equipos :  {
        type: Number,
        required: true,
    },
    cant_Costo_Distribucion :  {
        type: Number,
        required: true,
    },
    valor_Costo_Distribucion :  {
        type: Number,
        required: true,
    },
    subtotal :  {
        type: Number
    },
    presupuesto :  {
        type: Number,
        required: true,
    },
    saldo :  {
        type: Number
    },
    anio :{
        type: Number,
        require: true,
    }
});

//Crear nueva variable para utilizar "id", en lugar de "_id"
historicosSchema.virtual('id').get(function(){
    return this._id.toHexString(); 
});

historicosSchema.set('toJSON', {
    virtuals:true 
});

exports.Historicos = mongoose.model('Historicos', historicosSchema);
exports.historicosSchema = historicosSchema;
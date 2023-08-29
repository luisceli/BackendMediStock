const mongoose = require('mongoose');

const usuariosSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    }
});

//Crear nueva variable para utilizar "id", en lugar de "_id"
usuariosSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

usuariosSchema.set('toJSON', {
    virtuals: true
});

exports.Usuarios = mongoose.model('Usuarios', usuariosSchema);
exports.usuariosSchema = usuariosSchema;
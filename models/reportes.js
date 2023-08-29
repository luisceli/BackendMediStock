const mongoose = require("mongoose");

const reportesSchema = new mongoose.Schema({
  costoTotalInsumos: {
    type: Number,
    default: 0,
  },
  cantidadInsumos: {
    type: Number,
    default: 0,
  },
  costoTotalMedicamentos: {
    type: Number,
    default: 0,
  },
  cantidadMedicamentos: {
    type: Number,
    default: 0,
  },
  costoTotalEquipos: {
    type: Number,
    default: 0,
  },
  cantidadEquipos: {
    type: Number,
    default: 0,
  },
  costoTotalDistribuciones: {
    type: Number,
    default: 0,
  },
  cantidadDistribuciones: {
    type: Number,
    default: 0,
  },
  subtotal: {
    type: Number,
  },
  presupuesto: {
    type: Number,
    default: 8000000,
  },
  saldo: {
    type: Number,
  },
});

const Reportes = mongoose.model("Reportes", reportesSchema);

module.exports = Reportes;

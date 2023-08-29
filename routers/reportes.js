const express = require("express");
const router = express.Router();
const Insumos = require("../models/insumos");
const Medicamentos = require("../models/medicamentos");
const Equipos = require("../models/equipos");
const Distribuciones = require("../models/distribuciones");
const Reporte = require("../models/reportes");

// Ruta para obtener el informe almacenado en el modelo Reporte
router.get("/reporte", async (req, res) => {
  try {
    const reporte = await Reporte.findOne();

    if (reporte) {
      const {
        costoTotalInsumos,
        costoTotalMedicamentos,
        costoTotalEquipos,
        costoTotalDistribuciones,
        presupuesto,
      } = reporte;

      const subtotal =
        costoTotalInsumos +
        costoTotalMedicamentos +
        costoTotalEquipos +
        costoTotalDistribuciones;

      const saldo = presupuesto - subtotal;

      reporte.subtotal = subtotal;
      reporte.saldo = saldo;

      await reporte.save(); // Guardar los cambios en el modelo

      res.status(200).json(reporte);
    } else {
      res.status(404).json({ message: "No se encontraron datos de reporte" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;

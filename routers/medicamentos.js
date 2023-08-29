const { Medicamentos } = require("../models/medicamentos");
const Reportes = require("../models/reportes"); // Importa el modelo del reporte
const express = require("express");
const router = express.Router();

// Obtener medicamentos
router.get(`/`, async (req, res) => {
  const medicamentosList = await Medicamentos.find();

  if (!medicamentosList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(medicamentosList);
});

// Obtener medicamentos por ID
router.get("/:id", async (req, res) => {
  const medicamentos = await Medicamentos.findById(req.params.id);

  if (!medicamentos) {
    res
      .status(500)
      .json({ message: "El medicamento con este id no fue encontrado." });
  }
  res.status(200).send(medicamentos);
});

// Actualizar medicamentos por ID
router.put(`/:id`, async (req, res) => {
  try {
    const updatedMedicamentoData = {
      denominación_Comun: req.body.denominación_Comun,
      forma_Farmaceutica: req.body.forma_Farmaceutica,
      concentracion: req.body.concentracion,
      cantidad_Stock: req.body.cantidad_Stock,
      estimacion_Cantidad: req.body.estimacion_Cantidad,
      precio_Unitario_Medicamentos: req.body.precio_Unitario_Medicamentos,
      fecha_Caducidad: req.body.fecha_Caducidad
    };

    // Realizar cálculos para estimacion_Cantidad y estimacion_Costo
    const estimacion_Costo = req.body.estimacion_Cantidad * req.body.precio_Unitario_Medicamentos;

    updatedMedicamentoData.estimacion_Costo = estimacion_Costo;

    const medicamentos = await Medicamentos.findByIdAndUpdate(
      req.params.id,
      updatedMedicamentoData,
      { new: true }
    );

    if (!medicamentos) {
      return res.status(404).send("No se ha podido actualizar el medicamento");
    }

    res.send(medicamentos);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

// Guardar medicamentos
router.post(`/`, (req, res) => {
  const medicamentos = new Medicamentos({
    denominación_Comun: req.body.denominación_Comun,
    forma_Farmaceutica: req.body.forma_Farmaceutica,
    concentracion: req.body.concentracion,
    cantidad_Stock: req.body.cantidad_Stock,
    estimacion_Cantidad: req.body.estimacion_Cantidad,
    precio_Unitario_Medicamentos: req.body.precio_Unitario_Medicamentos,
    fecha_Caducidad: req.body.fecha_Caducidad,
  });

  // Realizar cálculos para estimacion_Costo
  const estimacion_Costo = req.body.estimacion_Cantidad * req.body.precio_Unitario_Medicamentos;

  // Asignar los valores calculados
  medicamentos.estimacion_Costo = estimacion_Costo;

  // Guardar en la base de datos
  medicamentos
    .save()
    .then((createdMedicamentos) => {
      res.status(201).json(createdMedicamentos);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

// Ruta para obtener el costo total de insumos y guardar en el reporte
router.get("/get/costototal", async (req, res) => {
  try {
    const result = await Medicamentos.aggregate([
      {
        $group: {
          _id: null,
          costoTotalMedicamentos: { $sum: "$estimacion_Costo" },
        },
      },
    ]);

    if (result.length > 0) {
      const costoTotal = result[0].costoTotalMedicamentos;

      // Guardar en el modelo Reporte
      const reportes = new Reportes({ costoTotalMedicamentos: costoTotal });
      await reportes.save();

      res.status(200).json(costoTotal);
    } else {
      res.status(404).json({ message: "No se encontraron datos" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta para obtener la cantidad de datos guardados y guardar en el reporte
router.get("/get/cantidad", async (req, res) => {
  try {
    const count = await Medicamentos.countDocuments();

    // Guardar en el modelo Reporte
    const reportes = new Reportes({ cantidadMedicamentos: count });
    await reportes.save();

    res.status(200).json({ cantidadMedicamentos: count });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta para obtener el costo total y la cantidad de medicamentos, y actualizar el informe
router.get("/get/reportetotal", async (req, res) => {
    try {
      const resultMedicamentos = await Medicamentos.aggregate([
        {
          $group: {
            _id: null,
            costoTotalMedicamentos: { $sum: "$estimacion_Costo" },
            cantidadMedicamentos: { $sum: 1 },
          },
        },
      ]);
  
      if (resultMedicamentos.length > 0) {
        const {
          costoTotalMedicamentos,
          cantidadMedicamentos,
        } = resultMedicamentos[0];
  
        // Buscar y actualizar el documento Reporte existente
        const reporteExistente = await Reportes.findOne();
        if (reporteExistente) {
          reporteExistente.costoTotalMedicamentos = costoTotalMedicamentos;
          reporteExistente.cantidadMedicamentos = cantidadMedicamentos;
          await reporteExistente.save();
  
          res.status(200).json({
            costoTotalMedicamentos,
            cantidadMedicamentos,
          });
        } else {
          // Si no existe el documento, crear uno nuevo
          const nuevoReporte = new Reportes({
            costoTotalMedicamentos,
            cantidadMedicamentos,
          });
          await nuevoReporte.save();
  
          res.status(200).json({
            costoTotalMedicamentos,
            cantidadMedicamentos,
          });
        }
      } else {
        res.status(404).json({ message: "No se encontraron datos" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  });

module.exports = router;

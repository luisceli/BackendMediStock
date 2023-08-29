const { Insumos } = require("../models/insumos");
const Reportes = require("../models/reportes"); // Importa el modelo del reporte
const express = require("express");
const router = express.Router();

// Obtener insumos
router.get(`/`, async (req, res) => {
  const insumosList = await Insumos.find();

  if (!insumosList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(insumosList);
});

// Obtener insumos por ID
router.get("/:id", async (req, res) => {
  const insumos = await Insumos.findById(req.params.id);

  if (!insumos) {
    res
      .status(500)
      .json({ message: "El insumo con este id no fue encontrado." });
  }
  res.status(200).send(insumos);
});

// Actualizar insumos por ID
router.put(`/:id`, async (req, res) => {
  try {
    const updateInsumosData = {
      nombre_Generico: req.body.nombre_Generico,
      sinonimo: req.body.sinonimo,
      nivel_Riesgo: req.body.nivel_Riesgo,
      especialidad: req.body.especialidad,
      cantidad_Stock: req.body.cantidad_Stock,
      estimacion_Cantidad: req.body.estimacion_Cantidad,
      precio_Unitario_Insumos: req.body.precio_Unitario_Insumos,
      fecha_Caducidad: req.body.fecha_Caducidad,
    };

    // Realizar cálculos para estimacion_Cantidad y estimacion_Costo
    const estimacion_Costo =
      req.body.estimacion_Cantidad * req.body.precio_Unitario_Insumos;

    updateInsumosData.estimacion_Costo = estimacion_Costo;
    
    const insumos = await Insumos.findByIdAndUpdate(
      req.params.id,
      updateInsumosData,
      { new: true }
    );

    if (!insumos)
      return res.status(404).send("No se ha podido actualizar el insumo");

    res.send(insumos);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

// Guardar insumos
router.post(`/`, (req, res) => {
  const insumos = new Insumos({
    nombre_Generico: req.body.nombre_Generico,
    sinonimo: req.body.sinonimo,
    nivel_Riesgo: req.body.nivel_Riesgo,
    especialidad: req.body.especialidad,
    cantidad_Stock: req.body.cantidad_Stock,
    estimacion_Cantidad: req.body.estimacion_Cantidad,
    precio_Unitario_Insumos: req.body.precio_Unitario_Insumos,
    fecha_Caducidad: req.body.fecha_Caducidad,
  });

  // Realizar cálculos para estimacion_Cantidad y estimacion_Costo
  const estimacion_Costo =
  req.body.estimacion_Cantidad * req.body.precio_Unitario_Insumos;

  // Asignar los valores calculados
  insumos.estimacion_Costo = estimacion_Costo;

  // Guardar en la base de datos
  insumos
    .save()
    .then((createdInsumos) => {
      res.status(201).json(createdInsumos);
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
    const result = await Insumos.aggregate([
      {
        $group: {
          _id: null,
          costoTotalInsumos: { $sum: "$estimacion_Costo" },
        },
      },
    ]);

    if (result.length > 0) {
      const costoTotal = result[0].costoTotalInsumos;
      
      // Guardar en el modelo Reporte
      const reportes = new Reportes({ costoTotalInsumos: costoTotal });
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
    const count = await Insumos.countDocuments();

    // Guardar en el modelo Reporte
    const reportes = new Reportes({ cantidadInsumos: count });
    await reportes.save();

    res.status(200).json({ cantidadInsumos: count });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta para obtener el costo total y la cantidad de insumos, y actualizar el informe
router.get("/get/reportetotal", async (req, res) => {
  try {
    const resultInsumos = await Insumos.aggregate([
      {
        $group: {
          _id: null,
          costoTotalInsumos: { $sum: "$estimacion_Costo" },
          cantidadInsumos: { $sum: 1 },
        },
      },
    ]);

    if (resultInsumos.length > 0) {
      const {
        costoTotalInsumos,
        cantidadInsumos,
      } = resultInsumos[0];

      // Buscar y actualizar el documento Reporte existente
      const reporteExistente = await Reportes.findOne();
      if (reporteExistente) {
        reporteExistente.costoTotalInsumos = costoTotalInsumos;
        reporteExistente.cantidadInsumos = cantidadInsumos;
        await reporteExistente.save();

        res.status(200).json({
          costoTotalInsumos,
          cantidadInsumos,
        });
      } else {
        // Si no existe el documento, crear uno nuevo
        const nuevoReporte = new Reportes({
          costoTotalInsumos,
          cantidadInsumos,
        });
        await nuevoReporte.save();

        res.status(200).json({
          costoTotalInsumos,
          cantidadInsumos,
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
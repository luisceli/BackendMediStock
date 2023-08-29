const { Equipos } = require("../models/equipos");
const Reportes = require("../models/reportes"); // Importa el modelo del reporte
const express = require("express");
const router = express.Router();

// Obtener equipos
router.get(`/`, async (req, res) => {
  const equiposList = await Equipos.find();

  if (!equiposList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(equiposList);
});

// Obtener equipos por ID
router.get("/:id", async (req, res) => {
  const equipos = await Equipos.findById(req.params.id);

  if (!equipos) {
    res
      .status(500)
      .json({ message: "El equipo con este id no fue encontrado." });
  }
  res.status(200).send(equipos);
});

// Actualizar equipos por ID
router.put(`/:id`, async (req, res) => {
  try {
    const updateEquiposData = {
      nombre_Generico: req.body.nombre_Generico,
      especificacion: req.body.especificacion,
      especialidad: req.body.especialidad,
      cantidad_Stock: req.body.cantidad_Stock,
      estimacion_Cantidad: req.body.estimacion_Cantidad,
      precio_Unitario_Equipos: req.body.precio_Unitario_Equipos,
      fecha_Depreciacion: req.body.fecha_Depreciacion,
    };

    // Realizar cálculos para estimacion_Cantidad y estimacion_Costo
    const estimacion_Costo =
    req.body.estimacion_Cantidad * req.body.precio_Unitario_Equipos;

    // Asignar los valores calculados
    updateEquiposData.estimacion_Costo = estimacion_Costo;

    const equipos = await Equipos.findByIdAndUpdate(
      req.params.id,
      updateEquiposData,
      { new: true }
    );

    if (!equipos)
      return res.status(404).send("No se ha podido actualizar el equipo");

    res.send(equipos);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

// Guardar equipos
router.post(`/`, (req, res) => {
  const equipos = new Equipos({
    nombre_Generico: req.body.nombre_Generico,
    especificacion: req.body.especificacion,
    especialidad: req.body.especialidad,
    cantidad_Stock: req.body.cantidad_Stock,
    estimacion_Cantidad: req.body.estimacion_Cantidad,
    precio_Unitario_Equipos: req.body.precio_Unitario_Equipos,
    fecha_Depreciacion: req.body.fecha_Depreciacion,
  });

  // Realizar cálculos para estimacion_Cantidad y estimacion_Costo
  const estimacion_Costo =
  req.body.estimacion_Cantidad * req.body.precio_Unitario_Equipos;

  // Asignar los valores calculados
  equipos.estimacion_Costo = estimacion_Costo;

  // Guardar en la base de datos
  equipos
    .save()
    .then((createdEquipos) => {
      res.status(201).json(createdEquipos);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

// Obtener la suma de CostoTotal Equipos
router.get("/get/costototal", async (req, res) => {
  try {
    const result = await Equipos.aggregate([
      {
        $group: {
          _id: null,
          costoTotalEquipos: { $sum: "$estimacion_Costo" },
        },
      },
    ]);

    if (result.length > 0) {
      res.status(200).json(result[0].costoTotalEquipos);
    } else {
      res.status(404).json({ message: "No se encontraron datos" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Obtener la cantidad de datos guardados
router.get("/get/cantidad", async (req, res) => {
  try {
    const count = await Equipos.countDocuments();

    res.status(200).json({ cantidadEquipos: count });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;

// Ruta para obtener el costo total y la cantidad de medicamentos, y actualizar el informe
router.get("/get/reportetotal", async (req, res) => {
  try {
    const resultEquipos = await Equipos.aggregate([
      {
        $group: {
          _id: null,
          costoTotalEquipos: { $sum: "$estimacion_Costo" },
          cantidadEquipos: { $sum: 1 },
        },
      },
    ]);

    if (resultEquipos.length > 0) {
      const {
        costoTotalEquipos,
        cantidadEquipos,
      } = resultEquipos[0];

      // Buscar y actualizar el documento Reporte existente
      const reporteExistente = await Reportes.findOne();
      if (reporteExistente) {
        reporteExistente.costoTotalEquipos = costoTotalEquipos;
        reporteExistente.cantidadEquipos = cantidadEquipos;
        await reporteExistente.save();

        res.status(200).json({
          costoTotalEquipos,
          cantidadEquipos,
        });
      } else {
        // Si no existe el documento, crear uno nuevo
        const nuevoReporte = new Reportes({
          costoTotalEquipos,
          cantidadEquipos,
        });
        await nuevoReporte.save();

        res.status(200).json({
          costoTotalEquipos,
          cantidadEquipos,
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

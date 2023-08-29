const {Distribuciones} = require('../models/distribuciones');
const Reportes = require("../models/reportes"); // Importa el modelo del reporte
const express = require('express');
const router = express.Router();

// Obtener distribucion 
router.get(`/`, async (req, res) =>{
    const distribucionesList = await Distribuciones.find();

    if(!distribucionesList){
        res.status(500).json({success: false})
    }
    res.status(200).send(distribucionesList);
})

// Obtener distribucion por ID
router.get('/:id', async (req, res) =>{
    const distribuciones = await Distribuciones.findById(req.params.id);

    if(!distribuciones){
        res.status(500).json({message: 'La distribucion con este id no fue encontrada.'})
    }
    res.status(200).send(distribuciones);
})

// Actualizar distribucion por ID
router.put(`/:id`, async (req,res)=>{
    const distribuciones = await Distribuciones.findByIdAndUpdate(
        req.params.id,
        {
            hospital: req.body.hospital,
            provincia: req.body.provincia,
            ciudad: req.body.ciudad,
            estimacion_Costo: req.body.estimacion_Costo
        },
        {new: true}
    )
    if(!distribuciones)
    return res.status(404).send("No se ha podido actualizar la distribucion");
    
    res.send(distribuciones);
})

// Guardar distribuciones 
router.post(`/`, (req, res) =>{
    const distribuciones = new Distribuciones({
        hospital: req.body.hospital,
        provincia: req.body.provincia,
        ciudad: req.body.ciudad,
        estimacion_Costo: req.body.estimacion_Costo
    })
    distribuciones.save().then((createdDistribuciones=>{
        res.status(201).json(createdDistribuciones)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })
})

// Obtener la suma de CostoTotal Distribuciones
router.get("/get/costototal", async (req, res) => {
    try {
      const result = await Distribuciones.aggregate([
        {
          $group: {
            _id: null,
            costoTotalDistribuciones: { $sum: "$estimacion_Costo" },
          },
        },
      ]);
  
      if (result.length > 0) {
        res.status(200).json(result[0].costoTotalDistribuciones);
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
    const count = await Distribuciones.countDocuments();

    res.status(200).json({ cantidadDistribuciones: count });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta para obtener el costo total y la cantidad de medicamentos, y actualizar el informe
router.get("/get/reportetotal", async (req, res) => {
  try {
    const resultDistribuciones = await Distribuciones.aggregate([
      {
        $group: {
          _id: null,
          costoTotalDistribuciones: { $sum: "$estimacion_Costo" },
          cantidadDistribuciones: { $sum: 1 },
        },
      },
    ]);

    if (resultDistribuciones.length > 0) {
      const {
        costoTotalDistribuciones,
        cantidadDistribuciones,
      } = resultDistribuciones[0];

      // Buscar y actualizar el documento Reporte existente
      const reporteExistente = await Reportes.findOne();
      if (reporteExistente) {
        reporteExistente.costoTotalDistribuciones = costoTotalDistribuciones;
        reporteExistente.cantidadDistribuciones = cantidadDistribuciones;
        await reporteExistente.save();

        res.status(200).json({
          costoTotalDistribuciones,
          cantidadDistribuciones,
        });
      } else {
        // Si no existe el documento, crear uno nuevo
        const nuevoReporte = new Reportes({
          costoTotalDistribuciones,
          cantidadDistribuciones,
        });
        await nuevoReporte.save();

        res.status(200).json({
          costoTotalDistribuciones,
          cantidadDistribuciones,
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
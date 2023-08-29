const {Historicos} = require('../models/historicos');
const express = require('express');
const router = express.Router();

// Obtener historicos 
router.get(`/`, async (req, res) =>{
    const historicosList = await Historicos.find();

    if(!historicosList){
        res.status(500).json({success: false})
    }
    res.status(200).send(historicosList);
})

// Obtener historicos por ID
router.get('/:id', async (req, res) =>{
    const historicos = await Historicos.findById(req.params.id);

    if(!historicos){
        res.status(500).json({message: 'El historico con este id no fue encontrado.'})
    }
    res.status(200).send(historicos);
});

// Obtener historicos por año
router.get('/por-anio/:anio', async (req, res) => {
    try {
        const anio = req.params.anio;
        
        const historicosPorAnio = await Historicos.find({ anio: anio });
        
        if (!historicosPorAnio || historicosPorAnio.length === 0) {
            res.status(404).json({ message: 'No se encontraron registros históricos para el año proporcionado.' });
        } else {
            res.status(200).json(historicosPorAnio);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

// Actualizar historicos por ID
router.put(`/:id`, async (req, res) => {
    try {
        const subtotal = req.body.valor_Costo_Medicina + req.body.valor_Costo_Insumos + req.body.valor_Costo_Equipos + req.body.valor_Costo_Distribucion;
        const saldo = req.body.presupuesto - subtotal;

        const updateObj = {
            cant_Costo_Medicina: req.body.cant_Costo_Medicina,
            valor_Costo_Medicina: req.body.valor_Costo_Medicina,
            cant_Costo_Insumos: req.body.cant_Costo_Insumos,
            valor_Costo_Insumos: req.body.valor_Costo_Insumos,
            cant_Costo_Equipos: req.body.cant_Costo_Equipos,
            valor_Costo_Equipos: req.body.valor_Costo_Equipos,
            cant_Costo_Distribucion: req.body.cant_Costo_Distribucion,
            valor_Costo_Distribucion: req.body.valor_Costo_Distribucion,
            presupuesto: req.body.presupuesto,
            subtotal: subtotal,
            saldo: saldo
        };

        const updatedHistoricos = await Historicos.findByIdAndUpdate(
            req.params.id,
            updateObj,
            { new: true }
        );

        if (!updatedHistoricos) {
            return res.status(404).send("No se ha podido actualizar el registro histórico");
        }

        res.send(updatedHistoricos);
    } catch (error) {
        res.status(400).json({
            error: "Error en la solicitud",
            success: false
        });
    }
});


// Guardar historicos 
router.post(`/`, (req, res) => {
    try {
        const subtotal = req.body.valor_Costo_Medicina + req.body.valor_Costo_Insumos + req.body.valor_Costo_Equipos + req.body.valor_Costo_Distribucion;
        const saldo = req.body.presupuesto - subtotal;

        const historicos = new Historicos({
            cant_Costo_Medicina: req.body.cant_Costo_Medicina,
            valor_Costo_Medicina: req.body.valor_Costo_Medicina,
            cant_Costo_Insumos: req.body.cant_Costo_Insumos,
            valor_Costo_Insumos: req.body.valor_Costo_Insumos,
            cant_Costo_Equipos: req.body.cant_Costo_Equipos,
            valor_Costo_Equipos: req.body.valor_Costo_Equipos,
            cant_Costo_Distribucion: req.body.cant_Costo_Distribucion,
            valor_Costo_Distribucion: req.body.valor_Costo_Distribucion,
            presupuesto: req.body.presupuesto,
            anio: req.body.anio,
            subtotal: subtotal,
            saldo: saldo
        });

        historicos.save().then(createdHistoricos => {
            res.status(201).json(createdHistoricos);
        }).catch(err => {
            res.status(500).json({
                error: err,
                success: false
            });
        });
    } catch (error) {
        res.status(400).json({
            error: "Error en la solicitud",
            success: false
        });
    }
});

module.exports = router;
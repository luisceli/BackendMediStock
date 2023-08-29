const {
    Usuarios
} = require('../models/usuarios');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Obtener usuarios
router.get(`/`, async (req, res) => {
    const usuariosList = await Usuarios.find().select('-passwordHash');

    if (!usuariosList) {
        res.status(500).json({
            success: false
        })
    }
    res.status(200).send(usuariosList);
})

// Obtener usuarios por ID
router.get('/:id', async (req, res) => {
    const usuarios = await Usuarios.findById(req.params.id).select('-passwordHash');

    if (!usuarios) {
        res.status(500).json({
            message: 'El usuario con este id no fue encontrado.'
        })
    }
    res.status(200).send(usuarios);
})

// Actualizar usuarios por ID
router.put('/:id', async (req, res) => {

    const usuarioExiste = await Usuarios.findById(req.params.id);
    let newPassword
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = usuarioExiste.passwordHash;
    }

    const usuarios = await Usuarios.findByIdAndUpdate(
        req.params.id, {
            username: req.body.username,
            email: req.body.email,
            passwordHash: newPassword
        }, {
            new: true
        }
    )
    if (!usuarios)
        return res.status(404).send("No se ha podido actualizar el usuario");

    res.send(usuarios);
})

// Guardar usuarios
router.post(`/registro`, async (req, res) => {
    let usuarios = new Usuarios({
        username: req.body.username,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10)
    })
    usuarios = await usuarios.save();
    if (!usuarios)
        return res.status(400).send('El usuario no fue creado')

    res.send(usuarios);
})

//Login
router.post(`/login`, async (req, res) => {
    const usuarios = await Usuarios.findOne({
        email: req.body.email
    })
    const secret = process.env.secret;
    if (!usuarios) {
        return res.status(400).send('Usuario no encontrado');
    }

    if (usuarios && bcrypt.compareSync(req.body.password, usuarios.passwordHash)) {
        const token = jwt.sign({
                userId: usuarios.id
            },
            secret, {
                expiresIn: '1d'
            }
        )
        res.status(200).send({
            usuarios: usuarios.email,
            token: token
        })
    } else {
        res.status(400).send('Contraseña incorrecta')
    }
})

module.exports = router;
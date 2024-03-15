import express from 'express'
import {obtenerVuelos, registrar, actualizarVuelos, obtenerVuelo, eliminarVuelo}  from '../controller/vueloController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router()

router.get('/', checkAuth, obtenerVuelos)
router.get('/:codvuelo', obtenerVuelo)
router.post('/', registrar)
router.put('/:codvuelo', actualizarVuelos)
router.delete('/:codvuelo', eliminarVuelo)


export default router
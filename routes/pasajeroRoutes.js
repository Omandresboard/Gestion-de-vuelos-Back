import express from 'express'
import { pasajeroExiste, pasajeros, pasajeroVuelos, eliminarPasajero, detallesPasajero } from '../controller/pasajeroController.js';

const router = express.Router()

router.post('/:codvuelo', pasajeros)
router.get('/pasajero' , pasajeroExiste)
router.get('/:codvuelo', pasajeroVuelos)
router.get('/:codvuelo/:pasajero', detallesPasajero)
router.delete('/:codvuelo/:pasajero', eliminarPasajero)

export default router
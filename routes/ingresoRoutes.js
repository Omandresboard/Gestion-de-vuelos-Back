import express from "express";
import {ingreso, perfil} from "../controller/usuarioController.js";
import {autenticar} from "../controller/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router()

router.post('/ingreso' , ingreso)
router.post('/autenticar' , autenticar)

router.get('/perfil', checkAuth, perfil)

export default router
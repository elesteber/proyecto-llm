import { Router } from 'express';
import { evaluacionController } from '../controllers/evaluacion-controller.js';

export const evaluacionRouter = Router();

evaluacionRouter.post('/evaluar', (req, res) => evaluacionController.evaluar(req, res));
evaluacionRouter.get('/casos', (req, res) => evaluacionController.obtenerCasos(req, res));
evaluacionRouter.get('/historial', (req, res) => evaluacionController.obtenerHistorial(req, res));
evaluacionRouter.post('/reevaluar-historico', (req, res) => evaluacionController.reevaluarHistorico(req, res));

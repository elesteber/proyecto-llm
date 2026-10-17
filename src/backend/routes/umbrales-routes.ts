import { Router } from 'express';
import { umbralesController } from '../controllers/umbrales-controller.js';

export const umbralesRouter = Router();

umbralesRouter.get('/vigente', (req, res) => umbralesController.obtenerVigente(req, res));
umbralesRouter.post('/borrador', (req, res) => umbralesController.crearBorrador(req, res));
umbralesRouter.put('/borrador', (req, res) => umbralesController.modificarBorrador(req, res));
umbralesRouter.post('/borrador/aprobar', (req, res) => umbralesController.aprobarBorrador(req, res));
umbralesRouter.post('/borrador/desestimar', (req, res) => umbralesController.desestimarBorrador(req, res));

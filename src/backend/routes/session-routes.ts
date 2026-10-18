import { Router } from 'express';
import { sessionController } from '../controllers/session-controller';

export const sessionRouter = Router();

sessionRouter.get('/current', (req, res) => sessionController.getCurrent(req, res));
sessionRouter.post('/switch', (req, res) => sessionController.switchUser(req, res));

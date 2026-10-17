import { Request, Response } from 'express';
import { umbralesService } from '../services/umbrales-service.js';

export class UmbralesController {
  obtenerVigente(req: Request, res: Response): void {
    const idFlujo = (req.query.idFlujo as string) || 'reembolso-gastos-medicos';
    const vigente = umbralesService.obtenerVigente(idFlujo);

    if (!vigente) {
      res.status(404).json({ error: 'No existe una versión aprobada vigente para este flujo.' });
      return;
    }

    res.status(200).json(vigente);
  }

  crearBorrador(req: Request, res: Response): void {
    if (!req.user || req.user.rol !== 'Diseñador') {
      res.status(403).json({
        error: 'Acceso denegado: solo un usuario con rol Diseñador puede proponer modificaciones de umbrales.',
      });
      return;
    }

    const {
      idFlujo = 'reembolso-gastos-medicos',
      umbralAprobacion,
      umbralRiesgoAlto,
      minimoAutenticidad,
      minimoCruceFuentes,
      minimoCoherencia,
      pesoAutenticidad,
      pesoCruceFuentes,
      pesoCoherencia,
    } = req.body || {};

    try {
      const borrador = umbralesService.crearBorrador(
        idFlujo,
        {
          umbralAprobacion,
          umbralRiesgoAlto,
          minimoAutenticidad,
          minimoCruceFuentes,
          minimoCoherencia,
          pesoAutenticidad,
          pesoCruceFuentes,
          pesoCoherencia,
        },
        req.user.nombre
      );

      res.status(201).json({
        mensaje: 'Borrador de umbrales registrado exitosamente.',
        borrador,
      });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  modificarBorrador(req: Request, res: Response): void {
    if (!req.user || req.user.rol !== 'Diseñador') {
      res.status(403).json({
        error: 'Acceso denegado: solo un usuario con rol Diseñador puede proponer modificaciones de umbrales.',
      });
      return;
    }

    const {
      idFlujo = 'reembolso-gastos-medicos',
      umbralAprobacion,
      umbralRiesgoAlto,
      minimoAutenticidad,
      minimoCruceFuentes,
      minimoCoherencia,
      pesoAutenticidad,
      pesoCruceFuentes,
      pesoCoherencia,
    } = req.body || {};

    try {
      const borrador = umbralesService.modificarBorrador(
        idFlujo,
        {
          umbralAprobacion,
          umbralRiesgoAlto,
          minimoAutenticidad,
          minimoCruceFuentes,
          minimoCoherencia,
          pesoAutenticidad,
          pesoCruceFuentes,
          pesoCoherencia,
        },
        req.user.nombre
      );

      res.status(200).json({
        mensaje: 'Borrador de umbrales actualizado exitosamente.',
        borrador,
      });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }
}

export const umbralesController = new UmbralesController();

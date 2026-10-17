import { Request, Response } from 'express';
import fs from 'fs';
import crypto from 'crypto';
import { config } from '../config/env.js';
import { evaluacionEngine } from '../services/evaluacion-engine.js';
import { umbralesRepo } from '../repositories/umbrales-repo.js';
import { getDatabase } from '../db/database.js';
import { CasoPrueba, RespuestaEvaluarCaso } from '@shared/types';

export class EvaluacionController {
  private cargarCasos(): CasoPrueba[] {
    const content = fs.readFileSync(config.casosPath, 'utf-8');
    return JSON.parse(content) as CasoPrueba[];
  }

  evaluar(req: Request, res: Response): void {
    const { idCaso, idFlujo = 'reembolso-gastos-medicos' } = req.body || {};

    if (!idCaso) {
      res.status(400).json({ error: 'El campo idCaso es obligatorio.' });
      return;
    }

    const casos = this.cargarCasos();
    const caso = casos.find((c) => c.idCaso === idCaso);

    if (!caso) {
      res.status(404).json({ error: `Caso de prueba '${idCaso}' no encontrado en el catálogo.` });
      return;
    }

    const umbralesVigente = umbralesRepo.obtenerVigente(idFlujo);
    if (!umbralesVigente) {
      res.status(500).json({
        error: `No existe una versión de umbrales vigente (APROBADO) para el flujo '${idFlujo}'.`,
      });
      return;
    }

    const dictamen = evaluacionEngine.evaluar(caso.senales, umbralesVigente);
    const idEvaluacion = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const usuarioOperador = req.user?.nombre || 'Operador 1';

    // Inserción inmutable en SQLite (auditoria_evaluaciones)
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO auditoria_evaluaciones (
        id_evaluacion, id_caso, id_flujo, version_umbrales_aplicada,
        score_global, decision, motivo, riesgo_alto_rechazo,
        senales_bajo_minimo, desglose_componentes, senales_insumo,
        usuario_operador, timestamp
      ) VALUES (
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?
      )
    `);

    stmt.run(
      idEvaluacion,
      idCaso,
      idFlujo,
      umbralesVigente.version,
      dictamen.scoreGlobal,
      dictamen.decision,
      dictamen.motivo,
      dictamen.riesgoAltoRechazo ? 1 : 0,
      JSON.stringify(dictamen.senalesBajoMinimo),
      JSON.stringify(dictamen.desgloseComponentes),
      JSON.stringify(caso.senales),
      usuarioOperador,
      timestamp
    );

    const respuesta: RespuestaEvaluarCaso = {
      idEvaluacion,
      idCaso,
      scoreGlobal: dictamen.scoreGlobal,
      scoreVisual: dictamen.scoreVisual,
      decision: dictamen.decision,
      motivo: dictamen.motivo,
      riesgoAltoRechazo: dictamen.riesgoAltoRechazo,
      mensajeOperador: dictamen.mensajeOperador,
      senalesBajoMinimo: dictamen.senalesBajoMinimo,
      desgloseComponentes: dictamen.desgloseComponentes,
      versionUmbralesAplicada: umbralesVigente.version,
      timestamp,
    };

    res.status(200).json(respuesta);
  }

  obtenerCasos(req: Request, res: Response): void {
    const casos = this.cargarCasos();
    res.status(200).json(casos);
  }
}

export const evaluacionController = new EvaluacionController();

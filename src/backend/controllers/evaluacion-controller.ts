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

  obtenerHistorial(req: Request, res: Response): void {
    const { idCaso, limit = '50' } = req.query;
    const limitNum = parseInt(limit as string, 10) || 50;
    const db = getDatabase();

    let query = 'SELECT * FROM auditoria_evaluaciones';
    const params: any[] = [];

    if (idCaso) {
      query += ' WHERE id_caso = ?';
      params.push(idCaso);
    }

    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(limitNum);

    const rows = db.prepare(query).all(...params) as any[];

    const evaluaciones = rows.map((r) => ({
      idEvaluacion: r.id_evaluacion,
      idCaso: r.id_caso,
      versionUmbralesAplicada: r.version_umbrales_aplicada,
      scoreGlobal: r.score_global,
      decision: r.decision,
      motivo: r.motivo,
      riesgoAltoRechazo: Boolean(r.riesgo_alto_rechazo),
      senalesInsumo: JSON.parse(r.senales_insumo),
      usuarioOperador: r.usuario_operador,
      timestamp: r.timestamp,
    }));

    res.status(200).json({
      total: evaluaciones.length,
      evaluaciones,
    });
  }

  reevaluarHistorico(req: Request, res: Response): void {
    const { idEvaluacion } = req.body || {};

    if (!idEvaluacion) {
      res.status(400).json({ error: 'El campo idEvaluacion es obligatorio.' });
      return;
    }

    const db = getDatabase();
    const evalOriginal = db
      .prepare('SELECT * FROM auditoria_evaluaciones WHERE id_evaluacion = ?')
      .get(idEvaluacion) as any;

    if (!evalOriginal) {
      res.status(404).json({ error: 'Evaluación histórica no encontrada.' });
      return;
    }

    const umbralesArchivados = umbralesRepo.obtenerPorVersion(
      evalOriginal.id_flujo,
      evalOriginal.version_umbrales_aplicada
    );

    if (!umbralesArchivados) {
      res.status(500).json({
        error: `No se encontró la versión histórica de umbrales ${evalOriginal.version_umbrales_aplicada} para el flujo '${evalOriginal.id_flujo}'.`,
      });
      return;
    }

    const senalesInsumo = JSON.parse(evalOriginal.senales_insumo);
    const recomputado = evaluacionEngine.reevaluarCasoHistorico(senalesInsumo, umbralesArchivados);

    const puntajeCoincide = Math.abs(recomputado.scoreGlobal - evalOriginal.score_global) < 0.0001;
    const decisionCoincide = recomputado.decision === evalOriginal.decision;
    const motivoCoincide = recomputado.motivo === evalOriginal.motivo;
    const riesgoAltoCoincide =
      (recomputado.riesgoAltoRechazo ? 1 : 0) === evalOriginal.riesgo_alto_rechazo;
    const consistencia100Porciento =
      puntajeCoincide && decisionCoincide && motivoCoincide && riesgoAltoCoincide;

    res.status(200).json({
      idEvaluacionOriginal: evalOriginal.id_evaluacion,
      versionUmbralesAplicada: evalOriginal.version_umbrales_aplicada,
      resultadoReevaluacion: {
        scoreGlobal: recomputado.scoreGlobal,
        decision: recomputado.decision,
        motivo: recomputado.motivo,
        riesgoAltoRechazo: recomputado.riesgoAltoRechazo,
      },
      reproducibilidadDeterminista: {
        puntajeCoincide,
        decisionCoincide,
        motivoCoincide,
        riesgoAltoCoincide,
        consistencia100Porciento,
      },
    });
  }
}

export const evaluacionController = new EvaluacionController();

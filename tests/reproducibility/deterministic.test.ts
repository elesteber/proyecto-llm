import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from '@backend/config/env.js';
import { closeDatabase } from '@backend/db/database.js';
import { resetTestDb } from '../setup-test-db.js';
import { app } from '@backend/app.js';
import { evaluacionEngine } from '@backend/services/evaluacion-engine.js';
import { umbralesRepo } from '@backend/repositories/umbrales-repo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reproDbPath = path.resolve(__dirname, '../../data/mira.repro.test.db');
const defaultTestDbPath = path.resolve(__dirname, '../../data/mira.test.db');

// Aislar base de datos a nivel de módulo antes de que setup-test-db inicialice conexiones
closeDatabase();
config.dbPath = reproDbPath;

describe('T040 - Suite Automatizada de Reproducibilidad Determinista y No-Circularidad (SC-004, FR-012)', () => {
  beforeAll(() => {
    closeDatabase();
    config.dbPath = reproDbPath;
    resetTestDb();
  });

  afterAll(() => {
    closeDatabase();
    if (fs.existsSync(reproDbPath)) {
      try {
        fs.unlinkSync(reproDbPath);
      } catch {
        // Ignorar si ya fue removido
      }
    }
    const journalPath = `${reproDbPath}-journal`;
    if (fs.existsSync(journalPath)) {
      try {
        fs.unlinkSync(journalPath);
      } catch {
        // Ignorar si no existe
      }
    }
    // Restaurar base de datos estándar de tests y dejarla en estado limpio (v1)
    config.dbPath = defaultTestDbPath;
    resetTestDb();
    closeDatabase();
  });

  describe('a) Reproducibilidad Determinista al 100% (SC-004, FR-012)', () => {
    it('evalúa los 6 casos del catálogo y reproduce deterministamente cada evaluación histórica al 100%', async () => {
      // 1. Obtener los casos sintéticos del catálogo oficial (GET /api/evaluacion/casos)
      const casosRes = await request(app).get('/api/evaluacion/casos');
      expect(casosRes.status).toBe(200);
      expect(Array.isArray(casosRes.body)).toBe(true);
      expect(casosRes.body).toHaveLength(6);

      const casos = casosRes.body;
      const evaluacionesEmitidasMap = new Map<string, any>();

      // 2. Evaluar cada caso vía API con la versión vigente (v1 inicial)
      for (const caso of casos) {
        const evalRes = await request(app)
          .post('/api/evaluacion/evaluar')
          .send({
            idCaso: caso.idCaso,
            idFlujo: 'reembolso-gastos-medicos',
          });

        expect(evalRes.status).toBe(200);
        expect(evalRes.body).toHaveProperty('idEvaluacion');
        expect(evalRes.body.versionUmbralesAplicada).toBe(1);
        evaluacionesEmitidasMap.set(evalRes.body.idEvaluacion, evalRes.body);
      }

      // 3. Consultar historial de evaluaciones registradas (GET /api/evaluacion/historial)
      const histRes = await request(app).get('/api/evaluacion/historial?limit=50');
      expect(histRes.status).toBe(200);
      expect(histRes.body.total).toBeGreaterThanOrEqual(6);
      expect(Array.isArray(histRes.body.evaluaciones)).toBe(true);

      const evaluaciones = histRes.body.evaluaciones as any[];
      let coincidencias = 0;

      const umbralesV1 = umbralesRepo.obtenerPorVersion('reembolso-gastos-medicos', 1);
      expect(umbralesV1).not.toBeNull();

      // 4. Para cada evaluación del historial, invocar POST /api/evaluacion/reevaluar-historico
      for (const ev of evaluaciones) {
        const original = evaluacionesEmitidasMap.get(ev.idEvaluacion);
        if (!original) continue;

        const reevalRes = await request(app)
          .post('/api/evaluacion/reevaluar-historico')
          .send({ idEvaluacion: ev.idEvaluacion });

        expect(reevalRes.status).toBe(200);
        expect(reevalRes.body.idEvaluacionOriginal).toBe(ev.idEvaluacion);
        expect(reevalRes.body.versionUmbralesAplicada).toBe(ev.versionUmbralesAplicada);

        const resReeval = reevalRes.body.resultadoReevaluacion;
        expect(resReeval).toBeDefined();

        // Aserciones de equivalencia estricta contra el dictamen original (4 campos del contrato)
        expect(resReeval.scoreGlobal).toBe(original.scoreGlobal);
        expect(resReeval.decision).toBe(original.decision);
        expect(resReeval.motivo).toBe(original.motivo);
        expect(resReeval.riesgoAltoRechazo).toBe(original.riesgoAltoRechazo);

        // Verificación en el motor determinista sobre señalesBajoMinimo (que sí es determinista)
        const dictamenMotor = evaluacionEngine.reevaluarCasoHistorico(
          ev.senalesInsumo,
          umbralesV1!
        );
        expect(dictamenMotor.senalesBajoMinimo).toEqual(original.senalesBajoMinimo);

        // Banderas de consistencia exactamente según el contrato api-evaluacion-f4.md §5
        expect(reevalRes.body.reproducibilidadDeterminista).toEqual({
          puntajeCoincide: true,
          decisionCoincide: true,
          motivoCoincide: true,
          riesgoAltoCoincide: true,
          consistencia100Porciento: true,
        });

        // Contabilizar coincidencia individual exacta
        if (
          resReeval.scoreGlobal === original.scoreGlobal &&
          resReeval.decision === original.decision &&
          resReeval.motivo === original.motivo &&
          resReeval.riesgoAltoRechazo === original.riesgoAltoRechazo &&
          reevalRes.body.reproducibilidadDeterminista.consistencia100Porciento === true &&
          JSON.stringify(dictamenMotor.senalesBajoMinimo) === JSON.stringify(original.senalesBajoMinimo)
        ) {
          coincidencias++;
        }
      }

      // 5. Aserción de 100% de consistencia: coincidencias === total de evaluaciones (sin porcentaje)
      expect(coincidencias).toBe(evaluacionesEmitidasMap.size);
      expect(coincidencias).toBe(6);
    });
  });

  describe('b) No-Circularidad sobre CASO-MED-001 (SC-004, FR-012)', () => {
    it('garantiza no-circularidad: CASO-MED-001 evaluado con v1 y v2 mantiene dictámenes históricos inmutables', async () => {
      // 1. Evaluar CASO-MED-001 con versión 1 vigente (umbralAprobacion = 90.0)
      const evalV1Res = await request(app)
        .post('/api/evaluacion/evaluar')
        .send({
          idCaso: 'CASO-MED-001',
          idFlujo: 'reembolso-gastos-medicos',
        });

      expect(evalV1Res.status).toBe(200);
      expect(evalV1Res.body.versionUmbralesAplicada).toBe(1);
      expect(evalV1Res.body.scoreGlobal).toBe(94.0);
      expect(evalV1Res.body.decision).toBe('APROBADO_AUTOMATICO');
      expect(evalV1Res.body.motivo).toBe('aprobado');
      expect(evalV1Res.body.riesgoAltoRechazo).toBe(false);

      const idEvaluacionV1 = evalV1Res.body.idEvaluacion;

      // 2. Doble control real: Diseñador 1 propone borrador v2 copiando v1 pero con umbralAprobacion = 96.0
      const propV2Res = await request(app)
        .post('/api/umbrales/borrador')
        .set('Cookie', [`mira_session=${encodeURIComponent('Diseñador 1')}`])
        .send({
          idFlujo: 'reembolso-gastos-medicos',
          umbralAprobacion: 96.0,
          umbralRiesgoAlto: 60.0,
          minimoAutenticidad: 70.0,
          minimoCruceFuentes: 70.0,
          minimoCoherencia: 60.0,
          pesoAutenticidad: 0.40,
          pesoCruceFuentes: 0.40,
          pesoCoherencia: 0.20,
        });

      expect(propV2Res.status).toBe(201);
      expect(propV2Res.body.borrador.version).toBe(2);
      expect(propV2Res.body.borrador.proponente).toBe('Diseñador 1');
      expect(propV2Res.body.borrador.estado).toBe('BORRADOR');

      // 3. Administrador 1 (usuario distinto e independiente) aprueba la propuesta v2
      const aprV2Res = await request(app)
        .post('/api/umbrales/borrador/aprobar')
        .set('Cookie', [`mira_session=${encodeURIComponent('Administrador 1')}`])
        .send({ idFlujo: 'reembolso-gastos-medicos' });

      expect(aprV2Res.status).toBe(200);
      expect(aprV2Res.body.versionAprobada.version).toBe(2);
      expect(aprV2Res.body.versionAprobada.estado).toBe('APROBADO');
      expect(aprV2Res.body.versionAprobada.aprobador).toBe('Administrador 1');

      // Verificar que v2 rige formalmente como versión vigente
      const vigenteRes = await request(app).get('/api/umbrales/vigente');
      expect(vigenteRes.status).toBe(200);
      expect(vigenteRes.body.version).toBe(2);
      expect(vigenteRes.body.umbralAprobacion).toBe(96.0);

      // 4. Evaluar CASO-MED-001 con la versión v2 vigente
      // Score = 94.0 < 96.0 -> debe resolver DERIVADO_REVISION con motivo puntaje_bajo_umbral
      const evalV2Res = await request(app)
        .post('/api/evaluacion/evaluar')
        .send({
          idCaso: 'CASO-MED-001',
          idFlujo: 'reembolso-gastos-medicos',
        });

      expect(evalV2Res.status).toBe(200);
      expect(evalV2Res.body.versionUmbralesAplicada).toBe(2);
      expect(evalV2Res.body.scoreGlobal).toBe(94.0);
      expect(evalV2Res.body.decision).toBe('DERIVADO_REVISION');
      expect(evalV2Res.body.motivo).toBe('puntaje_bajo_umbral');
      expect(evalV2Res.body.riesgoAltoRechazo).toBe(false);

      const idEvaluacionV2 = evalV2Res.body.idEvaluacion;

      // 5. Reevaluar ambos registros históricos vía API y verificar no-circularidad
      // 5.a) Reevaluación de v1: debe seguir dando APROBADO_AUTOMATICO y 'aprobado'
      const reevalV1Res = await request(app)
        .post('/api/evaluacion/reevaluar-historico')
        .send({ idEvaluacion: idEvaluacionV1 });

      expect(reevalV1Res.status).toBe(200);
      expect(reevalV1Res.body.idEvaluacionOriginal).toBe(idEvaluacionV1);
      expect(reevalV1Res.body.versionUmbralesAplicada).toBe(1);
      expect(reevalV1Res.body.resultadoReevaluacion.scoreGlobal).toBe(94.0);
      expect(reevalV1Res.body.resultadoReevaluacion.decision).toBe('APROBADO_AUTOMATICO');
      expect(reevalV1Res.body.resultadoReevaluacion.motivo).toBe('aprobado');
      expect(reevalV1Res.body.resultadoReevaluacion.riesgoAltoRechazo).toBe(false);
      expect(reevalV1Res.body.reproducibilidadDeterminista).toEqual({
        puntajeCoincide: true,
        decisionCoincide: true,
        motivoCoincide: true,
        riesgoAltoCoincide: true,
        consistencia100Porciento: true,
      });

      // 5.b) Reevaluación de v2: debe seguir dando DERIVADO_REVISION y 'puntaje_bajo_umbral'
      const reevalV2Res = await request(app)
        .post('/api/evaluacion/reevaluar-historico')
        .send({ idEvaluacion: idEvaluacionV2 });

      expect(reevalV2Res.status).toBe(200);
      expect(reevalV2Res.body.idEvaluacionOriginal).toBe(idEvaluacionV2);
      expect(reevalV2Res.body.versionUmbralesAplicada).toBe(2);
      expect(reevalV2Res.body.resultadoReevaluacion.scoreGlobal).toBe(94.0);
      expect(reevalV2Res.body.resultadoReevaluacion.decision).toBe('DERIVADO_REVISION');
      expect(reevalV2Res.body.resultadoReevaluacion.motivo).toBe('puntaje_bajo_umbral');
      expect(reevalV2Res.body.resultadoReevaluacion.riesgoAltoRechazo).toBe(false);
      expect(reevalV2Res.body.reproducibilidadDeterminista).toEqual({
        puntajeCoincide: true,
        decisionCoincide: true,
        motivoCoincide: true,
        riesgoAltoCoincide: true,
        consistencia100Porciento: true,
      });

      // 6. Aserción literal de T040:
      // Toma senalesInsumo del registro de v2 desde el historial (GET /api/evaluacion/historial)
      const histV2Res = await request(app).get('/api/evaluacion/historial?idCaso=CASO-MED-001');
      expect(histV2Res.status).toBe(200);
      const evalV2Hist = histV2Res.body.evaluaciones.find(
        (e: any) => e.idEvaluacion === idEvaluacionV2
      );
      expect(evalV2Hist).toBeDefined();
      const senalesV2 = evalV2Hist.senalesInsumo;

      // Obtener ambos umbrales con umbralesRepo.obtenerPorVersion sin hardcodearlos
      const umbralesV1 = umbralesRepo.obtenerPorVersion('reembolso-gastos-medicos', 1);
      const umbralesV2 = umbralesRepo.obtenerPorVersion('reembolso-gastos-medicos', 2);
      expect(umbralesV1).not.toBeNull();
      expect(umbralesV2).not.toBeNull();

      // Reevaluar esas mismas señales contra v1 (umbral 90 -> debe dar APROBADO_AUTOMATICO / aprobado)
      const reevalDirectaV1 = evaluacionEngine.reevaluarCasoHistorico(senalesV2, umbralesV1!);
      expect(reevalDirectaV1.decision).toBe('APROBADO_AUTOMATICO');
      expect(reevalDirectaV1.motivo).toBe('aprobado');
      expect(reevalDirectaV1.scoreGlobal).toBe(94.0);

      // Reevaluar esas mismas señales contra v2 (umbral 96 -> debe dar DERIVADO_REVISION / puntaje_bajo_umbral)
      const reevalDirectaV2 = evaluacionEngine.reevaluarCasoHistorico(senalesV2, umbralesV2!);
      expect(reevalDirectaV2.decision).toBe('DERIVADO_REVISION');
      expect(reevalDirectaV2.motivo).toBe('puntaje_bajo_umbral');
      expect(reevalDirectaV2.scoreGlobal).toBe(94.0);
    });
  });
});

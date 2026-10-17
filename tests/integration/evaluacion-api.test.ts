import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@backend/app';
import { initialSeed } from '@backend/db/seeds/initial-seed';

describe('API de Evaluación F4', () => {
  beforeEach(() => {
    initialSeed();
  });

  describe('User Story 1 - Precedencia de Fraude y Señal Bajo Mínimo', () => {
    it('POST /api/evaluacion/evaluar deriva CASO-MED-003 a revisión por alerta_fraude', async () => {
      const res = await request(app)
        .post('/api/evaluacion/evaluar')
        .send({
          idCaso: 'CASO-MED-003',
          idFlujo: 'reembolso-gastos-medicos',
        });

      expect(res.status).toBe(200);
      expect(res.body.idCaso).toBe('CASO-MED-003');
      expect(res.body.decision).toBe('DERIVADO_REVISION');
      expect(res.body.motivo).toBe('alerta_fraude');
      expect(res.body.scoreGlobal).toBe(94.0);
      expect(res.body.scoreVisual).toBe('94.0');
      expect(res.body.decision).not.toBe('APROBADO_AUTOMATICO');
      expect(res.body.decision).not.toBe('RECHAZADO');
    });

    it('POST /api/evaluacion/evaluar deriva CASO-MED-002 a revisión por senal_bajo_minimo', async () => {
      const res = await request(app)
        .post('/api/evaluacion/evaluar')
        .send({
          idCaso: 'CASO-MED-002',
          idFlujo: 'reembolso-gastos-medicos',
        });

      expect(res.status).toBe(200);
      expect(res.body.idCaso).toBe('CASO-MED-002');
      expect(res.body.decision).toBe('DERIVADO_REVISION');
      expect(res.body.motivo).toBe('senal_bajo_minimo');
      expect(res.body.scoreGlobal).toBe(91.0);
      expect(res.body.senalesBajoMinimo).toContain('coherencia_solicitud');
      expect(res.body.decision).not.toBe('APROBADO_AUTOMATICO');
      expect(res.body.decision).not.toBe('RECHAZADO');
    });
  });

  describe('User Story 2 - Aprobación Automática y Rango Intermedio', () => {
    it('GET /api/evaluacion/casos lista los 6 casos sintéticos de prueba', async () => {
      const res = await request(app).get('/api/evaluacion/casos');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(6);
      expect(res.body[0]).toHaveProperty('idCaso', 'CASO-MED-001');
      expect(res.body[0]).toHaveProperty('senales');
      expect(res.body[0]).toHaveProperty('resultadoEsperado');
    });

    it('POST /api/evaluacion/evaluar aprueba automáticamente CASO-MED-001 con score >= 90', async () => {
      const res = await request(app)
        .post('/api/evaluacion/evaluar')
        .send({
          idCaso: 'CASO-MED-001',
          idFlujo: 'reembolso-gastos-medicos',
        });

      expect(res.status).toBe(200);
      expect(res.body.idCaso).toBe('CASO-MED-001');
      expect(res.body.decision).toBe('APROBADO_AUTOMATICO');
      expect(res.body.motivo).toBe('aprobado');
      expect(res.body.scoreGlobal).toBe(94.0);
      expect(res.body.riesgoAltoRechazo).toBe(false);
      expect(res.body.senalesBajoMinimo).toHaveLength(0);
    });

    it('POST /api/evaluacion/evaluar deriva CASO-MED-005 con motivo puntaje_bajo_umbral en rango intermedio', async () => {
      const res = await request(app)
        .post('/api/evaluacion/evaluar')
        .send({
          idCaso: 'CASO-MED-005',
          idFlujo: 'reembolso-gastos-medicos',
        });

      expect(res.status).toBe(200);
      expect(res.body.idCaso).toBe('CASO-MED-005');
      expect(res.body.decision).toBe('DERIVADO_REVISION');
      expect(res.body.motivo).toBe('puntaje_bajo_umbral');
      expect(res.body.scoreGlobal).toBe(75.0);
      expect(res.body.riesgoAltoRechazo).toBe(false);
      expect(res.body.decision).not.toBe('RECHAZADO');
    });
  });

  describe('User Story 3 - Señalización de Advertencia de Riesgo Alto', () => {
    it('POST /api/evaluacion/evaluar activa riesgoAltoRechazo: true en CASO-MED-004 sin resolución de rechazo', async () => {
      const res = await request(app)
        .post('/api/evaluacion/evaluar')
        .send({
          idCaso: 'CASO-MED-004',
          idFlujo: 'reembolso-gastos-medicos',
        });

      expect(res.status).toBe(200);
      expect(res.body.idCaso).toBe('CASO-MED-004');
      expect(res.body.decision).toBe('DERIVADO_REVISION');
      expect(res.body.motivo).toBe('senal_bajo_minimo');
      expect(res.body.riesgoAltoRechazo).toBe(true);
      expect(res.body.mensajeOperador).toBe('Riesgo alto de rechazo: decide un operador');
      expect(res.body.decision).not.toBe('RECHAZADO');
      expect(res.body.decision).not.toBe('APROBADO_AUTOMATICO');
    });

    it('POST /api/evaluacion/evaluar activa riesgoAltoRechazo: true en CASO-MED-006 por score < 60', async () => {
      const res = await request(app)
        .post('/api/evaluacion/evaluar')
        .send({
          idCaso: 'CASO-MED-006',
          idFlujo: 'reembolso-gastos-medicos',
        });

      expect(res.status).toBe(200);
      expect(res.body.idCaso).toBe('CASO-MED-006');
      expect(res.body.decision).toBe('DERIVADO_REVISION');
      expect(res.body.motivo).toBe('senal_bajo_minimo');
      expect(res.body.scoreGlobal).toBe(40.0);
      expect(res.body.riesgoAltoRechazo).toBe(true);
      expect(res.body.mensajeOperador).toBe('Riesgo alto de rechazo: decide un operador');
      expect(res.body.decision).not.toBe('RECHAZADO');
    });
  });
});

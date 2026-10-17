import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@backend/app';
import { initialSeed } from '@backend/db/seeds/initial-seed';

describe('API de Evaluación F4 - Precedencia de Fraude y Señal Bajo Mínimo (US1)', () => {
  beforeEach(() => {
    initialSeed();
  });

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

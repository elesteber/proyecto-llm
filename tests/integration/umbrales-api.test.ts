import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@backend/app';
import { initialSeed } from '@backend/db/seeds/initial-seed';
import { getDatabase } from '@backend/db/database';

describe('API de Umbrales F5 - Propuesta y Gestión en Borrador (US4)', () => {
  beforeEach(() => {
    // Limpiar borradores y resetear a v1
    const db = getDatabase();
    db.prepare("DELETE FROM rastro_auditoria WHERE accion IN ('PROPUESTA_CREADA', 'PROPUESTA_MODIFICADA')").run();
    db.prepare("DELETE FROM umbrales_flujo WHERE estado = 'BORRADOR'").run();
    initialSeed();
  });

  it('GET /api/umbrales/vigente retorna la versión vigente por defecto (versión 1)', async () => {
    const res = await request(app).get('/api/umbrales/vigente');

    expect(res.status).toBe(200);
    expect(res.body.idFlujo).toBe('reembolso-gastos-medicos');
    expect(res.body.version).toBe(1);
    expect(res.body.estado).toBe('APROBADO');
    expect(res.body.umbralAprobacion).toBe(90.0);
    expect(res.body.umbralRiesgoAlto).toBe(60.0);
  });

  it('POST /api/umbrales/borrador rechaza con 403 Forbidden si el rol no es Diseñador', async () => {
    const res = await request(app)
      .post('/api/umbrales/borrador')
      .set('Cookie', [`mira_session=${encodeURIComponent('Operador 1')}`])
      .send({
        idFlujo: 'reembolso-gastos-medicos',
        umbralAprobacion: 88.0,
        umbralRiesgoAlto: 65.0,
        minimoAutenticidad: 70.0,
        minimoCruceFuentes: 70.0,
        minimoCoherencia: 60.0,
        pesoAutenticidad: 0.40,
        pesoCruceFuentes: 0.40,
        pesoCoherencia: 0.20,
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('Diseñador');
  });

  it('POST /api/umbrales/borrador rechaza con 400 Bad Request si los parámetros son inválidos', async () => {
    const res = await request(app)
      .post('/api/umbrales/borrador')
      .set('Cookie', [`mira_session=${encodeURIComponent('Diseñador 1')}`])
      .send({
        idFlujo: 'reembolso-gastos-medicos',
        umbralAprobacion: 88.0,
        umbralRiesgoAlto: 65.0,
        minimoAutenticidad: 70.0,
        minimoCruceFuentes: 70.0,
        minimoCoherencia: 60.0,
        pesoAutenticidad: 0.40,
        pesoCruceFuentes: 0.40,
        pesoCoherencia: 0.10, // suma 0.90 != 1.00
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('suma de las ponderaciones');
  });

  it('POST /api/umbrales/borrador crea exitosamente borrador asignando versión correlativa', async () => {
    const res = await request(app)
      .post('/api/umbrales/borrador')
      .set('Cookie', [`mira_session=${encodeURIComponent('Diseñador 1')}`])
      .send({
        idFlujo: 'reembolso-gastos-medicos',
        umbralAprobacion: 88.0,
        umbralRiesgoAlto: 65.0,
        minimoAutenticidad: 70.0,
        minimoCruceFuentes: 70.0,
        minimoCoherencia: 60.0,
        pesoAutenticidad: 0.40,
        pesoCruceFuentes: 0.40,
        pesoCoherencia: 0.20,
      });

    expect(res.status).toBe(201);
    expect(res.body.borrador).toBeDefined();
    expect(res.body.borrador.version).toBe(2);
    expect(res.body.borrador.estado).toBe('BORRADOR');
    expect(res.body.borrador.proponente).toBe('Diseñador 1');
  });

  it('POST /api/umbrales/borrador rechaza con 409 Conflict si ya existe un borrador activo', async () => {
    // Crear primer borrador
    await request(app)
      .post('/api/umbrales/borrador')
      .set('Cookie', [`mira_session=${encodeURIComponent('Diseñador 1')}`])
      .send({
        idFlujo: 'reembolso-gastos-medicos',
        umbralAprobacion: 88.0,
        umbralRiesgoAlto: 65.0,
        minimoAutenticidad: 70.0,
        minimoCruceFuentes: 70.0,
        minimoCoherencia: 60.0,
        pesoAutenticidad: 0.40,
        pesoCruceFuentes: 0.40,
        pesoCoherencia: 0.20,
      });

    // Intentar crear segundo borrador
    const res2 = await request(app)
      .post('/api/umbrales/borrador')
      .set('Cookie', [`mira_session=${encodeURIComponent('Diseñador 2')}`])
      .send({
        idFlujo: 'reembolso-gastos-medicos',
        umbralAprobacion: 85.0,
        umbralRiesgoAlto: 60.0,
        minimoAutenticidad: 70.0,
        minimoCruceFuentes: 70.0,
        minimoCoherencia: 60.0,
        pesoAutenticidad: 0.40,
        pesoCruceFuentes: 0.40,
        pesoCoherencia: 0.20,
      });

    expect(res2.status).toBe(409);
    expect(res2.body.error).toContain('borrador de umbrales activo');
  });

  it('PUT /api/umbrales/borrador modifica parámetros manteniendo la versión asignada', async () => {
    // Crear borrador
    await request(app)
      .post('/api/umbrales/borrador')
      .set('Cookie', [`mira_session=${encodeURIComponent('Diseñador 1')}`])
      .send({
        idFlujo: 'reembolso-gastos-medicos',
        umbralAprobacion: 88.0,
        umbralRiesgoAlto: 65.0,
        minimoAutenticidad: 70.0,
        minimoCruceFuentes: 70.0,
        minimoCoherencia: 60.0,
        pesoAutenticidad: 0.40,
        pesoCruceFuentes: 0.40,
        pesoCoherencia: 0.20,
      });

    // Actualizar borrador
    const res = await request(app)
      .put('/api/umbrales/borrador')
      .set('Cookie', [`mira_session=${encodeURIComponent('Diseñador 1')}`])
      .send({
        idFlujo: 'reembolso-gastos-medicos',
        umbralAprobacion: 89.0,
        umbralRiesgoAlto: 64.0,
        minimoAutenticidad: 70.0,
        minimoCruceFuentes: 70.0,
        minimoCoherencia: 60.0,
        pesoAutenticidad: 0.40,
        pesoCruceFuentes: 0.40,
        pesoCoherencia: 0.20,
      });

    expect(res.status).toBe(200);
    expect(res.body.borrador.version).toBe(2);
    expect(res.body.borrador.umbralAprobacion).toBe(89.0);
    expect(res.body.borrador.umbralRiesgoAlto).toBe(64.0);
  });
});

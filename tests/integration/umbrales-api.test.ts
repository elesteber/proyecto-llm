import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@backend/app';
import { getDatabase } from '@backend/db/database';
import { resetTestDb } from '../setup-test-db.js';

describe('API de Umbrales F5 - Propuesta y Gestión en Borrador (US4)', () => {
  beforeEach(() => {
    resetTestDb();
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

  it('GET /api/umbrales/historial retorna la lista de versiones y el borrador activo si existe', async () => {
    const res = await request(app).get('/api/umbrales/historial');

    expect(res.status).toBe(200);
    expect(res.body.idFlujo).toBe('reembolso-gastos-medicos');
    expect(res.body.borradorActivo).toBeNull();
    expect(Array.isArray(res.body.versiones)).toBe(true);
    expect(res.body.versiones.length).toBeGreaterThanOrEqual(1);
    expect(res.body.versiones[0].version).toBe(1);
    expect(res.body.versiones[0].estado).toBe('APROBADO');
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

  describe('User Story 5 - Flujo de Doble Control y Aprobación', () => {
    it('Administrador recibe 403 Forbidden al intentar proponer o modificar un borrador', async () => {
      const res = await request(app)
        .post('/api/umbrales/borrador')
        .set('Cookie', [`mira_session=${encodeURIComponent('Administrador 1')}`])
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
      expect(res.body.error).toContain('Diseñador');
    });

    it('Diseñador recibe 403 Forbidden al intentar aprobar una propuesta', async () => {
      const res = await request(app)
        .post('/api/umbrales/borrador/aprobar')
        .set('Cookie', [`mira_session=${encodeURIComponent('Diseñador 1')}`])
        .send({ idFlujo: 'reembolso-gastos-medicos' });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('Administrador');
    });

    it('Aprobación exitosa por Administrador independiente promueve borrador a APROBADO y rige en F4', async () => {
      // 1. Diseñador 1 propone borrador v2 con umbralAprobacion = 92.0
      await request(app)
        .post('/api/umbrales/borrador')
        .set('Cookie', [`mira_session=${encodeURIComponent('Diseñador 1')}`])
        .send({
          idFlujo: 'reembolso-gastos-medicos',
          umbralAprobacion: 92.0,
          umbralRiesgoAlto: 65.0,
          minimoAutenticidad: 70.0,
          minimoCruceFuentes: 70.0,
          minimoCoherencia: 60.0,
          pesoAutenticidad: 0.40,
          pesoCruceFuentes: 0.40,
          pesoCoherencia: 0.20,
        });

      // 2. Administrador 1 aprueba formalmente
      const resAprobar = await request(app)
        .post('/api/umbrales/borrador/aprobar')
        .set('Cookie', [`mira_session=${encodeURIComponent('Administrador 1')}`])
        .send({ idFlujo: 'reembolso-gastos-medicos' });

      expect(resAprobar.status).toBe(200);
      expect(resAprobar.body.versionAprobada).toBeDefined();
      expect(resAprobar.body.versionAprobada.version).toBe(2);
      expect(resAprobar.body.versionAprobada.estado).toBe('APROBADO');
      expect(resAprobar.body.versionAprobada.aprobador).toBe('Administrador 1');

      // 3. Verificar que rige de inmediato en F4 como versión vigente
      const resVigente = await request(app).get('/api/umbrales/vigente');
      expect(resVigente.status).toBe(200);
      expect(resVigente.body.version).toBe(2);
      expect(resVigente.body.umbralAprobacion).toBe(92.0);
    });

    it('Bloqueo estricto de auto-aprobación: si proponente === aprobador retorna 403 Forbidden', async () => {
      // Crear un borrador donde el proponente coincidiría con el aprobador (simulado si un admin pudiera proponer)
      const db = getDatabase();
      const ultima = db.prepare("SELECT COALESCE(MAX(version), 0) as max_v FROM umbrales_flujo").get() as { max_v: number };
      const vNext = ultima.max_v + 1;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO umbrales_flujo (
          id_flujo, version, umbral_aprobacion, umbral_riesgo_alto,
          minimo_autenticidad, minimo_cruce_fuentes, minimo_coherencia,
          peso_autenticidad, peso_cruce_fuentes, peso_coherencia,
          proponente, fecha_propuesta, estado
        ) VALUES (
          'reembolso-gastos-medicos', ?, 90.0, 60.0,
          70.0, 70.0, 60.0,
          0.40, 0.40, 0.20,
          'Administrador 1', ?, 'BORRADOR'
        )
      `).run(vNext, now);

      const res = await request(app)
        .post('/api/umbrales/borrador/aprobar')
        .set('Cookie', [`mira_session=${encodeURIComponent('Administrador 1')}`])
        .send({ idFlujo: 'reembolso-gastos-medicos' });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('segregación de funciones');
    });

    it('POST /api/umbrales/borrador/desestimar desestima borrador, conserva versión histórica y libera índice único', async () => {
      // 1. Crear borrador como Diseñador 1
      const resCrear = await request(app)
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

      const versionCreada = resCrear.body.borrador.version;

      // 2. Administrador 1 desestima borrador
      const resDesestimar = await request(app)
        .post('/api/umbrales/borrador/desestimar')
        .set('Cookie', [`mira_session=${encodeURIComponent('Administrador 1')}`])
        .send({
          idFlujo: 'reembolso-gastos-medicos',
          motivoDesestimacion: 'Ponderaciones incompatibles con política de riesgo de octubre.',
        });

      expect(resDesestimar.status).toBe(200);
      expect(resDesestimar.body.versionDesestimada).toBeDefined();
      expect(resDesestimar.body.versionDesestimada.version).toBe(versionCreada);
      expect(resDesestimar.body.versionDesestimada.estado).toBe('DESESTIMADO');

      // 3. Verificar que la versión se conserva en la base de datos como DESESTIMADO
      const db = getDatabase();
      const v = db
        .prepare("SELECT * FROM umbrales_flujo WHERE id_flujo = 'reembolso-gastos-medicos' AND version = ?")
        .get(versionCreada) as any;
      expect(v).toBeDefined();
      expect(v.estado).toBe('DESESTIMADO');

      // 4. Verificar que se puede crear un nuevo borrador (índice único liberado) asignando versión siguiente
      const resNuevoBorrador = await request(app)
        .post('/api/umbrales/borrador')
        .set('Cookie', [`mira_session=${encodeURIComponent('Diseñador 2')}`])
        .send({
          idFlujo: 'reembolso-gastos-medicos',
          umbralAprobacion: 91.0,
          umbralRiesgoAlto: 60.0,
          minimoAutenticidad: 70.0,
          minimoCruceFuentes: 70.0,
          minimoCoherencia: 60.0,
          pesoAutenticidad: 0.40,
          pesoCruceFuentes: 0.40,
          pesoCoherencia: 0.20,
        });

      expect(resNuevoBorrador.status).toBe(201);
      expect(resNuevoBorrador.body.borrador.version).toBe(versionCreada + 1);
      expect(resNuevoBorrador.body.borrador.estado).toBe('BORRADOR');
    });
  });
});

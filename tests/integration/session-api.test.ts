import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '@backend/app';

describe('Gestión de Sesión Simulada (API /api/session)', () => {
  it('GET /api/session/current retorna por defecto "Diseñador 1" si no hay cookie', async () => {
    const res = await request(app).get('/api/session/current');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('usuarioActivo');
    expect(res.body.usuarioActivo).toEqual({
      nombre: 'Diseñador 1',
      rol: 'Diseñador',
      descripcion: expect.any(String),
    });
    expect(res.body.catalogoIdentidades).toHaveLength(5);
    expect(res.body.catalogoIdentidades).toEqual([
      { nombre: 'Diseñador 1', rol: 'Diseñador' },
      { nombre: 'Diseñador 2', rol: 'Diseñador' },
      { nombre: 'Administrador 1', rol: 'Administrador' },
      { nombre: 'Administrador 2', rol: 'Administrador' },
      { nombre: 'Operador 1', rol: 'Operador' },
    ]);
  });

  it('POST /api/session/switch conmuta identidad válida y emite cookie mira_session', async () => {
    const res = await request(app)
      .post('/api/session/switch')
      .send({ nuevoUsuario: 'Administrador 1' });

    expect(res.status).toBe(200);
    expect(res.body.usuarioActivo).toEqual({
      nombre: 'Administrador 1',
      rol: 'Administrador',
    });
    expect(res.headers['set-cookie']).toBeDefined();
    const rawCookies = res.headers['set-cookie'];
    const cookieList = Array.isArray(rawCookies) ? rawCookies : [rawCookies as string];
    const cookieHeader = cookieList.find((c: string) => c.startsWith('mira_session='));
    expect(cookieHeader).toBeDefined();
    expect(cookieHeader).toContain('Administrador%201');
  });

  it('GET /api/session/current honra la cookie mira_session enviada', async () => {
    const res = await request(app)
      .get('/api/session/current')
      .set('Cookie', [`mira_session=${encodeURIComponent('Administrador 2')}`]);

    expect(res.status).toBe(200);
    expect(res.body.usuarioActivo.nombre).toBe('Administrador 2');
    expect(res.body.usuarioActivo.rol).toBe('Administrador');
  });

  it('POST /api/session/switch rechaza con 400 una identidad no autorizada', async () => {
    const res = await request(app)
      .post('/api/session/switch')
      .send({ nuevoUsuario: 'SuperUsuario Inexistente' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('Identidad no autorizada');
  });

  it('permite conmutar por todas las 5 identidades fijas del catálogo', async () => {
    const identidades = [
      { nombre: 'Diseñador 1', rol: 'Diseñador' },
      { nombre: 'Diseñador 2', rol: 'Diseñador' },
      { nombre: 'Administrador 1', rol: 'Administrador' },
      { nombre: 'Administrador 2', rol: 'Administrador' },
      { nombre: 'Operador 1', rol: 'Operador' },
    ];

    for (const id of identidades) {
      const res = await request(app)
        .post('/api/session/switch')
        .send({ nuevoUsuario: id.nombre });

      expect(res.status).toBe(200);
      expect(res.body.usuarioActivo.nombre).toBe(id.nombre);
      expect(res.body.usuarioActivo.rol).toBe(id.rol);
    }
  });
});

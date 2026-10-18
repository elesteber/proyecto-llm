import { describe, it, expect, beforeEach } from 'vitest';
import { UmbralesRepo } from '@backend/repositories/umbrales-repo';
import { resetTestDb } from '../setup-test-db.js';

describe('UmbralesRepo', () => {
  let repo: UmbralesRepo;

  beforeEach(() => {
    resetTestDb();
    repo = new UmbralesRepo();
  });

  it('obtenerVigente retorna la versión APROBADA más reciente', () => {
    const vigente = repo.obtenerVigente('reembolso-gastos-medicos');

    expect(vigente).not.toBeNull();
    expect(vigente?.idFlujo).toBe('reembolso-gastos-medicos');
    expect(vigente?.version).toBe(1);
    expect(vigente?.estado).toBe('APROBADO');
    expect(vigente?.umbralAprobacion).toBe(90.0);
    expect(vigente?.umbralRiesgoAlto).toBe(60.0);
    expect(vigente?.pesoAutenticidad).toBe(0.4);
    expect(vigente?.pesoCruceFuentes).toBe(0.4);
    expect(vigente?.pesoCoherencia).toBe(0.2);
  });

  it('obtenerVigente retorna null para un idFlujo inexistente', () => {
    const vigente = repo.obtenerVigente('flujo-inexistente');
    expect(vigente).toBeNull();
  });

  it('obtenerPorVersion retorna la versión exacta especificada', () => {
    const version1 = repo.obtenerPorVersion('reembolso-gastos-medicos', 1);
    expect(version1).not.toBeNull();
    expect(version1?.version).toBe(1);
    expect(version1?.estado).toBe('APROBADO');
  });

  it('obtenerBorrador retorna null si no existe borrador pendiente', () => {
    const borrador = repo.obtenerBorrador('reembolso-gastos-medicos');
    expect(borrador).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { evaluacionEngine } from '@backend/services/evaluacion-engine';
import { UmbralesFlujo, SenalesCaso } from '@shared/types';

describe('Motor de Evaluación F4 - Precedencia de Fraude y Señal Bajo Mínimo (US1)', () => {
  const umbralesV1: UmbralesFlujo = {
    idFlujo: 'reembolso-gastos-medicos',
    version: 1,
    umbralAprobacion: 90.0,
    umbralRiesgoAlto: 60.0,
    minimoAutenticidad: 70.0,
    minimoCruceFuentes: 70.0,
    minimoCoherencia: 60.0,
    pesoAutenticidad: 0.40,
    pesoCruceFuentes: 0.40,
    pesoCoherencia: 0.20,
    proponente: 'sistema',
    aprobador: 'carga inicial del sistema (valores por defecto)',
    fechaPropuesta: '2026-10-14T10:00:00Z',
    fechaResolucion: '2026-10-14T10:00:00Z',
    estado: 'APROBADO',
  };

  it('Paso 1: Precedencia absoluta de alerta de fraude deriva a revisión ignorando puntaje alto (AC-3, CASO-MED-003)', () => {
    const senalesCaso003: SenalesCaso = {
      autenticidad_documentos: 95.0,
      cruce_fuentes: 95.0,
      coherencia_solicitud: 90.0,
      alertaFraudeActiva: true,
    };

    const resultado = evaluacionEngine.evaluar(senalesCaso003, umbralesV1);

    expect(resultado.decision).toBe('DERIVADO_REVISION');
    expect(resultado.motivo).toBe('alerta_fraude');
    expect(resultado.scoreGlobal).toBe(94.0);
    expect(resultado.decision).not.toBe('APROBADO_AUTOMATICO');
    expect((resultado.decision as string)).not.toBe('RECHAZADO');
  });

  it('Paso 2: Señal individual bajo mínimo propio deriva a revisión con motivo senal_bajo_minimo aunque score >= 90 (AC-2, CASO-MED-002)', () => {
    const senalesCaso002: SenalesCaso = {
      autenticidad_documentos: 100.0,
      cruce_fuentes: 100.0,
      coherencia_solicitud: 55.0, // Bajo mínimo de 60.0
      alertaFraudeActiva: false,
    };

    const resultado = evaluacionEngine.evaluar(senalesCaso002, umbralesV1);

    expect(resultado.decision).toBe('DERIVADO_REVISION');
    expect(resultado.motivo).toBe('senal_bajo_minimo');
    expect(resultado.scoreGlobal).toBe(91.0);
    expect(resultado.senalesBajoMinimo).toEqual(['coherencia_solicitud']);
    expect(resultado.decision).not.toBe('APROBADO_AUTOMATICO');
    expect((resultado.decision as string)).not.toBe('RECHAZADO');
  });
});

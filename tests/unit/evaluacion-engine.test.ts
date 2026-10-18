import { describe, it, expect } from 'vitest';
import { evaluacionEngine } from '@backend/services/evaluacion-engine';
import { UmbralesFlujo, SenalesCaso } from '@shared/types';

describe('Motor de Evaluación F4', () => {
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

  describe('User Story 1 - Precedencia de Fraude y Señal Bajo Mínimo', () => {
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

  describe('User Story 2 - Aprobación Automática y Rango Intermedio', () => {
    it('Cálculo ponderado continuo exacto sin redondear (calcularScoreGlobal)', () => {
      const senales: SenalesCaso = {
        autenticidad_documentos: 95.0,
        cruce_fuentes: 95.0,
        coherencia_solicitud: 90.0,
        alertaFraudeActiva: false,
      };

      const score = evaluacionEngine.calcularScoreGlobal(senales, umbralesV1);
      expect(score).toBe(94.0);
    });

    it('Paso 3: Aprobación automática holgada con score >= 90 sin fraude ni caídas (AC-1, CASO-MED-001)', () => {
      const senalesCaso001: SenalesCaso = {
        autenticidad_documentos: 95.0,
        cruce_fuentes: 95.0,
        coherencia_solicitud: 90.0,
        alertaFraudeActiva: false,
      };

      const resultado = evaluacionEngine.evaluar(senalesCaso001, umbralesV1);

      expect(resultado.decision).toBe('APROBADO_AUTOMATICO');
      expect(resultado.motivo).toBe('aprobado');
      expect(resultado.scoreGlobal).toBe(94.0);
      expect(resultado.scoreVisual).toBe('94.0');
      expect(resultado.riesgoAltoRechazo).toBe(false);
      expect(resultado.senalesBajoMinimo).toHaveLength(0);
    });

    it('Paso 3 (caso límite inclusivo): Puntaje exacto scoreGlobal === 90.0 aprueba automáticamente', () => {
      const senalesLimite: SenalesCaso = {
        autenticidad_documentos: 90.0,
        cruce_fuentes: 90.0,
        coherencia_solicitud: 90.0,
        alertaFraudeActiva: false,
      };

      const resultado = evaluacionEngine.evaluar(senalesLimite, umbralesV1);

      expect(resultado.scoreGlobal).toBe(90.0);
      expect(resultado.decision).toBe('APROBADO_AUTOMATICO');
      expect(resultado.motivo).toBe('aprobado');
    });

    it('Paso 4: Derivación por rango intermedio 60 <= score < 90 con motivo puntaje_bajo_umbral (AC-5, CASO-MED-005)', () => {
      const senalesCaso005: SenalesCaso = {
        autenticidad_documentos: 75.0,
        cruce_fuentes: 75.0,
        coherencia_solicitud: 75.0,
        alertaFraudeActiva: false,
      };

      const resultado = evaluacionEngine.evaluar(senalesCaso005, umbralesV1);

      expect(resultado.scoreGlobal).toBe(75.0);
      expect(resultado.decision).toBe('DERIVADO_REVISION');
      expect(resultado.motivo).toBe('puntaje_bajo_umbral');
      expect(resultado.riesgoAltoRechazo).toBe(false);
      expect(resultado.senalesBajoMinimo).toHaveLength(0);
      expect((resultado.decision as string)).not.toBe('RECHAZADO');
    });
  });

  describe('User Story 3 - Señalización de Advertencia de Riesgo Alto (Invariante Cero Rechazos)', () => {
    it('Activa riesgoAltoRechazo por 2 señales bajo mínimo y score 44.0 < 60 (AC-4, CASO-MED-004)', () => {
      const senalesCaso004: SenalesCaso = {
        autenticidad_documentos: 40.0, // < 70
        cruce_fuentes: 40.0,           // < 70
        coherencia_solicitud: 60.0,
        alertaFraudeActiva: false,
      };

      const resultado = evaluacionEngine.evaluar(senalesCaso004, umbralesV1);

      expect(resultado.scoreGlobal).toBe(44.0);
      expect(resultado.riesgoAltoRechazo).toBe(true);
      expect(resultado.senalesBajoMinimo).toEqual(['autenticidad_documentos', 'cruce_fuentes']);
      expect(resultado.decision).toBe('DERIVADO_REVISION');
      expect(resultado.motivo).toBe('senal_bajo_minimo');
      expect(resultado.mensajeOperador).toBe('Riesgo alto de rechazo: decide un operador');
      expect((resultado.decision as string)).not.toBe('RECHAZADO');
    });

    it('Activa riesgoAltoRechazo por score 40.0 < 60 con 1 señal bajo mínimo (AC-6, CASO-MED-006)', () => {
      const senalesCaso006: SenalesCaso = {
        autenticidad_documentos: 0.0,  // < 70
        cruce_fuentes: 70.0,
        coherencia_solicitud: 60.0,
        alertaFraudeActiva: false,
      };

      const resultado = evaluacionEngine.evaluar(senalesCaso006, umbralesV1);

      expect(resultado.scoreGlobal).toBe(40.0);
      expect(resultado.riesgoAltoRechazo).toBe(true);
      expect(resultado.senalesBajoMinimo).toEqual(['autenticidad_documentos']);
      expect(resultado.decision).toBe('DERIVADO_REVISION');
      expect(resultado.motivo).toBe('senal_bajo_minimo');
      expect(resultado.mensajeOperador).toBe('Riesgo alto de rechazo: decide un operador');
      expect((resultado.decision as string)).not.toBe('RECHAZADO');
    });

    it('Prueba PU-1: Activa riesgoAltoRechazo por 2 señales bajo mínimo a pesar de score 72.0 >= 60', () => {
      const senalesPU1: SenalesCaso = {
        autenticidad_documentos: 65.0, // < 70
        cruce_fuentes: 65.0,           // < 70
        coherencia_solicitud: 100.0,
        alertaFraudeActiva: false,
      };

      const resultado = evaluacionEngine.evaluar(senalesPU1, umbralesV1);

      expect(resultado.scoreGlobal).toBe(72.0);
      expect(resultado.senalesBajoMinimo).toHaveLength(2);
      expect(resultado.riesgoAltoRechazo).toBe(true);
      expect(resultado.decision).toBe('DERIVADO_REVISION');
      expect(resultado.motivo).toBe('senal_bajo_minimo');
      expect(resultado.mensajeOperador).toBe('Riesgo alto de rechazo: decide un operador');
      expect((resultado.decision as string)).not.toBe('RECHAZADO');
    });
  });
});

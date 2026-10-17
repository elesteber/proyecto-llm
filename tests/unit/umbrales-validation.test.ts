import { describe, it, expect } from 'vitest';
import { validarParametrosUmbrales } from '@backend/services/umbrales-service';

describe('Validación de Parámetros de Umbrales (US4)', () => {
  const paramsValidos = {
    umbralAprobacion: 90.0,
    umbralRiesgoAlto: 60.0,
    minimoAutenticidad: 70.0,
    minimoCruceFuentes: 70.0,
    minimoCoherencia: 60.0,
    pesoAutenticidad: 0.40,
    pesoCruceFuentes: 0.40,
    pesoCoherencia: 0.20,
  };

  it('acepta parámetros válidos cuando la suma de pesos es 1.00 y umbralAprobacion > umbralRiesgoAlto', () => {
    const error = validarParametrosUmbrales(paramsValidos);
    expect(error).toBeNull();
  });

  it('rechaza cuando la suma de pesos no es 1.00 (ej. 0.95)', () => {
    const params = {
      ...paramsValidos,
      pesoAutenticidad: 0.35, // suma 0.95
    };
    const error = validarParametrosUmbrales(params);
    expect(error).not.toBeNull();
    expect(error).toContain('la suma de las ponderaciones debe ser exactamente 1.00');
  });

  it('acepta suma de pesos con tolerancia decimal flotante (|sum - 1.0| < 0.0001)', () => {
    const params = {
      ...paramsValidos,
      pesoAutenticidad: 0.3333,
      pesoCruceFuentes: 0.3333,
      pesoCoherencia: 0.3334,
    };
    const error = validarParametrosUmbrales(params);
    expect(error).toBeNull();
  });

  it('rechaza si umbralAprobacion <= umbralRiesgoAlto (ej. 60 <= 70 o igualdad 80 === 80)', () => {
    const paramsInvertidos = {
      ...paramsValidos,
      umbralAprobacion: 60.0,
      umbralRiesgoAlto: 70.0,
    };
    const error1 = validarParametrosUmbrales(paramsInvertidos);
    expect(error1).not.toBeNull();
    expect(error1).toContain('debe ser estrictamente mayor que el umbral de riesgo alto');

    const paramsIguales = {
      ...paramsValidos,
      umbralAprobacion: 80.0,
      umbralRiesgoAlto: 80.0,
    };
    const error2 = validarParametrosUmbrales(paramsIguales);
    expect(error2).not.toBeNull();
    expect(error2).toContain('debe ser estrictamente mayor que el umbral de riesgo alto');
  });

  it('rechaza si algún mínimo o umbral está fuera del rango [0, 100]', () => {
    const paramsFueraRango = {
      ...paramsValidos,
      minimoAutenticidad: 105.0,
    };
    const error = validarParametrosUmbrales(paramsFueraRango);
    expect(error).not.toBeNull();
    expect(error).toContain('entre 0 y 100');
  });

  it('rechaza si algún peso es negativo o mayor a 1', () => {
    const paramsPesoNegativo = {
      ...paramsValidos,
      pesoAutenticidad: -0.1,
      pesoCruceFuentes: 0.6,
      pesoCoherencia: 0.5,
    };
    const error = validarParametrosUmbrales(paramsPesoNegativo);
    expect(error).not.toBeNull();
    expect(error).toContain('entre 0 y 1');
  });
});

import { UmbralesFlujo } from '@shared/types';
import { umbralesRepo } from '../repositories/umbrales-repo.js';
import { getDatabase } from '../db/database.js';

export interface ParametrosUmbralesInput {
  umbralAprobacion: number;
  umbralRiesgoAlto: number;
  minimoAutenticidad: number;
  minimoCruceFuentes: number;
  minimoCoherencia: number;
  pesoAutenticidad: number;
  pesoCruceFuentes: number;
  pesoCoherencia: number;
}

export function validarParametrosUmbrales(params: ParametrosUmbralesInput): string | null {
  const {
    umbralAprobacion,
    umbralRiesgoAlto,
    minimoAutenticidad,
    minimoCruceFuentes,
    minimoCoherencia,
    pesoAutenticidad,
    pesoCruceFuentes,
    pesoCoherencia,
  } = params;

  // 1. Límites inclusivos [0, 100] para mínimos y umbrales
  const valores100 = [
    { nombre: 'umbralAprobacion', val: umbralAprobacion },
    { nombre: 'umbralRiesgoAlto', val: umbralRiesgoAlto },
    { nombre: 'minimoAutenticidad', val: minimoAutenticidad },
    { nombre: 'minimoCruceFuentes', val: minimoCruceFuentes },
    { nombre: 'minimoCoherencia', val: minimoCoherencia },
  ];

  for (const v of valores100) {
    if (typeof v.val !== 'number' || isNaN(v.val) || v.val < 0 || v.val > 100) {
      return `Validación fallida: ${v.nombre} debe ser un número entre 0 y 100 inclusive.`;
    }
  }

  // 2. Límites inclusivos [0, 1] para ponderaciones
  const pesos = [
    { nombre: 'pesoAutenticidad', val: pesoAutenticidad },
    { nombre: 'pesoCruceFuentes', val: pesoCruceFuentes },
    { nombre: 'pesoCoherencia', val: pesoCoherencia },
  ];

  for (const p of pesos) {
    if (typeof p.val !== 'number' || isNaN(p.val) || p.val < 0 || p.val > 1) {
      return `Validación fallida: ${p.nombre} debe ser un número entre 0 y 1 inclusive.`;
    }
  }

  // 3. Suma exacta de ponderaciones = 1.00 (tolerancia 0.0001)
  const sumaPesos = pesoAutenticidad + pesoCruceFuentes + pesoCoherencia;
  if (Math.abs(sumaPesos - 1.0) >= 0.0001) {
    return `Validación fallida: la suma de las ponderaciones debe ser exactamente 1.00 (suma actual: ${sumaPesos.toFixed(2)}).`;
  }

  // 4. Consistencia de corte umbralAprobacion > umbralRiesgoAlto
  if (umbralAprobacion <= umbralRiesgoAlto) {
    return `Validación fallida: el umbral de aprobación (${umbralAprobacion}) debe ser estrictamente mayor que el umbral de riesgo alto (${umbralRiesgoAlto}).`;
  }

  return null;
}

export class UmbralesService {
  obtenerVigente(idFlujo: string): UmbralesFlujo | null {
    return umbralesRepo.obtenerVigente(idFlujo);
  }

  obtenerBorrador(idFlujo: string): UmbralesFlujo | null {
    return umbralesRepo.obtenerBorrador(idFlujo);
  }

  obtenerHistorial(idFlujo: string) {
    const borradorActivo = umbralesRepo.obtenerBorrador(idFlujo);
    const versiones = umbralesRepo.obtenerHistorial(idFlujo);
    return {
      idFlujo,
      borradorActivo,
      versiones,
    };
  }

  crearBorrador(idFlujo: string, params: ParametrosUmbralesInput, proponente: string): UmbralesFlujo {
    const errorValidacion = validarParametrosUmbrales(params);
    if (errorValidacion) {
      const err: any = new Error(errorValidacion);
      err.statusCode = 400;
      throw err;
    }

    const borradorExistente = umbralesRepo.obtenerBorrador(idFlujo);
    if (borradorExistente) {
      const err: any = new Error(
        `Ya existe un borrador de umbrales activo pendiente de resolución en este flujo (versión ${borradorExistente.version}).`
      );
      err.statusCode = 409;
      throw err;
    }

    const ultimaVersion = umbralesRepo.obtenerUltimaVersion(idFlujo);
    const version = ultimaVersion + 1;
    const fechaPropuesta = new Date().toISOString();

    const borrador = umbralesRepo.crearBorrador({
      idFlujo,
      version,
      ...params,
      proponente,
      fechaPropuesta,
    });

    // Registrar rastro de auditoría
    const db = getDatabase();
    db.prepare(`
      INSERT INTO rastro_auditoria (id_flujo, version, accion, usuario, detalles_json, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(idFlujo, version, 'PROPUESTA_CREADA', proponente, JSON.stringify(borrador), fechaPropuesta);

    return borrador;
  }

  modificarBorrador(idFlujo: string, params: ParametrosUmbralesInput, editor: string): UmbralesFlujo {
    const errorValidacion = validarParametrosUmbrales(params);
    if (errorValidacion) {
      const err: any = new Error(errorValidacion);
      err.statusCode = 400;
      throw err;
    }

    const borrador = umbralesRepo.obtenerBorrador(idFlujo);
    if (!borrador) {
      const err: any = new Error('No existe un borrador activo para modificar en este flujo.');
      err.statusCode = 404;
      throw err;
    }

    const actualizado = umbralesRepo.actualizarBorrador(idFlujo, borrador.version, params);

    // Registrar rastro de auditoría
    const timestamp = new Date().toISOString();
    const db = getDatabase();
    db.prepare(`
      INSERT INTO rastro_auditoria (id_flujo, version, accion, usuario, detalles_json, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(idFlujo, borrador.version, 'PROPUESTA_MODIFICADA', editor, JSON.stringify(actualizado), timestamp);

    return actualizado;
  }
}

export const umbralesService = new UmbralesService();

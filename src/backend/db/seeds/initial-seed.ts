import fs from 'fs';
import { getDatabase } from '../database.js';
import { config } from '../../config/env.js';

export function runSeed(customDbPath?: string): void {
  const db = getDatabase(customDbPath);

  // 1. Verificar carga de casos sintéticos de prueba
  if (!fs.existsSync(config.casosPath)) {
    throw new Error(`Archivo de casos de prueba no encontrado en: ${config.casosPath}`);
  }
  const casosContent = fs.readFileSync(config.casosPath, 'utf-8');
  const casos = JSON.parse(casosContent);
  if (!Array.isArray(casos) || casos.length === 0) {
    throw new Error('El archivo data/casos_prueba.json debe contener un arreglo no vacío de casos.');
  }

  // 2. Siembra idempotente de la Versión 1 de Umbrales
  const idFlujo = 'reembolso-gastos-medicos';
  const existingV1 = db
    .prepare('SELECT version FROM umbrales_flujo WHERE id_flujo = ? AND version = 1')
    .get(idFlujo);

  if (!existingV1) {
    const now = new Date().toISOString();
    const insertUmbrales = db.prepare(`
      INSERT INTO umbrales_flujo (
        id_flujo, version, umbral_aprobacion, umbral_riesgo_alto,
        minimo_autenticidad, minimo_cruce_fuentes, minimo_coherencia,
        peso_autenticidad, peso_cruce_fuentes, peso_coherencia,
        proponente, aprobador, fecha_propuesta, fecha_resolucion, estado
      ) VALUES (
        @id_flujo, @version, @umbral_aprobacion, @umbral_riesgo_alto,
        @minimo_autenticidad, @minimo_cruce_fuentes, @minimo_coherencia,
        @peso_autenticidad, @peso_cruce_fuentes, @peso_coherencia,
        @proponente, @aprobador, @fecha_propuesta, @fecha_resolucion, @estado
      )
    `);

    insertUmbrales.run({
      id_flujo: idFlujo,
      version: 1,
      umbral_aprobacion: 90.0,
      umbral_riesgo_alto: 60.0,
      minimo_autenticidad: 70.0,
      minimo_cruce_fuentes: 70.0,
      minimo_coherencia: 60.0,
      peso_autenticidad: 0.40,
      peso_cruce_fuentes: 0.40,
      peso_coherencia: 0.20,
      proponente: 'sistema',
      aprobador: 'carga inicial del sistema (valores por defecto)',
      fecha_propuesta: now,
      fecha_resolucion: now,
      estado: 'APROBADO',
    });

    const insertAuditoria = db.prepare(`
      INSERT INTO rastro_auditoria (id_flujo, version, accion, usuario, detalles_json, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertAuditoria.run(
      idFlujo,
      1,
      'PROPUESTA_APROBADA',
      'sistema',
      JSON.stringify({ motivo: 'Carga inicial del sistema con valores normativos por defecto (DEC-01, DEC-05)' }),
      now
    );

    console.log(`[SEED] Versión 1 sembrada con éxito para el flujo '${idFlujo}'.`);
  } else {
    console.log(`[SEED] La Versión 1 ya existe para el flujo '${idFlujo}'. Omitiendo inserción (idempotente).`);
  }
}

// Ejecución directa vía CLI: npm run db:seed
if (process.argv[1] && process.argv[1].endsWith('initial-seed.ts')) {
  try {
    runSeed();
    console.log('[SEED] Proceso de siembra finalizado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('[SEED ERROR]', error);
    process.exit(1);
  }
}

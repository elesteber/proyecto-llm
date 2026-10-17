import { getDatabase } from '../db/database.js';
import { UmbralesFlujo } from '@shared/types';
import Database from 'better-sqlite3';

function mapRowToUmbralesFlujo(row: any): UmbralesFlujo {
  return {
    idFlujo: row.id_flujo,
    version: row.version,
    umbralAprobacion: row.umbral_aprobacion,
    umbralRiesgoAlto: row.umbral_riesgo_alto,
    minimoAutenticidad: row.minimo_autenticidad,
    minimoCruceFuentes: row.minimo_cruce_fuentes,
    minimoCoherencia: row.minimo_coherencia,
    pesoAutenticidad: row.peso_autenticidad,
    pesoCruceFuentes: row.peso_cruce_fuentes,
    pesoCoherencia: row.peso_coherencia,
    proponente: row.proponente,
    aprobador: row.aprobador ?? null,
    fechaPropuesta: row.fecha_propuesta,
    fechaResolucion: row.fecha_resolucion ?? null,
    estado: row.estado,
  };
}

export class UmbralesRepo {
  private db: Database.Database;

  constructor(db?: Database.Database) {
    this.db = db || getDatabase();
  }

  obtenerVigente(idFlujo: string): UmbralesFlujo | null {
    const stmt = this.db.prepare(`
      SELECT * FROM umbrales_flujo
      WHERE id_flujo = ? AND estado = 'APROBADO'
      ORDER BY version DESC
      LIMIT 1
    `);
    const row = stmt.get(idFlujo);
    return row ? mapRowToUmbralesFlujo(row) : null;
  }

  obtenerPorVersion(idFlujo: string, version: number): UmbralesFlujo | null {
    const stmt = this.db.prepare(`
      SELECT * FROM umbrales_flujo
      WHERE id_flujo = ? AND version = ?
    `);
    const row = stmt.get(idFlujo, version);
    return row ? mapRowToUmbralesFlujo(row) : null;
  }

  obtenerBorrador(idFlujo: string): UmbralesFlujo | null {
    const stmt = this.db.prepare(`
      SELECT * FROM umbrales_flujo
      WHERE id_flujo = ? AND estado = 'BORRADOR'
      LIMIT 1
    `);
    const row = stmt.get(idFlujo);
    return row ? mapRowToUmbralesFlujo(row) : null;
  }

  obtenerHistorial(idFlujo: string): UmbralesFlujo[] {
    const stmt = this.db.prepare(`
      SELECT * FROM umbrales_flujo
      WHERE id_flujo = ?
      ORDER BY version DESC
    `);
    const rows = stmt.all(idFlujo);
    return rows.map(mapRowToUmbralesFlujo);
  }

  obtenerUltimaVersion(idFlujo: string): number {
    const stmt = this.db.prepare(`
      SELECT COALESCE(MAX(version), 0) as max_version
      FROM umbrales_flujo
      WHERE id_flujo = ?
    `);
    const row = stmt.get(idFlujo) as { max_version: number };
    return row.max_version;
  }

  crearBorrador(params: Omit<UmbralesFlujo, 'estado' | 'aprobador' | 'fechaResolucion'>): UmbralesFlujo {
    const stmt = this.db.prepare(`
      INSERT INTO umbrales_flujo (
        id_flujo, version, umbral_aprobacion, umbral_riesgo_alto,
        minimo_autenticidad, minimo_cruce_fuentes, minimo_coherencia,
        peso_autenticidad, peso_cruce_fuentes, peso_coherencia,
        proponente, fecha_propuesta, estado
      ) VALUES (
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, 'BORRADOR'
      )
    `);

    stmt.run(
      params.idFlujo,
      params.version,
      params.umbralAprobacion,
      params.umbralRiesgoAlto,
      params.minimoAutenticidad,
      params.minimoCruceFuentes,
      params.minimoCoherencia,
      params.pesoAutenticidad,
      params.pesoCruceFuentes,
      params.pesoCoherencia,
      params.proponente,
      params.fechaPropuesta
    );

    return this.obtenerPorVersion(params.idFlujo, params.version)!;
  }

  actualizarBorrador(
    idFlujo: string,
    version: number,
    params: Partial<Omit<UmbralesFlujo, 'idFlujo' | 'version' | 'estado' | 'proponente' | 'fechaPropuesta'>>
  ): UmbralesFlujo {
    const current = this.obtenerPorVersion(idFlujo, version);
    if (!current || current.estado !== 'BORRADOR') {
      throw new Error(`No existe un borrador editable para versión ${version}`);
    }

    const updated = { ...current, ...params };

    const stmt = this.db.prepare(`
      UPDATE umbrales_flujo SET
        umbral_aprobacion = ?,
        umbral_riesgo_alto = ?,
        minimo_autenticidad = ?,
        minimo_cruce_fuentes = ?,
        minimo_coherencia = ?,
        peso_autenticidad = ?,
        peso_cruce_fuentes = ?,
        peso_coherencia = ?
      WHERE id_flujo = ? AND version = ? AND estado = 'BORRADOR'
    `);

    stmt.run(
      updated.umbralAprobacion,
      updated.umbralRiesgoAlto,
      updated.minimoAutenticidad,
      updated.minimoCruceFuentes,
      updated.minimoCoherencia,
      updated.pesoAutenticidad,
      updated.pesoCruceFuentes,
      updated.pesoCoherencia,
      idFlujo,
      version
    );

    return this.obtenerPorVersion(idFlujo, version)!;
  }

  resolverBorrador(
    idFlujo: string,
    version: number,
    nuevoEstado: 'APROBADO' | 'DESESTIMADO',
    aprobador: string,
    fechaResolucion: string
  ): UmbralesFlujo {
    const stmt = this.db.prepare(`
      UPDATE umbrales_flujo SET
        estado = ?,
        aprobador = ?,
        fecha_resolucion = ?
      WHERE id_flujo = ? AND version = ? AND estado = 'BORRADOR'
    `);

    const result = stmt.run(nuevoEstado, aprobador, fechaResolucion, idFlujo, version);
    if (result.changes === 0) {
      throw new Error(`No se pudo resolver el borrador v${version} de ${idFlujo}`);
    }

    return this.obtenerPorVersion(idFlujo, version)!;
  }
}

export const umbralesRepo = new UmbralesRepo();

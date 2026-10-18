import { describe, it, expect, beforeEach } from 'vitest';
import { getDatabase } from '@backend/db/database';
import { initialSeed } from '@backend/db/seeds/initial-seed';
import crypto from 'crypto';

describe('Inmutabilidad e Integridad Referencial SQLite (T039)', () => {
  beforeEach(() => {
    initialSeed();
  });

  it('Integridad referencial: falla con error de clave foránea si se evalúa con versión inexistente', () => {
    const db = getDatabase();
    const idEval = crypto.randomUUID();

    expect(() => {
      db.prepare(`
        INSERT INTO auditoria_evaluaciones (
          id_evaluacion, id_caso, id_flujo, version_umbrales_aplicada,
          score_global, decision, motivo, riesgo_alto_rechazo,
          senales_bajo_minimo, desglose_componentes, senales_insumo,
          usuario_operador, timestamp
        ) VALUES (
          ?, 'CASO-MED-001', 'reembolso-gastos-medicos', 9999,
          94.0, 'APROBADO_AUTOMATICO', 'aprobado', 0,
          '[]', '{}', '{}', 'Operador 1', ?
        )
      `).run(idEval, new Date().toISOString());
    }).toThrow(/FOREIGN KEY/i);
  });

  it('Inmutabilidad de evaluaciones: aborta UPDATE y DELETE sobre auditoria_evaluaciones', () => {
    const db = getDatabase();
    const idEval = crypto.randomUUID();

    // Insertar evaluación válida referenciando versión 1
    db.prepare(`
      INSERT INTO auditoria_evaluaciones (
        id_evaluacion, id_caso, id_flujo, version_umbrales_aplicada,
        score_global, decision, motivo, riesgo_alto_rechazo,
        senales_bajo_minimo, desglose_componentes, senales_insumo,
        usuario_operador, timestamp
      ) VALUES (
        ?, 'CASO-MED-001', 'reembolso-gastos-medicos', 1,
        94.0, 'APROBADO_AUTOMATICO', 'aprobado', 0,
        '[]', '{}', '{}', 'Operador 1', ?
      )
    `).run(idEval, new Date().toISOString());

    // Intento de UPDATE
    expect(() => {
      db.prepare('UPDATE auditoria_evaluaciones SET score_global = 99.0 WHERE id_evaluacion = ?').run(idEval);
    }).toThrow(/Violación de Inmutabilidad.*modificar registros/i);

    // Intento de DELETE
    expect(() => {
      db.prepare('DELETE FROM auditoria_evaluaciones WHERE id_evaluacion = ?').run(idEval);
    }).toThrow(/Violación de Inmutabilidad.*eliminar registros/i);
  });

  it('Inmutabilidad de rastro de auditoría: aborta UPDATE y DELETE sobre rastro_auditoria', () => {
    const db = getDatabase();

    // Crear un evento en rastro
    const info = db.prepare(`
      INSERT INTO rastro_auditoria (id_flujo, version, accion, usuario, detalles_json, timestamp)
      VALUES ('reembolso-gastos-medicos', 1, 'PROPUESTA_APROBADA', 'sistema', '{}', ?)
    `).run(new Date().toISOString());

    const idEvento = info.lastInsertRowid;

    // Intento de UPDATE
    expect(() => {
      db.prepare("UPDATE rastro_auditoria SET usuario = 'hacker' WHERE id_evento = ?").run(idEvento);
    }).toThrow(/Violación de Inmutabilidad.*modificar el rastro/i);

    // Intento de DELETE
    expect(() => {
      db.prepare('DELETE FROM rastro_auditoria WHERE id_evento = ?').run(idEvento);
    }).toThrow(/Violación de Inmutabilidad.*eliminar el rastro/i);
  });

  it('Inmutabilidad de versiones cerradas: aborta UPDATE sobre versiones APROBADAS o DESESTIMADAS', () => {
    const db = getDatabase();

    // Versión 1 está en estado APROBADO
    expect(() => {
      db.prepare(`
        UPDATE umbrales_flujo
        SET umbral_aprobacion = 50.0
        WHERE id_flujo = 'reembolso-gastos-medicos' AND version = 1
      `).run();
    }).toThrow(/Violación de Inmutabilidad.*APROBADA o DESESTIMADA no puede ser modificada/i);
  });
});

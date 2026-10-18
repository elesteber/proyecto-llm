/**
 * MIRA — Componente BandejaRevision (T038, RQF-039 [fase5-lester], FR-002, SC-003, US5, D-04, PF-033 adaptada)
 * Bandeja de revisión administrativa de propuestas de umbrales en estado BORRADOR.
 * 
 * REGLA INNEGOCIABLE DE GOBERNANZA (Constitución Principio III / D-04):
 * Se bloquea terminantemente el botón 'Aprobar Propuesta' si el usuario en sesión
 * coincide con el autor que propuso el borrador (aprobador !== proponente).
 * Únicamente un usuario con rol Administrador formalmente distinto puede resolver.
 */

import React from 'react';
import type { UmbralesFlujo, UsuarioActivo } from '../../../shared/types';

interface BandejaRevisionProps {
  borradorActivo: UmbralesFlujo | null;
  vigente: UmbralesFlujo;
  usuarioActivo: UsuarioActivo;
  procesando: boolean;
  onAprobar: (idFlujo?: string, aprobador?: string) => Promise<boolean>;
  onDesestimar: (idFlujo?: string, aprobador?: string) => Promise<boolean>;
}

export const BandejaRevision: React.FC<BandejaRevisionProps> = ({
  borradorActivo,
  vigente,
  usuarioActivo,
  procesando,
  onAprobar,
  onDesestimar,
}) => {
  if (!borradorActivo) {
    return (
      <div className="card review-inbox-card empty">
        <div className="empty-inbox-icon">📬</div>
        <h3 className="empty-state-title">Bandeja de Revisión Administrativa Vacía</h3>
        <p className="empty-state-desc">
          No existen propuestas de modificación en estado <strong>BORRADOR</strong> pendientes de resolución.
          Cuando un usuario con rol <em>Diseñador</em> envíe una propuesta, aparecerá aquí para su auditoría.
        </p>
      </div>
    );
  }

  // Comprobación de Segregación de Funciones (D-04)
  const proponente = borradorActivo.proponente || '';
  const usuarioNombre = usuarioActivo?.nombre || '';
  const esMismoUsuario = proponente.trim().toLowerCase() === usuarioNombre.trim().toLowerCase();

  // Comprobación de Rol Administrador
  const esRolAdministrador = usuarioActivo?.rol === 'Administrador';

  // Puede aprobar solo si es Administrador y NO es el proponente
  const puedeResolver = esRolAdministrador && !esMismoUsuario && !procesando;

  const handleAprobar = async () => {
    if (!puedeResolver) return;
    await onAprobar(borradorActivo.idFlujo, usuarioActivo.nombre);
  };

  const handleDesestimar = async () => {
    if (!puedeResolver) return;
    if (window.confirm(`¿Confirmas la desestimación de la propuesta de versión ${borradorActivo.version}? El número correlativo se conservará como histórico inmutable.`)) {
      await onDesestimar(borradorActivo.idFlujo, usuarioActivo.nombre);
    }
  };

  return (
    <div className="card review-inbox-card" id="bandeja-revision-propuestas">
      <div className="card-header">
        <div>
          <span className="badge badge-derived">Pendiente de Doble Control</span>
          <h3 className="card-title" style={{ marginTop: '0.35rem' }}>
            Revisión de Propuesta — Versión {borradorActivo.version} (BORRADOR)
          </h3>
          <span className="card-subtitle">
            Propuesto por: <strong>{borradorActivo.proponente || 'Diseñador'}</strong> el{' '}
            {borradorActivo.fechaPropuesta ? new Date(borradorActivo.fechaPropuesta).toLocaleString('es-CL') : 'Reciente'}
          </span>
        </div>
        <span className="badge badge-info">Rol Requerido: Administrador</span>
      </div>

      {/* BLOQUEO OBLIGATORIO POR AUTO-APROBACIÓN (aprobador !== proponente) */}
      {esMismoUsuario && (
        <div className="segregation-blocking-alert" role="alert" id="alerta-bloqueo-auto-aprobacion">
          <div className="alert-icon">🛑</div>
          <div>
            <h4 className="alert-title">Bloqueo por Segregación de Funciones (D-04 / Principio III)</h4>
            <p className="alert-desc">
              Tu usuario activo en sesión es <strong>{usuarioActivo.nombre}</strong>, quien es el{' '}
              <strong>proponente original</strong> de este borrador.
              <br />
              La Constitución del Proyecto MIRA prohíbe terminantemente la auto-aprobación (quien propone jamás puede
              aprobar o desestimar).
            </p>
            <p className="alert-instruction">
              👉 Para resolver formalmente esta propuesta, <strong>conmuta tu identidad en la barra superior</strong> a
              un <em>Administrador</em> independiente (ej. <strong>Administrador 1</strong> o <strong>Administrador 2</strong>).
            </p>
          </div>
        </div>
      )}

      {/* Alerta si el rol no es Administrador */}
      {!esRolAdministrador && !esMismoUsuario && (
        <div className="warning-role-alert" role="alert">
          ℹ️ <strong>Permiso Insuficiente:</strong> Tu rol actual es <em>{usuarioActivo.rol}</em>. Solo un usuario con
          rol <strong>Administrador</strong> puede aprobar o desestimar propuestas de umbrales.
        </div>
      )}

      {/* Tabla comparativa: Versión Vigente vs. Propuesta en Borrador */}
      <div className="diff-comparison-table-wrapper">
        <h4 className="section-title">Auditoría Comparativa de Parámetros</h4>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Parámetro Normativo</th>
              <th>Versión Vigente (v{vigente.version})</th>
              <th>Propuesta en Revisión (v{borradorActivo.version})</th>
              <th>Variación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Umbral Aprobación Automática</td>
              <td>{vigente.umbralAprobacion?.toFixed(1) ?? '90.0'}</td>
              <td><strong>{borradorActivo.umbralAprobacion?.toFixed(1) ?? '—'}</strong></td>
              <td>
                <span className={borradorActivo.umbralAprobacion !== vigente.umbralAprobacion ? 'diff-changed' : 'diff-equal'}>
                  {(borradorActivo.umbralAprobacion ?? 0) - (vigente.umbralAprobacion ?? 0) > 0 ? '+' : ''}
                  {((borradorActivo.umbralAprobacion ?? 0) - (vigente.umbralAprobacion ?? 0)).toFixed(1)}
                </span>
              </td>
            </tr>
            <tr>
              <td>Umbral de Riesgo Alto</td>
              <td>{vigente.umbralRiesgoAlto?.toFixed(1) ?? '60.0'}</td>
              <td><strong>{borradorActivo.umbralRiesgoAlto?.toFixed(1) ?? '—'}</strong></td>
              <td>
                <span className={borradorActivo.umbralRiesgoAlto !== vigente.umbralRiesgoAlto ? 'diff-changed' : 'diff-equal'}>
                  {(borradorActivo.umbralRiesgoAlto ?? 0) - (vigente.umbralRiesgoAlto ?? 0) > 0 ? '+' : ''}
                  {((borradorActivo.umbralRiesgoAlto ?? 0) - (vigente.umbralRiesgoAlto ?? 0)).toFixed(1)}
                </span>
              </td>
            </tr>
            <tr>
              <td>Mínimo Autenticidad</td>
              <td>{vigente.minimoAutenticidad?.toFixed(1) ?? '70.0'}</td>
              <td><strong>{borradorActivo.minimoAutenticidad?.toFixed(1) ?? '—'}</strong></td>
              <td>
                <span className={borradorActivo.minimoAutenticidad !== vigente.minimoAutenticidad ? 'diff-changed' : 'diff-equal'}>
                  {((borradorActivo.minimoAutenticidad ?? 0) - (vigente.minimoAutenticidad ?? 0)).toFixed(1)}
                </span>
              </td>
            </tr>
            <tr>
              <td>Mínimo Cruce Fuentes</td>
              <td>{vigente.minimoCruceFuentes?.toFixed(1) ?? '70.0'}</td>
              <td><strong>{borradorActivo.minimoCruceFuentes?.toFixed(1) ?? '—'}</strong></td>
              <td>
                <span className={borradorActivo.minimoCruceFuentes !== vigente.minimoCruceFuentes ? 'diff-changed' : 'diff-equal'}>
                  {((borradorActivo.minimoCruceFuentes ?? 0) - (vigente.minimoCruceFuentes ?? 0)).toFixed(1)}
                </span>
              </td>
            </tr>
            <tr>
              <td>Mínimo Coherencia</td>
              <td>{vigente.minimoCoherencia?.toFixed(1) ?? '60.0'}</td>
              <td><strong>{borradorActivo.minimoCoherencia?.toFixed(1) ?? '—'}</strong></td>
              <td>
                <span className={borradorActivo.minimoCoherencia !== vigente.minimoCoherencia ? 'diff-changed' : 'diff-equal'}>
                  {((borradorActivo.minimoCoherencia ?? 0) - (vigente.minimoCoherencia ?? 0)).toFixed(1)}
                </span>
              </td>
            </tr>
            <tr>
              <td>Ponderaciones (Aut / Cruce / Coh)</td>
              <td>
                {vigente.pesoAutenticidad?.toFixed(2) ?? '0.40'} / {vigente.pesoCruceFuentes?.toFixed(2) ?? '0.40'} / {vigente.pesoCoherencia?.toFixed(2) ?? '0.20'}
              </td>
              <td>
                <strong>
                  {borradorActivo.pesoAutenticidad?.toFixed(2) ?? '—'} / {borradorActivo.pesoCruceFuentes?.toFixed(2) ?? '—'} / {borradorActivo.pesoCoherencia?.toFixed(2) ?? '—'}
                </strong>
              </td>
              <td>
                <span className="diff-equal">
                  Suma: {((borradorActivo.pesoAutenticidad ?? 0) + (borradorActivo.pesoCruceFuentes ?? 0) + (borradorActivo.pesoCoherencia ?? 0)).toFixed(2)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Botonera de Doble Aprobación y Resolución */}
      <div className="review-actions-bar">
        <button
          type="button"
          id="btn-aprobar-propuesta"
          className="btn btn-primary"
          onClick={handleAprobar}
          disabled={!puedeResolver}
          title={
            esMismoUsuario
              ? 'Acción bloqueada: quien propone no puede auto-aprobar'
              : !esRolAdministrador
              ? 'Solo usuarios con rol Administrador pueden aprobar'
              : 'Aprobar formalmente y promover a versión vigente'
          }
        >
          {procesando ? (
            <>
              <span className="btn-spinner" aria-hidden="true" /> Procesando resolución...
            </>
          ) : (
            <>✅ Aprobar Propuesta (Entrada en Vigencia)</>
          )}
        </button>

        <button
          type="button"
          id="btn-desestimar-propuesta"
          className="btn btn-danger"
          onClick={handleDesestimar}
          disabled={!puedeResolver}
          title={
            esMismoUsuario
              ? 'Acción bloqueada: quien propone no puede desestimar su propuesta'
              : !esRolAdministrador
              ? 'Solo usuarios con rol Administrador pueden desestimar'
              : 'Desestimar borrador conservando su correlativo inmutable'
          }
        >
          ❌ Desestimar Propuesta
        </button>
      </div>
    </div>
  );
};

export default BandejaRevision;

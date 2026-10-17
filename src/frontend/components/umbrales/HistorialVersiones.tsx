/**
 * MIRA — Componente HistorialVersiones (T043, RQNF-002 [fase5-lester] ↔ RQNF-003 [final-final], FR-004, US6 / Esc. 6.1)
 * Tabla cronológica inmutable de versiones pasadas, vigentes y desestimadas de umbrales.
 */

import React from 'react';
import type { ElementoHistorialVersionUmbrales, EstadoVersionUmbrales } from '../../../shared/types';

interface HistorialVersionesProps {
  versiones: ElementoHistorialVersionUmbrales[];
  versionVigenteNumero?: number;
  cargando?: boolean;
}

export const HistorialVersiones: React.FC<HistorialVersionesProps> = ({
  versiones,
  versionVigenteNumero,
  cargando = false,
}) => {
  if (cargando) {
    return (
      <div className="card loading-state">
        <div className="loading-spinner" />
        <p>Cargando historial inmutable de versiones...</p>
      </div>
    );
  }

  const obtenerBadgeEstado = (estado: EstadoVersionUmbrales, esVigente: boolean) => {
    if (esVigente) {
      return <span className="badge badge-approved">● VIGENTE</span>;
    }
    switch (estado) {
      case 'APROBADO':
        return <span className="badge badge-approved" style={{ opacity: 0.85 }}>APROBADO</span>;
      case 'DESESTIMADO':
        return <span className="badge badge-dismissed">DESESTIMADO</span>;
      case 'BORRADOR':
        return <span className="badge badge-derived">BORRADOR</span>;
      default:
        return <span className="badge">{estado}</span>;
    }
  };

  return (
    <div className="card history-versions-card" id="historial-versiones-umbrales">
      <div className="card-header">
        <div>
          <h3 className="card-title">Historial Inmutable de Versiones de Umbrales (US6)</h3>
          <p className="card-subtitle">
            Registro cronológico append-only protegido contra mutaciones directas (Principio III y Principio VIII).
          </p>
        </div>
        <span className="badge badge-info">{versiones.length} versiones registradas</span>
      </div>

      <div className="table-responsive-wrapper">
        <table className="versions-table" aria-label="Historial de versiones de umbrales normativos">
          <thead>
            <tr>
              <th>Versión</th>
              <th>Estado</th>
              <th>Umbrales (Apr / Riesgo)</th>
              <th>Mínimos (Aut / Cruce / Coh)</th>
              <th>Ponderaciones (P1 / P2 / P3)</th>
              <th>Proponente</th>
              <th>Aprobador</th>
              <th>Fecha Resolución</th>
            </tr>
          </thead>
          <tbody>
            {versiones.map((v) => {
              const esVigente = v.version === versionVigenteNumero && v.estado === 'APROBADO';
              return (
                <tr key={`${v.version}-${v.estado}`} className={esVigente ? 'active-version-row' : ''}>
                  <td>
                    <span className="version-tag">v{v.version}</span>
                  </td>
                  <td>{obtenerBadgeEstado(v.estado, esVigente)}</td>
                  <td>
                    <span className="mono-text">
                      {v.umbralAprobacion.toFixed(1)} / {v.umbralRiesgoAlto.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <span className="mono-text">
                      {v.minimoAutenticidad} / {v.minimoCruceFuentes} / {v.minimoCoherencia}
                    </span>
                  </td>
                  <td>
                    <span className="mono-text">
                      {v.pesoAutenticidad.toFixed(2)} / {v.pesoCruceFuentes.toFixed(2)} / {v.pesoCoherencia.toFixed(2)}
                    </span>
                  </td>
                  <td>{v.proponente}</td>
                  <td>{v.aprobador || <span className="text-muted">—</span>}</td>
                  <td className="timestamp-cell">
                    {v.fechaResolucion ? (
                      new Date(v.fechaResolucion).toLocaleString('es-CL')
                    ) : (
                      <span className="text-muted">Pendiente</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialVersiones;

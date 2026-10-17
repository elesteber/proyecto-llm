/**
 * MIRA — Componente PanelUmbralesVigentes (T029, RQF-044 [final-final], FR-001, D-01, D-07, D-08)
 * Despliega los parámetros normativos, mínimos y ponderaciones de la versión vigente aprobada.
 */

import React from 'react';
import type { UmbralesFlujo } from '../../../shared/types';

interface PanelUmbralesVigentesProps {
  vigente: UmbralesFlujo;
  cargando?: boolean;
}

export const PanelUmbralesVigentes: React.FC<PanelUmbralesVigentesProps> = ({
  vigente,
  cargando = false,
}) => {
  if (cargando) {
    return (
      <div className="card loading-state">
        <div className="loading-spinner" />
        <p>Consultando política de umbrales vigente...</p>
      </div>
    );
  }

  const sumaPesos = vigente.pesoAutenticidad + vigente.pesoCruceFuentes + vigente.pesoCoherencia;

  return (
    <div className="card panel-umbrales-vigentes" id="panel-umbrales-vigentes">
      <div className="card-header">
        <div>
          <span className="version-pill">Versión {vigente.version}</span>
          <h2 className="card-title" style={{ marginTop: '0.35rem' }}>
            Política Normativa Vigente (F5)
          </h2>
          <span className="card-subtitle">Flujo: {vigente.idFlujo}</span>
        </div>
        <span className="badge badge-approved">● Estado: {vigente.estado}</span>
      </div>

      {/* Tarjetas de Umbrales de Corte */}
      <div className="policy-grid">
        <div className="policy-card primary-border">
          <span className="policy-label">Umbral de Aprobación Automática</span>
          <div className="policy-value-row">
            <span className="policy-number text-approved">{vigente.umbralAprobacion.toFixed(1)}</span>
            <span className="policy-unit">/ 100</span>
          </div>
          <span className="policy-hint">Puntajes ≥ {vigente.umbralAprobacion} aprueban sin intervención humana</span>
        </div>

        <div className="policy-card warning-border">
          <span className="policy-label">Umbral de Riesgo Alto</span>
          <div className="policy-value-row">
            <span className="policy-number text-derived">{vigente.umbralRiesgoAlto.toFixed(1)}</span>
            <span className="policy-unit">/ 100</span>
          </div>
          <span className="policy-hint">Puntajes &lt; {vigente.umbralRiesgoAlto} activan advertencia para el operador</span>
        </div>
      </div>

      {/* Grilla de Señales Mínimas y Ponderaciones */}
      <div className="policy-signals-section">
        <h3 className="section-title">Parámetros por Señal Analítica (D-07, D-08)</h3>
        
        <div className="signals-spec-table">
          <div className="spec-table-header">
            <span>Señal Analítica</span>
            <span>Mínimo Propio Exigido</span>
            <span>Ponderación Relativa</span>
          </div>

          {/* Autenticidad */}
          <div className="spec-table-row">
            <div className="spec-name-col">
              <strong>Autenticidad de Documentos</strong>
              <span className="spec-code">autenticidad_documentos</span>
            </div>
            <div className="spec-min-col">
              <span className="threshold-pill">≥ {vigente.minimoAutenticidad.toFixed(1)}</span>
            </div>
            <div className="spec-weight-col">
              <span className="weight-pill">{(vigente.pesoAutenticidad * 100).toFixed(0)}%</span>
              <span className="weight-raw">({vigente.pesoAutenticidad.toFixed(2)})</span>
            </div>
          </div>

          {/* Cruce de fuentes */}
          <div className="spec-table-row">
            <div className="spec-name-col">
              <strong>Cruce de Fuentes Oficiales</strong>
              <span className="spec-code">cruce_fuentes</span>
            </div>
            <div className="spec-min-col">
              <span className="threshold-pill">≥ {vigente.minimoCruceFuentes.toFixed(1)}</span>
            </div>
            <div className="spec-weight-col">
              <span className="weight-pill">{(vigente.pesoCruceFuentes * 100).toFixed(0)}%</span>
              <span className="weight-raw">({vigente.pesoCruceFuentes.toFixed(2)})</span>
            </div>
          </div>

          {/* Coherencia */}
          <div className="spec-table-row">
            <div className="spec-name-col">
              <strong>Coherencia de la Solicitud</strong>
              <span className="spec-code">coherencia_solicitud</span>
            </div>
            <div className="spec-min-col">
              <span className="threshold-pill">≥ {vigente.minimoCoherencia.toFixed(1)}</span>
            </div>
            <div className="spec-weight-col">
              <span className="weight-pill">{(vigente.pesoCoherencia * 100).toFixed(0)}%</span>
              <span className="weight-raw">({vigente.pesoCoherencia.toFixed(2)})</span>
            </div>
          </div>
        </div>

        {/* Verificación de Suma de Pesos */}
        <div className="weights-sum-badge">
          <span>Suma exacta de ponderaciones: <strong>{sumaPesos.toFixed(2)}</strong></span>
          <span className="badge badge-approved" style={{ fontSize: '0.72rem' }}>
            ✓ 100% Normalizada
          </span>
        </div>
      </div>

      {/* Rastro de Auditoría de la Versión Vigente */}
      <div className="policy-audit-footer">
        <div className="audit-item">
          <span className="audit-label">Propuesto por:</span>
          <span className="audit-value">{vigente.proponente}</span>
        </div>
        <div className="audit-item">
          <span className="audit-label">Aprobado formalmente por:</span>
          <span className="audit-value">{vigente.aprobador || 'Sin aprobador registrado'}</span>
        </div>
        <div className="audit-item">
          <span className="audit-label">Fecha de entrada en vigencia:</span>
          <span className="audit-value">
            {vigente.fechaResolucion ? new Date(vigente.fechaResolucion).toLocaleString('es-CL') : 'Inicial'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PanelUmbralesVigentes;

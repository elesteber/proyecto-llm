/**
 * MIRA — Componente FormularioEvaluacion (T019, RQF-040 [fase5-lester], FR-006, AC-1)
 * Panel de control y disparo de la evaluación determinista F4 sobre el expediente seleccionado.
 */

import React from 'react';
import type { CasoPrueba } from '../../../shared/types';

interface FormularioEvaluacionProps {
  caso: CasoPrueba | null;
  evaluando: boolean;
  onEjecutarEvaluacion: () => void;
  onLimpiar?: () => void;
  error?: string | null;
}

export const FormularioEvaluacion: React.FC<FormularioEvaluacionProps> = ({
  caso,
  evaluando,
  onEjecutarEvaluacion,
  onLimpiar,
  error,
}) => {
  if (!caso) {
    return (
      <div className="card evaluation-form-card empty">
        <p className="no-case-selected-msg">
          👈 Seleccione un expediente del catálogo lateral para preparar la evaluación.
        </p>
      </div>
    );
  }

  const { senales } = caso;

  return (
    <div className="card evaluation-form-card" id="formulario-evaluacion-caso">
      <div className="card-header">
        <div>
          <span className="case-id-badge">{caso.idCaso}</span>
          <h3 className="card-title" style={{ marginTop: '0.25rem' }}>
            Expediente Preparado para Evaluación
          </h3>
        </div>
        <span className="badge badge-info">F4 Motor Listo</span>
      </div>

      <div className="case-overview">
        <p className="case-prestacion-text">
          <strong>Prestación Médica:</strong> {caso.prestacion || 'Consulta / Reembolso Médico'}
        </p>

        {/* Resumen de Señales de Insumo */}
        <div className="input-signals-grid">
          <div className="input-signal-item">
            <span className="signal-label">Autenticidad</span>
            <span className="signal-score">{senales.autenticidad_documentos} / 100</span>
            <span className="signal-threshold">Mínimo: 70</span>
          </div>

          <div className="input-signal-item">
            <span className="signal-label">Cruce Fuentes</span>
            <span className="signal-score">{senales.cruce_fuentes} / 100</span>
            <span className="signal-threshold">Mínimo: 70</span>
          </div>

          <div className="input-signal-item">
            <span className="signal-label">Coherencia</span>
            <span className="signal-score">{senales.coherencia_solicitud} / 100</span>
            <span className="signal-threshold">Mínimo: 60</span>
          </div>

          <div className="input-signal-item">
            <span className="signal-label">Alerta Fraude</span>
            <span
              className={`signal-fraud-status ${
                senales.alertaFraudeActiva ? 'fraud-active' : 'fraud-inactive'
              }`}
            >
              {senales.alertaFraudeActiva ? '🚨 Activa' : '✓ Inactiva'}
            </span>
            <span className="signal-threshold">Precedencia Absoluta</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="eval-error-message" role="alert">
          ❌ {error}
        </div>
      )}

      {/* Botonera de Acción */}
      <div className="form-actions-bar">
        <button
          type="button"
          id="btn-ejecutar-evaluacion"
          className="btn btn-primary btn-lg"
          onClick={onEjecutarEvaluacion}
          disabled={evaluando}
        >
          {evaluando ? (
            <>
              <span className="btn-spinner" aria-hidden="true" /> Evaluando expediente...
            </>
          ) : (
            <>⚡ Ejecutar Evaluación Determinista (F4)</>
          )}
        </button>

        {onLimpiar && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onLimpiar}
            disabled={evaluando}
          >
            Limpiar Resultado
          </button>
        )}
      </div>
    </div>
  );
};

export default FormularioEvaluacion;

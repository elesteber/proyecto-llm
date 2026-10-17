/**
 * MIRA — Componente VistaResultado (T013, FR-007, FR-008, AC-1..AC-6, Principio I, Principio II)
 * Despliega el dictamen determinista de evaluación emitido por el motor F4:
 * badge resolutivo exclusivo (APROBADO_AUTOMATICO o DERIVADO_REVISION),
 * motivo técnico estructurado, desglose analítico de señales y advertencia de riesgo alto.
 */

import React from 'react';
import type { RespuestaEvaluarCaso, MotivoDecision } from '../../../shared/types';
import { AlertaRiesgoAlto } from './AlertaRiesgoAlto';

interface VistaResultadoProps {
  resultado: RespuestaEvaluarCaso | null;
  cargando?: boolean;
}

export const VistaResultado: React.FC<VistaResultadoProps> = ({ resultado, cargando }) => {
  if (cargando) {
    return (
      <div className="card result-card loading-state">
        <div className="loading-spinner" />
        <p>Ejecutando evaluación determinista y verificando reglas de negocio...</p>
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="card result-card empty-state">
        <div className="empty-state-icon">⚖️</div>
        <h3 className="empty-state-title">Dictamen de Evaluación</h3>
        <p className="empty-state-desc">
          Seleccione un expediente del catálogo y presione <strong>&ldquo;Ejecutar Evaluación Determinista&rdquo;</strong> para
          obtener la resolución normativa y el desglose de componentes analíticos.
        </p>
      </div>
    );
  }

  // Traducción y descripción del motivo técnico según precedencia estricta (Principio II)
  const formatearMotivo = (motivo: MotivoDecision): { etiqueta: string; descripcion: string } => {
    switch (motivo) {
      case 'aprobado':
        return {
          etiqueta: 'Aprobación Normativa',
          descripcion: 'El expediente iguala o supera el umbral de aprobación sin alertas ni caídas bajo mínimos.',
        };
      case 'alerta_fraude':
        return {
          etiqueta: 'Precedencia de Fraude',
          descripcion: 'Alerta de fraude documental activa. Derivación obligatoria con máxima prioridad independientemente del puntaje.',
        };
      case 'senal_bajo_minimo':
        return {
          etiqueta: 'Señal Bajo Mínimo Propio',
          descripcion: 'Al menos una señal analítica no alcanza su umbral mínimo propio de corte.',
        };
      case 'puntaje_bajo_umbral':
        return {
          etiqueta: 'Puntaje en Rango Intermedio',
          descripcion: 'Puntaje global inferior al umbral de corte para aprobación automática (60 ≤ score < 90).',
        };
      default:
        return {
          etiqueta: motivo,
          descripcion: 'Causa técnica de resolución.',
        };
    }
  };

  const formatearNombreSenal = (senal: string): string => {
    switch (senal) {
      case 'autenticidad_documentos':
        return 'Autenticidad de Documentos';
      case 'cruce_fuentes':
        return 'Cruce de Fuentes Oficiales';
      case 'coherencia_solicitud':
        return 'Coherencia de la Solicitud';
      default:
        return senal;
    }
  };

  const motivoInfo = formatearMotivo(resultado.motivo);
  const esAprobado = resultado.decision === 'APROBADO_AUTOMATICO';

  return (
    <div className="card result-card animate-fade-in" id="vista-resultado-evaluacion">
      <div className="card-header">
        <div>
          <span className="case-id-badge">{resultado.idCaso}</span>
          <h2 className="card-title" style={{ marginTop: '0.35rem' }}>
            Dictamen del Motor de Decisión (F4)
          </h2>
        </div>
        {/* Badge Resolutivo Exclusivo: Jamás es "Rechazado" (Principio I) */}
        <span
          className={`badge ${esAprobado ? 'badge-approved' : 'badge-derived'}`}
          id="badge-decision-resolutiva"
        >
          {esAprobado ? '✓ APROBADO_AUTOMATICO' : '⚠ DERIVADO_REVISION'}
        </span>
      </div>

      {/* Puntaje Global Ponderado */}
      <div className="score-hero-container">
        <div className="score-display">
          <span className="score-number">{resultado.scoreVisual}</span>
          <span className="score-total">/ 100</span>
        </div>
        <div className="score-explanation">
          <div className="motivo-label">
            Motivo Técnico: <strong>{motivoInfo.etiqueta}</strong>
          </div>
          <p className="motivo-desc">{motivoInfo.descripcion}</p>
        </div>
      </div>

      {/* Advertencia Informativa de Riesgo Alto (Principio I) */}
      {resultado.riesgoAltoRechazo && (
        <AlertaRiesgoAlto
          activa={true}
          conteoSenalesBajoMinimo={resultado.senalesBajoMinimo.length}
          scoreGlobal={resultado.scoreGlobal}
        />
      )}

      {/* Señales que no alcanzaron su mínimo propio */}
      {resultado.senalesBajoMinimo && resultado.senalesBajoMinimo.length > 0 && (
        <div className="warning-signals-box">
          <h4 className="warning-signals-title">Señales analíticas bajo umbral normativo mínimo:</h4>
          <div className="warning-signals-list">
            {resultado.senalesBajoMinimo.map((s) => (
              <span key={s} className="warning-signal-chip">
                ⚠️ {formatearNombreSenal(s)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Desglose Numérico Puntual de las 3 Señales Analíticas */}
      <div className="signals-breakdown-section">
        <h4 className="section-title">Desglose Analítico por Componente</h4>
        <div className="signal-bars-container">
          {/* Autenticidad */}
          <div className="signal-bar-item">
            <div className="signal-bar-header">
              <span className="signal-name">Autenticidad Documental (Peso: 40%)</span>
              <span className="signal-value">{resultado.desgloseComponentes.autenticidad} / 100</span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${
                  resultado.desgloseComponentes.autenticidad < 70 ? 'fill-warning' : 'fill-good'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, resultado.desgloseComponentes.autenticidad))}%` }}
              />
            </div>
          </div>

          {/* Cruce de fuentes */}
          <div className="signal-bar-item">
            <div className="signal-bar-header">
              <span className="signal-name">Cruce de Fuentes (Peso: 40%)</span>
              <span className="signal-value">{resultado.desgloseComponentes.cruceFuentes} / 100</span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${
                  resultado.desgloseComponentes.cruceFuentes < 70 ? 'fill-warning' : 'fill-good'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, resultado.desgloseComponentes.cruceFuentes))}%` }}
              />
            </div>
          </div>

          {/* Coherencia */}
          <div className="signal-bar-item">
            <div className="signal-bar-header">
              <span className="signal-name">Coherencia de la Solicitud (Peso: 20%)</span>
              <span className="signal-value">{resultado.desgloseComponentes.coherencia} / 100</span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${
                  resultado.desgloseComponentes.coherencia < 60 ? 'fill-warning' : 'fill-good'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, resultado.desgloseComponentes.coherencia))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje Estructurado para el Operador */}
      {resultado.mensajeOperador && (
        <div className="operator-message-box">
          <span className="operator-message-title">Instrucción para la Bandeja del Operador:</span>
          <p className="operator-message-content">{resultado.mensajeOperador}</p>
        </div>
      )}

      {/* Metadatos de Auditoría e Inmutabilidad */}
      <div className="result-metadata">
        <span>Versión de umbrales aplicada: <strong>v{resultado.versionUmbralesAplicada}</strong></span>
        <span>Timestamp: <strong>{new Date(resultado.timestamp).toLocaleString('es-CL')}</strong></span>
      </div>
    </div>
  );
};

export default VistaResultado;

/**
 * MIRA — Componente AlertaRiesgoAlto (Principio I, RN-01, SC-002, AC-4, AC-6)
 * Tarjeta de advertencia informativa para el operador humano ante expedientes
 * con puntaje crítico (< 60) o al menos dos señales analíticas bajo su mínimo individual.
 * 
 * REGLA INNEGOCIABLE (Constitución MIRA Principio I):
 * Jamás muestra una resolución de 'rechazado' o 'rechazo automático'.
 * La decisión del sistema permanece inalterablemente como DERIVADO_REVISION.
 * Texto exacto obligatorio: "Riesgo alto de rechazo: decide un operador".
 */

import React from 'react';

interface AlertaRiesgoAltoProps {
  /**
   * Indica si la alerta debe desplegarse
   */
  activa: boolean;
  /**
   * Conteo opcional de señales que cayeron bajo el mínimo
   */
  conteoSenalesBajoMinimo?: number;
  /**
   * Puntaje global obtenido por el expediente
   */
  scoreGlobal?: number;
}

export const AlertaRiesgoAlto: React.FC<AlertaRiesgoAltoProps> = ({
  activa,
  conteoSenalesBajoMinimo = 0,
  scoreGlobal,
}) => {
  if (!activa) {
    return null;
  }

  return (
    <div
      className="alert-high-risk"
      role="alert"
      aria-live="assertive"
      id="alerta-riesgo-alto-rechazo"
    >
      <div className="alert-high-risk-icon" aria-hidden="true">
        ⚠️
      </div>
      <div className="alert-high-risk-body">
        {/* TEXTO EXACTO OBLIGATORIO SEGÚN PRINCIPIO I Y RN-01 */}
        <h4 className="alert-high-risk-title">
          Riesgo alto de rechazo: decide un operador
        </h4>
        <p className="alert-high-risk-desc">
          Este expediente presenta indicadores de riesgo crítico{' '}
          {scoreGlobal !== undefined && scoreGlobal < 60 && (
            <span>(Puntaje global: <strong>{scoreGlobal.toFixed(1)} &lt; 60.0</strong>)</span>
          )}
          {conteoSenalesBajoMinimo >= 2 && (
            <span> y <strong>{conteoSenalesBajoMinimo} señales analíticas bajo su mínimo normativo</strong></span>
          )}.
        </p>
        <p className="alert-high-risk-normativa">
          <strong>Mandato Constitucional (Principio I):</strong> El sistema MIRA nunca rechaza automáticamente
          ningún expediente. La resolución resolutiva final corresponde exclusivamente a la intervención humana
          calificada del operador.
        </p>
      </div>
    </div>
  );
};

export default AlertaRiesgoAlto;

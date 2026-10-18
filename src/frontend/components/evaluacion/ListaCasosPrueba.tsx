/**
 * MIRA — Componente ListaCasosPrueba (T018, RQF-040 [fase5-lester], AC-1..AC-6, D-02)
 * Catálogo visual de expedientes sintéticos preconfigurados de reembolso médico.
 * Permite al operador explorar casos tipo y seleccionar uno para evaluación interactiva.
 */

import React from 'react';
import type { CasoPrueba } from '../../../shared/types';

interface ListaCasosPruebaProps {
  casos: CasoPrueba[];
  casoSeleccionadoId?: string;
  onSeleccionarCaso: (idCaso: string) => void;
  deshabilitado?: boolean;
}

export const ListaCasosPrueba: React.FC<ListaCasosPruebaProps> = ({
  casos,
  casoSeleccionadoId,
  onSeleccionarCaso,
  deshabilitado = false,
}) => {
  return (
    <div className="cases-catalog-container" id="catalogo-casos-prueba">
      <div className="catalog-header">
        <h3 className="catalog-title">Catálogo de Casos Sintéticos (D-02)</h3>
        <span className="catalog-count">{casos.length} expedientes disponibles</span>
      </div>

      <div className="cases-list" role="radiogroup" aria-label="Catálogo de expedientes médicos sintéticos">
        {casos.map((caso) => {
          const seleccionado = caso.idCaso === casoSeleccionadoId;
          const { senales } = caso;

          return (
            <div
              key={caso.idCaso}
              role="radio"
              aria-checked={seleccionado}
              tabIndex={0}
              className={`case-item-card ${seleccionado ? 'selected' : ''} ${
                deshabilitado ? 'disabled' : ''
              }`}
              onClick={() => !deshabilitado && onSeleccionarCaso(caso.idCaso)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !deshabilitado) {
                  e.preventDefault();
                  onSeleccionarCaso(caso.idCaso);
                }
              }}
            >
              <div className="case-item-header">
                <span className="case-item-id">{caso.idCaso}</span>
                {senales.alertaFraudeActiva && (
                  <span className="badge-fraud-warning" title="Alerta de fraude activa en expediente">
                    🚨 Sospecha Fraude
                  </span>
                )}
                {seleccionado && <span className="selected-indicator">● Activo</span>}
              </div>

              <p className="case-item-desc">{caso.prestacion || 'Reembolso médico general'}</p>

              {/* Indicadores numéricos resumidos de señales */}
              <div className="case-signals-chips">
                <span
                  className={`signal-mini-chip ${
                    senales.autenticidad_documentos < 70 ? 'chip-below' : 'chip-ok'
                  }`}
                  title="Autenticidad Documental (Mínimo normativo: 70)"
                >
                  Aut: {senales.autenticidad_documentos}
                </span>
                <span
                  className={`signal-mini-chip ${
                    senales.cruce_fuentes < 70 ? 'chip-below' : 'chip-ok'
                  }`}
                  title="Cruce de Fuentes (Mínimo normativo: 70)"
                >
                  Cruce: {senales.cruce_fuentes}
                </span>
                <span
                  className={`signal-mini-chip ${
                    senales.coherencia_solicitud < 60 ? 'chip-below' : 'chip-ok'
                  }`}
                  title="Coherencia Solicitud (Mínimo normativo: 60)"
                >
                  Coh: {senales.coherencia_solicitud}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListaCasosPrueba;

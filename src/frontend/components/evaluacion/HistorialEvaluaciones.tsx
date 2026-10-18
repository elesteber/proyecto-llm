/**
 * MIRA — Componente HistorialEvaluaciones (T044, RQNF-002 [fase5-lester] ↔ RQNF-003 [final-final], FR-012, SC-004)
 * Vista de historial inmutable de dictámenes y reevaluación histórica determinista.
 *
 * Principio I (NO NEGOCIABLE):
 * Prohibición absoluta de rechazo automático. El sistema nunca emite la decisión 'rechazado'.
 * Únicos estados resolutivos válidos: APROBADO_AUTOMATICO y DERIVADO_REVISION.
 */

import React, { useEffect, useState } from 'react';
import type {
  ElementoHistorialEvaluacion,
  ResultadoReevaluacionHistorica,
  DecisionSistema,
  MotivoDecision,
} from '../../../shared/types';

export const HistorialEvaluaciones: React.FC = () => {
  const [evaluaciones, setEvaluaciones] = useState<ElementoHistorialEvaluacion[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtro de búsqueda por ID de caso o evaluación
  const [filtroTexto, setFiltroTexto] = useState<string>('');

  // Estados de reevaluación por idEvaluacion
  const [reevaluandoId, setReevaluandoId] = useState<string | null>(null);
  const [resultadosReevaluacion, setResultadosReevaluacion] = useState<
    Record<string, ResultadoReevaluacionHistorica>
  >({});
  const [erroresReevaluacion, setErroresReevaluacion] = useState<Record<string, string>>({});

  const cargarHistorial = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch('/api/evaluacion/historial', {
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const items: ElementoHistorialEvaluacion[] = Array.isArray(data)
        ? data
        : data?.evaluaciones || [];
      setEvaluaciones(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al consultar el historial de evaluaciones');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const ejecutarReevaluacion = async (idEvaluacion: string) => {
    setReevaluandoId(idEvaluacion);
    setErroresReevaluacion((prev) => {
      const copia = { ...prev };
      delete copia[idEvaluacion];
      return copia;
    });

    try {
      const response = await fetch('/api/evaluacion/reevaluar-historico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ idEvaluacion }),
      });

      if (!response.ok) {
        const errPayload = await response.json().catch(() => ({}));
        throw new Error(errPayload?.error || `Error ${response.status}: ${response.statusText}`);
      }

      const resultado: ResultadoReevaluacionHistorica = await response.json();
      setResultadosReevaluacion((prev) => ({
        ...prev,
        [idEvaluacion]: resultado,
      }));
    } catch (err) {
      setErroresReevaluacion((prev) => ({
        ...prev,
        [idEvaluacion]: err instanceof Error ? err.message : 'Error al reevaluar el caso histórico',
      }));
    } finally {
      setReevaluandoId(null);
    }
  };

  // Renderizado del badge de decisión cumpliendo estrictamente Principio I (sin palabra 'rechazado')
  const renderDecisionBadge = (decision: DecisionSistema) => {
    if (decision === 'APROBADO_AUTOMATICO') {
      return <span className="badge badge-approved">● APROBADO_AUTOMATICO</span>;
    }
    return <span className="badge badge-derived">⚠️ DERIVADO_REVISION</span>;
  };

  // Etiqueta legible para motivos de decisión estructurados
  const renderMotivoBadge = (motivo: MotivoDecision) => {
    switch (motivo) {
      case 'aprobado':
        return <span className="badge badge-info">Aprobado</span>;
      case 'alerta_fraude':
        return <span className="badge badge-high-risk">Alerta de Fraude</span>;
      case 'senal_bajo_minimo':
        return <span className="badge badge-derived">Señal bajo mínimo</span>;
      case 'puntaje_bajo_umbral':
        return <span className="badge badge-derived">Puntaje bajo umbral</span>;
      default:
        return <span className="badge">{motivo}</span>;
    }
  };

  const evaluacionesFiltradas = evaluaciones.filter((ev) => {
    if (!filtroTexto.trim()) return true;
    const query = filtroTexto.toLowerCase();
    return (
      ev.idCaso.toLowerCase().includes(query) ||
      ev.idEvaluacion.toLowerCase().includes(query) ||
      ev.usuarioOperador.toLowerCase().includes(query) ||
      ev.decision.toLowerCase().includes(query)
    );
  });

  return (
    <div className="card history-evaluations-card" id="historial-evaluaciones-f4">
      <div className="card-header">
        <div>
          <h2 className="card-title">Historial Inmutable de Dictámenes y Reproducibilidad (US6 / F4)</h2>
          <p className="card-subtitle">
            Auditoría de dictámenes emitidos por el motor de evaluación determinista contra versiones archivadas de umbrales (Principio I, Principio II y Principio VIII).
          </p>
        </div>
        <button
          type="button"
          onClick={cargarHistorial}
          className="btn btn-secondary"
          disabled={cargando}
          title="Actualizar registros desde el backend"
        >
          {cargando ? 'Cargando...' : '🔄 Actualizar Historial'}
        </button>
      </div>

      {/* Barra de herramientas y filtros */}
      <div className="history-toolbar">
        <div className="search-box">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="Filtrar por ID de caso, evaluación u operador..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            aria-label="Filtrar historial de evaluaciones"
          />
        </div>
        <span className="badge badge-info">
          {evaluacionesFiltradas.length} de {evaluaciones.length} evaluaciones
        </span>
      </div>

      {/* Manejo de estado de carga */}
      {cargando && evaluaciones.length === 0 && (
        <div className="loading-state" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div className="loading-spinner" />
          <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
            Consultando rastro inmutable de evaluaciones en SQLite...
          </p>
        </div>
      )}

      {/* Manejo de error de carga */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1rem',
            color: '#fca5a5',
          }}
        >
          ⚠️ <strong>Error al cargar historial:</strong> {error}
        </div>
      )}

      {/* Estado vacío */}
      {!cargando && evaluaciones.length === 0 && !error && (
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
          <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
            No hay dictámenes registrados en el historial
          </h3>
          <p style={{ maxWidth: '520px', margin: '0 auto', fontSize: '0.875rem' }}>
            Ejecuta una evaluación desde la pestaña <strong>&ldquo;Evaluación de Casos (F4)&rdquo;</strong> para generar registros de auditoría persistentes y verificables.
          </p>
        </div>
      )}

      {/* Tabla responsiva de evaluaciones */}
      {!cargando && evaluacionesFiltradas.length > 0 && (
        <div className="table-responsive-wrapper">
          <table className="versions-table" aria-label="Historial de evaluaciones de casos médicos">
            <thead>
              <tr>
                <th>Caso</th>
                <th>Versión Umbrales</th>
                <th>Score Global</th>
                <th>Decisión (Principio I)</th>
                <th>Motivo Técnico</th>
                <th>Señales Insumo</th>
                <th>Operador</th>
                <th>Fecha y Hora</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {evaluacionesFiltradas.map((ev) => {
                const reevaluacionActual = resultadosReevaluacion[ev.idEvaluacion];
                const errorReevaluacion = erroresReevaluacion[ev.idEvaluacion];
                const estaReevaluando = reevaluandoId === ev.idEvaluacion;

                return (
                  <React.Fragment key={ev.idEvaluacion}>
                    <tr id={`fila-evaluacion-${ev.idEvaluacion}`}>
                      <td>
                        <strong className="mono-text" style={{ color: '#93c5fd' }}>
                          {ev.idCaso}
                        </strong>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-family-mono)' }}>
                          {ev.idEvaluacion.slice(0, 8)}...
                        </div>
                      </td>

                      <td>
                        <span className="version-tag">v{ev.versionUmbralesAplicada}</span>
                      </td>

                      <td>
                        <span className="mono-text" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          {ev.scoreGlobal.toFixed(1)}
                        </span>
                      </td>

                      <td>
                        <div>{renderDecisionBadge(ev.decision)}</div>
                        {ev.riesgoAltoRechazo && (
                          <div style={{ marginTop: '0.3rem' }}>
                            <span
                              className="badge badge-high-risk"
                              title="Riesgo alto de rechazo: decide un operador"
                              style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                            >
                              ⚠️ Riesgo alto (decide un operador)
                            </span>
                          </div>
                        )}
                      </td>

                      <td>{renderMotivoBadge(ev.motivo)}</td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span className="signal-pill">
                            Aut: {ev.senalesInsumo?.autenticidad_documentos ?? '—'} | Cruce:{' '}
                            {ev.senalesInsumo?.cruce_fuentes ?? '—'} | Coh:{' '}
                            {ev.senalesInsumo?.coherencia_solicitud ?? '—'}
                          </span>
                          {ev.senalesInsumo?.alertaFraudeActiva && (
                            <span className="badge badge-high-risk" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                              🚨 Fraude Activo
                            </span>
                          )}
                        </div>
                      </td>

                      <td style={{ fontSize: '0.8rem' }}>{ev.usuarioOperador}</td>

                      <td className="timestamp-cell">
                        {new Date(ev.timestamp).toLocaleString('es-CL', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          id={`btn-reevaluar-${ev.idEvaluacion}`}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => ejecutarReevaluacion(ev.idEvaluacion)}
                          disabled={estaReevaluando}
                          title="Reevaluar deterministamente contra la versión de umbrales original (SC-004)"
                        >
                          {estaReevaluando ? 'Reevaluando...' : '⚡ Reevaluar'}
                        </button>
                      </td>
                    </tr>

                    {/* Fila expandible con el resultado de la reevaluación determinista (SC-004) */}
                    {(reevaluacionActual || errorReevaluacion) && (
                      <tr>
                        <td colSpan={9} style={{ padding: '0.5rem 1rem 1rem 1rem', background: 'rgba(0, 0, 0, 0.25)' }}>
                          {errorReevaluacion && (
                            <div
                              style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                borderRadius: 'var(--radius-md)',
                                padding: '0.75rem 1rem',
                                color: '#fca5a5',
                                fontSize: '0.85rem',
                              }}
                            >
                              ❌ <strong>Error en reevaluación:</strong> {errorReevaluacion}
                            </div>
                          )}

                          {reevaluacionActual && (
                            <div
                              className="reevaluacion-box"
                              id={`resultado-reevaluacion-${ev.idEvaluacion}`}
                            >
                              <div className="reevaluacion-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <span style={{ fontSize: '1.1rem' }}>🔬</span>
                                  <strong>Resultado de Reevaluación Determinista (SC-004)</strong>
                                  <span className="badge badge-info">
                                    Versión Archivada Aplicada: v{reevaluacionActual.versionUmbralesAplicada}
                                  </span>
                                </div>

                                {reevaluacionActual.reproducibilidadDeterminista?.consistencia100Porciento ? (
                                  <span
                                    className="badge badge-approved"
                                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                                  >
                                    ✅ 100% Determinista (SC-004 Verificado)
                                  </span>
                                ) : (
                                  <span
                                    className="badge badge-high-risk"
                                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                                  >
                                    ⚠️ Discrepancia detectada
                                  </span>
                                )}
                              </div>

                              <div className="reevaluacion-grid">
                                <div className="reevaluacion-metric">
                                  <div className="reevaluacion-metric-label">Decisión Recomputada</div>
                                  <div className="reevaluacion-metric-val">
                                    {renderDecisionBadge(reevaluacionActual.resultadoReevaluacion.decision)}
                                  </div>
                                </div>

                                <div className="reevaluacion-metric">
                                  <div className="reevaluacion-metric-label">Puntaje Recomputado</div>
                                  <div className="reevaluacion-metric-val mono-text">
                                    {reevaluacionActual.resultadoReevaluacion.scoreGlobal.toFixed(1)} pts
                                  </div>
                                </div>

                                <div className="reevaluacion-metric">
                                  <div className="reevaluacion-metric-label">Motivo Recomputado</div>
                                  <div className="reevaluacion-metric-val">
                                    {renderMotivoBadge(reevaluacionActual.resultadoReevaluacion.motivo)}
                                  </div>
                                </div>

                                <div className="reevaluacion-metric">
                                  <div className="reevaluacion-metric-label">Consistencia Verificada</div>
                                  <div className="reevaluacion-metric-val" style={{ color: '#34d399', fontSize: '0.78rem' }}>
                                    ✓ Puntaje ({reevaluacionActual.reproducibilidadDeterminista.puntajeCoincide ? 'Idéntico' : 'Discrepante'})<br />
                                    ✓ Decisión ({reevaluacionActual.reproducibilidadDeterminista.decisionCoincide ? 'Idéntica' : 'Discrepante'})<br />
                                    ✓ Motivo ({reevaluacionActual.reproducibilidadDeterminista.motivoCoincide ? 'Idéntico' : 'Discrepante'})
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistorialEvaluaciones;

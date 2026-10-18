/**
 * MIRA — Componente FormularioPropuesta (T030, RQF-044 [final-final], RQF-039 [fase5-lester], FR-001, FR-003, US4)
 * Formulario interactivo para que el usuario con rol Diseñador proponga nuevos parámetros o edite el borrador activo.
 * 
 * REGLAS INNEGOCIABLES DE VALIDACIÓN:
 * 1. Suma exacta de ponderaciones = 1.00 (|pesoAut + pesoCruce + pesoCoh - 1.0| < 0.0001).
 *    Si no suma 1.00, se bloquea el botón de envío y se despliega una alerta explicativa.
 * 2. Consistencia de umbrales: umbralAprobacion > umbralRiesgoAlto (ej. 90 > 60).
 * 3. Rangos válidos: Todos los umbrales y mínimos en [0, 100].
 * 4. Segregación de roles: Solo usuarios con rol Diseñador pueden registrar borradores.
 */

import React, { useState, useEffect } from 'react';
import type { UmbralesFlujo, UsuarioActivo } from '../../../shared/types';

interface FormularioPropuestaProps {
  vigente: UmbralesFlujo;
  borradorActivo: UmbralesFlujo | null;
  usuarioActivo: UsuarioActivo;
  procesando: boolean;
  onCrearPropuesta: (datos: {
    umbralAprobacion: number;
    umbralRiesgoAlto: number;
    minimoAutenticidad: number;
    minimoCruceFuentes: number;
    minimoCoherencia: number;
    pesoAutenticidad: number;
    pesoCruceFuentes: number;
    pesoCoherencia: number;
    proponente: string;
  }) => Promise<boolean>;
  onModificarPropuesta?: (datos: Partial<UmbralesFlujo>) => Promise<boolean>;
}

export const FormularioPropuesta: React.FC<FormularioPropuestaProps> = ({
  vigente,
  borradorActivo,
  usuarioActivo,
  procesando,
  onCrearPropuesta,
}) => {
  // Valores iniciales basados en el borrador existente o la versión vigente
  const fuenteBase = borradorActivo || vigente;

  const [umbralAprobacion, setUmbralAprobacion] = useState<number>(fuenteBase.umbralAprobacion);
  const [umbralRiesgoAlto, setUmbralRiesgoAlto] = useState<number>(fuenteBase.umbralRiesgoAlto);

  const [minimoAutenticidad, setMinimoAutenticidad] = useState<number>(fuenteBase.minimoAutenticidad);
  const [minimoCruceFuentes, setMinimoCruceFuentes] = useState<number>(fuenteBase.minimoCruceFuentes);
  const [minimoCoherencia, setMinimoCoherencia] = useState<number>(fuenteBase.minimoCoherencia);

  const [pesoAutenticidad, setPesoAutenticidad] = useState<number>(fuenteBase.pesoAutenticidad);
  const [pesoCruceFuentes, setPesoCruceFuentes] = useState<number>(fuenteBase.pesoCruceFuentes);
  const [pesoCoherencia, setPesoCoherencia] = useState<number>(fuenteBase.pesoCoherencia);

  // Sincronizar si cambia el borrador activo o la versión vigente
  useEffect(() => {
    const f = borradorActivo || vigente;
    setUmbralAprobacion(f.umbralAprobacion);
    setUmbralRiesgoAlto(f.umbralRiesgoAlto);
    setMinimoAutenticidad(f.minimoAutenticidad);
    setMinimoCruceFuentes(f.minimoCruceFuentes);
    setMinimoCoherencia(f.minimoCoherencia);
    setPesoAutenticidad(f.pesoAutenticidad);
    setPesoCruceFuentes(f.pesoCruceFuentes);
    setPesoCoherencia(f.pesoCoherencia);
  }, [borradorActivo, vigente]);

  // Cálculo de suma de pesos con redondeo a 4 decimales
  const sumaPesos = Number((pesoAutenticidad + pesoCruceFuentes + pesoCoherencia).toFixed(4));
  const esSumaPesosValida = Math.abs(sumaPesos - 1.0) < 0.0001;

  // Validación de corte: umbralAprobacion > umbralRiesgoAlto
  const esCorteValido = umbralAprobacion > umbralRiesgoAlto;

  // Validación de límites [0, 100]
  const sonLimitesValidos =
    umbralAprobacion >= 0 &&
    umbralAprobacion <= 100 &&
    umbralRiesgoAlto >= 0 &&
    umbralRiesgoAlto <= 100 &&
    minimoAutenticidad >= 0 &&
    minimoAutenticidad <= 100 &&
    minimoCruceFuentes >= 0 &&
    minimoCruceFuentes <= 100 &&
    minimoCoherencia >= 0 &&
    minimoCoherencia <= 100;

  // Rol autorizado
  const esRolDiseñador = usuarioActivo.rol === 'Diseñador';

  // Formulario globalmente válido
  const esFormularioValido =
    esSumaPesosValida && esCorteValido && sonLimitesValidos && esRolDiseñador && !procesando;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!esFormularioValido) return;

    await onCrearPropuesta({
      umbralAprobacion,
      umbralRiesgoAlto,
      minimoAutenticidad,
      minimoCruceFuentes,
      minimoCoherencia,
      pesoAutenticidad,
      pesoCruceFuentes,
      pesoCoherencia,
      proponente: usuarioActivo.nombre,
    });
  };

  const handleRestablecer = () => {
    const f = borradorActivo || vigente;
    setUmbralAprobacion(f.umbralAprobacion);
    setUmbralRiesgoAlto(f.umbralRiesgoAlto);
    setMinimoAutenticidad(f.minimoAutenticidad);
    setMinimoCruceFuentes(f.minimoCruceFuentes);
    setMinimoCoherencia(f.minimoCoherencia);
    setPesoAutenticidad(f.pesoAutenticidad);
    setPesoCruceFuentes(f.pesoCruceFuentes);
    setPesoCoherencia(f.pesoCoherencia);
  };

  return (
    <div className="card proposal-form-card" id="formulario-propuesta-umbrales">
      <div className="card-header">
        <div>
          <span className="badge badge-info">
            {borradorActivo ? `Borrador Activo: Versión ${borradorActivo.version}` : 'Nueva Propuesta'}
          </span>
          <h3 className="card-title" style={{ marginTop: '0.35rem' }}>
            {borradorActivo ? 'Editar Propuesta de Umbrales en Borrador' : 'Proponer Modificación de Umbrales (BORRADOR)'}
          </h3>
        </div>
        <span className="card-subtitle">Autor actual: {usuarioActivo.nombre} ({usuarioActivo.rol})</span>
      </div>

      {/* Alerta si el rol no es Diseñador */}
      {!esRolDiseñador && (
        <div className="warning-role-alert" role="alert">
          ⛔ <strong>Rol no autorizado:</strong> Tu usuario activo actual es <em>{usuarioActivo.nombre}</em> con rol{' '}
          <strong>{usuarioActivo.rol}</strong>. Conforme al protocolo de doble control (D-04), únicamente usuarios con
          rol <strong>Diseñador</strong> pueden registrar o modificar propuestas en borrador. Conmute su identidad en la
          barra superior.
        </div>
      )}

      <form onSubmit={handleSubmit} className="proposal-form">
        {/* Sección 1: Umbrales de Corte Global */}
        <div className="form-section">
          <h4 className="form-section-title">1. Umbrales de Corte del Flujo</h4>

          <div className="form-row-2">
            <div className="form-field">
              <label htmlFor="input-umbral-aprobacion">
                Umbral de Aprobación Automática: <strong>{umbralAprobacion.toFixed(1)}</strong>
              </label>
              <input
                id="input-umbral-aprobacion"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={umbralAprobacion}
                onChange={(e) => setUmbralAprobacion(parseFloat(e.target.value) || 0)}
                disabled={!esRolDiseñador || procesando}
                className="form-input"
                required
              />
              <span className="field-hint">Corte para APROBADO_AUTOMATICO (ej. 90.0)</span>
            </div>

            <div className="form-field">
              <label htmlFor="input-umbral-riesgo">
                Umbral de Riesgo Alto: <strong>{umbralRiesgoAlto.toFixed(1)}</strong>
              </label>
              <input
                id="input-umbral-riesgo"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={umbralRiesgoAlto}
                onChange={(e) => setUmbralRiesgoAlto(parseFloat(e.target.value) || 0)}
                disabled={!esRolDiseñador || procesando}
                className="form-input"
                required
              />
              <span className="field-hint">Corte para advertencia visual (ej. 60.0)</span>
            </div>
          </div>

          {/* Validación de consistencia: umbralAprobacion > umbralRiesgoAlto */}
          {!esCorteValido && (
            <div className="form-field-error" role="alert">
              ⚠️ <strong>Inconsistencia en umbrales:</strong> El umbral de aprobación ({umbralAprobacion}) debe ser
              estrictamente mayor que el umbral de riesgo alto ({umbralRiesgoAlto}).
            </div>
          )}
        </div>

        {/* Sección 2: Mínimos Normativos por Señal */}
        <div className="form-section">
          <h4 className="form-section-title">2. Mínimos Exigidos por Señal Analítica [0 - 100]</h4>

          <div className="form-row-3">
            <div className="form-field">
              <label htmlFor="input-min-autenticidad">Autenticidad:</label>
              <input
                id="input-min-autenticidad"
                type="number"
                min="0"
                max="100"
                step="1"
                value={minimoAutenticidad}
                onChange={(e) => setMinimoAutenticidad(parseFloat(e.target.value) || 0)}
                disabled={!esRolDiseñador || procesando}
                className="form-input"
                required
              />
              <span className="field-hint">Mínimo actual: {vigente.minimoAutenticidad}</span>
            </div>

            <div className="form-field">
              <label htmlFor="input-min-cruce">Cruce de Fuentes:</label>
              <input
                id="input-min-cruce"
                type="number"
                min="0"
                max="100"
                step="1"
                value={minimoCruceFuentes}
                onChange={(e) => setMinimoCruceFuentes(parseFloat(e.target.value) || 0)}
                disabled={!esRolDiseñador || procesando}
                className="form-input"
                required
              />
              <span className="field-hint">Mínimo actual: {vigente.minimoCruceFuentes}</span>
            </div>

            <div className="form-field">
              <label htmlFor="input-min-coherencia">Coherencia:</label>
              <input
                id="input-min-coherencia"
                type="number"
                min="0"
                max="100"
                step="1"
                value={minimoCoherencia}
                onChange={(e) => setMinimoCoherencia(parseFloat(e.target.value) || 0)}
                disabled={!esRolDiseñador || procesando}
                className="form-input"
                required
              />
              <span className="field-hint">Mínimo actual: {vigente.minimoCoherencia}</span>
            </div>
          </div>
        </div>

        {/* Sección 3: Ponderaciones y Regla Estricta Suma = 1.00 */}
        <div className="form-section">
          <div className="form-section-header">
            <h4 className="form-section-title">3. Ponderaciones Continuas (Autenticidad + Cruce + Coherencia)</h4>
            <span
              className={`sum-indicator-badge ${esSumaPesosValida ? 'sum-valid' : 'sum-invalid'}`}
              id="indicador-suma-pesos"
            >
              Suma: {sumaPesos.toFixed(2)} / 1.00 {esSumaPesosValida ? '✓' : '✗'}
            </span>
          </div>

          <div className="form-row-3">
            <div className="form-field">
              <label htmlFor="input-peso-autenticidad">Peso Autenticidad:</label>
              <input
                id="input-peso-autenticidad"
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={pesoAutenticidad}
                onChange={(e) => setPesoAutenticidad(parseFloat(e.target.value) || 0)}
                disabled={!esRolDiseñador || procesando}
                className="form-input"
                required
              />
              <span className="field-hint">{(pesoAutenticidad * 100).toFixed(0)}% de ponderación</span>
            </div>

            <div className="form-field">
              <label htmlFor="input-peso-cruce">Peso Cruce Fuentes:</label>
              <input
                id="input-peso-cruce"
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={pesoCruceFuentes}
                onChange={(e) => setPesoCruceFuentes(parseFloat(e.target.value) || 0)}
                disabled={!esRolDiseñador || procesando}
                className="form-input"
                required
              />
              <span className="field-hint">{(pesoCruceFuentes * 100).toFixed(0)}% de ponderación</span>
            </div>

            <div className="form-field">
              <label htmlFor="input-peso-coherencia">Peso Coherencia:</label>
              <input
                id="input-peso-coherencia"
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={pesoCoherencia}
                onChange={(e) => setPesoCoherencia(parseFloat(e.target.value) || 0)}
                disabled={!esRolDiseñador || procesando}
                className="form-input"
                required
              />
              <span className="field-hint">{(pesoCoherencia * 100).toFixed(0)}% de ponderación</span>
            </div>
          </div>

          {/* ALERTA OBLIGATORIA SI NO SUMAN EXACTAMENTE 1.00 */}
          {!esSumaPesosValida && (
            <div className="form-field-error" role="alert" id="alerta-suma-pesos-invalida">
              ⚠️ <strong>Validación Estricta de Ponderaciones (D-08):</strong> La suma de los tres pesos debe ser
              exactamente igual a <strong>1.00</strong> (suma actual: <strong>{sumaPesos.toFixed(2)}</strong>).
              Ajuste los valores para habilitar el registro de la propuesta.
            </div>
          )}
        </div>

        {/* Botonera de Acción */}
        <div className="form-actions-bar">
          <button
            type="submit"
            id="btn-guardar-propuesta"
            className="btn btn-primary btn-lg"
            disabled={!esFormularioValido}
            title={
              !esRolDiseñador
                ? 'Acción reservada al rol Diseñador'
                : !esSumaPesosValida
                ? 'La suma de ponderaciones debe ser 1.00'
                : !esCorteValido
                ? 'El umbral de aprobación debe superar al de riesgo alto'
                : 'Registrar propuesta formal en estado BORRADOR'
            }
          >
            {procesando ? (
              <>
                <span className="btn-spinner" aria-hidden="true" /> Registrando propuesta...
              </>
            ) : (
              <>💾 Registrar Propuesta en BORRADOR</>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRestablecer}
            disabled={procesando}
          >
            Restablecer Valores
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioPropuesta;

import React, { useState } from 'react';
import { HeaderSelectorIdentidad } from './components/common/HeaderSelectorIdentidad';
import { Navbar, type NavTabId } from './components/common/Navbar';
import { SessionProvider, useSession } from './hooks/useSession';
import { useEvaluacion } from './hooks/useEvaluacion';
import { useUmbrales } from './hooks/useUmbrales';

// Componentes F4
import { ListaCasosPrueba } from './components/evaluacion/ListaCasosPrueba';
import { FormularioEvaluacion } from './components/evaluacion/FormularioEvaluacion';
import { VistaResultado } from './components/evaluacion/VistaResultado';

// Componentes F5
import { PanelUmbralesVigentes } from './components/umbrales/PanelUmbralesVigentes';
import { FormularioPropuesta } from './components/umbrales/FormularioPropuesta';
import { BandejaRevision } from './components/umbrales/BandejaRevision';
import { HistorialVersiones } from './components/umbrales/HistorialVersiones';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTabId>('evaluacion');
  const { backendConectado, usuarioActivo } = useSession();

  // Estado del Motor F4
  const {
    casos,
    casoSeleccionado,
    resultado,
    evaluando,
    error: errorEvaluacion,
    seleccionarCaso,
    ejecutarEvaluacion,
    limpiarResultado,
  } = useEvaluacion();

  // Estado de Gestión Normativa F5
  const {
    vigente,
    borradorActivo,
    versiones,
    cargando: cargandoUmbrales,
    procesando: procesandoUmbrales,
    error: errorUmbrales,
    mensajeExito: mensajeExitoUmbrales,
    crearPropuestaBorrador,
    aprobarPropuesta,
    desestimarPropuesta,
    limpiarMensajes: limpiarMensajesUmbrales,
  } = useUmbrales();

  return (
    <div className="app-container">
      {/* Encabezado Superior Institucional */}
      <header className="app-header">
        <div className="header-content">
          <div className="brand-wrapper">
            <div className="brand-logo-mark" aria-hidden="true">
              M
            </div>
            <div className="brand-text">
              <h1 className="brand-title">MIRA</h1>
              <span className="brand-subtitle">
                Plataforma de Inteligencia Multimodal para Decisiones Empresariales
              </span>
            </div>
          </div>

          {/* Selector de identidad simulada para segregación de funciones (D-04, T037) */}
          <HeaderSelectorIdentidad />
        </div>
      </header>

      {/* Barra de Navegación Principal en ≤ 2 clics (SC-005, T045) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          limpiarMensajesUmbrales();
        }}
        tieneBorradorPendiente={!!borradorActivo}
      />

      {/* Contenido Principal según Pestaña Activa */}
      <main className="main-content">
        {/* Banner de Estado de Conectividad con el Backend */}
        {!backendConectado && (
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>
              ℹ️ <strong>Modo Frontend Desacoplado:</strong> El backend Express (:3001) aún no responde peticiones en <code>/api</code>.
              Las vistas y la conmutación de identidades operan en modo tolerante a fallos local.
            </span>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem' }}>
              Proxy Vite activo hacia :3001
            </span>
          </div>
        )}

        {/* Notificaciones globales de éxito o error en F5 */}
        {mensajeExitoUmbrales && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>✅ {mensajeExitoUmbrales}</span>
            <button
              type="button"
              onClick={limpiarMensajesUmbrales}
              style={{ background: 'transparent', border: 'none', color: '#6ee7b7', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}

        {errorUmbrales && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>⚠️ {errorUmbrales}</span>
            <button
              type="button"
              onClick={limpiarMensajesUmbrales}
              style={{ background: 'transparent', border: 'none', color: '#fca5a5', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Grilla de Métricas Generales del Sistema */}
        <section className="metrics-grid" aria-label="Métricas del sistema MIRA">
          <div className="metric-card">
            <div className="metric-label">Flujo de Negocio</div>
            <div className="metric-value" style={{ fontSize: '1.2rem' }}>
              Reembolso Médico
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              {vigente.idFlujo}
            </span>
          </div>

          <div className="metric-card">
            <div className="metric-label">Política Vigente</div>
            <div className="metric-value">v{vigente.version}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-approved)' }}>
              ● Aprobada (Apr: {vigente.umbralAprobacion} | Riesgo: {vigente.umbralRiesgoAlto})
            </span>
          </div>

          <div className="metric-card">
            <div className="metric-label">Estado de Propuestas</div>
            <div className="metric-value" style={{ fontSize: '1.15rem' }}>
              {borradorActivo ? `Borrador v${borradorActivo.version}` : 'Sin Borrador'}
            </div>
            <span style={{ fontSize: '0.75rem', color: borradorActivo ? 'var(--color-derived)' : 'var(--color-text-secondary)' }}>
              {borradorActivo ? `Por ${borradorActivo.proponente}` : 'Lista para nueva propuesta'}
            </span>
          </div>

          <div className="metric-card">
            <div className="metric-label">Criterio Rector Constitucional</div>
            <div className="metric-value" style={{ fontSize: '1rem', color: '#93c5fd' }}>
              Cero Rechazo Automático
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Principio I: derivación obligatoria
            </span>
          </div>
        </section>

        {/* Tarjeta de Salvaguarda Constitucional (Principio I) */}
        <div className="alert-high-risk" role="alert">
          <div>
            <div className="alert-high-risk-title">
              Invariante de Negocio: Prohibición Absoluta de Rechazo Automático (Principio I)
            </div>
            <div className="alert-high-risk-desc">
              El sistema MIRA nunca emite resoluciones de rechazo. Toda derivación con puntaje crítico o señales bajo mínimo
              se clasifica como <strong>DERIVADO_REVISION</strong> con la advertencia informativa:{' '}
              <em>&ldquo;Riesgo alto de rechazo: decide un operador&rdquo;</em> para asistencia humana indelegable.
            </div>
          </div>
        </div>

        {/* Vista 1: Evaluación de Casos (F4) */}
        {activeTab === 'evaluacion' && (
          <div className="evaluacion-layout-grid" id="vista-evaluacion">
            {/* Columna Izquierda: Catálogo de Casos Sintéticos y Formulario */}
            <div className="evaluacion-col-left">
              <ListaCasosPrueba
                casos={casos}
                casoSeleccionadoId={casoSeleccionado?.idCaso}
                onSeleccionarCaso={seleccionarCaso}
                deshabilitado={evaluando}
              />
              <FormularioEvaluacion
                caso={casoSeleccionado}
                evaluando={evaluando}
                onEjecutarEvaluacion={() => ejecutarEvaluacion()}
                onLimpiar={limpiarResultado}
                error={errorEvaluacion}
                vigente={vigente}
              />
            </div>

            {/* Columna Derecha: Dictamen del Motor de Decisión F4 */}
            <div className="evaluacion-col-right">
              <VistaResultado
                resultado={resultado}
                cargando={evaluando}
                vigente={vigente}
              />
            </div>
          </div>
        )}

        {/* Vista 2: Gestión de Umbrales (F5) */}
        {activeTab === 'umbrales' && (
          <div className="umbrales-layout-grid" id="vista-umbrales">
            {/* Columna Izquierda: Política Vigente y Bandeja de Revisión con Doble Aprobación */}
            <div className="umbrales-col-left">
              <PanelUmbralesVigentes vigente={vigente} cargando={cargandoUmbrales} />
              <BandejaRevision
                borradorActivo={borradorActivo}
                vigente={vigente}
                usuarioActivo={usuarioActivo}
                procesando={procesandoUmbrales}
                onAprobar={aprobarPropuesta}
                onDesestimar={desestimarPropuesta}
              />
            </div>

            {/* Columna Derecha: Formulario de Nueva Propuesta con Validación de Suma de Pesos = 1.00 */}
            <div className="umbrales-col-right">
              <FormularioPropuesta
                vigente={vigente}
                borradorActivo={borradorActivo}
                usuarioActivo={usuarioActivo}
                procesando={procesandoUmbrales}
                onCrearPropuesta={crearPropuestaBorrador}
              />
            </div>
          </div>
        )}

        {/* Vista 3: Historial Inmutable y Auditoría (US6) */}
        {activeTab === 'auditoria' && (
          <div id="vista-auditoria">
            <HistorialVersiones
              versiones={versiones}
              versionVigenteNumero={vigente.version}
              cargando={cargandoUmbrales}
            />
          </div>
        )}
      </main>

      {/* Pie de Página Institucional */}
      <footer className="app-footer">
        <p>
          MIRA Entrega 2 &copy; 2026 DPRIME SpA &bull; Taller de Desarrollo de Software Conducido por Agentes de IA
          (Universidad de Valparaíso).
        </p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
};

export default App;

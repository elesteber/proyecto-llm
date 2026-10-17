import React, { useState } from 'react';
import { HeaderSelectorIdentidad } from './components/common/HeaderSelectorIdentidad';
import { useSession } from './hooks/useSession';
import { useEvaluacion } from './hooks/useEvaluacion';
import { ListaCasosPrueba } from './components/evaluacion/ListaCasosPrueba';
import { FormularioEvaluacion } from './components/evaluacion/FormularioEvaluacion';
import { VistaResultado } from './components/evaluacion/VistaResultado';

type TabView = 'evaluacion' | 'umbrales' | 'auditoria';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('evaluacion');
  const { backendConectado } = useSession();
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

      {/* Pestañas de Navegación Principal (Navegación limpia en ≤ 2 clics per SC-005) */}
      <nav className="nav-tabs" aria-label="Navegación del sistema MIRA">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'evaluacion' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluacion')}
          id="tab-evaluacion"
        >
          Evaluación de Casos (F4)
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'umbrales' ? 'active' : ''}`}
          onClick={() => setActiveTab('umbrales')}
          id="tab-umbrales"
        >
          Gestión de Umbrales (F5)
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'auditoria' ? 'active' : ''}`}
          onClick={() => setActiveTab('auditoria')}
          id="tab-auditoria"
        >
          Historial y Auditoría
        </button>
      </nav>

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
              Las vistas se despliegan en modo plantilla estructurada.
            </span>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem' }}>
              Proxy Vite activo hacia :3001
            </span>
          </div>
        )}

        {/* Métrica General y Estado del Sistema */}
        <section className="metrics-grid" aria-label="Métricas del sistema">
          <div className="metric-card">
            <div className="metric-label">Flujo de Negocio Activo</div>
            <div className="metric-value" style={{ fontSize: '1.25rem' }}>
              Reembolso Médico
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              reembolso-gastos-medicos
            </span>
          </div>

          <div className="metric-card">
            <div className="metric-label">Política de Umbrales</div>
            <div className="metric-value">v1</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-approved)' }}>
              ● Vigente (Aprobada)
            </span>
          </div>

          <div className="metric-card">
            <div className="metric-label">Expedientes Sintéticos</div>
            <div className="metric-value">6</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              CASO-MED-001 a 006
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

        {/* Vista: Evaluación de Casos (F4) */}
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
              />
            </div>

            {/* Columna Derecha: Dictamen del Motor de Decisión F4 */}
            <div className="evaluacion-col-right">
              <VistaResultado resultado={resultado} cargando={evaluando} />
            </div>
          </div>
        )}

        {/* Vista: Gestión de Umbrales (F5) */}
        {activeTab === 'umbrales' && (
          <section className="card" id="vista-umbrales">
            <div className="card-header">
              <div>
                <h2 className="card-title">Módulo de Gestión de Umbrales (F5)</h2>
                <p className="card-subtitle">
                  Administración normativa dinámica, versionamiento inmutable y protocolo de doble control (D-04).
                </p>
              </div>
              <span className="badge badge-derived">Protocolo Doble Control</span>
            </div>

            <div style={{ padding: '1rem 0', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                Este módulo acogerá los componentes <code>PanelUmbralesVigentes</code>, <code>FormularioPropuesta</code> y{' '}
                <code>BandejaRevision</code> (tareas T029, T030, T038).
              </p>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>⚖️</div>
                <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                  Armazón Normativo Preparado
                </h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '600px', margin: '0 auto' }}>
                  Listo para integrar la visualización de la versión vigente y el formulario de propuestas con validación reactiva de suma de pesos = 1.00.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Vista: Historial y Auditoría */}
        {activeTab === 'auditoria' && (
          <section className="card" id="vista-auditoria">
            <div className="card-header">
              <div>
                <h2 className="card-title">Historial Inmutable y Auditoría (US6)</h2>
                <p className="card-subtitle">
                  Trazabilidad append-only de versiones pasadas y reproducibilidad determinista al 100% (SC-004).
                </p>
              </div>
              <span className="badge badge-approved">Append-Only</span>
            </div>

            <div style={{ padding: '1rem 0', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                Este módulo acogerá los componentes <code>HistorialVersiones</code> e <code>HistorialEvaluaciones</code>{' '}
                (tareas T043, T044).
              </p>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🏛️</div>
                <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                  Registro de Auditoría Preparado
                </h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '600px', margin: '0 auto' }}>
                  Consulta histórica de versiones archivadas y reevaluación determinista sin circularidad.
                </p>
              </div>
            </div>
          </section>
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

export default App;

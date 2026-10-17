import React, { useState, useEffect } from 'react';
import { sessionApi } from './services/api-client';
import type { IdentidadSimulada, RolUsuario } from '../shared/types';

type TabView = 'evaluacion' | 'umbrales' | 'auditoria';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('evaluacion');
  const [identidadActual, setIdentidadActual] = useState<{
    nombre: IdentidadSimulada;
    rol: RolUsuario;
    descripcion: string;
  }>({
    nombre: 'Diseñador 1',
    rol: 'Diseñador',
    descripcion: 'Usuario autorizado para proponer y editar borradores de umbrales.',
  });
  const [conexionApi, setConexionApi] = useState<'conectando' | 'conectado' | 'desconectado'>('conectando');

  // Intentar verificar conectividad inicial con el backend
  useEffect(() => {
    let cancelado = false;
    async function verificarSesion() {
      try {
        const respuesta = await sessionApi.obtenerSesionActual();
        if (!cancelado && respuesta.usuarioActivo) {
          setIdentidadActual(respuesta.usuarioActivo);
          setConexionApi('conectado');
        }
      } catch {
        if (!cancelado) {
          // El backend puede no estar corriendo todavía en :3001 durante la Fase 0
          setConexionApi('desconectado');
        }
      }
    }
    verificarSesion();
    return () => {
      cancelado = true;
    };
  }, []);

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

          {/* Barra de sesión simulada */}
          <div className="session-bar" title="Sesión simulada para segregación de roles (D-04)">
            <span
              className="session-indicator"
              style={{
                backgroundColor:
                  conexionApi === 'conectado'
                    ? 'var(--color-approved)'
                    : conexionApi === 'conectando'
                    ? 'var(--color-derived)'
                    : 'var(--color-text-muted)',
              }}
            />
            <div className="session-user-info">
              <span>{identidadActual.nombre}</span>
              <span className="session-role-tag">{identidadActual.rol}</span>
            </div>
          </div>
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
        {conexionApi === 'desconectado' && (
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
          <section className="card" id="vista-evaluacion">
            <div className="card-header">
              <div>
                <h2 className="card-title">Módulo de Evaluación de Casos (F4)</h2>
                <p className="card-subtitle">
                  Evaluación determinista multimodal de solicitudes de reembolso médico basada en precedencia estricta.
                </p>
              </div>
              <span className="badge badge-approved">Motor F4 Listo</span>
            </div>

            <div style={{ padding: '1rem 0', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                Este módulo acogerá los componentes <code>ListaCasosPrueba</code>, <code>FormularioEvaluacion</code>,{' '}
                <code>VistaResultado</code> y <code>AlertaRiesgoAlto</code> (tareas T013, T018, T019, T023).
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
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📋</div>
                <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                  Armazón de Evaluación Preparado
                </h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '600px', margin: '0 auto' }}>
                  Listo para integrar los expedientes sintéticos desde el contrato compartido{' '}
                  <code>src/shared/types.ts</code> mediante <code>evaluacionApi.obtenerCasos()</code>.
                </p>
              </div>
            </div>
          </section>
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

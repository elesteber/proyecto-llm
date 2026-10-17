/**
 * MIRA — Componente Navbar (T045, SC-005, Criterio C4)
 * Barra de navegación principal del sistema MIRA garantizando acceso directo
 * entre los módulos F4 y F5 en ≤ 2 clics.
 */

import React from 'react';

export type NavTabId = 'evaluacion' | 'umbrales' | 'auditoria';

interface NavbarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  tieneBorradorPendiente?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  tieneBorradorPendiente = false,
}) => {
  return (
    <nav className="nav-tabs" aria-label="Navegación principal MIRA (Acceso en ≤ 2 clics - SC-005)">
      <button
        type="button"
        id="nav-tab-evaluacion"
        className={`tab-btn ${activeTab === 'evaluacion' ? 'active' : ''}`}
        onClick={() => onSelectTab('evaluacion')}
        aria-current={activeTab === 'evaluacion' ? 'page' : undefined}
      >
        <span className="tab-icon" aria-hidden="true">🎯</span>
        <span>Evaluación de Casos (F4)</span>
      </button>

      <button
        type="button"
        id="nav-tab-umbrales"
        className={`tab-btn ${activeTab === 'umbrales' ? 'active' : ''}`}
        onClick={() => onSelectTab('umbrales')}
        aria-current={activeTab === 'umbrales' ? 'page' : undefined}
      >
        <span className="tab-icon" aria-hidden="true">⚖️</span>
        <span>Gestión de Umbrales (F5)</span>
        {tieneBorradorPendiente && (
          <span className="tab-pending-dot" title="Borrador pendiente de revisión administrativa" />
        )}
      </button>

      <button
        type="button"
        id="nav-tab-auditoria"
        className={`tab-btn ${activeTab === 'auditoria' ? 'active' : ''}`}
        onClick={() => onSelectTab('auditoria')}
        aria-current={activeTab === 'auditoria' ? 'page' : undefined}
      >
        <span className="tab-icon" aria-hidden="true">🏛️</span>
        <span>Historial y Auditoría</span>
      </button>
    </nav>
  );
};

export default Navbar;

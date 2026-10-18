/**
 * MIRA — Componente Selector de Identidad Simulada (D-04, PF-033 adaptada)
 * Despliega en la barra superior el catálogo cerrado de 5 identidades oficiales
 * permitiendo alternar roles ágilmente para probar el flujo de doble control (F5) y evaluación (F4).
 * Cumple: T037, contracts/session-simulada.md, Clarificación 2
 */

import React from 'react';
import { useSession } from '../../hooks/useSession';
import type { IdentidadSimulada, RolUsuario } from '../../../shared/types';

interface HeaderSelectorIdentidadProps {
  /**
   * Opcional: callback para notificar a componentes superiores sobre el cambio de rol
   */
  onCambioUsuario?: (nuevoUsuario: IdentidadSimulada, nuevoRol: RolUsuario) => void;
}

export const HeaderSelectorIdentidad: React.FC<HeaderSelectorIdentidadProps> = ({
  onCambioUsuario,
}) => {
  const { usuarioActivo, catalogoIdentidades, conmutarUsuario, conmutando, backendConectado } =
    useSession();

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoNombre = e.target.value as IdentidadSimulada;
    await conmutarUsuario(nuevoNombre);
    const identidad = catalogoIdentidades.find((id) => id.nombre === nuevoNombre);
    if (identidad && onCambioUsuario) {
      onCambioUsuario(identidad.nombre, identidad.rol);
    }
  };

  // Color de badge semántico según el rol
  const obtenerClaseRol = (rol: RolUsuario): string => {
    switch (rol) {
      case 'Diseñador':
        return 'rol-badge-disenador';
      case 'Administrador':
        return 'rol-badge-administrador';
      case 'Operador':
        return 'rol-badge-operador';
      default:
        return '';
    }
  };

  return (
    <div
      className="header-identity-container"
      title={`Usuario activo: ${usuarioActivo.nombre} (${usuarioActivo.rol})\n${usuarioActivo.descripcion}`}
    >
      {/* Indicador luminoso de estado de conectividad con la API de sesión */}
      <div
        className="connection-status-dot"
        style={{
          backgroundColor: backendConectado ? 'var(--color-approved)' : 'var(--color-derived)',
          boxShadow: backendConectado
            ? '0 0 8px var(--color-approved)'
            : '0 0 6px var(--color-derived)',
        }}
        aria-label={backendConectado ? 'Conectado al servidor Express' : 'Modo sesión desacoplada'}
        title={backendConectado ? 'Cookie mira_session sincronizada con backend' : 'Modo desacoplado en memoria'}
      />

      <label htmlFor="selector-identidad-simulada" className="identity-label">
        Identidad:
      </label>

      {/* Selector interactivo de las 5 identidades fijas */}
      <div className="select-wrapper">
        <select
          id="selector-identidad-simulada"
          className="identity-select"
          value={usuarioActivo.nombre}
          onChange={handleSelectChange}
          disabled={conmutando}
          aria-label="Seleccionar identidad simulada para prueba de doble control"
        >
          {catalogoIdentidades.map((identidad) => (
            <option key={identidad.nombre} value={identidad.nombre}>
              {identidad.nombre} — [{identidad.rol}]
            </option>
          ))}
        </select>
        {conmutando && <span className="switching-spinner" aria-hidden="true" />}
      </div>

      {/* Badge visual del rol actual */}
      <span className={`session-role-tag ${obtenerClaseRol(usuarioActivo.rol)}`}>
        {usuarioActivo.rol}
      </span>
    </div>
  );
};

export default HeaderSelectorIdentidad;

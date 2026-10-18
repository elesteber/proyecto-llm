/**
 * MIRA — Hook reactivo y Contexto Global de sesión simulada (D-04, PF-033 adaptada)
 * Permite conmutar entre las 5 identidades fijas preconfiguradas con persistencia
 * reactiva global (React Context + localStorage) y sincronización con cookie HTTP 'mira_session'.
 * Cumple: T037, contracts/session-simulada.md, Clarificación 2
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sessionApi } from '../services/api-client';
import type { IdentidadSimulada, RolUsuario, UsuarioActivo } from '../../shared/types';

/**
 * Catálogo canónico cerrado de las 5 identidades fijas (Clarificación 2 / D-04)
 */
export const CATALOGO_IDENTIDADES: {
  nombre: IdentidadSimulada;
  rol: RolUsuario;
  descripcion: string;
}[] = [
  {
    nombre: 'Diseñador 1',
    rol: 'Diseñador',
    descripcion: 'Usuario autorizado para proponer y editar borradores de umbrales.',
  },
  {
    nombre: 'Diseñador 2',
    rol: 'Diseñador',
    descripcion: 'Diseñador secundario para proponer y editar borradores de umbrales.',
  },
  {
    nombre: 'Administrador 1',
    rol: 'Administrador',
    descripcion: 'Usuario autorizado para revisar, aprobar o desestimar propuestas de umbrales.',
  },
  {
    nombre: 'Administrador 2',
    rol: 'Administrador',
    descripcion: 'Administrador secundario para el protocolo de doble aprobación.',
  },
  {
    nombre: 'Operador 1',
    rol: 'Operador',
    descripcion: 'Operador de siniestros encargado de evaluar expedientes y revisar casos derivados.',
  },
];

const LOCAL_STORAGE_KEY = 'mira_simulated_user';

function getUsuarioInicial(): UsuarioActivo {
  if (typeof window !== 'undefined' && window.localStorage) {
    const guardado = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (guardado) {
      const coincidencia = CATALOGO_IDENTIDADES.find((id) => id.nombre === guardado);
      if (coincidencia) return coincidencia;
    }
  }
  return CATALOGO_IDENTIDADES[0];
}

export interface UseSessionReturn {
  usuarioActivo: UsuarioActivo;
  catalogoIdentidades: typeof CATALOGO_IDENTIDADES;
  cargando: boolean;
  conmutando: boolean;
  error: string | null;
  backendConectado: boolean;
  conmutarUsuario: (nuevoUsuario: IdentidadSimulada) => Promise<void>;
  recargarSesion: () => Promise<void>;
}

export const SessionContext = createContext<UseSessionReturn | null>(null);

export interface SessionProviderProps {
  children: React.ReactNode;
}

/**
 * Provider global para compartir el estado reactivo de sesión entre toda la jerarquía de componentes
 */
export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [usuarioActivo, setUsuarioActivo] = useState<UsuarioActivo>(getUsuarioInicial);
  const [cargando, setCargando] = useState<boolean>(true);
  const [conmutando, setConmutando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [backendConectado, setBackendConectado] = useState<boolean>(false);

  const cargarSesion = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await sessionApi.obtenerSesionActual();
      if (respuesta && respuesta.usuarioActivo) {
        setUsuarioActivo(respuesta.usuarioActivo);
        setBackendConectado(true);
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(LOCAL_STORAGE_KEY, respuesta.usuarioActivo.nombre);
        }
      }
    } catch {
      // Si el backend Express en :3001 no está respondiendo todavía,
      // operamos en modo simulado local preservando la reactividad global.
      setBackendConectado(false);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarSesion();
  }, [cargarSesion]);

  const conmutarUsuario = useCallback(
    async (nuevoUsuario: IdentidadSimulada) => {
      setConmutando(true);
      setError(null);

      // Buscar los metadatos correspondientes de la identidad seleccionada
      const identidadEncontrada = CATALOGO_IDENTIDADES.find((id) => id.nombre === nuevoUsuario);
      const fallbackUsuario: UsuarioActivo = identidadEncontrada || {
        nombre: nuevoUsuario,
        rol: 'Diseñador',
        descripcion: 'Usuario activo en sesión simulada.',
      };

      // Actualización reactiva global inmediata en memoria y persistencia
      setUsuarioActivo(fallbackUsuario);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, nuevoUsuario);
      }

      try {
        const respuesta = await sessionApi.conmutarIdentidad(nuevoUsuario);
        if (respuesta && respuesta.usuarioActivo) {
          setUsuarioActivo({
            nombre: respuesta.usuarioActivo.nombre,
            rol: respuesta.usuarioActivo.rol as RolUsuario,
            descripcion: fallbackUsuario.descripcion,
          });
          setBackendConectado(true);
        } else {
          setUsuarioActivo(fallbackUsuario);
        }
      } catch (err) {
        // En modo desacoplado, mantenemos el usuario conmutado en memoria
        setUsuarioActivo(fallbackUsuario);
        setBackendConectado(false);
        if (err instanceof Error) {
          console.info(
            `[useSession] Conmutación reactiva global a "${nuevoUsuario}". Backend en :3001 no conectado.`
          );
        }
      } finally {
        setConmutando(false);
      }
    },
    []
  );

  const value: UseSessionReturn = {
    usuarioActivo,
    catalogoIdentidades: CATALOGO_IDENTIDADES,
    cargando,
    conmutando,
    error,
    backendConectado,
    conmutarUsuario,
    recargarSesion: cargarSesion,
  };

  return React.createElement(SessionContext.Provider, { value }, children);
};

/**
 * Hook de consumo del contexto global de sesión
 */
export function useSession(): UseSessionReturn {
  const context = useContext(SessionContext);
  if (!context) {
    // Si se utiliza fuera de SessionProvider, fallback tolerante para no romper rendering aislado
    return {
      usuarioActivo: CATALOGO_IDENTIDADES[0],
      catalogoIdentidades: CATALOGO_IDENTIDADES,
      cargando: false,
      conmutando: false,
      error: null,
      backendConectado: false,
      conmutarUsuario: async () => {},
      recargarSesion: async () => {},
    };
  }
  return context;
}

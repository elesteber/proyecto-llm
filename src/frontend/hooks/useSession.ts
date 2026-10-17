/**
 * MIRA — Hook reactivo de gestión de sesión simulada (D-04, PF-033 adaptada)
 * Permite conmutar entre las 5 identidades fijas preconfiguradas con persistencia
 * transparente de la cookie HTTP 'mira_session'.
 * Cumple: T037, contracts/session-simulada.md, Clarificación 2
 */

import { useState, useEffect, useCallback } from 'react';
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

export function useSession(): UseSessionReturn {
  const [usuarioActivo, setUsuarioActivo] = useState<UsuarioActivo>(CATALOGO_IDENTIDADES[0]);
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
      }
    } catch {
      // Si el backend Express en :3001 no está respondiendo todavía,
      // operamos en modo simulado local preservando la reactividad para el frontend.
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
        // En caso de que el backend no esté activo, actualizamos de todas formas
        // el estado en memoria para permitir al desarrollador frontend probar la alternancia
        setUsuarioActivo(fallbackUsuario);
        setBackendConectado(false);
        if (err instanceof Error) {
          // No bloqueamos la UI con un error si es desconexión del backend
          console.info(
            `[useSession] Conmutación local a "${nuevoUsuario}". Backend no disponible aún en :3001.`
          );
        }
      } finally {
        setConmutando(false);
      }
    },
    []
  );

  return {
    usuarioActivo,
    catalogoIdentidades: CATALOGO_IDENTIDADES,
    cargando,
    conmutando,
    error,
    backendConectado,
    conmutarUsuario,
    recargarSesion: cargarSesion,
  };
}

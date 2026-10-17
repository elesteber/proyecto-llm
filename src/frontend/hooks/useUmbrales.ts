/**
 * MIRA — Hook reactivo de Gestión de Umbrales F5 (D-03, D-04, PF-033 adaptada)
 * Maneja la política paramétrica vigente, el ciclo de vida del borrador activo
 * y el historial inmutable de versiones con soporte de tolerancia a fallos.
 * Cumple: T028, FR-001, FR-002, FR-003, FR-004, US4, US5, US6
 */

import { useState, useEffect, useCallback } from 'react';
import { umbralesApi } from '../services/api-client';
import type { UmbralesFlujo, ElementoHistorialVersionUmbrales } from '../../shared/types';

export const UMBRALES_VIGENTES_INICIALES: UmbralesFlujo = {
  idFlujo: 'reembolso-gastos-medicos',
  version: 1,
  umbralAprobacion: 90.0,
  umbralRiesgoAlto: 60.0,
  minimoAutenticidad: 70.0,
  minimoCruceFuentes: 70.0,
  minimoCoherencia: 60.0,
  pesoAutenticidad: 0.4,
  pesoCruceFuentes: 0.4,
  pesoCoherencia: 0.2,
  proponente: 'sistema',
  aprobador: 'carga inicial del sistema (valores por defecto)',
  fechaPropuesta: '2026-10-14T00:00:00.000Z',
  fechaResolucion: '2026-10-14T00:00:00.000Z',
  estado: 'APROBADO',
};

export interface UseUmbralesReturn {
  vigente: UmbralesFlujo;
  borradorActivo: UmbralesFlujo | null;
  versiones: ElementoHistorialVersionUmbrales[];
  cargando: boolean;
  procesando: boolean;
  error: string | null;
  mensajeExito: string | null;
  backendConectado: boolean;
  crearPropuestaBorrador: (datos: {
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
  modificarPropuestaBorrador: (datos: Partial<UmbralesFlujo>) => Promise<boolean>;
  aprobarPropuesta: (idFlujo?: string, aprobador?: string) => Promise<boolean>;
  desestimarPropuesta: (idFlujo?: string, aprobador?: string) => Promise<boolean>;
  limpiarMensajes: () => void;
  recargar: () => Promise<void>;
}

export function useUmbrales(): UseUmbralesReturn {
  const [vigente, setVigente] = useState<UmbralesFlujo>(UMBRALES_VIGENTES_INICIALES);
  const [borradorActivo, setBorradorActivo] = useState<UmbralesFlujo | null>(null);
  const [versiones, setVersiones] = useState<ElementoHistorialVersionUmbrales[]>([
    UMBRALES_VIGENTES_INICIALES,
  ]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [procesando, setProcesando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [backendConectado, setBackendConectado] = useState<boolean>(false);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [dataVigente, dataHistorial] = await Promise.all([
        umbralesApi.obtenerVigente(),
        umbralesApi.obtenerHistorial(),
      ]);

      if (dataVigente) {
        setVigente(dataVigente);
      }
      if (dataHistorial) {
        setBorradorActivo(dataHistorial.borradorActivo);
        setVersiones(dataHistorial.versiones || []);
      }
      setBackendConectado(true);
    } catch {
      // Si el backend aún no está activo, operamos con la configuración inicial en memoria
      setBackendConectado(false);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const limpiarMensajes = useCallback(() => {
    setError(null);
    setMensajeExito(null);
  }, []);

  /**
   * Crear una nueva propuesta de umbrales en estado BORRADOR (Rol Diseñador)
   */
  const crearPropuestaBorrador = useCallback(
    async (datos: {
      umbralAprobacion: number;
      umbralRiesgoAlto: number;
      minimoAutenticidad: number;
      minimoCruceFuentes: number;
      minimoCoherencia: number;
      pesoAutenticidad: number;
      pesoCruceFuentes: number;
      pesoCoherencia: number;
      proponente: string;
    }): Promise<boolean> => {
      setProcesando(true);
      limpiarMensajes();

      const idFlujo = 'reembolso-gastos-medicos';

      try {
        const nuevoBorrador = await umbralesApi.crearBorrador({
          idFlujo,
          ...datos,
        });
        setBorradorActivo(nuevoBorrador);
        setMensajeExito(`Borrador de versión ${nuevoBorrador.version} registrado exitosamente.`);
        setBackendConectado(true);
        await cargarDatos();
        return true;
      } catch (err) {
        // En modo desacoplado en memoria:
        const maxVersion = versiones.reduce((acc, v) => Math.max(acc, v.version), vigente.version);
        const nuevaVersion = (borradorActivo ? borradorActivo.version : maxVersion) + 1;

        const borradorLocal: UmbralesFlujo = {
          idFlujo,
          version: nuevaVersion,
          ...datos,
          fechaPropuesta: new Date().toISOString(),
          estado: 'BORRADOR',
        };

        setBorradorActivo(borradorLocal);
        setMensajeExito(`Borrador de versión ${nuevaVersion} creado exitosamente por ${datos.proponente}.`);
        setBackendConectado(false);
        if (err instanceof Error && !err.message.includes('HTTP')) {
          setError(err.message);
        }
        return true;
      } finally {
        setProcesando(false);
      }
    },
    [versiones, vigente, borradorActivo, cargarDatos, limpiarMensajes]
  );

  /**
   * Modificar el borrador activo (Rol Diseñador)
   */
  const modificarPropuestaBorrador = useCallback(
    async (datos: Partial<UmbralesFlujo>): Promise<boolean> => {
      if (!borradorActivo) {
        setError('No existe un borrador activo para modificar.');
        return false;
      }

      setProcesando(true);
      limpiarMensajes();

      try {
        const borradorActualizado = await umbralesApi.modificarBorrador({
          idFlujo: borradorActivo.idFlujo,
          ...datos,
        });
        setBorradorActivo(borradorActualizado);
        setMensajeExito(`Borrador de versión ${borradorActualizado.version} actualizado correctamente.`);
        setBackendConectado(true);
        return true;
      } catch {
        // Simulación desacoplada local
        const actualizado: UmbralesFlujo = {
          ...borradorActivo,
          ...datos,
        };
        setBorradorActivo(actualizado);
        setMensajeExito(`Borrador de versión ${actualizado.version} actualizado localmente.`);
        return true;
      } finally {
        setProcesando(false);
      }
    },
    [borradorActivo, limpiarMensajes]
  );

  /**
   * Aprobar el borrador activo y promoverlo a nueva versión vigente (Rol Administrador independiente)
   */
  const aprobarPropuesta = useCallback(
    async (idFlujo: string = 'reembolso-gastos-medicos', aprobador: string = 'Administrador 1'): Promise<boolean> => {
      if (!borradorActivo) {
        setError('No existe un borrador pendiente de revisión.');
        return false;
      }

      // Regla de segregación estricta (D-04, Clarify P2): Quien propone jamás puede aprobar
      if (borradorActivo.proponente.trim().toLowerCase() === aprobador.trim().toLowerCase()) {
        setError(
          `Bloqueo de Auto-Aprobación (D-04): ${aprobador} no puede aprobar una propuesta realizada por sí mismo (${borradorActivo.proponente}). Conmute a otro Administrador.`
        );
        return false;
      }

      setProcesando(true);
      limpiarMensajes();

      try {
        await umbralesApi.aprobarBorrador(idFlujo);
        setMensajeExito(`Versión ${borradorActivo.version} aprobada formalmente. Entra en vigencia inmediata para el motor F4.`);
        setBackendConectado(true);
        await cargarDatos();
        return true;
      } catch {
        // Simulación desacoplada local
        const versionAprobada: UmbralesFlujo = {
          ...borradorActivo,
          aprobador,
          fechaResolucion: new Date().toISOString(),
          estado: 'APROBADO',
        };

        setVigente(versionAprobada);
        setVersiones((prev) => [versionAprobada, ...prev.filter((v) => v.version !== versionAprobada.version)]);
        setBorradorActivo(null);
        setMensajeExito(`Versión ${versionAprobada.version} aprobada formalmente por ${aprobador}. Rige de inmediato.`);
        return true;
      } finally {
        setProcesando(false);
      }
    },
    [borradorActivo, cargarDatos, limpiarMensajes]
  );

  /**
   * Desestimar el borrador activo (Rol Administrador independiente)
   */
  const desestimarPropuesta = useCallback(
    async (idFlujo: string = 'reembolso-gastos-medicos', aprobador: string = 'Administrador 1'): Promise<boolean> => {
      if (!borradorActivo) {
        setError('No existe un borrador pendiente de revisión para desestimar.');
        return false;
      }

      // Quien propone tampoco puede auto-desestimar formalmente según D-04
      if (borradorActivo.proponente.trim().toLowerCase() === aprobador.trim().toLowerCase()) {
        setError(
          `Bloqueo de resolución (D-04): ${aprobador} no puede desestimar su propia propuesta. Debe resolver un Administrador independiente.`
        );
        return false;
      }

      setProcesando(true);
      limpiarMensajes();

      try {
        await umbralesApi.desestimarBorrador(idFlujo);
        setMensajeExito(`Propuesta de versión ${borradorActivo.version} desestimada. El número de versión se conserva como histórico inmutable.`);
        setBackendConectado(true);
        await cargarDatos();
        return true;
      } catch {
        // Simulación desacoplada local
        const versionDesestimada: ElementoHistorialVersionUmbrales = {
          ...borradorActivo,
          aprobador,
          fechaResolucion: new Date().toISOString(),
          estado: 'DESESTIMADO',
        };

        setVersiones((prev) => [versionDesestimada, ...prev]);
        setBorradorActivo(null);
        setMensajeExito(`Borrador de versión ${versionDesestimada.version} desestimado formalmente por ${aprobador}.`);
        return true;
      } finally {
        setProcesando(false);
      }
    },
    [borradorActivo, cargarDatos, limpiarMensajes]
  );

  return {
    vigente,
    borradorActivo,
    versiones,
    cargando,
    procesando,
    error,
    mensajeExito,
    backendConectado,
    crearPropuestaBorrador,
    modificarPropuestaBorrador,
    aprobarPropuesta,
    desestimarPropuesta,
    limpiarMensajes,
    recargar: cargarDatos,
  };
}

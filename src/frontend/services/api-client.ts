/**
 * MIRA — Cliente HTTP Base para Comunicación Frontend ↔ Backend
 * Conforme a contratos: session-simulada.md, api-umbrales-f5.md, api-evaluacion-f4.md
 * Maneja credenciales transparentes (cookie mira_session) y tipado estricto.
 * Cumple: T007, PC-03, Principio VII
 */

import type {
  UmbralesFlujo,
  CasoPrueba,
  ResultadoEvaluacion,
  RespuestaEvaluarCaso,
  ElementoHistorialEvaluacion,
  ResultadoReevaluacionHistorica,
  ElementoHistorialVersionUmbrales,
  VersionUmbralesResumida,
  IdentidadSimulada,
  UsuarioActivo,
} from '../../shared/types';

/**
 * Error personalizado para peticiones hacia la API de MIRA
 */
export class ApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Cliente HTTP base que canaliza las peticiones a través del proxy /api
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Accept': 'application/json',
  };

  if (options.body && !(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Esencial para que el navegador envíe y reciba la cookie de sesión simulada 'mira_session'
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = `Error en la petición HTTP: ${response.status} ${response.statusText}`;
    let errorDetails: unknown = null;

    try {
      const data = await response.json();
      errorDetails = data;
      if (data && typeof data.error === 'string') {
        errorMessage = data.error;
      } else if (data && typeof data.message === 'string') {
        errorMessage = data.message;
      }
    } catch {
      // Si la respuesta no es JSON, mantenemos el mensaje de estado HTTP
    }

    throw new ApiError(errorMessage, response.status, errorDetails);
  }

  // Si la respuesta no contiene contenido (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Servicios de Sesión Simulada (contracts/session-simulada.md)
 */
export const sessionApi = {
  /**
   * Obtiene la identidad actualmente activa y el catálogo de las 5 identidades preconfiguradas
   */
  async obtenerSesionActual(): Promise<{
    usuarioActivo: UsuarioActivo;
    catalogoIdentidades: { nombre: IdentidadSimulada; rol: string }[];
  }> {
    return request<{
      usuarioActivo: UsuarioActivo;
      catalogoIdentidades: { nombre: IdentidadSimulada; rol: string }[];
    }>('/api/session/current');
  },

  /**
   * Conmuta la identidad activa hacia otra del catálogo de 5 identidades
   */
  async conmutarIdentidad(nuevoUsuario: IdentidadSimulada): Promise<{
    mensaje: string;
    usuarioActivo: { nombre: IdentidadSimulada; rol: string };
  }> {
    return request<{
      mensaje: string;
      usuarioActivo: { nombre: IdentidadSimulada; rol: string };
    }>('/api/session/switch', {
      method: 'POST',
      body: JSON.stringify({ nuevoUsuario }),
    });
  },
};

/**
 * Servicios de Gestión de Umbrales F5 (contracts/api-umbrales-f5.md)
 */
export const umbralesApi = {
  /**
   * Obtiene la configuración de umbrales vigente (versión APROBADO de mayor número)
   */
  async obtenerVigente(): Promise<UmbralesFlujo> {
    return request<UmbralesFlujo>('/api/umbrales/vigente');
  },

  /**
   * Consulta el historial completo de versiones y borrador activo si existe
   */
  async obtenerHistorial(): Promise<{
    idFlujo: string;
    borradorActivo: UmbralesFlujo | null;
    versiones: ElementoHistorialVersionUmbrales[];
  }> {
    return request<{
      idFlujo: string;
      borradorActivo: UmbralesFlujo | null;
      versiones: ElementoHistorialVersionUmbrales[];
    }>('/api/umbrales/historial');
  },

  /**
   * Registra una nueva propuesta de modificación de umbrales en estado BORRADOR (Rol Diseñador)
   */
  async crearBorrador(datos: {
    idFlujo: string;
    umbralAprobacion: number;
    umbralRiesgoAlto: number;
    minimoAutenticidad: number;
    minimoCruceFuentes: number;
    minimoCoherencia: number;
    pesoAutenticidad: number;
    pesoCruceFuentes: number;
    pesoCoherencia: number;
  }): Promise<UmbralesFlujo> {
    const res = await request<{ mensaje: string; borrador: UmbralesFlujo } | UmbralesFlujo>(
      '/api/umbrales/borrador',
      {
        method: 'POST',
        body: JSON.stringify(datos),
      }
    );
    return 'borrador' in res && res.borrador ? res.borrador : (res as UmbralesFlujo);
  },

  /**
   * Modifica los parámetros de un borrador existente (Rol Diseñador)
   */
  async modificarBorrador(datos: {
    idFlujo: string;
    umbralAprobacion?: number;
    umbralRiesgoAlto?: number;
    minimoAutenticidad?: number;
    minimoCruceFuentes?: number;
    minimoCoherencia?: number;
    pesoAutenticidad?: number;
    pesoCruceFuentes?: number;
    pesoCoherencia?: number;
  }): Promise<UmbralesFlujo> {
    const res = await request<{ mensaje: string; borrador: UmbralesFlujo } | UmbralesFlujo>(
      '/api/umbrales/borrador',
      {
        method: 'PUT',
        body: JSON.stringify(datos),
      }
    );
    return 'borrador' in res && res.borrador ? res.borrador : (res as UmbralesFlujo);
  },

  /**
   * Aprueba formalmente el borrador activo y promueve a nueva versión vigente (Rol Administrador independiente)
   */
  async aprobarBorrador(idFlujo: string): Promise<VersionUmbralesResumida> {
    const res = await request<{ mensaje: string; versionAprobada: VersionUmbralesResumida } | VersionUmbralesResumida>(
      '/api/umbrales/borrador/aprobar',
      {
        method: 'POST',
        body: JSON.stringify({ idFlujo }),
      }
    );
    return 'versionAprobada' in res && res.versionAprobada ? res.versionAprobada : (res as VersionUmbralesResumida);
  },

  /**
   * Desestima el borrador activo conservando su número correlativo como inmutable (Rol Administrador independiente)
   */
  async desestimarBorrador(idFlujo: string): Promise<VersionUmbralesResumida> {
    const res = await request<{ mensaje: string; versionDesestimada: VersionUmbralesResumida } | VersionUmbralesResumida>(
      '/api/umbrales/borrador/desestimar',
      {
        method: 'POST',
        body: JSON.stringify({ idFlujo }),
      }
    );
    return 'versionDesestimada' in res && res.versionDesestimada ? res.versionDesestimada : (res as VersionUmbralesResumida);
  },
};

/**
 * Servicios de Evaluación de Casos y Motor de Decisión F4 (contracts/api-evaluacion-f4.md)
 */
export const evaluacionApi = {
  /**
   * Lista el catálogo de expedientes sintéticos disponibles para evaluación
   */
  async obtenerCasos(): Promise<CasoPrueba[]> {
    return request<CasoPrueba[]>('/api/evaluacion/casos');
  },

  /**
   * Ejecuta la evaluación determinista de un caso contra la versión vigente de umbrales
   */
  async evaluarCaso(idCaso: string, idFlujo: string = 'reembolso-gastos-medicos'): Promise<RespuestaEvaluarCaso> {
    return request<RespuestaEvaluarCaso>('/api/evaluacion/evaluar', {
      method: 'POST',
      body: JSON.stringify({ idCaso, idFlujo }),
    });
  },

  /**
   * Obtiene la lista histórica de auditoría de casos evaluados
   */
  async obtenerHistorial(): Promise<{ total: number; evaluaciones: ElementoHistorialEvaluacion[] }> {
    return request<{ total: number; evaluaciones: ElementoHistorialEvaluacion[] }>('/api/evaluacion/historial');
  },

  /**
   * Reevalúa deterministamente un expediente histórico contra la versión original de umbrales
   */
  async reevaluarHistorico(idEvaluacion: string): Promise<ResultadoReevaluacionHistorica> {
    return request<ResultadoReevaluacionHistorica>('/api/evaluacion/reevaluar-historico', {
      method: 'POST',
      body: JSON.stringify({ idEvaluacion }),
    });
  },
};

/**
 * MIRA — Plataforma de Inteligencia Multimodal para Decisiones Empresariales
 * Contrato de Datos Unificado F5 (Gestión de Umbrales) + F4 (Motor de Decisión)
 * Fuentes: data-model.md §3 y §4, y contracts/*.md (sección HTTP)
 */

// data-model.md §4 (EstadoVersionUmbrales: estados del ciclo de vida de una versión de umbrales)
export type EstadoVersionUmbrales = 'BORRADOR' | 'APROBADO' | 'DESESTIMADO';

// data-model.md §4 (DecisionSistema: decisiones resolutivas exclusivas emitidas por el sistema)
export type DecisionSistema = 'APROBADO_AUTOMATICO' | 'DERIVADO_REVISION';

// data-model.md §4 (MotivoDecision: causas técnicas estructuradas de la decisión según precedencia)
export type MotivoDecision =
  | 'aprobado'
  | 'alerta_fraude'
  | 'senal_bajo_minimo'
  | 'puntaje_bajo_umbral';

// data-model.md §4 (RolUsuario: roles autorizados para operar en la plataforma MIRA)
export type RolUsuario = 'Diseñador' | 'Administrador' | 'Operador';

// data-model.md §4 (IdentidadSimulada: catálogo cerrado de las 5 identidades fijas preconfiguradas)
export type IdentidadSimulada =
  | 'Diseñador 1'
  | 'Diseñador 2'
  | 'Administrador 1'
  | 'Administrador 2'
  | 'Operador 1';

// data-model.md §3, columna senales_bajo_minimo y contracts/api-evaluacion-f4.md (ejemplo de senalesBajoMinimo) (NombreSenal: catálogo cerrado de señales cuantitativas evaluables)
export type NombreSenal =
  | 'autenticidad_documentos'
  | 'cruce_fuentes'
  | 'coherencia_solicitud';

// data-model.md §4 (UmbralesFlujo: parámetros normativos, ponderaciones y auditoría de un flujo)
export interface UmbralesFlujo {
  /** Identificador del flujo de negocio (ej. 'reembolso-gastos-medicos') */
  idFlujo: string;
  /** Número correlativo ascendente asignado al crear el borrador (conservado si se desestima) */
  version: number;
  /** Corte mínimo para aprobación automática (por defecto 90.0, DEC-01) */
  umbralAprobacion: number;
  /** Corte bajo el cual se activa advertencia de riesgo alto (por defecto 60.0, Clarify P3) */
  umbralRiesgoAlto: number;

  // Mínimos individuales por señal (rango 0 a 100 inclusive, D-07, Clarify P1)
  minimoAutenticidad: number;
  minimoCruceFuentes: number;
  minimoCoherencia: number;

  // Ponderaciones relativas (deben sumar exactamente 1.00, D-08, Clarify P1)
  pesoAutenticidad: number;
  pesoCruceFuentes: number;
  pesoCoherencia: number;

  // Auditoría y ciclo de vida de doble control (D-04, PF-033, Clarify P2)
  proponente: string;
  aprobador?: string | null;
  fechaPropuesta: string;
  fechaResolucion?: string | null;
  estado: EstadoVersionUmbrales;
}

// data-model.md §4 (SenalesCaso: vector analítico cuantitativo y alerta de fraude de un expediente)
export interface SenalesCaso {
  autenticidad_documentos: number; // 0 a 100
  cruce_fuentes: number;           // 0 a 100
  coherencia_solicitud: number;    // 0 a 100
  alertaFraudeActiva: boolean;
}

// data-model.md §4 (CasoPrueba: expediente médico sintético preconfigurado con resultado esperado)
export interface CasoPrueba {
  idCaso: string;
  prestacion?: string;
  senales: SenalesCaso;
  resultadoEsperado: {
    decision: DecisionSistema;
    motivo: MotivoDecision;
    riesgoAltoRechazo: boolean;
  };
}

// data-model.md §4 (ResultadoEvaluacion: dictamen determinista e inmutable emitido por el motor F4)
export interface ResultadoEvaluacion {
  idEvaluacion: string;
  idCaso: string;
  /** Identificador del flujo de negocio evaluado (DDL auditoria_evaluaciones data-model.md §3, columna id_flujo) */
  idFlujo: string;
  /** Puntaje global exacto sin redondear obtenido por la agregación ponderada (RN-03) */
  scoreGlobal: number;
  /** Decisión estricta del sistema: nunca es 'RECHAZADO' (DEC-08, Principio I) */
  decision: DecisionSistema;
  /** Motivo gobernado por la precedencia estricta de RN-04 */
  motivo: MotivoDecision;
  /**
   * Advertencia informativa de severidad visual para el operador ("Riesgo alto de rechazo: decide un operador").
   * Se activa (true) si se cumple al menos una de dos condiciones:
   * 1. conteo(señales bajo mínimo) >= 2, O
   * 2. scoreGlobal < umbralRiesgoAlto (60 por defecto).
   * Bajo ninguna circunstancia altera la decisión (mantiene DERIVADO_REVISION).
   */
  riesgoAltoRechazo: boolean;
  /** Nombres de las señales que cayeron bajo su respectivo mínimo propio */
  senalesBajoMinimo: NombreSenal[];
  /** Desglose numérico puntual de las tres señales evaluadas */
  desgloseComponentes: {
    autenticidad: number;
    cruceFuentes: number;
    coherencia: number;
  };
  /** Vector exacto de señales de entrada utilizado para la evaluación (base de reproducibilidad SC-004) */
  senalesInsumo: SenalesCaso;
  /** Identidad del usuario operador que ejecutó la evaluación (DDL auditoria_evaluaciones data-model.md §3, columna usuario_operador) */
  usuarioOperador: string;
  /** Versión inmutable de umbrales aplicada en el dictamen */
  versionUmbralesAplicada: number;
  /** Estampa temporal ISO 8601 UTC de la evaluación */
  timestamp: string;
}

// ============================================================================
// Tipos de la capa HTTP (contracts/*.md)
// ============================================================================

// contracts/session-simulada.md:27-31 (UsuarioActivo: objeto de usuario activo retornado por la sesión simulada)
export interface UsuarioActivo {
  nombre: IdentidadSimulada;
  rol: RolUsuario;
  descripcion: string;
}

/**
 * contracts/api-evaluacion-f4.md:139-156, 166-185 (RespuestaEvaluarCaso: respuesta HTTP del endpoint POST /api/evaluacion/evaluar)
 * Omite idFlujo, senalesInsumo y usuarioOperador: en contracts/api-evaluacion-f4.md, idFlujo solo aparece en la petición
 * (líneas 114-126) y senalesInsumo/usuarioOperador solo en el historial (líneas 208 y 214), no en los ejemplos de respuesta
 * de POST /evaluar (líneas 139-185); los ejemplos del contrato no documentan estos campos; no asumirlos hasta que el contrato se actualice.
 */
export type RespuestaEvaluarCaso = Omit<
  ResultadoEvaluacion,
  'idFlujo' | 'senalesInsumo' | 'usuarioOperador'
> & {
  /** Representación formateada en string del puntaje para despliegue visual (ej. "94.0", "40.0") */
  scoreVisual: string;
  /** Mensaje explicativo estructurado para la bandeja del operador */
  mensajeOperador: string;
};

// Alias de conveniencia para la respuesta de evaluación
export type RespuestaEvaluacion = RespuestaEvaluarCaso;

// contracts/api-evaluacion-f4.md:200-216 (ElementoHistorialEvaluacion: ítem retornado en la lista de auditoría histórica de evaluaciones)
export interface ElementoHistorialEvaluacion {
  idEvaluacion: string;
  idCaso: string;
  versionUmbralesAplicada: number;
  scoreGlobal: number;
  decision: DecisionSistema;
  motivo: MotivoDecision;
  riesgoAltoRechazo: boolean;
  senalesInsumo: SenalesCaso;
  usuarioOperador: string;
  timestamp: string;
}

// contracts/api-umbrales-f5.md:54-70 (ElementoHistorialVersionUmbrales: ítem del array de versiones en historial de umbrales)
export interface ElementoHistorialVersionUmbrales {
  version: number;
  umbralAprobacion: number;
  umbralRiesgoAlto: number;
  minimoAutenticidad: number;
  minimoCruceFuentes: number;
  minimoCoherencia: number;
  pesoAutenticidad: number;
  pesoCruceFuentes: number;
  pesoCoherencia: number;
  proponente: string;
  aprobador?: string | null;
  fechaPropuesta: string;
  fechaResolucion?: string | null;
  estado: EstadoVersionUmbrales;
}

// contracts/api-umbrales-f5.md:215-221, 250-256 (VersionUmbralesResumida: estructura reducida retornada al aprobar o desestimar un borrador)
export interface VersionUmbralesResumida {
  idFlujo: string;
  version: number;
  estado: EstadoVersionUmbrales;
  aprobador: string;
  fechaResolucion: string;
}

export type VersionAprobadaResumida = VersionUmbralesResumida;
export type VersionDesestimadaResumida = VersionUmbralesResumida;

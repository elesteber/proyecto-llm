/**
 * MIRA — Hook reactivo de Evaluación de Casos y Motor de Decisión F4
 * Conforme a contratos: api-evaluacion-f4.md, data-model.md §4
 * Cumple: T012, FR-007, FR-008, AC-1..AC-6, Principio I, Principio II
 */

import { useState, useEffect, useCallback } from 'react';
import { evaluacionApi } from '../services/api-client';
import type { CasoPrueba, RespuestaEvaluarCaso, DecisionSistema, MotivoDecision } from '../../shared/types';

/**
 * Catálogo local determinista de los 6 casos de prueba sintéticos de reembolso médico
 * Copiados textualmente de contracts/api-evaluacion-f4.md y guía §2.d (D-02)
 */
export const CASOS_SINTETICOS_BASE: CasoPrueba[] = [
  {
    idCaso: 'CASO-MED-001',
    prestacion: 'Consulta médica de medicina general (45.000 CLP) [guía §2.d]',
    senales: {
      autenticidad_documentos: 95.0,
      cruce_fuentes: 95.0,
      coherencia_solicitud: 90.0,
      alertaFraudeActiva: false,
    },
    resultadoEsperado: {
      decision: 'APROBADO_AUTOMATICO',
      motivo: 'aprobado',
      riesgoAltoRechazo: false,
    },
  },
  {
    idCaso: 'CASO-MED-002',
    prestacion: 'Exámenes de laboratorio de sangre (120.000 CLP) [guía §2.d]',
    senales: {
      autenticidad_documentos: 100.0,
      cruce_fuentes: 100.0,
      coherencia_solicitud: 55.0,
      alertaFraudeActiva: false,
    },
    resultadoEsperado: {
      decision: 'DERIVADO_REVISION',
      motivo: 'senal_bajo_minimo',
      riesgoAltoRechazo: false,
    },
  },
  {
    idCaso: 'CASO-MED-003',
    prestacion: 'Reembolso de medicamentos de alto costo (280.000 CLP) [guía §2.d]',
    senales: {
      autenticidad_documentos: 95.0,
      cruce_fuentes: 95.0,
      coherencia_solicitud: 90.0,
      alertaFraudeActiva: true,
    },
    resultadoEsperado: {
      decision: 'DERIVADO_REVISION',
      motivo: 'alerta_fraude',
      riesgoAltoRechazo: false,
    },
  },
  {
    idCaso: 'CASO-MED-004',
    prestacion: 'Procedimiento quirúrgico ambulatorio (650.000 CLP) [guía §2.d]',
    senales: {
      autenticidad_documentos: 40.0,
      cruce_fuentes: 40.0,
      coherencia_solicitud: 60.0,
      alertaFraudeActiva: false,
    },
    resultadoEsperado: {
      decision: 'DERIVADO_REVISION',
      motivo: 'senal_bajo_minimo',
      riesgoAltoRechazo: true,
    },
  },
  {
    idCaso: 'CASO-MED-005',
    prestacion: 'Sesiones de kinesiología y rehabilitación (180.000 CLP) [guía §2.d]',
    senales: {
      autenticidad_documentos: 75.0,
      cruce_fuentes: 75.0,
      coherencia_solicitud: 75.0,
      alertaFraudeActiva: false,
    },
    resultadoEsperado: {
      decision: 'DERIVADO_REVISION',
      motivo: 'puntaje_bajo_umbral',
      riesgoAltoRechazo: false,
    },
  },
  {
    idCaso: 'CASO-MED-006',
    prestacion: 'Hospitalización y urgencia médica (1.450.000 CLP) [guía §2.d]',
    senales: {
      autenticidad_documentos: 0.0,
      cruce_fuentes: 70.0,
      coherencia_solicitud: 60.0,
      alertaFraudeActiva: false,
    },
    resultadoEsperado: {
      decision: 'DERIVADO_REVISION',
      motivo: 'senal_bajo_minimo',
      riesgoAltoRechazo: true,
    },
  },
];

/**
 * Función de simulación determinista en cliente según Principios I y II
 * (Utilizada cuando el backend Express :3001 está en preparación)
 */
function simularEvaluacionLocal(caso: CasoPrueba): RespuestaEvaluarCaso {
  const { autenticidad_documentos, cruce_fuentes, coherencia_solicitud, alertaFraudeActiva } = caso.senales;

  // Cálculo ponderado estándar v1: 0.40·aut + 0.40·cruce + 0.20·coh
  const scoreGlobal =
    0.4 * autenticidad_documentos + 0.4 * cruce_fuentes + 0.2 * coherencia_solicitud;

  // Detección de señales bajo mínimo v1 (Aut: 70, Cruce: 70, Coh: 60)
  const senalesBajoMinimo: ('autenticidad_documentos' | 'cruce_fuentes' | 'coherencia_solicitud')[] = [];
  if (autenticidad_documentos < 70) senalesBajoMinimo.push('autenticidad_documentos');
  if (cruce_fuentes < 70) senalesBajoMinimo.push('cruce_fuentes');
  if (coherencia_solicitud < 60) senalesBajoMinimo.push('coherencia_solicitud');

  // Precedencia estricta (Principio II):
  // 1. Alerta de Fraude -> DERIVADO_REVISION, motivo 'alerta_fraude'
  // 2. Señal bajo mínimo -> DERIVADO_REVISION, motivo 'senal_bajo_minimo'
  // 3. Score >= 90 -> APROBADO_AUTOMATICO, motivo 'aprobado'
  // 4. En otro caso -> DERIVADO_REVISION, motivo 'puntaje_bajo_umbral'
  let decision: DecisionSistema;
  let motivo: MotivoDecision;
  let mensajeOperador: string;

  if (alertaFraudeActiva) {
    decision = 'DERIVADO_REVISION';
    motivo = 'alerta_fraude';
    mensajeOperador =
      'Expediente derivado a revisión prioritaria por detección de alerta de fraude documental activa.';
  } else if (senalesBajoMinimo.length > 0) {
    decision = 'DERIVADO_REVISION';
    motivo = 'senal_bajo_minimo';
    mensajeOperador = `Expediente derivado a revisión: ${senalesBajoMinimo.length} señal(es) no alcanza(n) el umbral mínimo individual.`;
  } else if (scoreGlobal >= 90.0) {
    decision = 'APROBADO_AUTOMATICO';
    motivo = 'aprobado';
    mensajeOperador =
      'Expediente cumple holgadamente con todos los criterios y umbral normativo. Aprobación automática confirmada.';
  } else {
    decision = 'DERIVADO_REVISION';
    motivo = 'puntaje_bajo_umbral';
    mensajeOperador =
      'Expediente en rango intermedio: puntaje global inferior al umbral de corte para aprobación automática.';
  }

  // Advertencia informativa de riesgo alto (Principio I: conteo >= 2 || score < 60)
  // ¡Bajo ninguna circunstancia altera la decisión (se mantiene DERIVADO_REVISION)!
  const riesgoAltoRechazo = senalesBajoMinimo.length >= 2 || scoreGlobal < 60.0;

  return {
    idEvaluacion: `eval-sim-${Date.now()}`,
    idCaso: caso.idCaso,
    scoreGlobal: Number(scoreGlobal.toFixed(1)),
    scoreVisual: scoreGlobal.toFixed(1),
    decision,
    motivo,
    riesgoAltoRechazo,
    senalesBajoMinimo,
    desgloseComponentes: {
      autenticidad: autenticidad_documentos,
      cruceFuentes: cruce_fuentes,
      coherencia: coherencia_solicitud,
    },
    versionUmbralesAplicada: 1,
    mensajeOperador,
    timestamp: new Date().toISOString(),
  };
}

export interface UseEvaluacionReturn {
  casos: CasoPrueba[];
  casoSeleccionado: CasoPrueba | null;
  resultado: RespuestaEvaluarCaso | null;
  cargando: boolean;
  evaluando: boolean;
  error: string | null;
  backendConectado: boolean;
  seleccionarCaso: (idCaso: string) => void;
  ejecutarEvaluacion: (idCaso?: string) => Promise<void>;
  limpiarResultado: () => void;
}

export function useEvaluacion(): UseEvaluacionReturn {
  const [casos, setCasos] = useState<CasoPrueba[]>(CASOS_SINTETICOS_BASE);
  const [casoSeleccionado, setCasoSeleccionado] = useState<CasoPrueba | null>(CASOS_SINTETICOS_BASE[0]);
  const [resultado, setResultado] = useState<RespuestaEvaluarCaso | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [evaluando, setEvaluando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [backendConectado, setBackendConectado] = useState<boolean>(false);

  // Cargar catálogo de casos desde la API o fallback
  useEffect(() => {
    let cancelado = false;
    async function cargarCasos() {
      setCargando(true);
      try {
        const respuesta = await evaluacionApi.obtenerCasos();
        if (!cancelado && Array.isArray(respuesta) && respuesta.length > 0) {
          setCasos(respuesta);
          setCasoSeleccionado(respuesta[0]);
          setBackendConectado(true);
        }
      } catch {
        if (!cancelado) {
          // El backend aún no responde: usamos catálogo sintético base
          setCasos(CASOS_SINTETICOS_BASE);
          setCasoSeleccionado(CASOS_SINTETICOS_BASE[0]);
          setBackendConectado(false);
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    }
    cargarCasos();
    return () => {
      cancelado = true;
    };
  }, []);

  const seleccionarCaso = useCallback(
    (idCaso: string) => {
      const encontrado = casos.find((c) => c.idCaso === idCaso);
      if (encontrado) {
        setCasoSeleccionado(encontrado);
        setError(null);
      }
    },
    [casos]
  );

  const ejecutarEvaluacion = useCallback(
    async (idCasoParaEvaluar?: string) => {
      const targetId = idCasoParaEvaluar || casoSeleccionado?.idCaso;
      if (!targetId) {
        setError('Debe seleccionar un expediente antes de ejecutar la evaluación.');
        return;
      }

      const casoActual = casos.find((c) => c.idCaso === targetId) || casoSeleccionado;
      if (!casoActual) return;

      setEvaluando(true);
      setError(null);

      try {
        const respuesta = await evaluacionApi.evaluarCaso(targetId);
        setResultado(respuesta);
        setBackendConectado(true);
      } catch {
        // En modo desacoplado, resolvemos mediante la simulación determinista canónica
        const simulacion = simularEvaluacionLocal(casoActual);
        setResultado(simulacion);
        setBackendConectado(false);
      } finally {
        setEvaluando(false);
      }
    },
    [casos, casoSeleccionado]
  );

  const limpiarResultado = useCallback(() => {
    setResultado(null);
    setError(null);
  }, []);

  return {
    casos,
    casoSeleccionado,
    resultado,
    cargando,
    evaluando,
    error,
    backendConectado,
    seleccionarCaso,
    ejecutarEvaluacion,
    limpiarResultado,
  };
}

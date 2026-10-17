import {
  SenalesCaso,
  UmbralesFlujo,
  DecisionSistema,
  MotivoDecision,
  NombreSenal,
} from '@shared/types';

export interface EvaluacionDictamen {
  scoreGlobal: number;
  scoreVisual: string;
  decision: DecisionSistema;
  motivo: MotivoDecision;
  riesgoAltoRechazo: boolean;
  mensajeOperador: string;
  senalesBajoMinimo: NombreSenal[];
  desgloseComponentes: {
    autenticidad: number;
    cruceFuentes: number;
    coherencia: number;
  };
}

export class EvaluacionEngine {
  /**
   * Calcula el puntaje global ponderado continuo sin redondear (RN-03)
   */
  calcularScoreGlobal(senales: SenalesCaso, umbrales: UmbralesFlujo): number {
    const score =
      umbrales.pesoAutenticidad * senales.autenticidad_documentos +
      umbrales.pesoCruceFuentes * senales.cruce_fuentes +
      umbrales.pesoCoherencia * senales.coherencia_solicitud;

    // Redondear suavemente a 4 decimales para eliminar artefactos de punto flotante de JS (ej. 93.99999999999999)
    return Math.round(score * 10000) / 10000;
  }

  /**
   * Ejecuta la evaluación determinista según el orden de precedencia estricto (RN-04)
   * Precedencia:
   * 1. Alerta de fraude activa -> DERIVADO_REVISION ('alerta_fraude')
   * 2. Señal bajo su mínimo propio -> DERIVADO_REVISION ('senal_bajo_minimo')
   * 3. Score global >= umbral de aprobación -> APROBADO_AUTOMATICO ('aprobado')
   * 4. Score global < umbral de aprobación -> DERIVADO_REVISION ('puntaje_bajo_umbral')
   *
   * Invariante Constitucional: La decisión es estrictamente APROBADO_AUTOMATICO o DERIVADO_REVISION.
   * Prohibido terminantemente el estado "RECHAZADO" (Principio I).
   */
  evaluar(senales: SenalesCaso, umbrales: UmbralesFlujo): EvaluacionDictamen {
    const scoreGlobal = this.calcularScoreGlobal(senales, umbrales);
    const scoreVisual = scoreGlobal.toFixed(1);

    const desgloseComponentes = {
      autenticidad: senales.autenticidad_documentos,
      cruceFuentes: senales.cruce_fuentes,
      coherencia: senales.coherencia_solicitud,
    };

    // Detección de señales bajo mínimo propio
    const senalesBajoMinimo: NombreSenal[] = [];
    if (senales.autenticidad_documentos < umbrales.minimoAutenticidad) {
      senalesBajoMinimo.push('autenticidad_documentos');
    }
    if (senales.cruce_fuentes < umbrales.minimoCruceFuentes) {
      senalesBajoMinimo.push('cruce_fuentes');
    }
    if (senales.coherencia_solicitud < umbrales.minimoCoherencia) {
      senalesBajoMinimo.push('coherencia_solicitud');
    }

    // Cálculo de advertencia informativa de riesgo alto (RN-05, Clarify P3)
    const riesgoAltoRechazo =
      senalesBajoMinimo.length >= 2 || scoreGlobal < umbrales.umbralRiesgoAlto;

    let decision: DecisionSistema;
    let motivo: MotivoDecision;
    let mensajeOperador: string;

    if (senales.alertaFraudeActiva) {
      // Paso 1: Fraude anula puntaje
      decision = 'DERIVADO_REVISION';
      motivo = 'alerta_fraude';
      mensajeOperador = 'Expediente derivado a revisión por sospecha de fraude.';
    } else if (senalesBajoMinimo.length > 0) {
      // Paso 2: Caída bajo mínimo anula puntaje
      decision = 'DERIVADO_REVISION';
      motivo = 'senal_bajo_minimo';
      mensajeOperador = riesgoAltoRechazo
        ? 'Riesgo alto de rechazo: decide un operador'
        : 'Expediente derivado a revisión por señal bajo el mínimo exigido.';
    } else if (scoreGlobal >= umbrales.umbralAprobacion) {
      // Paso 3: Aprobación automática
      decision = 'APROBADO_AUTOMATICO';
      motivo = 'aprobado';
      mensajeOperador = 'Expediente aprobado automáticamente.';
    } else {
      // Paso 4: Puntaje bajo umbral
      decision = 'DERIVADO_REVISION';
      motivo = 'puntaje_bajo_umbral';
      mensajeOperador = riesgoAltoRechazo
        ? 'Riesgo alto de rechazo: decide un operador'
        : 'Expediente derivado a revisión por puntaje bajo el umbral de aprobación.';
    }

    return {
      scoreGlobal,
      scoreVisual,
      decision,
      motivo,
      riesgoAltoRechazo,
      mensajeOperador,
      senalesBajoMinimo,
      desgloseComponentes,
    };
  }
}

export const evaluacionEngine = new EvaluacionEngine();

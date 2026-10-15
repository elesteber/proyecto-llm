# Modelo de Datos y Contratos de Entidades (Phase 1)

**Incremento:** F5 (Configuración y Gestión de Umbrales) + F4 (Evaluación y Decisión por Umbrales)  
**Ruta:** `specs/001-f5-f4-umbrales-evaluacion/data-model.md`  
**Estado:** Propuesto; pendiente de revisión de Rodrigo y Jorge (Compuerta 3)  
**Fecha:** 2026-10-14  

---

## 1. Entidades del Dominio y Atributos

El modelo de datos formaliza los conceptos del flujo de reembolso de gastos médicos (MIRA §5.2) conforme a los requisitos de F5 (`RQF-039 [fase5-lester]`, `RQF-044 [final-final]`, `RQF-B09 [PDF pág. 9]`), F4 (`RQF-040 [fase5-lester]`, `RQF-041 [fase5-lester]`, `RQF-020 [fase5-lester]`, `RQF-023 [fase5-lester]`, `RQF-043 [final-final]`), la reproducibilidad histórica (`RQNF-002 [fase5-lester]` / `RQNF-003 [final-final]`, `SC-004`) y las decisiones ratificadas en `clarificaciones.md`.

### 1.1 Entidad: Versión de Umbrales (`UmbralesFlujo`)
Representa una configuración paramétrica completa e independiente para un flujo de negocio (F5).
- **`idFlujo`** (`string`): Identificador único del flujo (ej. `'reembolso-gastos-medicos'`).
- **`version`** (`integer`): Número de versión correlativo ascendente (1, 2, 3...).
- **`umbralAprobacion`** (`number`): Corte mínimo para aprobación automática (por defecto `90.0`). Rango: `[0, 100]`.
- **`umbralRiesgoAlto`** (`number`): Corte bajo el cual se activa advertencia de riesgo alto (por defecto `60.0`). Rango: `[0, 100]`.
- **`minimoAutenticidad`** (`number`): Mínimo propio para la señal `autenticidad_documentos` (por defecto `70.0`). Rango: `[0, 100]`.
- **`minimoCruceFuentes`** (`number`): Mínimo propio para la señal `cruce_fuentes` (por defecto `70.0`). Rango: `[0, 100]`.
- **`minimoCoherencia`** (`number`): Mínimo propio para la señal `coherencia_solicitud` (por defecto `60.0`). Rango: `[0, 100]`.
- **`pesoAutenticidad`** (`number`): Ponderación de autenticidad (por defecto `0.40`). Rango: `[0.00, 1.00]`.
- **`pesoCruceFuentes`** (`number`): Ponderación de cruce de fuentes (por defecto `0.40`). Rango: `[0.00, 1.00]`.
- **`pesoCoherencia`** (`number`): Ponderación de coherencia (por defecto `0.20`). Rango: `[0.00, 1.00]`.
- **`proponente`** (`string`): Identidad del usuario que formuló la propuesta (rol Diseñador o Administrador).
- **`aprobador`** (`string | null`): Identidad del usuario Administrador independiente que resolvió la propuesta (obligatorio si `estado !== 'BORRADOR'`).
- **`fechaPropuesta`** (`string` ISO 8601 UTC): Momento de creación del borrador.
- **`fechaResolucion`** (`string | null` ISO 8601 UTC): Momento en que la propuesta fue aprobada o desestimada.
- **`estado`** (`enum`): Estado en el ciclo de vida: `'BORRADOR'`, `'APROBADO'` o `'DESESTIMADO'`.

### 1.2 Entidad: Señales del Caso (`SenalesCaso`)
Representa el vector de entrada precalculado para un expediente médico sometido a evaluación en F4.
- **`autenticidad_documentos`** (`number`): Calidad e integridad documental. Rango: `[0, 100]`.
- **`cruce_fuentes`** (`number`): Concordancia entre prestador, asegurado y boleta. Rango: `[0, 100]`.
- **`coherencia_solicitud`** (`number`): Coherencia clínica de los diagnósticos y prestaciones. Rango: `[0, 100]`.
- **`alertaFraudeActiva`** (`boolean`): Bandera independiente que alerta patrones conocidos de fraude.

### 1.3 Entidad: Resultado de Evaluación (`ResultadoEvaluacion`)
Representa la resolución determinista inmutable producida por el motor de F4.
- **`idEvaluacion`** (`string` UUID): Identificador unívoco del registro de evaluación.
- **`idCaso`** (`string`): Identificador del caso de prueba evaluado (ej. `'CASO-MED-001'`).
- **`scoreGlobal`** (`number`): Valor numérico exacto sin redondear, producto de la fórmula lineal ponderada (`0.40*aut + 0.40*cruce + 0.20*coh`).
- **`decision`** (`enum`): `'APROBADO_AUTOMATICO'` | `'DERIVADO_REVISION'`. (Prohibido emitir "rechazado").
- **`motivo`** (`enum`): Causa técnica gobernada por el orden de precedencia RN-04:
  - `'aprobado'`
  - `'alerta_fraude'`
  - `'senal_bajo_minimo'`
  - `'puntaje_bajo_umbral'`
- **`riesgoAltoRechazo`** (`boolean`): Advertencia visual de severidad para el operador humano. Se activa (`true`) si:
  `conteo(señales bajo mínimo) >= 2 || scoreGlobal < umbralRiesgoAlto`.
- **`senalesBajoMinimo`** (`string[]`): Lista de nombres de las señales que no alcanzaron su respectivo mínimo propio.
- **`desgloseComponentes`** (`object`): Valores puntuales de `{ autenticidad, cruceFuentes, coherencia }`.
- **`senalesInsumo`** (`SenalesCaso`): Vector completo de entrada utilizado para la evaluación, preservado para auditoría.
- **`versionUmbralesAplicada`** (`integer`): Número de versión de umbrales vigente empleada para el dictamen.
- **`timestamp`** (`string` ISO 8601 UTC): Estampa de tiempo exacta de la evaluación.

---

## 2. Ciclo de Vida y Transiciones de Estado de Umbrales

```
                  [Diseñador propone]
                          │
                          ▼
                  ┌───────────────┐
                  │   BORRADOR    │ <─── (Visible para Administradores)
                  └───────┬───────┘
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼ [Administrador aprueba]         ▼ [Administrador desestima]
  ┌──────────────┐                  ┌──────────────┐
  │   APROBADO   │                  │ DESESTIMADO  │
  └──────────────┘                  └──────────────┘
  (Vigente inmutable)               (Histórico descartado)
```

| Estado Origen | Evento / Acción | Rol Ejecutor | Estado Destino | Regla de Validación y Restricciones |
| :--- | :--- | :--- | :--- | :--- |
| *(Ninguno)* | `Crear Borrador` | Diseñador 1 o 2 (o Admin) | `BORRADOR` | Bloqueado si ya existe otro `BORRADOR` activo en el flujo. Valida sum(pesos)=1.00, rangos 0..100 y `umbralAprobacion > umbralRiesgoAlto`. |
| `BORRADOR` | `Enviar a revisión administrativa` | Diseñador | `BORRADOR` | **No cambia de estado.** El borrador permanece visible en la bandeja de los Administradores `[SUPUESTO del equipo]`. |
| `BORRADOR` | `Aprobar Borrador` | Administrador 1 o 2 | `APROBADO` | **Regla de Incompatibilidad:** `aprobador !== proponente` (D-04, PF-033). Asigna nuevo número de `version` correlativo. Se convierte en la versión vigente operativa. |
| `BORRADOR` | `Desestimar Borrador` | Administrador 1 o 2 | `DESESTIMADO` | **Regla de Incompatibilidad:** `aprobador !== proponente`. El borrador queda archivado sin entrar en vigencia. Libera el flujo para nuevas propuestas. |
| `APROBADO` | *(Cualquiera)* | *(Ninguno)* | *(Inmutable)* | Queda estrictamente prohibido modificar o eliminar versiones aprobadas (`D-03`, `D-05`). |
| `DESESTIMADO` | *(Cualquiera)* | *(Ninguno)* | *(Inmutable)* | Queda estrictamente prohibido modificar o reactivar versiones desestimadas. |

---

## 3. Esquema Físico Relacional SQLite

```sql
-- Tabla 1: Versiones de Umbrales (F5)
CREATE TABLE IF NOT EXISTS umbrales_flujo (
    id_flujo TEXT NOT NULL,
    version INTEGER NOT NULL,
    umbral_aprobacion REAL NOT NULL CHECK(umbral_aprobacion >= 0 AND umbral_aprobacion <= 100),
    umbral_riesgo_alto REAL NOT NULL CHECK(umbral_riesgo_alto >= 0 AND umbral_riesgo_alto <= 100),
    minimo_autenticidad REAL NOT NULL CHECK(minimo_autenticidad >= 0 AND minimo_autenticidad <= 100),
    minimo_cruce_fuentes REAL NOT NULL CHECK(minimo_cruce_fuentes >= 0 AND minimo_cruce_fuentes <= 100),
    minimo_coherencia REAL NOT NULL CHECK(minimo_coherencia >= 0 AND minimo_coherencia <= 100),
    peso_autenticidad REAL NOT NULL CHECK(peso_autenticidad >= 0 AND peso_autenticidad <= 1),
    peso_cruce_fuentes REAL NOT NULL CHECK(peso_cruce_fuentes >= 0 AND peso_cruce_fuentes <= 1),
    peso_coherencia REAL NOT NULL CHECK(peso_coherencia >= 0 AND peso_coherencia <= 1),
    proponente TEXT NOT NULL,
    aprobador TEXT,
    fecha_propuesta TEXT NOT NULL,
    fecha_resolucion TEXT,
    estado TEXT NOT NULL CHECK(estado IN ('BORRADOR', 'APROBADO', 'DESESTIMADO')),
    PRIMARY KEY (id_flujo, version),
    CHECK(umbral_aprobacion > umbral_riesgo_alto),
    CHECK(ABS((peso_autenticidad + peso_cruce_fuentes + peso_coherencia) - 1.0) < 0.0001)
);

-- Índice para recuperar rápidamente la versión vigente (mayor version con estado APROBADO)
CREATE INDEX IF NOT EXISTS idx_umbrales_vigente 
ON umbrales_flujo (id_flujo, estado, version DESC);

-- Tabla 2: Auditoría y Registro Histórico de Evaluaciones (F4 / Reproducibilidad RQNF-002)
CREATE TABLE IF NOT EXISTS auditoria_evaluaciones (
    id_evaluacion TEXT PRIMARY KEY,
    id_caso TEXT NOT NULL,
    id_flujo TEXT NOT NULL,
    version_umbrales_aplicada INTEGER NOT NULL,
    score_global REAL NOT NULL,
    decision TEXT NOT NULL CHECK(decision IN ('APROBADO_AUTOMATICO', 'DERIVADO_REVISION')),
    motivo TEXT NOT NULL CHECK(motivo IN ('aprobado', 'alerta_fraude', 'senal_bajo_minimo', 'puntaje_bajo_umbral')),
    riesgo_alto_rechazo INTEGER NOT NULL CHECK(riesgo_alto_rechazo IN (0, 1)),
    senales_bajo_minimo TEXT NOT NULL, -- JSON array: ["cruce_fuentes"]
    desglose_componentes TEXT NOT NULL, -- JSON object
    senales_insumo TEXT NOT NULL, -- JSON object: vector de entrada exacto
    usuario_operador TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (id_flujo, version_umbrales_aplicada) REFERENCES umbrales_flujo(id_flujo, version)
);

-- Tabla 3: Rastro de Auditoría Append-Only de Eventos de Umbrales (D-05)
CREATE TABLE IF NOT EXISTS auditoria_cambios_umbrales (
    id_evento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_flujo TEXT NOT NULL,
    version INTEGER NOT NULL,
    accion TEXT NOT NULL CHECK(accion IN ('PROPUESTA_CREADA', 'PROPUESTA_APROBADA', 'PROPUESTA_DESESTIMADA')),
    usuario TEXT NOT NULL,
    detalles_json TEXT NOT NULL,
    timestamp TEXT NOT NULL
);

-- Triggers de Inmutabilidad (D-05): Bloquean estrictamente UPDATE y DELETE en tablas de auditoría
CREATE TRIGGER IF NOT EXISTS trg_prevent_update_evaluaciones
BEFORE UPDATE ON auditoria_evaluaciones
BEGIN
    SELECT RAISE(ABORT, 'Violación de Inmutabilidad: Prohibido modificar registros de auditoría histórica de evaluaciones.');
END;

CREATE TRIGGER IF NOT EXISTS trg_prevent_delete_evaluaciones
BEFORE DELETE ON auditoria_evaluaciones
BEGIN
    SELECT RAISE(ABORT, 'Violación de Inmutabilidad: Prohibido eliminar registros de auditoría histórica de evaluaciones.');
END;

CREATE TRIGGER IF NOT EXISTS trg_prevent_update_auditoria_umbrales
BEFORE UPDATE ON auditoria_cambios_umbrales
BEGIN
    SELECT RAISE(ABORT, 'Violación de Inmutabilidad: Prohibido modificar el rastro de auditoría de umbrales.');
END;

CREATE TRIGGER IF NOT EXISTS trg_prevent_delete_auditoria_umbrales
BEFORE DELETE ON auditoria_cambios_umbrales
BEGIN
    SELECT RAISE(ABORT, 'Violación de Inmutabilidad: Prohibido eliminar el rastro de auditoría de umbrales.');
END;

-- Trigger para impedir edición de versiones de umbrales ya APROBADAS o DESESTIMADAS
CREATE TRIGGER IF NOT EXISTS trg_prevent_update_umbrales_cerrados
BEFORE UPDATE ON umbrales_flujo
FOR EACH ROW
WHEN OLD.estado IN ('APROBADO', 'DESESTIMADO')
BEGIN
    SELECT RAISE(ABORT, 'Violación de Inmutabilidad: Una versión de umbrales APROBADA o DESESTIMADA no puede ser modificada.');
END;
```

---

## 4. Contrato TypeScript Compartido (Bloque Propuesto)

> ⚠️ **NOTA METODOLÓGICA CONSTITUCIONAL (Principio VI):**  
> El siguiente bloque representa el contrato de datos formalizado que se commiteará bajo prefijo `[PLAN]` en la ruta `src/shared/types.ts` en la fase de implementación tras la aprobación de este plan. **No se crea código fuente antes de la aprobación.** Corrige y supera el borrador preliminar de Rodrigo, incorporando los 3 estados, segregación de proponente/aprobador, el vector `SenalesCaso`, las dos condiciones de `riesgoAltoRechazo` y los insumos exactos para reproducibilidad determinista histórica.

```typescript
/**
 * MIRA — Plataforma de Inteligencia Multimodal para Decisiones Empresariales
 * Contrato de Datos Unificado F5 (Gestión de Umbrales) + F4 (Motor de Decisión)
 * 
 * Normas de negocio:
 * - Cero rechazos automáticos (DEC-08, DEC-E2-06, DEC-E2-10(b), ENT6 [00:04:06])
 * - Precedencia estricta: fraude > señal bajo mínimo > puntaje >= umbralAprobacion (MIRA §3, RN-04)
 * - Versionamiento inmutable con segregación de doble control (D-03, D-04, PF-033)
 */

export type EstadoVersionUmbrales = 'BORRADOR' | 'APROBADO' | 'DESESTIMADO';

export type DecisionSistema = 'APROBADO_AUTOMATICO' | 'DERIVADO_REVISION';

export type MotivoDecision = 
  | 'aprobado'
  | 'alerta_fraude'
  | 'senal_bajo_minimo'
  | 'puntaje_bajo_umbral';

export type RolUsuario = 'Diseñador' | 'Administrador' | 'Operador';

export type IdentidadSimulada = 
  | 'Diseñador 1'
  | 'Diseñador 2'
  | 'Administrador 1'
  | 'Administrador 2'
  | 'Operador 1';

/**
 * F5: Parámetros de umbrales y ponderaciones de un flujo de negocio.
 * Satisface RQF-039 [fase5-lester], RQF-044 [final-final], RQF-B09 [PDF pág. 9], DEC-01, DEC-E2-10(a).
 */
export interface UmbralesFlujo {
  /** Identificador del flujo de negocio (ej. 'reembolso-gastos-medicos') */
  idFlujo: string;
  /** Número de versión correlativo ascendente (inmutable una vez aprobado) */
  version: number;
  /** Corte mínimo para aprobación automática (por defecto 90.0, DEC-01) */
  umbralAprobacion: number;
  /** Corte bajo el cual se activa advertencia de riesgo alto (por defecto 60.0, Clarify P3) */
  umbralRiesgoAlto: number;
  
  // Mínimos individuales por señal (rango 0 a 100 inclusive, D-07, Clarify P1)
  minimoAutenticidad: number;  // 70.0 [SUPUESTO del equipo]
  minimoCruceFuentes: number;  // 70.0 [SUPUESTO del equipo]
  minimoCoherencia: number;    // 60.0 [SUPUESTO del equipo]
  
  // Ponderaciones relativas (deben sumar exactamente 1.00, D-08, Clarify P1)
  pesoAutenticidad: number;    // 0.40 [SUPUESTO del equipo]
  pesoCruceFuentes: number;    // 0.40 [SUPUESTO del equipo]
  pesoCoherencia: number;      // 0.20 [SUPUESTO del equipo]
  
  // Auditoría y ciclo de vida de doble control (D-04, PF-033, Clarify P2)
  proponente: string;
  aprobador?: string;
  fechaPropuesta: string;      // ISO 8601 UTC
  fechaResolucion?: string;    // ISO 8601 UTC
  estado: EstadoVersionUmbrales;
}

/**
 * F4: Vector de señales numéricas y bandera de fraude de un expediente médico.
 * Satisface RQF-041 [fase5-lester], RQF-023 [fase5-lester], MIRA §2.6, Clarify P1.
 */
export interface SenalesCaso {
  autenticidad_documentos: number; // 0 a 100
  cruce_fuentes: number;           // 0 a 100
  coherencia_solicitud: number;    // 0 a 100
  alertaFraudeActiva: boolean;
}

/**
 * F4: Expediente médico sintético cargado desde data/casos_prueba.json.
 */
export interface CasoPrueba {
  idCaso: string;
  nombrePaciente: string;
  montoReclamado: number;
  descripcionClinica: string;
  senales: SenalesCaso;
  resultadoEsperado: {
    decision: DecisionSistema;
    motivo: MotivoDecision;
    riesgoAltoRechazo: boolean;
  };
}

/**
 * F4: Dictamen determinista inmutable emitido por el motor de evaluación.
 * Satisface RQF-040 [fase5-lester], RQF-020 [fase5-lester], RQF-043 [final-final],
 * DEC-08, DEC-E2-10(b), RQNF-002 [fase5-lester] (Reproducibilidad).
 */
export interface ResultadoEvaluacion {
  idEvaluacion: string;
  idCaso: string;
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
  senalesBajoMinimo: string[];
  /** Desglose numérico puntual de las tres señales evaluadas */
  desgloseComponentes: {
    autenticidad: number;
    cruceFuentes: number;
    coherencia: number;
  };
  /** Vector exacto de señales de entrada utilizado para la evaluación (base de reproducibilidad SC-004) */
  senalesInsumo: SenalesCaso;
  /** Versión inmutable de umbrales aplicada en el dictamen */
  versionUmbralesAplicada: number;
  /** Estampa temporal ISO 8601 UTC de la evaluación */
  timestamp: string;
}
```

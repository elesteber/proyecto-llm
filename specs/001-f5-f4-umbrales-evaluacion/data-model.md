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
- **`version`** (`integer`): Número secuencial asignado al momento de crear el borrador (`MAX(version) + 1`). Si una versión es desestimada, conserva su número asignado como registro histórico inmutable; por ende, "correlativo" significa estrictamente **ascendente con posibles huecos**. La versión vigente operativa es siempre la versión en estado `APROBADO` de mayor número.
- **`umbralAprobacion`** (`number`): Corte mínimo para aprobación automática (por defecto `90.0`, `DEC-01`). Rango: `[0, 100]`.
- **`umbralRiesgoAlto`** (`number`): Corte bajo el cual se activa advertencia de riesgo alto (por defecto `60.0`, `DEC-E2-10(b)`, `clarificaciones.md` P3). Rango: `[0, 100]`.
- **`minimoAutenticidad`** (`number`): Mínimo propio para la señal `autenticidad_documentos` (por defecto `70.0`, `D-07`, `clarificaciones.md` P1 `[SUPUESTO del equipo]`). Rango: `[0, 100]`.
- **`minimoCruceFuentes`** (`number`): Mínimo propio para la señal `cruce_fuentes` (por defecto `70.0`, `D-07`, `clarificaciones.md` P1 `[SUPUESTO del equipo]`). Rango: `[0, 100]`.
- **`minimoCoherencia`** (`number`): Mínimo propio para la señal `coherencia_solicitud` (por defecto `60.0`, `D-07`, `clarificaciones.md` P1 `[SUPUESTO del equipo]`). Rango: `[0, 100]`.
- **`pesoAutenticidad`** (`number`): Ponderación de autenticidad (por defecto `0.40`, `D-08`, `clarificaciones.md` P1 `[SUPUESTO del equipo]`). Rango: `[0.00, 1.00]`.
- **`pesoCruceFuentes`** (`number`): Ponderación de cruce de fuentes (por defecto `0.40`, `D-08`, `clarificaciones.md` P1 `[SUPUESTO del equipo]`). Rango: `[0.00, 1.00]`.
- **`pesoCoherencia`** (`number`): Ponderación de coherencia (por defecto `0.20`, `D-08`, `clarificaciones.md` P1 `[SUPUESTO del equipo]`). Rango: `[0.00, 1.00]`.
- **`proponente`** (`string`): Identidad del usuario que formuló la propuesta (rol Diseñador según `spec.md §5.1 FR-001` o Administrador per `(PF-033 [fase6/pruebas-funcionales.md, línea 69]: 'Un administrador ajusta el umbral y guarda el cambio')`). En la versión 1 inicial figura como `'sistema'`.
- **`aprobador`** (`string | null`): Identidad del usuario Administrador independiente que autorizó la propuesta (obligatorio si `estado === 'APROBADO'` o `'DESESTIMADO'` para versiones >= 2; `aprobador !== proponente`, `PF-033`). En la versión 1 inicial figura como `'carga inicial del sistema (valores por defecto)'` (no se inventan aprobaciones humanas; el doble control rige desde la versión 2).
- **`fechaPropuesta`** (`string` ISO 8601 UTC): Momento de creación del borrador.
- **`fechaResolucion`** (`string | null` ISO 8601 UTC): Momento en que la propuesta fue resuelta (aprobada o desestimada).
- **`estado`** (`enum`): Estado en el ciclo de vida: `'BORRADOR'`, `'APROBADO'` o `'DESESTIMADO'` (`D-03`, `clarificaciones.md` P2).

### 1.2 Entidad: Señales del Caso (`SenalesCaso`)
Representa el vector de entrada precalculado para un expediente médico sometido a evaluación en F4.
- **`autenticidad_documentos`** (`number`): Calidad e integridad documental. Rango: `[0, 100]`.
- **`cruce_fuentes`** (`number`): Concordancia entre prestador, asegurado y boleta. Rango: `[0, 100]`.
- **`coherencia_solicitud`** (`number`): Coherencia clínica de los diagnósticos y prestaciones. Rango: `[0, 100]`.
- **`alertaFraudeActiva`** (`boolean`): Bandera independiente que alerta sospecha o confirmación de fraude (precedencia máxima, MIRA §3, `DEC-E2-06`).

### 1.3 Entidad: Resultado de Evaluación (`ResultadoEvaluacion`)
Representa la resolución determinista inmutable producida por el motor de F4.
- **`idEvaluacion`** (`string` UUID): Identificador unívoco del registro de evaluación.
- **`idCaso`** (`string`): Identificador del caso de prueba evaluado (ej. `'CASO-MED-001'`).
- **`scoreGlobal`** (`number`): Valor numérico exacto sin redondear, producto de la fórmula lineal ponderada (`0.40·aut + 0.40·cruce + 0.20·coh`).
- **`decision`** (`enum`): Salidas exclusivas del sistema: `'APROBADO_AUTOMATICO'` o `'DERIVADO_REVISION'`. Prohibido terminantemente calificar la decisión del sistema como "rechazado" (`DEC-08`, `DEC-E2-10(b)`, Principio I).
- **`motivo`** (`enum`): Causa técnica gobernada por el orden de precedencia RN-04:
  - `'aprobado'`
  - `'alerta_fraude'`
  - `'senal_bajo_minimo'`
  - `'puntaje_bajo_umbral'`
- **`riesgoAltoRechazo`** (`boolean`): Advertencia informativa de severidad visual para el operador humano (*"Riesgo alto de rechazo: decide un operador"*). Se activa (`true`) si:
  `conteo(señales bajo mínimo) >= 2 || scoreGlobal < umbralRiesgoAlto`. Jamás altera la decisión (mantiene `DERIVADO_REVISION`).
- **`senalesBajoMinimo`** (`string[]`): Lista de nombres de las señales que no alcanzaron su respectivo mínimo propio.
- **`desgloseComponentes`** (`object`): Valores puntuales de `{ autenticidad, cruceFuentes, coherencia }`.
- **`senalesInsumo`** (`SenalesCaso`): Vector completo de entrada utilizado para la evaluación, preservado para auditoría y reproducibilidad histórica (`SC-004`).
- **`versionUmbralesAplicada`** (`integer`): Número de versión de umbrales aplicada en el dictamen.
- **`timestamp`** (`string` ISO 8601 UTC): Estampa de tiempo exacta de la evaluación.

### 1.4 Casos de Prueba Ficticios de Negocio (Copiados Exactamente de Guía §2.d)

A continuación se formaliza la tabla canónica con los datos de entrada, cálculo exacto de puntaje ponderado (`0,40·aut + 0,40·cruce + 0,20·coh`) y resultados esperados para los 6 casos de negocio (`CASO-MED-001` a `CASO-MED-006`) y la prueba unitaria `PU-1`, copiados exactamente de `entregable2/guia-implementacion-sdd.md §2.d`:

| Caso | Prestación / Evidencia (§2.d) | Señales de Entrada (`aut` / `cruce` / `coh` / `fraude`) | Cálculo Detallado del Puntaje Global (`0,40·aut + 0,40·cruce + 0,20·coh`) | Puntaje Global | Decisión Esperada | Motivo Esperado | Riesgo Alto Rechazo | Causa / Regla Aislada (§2.d) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`CASO-MED-001`** | Consulta medicina general (45.000 CLP); `boleta_consulta_001.pdf`, `receta_medica_001.jpg` | Aut: 95, Cruce: 95, Coh: 90, Fraude: **false** | `0.40·95 + 0.40·95 + 0.20·90 = 38.0 + 38.0 + 18.0` | **94.0** | `APROBADO_AUTOMATICO` | `'aprobado'` | `false` | Puntaje 94.0 ≥ 90, sin señales bajo mínimo, sin fraude (`DEC-01`). |
| **`CASO-MED-002`** | Exámenes laboratorio sangre (120.000 CLP); `orden_laboratorio_002.pdf`, `factura_clinica_002.pdf` | Aut: 100, Cruce: 100, **Coh: 55 (< 60)**, Fraude: **false** | `0.40·100 + 0.40·100 + 0.20·55 = 40.0 + 40.0 + 11.0` | **91.0** | `DERIVADO_REVISION` | `'senal_bajo_minimo'` | `false` | Coherencia 55 < mínimo 60 deriva pese a puntaje 91 ≥ 90 (`H-05`). |
| **`CASO-MED-003`** | Reembolso medicamentos alto costo (280.000 CLP); `boleta_farmacia_adulterada_003.jpg` | Aut: 95, Cruce: 95, Coh: 90, **Fraude: true** | `0.40·95 + 0.40·95 + 0.20·90 = 38.0 + 38.0 + 18.0` | **94.0** | `DERIVADO_REVISION` | `'alerta_fraude'` | `false` | Precedencia absoluta de alerta de fraude ignorando puntaje 94 (`DEC-E2-06`). |
| **`CASO-MED-004`** | Procedimiento ambulatorio (60.000 CLP); `recibo_ambulatorio_004.pdf` | **Aut: 40 (< 70)**, **Cruce: 40 (< 70)**, Coh: 60, Fraude: **false** | `0.40·40 + 0.40·40 + 0.20·60 = 16.0 + 16.0 + 12.0` | **44.0** | `DERIVADO_REVISION` | `'senal_bajo_minimo'` | **`true`** | Puntaje 44 < 60 y 2 señales bajo mínimo activan `riesgoAltoRechazo: true` sin rechazo automático (`DEC-08`, `DEC-E2-10`). |
| **`CASO-MED-005`** | Consulta médica especialista (50.000 CLP); `bono_consulta_005.pdf` | Aut: 75, Cruce: 75, Coh: 75, Fraude: **false** | `0.40·75 + 0.40·75 + 0.20·75 = 30.0 + 30.0 + 15.0` | **75.0** | `DERIVADO_REVISION` | `'puntaje_bajo_umbral'` | `false` | Todas las señales cumplen mínimos; puntaje en rango intermedio 60 ≤ 75 < 90. |
| **`CASO-MED-006`** | Reembolso exámenes complejos con documentación ilegible (95.000 CLP); `examen_complejo_006.pdf` | **Aut: 0 (< 70)**, Cruce: 70, Coh: 60, Fraude: **false** | `0.40·0 + 0.40·70 + 0.20·60 = 0.0 + 28.0 + 12.0` | **40.0** | `DERIVADO_REVISION` | `'senal_bajo_minimo'` | **`true`** | Deriva por autenticidad 0 < 70; activa riesgo alto por puntaje crítico 40.0 < 60 con 1 sola señal bajo mínimo. |
| **`PU-1`** | Prueba unitaria directa de motor (`backend/tests/unit/evaluacion-engine.test.ts`) | **Aut: 65 (< 70)**, **Cruce: 65 (< 70)**, Coh: 100, Fraude: **false** | `0.40·65 + 0.40·65 + 0.20·100 = 26.0 + 26.0 + 20.0` | **72.0** | `DERIVADO_REVISION` | `'senal_bajo_minimo'` | **`true`** | Aísla la regla de multiseñal: 2 señales bajo mínimo activan `riesgoAltoRechazo: true` aun con puntaje no crítico 72.0 ≥ 60. |

---

## 2. Ciclo de Vida y Transiciones de Estado de Umbrales

```text
                  [Diseñador o Administrador propone]
                  (Asigna version = MAX + 1)
                           │
                           ▼
                   ┌───────────────┐
                   │   BORRADOR    │ <─── [Diseñador o Administrador modifica borrador existente]
                   └───────┬───────┘      (Visible en bandeja de Administradores)
                           │
          ┌────────────────┴────────────────┐
          │                                 │
          ▼ [Administrador aprueba]         ▼ [Administrador desestima]
   ┌──────────────┐                  ┌──────────────┐
   │   APROBADO   │                  │ DESESTIMADO  │
   └──────────────┘                  └──────────────┘
   (Vigente inmutable si             (Histórico inmutable descartado;
    es el MAX aprobado)               conserva su número de versión)
```

### Reglas Unificadas de Versionamiento
1. **Asignación de Número:** El número de `version` se genera automáticamente al crear el registro en estado `BORRADOR` mediante `version = COALESCE(MAX(version), 0) + 1` para el flujo.
2. **Conservación de Número en Desestimación:** Si una propuesta en borrador es desestimada por un Administrador, pasa a estado `DESESTIMADO` y **conserva su número de versión**. No se reutiliza ni se reasigna ese identificador numérico, quedando como registro histórico de auditoría inmutable.
3. **Correlatividad Ascendente con Posibles Huecos:** "Correlativo" significa estrictamente que las versiones aprobadas son ascendentes pero pueden presentar huecos (ejemplo: si la versión 2 es desestimada, la siguiente propuesta será versión 3; las aprobadas serán 1 y 3).
4. **Definición de Versión Vigente Operativa:** La versión vigente que utiliza F4 para evaluar casos nuevos es siempre **la versión en estado `APROBADO` de mayor número secuencial (`MAX(version) WHERE estado = 'APROBADO'`)**.
5. **Restricción de Concurrencia:** Solo puede existir **máximo un único `BORRADOR` activo por flujo simultáneamente**. Esta regla se garantiza a nivel de base de datos mediante un índice único condicional:
   `CREATE UNIQUE INDEX idx_un_solo_borrador_por_flujo ON umbrales_flujo(id_flujo) WHERE estado = 'BORRADOR';`.
6. **Modificación de Borrador:** Mientras una propuesta se encuentre en estado `BORRADOR`, un usuario con rol Diseñador (según `spec.md §5.1 FR-001`) o Administrador `(PF-033 [fase6/pruebas-funcionales.md, línea 69]: 'Un administrador ajusta el umbral y guarda el cambio')` puede modificar sus parámetros numéricos sin alterar el número de versión asignado ni crear registros adicionales.
7. **Incompatibilidad de Roles:** El Administrador que aprueba o desestima un borrador no puede ser el mismo usuario que lo propuso (`aprobador !== proponente`, `PF-033`).

| Estado Origen | Evento / Acción | Rol Ejecutor | Estado Destino | Regla de Validación y Restricciones |
| :--- | :--- | :--- | :--- | :--- |
| *(Ninguno)* | `Crear Borrador` | Diseñador (1 o 2, según `spec.md §5.1 FR-001`) o Administrador (1 o 2; `PF-033 [fase6/pruebas-funcionales.md, línea 69]: 'Un administrador ajusta el umbral y guarda el cambio'`) | `BORRADOR` | Bloqueado si ya existe otro `BORRADOR` activo en el flujo. Asigna `version = MAX(version) + 1`. Valida `sum(pesos) = 1.00`, rangos `[0, 100]` y `umbralAprobacion > umbralRiesgoAlto`. Registra el usuario creador en `proponente`. |
| `BORRADOR` | `Modificar Borrador` | Diseñador (1 o 2, según `spec.md §5.1 FR-001`) o Administrador (1 o 2; `PF-033 [fase6/pruebas-funcionales.md, línea 69]: 'Un administrador ajusta el umbral y guarda el cambio'`) | `BORRADOR` | Permite actualizar parámetros del borrador existente. Valida las mismas reglas numéricas. |
| `BORRADOR` | `Enviar a revisión` | Diseñador o Administrador | `BORRADOR` | **No crea un estado nuevo.** Permanece en `BORRADOR` visible para los Administradores `[SUPUESTO del equipo]`. |
| `BORRADOR` | `Aprobar Borrador` | Administrador (1 o 2) | `APROBADO` | **Incompatibilidad estricta:** `aprobador !== proponente` (`D-04`, `PF-033`). Pasa a ser la versión vigente. Inmutable. |
| `BORRADOR` | `Desestimar Borrador` | Administrador (1 o 2) | `DESESTIMADO` | **Incompatibilidad estricta:** `aprobador !== proponente`. Conserva su número de versión; queda archivado inmutable. |
| `APROBADO` | *(Cualquiera)* | *(Ninguno)* | *(Inmutable)* | Prohibido modificar o eliminar versiones aprobadas (`D-03`, `D-05`). |
| `DESESTIMADO` | *(Cualquiera)* | *(Ninguno)* | *(Inmutable)* | Prohibido modificar o reactivar versiones desestimadas (`D-03`, `D-05`). |

---

## 3. Esquema Físico Relacional SQLite

Se toman como referencia los nombres de la guía (`D-01` y `D-05`), adaptándolos para dar soporte multitenant (`umbrales_flujo`) y al rastro estructurado:

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
    -- [SUPUESTO del equipo]: Tolerancia numérica 0.0001 ante redondeo de punto flotante en SQLite
    CHECK(ABS((peso_autenticidad + peso_cruce_fuentes + peso_coherencia) - 1.0) < 0.0001)
);

-- Índice único condicional: Garantiza estrictamente máximo 1 borrador activo por flujo
CREATE UNIQUE INDEX IF NOT EXISTS idx_un_solo_borrador_por_flujo
ON umbrales_flujo (id_flujo) WHERE estado = 'BORRADOR';

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
    senales_bajo_minimo TEXT NOT NULL, -- JSON array: ["coherencia_solicitud"]
    desglose_componentes TEXT NOT NULL, -- JSON object
    senales_insumo TEXT NOT NULL, -- JSON object: vector de entrada exacto
    usuario_operador TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (id_flujo, version_umbrales_aplicada) REFERENCES umbrales_flujo(id_flujo, version)
);

-- Tabla 3: Rastro de Auditoría Append-Only de Eventos de Umbrales (D-05)
CREATE TABLE IF NOT EXISTS rastro_auditoria (
    id_evento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_flujo TEXT NOT NULL,
    version INTEGER NOT NULL,
    accion TEXT NOT NULL CHECK(accion IN ('PROPUESTA_CREADA', 'PROPUESTA_MODIFICADA', 'PROPUESTA_APROBADA', 'PROPUESTA_DESESTIMADA')),
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

CREATE TRIGGER IF NOT EXISTS trg_prevent_update_rastro_auditoria
BEFORE UPDATE ON rastro_auditoria
BEGIN
    SELECT RAISE(ABORT, 'Violación de Inmutabilidad: Prohibido modificar el rastro de auditoría de umbrales.');
END;

CREATE TRIGGER IF NOT EXISTS trg_prevent_delete_rastro_auditoria
BEFORE DELETE ON rastro_auditoria
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
  /** Número correlativo ascendente asignado al crear el borrador (conservado si se desestima) */
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
  proponente: string;          // Usuario rol Diseñador (o 'sistema' en versión 1)
  aprobador?: string;          // Usuario rol Administrador independiente (en v1: 'carga inicial del sistema (valores por defecto)')
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
 * F4: Expediente médico sintético cargado desde data/casos_prueba.json (§2.d).
 */
export interface CasoPrueba {
  idCaso: string;
  prestacion?: string;         // Prestación y monto ficticio según guía §2.d
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

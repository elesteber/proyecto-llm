# Implementation Plan: Incremento Consolidado F5 (Configuración de Umbrales) + F4 (Evaluación y Decisión) de MIRA

**Branch**: `feat/plan-f5-f4` | **Fecha**: 2026-10-14 | **Spec**: [specs/001-f5-f4-umbrales-evaluacion/spec.md](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/specs/001-f5-f4-umbrales-evaluacion/spec.md)  
**Estado**: **Aprobada por Rodrigo Guerrero (backend) y Jorge Alvarez (frontend) mediante reviews en PR #16, 2026-10-15**

**Insumos de Entrada**:
- Especificación funcional consolidada: [spec.md](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/specs/001-f5-f4-umbrales-evaluacion/spec.md) y [requirements.md](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/specs/001-f5-f4-umbrales-evaluacion/checklists/requirements.md)
- Constitución del proyecto: [.specify/memory/constitution.md](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/.specify/memory/constitution.md) (v1.0.0)
- Acta de clarificaciones: [docs/entregable2/clarificaciones.md](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/docs/entregable2/clarificaciones.md)
- Guía metodológica SDD: [entregable2/guia-implementacion-sdd.md](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/entregable2/guia-implementacion-sdd.md) (§3, §4.1 D-01..D-09, §5.2 y §6)
- Insumos de investigación y modelado técnico: [research.md](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/specs/001-f5-f4-umbrales-evaluacion/research.md), [data-model.md](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/specs/001-f5-f4-umbrales-evaluacion/data-model.md), [contracts/](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/specs/001-f5-f4-umbrales-evaluacion/contracts/) y [quickstart.md](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/specs/001-f5-f4-umbrales-evaluacion/quickstart.md)

---

## 1. Summary

El presente plan técnico diseña la arquitectura, contratos de datos y estrategia de verificación para el incremento funcional consolidado **F5** (*Configuración y Gestión de Umbrales de Decisión*) y **F4** (*Evaluación de Casos y Emisión de Decisión Asistida*) del sistema MIRA (Plataforma de Inteligencia Multimodal para Decisiones Empresariales, DPRIME SpA), aplicado al flujo piloto de **reembolso de gastos médicos** (MIRA §5.2).

### Enfoque Técnico y Declaración de Precisiones sobre Decisiones D-01 a D-09
El plan adopta los lineamientos de las decisiones de la guía metodológica (§4.1), declarando formalmente las siguientes precisiones de diseño y nomenclatura:
1. **Persistencia Relacional SQLite (`D-01`, `D-05`):** Base de datos relacional autocontenida en un único archivo (`data/mira.db`). Se definen los nombres de las tablas para resolver los requerimientos técnicos y de multitenancy: la tabla de umbrales se denomina `umbrales_flujo` (en lugar de `umbrales` de D-01) para incluir la clave `id_flujo` de forma multitenant; la tabla de eventos de auditoría append-only se unifica bajo el nombre canónico de D-05: `rastro_auditoria` (con triggers `trg_prevent_update_rastro_auditoria` y `trg_prevent_delete_rastro_auditoria`); y las evaluaciones históricas se registran en `auditoria_evaluaciones` (con triggers `trg_prevent_update_evaluaciones` y `trg_prevent_delete_evaluaciones`). Ambas tablas de auditoría están protegidas por triggers `BEFORE UPDATE` y `BEFORE DELETE` con `RAISE(ABORT)`.
2. **Simulación Determinista del Motor (`D-02`):** El motor no procesa imágenes o PDFs en tiempo real; se cargan casos de prueba sintéticos con señales numéricas precalculadas desde el archivo de datos `data/casos_prueba.json` (`CASO-MED-001` a `CASO-MED-006`).
3. **Versionado Inmutable de Umbrales (`D-03`):** El número de versión se asigna al crear el borrador (`MAX(version) + 1`); si una versión es desestimada conserva su número asignado, por lo que "correlativo" significa estrictamente **ascendente con posibles huecos**. La versión vigente es siempre la `APROBADO` de mayor número. Quedan prohibidas mutaciones destructivas (`UPDATE`) sobre versiones aprobadas o desestimadas.
4. **Mecanismo de Doble Control y Autenticación Simulada (`D-04`):** Selector superior en interfaz con 5 identidades preconfiguradas fijas (`Diseñador 1`, `Diseñador 2`, `Administrador 1`, `Administrador 2`, `Operador 1`). La identidad se extrae de la sesión activa (`/api/session`). Solo los usuarios con rol Diseñador pueden proponer y editar borradores (`spec.md §5.1 FR-001`, `US4`, `P2`; confirmado por Rodrigo Guerrero como representante del cliente en PR #16, 2026-10-15); los Administradores solo pueden aprobar o desestimar. Quien propone un borrador jamás puede aprobarlo o desestimarlo (`aprobador !== proponente` como regla de defensa en profundidad, ENT6 [00:21:16]). `PF-033` (heredada: 'un administrador ajusta el umbral') se adapta: el proponente es Diseñador por decisión del cliente (PR #16, 2026-10-15).
5. **Estrategia de Pruebas E2E y Reproducibilidad Determinista (`D-06`):** Suite Playwright para recorridos de usuario y suite automatizada en Vitest que evalúa el 100% de consistencia decisional sobre versiones históricas (`RQNF-002 [fase5-lester]` / `RQNF-003 [final-final]`, `SC-004`).
6. **Mínimos por Señal Ratificados (`D-07`):** Autenticidad = 70.0, Cruce de fuentes = 70.0, Coherencia = 60.0 (`[SUPUESTO del equipo]` ratificado en `clarificaciones.md` P1).
7. **Fórmula de Agregación Ponderada (`D-08`):** `0.40 · aut + 0.40 · cruce + 0.20 · coh` (`[SUPUESTO del equipo]` ratificado en `clarificaciones.md` P1; no proviene de ningún RQF; tolerancia de suma 0.0001 `[SUPUESTO del equipo]`).
8. **Especificación Única Consolidada (`D-09`):** Spec única para F5+F4 con contratos desacoplados y tareas etiquetadas `[F5]` y `[F4]`.

### Desviaciones y Precisiones de Diseño:
1. **(a) Tablas no creadas (`flujos`, `casos`, `senales`):** En D-01 de la guía se mencionan tablas relacionales para `flujos`, `casos` y `senales`. En este plan técnico no se crean tablas de `flujos`, `casos` ni `senales`; los casos de prueba y sus señales se cargan directamente en el servidor desde el archivo `data/casos_prueba.json` conforme a D-02 (se retira la mención de "respaldadas en SQLite"). Se mantiene la carga desde `data/casos_prueba.json` sin persistir una tabla relacional `casos` en SQLite para este incremento, debido a que son 6 casos sintéticos fijos de negocio y evita migraciones o seedings redundantes en máquina limpia (< 15 min, C4).
2. **(b) Nombres de tablas físicas frente a D-01:** En D-01 se proponían los nombres `umbrales` y `auditoria_cambios`. El plan utiliza `umbrales_flujo` (para soportar explícitamente la clave multitenant `id_flujo`), `auditoria_evaluaciones` (para el registro histórico de evaluaciones de F4 sin mezclarlo con eventos de configuración) y `rastro_auditoria` (nombre unificado canónico de D-05 para los eventos de umbrales con triggers de inmutabilidad).
3. **(c) Estructura de directorios frente a guía §7.1 y §7.4:** Resuelta: estructura separada por decisión del equipo (D3). El plan adopta plenamente la estructura de la guía §7.1 (`src/backend`, `src/frontend`, `src/shared`, `tests/` en raíz) coordinada mediante scripts en `package.json` raíz.
4. **(d) Rol proponente de umbrales en F5:** Resuelta: confirmada por Rodrigo Guerrero en PR #16, 2026-10-15. Solo el Diseñador propone y edita borradores; el Administrador solo aprueba o desestima. PF-033 (heredada: 'un administrador ajusta el umbral') se adapta: el proponente es Diseñador por decisión del cliente (PR #16, 2026-10-15). Se mantiene la regla `aprobador !== proponente` como defensa en profundidad.

---

## 2. Technical Context

### 2.1 Stack Tecnológico y Dependencias
- **Lenguaje y Entorno:** Node.js v20+ LTS con TypeScript 5.x (`DEC-E2-05`).
- **Backend Framework:** **Express** (Confirmado por Rodrigo Guerrero en PR #16, 2026-10-15). Se adopta Express v4.19+ / v5 por simplicidad de arranque, integración nativa con Supertest y cero fricción en demostración evaluativa (PC-01).
- **Frontend Framework:** React 18+ estructurado con Vite, estilizado con CSS moderno en español neutro profesional (`DEC-E2-05`).
- **Motor de Base de Datos y Driver:** SQLite 3 relacional (`data/mira.db`) manejado vía driver nativo síncrono **`better-sqlite3`** (Confirmado por Rodrigo Guerrero en PR #16, 2026-10-15). Transaccionalidad síncrona determinista, soporte nativo de triggers inmutables y ejecución limpia en tests (PC-02).
- **Estructura del Proyecto:** Estructura separada (`src/backend`, `src/frontend`, `src/shared`, `tests/` en raíz) coordinada con scripts en `package.json` raíz y proxy de desarrollo Vite (`/api -> :3001`) (Confirmado por Rodrigo Guerrero y Jorge Alvarez en PR #16, 2026-10-15; D3, PC-03).
- **Suites de Pruebas:**
  - Pruebas unitarias de motor y validación: Vitest.
  - Pruebas de integración de API: Vitest + Supertest.
  - Pruebas E2E de navegador: Playwright (`D-06`).
  - Prueba extra-funcional medible (C5): Test de reproducibilidad determinista histórica al 100% en Vitest (`tests/reproducibility/deterministic.test.ts`). k6 reservado únicamente para líneas base exploratorias opcionales sin SLA contractual vinculante (`DEC-11`, `clarificaciones.md` P4).
- **Metas de Rendimiento y Operación:**
  - Puesta en marcha en máquina limpia en menos de 15 minutos (Criterio C4 de la pauta docente; detallado en [quickstart.md](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/specs/001-f5-f4-umbrales-evaluacion/quickstart.md)).
  - Sin SLA contractual vinculante de latencia para E2 (`DEC-11`, `clarificaciones.md` P4).
  - Usabilidad operativa: Acceso a consulta en ≤ 2 clics y ejecución de tareas clave en ≤ 3 minutos por un usuario sin inducción previa (`SC-005`, `clarificaciones.md` P5).

### 2.2 Invariantes de Negocio del Motor de Evaluación (F4)
1. **Cero Auto-Rechazo:** El sistema **nunca** emite una decisión de "rechazo automático". Salidas resolutivas únicas:
   - `decision: 'APROBADO_AUTOMATICO'` (con `motivo: 'aprobado'`)
   - `decision: 'DERIVADO_REVISION'` (con `motivo: 'alerta_fraude' | 'senal_bajo_minimo' | 'puntaje_bajo_umbral'`)
2. **Orden de Evaluación Estricto (Precedencia RN-04):**
   - Paso 1: Si `alertaFraudeActiva === true` → `DERIVADO_REVISION`, `motivo: 'alerta_fraude'` (máxima precedencia, ignora puntaje).
   - Paso 2: Si alguna señal < mínimo propio → `DERIVADO_REVISION`, `motivo: 'senal_bajo_minimo'` (precede al puntaje).
   - Paso 3: Si `scoreGlobal >= umbralAprobacion` (90 por defecto) sin fraude ni caídas bajo mínimo → `APROBADO_AUTOMATICO`, `motivo: 'aprobado'`.
   - Paso 4: En cualquier otro caso (`scoreGlobal < umbralAprobacion`) → `DERIVADO_REVISION`, `motivo: 'puntaje_bajo_umbral'`.
3. **Advertencia Informativa de Riesgo Alto (`riesgoAltoRechazo: boolean`):**
   - Se evalúa con posterioridad a la decisión y **jamás la altera**.
   - Regla de activación (al menos una de dos condiciones):
     `riesgoAltoRechazo = (conteo(señales bajo mínimo) >= 2) || (scoreGlobal < umbralRiesgoAlto)`.
   - Texto exacto en UI: *"Riesgo alto de rechazo: decide un operador"*.
   - Prohibido el uso de la palabra "rechazado" para calificar la decisión del sistema (`DEC-08`, `DEC-E2-10(b)`, ENT6 [00:04:06]).
4. **Comparaciones Numéricas sin Redondeo:** Las reglas se evalúan sobre los valores flotantes en memoria; el redondeo a 1 decimal es exclusivamente una regla de presentación en UI `[SUPUESTO del equipo]`.

### 2.3 Reglas de Negocio de Gestión de Umbrales (F5)
1. **Validaciones Estrictas de Entrada:**
   - La suma de las tres ponderaciones debe ser exactamente 1.00 (`|pesoAut + pesoCruce + pesoCoh - 1.00| < 0.0001` `[SUPUESTO del equipo]`). Cada peso entre 0.00 y 1.00.
   - Todo umbral (`umbralAprobacion`, `umbralRiesgoAlto`) y mínimo propio (`minimoAutenticidad`, `minimoCruceFuentes`, `minimoCoherencia`) debe estar entre 0.0 y 100.0 inclusive.
   - Consistencia de corte: `umbralAprobacion > umbralRiesgoAlto` (90 > 60 por defecto; impide inversión de rangos, `clarificaciones.md` P3).
2. **Ciclo de Vida de Doble Control y Regla Única de Versionamiento:**
   - Estados: `'BORRADOR'`, `'APROBADO'`, `'DESESTIMADO'`.
   - Asignación de número: El número se asigna al crear el borrador (`MAX(version) + 1`).
   - Una versión desestimada conserva su número en el histórico inmutable; por ende, correlativo significa **ascendente con posibles huecos**.
   - La versión vigente es siempre la versión en estado `APROBADO` de mayor número.
   - Restricción de concurrencia: Máximo 1 borrador activo por flujo simultáneamente (garantizado en base de datos por `CREATE UNIQUE INDEX idx_un_solo_borrador_por_flujo ON umbrales_flujo(id_flujo) WHERE estado = 'BORRADOR';`).
   - La acción de "enviar a revisión" no crea un estado nuevo en la base de datos; el borrador permanece en `BORRADOR` visible para los Administradores `[SUPUESTO del equipo]`.
   - Modificación de borrador: Un Diseñador puede modificar los parámetros numéricos de un borrador existente sin crear registros adicionales.
   - Incompatibilidad y segregación de roles: Solo usuarios con rol Diseñador pueden proponer o modificar borradores (`spec.md §5.1 FR-001`, `US4`, `P2`; confirmado en PR #16). Solo usuarios con rol Administrador pueden aprobar o desestimar propuestas. Como regla de defensa en profundidad, quien propone un borrador jamás puede aprobarlo o desestimarlo (`aprobador !== proponente`, ENT6 [00:21:16]). `PF-033` (heredada: 'un administrador ajusta el umbral') se adapta: el proponente es Diseñador por decisión del cliente (PR #16, 2026-10-15).
   - Versión 1 inicial: Se registra como `'carga inicial del sistema (valores por defecto)'`, sin aprobaciones humanas inventadas; el protocolo de doble control rige desde la versión 2.

### 2.4 Delimitación del Alcance (Fuera de Alcance)
- **Decisión Humana Final del Operador:** Conforme a la confirmación de Rodrigo Guerrero (representante del cliente) el 2026-10-15 en comentario de PR #16 (ratificando el supuesto de `spec.md §7.1(f)` y `clarificaciones.md` fila 6), la acción resolutiva final del Operador (aprobar o denegar el expediente derivado) queda fuera de este incremento. El sistema MIRA en F4 solo emite el dictamen de derivación asistida y la advertencia; no se diseñan pantallas ni endpoints de resolución humana.

---

## 3. Constitution Check

Revisión exhaustiva y punto por punto contra los 11 principios de la Constitución del Proyecto MIRA ([.specify/memory/constitution.md](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/.specify/memory/constitution.md) v1.0.0):

| Principio Constitucional | Regla Vinculante | Estado de Cumplimiento en el Plan Técnico | Evidencia en Diseño / Componente |
| :--- | :--- | :--- | :--- |
| **I. Prohibición Absoluta de Rechazo Automático** | Salidas exclusivas: `APROBADO_AUTOMATICO` o `DERIVADO_REVISION`. Prohibido usar "rechazado" en UI o código para una decisión del sistema. `riesgoAltoRechazo` es solo informativo (`DEC-08`, `DEC-E2-06`, `DEC-E2-10`, ENT6). | **Diseño conforme; verificación prevista en las tareas** | El contrato TypeScript en `data-model.md` tipa `DecisionSistema = 'APROBADO_AUTOMATICO' \| 'DERIVADO_REVISION'`. `evaluacion-engine.ts` implementa solo estas salidas. La UI usa *"Riesgo alto de rechazo: decide un operador"*. |
| **II. Precedencia Estricta del Motor de Decisión (F4)** | Orden inalterable: (1) Fraude (`alerta_fraude`) → (2) Señal bajo mínimo (`senal_bajo_minimo`) → (3) Puntaje ≥ umbral (`aprobado`) → (4) Puntaje bajo umbral (`puntaje_bajo_umbral`) (MIRA §3, `DEC-01`, `DEC-E2-06`, `DEC-E2-10`). | **Diseño conforme; verificación prevista en las tareas** | Diseñado en `research.md §2` y formalizado en la función `evaluarCaso()` de `evaluacion-engine.ts`. |
| **III. Gestión Dinámica, Versionamiento y Doble Control (F5)** | Todos los parámetros configurables. Separación obligatoria proponente/aprobador. Estados `BORRADOR`, `APROBADO`, `DESESTIMADO`. Versionamiento inmutable ascendente (`DEC-E2-10`, `D-03`, `D-04`, `PF-033`). | **Diseño conforme; verificación prevista en las tareas** | Diseñado en `data-model.md §2` y `contracts/api-umbrales-f5.md`. Tabla `umbrales_flujo` con PK compuesta `(id_flujo, version)` e índice único condicional de borrador. |
| **IV. Inmutabilidad de Artefactos de la Entrega 1** | Directorio `fases-y-plan-de-trabajo/` es de solo lectura histórica. Prohibida su edición directa (`DEC-E2-01`, §2.f). | **Diseño conforme; verificación prevista en las tareas** | Ninguna tarea ni comando toca `fases-y-plan-de-trabajo/`. Todos los refinamientos se formalizan en `docs/entregable2/` y `specs/`. |
| **V. Trazabilidad Canónica y Citación de Fuentes** | Convención canónica basada en `fase5-lester`. Citar siempre archivo fuente (`RQF-xxx [fase5-lester]`, `RQF-xxx [final-final]`) y `RQF-Bxx` solo si existe. Cero tolerancia a citas inventadas (`DEC-E2-02`, `DEC-E2-09`). | **Diseño conforme; verificación prevista en las tareas** | Todos los requisitos en `plan.md`, `research.md` y `data-model.md` llevan etiqueta de archivo fuente. Elementos de diseño del equipo van marcados `[SUPUESTO del equipo]`. |
| **VI. Flujo SDD Obligatorio, Spec Única y Aislamiento** | Ciclo secuencial de Spec Kit. Prohibición de código prematuro: `types.ts` deriva del plan; código de producción prohibido antes de tasks y analyze. Spec única F5+F4 (`DEC-E2-10(c)`, `D-09`). | **Diseño conforme; verificación prevista en las tareas** | No se ha creado `src/` ni `types.ts`. El contrato tipado está contenido en `data-model.md`. Se mantiene spec única para F5+F4. |
| **VII. Stack Tecnológico, Contrato Compartido y Datos Sintéticos** | Node.js + TypeScript + SQLite + React/Vite. Motor simulado con casos deterministas en `data/casos_prueba.json`. Prohibidos datos reales (`DEC-E2-05`, `D-01`, `D-02`, `R-10`). | **Diseño conforme; verificación prevista en las tareas** | Se seleccionó SQLite (`better-sqlite3`), Express y React/Vite. Casos sintéticos 100% ficticios cargados desde `data/casos_prueba.json`. |
| **VIII. Matriz Exhaustiva de Pruebas y Reproducibilidad** | Cobertura de casos `CASO-MED-001` a `CASO-MED-006` (`AC-1` a `AC-6`), prueba unitaria `PU-1` y test extra-funcional de reproducibilidad al 100% (`RQNF-002 [fase5-lester]`, `SC-004`). | **Diseño conforme; verificación prevista en las tareas** | Trazabilidad completa en §5 de este plan. Test automatizado `tests/reproducibility/deterministic.test.ts` verifica reevaluación histórica al 100% con aserción de no-circularidad. |
| **IX. Convención Canónica de Commits y Trazabilidad Atómica** | Formato `[PREFIJO] [ID]: Descripción`. Aislamiento de correcciones humanas en `[HUMAN-FIX]`. Tareas atómicas de < 2 horas (§7.2). | **Diseño conforme; verificación prevista en las tareas** | El commit de este plan usará `[PLAN] UC-01 DEC-E2-05: plan técnico F5+F4`. Se respeta la separación de prefijos para tareas subsecuentes. |
| **X. Registro de Intervención Humana y Medición de Retrabajo** | Registro obligatorio de intervenciones en `bitacora-intervenciones.md`. Cálculo de métricas TPR, TIH e IRF (`DEC-E2-08`, §7.7). | **Diseño conforme; verificación prevista en las tareas** | Intervenciones humanas registradas con hash verificable en bitácora (ver `docs/entregable2/bitacora-intervenciones.md`). Se mantiene gobernanza activa. |
| **XI. Política de Ramas, Protección de Main y Flujo de Integración** | Prohibido commit/push directo a `main`. Ramas de feature. Integración vía PR con revisión cruzada. Tag final `v2.0` (§2.f, §5.3). | **Diseño conforme; verificación prevista en las tareas** | Trabajo activo en rama de feature `feat/plan-f5-f4`. Sin push a origin. Integración regulada por PR con revisión de Rodrigo y Jorge. |

---

## 4. Proposed Repository Structure

A continuación se define la disposición física concreta del código en el repositorio, dando cumplimiento a la separación desacoplada entre backend, frontend, contratos compartidos, datos sintéticos y suites de pruebas (con rutas de prueba estrictamente alineadas entre §4 y §5):

```text
proyecto-llm/
├── .specify/                                   # Gobernanza Spec Kit, constitution y workflows
│   ├── memory/
│   │   └── constitution.md                     # Constitución v1.0.0
│   └── templates/
├── specs/
│   └── 001-f5-f4-umbrales-evaluacion/          # Artefactos SDD del incremento F5+F4
│       ├── spec.md                             # Especificación técnica funcional consolidada
│       ├── checklists/
│       │   └── requirements.md                 # Lista de chequeo de completitud
│       ├── plan.md                             # Este plan técnico de implementación
│       ├── research.md                         # Investigación técnica y decisiones D-01..D-09
│       ├── data-model.md                       # Modelo relacional y contratos TypeScript
│       ├── quickstart.md                       # Guía de validación y puesta en marcha (< 15 min)
│       ├── contracts/                          # Especificación formal de contratos de endpoints
│       │   ├── api-umbrales-f5.md              # Contratos API de gestión y versionado de umbrales
│       │   ├── api-evaluacion-f4.md            # Contratos API de evaluación determinista de casos
│       │   └── session-simulada.md             # Contratos de cambio de identidad simulada
│       └── tasks.md                            # Desglose de tareas (a generar por /speckit-tasks)
├── data/
│   ├── casos_prueba.json                       # 6 casos de prueba sintéticos fijados (AC-1..AC-6)
│   ├── evidencias/                             # Documentos y comprobantes sintéticos de apoyo
│   └── mira.db                                 # Base de datos SQLite relacional única generada
├── src/                                        # Código fuente de la aplicación (D3, guía §7.1)
│   ├── backend/                                # Servicio HTTP REST (Node.js + Express + TypeScript)
│   │   ├── config/
│   │   │   └── env.ts                          # Variables de entorno y configuración
│   │   ├── db/
│   │   │   ├── database.ts                     # Conexión síncrona a SQLite con better-sqlite3
│   │   │   ├── schema.sql                      # DDL de tablas umbrales_flujo, auditoria_evaluaciones, rastro_auditoria y triggers
│   │   │   └── seeds/
│   │   │       └── initial-seed.ts             # Semilla: versión 1 por defecto y carga de casos JSON
│   │   ├── controllers/
│   │   │   ├── umbrales-controller.ts          # Handlers para F5 (vigente, historial, borrador, modificar, resolver)
│   │   │   ├── evaluacion-controller.ts        # Handlers para F4 (evaluar caso, reevaluar histórico)
│   │   │   └── session-controller.ts           # Selector de identidades simuladas (D-04)
│   │   ├── services/
│   │   │   ├── umbrales-service.ts             # Lógica de negocio F5 (validación, doble control)
│   │   │   ├── evaluacion-engine.ts            # Motor determinista F4 (precedencia y riesgoAltoRechazo)
│   │   │   └── session-service.ts              # Gestión de usuario activo en memoria/sesión
│   │   ├── routes/
│   │   │   ├── umbrales-routes.ts              # Rutas /api/umbrales/*
│   │   │   ├── evaluacion-routes.ts            # Rutas /api/evaluacion/*
│   │   │   └── session-routes.ts               # Rutas /api/session/*
│   │   ├── middlewares/
│   │   │   ├── error-handler.ts                # Manejo centralizado de errores y códigos HTTP
│   │   │   └── request-logger.ts               # Rastro de peticiones entrantes
│   │   └── server.ts                           # Instanciación de Express y exportación de app
│   ├── frontend/                               # Interfaz de Usuario SPA (React + Vite + TypeScript)
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── HeaderSelectorIdentidad.tsx # Selector superior con 5 identidades fijas (D-04)
│   │   │   │   └── Navbar.tsx                  # Navegación entre Flujo F5 y Flujo F4 (≤ 2 clics)
│   │   │   ├── umbrales/                       # Componentes de F5
│   │   │   │   ├── PanelUmbralesVigentes.tsx   # Vista de configuración vigente
│   │   │   │   ├── FormularioPropuesta.tsx     # Creación/edición de propuesta en BORRADOR
│   │   │   │   ├── BandejaRevision.tsx         # Revisión por Administrador (Aprobar / Desestimar)
│   │   │   │   └── HistorialVersiones.tsx      # Tabla cronológica de versiones inmutables
│   │   │   └── evaluacion/                     # Componentes de F4
│   │   │       ├── ListaCasosPrueba.tsx        # Selección de expediente sintético
│   │   │       ├── FormularioEvaluacion.tsx    # Disparador de evaluación
│   │   │       ├── VistaResultado.tsx          # Despliegue de decisión, motivo y desglose
│   │   │       ├── AlertaRiesgoAlto.tsx        # Advertencia: "Riesgo alto de rechazo: decide un operador"
│   │   │       └── HistorialEvaluaciones.tsx   # Reevaluación determinista contra versión de origen
│   │   ├── hooks/
│   │   │   ├── useSession.ts                   # Hook de identidad simulada activa
│   │   │   ├── useUmbrales.ts                  # Hook de consulta y mutación de umbrales
│   │   │   └── useEvaluacion.ts                # Hook de ejecución de evaluación
│   │   ├── services/
│   │   │   └── api-client.ts                   # Cliente HTTP (fetch hacia /api)
│   │   ├── styles/
│   │   │   └── app.css                         # Estilos Vanilla CSS modernos y responsivos
│   │   ├── App.tsx                             # Enrutador principal y layout general
│   │   ├── main.tsx                            # Punto de entrada Vite
│   │   ├── index.html
│   │   └── vite.config.ts                      # Configuración de Vite con proxy /api -> :3001
│   └── shared/
│       └── types.ts                            # Contrato tipado único F5 <-> F4 (a crear tras [PLAN])
├── tests/                                      # Suites automatizadas en la raíz (unitarias, integración, e2e, reproducibilidad)
│   ├── unit/
│   │   ├── evaluacion-engine.test.ts           # Verificación de precedencia, AC-1..AC-6 y PU-1
│   │   └── umbrales-validation.test.ts         # Validaciones de pesos, rangos y umbralAprob > riesgo
│   ├── integration/
│   │   ├── umbrales-api.test.ts                # Endpoints F5, doble aprobación y bloqueo auto-aprobación
│   │   ├── evaluacion-api.test.ts              # Endpoints F4 y persistencia de evaluaciones
│   │   └── auditoria-inmutable.test.ts         # Triggers de bloqueo UPDATE/DELETE en rastro y evaluaciones
│   ├── e2e/
│   │   ├── doble-control-f5.spec.ts            # Recorrido E2E Playwright de propuesta y aprobación
│   │   ├── evaluacion-f4.spec.ts               # Recorrido E2E Playwright de casos de negocio
│   │   └── usabilidad-recorrido.spec.ts        # Recorrido E2E de usabilidad (≤ 2 clics, ≤ 3 min)
│   ├── reproducibility/
│   │   └── deterministic.test.ts               # Test extra-funcional de reproducibilidad al 100% (SC-004)
│   └── playwright.config.ts
├── docs/
│   └── entregable2/                            # Documentación y evidencias formales
├── package.json                                # Scripts raíz orquestadores (npm run dev, test, db:seed)
├── tsconfig.json                               # Configuración TypeScript base y path aliases
└── README.md                                   # Guía de instalación y puesta en marcha en < 15 min (C4)
```

---

## 5. Traceability Matrix (Trazabilidad Requisito → Componente → Prueba)

La siguiente matriz mapea de forma unívoca cada requerimiento funcional copiado textualmente de `spec.md §5.1`, los criterios de aceptación de negocio (`AC-1` a `AC-6`), la prueba unitaria (`PU-1`) y los criterios de éxito medibles (`SC-001` a `SC-005`) con los componentes del diseño técnico y sus pruebas automatizadas de verificación:

| ID Requisito | Requisito Origen (Fuente E1) [Texto Canónico de spec.md §5.1] | Equivalente PDF E1 (`RQF-Bxx`) [Texto Canónico de spec.md §5.1] | Criterio de Aceptación / Escenario (`spec.md`) | Componente de Backend (`src/backend/`) | Componente de Frontend (`src/frontend/`) | Prueba Automatizada de Verificación (`tests/`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-001** | `RQF-044 [final-final]` (configuración de umbrales) y `RQF-039 [fase5-lester]` (propuesta en borrador) | `RQF-B09 [PDF pág. 9]` (para configuración de umbrales) / *sin equivalente en PDF* (para propuesta en borrador de doble aprobación) | **US4 / Esc. 4.1**: Diseñador propone modificación; queda en `BORRADOR` con autor registrado. | `src/backend/services/umbrales-service.ts` (`crearBorrador`), `src/backend/db/schema.sql` | `src/frontend/components/umbrales/FormularioPropuesta.tsx` | `tests/integration/umbrales-api.test.ts:testCrearBorrador` |
| **FR-002** | `RQF-039 [fase5-lester]` | *sin equivalente en PDF* | **US5 / Esc. 5.1 & 5.2**: Doble control; bloqueo de auto-aprobación; aprobación formal por Administrador (`SC-003`). | `src/backend/services/umbrales-service.ts` (`aprobarBorrador`), `src/backend/controllers/umbrales-controller.ts` | `src/frontend/components/umbrales/BandejaRevision.tsx` | `tests/integration/umbrales-api.test.ts:testDobleControlBloqueoAutoAprobacion` |
| **FR-003** | `RQF-044 [final-final]` | `RQF-B09 [PDF pág. 9]` | **US4 / Esc. 4.2**: Validación estricta: suma pesos = 1.00; rangos [0, 100]; `umbralAprobacion > umbralRiesgoAlto`. | `src/backend/services/umbrales-service.ts` (`validarParametrosUmbrales`) | `src/frontend/components/umbrales/FormularioPropuesta.tsx` | `tests/unit/umbrales-validation.test.ts:testValidacionesPesosYRangos` |
| **FR-004** | `RQNF-002 [fase5-lester]` | *sin equivalente en PDF* | **US6 / Esc. 6.1**: Historial cronológico inmutable de versiones (versión, fecha, proponente, aprobador, estado). | `src/backend/db/schema.sql` (PK y triggers append-only), `src/backend/services/umbrales-service.ts` | `src/frontend/components/umbrales/HistorialVersiones.tsx` | `tests/integration/umbrales-api.test.ts:testHistorialInmutable` |
| **FR-005** | `RQF-040 [fase5-lester]` | `RQF-B10 [PDF pág. 9]` | Cálculo del puntaje ponderado continuo (`0.40·aut + 0.40·cruce + 0.20·coh`). | `src/backend/services/evaluacion-engine.ts` (`calcularScoreGlobal`) | `src/frontend/components/evaluacion/VistaResultado.tsx` | `tests/unit/evaluacion-engine.test.ts:testCalculoPonderadoExacto` |
| **FR-006** | `RQF-040 [fase5-lester]` | `RQF-B10 [PDF pág. 9]` (prueba en PDF usa umbral 85) | **AC-1** (`CASO-MED-001`): Puntaje 94.0 ≥ 90, sin fraude ni caídas bajo mínimo → `APROBADO_AUTOMATICO`, `'aprobado'`, `riesgoAltoRechazo: false`. | `src/backend/services/evaluacion-engine.ts` (`evaluarCaso`) | `src/frontend/components/evaluacion/VistaResultado.tsx` | `tests/unit/evaluacion-engine.test.ts:testAC1AprobacionAutomatica` |
| **FR-007** | `RQF-023 [fase5-lester]` | `RQF-B12 [PDF pág. 9]` (cobertura parcial por contenido; el PDF estipula rechazo automático ante fraude, superado por DEC-E2-06; prueba PF-018 en pág. 13 cita RQF-023) | **AC-3** (`CASO-MED-003`): Precedencia absoluta de fraude activa → `DERIVADO_REVISION`, `'alerta_fraude'`, ignora puntaje 94.0. | `src/backend/services/evaluacion-engine.ts` (`evaluarCaso` Paso 1) | `src/frontend/components/evaluacion/VistaResultado.tsx` | `tests/unit/evaluacion-engine.test.ts:testAC3PrecedenciaFraude` |
| **FR-008** | `RQF-041 [fase5-lester]` | `RQF-B12 [PDF pág. 9]` (cobertura parcial por contenido; PDF dice "Rechazado", superado por DEC-08/E2-06) | **AC-2** (`CASO-MED-002`): Aut 100, Cruce 100, Coh 55 (< 60) con puntaje 91.0 → `DERIVADO_REVISION`, `'senal_bajo_minimo'`, `riesgoAltoRechazo: false`. | `src/backend/services/evaluacion-engine.ts` (`evaluarCaso` Paso 2) | `src/frontend/components/evaluacion/VistaResultado.tsx` | `tests/unit/evaluacion-engine.test.ts:testAC2SenalBajoMinimo` |
| **FR-009** | `RQF-004 [final-final] (sin equivalente verificado en fase5-lester; RQF-020 [fase5-lester] cubre solo puntaje < 60)` | `RQF-B11 [PDF pág. 9] y RQF-B12 [PDF pág. 9]` (cobertura parcial por contenido; RQF-B11 rango intermedio 60-84 y RQF-B12 rechazo bajo umbral mínimo, superado por DEC-08) | **AC-5** (`CASO-MED-005`): Rango intermedio 75.0 (60 ≤ score < 90) sin caídas bajo mínimo → `DERIVADO_REVISION`, `'puntaje_bajo_umbral'`. | `src/backend/services/evaluacion-engine.ts` (`evaluarCaso` Paso 4) | `src/frontend/components/evaluacion/VistaResultado.tsx` | `tests/unit/evaluacion-engine.test.ts:testAC5DerivacionPuntajeIntermedio` |
| **FR-010** | Nuevo por decisión del equipo (DEC-08, DEC-E2-06, DEC-E2-10(b)); modifica RQF-B12 (relacionado: `RQF-020 [fase5-lester]`) | Modificado respecto a RQF-B12 (reemplazado por DEC-08, DEC-E2-06 y DEC-E2-10) | **RN-01 / SC-002**: Cero rechazo automático por el sistema; lenguaje prohibido en UI y código. | `src/backend/` (cero rechazo en todo el backend) | `src/frontend/components/evaluacion/VistaResultado.tsx` | `tests/unit/evaluacion-engine.test.ts:testSC002CeroRechazoSistema` |
| **FR-011** | Nuevo por decisión del equipo (DEC-E2-10(b)) (relacionado: `RQF-020 [fase5-lester]`) | `RQF-B11 [PDF pág. 9] y RQF-B12 [PDF pág. 9]` (Modificado: rechazo automático → derivación con advertencia de riesgo alto [umbralRiesgoAlto = 60]. Origen: equipo, con base en ENT6) | **AC-4** (`CASO-MED-004`) y **AC-6** (`CASO-MED-006`): Activación de `riesgoAltoRechazo: true` por puntaje < 60 o multiseñal; texto informativo en UI. | `src/backend/services/evaluacion-engine.ts` (`calcularRiesgoAltoRechazo`) | `src/frontend/components/evaluacion/AlertaRiesgoAlto.tsx` | `tests/unit/evaluacion-engine.test.ts:testAC4RiesgoAlto` y `testAC6RiesgoAlto` |
| **PU-1** | `spec.md §6.2` / `guia §2.d` | *sin equivalente en PDF* | **PU-1**: Aut: 65, Cruce: 65, Coh: 100 (score = 72.0 ≥ 60) con 2 señales bajo mínimo → `DERIVADO_REVISION`, `'senal_bajo_minimo'`, `riesgoAltoRechazo: true`. | `src/backend/services/evaluacion-engine.ts` (`calcularRiesgoAltoRechazo`) | N/A (Prueba de motor) | `tests/unit/evaluacion-engine.test.ts:testPU1MultisenalRiesgoAlto` |
| **FR-012** | `RQNF-002 [fase5-lester]` | *sin equivalente en PDF* | **US6 / Esc. 6.2 / SC-004**: Reevaluación histórica contra versión archivada con 100% de consistencia determinista. | `src/backend/services/evaluacion-engine.ts` (`reevaluarCasoHistorico`), `src/backend/db/schema.sql` | `src/frontend/components/evaluacion/HistorialEvaluaciones.tsx` | `tests/reproducibility/deterministic.test.ts:testReproducibilidadHistorica100` |
| **FR-004 (soporte técnico)** | `RQF-036 [fase5-lester]` / `RQF-013 [final-final]` (`D-05`, `H-12`, Principio IV; RQF-036 [fase5-lester] / RQF-013 [final-final] verificados; no están citados en spec §5.1 FR-004, que cita `RQNF-002 [fase5-lester]` / `RQNF-003 [final-final]`) | *sin equivalente en PDF* | Rastro de auditoría append-only protegido a nivel de motor de datos (bloqueo de modificaciones y borrados en auditoría). | `src/backend/db/schema.sql` (triggers `trg_prevent_update_rastro_auditoria` y `trg_prevent_delete_rastro_auditoria`) | N/A (Persistencia) | `tests/integration/auditoria-inmutable.test.ts:testTriggersBloqueanUpdateDelete` |
| **SC-005** | SC-005 (meta del equipo, spec §6.3; `clarificaciones.md` P5) | *sin equivalente en PDF* | Usabilidad: consulta en ≤ 2 clics y tareas clave en ≤ 3 minutos por usuario sin inducción. | `src/backend/routes/` (diseño directo de rutas) | `src/frontend/components/common/Navbar.tsx` | `tests/e2e/usabilidad-recorrido.spec.ts` |

---

## 6. Estrategia de Arranque Rápido (< 15 minutos en Máquina Limpia — C4)

Para asegurar el cumplimiento incondicional del **Criterio C4** de la evaluación docente (el sistema debe clonarse y ejecutarse en menos de 15 minutos en una máquina limpia), la arquitectura adopta un esquema con **cero contenedores Docker pesados** y **cero bases de datos externas de pago o en la nube**:

1. **Prerrequisitos Mínimos Universales:**
   - Node.js versión 20.x o superior (LTS) y `npm` versión 10.x.
2. **Secuencia de Instalación y Puesta en Marcha (estimación por medir: ~3 minutos):**
   ```bash
   # Paso 1: Clonar e instalar dependencias completas del ecosistema
   git clone <repo-url>
   cd proyecto-llm
   npm install

   # Paso 2: Crear esquema SQLite y sembrar datos iniciales (versión 1 y casos sintéticos)
   npm run db:seed

   # Paso 3: Iniciar simultáneamente Backend y Frontend en modo desarrollo
   npm run dev
   ```
3. **Puntos de Contacto Verificables de Inmediato:**
   - **Frontend (SPA React):** accesible en `http://localhost:5173`
   - **Backend API (Express):** accesible en `http://localhost:3001/api`
   - **Healthcheck / Configuración Vigente:** `curl http://localhost:3001/api/umbrales/vigente`
4. **Verificación Automatizada Completa en un Solo Comando:**
   ```bash
   # Ejecuta suite unitaria, integración y reproducibilidad determinista
   npm run test
   ```
*Nota:* El procedimiento paso a paso con ejemplos de payloads `curl` y validaciones de respuesta se encuentra documentado exhaustivamente en [quickstart.md](file:///home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm/specs/001-f5-f4-umbrales-evaluacion/quickstart.md).

---

## 7. Estrategia de Reproducibilidad Determinista (RQNF-002 / SC-004)

De acuerdo con `RQNF-002 [fase5-lester]` / `RQNF-003 [final-final]`, `DEC-14`, `H-14` y la Clarificación 4 (`clarificaciones.md`), la prueba extra-funcional oficial para el criterio C5 de la Entrega 2 es la **reproducibilidad determinista histórica al 100% sobre versiones guardadas**:

1. **Mecanismo de Preservación Histórica:**
   - Cada evaluación almacena en la tabla SQLite `auditoria_evaluaciones`: `id_caso`, `score_global` (sin redondear), `decision`, `motivo`, `riesgo_alto_rechazo`, `version_umbrales_aplicada`, el vector exacto de señales de entrada (`senales_insumo`) y la estampa temporal UTC.
2. **Protocolo del Test Automatizado (`tests/reproducibility/deterministic.test.ts`):**
   - **Fase A (Estado Inicial):** Evaluar el expediente sintético `CASO-MED-001` contra la Versión 1 vigente (`umbralAprobacion = 90.0`, mínimos 70/70/60). Resultado almacenado: `score = 94.0`, `decision: 'APROBADO_AUTOMATICO'`, `motivo: 'aprobado'`.
   - **Fase B (Cambio de Política Normativa en F5):** Mediante el flujo de doble control, proponer como `Diseñador 1` y aprobar como `Administrador 1` una nueva Versión 2 de umbrales con política restrictiva (`umbralAprobacion = 96.0`). La Versión 2 pasa a ser la vigente.
   - **Fase C (Aserción Diferencial de No-Circularidad):** La suite evalúa `CASO-MED-001` contra la Versión 2 vigente (umbral 96.0), verificando que resuelve explícitamente `decision: 'DERIVADO_REVISION'` con `motivo: 'puntaje_bajo_umbral'`. Esto demuestra que la prueba no es circular ni trivial.
   - **Fase D (Reevaluación Histórica en F4):** El sistema reevalúa el caso histórico evaluado originalmente en Fase A solicitando su reproducción determinista:
     - El motor recupera la Versión 1 archivada inmutable desde `umbrales_flujo`.
     - El motor reejecuta la lógica determinista sobre las `senales_insumo` archivadas.
     - **Aserción de Consistencia (100% determinismo):** Se valida mediante `expect` que el puntaje sea idéntico (94.0), la decisión sea idéntica (`APROBADO_AUTOMATICO`), el motivo sea idéntico (`aprobado`) y la bandera `riesgoAltoRechazo` sea idéntica (`false`).
3. **Carga y Desempeño:** No existe SLA cuantitativo de latencia (`DEC-11`, `clarificaciones.md` P4); herramientas como k6 quedan estrictamente como pruebas exploratorias opcionales sin valor contractual.

---

## 8. Riesgos Técnicos y Resoluciones de Arquitectura

### 8.1 Decisiones Técnicas Ratificadas por el Representante del Cliente y Frontend
Las tres decisiones de arquitectura fueron ratificadas formalmente por Rodrigo Guerrero (Backend y Representante del Cliente) y Jorge Alvarez (Frontend) en la **Compuerta 3** (reviews en PR #16, 2026-10-15):

| # | Decisión Técnica | Opciones Evaluadas | Decisión Adoptada | Fundamento Resumido | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PC-01** | **Framework HTTP de Backend** | (a) Express v4.19+ / v5<br>(b) Fastify v4+ | **Opción (a): Express** | Madurez absoluta, cero problemas con middlewares síncronos, integración directa con `supertest` para pruebas de integración de API, y simplicidad de arranque en máquina limpia. | **Confirmado por Rodrigo Guerrero (PR #16, 2026-10-15)** |
| **PC-02** | **Driver SQLite para Node.js** | (a) `better-sqlite3`<br>(b) `sqlite3` (asíncrono con callbacks/promesas)<br>(c) ORM (Prisma / TypeORM) | **Opción (a): `better-sqlite3`** | API síncrona determinista, soporte nativo de triggers inmutables y transacciones atómicas, ejecución limpia en tests y cero sobrecarga de ORMs. | **Confirmado por Rodrigo Guerrero (PR #16, 2026-10-15)** |
| **PC-03** | **Coordinación de Monorepo y Proxy** | (a) npm workspaces con build TypeScript coordinado<br>(b) Estructura separada con Vite Dev Proxy (`/api -> :3001`) y scripts en `package.json` raíz | **Opción (b): Estructura separada + Vite Dev Proxy** | Estructura separada (`src/backend`, `src/frontend`, `src/shared`, `tests/` en raíz) coordinada con scripts raíz; evita sobrecarga de enlaces simbólicos y problemas de resolución de tipos, garantizando experiencia desacoplada sin fricciones CORS. | **Confirmado por Rodrigo Guerrero (PR #16, 2026-10-15)** |

### 8.2 Supuestos Ratificados
- **Delimitación de la Decisión Final del Operador (`spec.md §7.1(f)`):** Confirmado por Rodrigo Guerrero (representante del cliente) el 2026-10-15 en comentario de PR #16: la decisión humana final del Operador sobre un caso derivado (aprobar o denegar el reembolso tras su análisis) queda fuera del alcance de este incremento F5+F4. F4 concluye con la emisión de la derivación y la advertencia visual.

### 8.3 Matriz de Riesgos del Incremento y Mitigaciones
| Riesgo Técnico / Operativo | Severidad | Mitigación Planificada en el Diseño |
| :--- | :--- | :--- |
| **R-01: Discrepancia por redondeo de flotantes en comparaciones** | Media | La spec y este plan establecen formalmente que el motor evalúa sobre números flotantes directos sin redondear; el redondeo a 1 decimal es exclusivo de visualización en componentes React `[SUPUESTO del equipo]`. |
| **R-02: Concurrencia de propuestas en borrador en F5** | Media | La tabla SQLite `umbrales_flujo` aplica índice único condicional `idx_un_solo_borrador_por_flujo WHERE estado = 'BORRADOR'`; cualquier intento de insertar un segundo borrador es rechazado inmediatamente por SQLite con error de unicidad. |
| **R-03: Falla en el tiempo de arranque en máquina limpia (Criterio C4)** | Alta | Se omiten dependencias externas, contenedores Docker y servicios cloud. La base de datos es un archivo local SQLite y los scripts de inicialización `npm run db:seed` crean el esquema y datos sintéticos rápidamente (estimación por medir: < 5 segundos). |
| **R-04: Dependencia temporal para la prueba de usabilidad externa (Sábado 17)** | Alta | La interfaz de usuario implementará flujos de navegación directos (≤ 2 clics para cualquier vista) y formularios con validación visual interactiva en tiempo real para asegurar que un evaluador externo complete las tareas en ≤ 3 minutos (`SC-005`). |
| **R-05: Descarga o compilación de binarios nativos de better-sqlite3 en máquina limpia** | Media | `better-sqlite3` descarga binarios precompilados vía `prebuild-install` en postinstall o compila si no existen para la plataforma. Mitigación: verificar `npm install` en máquina limpia sin herramientas de compilación (`build-essential`/Python), asegurar `package-lock.json` estricto con dependencias congeladas, y disponer como plan alternativo de contingencia el driver `sqlite3` clásico. |

---

## 9. Complexity Tracking

> **Nota:** La arquitectura propuesta se ajusta a los 11 principios de la Constitución del Proyecto MIRA (v1.0.0). No se introducen excepciones, patrones innecesarios ni complejidades arquitectónicas no autorizadas:

| Componente Evaluado | Justificación de Necesidad | Alternativa Más Simple Descartada |
| :--- | :--- | :--- |
| **Triggers SQLite en rastro de auditoría** | Requisito formal de inmutabilidad append-only a nivel de motor de datos (`D-05`, `DEC-12`, `RQF-036 [fase5-lester]` / `RQF-013 [final-final]`). | Control exclusivo por software en Express: descartado por no garantizar inalterabilidad si se accede directamente al archivo `.db`. |
| **Doble control simulado con selector de 5 identidades** | Requisito formal de segregación de funciones (`D-04`, `PF-033`, ENT6 [00:21:16]) sin requerir infraestructura SSO corporativa en la Entrega 2 (`DEC-06`). | Sistema de login con contraseñas y JWT: descartado por agregar fricción innecesaria y ralentizar la puesta en marcha para evaluación docente. |

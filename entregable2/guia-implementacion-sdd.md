# Guía Operativa de Implementación SDD (Spec Kit) — Entrega 2 MIRA

**Taller de Desarrollo de Software Conducido por Agentes de IA**  
**Facultad de Ingeniería, Escuela de Ingeniería Informática — Universidad de Valparaíso**  
**Caso:** MIRA — Plataforma de Inteligencia Multimodal para Decisiones Empresariales (DPRIME SpA)  
**Fecha de emisión:** Domingo 11 de octubre de 2026  
**Fecha límite de entrega:** Lunes 19 de octubre de 2026, 14:00 hrs (tag `v2.0`)  
**Método seleccionado:** Opción A — Spec-Driven Development (SDD) con GitHub Spec Kit sobre Antigravity  

---

## 0. Contexto y Reglas de Juego del Equipo

### 0.1 Parámetros Generales de la Entrega
- **Plazo final:** Lunes 19 de octubre de 2026, 14:00 CLT. Todo commit posterior queda fuera de evaluación según reglamento.
- **Entregables obligatorios:**
  1. Informe escrito en formato PDF (`NUMEROGRUPO-MIRA-Alvarez-Gonzalez-Guerrero-Salgado.pdf`) con extensiones máximas estrictas por sección (ver [§8](#8-puertas-de-calidad-y-definición-de-terminado-dod)).
  2. Repositorio de código fuente con historial versionado, artefactos del framework SDD, datos de prueba ficticios, suite automatizada y `README.md` operativo (tag git `v2.0`).
  3. Presentación en PPT de soporte.
  4. Exposición oral de 15 minutos (incluye demostración en vivo del software corriendo sobre el tag `v2.0`) + 5 minutos de preguntas individuales. Fecha y hora exacta de la defensa: `[POR CONFIRMAR fecha y hora]`.
- **Antecedentes de la Entrega 1:** Calificación 67/70. Dictamen docente: artefactos de análisis aprobados sin solicitud de modificaciones retroactivas; observaciones focalizadas exclusivamente en detalles de la presentación oral.
- **Regla de oro de diseño:** Las decisiones de diseño de software las toman los ingenieros humanos, no el agente. El agente propone alternativas y redacta; nunca elige ni impone soluciones.

### 0.2 Integrantes y Roles Base del Equipo
1. **Rodrigo Guerrero:** Desarrollo Backend (Node.js/TypeScript) y **Representante del Cliente** para la Entrega 2.
2. **Jorge Alvarez:** Desarrollo Frontend / Interfaz de Usuario (Node.js, React, Vite). Integrante que se suma en esta entrega (no participó en la Entrega 1).
3. **Lester Gonzalez:** Estrategia de Pruebas y Aseguramiento de Calidad (automatización, unitarias, integración, E2E, rendimiento). Ejerció como Representante del Cliente en la Entrega 1.
4. **Angel Salgado:** Redacción del Informe Escrito, Gobernanza de Documentación, Matriz de Trazabilidad y Bitácora DEC.

---

## 1. Registro de Decisiones Iniciales (Bitácora DEC)

A continuación se registran formalmente las decisiones iniciales del proyecto bajo la plantilla estándar de la bitácora (`DEC-xx`):

### DEC-E2-01: Selección del Método de Desarrollo (SDD con Spec Kit sobre Antigravity)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-01` |
| **Fecha** | 11-10-2026 |
| **Asunto** | Adopción de Spec-Driven Development (Opción A) como método rector para la Entrega 2 |
| **Contexto** | El enunciado del Entregable 2 ([`entregable2-mira-pauta.md`](entregable2-mira-pauta.md#L60-L92)) exige optar formalmente entre Opción A (SDD) y Opción B (BMAD). La Entrega 1 concluyó con 40 pruebas funcionales (PF), 12 pruebas extra-funcionales (PX) y 3 casos de uso críticos detallados paso a paso (UC-01, UC-02, UC-03). |
| **Alternativas** | **(a) Opción A — SDD (GitHub Spec Kit sobre IDE Antigravity):** Enfoque centrado en la especificación (`constitution` → `specify` → `clarify` → `plan` → `tasks` → `implement`).<br>**(b) Opción B — BMAD:** Enfoque centrado en la simulación de un equipo de software mediante 5 roles de agentes en archivos Markdown/YAML (`bmad-agent-analyst`, `bmad-agent-pm`, `bmad-agent-architect`, `bmad-agent-dev`, `bmad-agent-ux-designer`). |
| **Decisión** | Se adopta formalmente la **Opción A (SDD con Spec Kit sobre Antigravity)**. |
| **Justificación** | Los artefactos heredados de la Entrega 1 presentan una estructura *spec-first*: los flujos primarios y alternativos de UC-01/02/03 y las tablas de requisitos y pruebas ya contienen especificaciones operativas densas. SDD aprovecha directamente estos insumos lineales sin requerir la sobrecarga ceremonial de simular un ciclo multi-rol completo. Validado por el equipo completo el 11-10-2026. |
| **Insumo para Discusión 6.7 ("Qué esperaríamos haber encontrado con BMAD")** | Si se hubiese elegido BMAD, se habría contado con roles especializados de software (Mary/Analyst, John/PM, Winston/Architect, Amelia/Dev, Sally/UX) con compuertas estructuradas (`bmad-sprint-planning` emitiendo veredicto *PASS/CONCERNS/FAIL*) y checkpoints humanos obligatorios en el diff durante `bmad-build`. Asimismo, para conciliar las tensiones de las áreas de negocio levantadas en las entrevistas (Daniela, Valentina, Hugo, Sebastián), se habría requerido simular mesas de trabajo mediante `bmad-party-mode`, lo que habría demandado mayor esfuerzo en prompts de personalización de roles antes de iniciar la implementación. |
| **Impacto** | Obligatoriedad de generar los artefactos exigidos: `constitution.md`, `spec.md`, registro de clarificación, `plan.md`, `tasks.md`, reporte de consistencia y commits trazables por tarea. |

---

### DEC-E2-02: Nomenclatura Rectora de Requisitos y Gestión de Divergencias
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-02` |
| **Fecha** | 11-10-2026 |
| **Asunto** | Nomenclatura canónica de requisitos y tratamiento de la discrepancia de IDs entre fuentes de la Entrega 1 |
| **Contexto** | En la Entrega 1 conviven dos numeraciones: en los archivos de trabajo en Markdown ([`fase5/requisitos-funcionales-y-no-funcionales-final-final.md`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md)) y en las pruebas ([`fase6/pruebas-funcionales.md`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md)) rige la nomenclatura `RQF-xxx` y `RQNF-xxx` (75 requisitos). En el informe final ([`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf), págs. 9-12) se utilizó `RQF-Bxx` (36 funcionales) y `RQNF-Bxx` (13 no funcionales). |
| **Alternativas** | **(a)** Migrar todo el código, specs y tests a `RQF-Bxx`.<br>**(b)** Mantener `RQF-xxx` / `RQNF-xxx` como identificador rector interno en el repositorio y construir una tabla de equivalencias hacia `RQF-Bxx` para el informe final.<br>**(c)** Crear una nomenclatura nueva exclusiva para la Entrega 2. |
| **Decisión** | Se adopta la **Alternativa (b)**: la nomenclatura rectora en código, specs, tareas y pruebas automatizadas es **`RQF-xxx`** y **`RQNF-xxx`**. La correlación con el PDF de la Entrega 1 se documenta mediante tabla de equivalencias oficial. |
| **Justificación** | Las pruebas funcionales existentes (`PF-001` a `PF-045`) y el modelo conceptual fueron programados y auditados sobre `RQF-xxx`. Modificar los IDs en código generaría desalineación con las pruebas unitarias heredadas. |
| **Pendiente por confirmar** | `[POR CONFIRMAR universo de requisitos]`: Se debe contrastar con el docente si el universo cerrado del proyecto son los 49 requisitos del PDF consolidado o los 75 requisitos del archivo Markdown de trabajo. Mientras tanto, rige el subconjunto de requisitos Must de la Entrega 1 que caiga dentro de las funcionalidades elegidas. |
| **Impacto** | Todas las etiquetas en código fuente, comentarios de tests (`// RQF-002`) y nombres de tareas deben utilizar `RQF-xxx` / `RQNF-xxx`. |

---

### DEC-E2-03: Asignación y Mitigación de Conflicto de Interés del Representante del Cliente
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-03` |
| **Fecha** | 11-10-2026 |
| **Asunto** | Rotación obligatoria del Representante del Cliente y protocolo de mitigación de sesgo |
| **Contexto** | La pauta de la Entrega 2 ([`entregable2-mira-pauta.md`](entregable2-mira-pauta.md#L135-L143)) exige la rotación obligatoria del Representante del Cliente (Lester Gonzalez ejerció en la Entrega 1 y queda inhabilitado). Rodrigo Guerrero asume la representación del cliente pero es a su vez el desarrollador del backend. |
| **Riesgo identificado** | Conflicto de interés técnico: el mismo desarrollador que implementa la lógica de backend evalúa y acepta los criterios de aceptación en la sesión de entrega, con riesgo de auto-aprobación complaciente. |
| **Alternativas** | **(a)** Dejar a Rodrigo como representante sin salvaguardas.<br>**(b)** Asignar a Jorge Alvarez (recién ingresado, sin contexto del cliente).<br>**(c)** Asignar a Rodrigo con protocolo estricto de mitigación cruzada: criterios de aceptación congelados previamente en `spec.md`, con presencia obligatoria y derecho a veto de Lester y Jorge durante la sesión de aceptación. |
| **Decisión** | Se adopta la **Alternativa (c)**. Rodrigo Guerrero es el Representante del Cliente oficial. |
| **Mitigación formal** | 1. Los criterios de aceptación (`AC-xx`) quedan fijados en `spec.md` y validados por el equipo *antes* de tirar la primera línea de código.<br>2. La sesión de aceptación se realiza en sesión sincrónica grabada/registrada con Lester (QA) y Jorge (UI) como ministros de fe.<br>3. Todo rechazo o ajuste en la aceptación se registra en un acta inmutable adjunta al informe. |
| **Impacto** | Garantiza la validez metodológica exigida por el criterio C5 de la rúbrica docente. |

---

### DEC-E2-04: Selección de Funcionalidades del Incremento (Propuesta Sujeta a Ratificación)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-04` |
| **Fecha** | 11-10-2026 |
| **Asunto** | Selección del par de funcionalidades conectadas para el incremento funcional |
| **Contexto** | El capítulo 4 de la pauta exige implementar exactamente 2 funcionalidades del menú oficial (F1 a F9), conectadas entre sí (productor → consumidor), y que al menos una toque un hallazgo abierto o resuelto con supuestos en la Entrega 1. |
| **Hipótesis de trabajo (Recomendada)** | **F5 (Gestión de umbrales) + F4 (Puntaje y decisión por umbrales).** |
| **Alternativas evaluadas** | Comparativa detallada en la [Sección 2.e](#2e-decisión-y-comparación-de-funcionalidades-candidatas-dec-e2-04) de esta guía: F5+F4 vs. F4+F1 vs. F4+F7. |
| **Decisión propuesta** | **F5 + F4**. F5 actúa como productor (gestiona, versiona y aprueba umbrales y mínimos por señal); F4 actúa como consumidor (ejecuta el cálculo determinista de puntaje y toma la decisión aplicando los umbrales vigentes aprobados en F5). |
| **Justificación técnica** | Par 100% determinista, acotado, sin dependencias de streaming/websockets; resuelve directamente la inconsistencia abierta H-05 (mínimos por señal) y la decisión DEC-01 (umbral configurable de 90 puntos). |
| **Impacto** | Define la arquitectura de contratos, el modelo de datos SQLite, las pantallas de UI y las suites de prueba. |

---

### DEC-E2-05: Definición del Stack Tecnológico y Herramientas (Propuesta de Equipo)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-05` |
| **Fecha** | 11-10-2026 |
| **Asunto** | Definición del stack tecnológico de frontend, backend, persistencia y testing |
| **Contexto** | La pauta exige una aplicación web con interfaz en español, operable de punta a punta sin tocar base de datos ni devtools, levantable en menos de 15 minutos desde el README, con pruebas automatizadas, E2E y de rendimiento. |
| **Propuesta de stack** | - **Backend:** Node.js (v20+ LTS) con TypeScript y Express / Fastify.<br>- **Frontend:** React 18+ con TypeScript, Vite y TailwindCSS / CSS nativo modularizado.<br>- **Persistencia:** SQLite (modo local archivo `mira.db`) con Better-SQLite3 o Drizzle ORM ligero.<br>- **Pruebas unitarias/integración:** Vitest + Supertest.<br>- **Pruebas E2E:** Playwright (ejecutable en modo headless o con interfaz).<br>- **Prueba extra-funcional de rendimiento:** k6 (scripts JS en texto plano versionados en git); JMeter se conserva como alternativa de respaldo si Lester lo requiere.<br>- **Seguimiento de defectos:** GitHub Issues (en el repositorio oficial) en lugar de Mantis BT, para mantener trazabilidad integrada con los PRs y commits. |
| **Justificación** | Stack dominado por el equipo (Rodrigo en Node, Jorge en React). SQLite garantiza cero fricción de instalación (sin containers Docker pesados ni bases de datos remotas), asegurando que el evaluador clone y levante el sistema en menos de 5 minutos vía `npm install && npm run dev`. |
| **Impacto** | Define las dependencias de `package.json`, la configuración de CI/test local y el procedimiento de arranque del `README.md`. |

---

### DEC-01: Formalización de Inconsistencia H-01 (Umbral de Aprobación Automática)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-01` (formalización oficial del hallazgo `H-01` / `HC-001`) |
| **Fecha** | 11-10-2026 |
| **Asunto** | Fijación del umbral de aprobación automática y resolución de discrepancia interna |
| **Contexto** | En §2.6 conviven valores contradictorios: "sobre 85 se aprueba automáticamente" vs. "a partir de 80 puntos sin señales de fraude". En ENT2 [00:13:05], Camila Ordóñez admite que fueron números referenciales sin base científica. En ENT4 [00:11:06], Francisca Leiva (cliente piloto) exige explícitamente 90 puntos. En el análisis de UC-01 de la Entrega 1 quedó consignada la nota "85 vs 80 puntos sin resolver". |
| **Alternativas** | **(a)** Adoptar 80 puntos.<br>**(b)** Adoptar 85 puntos.<br>**(c)** Adoptar 90 puntos rígidos.<br>**(d)** Adoptar 90 puntos como valor por defecto, configurable por cliente y flujo en la base de datos. |
| **Decisión** | Se adopta la **Alternativa (d)**: el umbral por defecto es **90 puntos**, parametrizable mediante la funcionalidad F5. |
| **Justificación** | Se respeta el principio de adoptar el valor más conservador y exigido por el cliente piloto, dejando el motor desacoplado de constantes "quemadas" en código. Esta decisión formaliza y resuelve la nota "85 vs 80 sin resolver" de la Entrega 1, sin alterar retroactivamente los documentos históricos. |
| **Impacto** | Requisitos `RQF-002`, `RQF-035`, caso de uso `UC-01`, caso de prueba `PF-002` y lógica de evaluación de F4. |

---

## 2. Preparación Previa a `specify init`

Antes de invocar comandos de generación de Spec Kit, el equipo debe completar los siguientes 7 pasos preparatorios. Cada paso cuenta con un responsable humano directo y un criterio objetivo de término:

```
[2.a Tabla Equivalencias] ──> [2.b Formalizar DEC-01..16] ──> [2.c Exportar Backlog]
             │
             └──> [2.d Datos de Prueba Ficticios] ──> [2.e Selección F5+F4]
                           │
                           └──> [2.f Setup Spec Kit / agy] ──> [2.g Onboarding Jorge]
```

### 2.a Tabla de Equivalencias de Requisitos (`RQF-Bxx` → `RQF-xxx`)
- **Responsable:** Angel Salgado (con validación de Lester Gonzalez).
- **Objetivo:** Resolver el riesgo de desorientación del agente ante la dualidad de nomenclaturas entre el informe PDF y los archivos Markdown de la Entrega 1.
- **Acción:** Consolidar en `docs/entregable2/equivalencias-requisitos.md` la correspondencia biunívoca.

#### Tabla Oficial de Equivalencias (Extracto Requisitos Críticos)
| ID Informe PDF (`RQF-Bxx`) | ID Repositorio / Markdown (`RQF-xxx`) | Nombre del Requisito / Alcance | Prioridad MoSCoW | Funcionalidad E2 Asociada | Caso de Prueba E1 Asociado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `RQF-B01` | `RQF-001` | Cálculo de puntaje global con componentes ponderados | Must | F4 | `PF-001` |
| `RQF-B02` | `RQF-002` | Decisión automática basada en umbral configurable | Must | F4 / F5 | `PF-002` |
| `RQF-B03` | `RQF-003` | Precedencia de señales de fraude sobre puntaje | Must | F4 | `PF-003` |
| `RQF-B04` | `RQF-004` | Derivación a revisión asistida en rango intermedio | Must | F4 | `PF-004` |
| `RQF-B05` | `RQF-005` | Derivación por señal individual bajo mínimo admisible | Must | F4 / F5 | `PF-005` |
| `RQF-B06` | `RQF-006` | Escalamiento obligatorio a humano bajo 60 puntos | Must | F4 | `PF-006` |
| `RQF-B13` | `RQF-013` (PDF) / `RQF-035` | Configuración y versionado de umbrales por flujo | Must | F5 | `PF-010` |
| `RQF-B22` | `RQF-022` | Registro de autor, fecha y valor previo en cambios de regla | Must | F5 | `PF-024` |
| `RQNF-B01` | `RQNF-001` | Tiempo de respuesta en evaluación de reglas (<500ms) | Must | F4 | `PX-001` |
| `RQNF-B08` | `RQNF-008` | Inmutabilidad de auditoría de decisiones y cambios | Must | F4 / F5 | `PX-008` |

- **Criterio de término:** Archivo `docs/entregable2/equivalencias-requisitos.md` commitenado en git y validado formalmente contra el PDF de la Entrega 1.

---

### 2.b Formalización de DEC-01 a DEC-16 desde H-01 a H-16
- **Responsable:** Angel Salgado (con revisión del Representante del Cliente, Rodrigo Guerrero).
- **Objetivo:** Formalizar en fichas individuales las 16 inconsistencias detectadas en la Entrega 1 ([`fase2/inconsistencias-revisadas.md`](../fases-y-plan-de-trabajo/fase2/inconsistencias-revisadas.md)), cerrando la brecha histórica de la Entrega 1 donde solo existía la plantilla vacía `DEC-00`.
- **Estado de las Decisiones al inicio de la Entrega 2:**
  - `DEC-01` (H-01): Cerrada (umbral 90 configurable por flujo).
  - `DEC-02` (H-02): Cerrada (retención 5-10 años: 90 días activo, luego frío).
  - `DEC-03` (H-03): Cerrada (rate limits con `Retry-After` y modo bulk).
  - `DEC-04` (H-04): Cerrada (cobro restringido a decisiones automáticas).
  - **`DEC-05` (H-05): ⚠️ ABIERTA** (mínimos por señal individual; entra al alcance si se elige F4 y se resuelve en `clarify`).
  - `DEC-06` (H-06): Cerrada (SSO corporativo obligatorio en producción; en E2 se simula con selector de rol).
  - `DEC-07` (H-07): Cerrada (escritura automática en siniestros vía archivos).
  - `DEC-08` (H-08): Cerrada (prohibición de rechazo automático bajo 60 puntos; siempre derivar a humano).
  - `DEC-09` (H-09): Cerrada (cobro de 1 validación por siniestro salvo reanálisis sustantivo).
  - **`DEC-10` (H-10): ⚠️ ABIERTA** (plazo comercial enero 2027 vs abril 2027; fuera del alcance funcional de E2).
  - **`DEC-11` (H-11): ⚠️ PARCIALMENTE ABIERTA** (SLA por tramos según tipo/tamaño; valores numéricos abiertos; afecta la prueba extra-funcional que se fija como supuesto del equipo).
  - `DEC-12` (H-12): Cerrada (rastro inalterable de decisión disociado de evidencia personal).
  - `DEC-13` (H-13): Cerrada (soporte dual: API REST y carpetas compartidas).
  - `DEC-14` (H-14): Cerrada (reconstrucción como trazabilidad de inputs/versiones, no determinismo generativo).
  - `DEC-15` (H-15): Cerrada (plazo 2 semanas estándar, +2-3 con formulario propio).
  - **`DEC-16` (H-16): ⚠️ ABIERTA** (tramos de facturación 5.000–15.000 y Enterprise; fuera de alcance de E2 salvo que se elija F7).
- **Criterio de término:** Carpeta `docs/entregable2/decisiones/` poblada con las 16 fichas individuales (`DEC-01.md` a `DEC-16.md`) en formato Markdown estructurado.

---

### 2.c Exportación y Versionado del Backlog de GitHub Projects
- **Responsable:** Lester Gonzalez (administrador de la cuenta `elesteber`).
- **Objetivo:** Mitigar el riesgo de tener historias de usuario y criterios de aceptación desacoplados del versionado en Git.
- **Acción:** Exportar las historias desde el tablero de GitHub Projects y generar el archivo `docs/entregable2/backlog.md`.
- **Estructura mínima exigida por historia:**
  ```markdown
  ### HU-xxx: [Título de la historia]
  - **Rol:** Como [rol de usuario]
  - **Deseo:** Quiero [acción en el sistema]
  - **Para:** Para [beneficio de negocio]
  - **Criterios de Aceptación (Gherkin):**
    - Dado que [contexto inicial]
    - Cuando [evento o acción del usuario]
    - Entonces [resultado observable esperado]
  - **Trazabilidad:** RQF-xxx / PF-xxx
  - **Prioridad:** Must / Should / Could
  ```
- **Criterio de término:** Archivo `docs/entregable2/backlog.md` commitenado en git conteniendo la totalidad de las historias del tablero con sus IDs (`HU-01` en adelante).

---

### 2.d Preparación de Datos de Prueba Ficticios (Marcha Blanca)
- **Responsable:** Rodrigo Guerrero (con apoyo de Jorge Alvarez para assets visuales).
- **Condición del enunciado:** El motor multimodal no se implementa; se simula mediante datos de prueba precalculados con señales, puntajes y componentes, acompañados de evidencia ficticia (PDF o imágenes).
- **Contexto de Marcha Blanca:** Según lo indicado por el equipo, el caso MIRA contempla un período de prueba enfocado en reembolsos médicos ambulatorios y dentales (excluyendo siniestros complejos o análisis de video automotriz).  
  > ⚠️ `[POR CONFIRMAR cita]`: Falta confirmar la cita exacta (§ del documento MIRA o marca de tiempo de ENTn) que respalda formalmente la restricción de marcha blanca solo a reembolsos médicos. Mientras se localiza la cita, se asume operativamente este enfoque para diseñar los 3 casos ficticios.

#### Especificación de los 3 Casos de Prueba Ficticios
1. **Caso 1 (`CASO-MED-001` — Aprobación Automática):**
   - **Tipo de siniestro:** Reembolso de consulta médica ambulatoria ($45.000 CLP).
   - **Evidencia adjunta:** `evidencia_boleta_001.pdf` y `evidencia_receta_001.jpg` (documentos simulados creados por el equipo).
   - **Señales del motor precalculadas:**
     - Consistencia identidad prestador: 95/100 (mínimo: 70).
     - Legibilidad de montos y timbres: 92/100 (mínimo: 70).
     - Coherencia diagnóstico-gasto: 94/100 (mínimo: 60).
     - Detección de fraude/manipulación de imagen: 0.02 (sin alerta).
   - **Puntaje global consolidado:** **93.5 puntos**.
   - **Decisión esperada bajo umbrales vigentes (DEC-01):** **APROBADO AUTOMÁTICAMENTE** (supera umbral de 90 puntos y ninguna señal bajo mínimo).
2. **Caso 2 (`CASO-MED-002` — Derivación a Revisión por Señal Bajo Mínimo - H-05):**
   - **Tipo de siniestro:** Reembolso de exámenes de laboratorio ($120.000 CLP).
   - **Evidencia adjunta:** `evidencia_orden_002.pdf` y `evidencia_factura_002.pdf`.
   - **Señales del motor precalculadas:**
     - Consistencia identidad prestador: 96/100 (mínimo: 70).
     - Legibilidad de montos: 94/100 (mínimo: 70).
     - Coherencia orden médica: **64/100** (mínimo exigido configurado: 70).
     - Detección de fraude: 0.05 (sin alerta).
   - **Puntaje global consolidado:** **88.0 puntos** (cumpliría aprobación si el umbral fuera 85, o revisión intermedia).
   - **Decisión esperada:** **DERIVADO A REVISIÓN ASISTIDA** por regla de excepción: *Señal individual "Coherencia orden médica" (64) inferior al umbral mínimo exigido (70)*, pese al score global.
3. **Caso 3 (`CASO-MED-003` — Escalamiento Humano por Alerta de Fraude / Score Crítico):**
   - **Tipo de siniestro:** Reembolso de prótesis dental ($350.000 CLP).
   - **Evidencia adjunta:** `evidencia_boleta_adulterada_003.jpg`.
   - **Señales del motor precalculadas:**
     - Detección de edición digital en píxeles: **Alerta Positiva (Fraude detectado)**.
     - Legibilidad: 80/100.
     - Consistencia prestador: 45/100.
   - **Puntaje global consolidado:** **42.0 puntos**.
   - **Decisión esperada:** **ESCALAMIENTO OBLIGATORIO A AUDITOR HUMANO** (nunca rechazo automático según DEC-08 / H-08; precede alerta de fraude y tramo < 60 puntos).

- **Criterio de término:** Archivos de casos en `data/casos_prueba.json` y documentos ficticios alojados en `data/evidencias/`.

---

### 2.e Decisión y Comparación de Funcionalidades Candidatas (DEC-E2-04)
- **Responsable:** Todo el equipo (moderado por Rodrigo Guerrero).
- **Objetivo:** Comparar rigurosamente al menos 3 combinaciones de funcionalidades del menú oficial (F1 a F9) según las reglas de conexión, cobertura y riesgo.

| Criterio de Comparación | Opción 1 (Hipótesis Recomendada): F5 + F4 | Opción 2: F4 + F1 | Opción 3: F4 + F7 |
| :--- | :--- | :--- | :--- |
| **Funcionalidades** | **F5: Gestión de umbrales** + **F4: Puntaje y decisión por umbrales** | **F4: Puntaje y decisión** + **F1: Bandeja de revisión asistida** | **F4: Puntaje y decisión** + **F7: Medición de consumo** |
| **Naturaleza de la conexión** | F5 produce y versiona los umbrales (aprobación, mínimos, derivación); F4 los consume para procesar casos y emitir la decisión. | F4 evalúa el caso y, si cae en revisión, lo despacha a F1; el operador en F1 resuelve el caso. | F4 genera decisiones automáticas y derivadas; F7 contabiliza las transacciones facturables según la regla comercial. |
| **Hallazgos abiertos de E1 que toca** | **H-05 (Mínimos por señal)** y **DEC-01 (Umbral 90 configurable)**. | **H-05 (Mínimos)**, **H-08 (No rechazo <60)** y **H-12 (Sesgo de anclaje)**. | **H-04 (Cobro solo de automáticas)** y **H-16 (Tramos de volumen)**. |
| **Cobertura UC y Requisitos E1** | UC-01 (`Evaluar caso`), RQF-001, RQF-002, RQF-003, RQF-005, RQF-035, RQNF-001. | UC-01, UC-03 (`Revisión asistida`), RQF-001..005, RQF-008..012, **RQF-013**. | UC-01, RQF-001..005, RQF-026, RQF-027, RQF-028. |
| **Pruebas E1 existentes reutilizables** | `PF-001` a `PF-006`, `PF-010`, `PF-043`, `PX-001`, `PX-008`. | `PF-001` a `PF-006`, `PF-008` a `PF-012`, `PF-044`. | `PF-001` a `PF-006`, `PF-028`, `PX-001`. |
| **Análisis de riesgo técnico** | **BAJO:** Lógica determinista, reglas matemáticas claras, sin asincronía en tiempo real. | **ALTO:** F1 exige "tiempo restante y alerta de vencimiento". En la Entrega 1 **se excluyó deliberadamente RQF-013 de las pruebas** ([`fase6/Fase 6...md:L25`](../fases-y-plan-de-trabajo/fase6/Fase%206%20%E2%80%94%20Set%20de%20pruebas%20funcionales%20y%20extra-funcionales%20%28%C2%A75.3.2%29.md#L25)). No hay tests heredados para conteo regresivo de vencimiento y requeriría websockets o polling activo. | **MEDIO:** Menor impacto visual en frontend; riesgo de reabrir discusiones comerciales complejas sobre precios de tramos (H-16). |
| **Esfuerzo estimado (semana)** | 24–28 horas hombre totales. | 40–48 horas hombre totales. | 26–30 horas hombre totales. |
| **Balance de carga por integrante** | **Equilibrado:**<br>- Rodrigo: Motor de reglas + CRUD umbrales.<br>- Jorge: Editor de umbrales + Visor de cálculo y score.<br>- Lester: Tests unitarios, integración y E2E.<br>- Angel: Trazabilidad y gobernanza de reglas. | **Desbalanceado:**<br>- Jorge y Rodrigo saturados por maquetación de bandeja, visualizador de PDFs y timer de vencimiento.<br>- Lester con sobrecarga al tener que inventar pruebas para RQF-013. | **Desbalanceado:**<br>- Carga fuerte en backend/cálculo, interfaz muy simple (solo tablas de consumo). |

- **Conclusión de selección:** Se ratifica como propuesta oficial de trabajo el par **F5 + F4**.

---

### 2.f Instalación y Verificación de Spec Kit sobre Antigravity
- **Responsable:** Lester Gonzalez.
- **Principio de distribución de herramientas:** Solo quien ejecuta `specify init` en el repositorio requiere Python 3.11+ y la herramienta `uv`. Una vez inicializado y commiteado el andamiaje, el resto del equipo (Rodrigo, Jorge, Angel) **solo necesita Antigravity y Git**, ya que las skills y plantillas residen dentro del propio repositorio en `.agents/skills/`.

#### Procedimiento de Inicialización
```bash
# 1. Ejecutado únicamente por Lester en su estación:
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# 2. Registrar versión oficial para la portada del informe (6.2):
specify version > docs/entregable2/specify-version.txt

# 3. Inicializar Spec Kit con integración nativa para Antigravity ("agy"):
specify init proyecto-llm --integration agy

# 4. Verificar estructura generada en el repositorio:
#    .specify/              (plantillas maestras y scripts)
#    memory/constitution.md (reglas de gobernanza)
#    .agents/skills/        (skills instaladas para Antigravity)
```

#### Verificación de Comandos y Skills Instaladas
- Antigravity opera en modo skills bajo el directorio `.agents/skills/`.
- Comprobar la presencia de los comandos núcleo:
  - `/speckit-constitution`
  - `/speckit-specify`
  - `/speckit-plan`
  - `/speckit-tasks`
  - `/speckit-implement`
- **Verificación de comandos de calidad (`clarify`, `analyze`, `checklist`):**
  - Si `clarify` y `analyze` no aparecen como skills automáticas en la versión de Spec Kit instalada:
  - **Plan B para Análisis de Consistencia (permitido por pauta):** Se dispone el archivo `docs/entregable2/prompts/analisis-consistencia.md` con un meta-prompt riguroso ejecutado en el chat de Antigravity que audita:
    1. Requisitos de `spec.md` sin tarea asociada en `tasks.md`.
    2. Tareas en `tasks.md` sin justificación en `spec.md` ni en `plan.md`.
    3. Violaciones a los principios no negociables de `memory/constitution.md`.
    4. El resultado se exporta a `docs/entregable2/reporte-analisis-consistencia.md`.
- **Criterio de término:** Repositorio con estructura Spec Kit commiteada y confirmación de ejecución de `/speckit-constitution` en Antigravity.

---

### 2.g Ruta de Onboarding Técnico para Jorge Alvarez
- **Responsable:** Jorge Alvarez (tutelado por Lester Gonzalez y Rodrigo Guerrero).
- **Objetivo:** Nivelar rápidamente a Jorge (quien se integra en esta entrega) para que domine el dominio de MIRA, los casos de uso elegidos y las decisiones tomadas, permitiéndole participar con criterio en la fase `clarify` y en el diseño de interfaces.
- **Tiempo estimado total:** **4 horas y 30 minutos** (a ejecutar el domingo 11 de octubre).

#### Ruta de Lectura Mínima Priorizada
1. **Visión Global y Vocabulario (45 min):**
   - Leer [`README.md`](../README.md) del repositorio (contexto de DPRIME y MIRA).
   - Revisar las 26 entidades en [`fase3/modelo_dominio.json`](../fases-y-plan-de-trabajo/fase3/modelo_dominio.json), enfocándose en: `Caso`, `Puntaje`, `Señal`, `Umbral`, `Flujo`, `Decisión`.
2. **Casos de Uso de las Funcionalidades Elegidas (60 min):**
   - Leer exhaustivamente `UC-01 (Evaluar caso automáticamente)` en [`fase4/Fase 4 — Casos de uso (§5.3.2).md`](../fases-y-plan-de-trabajo/fase4/Fase%204%20%E2%80%94%20Casos%20de%20uso%20%28%C2%A75.3.2%29.md).
   - Analizar el flujo principal, los flujos alternativos (score intermedio, señal bajo mínimo) y excepciones.
3. **Requisitos y Pruebas del Alcance (60 min):**
   - Revisar `RQF-001` a `RQF-006` y `RQF-035` en [`fase5/requisitos-funcionales-y-no-funcionales-final-final.md`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md).
   - Revisar los casos de prueba `PF-001` a `PF-006` en [`fase6/pruebas-funcionales.md`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md).
4. **Decisiones Críticas de Negocio (45 min):**
   - Leer `DEC-01` (umbral 90 configurable), `DEC-05 / H-05` (mínimos por señal), `DEC-06` (SSO corporativo) y `DEC-08` (prohibición de rechazo bajo 60).
5. **Cuestionario de Validación de Onboarding (60 min):**
   - Reunión de 30 min con Rodrigo y Lester para responder:
     - *¿Qué ocurre si un caso tiene score 95 pero una señal clave está en 50?* (R: Derivado a revisión humana, no aprobado).
     - *¿Puede el sistema rechazar automáticamente a un usuario con 40 puntos?* (R: No, se escala obligatoriamente a revisión asistida).
     - *¿Cómo se relacionan F5 y F4 en la pantalla?* (R: En F5 configuro los valores y en F4 los veo reflejados al evaluar el caso).

---

## 3. Flujo SDD Fase por Fase

El desarrollo se ejecuta estrictamente a través de las 7 fases de SDD. La siguiente matriz operativa establece los insumos, comandos, responsabilidades y compuertas de control humano:

```
[0. Constitución] ──> [1. Especificación] ──> [2. Aclaración] ──> [3. Plan Técnico]
                                                                        │
[6. Implementación] <── [5. Consistencia] <── [4. Tareas (tasks)] <─────┘
```

### 3.1 Matriz Operativa de Fases SDD
| Fase | Comando / Skill | Conductor | Insumos desde Entrega 1 | Artefacto Generado y Ruta | Condición Específica de la Pauta | 👤 Revisión Humana Obligatoria | Criterio Objetivo de Término |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **0. Constitución** | `/speckit-constitution` | Humano (dictado guiado) | `DEC-01` a `DEC-16`, principios arquitectónicos de E1. | `memory/constitution.md` | Debe incorporar como principios no negociables las decisiones DEC de E1 que apliquen, citando su ID. | 👤 Revisión del equipo completo. Verificar que prohíba: mock de datos en producción, tests circulares, bypass de umbrales. | Archivo validado y commiteado con tag de fase. |
| **1. Especificación** | `/speckit-specify` | Humano (el equipo redacta) | `UC-01`, `RQF-001`..`006`, `RQF-035`, `data/casos_prueba.json`. | `specs/FEAT-001/spec.md` | Requisitos deben conservar sus IDs de E1 (`RQF-xxx`). Requisitos nuevos llevan ID nuevo y fuente. Cero mención a tecnologías. | 👤 Validación por Representante del Cliente (Rodrigo). Verificar que los `AC-N` sean verificables y contengan entradas/salidas. | Spec con criterios `AC-1` a `AC-8` y sección `[NEEDS CLARIFICATION]` poblada. |
| **2. Aclaración** | `/speckit-clarify` | Humano (Representante del Cliente responde) | Entrevistas ENT1..ENT9, `inconsistencias-revisadas.md`, `DEC-05` (H-05). | `specs/FEAT-001/spec.md` (actualizado) + `docs/entregable2/clarificaciones.md` | Toda pregunta del agente se responde fundándose en las fuentes de E1 o se declara y registra como supuesto del equipo. | 👤 Rodrigo responde como cliente; Jorge y Lester auditan que no asuma soluciones técnicas en vez de negocio. | Cero marcas `[NEEDS CLARIFICATION]` pendientes en el `spec.md`. |
| **3. Plan Técnico** | `/speckit-plan` | Agente propone, Humano corrige | `spec.md`, `modelo_dominio.json`, `RQNF-001`..`013`, `DEC-E2-05`. | `specs/FEAT-001/plan.md`, `research.md`, `data-model.md` | Debe declarar explícitamente qué RQNF de E1 atiende y cómo se verifican mediante pruebas. | 👤 **COMPUERTA CRÍTICA:** Revisión exhaustiva de arquitectura de datos y contratos antes de permitir generar tareas. | Plan aprobado por Rodrigo y Jorge; contrato de API F5↔F4 formalizado. |
| **4. Tareas** | `/speckit-tasks` | Agente genera, Humano refina | `plan.md`, `spec.md`, `backlog.md` (`HU-xxx`). | `specs/FEAT-001/tasks.md` | Cada tarea debe referenciar al menos un requisito de E1 (`RQF-xxx`) y un criterio de aceptación (`AC-N`). | 👤 Lester y Rodrigo revisan orden de dependencias y tamaño de tareas (unidades atómicas de <2 horas). | `tasks.md` ordenado en fases: Setup, Backend, Frontend, Integración, Tests. |
| **5. Análisis Consistencia** | `/speckit-analyze` (o Plan B prompt) | Agente audita, Humano evalúa | `constitution.md`, `spec.md`, `plan.md`, `tasks.md`. | `docs/entregable2/reporte-analisis-consistencia.md` | Reporte de consistencia formal. Si la herramienta no lo soporta nativo, se corre prompt propio y se adjunta. | 👤 Angel y Lester revisan vacíos detectados y ajustan spec o tareas antes de tirar código. | Reporte sin inconsistencias críticas ("Consistent / Ready for Implementation"). |
| **6. Implementación** | `/speckit-implement` | Agente propone código, Humano prueba y commitea | `tasks.md`, `plan.md`, suites `PF-001`..`006`. | `src/` (backend y frontend) y `tests/` | Un commit o PR por tarea o grupo coherente. Comentarios de trazabilidad obligatorios en código y tests. | 👤 **COMPUERTA DEL DIFF:** El humano ejecuta los tests, revisa el diff línea por línea y aprueba el commit. | Todos los tests de Vitest y Playwright en verde (`PASS`). |

### 3.2 Reglas Inflexibles de Operación en SDD
1. **`specify` y `clarify` son autoría humana:** El equipo introduce la especificación funcional y el representante del cliente responde las dudas. Si se le pide al modelo que invente el spec, el ejercicio se vuelve circular y pierde validez evaluativa.
2. **Los tests nacen de los criterios de aceptación de E1:** Las pruebas automatizadas se derivan de `AC-N` (provenientes de `PF-xxx` de la Entrega 1), jamás del código que el agente acaba de programar.
3. **Trazabilidad explícita en código:** Todo archivo de código y test debe incluir encabezados y comentarios de trazabilidad:
   ```typescript
   // Trazabilidad: RQF-002, AC-2, DEC-01
   // Implementa la regla de corte de aprobación automática con umbral parametrizable.
   ```
4. **Commits de corrección humana aislados:** Cuando el equipo modifique manualmente un artefacto o código propuesto por el agente, el cambio debe ir en un commit independiente con el prefijo `[HUMAN-FIX]`, documentando en el mensaje el motivo de la corrección.

---

## 4. 👤 Decisiones de Diseño Durante la Implementación

Durante el paso de `plan` e `implement`, el equipo enfrentará decisiones técnicas de diseño. Cada una debe ser resuelta por los integrantes y registrada formalmente:

### 4.1 Catálogo de Decisiones de Diseño y Responsabilidades
| # | Decisión Técnica | Opciones Consideradas | Hallazgo / Requisito Vinculado | Quién Propone | 👤 Quién Decide |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-01** | **Estructura del Modelo de Persistencia (SQLite)** | (a) Base monolítica con JSON sin tipar.<br>(b) Esquema relacional con tablas `flujos`, `umbrales`, `casos`, `senales_precalculadas` y `auditoria_cambios`. | `modelo_dominio.json`, `RQF-035`, `RQNF-008`. | Rodrigo (Backend) | 👤 Rodrigo + Jorge (valida soporte UI) |
| **D-02** | **Simulación del Motor de Análisis y Señales** | (a) Generador pseudo-aleatorio en runtime.<br>(b) Carga estática determinista desde archivo `data/casos_prueba.json` respaldado en SQLite. | §4.3 de la pauta (motor no se construye, 3 casos fijos). | Lester (QA) | 👤 Rodrigo (Representante) |
| **D-03** | **Mecanismo de Versionado y Aprobación de Umbrales (F5)** | (a) Sobrescritura directa de tabla.<br>(b) Tabla inmutable de versiones con estado `BORRADOR` / `APROBADO`, timestamp y usuario aprobador. | `RQF-022`, `RQF-035`, `DEC-01`. | Rodrigo (Backend) | 👤 Angel (audita trazabilidad) |
| **D-04** | **Autenticación Simulada (Impacto H-06)** | (a) Ignorar autenticación.<br>(b) Selector desplegable de sesión activa en la barra superior (Roles: *Admin de Riesgo*, *Operador*, *Auditor*) que inyecta headers de contexto. | `H-06` (SSO corporativo obligatorio; simulado para demo). | Jorge (Frontend) | 👤 Rodrigo (Representante) |
| **D-05** | **Inmutabilidad del Rastro de Auditoría (F4/F5)** | (a) Log en archivo plano `.txt`.<br>(b) Tabla relacional `rastro_auditoria` append-only, bloqueada a operaciones `UPDATE` y `DELETE` mediante triggers SQLite. | `H-12`, `RQNF-008`, `PX-008`. | Rodrigo (Backend) | 👤 Lester (QA / seguridad) |
| **D-06** | **Estrategia de Ejecución de Pruebas E2E** | (a) Pruebas manuales grabadas en video.<br>(b) Suite Playwright con fixtures que levantan servidor temporal y ejecutan el flujo F5 → F4 de punta a punta. | §6.5 pauta (al menos 1 E2E que recorra interfaz). | Lester (QA) | 👤 Lester |
| **D-07** | **Resolución de Mínimos por Señal (Impacto H-05)** | (a) Asumir mínimo de 70 a todas las señales.<br>(b) Fijar en F5 mínimos específicos para 3 señales críticas (Identidad: 70, Legibilidad: 70, Coherencia: 60) como supuesto formal de marcha blanca. | `H-05` (decisión abierta con cliente piloto). | Jorge / Rodrigo | 👤 Rodrigo (Representante del Cliente) |

### 4.2 Protocolo de Detección y Control de "Decisiones No Declaradas del Agente"
Un agente de IA frecuentemente toma micro-decisiones de diseño de forma silenciosa (por ejemplo, inventar campos en el JSON, cambiar nombres de estados, agregar validaciones arbitrarias o relajar restricciones). Para evitar esto, rige el siguiente procedimiento:

```
[Agente propone Diff en Plan/Implement]
                 │
                 ▼
[👤 Inspección Humana de Diff]
        │
        ├──> ¿Agregó campos, rutas o reglas no pedidas en spec.md?
        │           │
        │           ├──> SÍ: [VETO INMEDIATO]
        │           │        - Revertir propuesta.
        │           │        - Si afecta negocio -> Elevar a Rodrigo (Representante).
        │           │        - Registrar en docs/entregable2/decisiones-agente-rechazadas.md
        │           │
        │           └──> NO: ¿Es una micro-decisión técnica válida?
        │                       │
        │                       ├──> SÍ: Registrar en Bitácora DEC-E2-xx y continuar.
        │                       └──> NO: Aprobar commit directo.
```

---

## 5. División del Trabajo entre los 4 Integrantes

### 5.1 Frentes de Responsabilidad y Dueños de Artefactos
Para cumplir con la exigencia de la pauta de que cada integrante pueda defender cualquier línea de código y artefacto en las preguntas individuales, se distribuyen los frentes de la siguiente manera:

- **Frente 1: Backend, API y Motor de Evaluación (Rodrigo Guerrero)**
  - *Responsabilidades:* Servidor Node.js/TypeScript, endpoints REST de F5 (gestión de umbrales) y F4 (evaluación de casos), lógica matemática de corte y cálculo, simulación de señales precalculadas.
  - *Artefactos a su cargo:* Código en `src/backend/`, `specs/FEAT-001/plan.md` (co-autor), contratos OpenAPI.
  - *Rol de cliente:* Conduce y valida formalmente las fases `specify`, `clarify` y la sesión de aceptación final.

- **Frente 2: Interfaz de Usuario y Experiencia (Jorge Alvarez)**
  - *Responsabilidades:* Aplicación React + Vite, diseño de componentes en español, pantalla de configuración y versionado de umbrales (F5), pantalla de evaluación y desglose de score/señales (F4), selector de usuario simulado (H-06).
  - *Artefactos a su cargo:* Código en `src/frontend/`, integración de API en cliente, capturas de pantalla para informe 6.4.

- **Frente 3: Calidad, Testing Automatizado y Auditoría (Lester Gonzalez)**
  - *Responsabilidades:* Inicialización y configuración de Spec Kit sobre Antigravity, suites unitarias e integración en Vitest/Supertest, suite E2E en Playwright, script de rendimiento k6, gestión de incidencias en GitHub Issues.
  - *Artefactos a su cargo:* Código en `tests/`, reporte de análisis de consistencia, reporte de resultados de pruebas para informe 6.5.

- **Frente 4: Informe, Trazabilidad y Gobernanza SDD (Angel Salgado)**
  - *Responsabilidades:* Redacción del informe escrito en PDF (6.1 a 6.8), custodia de la matriz de trazabilidad, administración de la bitácora DEC, consolidación del log de prompts y armado de diapositivas PPT.
  - *Artefactos a su cargo:* `memory/constitution.md`, `docs/entregable2/matriz-trazabilidad.md`, `docs/entregable2/log-prompts.md`, informe final PDF.

### 5.2 Entregable Temprano Crítico: Contrato de Datos F5 ↔ F4
Para evitar que Jorge (UI) quede bloqueado esperando que Rodrigo termine el backend, el **Contrato de Datos e Interfaces TypeScript** se define y congela en el **Día 2 (Lunes 12)** en el archivo `src/shared/types.ts`:

```typescript
// src/shared/types.ts - Contrato de Interfaces F5 <-> F4
export interface UmbralesFlujo {
  idFlujo: string;
  version: number;
  umbralAprobacion: number;    // Por defecto 90 (DEC-01)
  umbralRevision: number;      // Por defecto 60 (DEC-08)
  minimoIdentidad: number;     // H-05 (supuesto: 70)
  minimoLegibilidad: number;   // H-05 (supuesto: 70)
  minimoCoherencia: number;    // H-05 (supuesto: 60)
  actualizadoPor: string;
  fechaActualizacion: string;
  estado: 'BORRADOR' | 'APROBADO';
}

export interface ResultadoEvaluacion {
  idCaso: string;
  scoreGlobal: number;
  decision: 'APROBADO_AUTOMATICO' | 'DERIVADO_REVISION' | 'ESCALADO_AUDITORIA';
  motivoDecision: string;
  alertasFraude: boolean;
  senalesBajoMinimo: string[];
  desgloseComponentes: {
    identidad: number;
    legibilidad: number;
    coherencia: number;
  };
  versionUmbralesAplicada: number;
  timestamp: string;
}
```
*Con este contrato, Jorge puede construir y probar toda la interfaz con datos mock locales mientras Rodrigo implementa los endpoints.*

### 5.3 Reglas de PR y Revisión Cruzada Obligatoria
- **Prohibición de auto-aprobación:** Ningún integrante puede fusionar un Pull Request a `main` sin la aprobación de al menos un revisor asignado.
- **Asignación cruzada de revisiones:**
  - PRs de Backend (Rodrigo) → Revisa **Jorge** (valida contratos) y **Lester** (valida testabilidad).
  - PRs de Frontend (Jorge) → Revisa **Rodrigo** (valida integración de datos) y **Lester** (valida criterios de usabilidad).
  - PRs de Pruebas (Lester) → Revisa **Rodrigo** (valida lógica de negocio).
  - PRs de Documentación / Spec (Angel) → Revisa **Rodrigo** (valida requisitos de cliente) y **Lester** (valida trazabilidad).

### 5.4 Gestión de Cuotas de Antigravity
Las sesiones complejas de generación de código (`plan` e `implement`) consumen un volumen significativo de contexto y llamadas al modelo. Para no agotar la cuenta de un solo integrante:
- **Lester:** Ejecuta `specify init`, `/speckit-constitution` y el análisis de consistencia.
- **Rodrigo:** Ejecuta las sesiones de generación del Backend (`tasks` de backend).
- **Jorge:** Ejecuta las sesiones de generación de componentes Frontend (`tasks` de frontend).
- **Angel:** Ejecuta las revisiones de trazabilidad y prompts de análisis comparativo.

### 5.5 Matriz RACI
- **R** = Responsible (quien ejecuta la tarea).
- **A** = Accountable (dueño final / quien aprueba).
- **C** = Consulted (consultado para la decisión).
- **I** = Informed (informado del resultado).

| Actividad / Entregable | Rodrigo (Backend / Cliente) | Jorge (Frontend) | Lester (QA / Testing) | Angel (Informe / Trazab.) |
| :--- | :---: | :---: | :---: | :---: |
| Formalizar DEC-01..16 y DEC-E2-01..05 | **A** | I | C | **R** |
| Exportar `backlog.md` desde GitHub Projects | I | I | **R / A** | C |
| Preparar datos de prueba y evidencias ficticias | **R / A** | C | C | I |
| Onboarding técnico de Jorge | C | **R / A** | C | I |
| Redacción de `memory/constitution.md` | C | C | C | **R / A** |
| Redacción de `specs/FEAT-001/spec.md` | **A** | C | C | **R** |
| Sesión de Aclaración (`clarify`) | **R / A** | C | C | I |
| Plan Técnico (`plan.md`) y Contrato de Datos | **R / A** | **R** | C | I |
| Generación y refinamiento de `tasks.md` | **R** | **R** | **A** | C |
| Reporte de Análisis de Consistencia | C | C | **R / A** | C |
| Implementación de Backend (Node/TS/SQLite) | **R / A** | C | C | I |
| Implementación de Frontend (React/Vite/UI) | C | **R / A** | C | I |
| Suites de Pruebas Automatizadas (Vitest/Playwright/k6) | C | C | **R / A** | I |
| Sesión de Aceptación con Representante Cliente | **R / A** | C (testigo) | C (testigo) | I (acta) |
| Prueba de Usabilidad con Evaluador Externo | I | C | **R / A** | I |
| Redacción del Informe Escrito PDF (6.1 a 6.8) | C | C | C | **R / A** |
| Elaboración de Diapositivas PPT | C | C | C | **R / A** |
| Ensayo y Ejecución de Demo en Vivo | **R** | **R** | **R** | **R / A** |

---

## 6. Calendario Día por Día (11 al 19 de Octubre de 2026)

Cronograma operativo para llegar al lunes 19 a las 14:00 con el repositorio congelado en tag `v2.0` y el informe PDF generado:

```
Dom 11: Setup, DEC-01..16, Backlog, Onboarding Jorge
Lun 12: Constitution, Specify, Contrato Datos F5<->F4, Clarify
Mar 13: Plan Técnico, Tasks, Análisis de Consistencia
Mié 14: Sprint Implementación Backend + Frontend (paralelo)
Jue 15: Integración F5+F4, Suites Unitarias Vitest pasando
Vie 16: E2E Playwright, k6 Rendimiento, Usabilidad Externa
Sáb 17: Sesión Aceptación Cliente, Redacción Informe (Angel)
Dom 18: CONGELAMIENTO (18:00), Tag v2.0, Ensayo Demo, PPT
Lun 19: Check final README (<15m), Entrega 14:00, Defensa
```

### 6.1 Detalle Diario de Tareas
- **Domingo 11 de Octubre (Día 0 — Preparación y Nivelación):**
  - [ ] Consolidar tabla de equivalencias `RQF-Bxx` ↔ `RQF-xxx` en git.
  - [ ] Formalizar `DEC-01` a `DEC-16` y fichas `DEC-E2-01` a `DEC-E2-05`.
  - [ ] Exportar `backlog.md` desde GitHub Projects.
  - [ ] Elaborar los 3 casos de prueba ficticios y guardar evidencias en `data/`.
  - [ ] Sesión de Onboarding de Jorge (4,5 hrs).
  - [ ] Lester inicializa Spec Kit con `--integration agy`.
- **Lunes 12 de Octubre (Día 1 — Constitución, Spec y Clarificación):**
  - [ ] Ejecutar `/speckit-constitution` e incorporar principios y DEC.
  - [ ] Redactar `/speckit-specify` para el incremento F5+F4.
  - [ ] Definir y commitear el contrato TypeScript en `src/shared/types.ts`.
  - [ ] Ejecutar sesión de aclaración `/speckit-clarify` (Rodrigo responde como cliente; resolver supuesto H-05).
- **Martes 13 de Octubre (Día 2 — Planificación y Análisis de Consistencia):**
  - [ ] Ejecutar `/speckit-plan` (definición de arquitectura SQLite, Express y React).
  - [ ] 👤 **Revisión humana del plan técnico:** verificar que no viole la constitución.
  - [ ] Ejecutar `/speckit-tasks` y desglosar tareas vinculadas a `RQF-xxx` y `AC-N`.
  - [ ] Ejecutar `/speckit-analyze` (o Plan B de consistencia). Generar `reporte-analisis-consistencia.md`.
- **Miércoles 14 de Octubre (Día 3 — Sprint de Implementación Desacoplada):**
  - [ ] Rodrigo: Implementa modelos SQLite y endpoints de F5 y F4 (con tests unitarios TDD).
  - [ ] Jorge: Maqueta pantallas de F5 (editor de umbrales) y F4 (panel de evaluación de casos) usando mocks.
  - [ ] Angel: Inicia redacción de secciones 6.2 (Introducción) y 6.3 (Método) del informe.
- **Jueves 15 de Octubre (Día 4 — Integración y Pruebas Unitarias/Integración):**
  - [ ] Conectar frontend de Jorge con backend de Rodrigo.
  - [ ] Lester ejecuta y audita suite Vitest + Supertest para endpoints F5/F4 (100% verde).
  - [ ] Verificar que los 3 casos ficticios se evalúen con precisión en la interfaz.
- **Viernes 16 de Octubre (Día 5 — Pruebas Avanzadas y Usabilidad):**
  - [ ] Lester implementa y ejecuta prueba E2E en Playwright (recorrido UI completo).
  - [ ] Lester ejecuta prueba de rendimiento extra-funcional con k6 (verificar SLA < 500ms en evaluación).
  - [ ] **Prueba de usabilidad externa:** Convocar a un integrante de otro equipo del taller. Registrar tarea asignada, tiempo de resolución y dificultades observadas en `docs/entregable2/usabilidad.md`.
  - [ ] Angel avanza secciones 6.4 (Implementación) y 6.5 (Pruebas).
- **Sábado 17 de Octubre (Día 6 — Aceptación del Cliente e Informe Central):**
  - [ ] 👤 **Sesión formal de aceptación:** Rodrigo evalúa el software contra cada `AC-N` en presencia de Lester y Jorge. Registrar acta en `docs/entregable2/sesion-aceptacion.md`.
  - [ ] Angel redacta sección 6.6 (Comparativa con E1: tablas 6.6.1/6.6.2 e indicadores) y sección 6.7 (Discusión).
- **Domingo 18 de Octubre (Día 7 — Congelamiento, Tag `v2.0` y PPT):**
  - [ ] **18:00 CLT: CONGELAMIENTO TOTAL DE CÓDIGO (Code Freeze).**
  - [ ] Prueba de clonación limpia en máquina secundaria: verificar que el proyecto levanta desde el `README.md` en < 15 minutos sin errores.
  - [ ] Crear y subir el tag oficial en git: `git tag -a v2.0 -m "Entrega 2 MIRA Oficial" && git push origin v2.0`.
  - [ ] Redactar secciones finales del informe: 6.1 (Resumen ejecutivo) y 6.8 (Conclusiones).
  - [ ] Compilar y revisar el PDF final del informe.
  - [ ] Diseñar diapositivas PPT de la presentación.
- **Lunes 19 de Octubre (Día 8 — Entrega y Defensa):**
  - [ ] 09:00–11:00 CLT: Ensayo cronometrado de la presentación oral (15 min exactos) y demo en vivo corriendo **estrictamente sobre el tag `v2.0`**.
  - [ ] 12:00 CLT: Subir informe PDF y PPT a la plataforma del curso.
  - [ ] **14:00 CLT: CIERRE DEFINITIVO DE ENTREGA.**
  - [ ] Presentación oral y ronda de preguntas individuales: `[POR CONFIRMAR fecha y hora]`.

### 6.2 Plan de Contingencia y Política de Recorte Priorizado
Si durante el desarrollo (miércoles/jueves) se acumulan atrasos que pongan en riesgo la entrega, se aplican los siguientes recortes en orden, sin violar jamás los mínimos exigidos por la pauta:
1. **Recorte 1:** Prescindir de animaciones o estilos avanzados en la UI; dejar interfaz en HTML/CSS funcional básico limpio.
2. **Recorte 2:** Simplificar la autenticación simulada (D-04) a un simple selector estático en el header.
3. **Recorte 3:** Reducir la suite E2E a exactamente 1 prueba principal en Playwright (mínimo de pauta).
- **LO QUE NUNCA SE PUEDE RECORTAR (Causa reprobación o descuento grave):**
  - La conexión funcional real entre F5 y F4.
  - El cumplimiento del `README.md` ejecutable en < 15 minutos (si falla, C4 baja a 3.0 máx).
  - Los 3 casos de prueba ficticios.
  - La prueba extra-funcional medible (k6).
  - La prueba de usabilidad con integrante externo.
  - El registro de la sesión de aceptación con el cliente.
  - La extensión máxima del informe por sección.

---

## 7. Sistema de Documentación para el Informe

### 7.1 Estructura Propuesta de Carpetas en el Repositorio
```
proyecto-llm/
├── .specify/                         # Plantillas y configuraciones de Spec Kit
├── memory/
│   └── constitution.md               # Principios no negociables del proyecto (Fase 0)
├── specs/
│   └── FEAT-001/                     # Especificación del incremento F5+F4
│       ├── spec.md                   # Requisitos funcionales y criterios AC-N
│       ├── plan.md                   # Arquitectura técnica, contratos y datos
│       ├── tasks.md                  # Lista de tareas trazables
│       ├── data-model.md             # Esquema relacional SQLite
│       └── research.md               # Decisiones tecnológicas exploradas
├── docs/
│   └── entregable2/
│       ├── equivalencias-requisitos.md # Mapeo RQF-Bxx <-> RQF-xxx
│       ├── backlog.md                # Backlog exportado con historias HU-xxx
│       ├── clarificaciones.md        # Q&A formal con el Representante del Cliente
│       ├── reporte-analisis-consistencia.md # Auditoría de coherencia entre artefactos
│       ├── matriz-trazabilidad.md    # Matriz completa RQF -> Spec -> Task -> Commit -> Test
│       ├── log-prompts.md            # Registro auditable de interacciones con el agente
│       ├── decisiones/               # Fichas DEC-01.md a DEC-16.md y DEC-E2-xx.md
│       ├── sesion-aceptacion.md      # Acta formal de aceptación con Rodrigo
│       ├── usabilidad.md             # Registro de prueba con evaluador externo
│       └── capturas/                 # Evidencias gráficas de la UI y ejecución
├── data/
│   ├── casos_prueba.json             # 3 casos ficticios estructurados
│   └── evidencias/                   # Documentos PDF/JPG ficticios simulados
├── src/                              # Código fuente (backend, frontend, shared)
└── tests/                            # Pruebas automatizadas (unitarias, e2e, k6)
```

### 7.2 Convención de Commits Semánticos
Cada commit debe reflejar con transparencia la fase del método y la autoría humana o del agente:
- Formato: `[PREFIJO] [ID-REQUISITO/TAREA]: Descripción clara del cambio`
- Prefijos obligatorios:
  - `[CONSTITUTION]`: Modificaciones a `memory/constitution.md`.
  - `[SPEC]`: Creación o edición de `spec.md`.
  - `[CLARIFY]`: Respuestas incorporadas en la fase de clarificación.
  - `[PLAN]`: Decisiones de diseño y arquitectura en `plan.md`.
  - `[TASK-xx]`: Código o test generado para una tarea específica de `tasks.md`.
  - `[HUMAN-FIX]`: **Corrección manual humana sobre artefacto o código del agente.** Debe detallar en el cuerpo del commit qué se corrigió y por qué.
  - `[TEST]`: Adición o refinamiento de casos de prueba.
  - `[DOC]`: Actualizaciones del informe, bitácora DEC o matriz.

### 7.3 Plantilla del Log de Prompts (`docs/entregable2/log-prompts.md`)
| Campo | Detalle a Registrar |
| :--- | :--- |
| **ID Interacción** | `PRM-001`, `PRM-002`, ... |
| **Fecha y Fase** | Fecha, hora y comando (`specify`, `plan`, `implement`, etc.) |
| **Prompt Ingresado** | Texto exacto del prompt o instrucción entregada al agente |
| **Resumen Salida Agente** | Síntesis del código, texto o artefacto propuesto por el modelo |
| **Intervención Humana** | [ ] Aceptado sin cambios / [ ] Ajustado parcialmente / [ ] Rechazado en su totalidad |
| **Detalle Corrección (Antes / Después)** | Qué texto o código exacto modificó el equipo humano |
| **Evaluación Crítica** | ¿Aportó valor o introdujo alucinaciones / desalineaciones? |

### 7.4 Matriz de Trazabilidad Canónica (`docs/entregable2/matriz-trazabilidad.md`)
La matriz debe permitir a cualquier evaluador seguir el hilo completo desde el análisis de la Entrega 1 hasta la prueba automatizada:

| Requisito E1 (`RQF-xxx`) | Equivalente PDF (`RQF-Bxx`) | Criterio Aceptación Spec (`spec.md`) | Tarea (`tasks.md`) | Archivo Código Fuente (`src/`) | Commit Hash | Prueba Automatizada (`tests/`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `RQF-001` | `RQF-B01` | `AC-1: Cálculo ponderado` | `T-04` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testScoreCalc` |
| `RQF-002` | `RQF-B02` | `AC-2: Corte por umbral 90` | `T-05` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testAutoApproval` |
| `RQF-003` | `RQF-B03` | `AC-3: Precedencia fraude` | `T-06` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testFraudPrecedence` |
| `RQF-005` | `RQF-B05` | `AC-4: Señal bajo mínimo (H-05)`| `T-07` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testMinSignalGate` |
| `RQF-035` | `RQF-B13` | `AC-5: Edición y versión umbrales`| `T-02` | `src/backend/routes/umbrales.ts`| `[hash]` | `tests/integration/umbrales.test.ts` |
| `RQNF-001`| `RQNF-B01`| `AC-8: SLA respuesta <500ms` | `T-12` | `src/backend/routes/eval.ts` | `[hash]` | `tests/perf/k6-evaluation-sla.js` |

### 7.5 Atribución de Origen de los Cambios
| Cambio o Artefacto en E2 | Quién lo Originó | Justificación y Evidencia en Git |
| :--- | :--- | :--- |
| Umbral 90 configurable | **Representante del Cliente (Rodrigo)** | Basado en `DEC-01` / ENT4. Fijado en `constitution.md` y `spec.md`. |
| Mínimos por señal en F5 (H-05) | **Equipo de Desarrollo (Supuesto)** | Acordado en `clarify` y documentado como supuesto de marcha blanca. |
| Estructura SQLite relacional | **Equipo de Desarrollo (Rodrigo)** | `DEC-E2-05` en contraposición al modelo no estructurado sugerido por el agente. |
| Campo `versionUmbralesAplicada` | **Agente (Aceptado por equipo)** | Propuesto por el agente en `plan.md` para robustecer trazabilidad de auditoría. |
| Normalización de tags en código | **Equipo de Desarrollo (Angel)** | Corrección manual en commit `[HUMAN-FIX]` tras intento del agente de inventar IDs. |

### 7.6 Mapeo de Secciones del Informe (6.1 a 6.8) y Fuentes
| Sección del Informe | Extensión Máx. | Fuentes Primarias de Información | Redactor Principal | Revisor Técnico |
| :--- | :---: | :--- | :--- | :--- |
| **6.1 Resumen ejecutivo** | 1/2 plana | Síntesis transversal de resultados de E2. | Angel Salgado | Rodrigo Guerrero |
| **6.2 Introducción y selección** | 1 plana | `DEC-E2-01` a `05`, `specify-version.txt`, roles de equipo. | Angel Salgado | Jorge Alvarez |
| **6.3 Aplicación del método** | 2 planas | `constitution.md`, `spec.md`, `clarificaciones.md`, `log-prompts.md`. | Angel Salgado | Lester Gonzalez |
| **6.4 Implementación** | 1,5 planas | Arquitectura Mermaid, esquemas SQLite, capturas UI de F5 y F4. | Jorge Alvarez / Rodrigo | Angel Salgado |
| **6.5 Pruebas y verificación** | 1,5 planas | Reportes Vitest, Playwright, k6, `sesion-aceptacion.md`, `usabilidad.md`. | Lester Gonzalez | Rodrigo Guerrero |
| **6.6 Comparativa con Entrega 1**| 3 planas | Tablas 6.6.1, 6.6.2, indicadores y respuestas a preguntas guía A a E. | Angel Salgado | Lester / Rodrigo |
| **6.7 Discusión crítica** | 1 plana | Bitácora de desalineaciones, lecciones aprendidas, SDD vs BMAD. | Angel Salgado | Todo el equipo |
| **6.8 Conclusiones** | 1/2 plana | Logros de aprendizaje y deuda técnica para Entrega 3. | Angel Salgado | Todo el equipo |
| **Anexos** | Sin límite | Matriz de trazabilidad, bitácora DEC completa, logs de prompts. | Angel Salgado | Lester Gonzalez |

### 7.7 Estructura Tentativa para Sección 6.6 (Comparativa con Entrega 1)
> ⚠️ `[SUPUESTO: pendiente de consulta al profesor]`: El enunciado del taller exige dos tablas obligatorias y tres indicadores para la sección 6.6 pero no define explícitamente sus nombres ni fórmulas en el cuerpo del documento (solo alude a la "tabla 6.6.1"). El equipo adopta y registra desde el Día 1 la siguiente estructura metodológica:

1. **Tabla 6.6.1 — Matriz de Evolución de Requisitos (Obligatoria):**
   - Columnas: `ID Requisito E1` | `Descripción Original` | `Estado en E2 (Sin cambio / Modificado / Descartado / Nuevo)` | `Motivo del Cambio o Descarte` | `Quién Originó el Cambio (Equipo / Cliente / Agente)`.
2. **Tabla 6.6.2 — Matriz de Reconciliación de Supuestos e Inconsistencias (Obligatoria):**
   - Columnas: `ID Inconsistencia E1 (H-xx)` | `Supuesto Original E1` | `Resolución Efectiva en Código E2` | `Impacto en la Arquitectura`.
3. **Los Tres Indicadores Cuantitativos:**
   - **Indicador 1 (Tasa de Preservación de Requisitos Must):**  
     $$\text{TPR} = \frac{\text{Requisitos Must de E1 implementados y verificados en E2}}{\text{Total Requisitos Must en el alcance de F5 y F4}} \times 100$$
   - **Indicador 2 (Tasa de Intervención Humana en Código - TIH):**  
     $$\text{TIH} = \frac{\text{Líneas de código modificadas/escritas por el equipo}}{\text{Líneas totales de código del incremento}} \times 100$$  
     *(Medido mediante análisis de commits `[HUMAN-FIX]` vs commits `[TASK-xx]` generados por el agente).*
   - **Indicador 3 (Índice de Retrabajo por Fase - IRF):**  
     $$\text{IRF} = \frac{\text{Número de preguntas y correcciones en clarify/plan}}{\text{Total de criterios AC-N}} \times 100$$

### 7.8 Medición Objetiva del Aporte del Agente en Git
Para responder rigurosamente en la sección 6.4 la proporción de código generado por el agente vs. el equipo humano:
- Commits generados por el agente tras `/speckit-implement` sin alteración: clasificados como *Código sin cambios*.
- Commits bajo prefijo `[HUMAN-FIX]`: computados como *Código corregido por el equipo*.
- Módulos de configuración manual (archivos de configuración, mocks de datos, scripts k6): computados como *Código escrito por el equipo*.
- El reporte se extraerá automáticamente antes de congelar mediante script git:
  `git log --stat --grep="\[HUMAN-FIX\]"` contrastado con el volumen total de líneas.

---

## 8. Puertas de Calidad y Definición de Terminado (DoD)

Para asegurar la máxima calificación (nota 7.0) y blindar la entrega contra las penalizaciones estipuladas en el capítulo 8 y 9 de la pauta, el incremento debe satisfacer los siguientes filtros:

### 8.1 Alineación con los Criterios de Evaluación y Descuentos
- **C1: Resumen ejecutivo (5%):** Exactamente 1/2 plana; responde qué se construyó, con qué método, 3 cambios más relevantes y recomendaciones futuras; cero jerga.
- **C2: Introducción y selección (5%):** Exactamente 1 plana; justifica F5+F4 por criterio de riesgo, conexión de datos explícita y cruce con H-05/DEC-01. Versión de Spec Kit documentada.
- **C3: Aplicación del método SDD (10%):** Todas las fases con su artefacto en git; evidencia de DEC en constitution; antes/después documentado en log de prompts; balance costo/valor por fase.
- **C4: Implementación (20%):** Repo levantable en menos de 15 min desde README; ambas funcionalidades operando en español; interfaz recorrible de punta a punta; modelo SQLite claro.
- **C5: Pruebas y verificación (5%):** Cobertura Must; al menos 1 prueba E2E (Playwright); 1 prueba extra-funcional con umbral numérico (k6); usabilidad con externo registrada; sesión de aceptación con cliente registrada.
- **C6: Comparativa con E1 (30%):** Ambas tablas completas (6.6.1 y 6.6.2); 3 indicadores calculados; respuestas fundadas en evidencia a bloques obligatorios A y B, y al menos 4 de C, D, E.
- **C8: Discusión (5%):** Exactamente 1 plana; reflexión crítica honesta sobre fallas del método, pérdidas en la traducción de spec a código y comparativa SDD vs BMAD.
- **C9: Conclusiones (5%):** Exactamente 1/2 plana; síntesis de aprendizajes y deudas técnicas.
- **C10: Presentación oral y demo (15%):** 15 min exactos; participan los 4; demo en vivo impecable corriendo sobre tag `v2.0`; dominio individual absoluto del código y arquitectura.

#### Penalizaciones Graves a Evitar Activamente
- ❌ **Cita o referencia inexistente:** Descuenta **1.0 punto** por ocurrencia en el criterio afectado. Todo ID (`RQF-xxx`, `DEC-xx`, `H-xx`, `PF-xxx`) debe existir físicamente en los archivos.
- ❌ **Repo que no levanta siguiendo el README en menos de 15 min:** Nota máxima del criterio C4 queda topada en **3.0**.
- ❌ **Artefacto obligatorio ausente:** Penalización directa en C3.
- ❌ **Exceso de páginas:** El evaluador corta la lectura al límite de la plana y no evalúa lo que exceda.

### 8.2 Definición de Terminado (DoD) por Fase
- [ ] **DoD Fase 0 (Constitución):** `memory/constitution.md` contiene las 16 decisiones DEC mapeadas y prohíbe la invención de requisitos.
- [ ] **DoD Fase 1 (Especificación):** `specs/FEAT-001/spec.md` tiene al menos 8 criterios de aceptación verificables sin mencionar tecnologías.
- [ ] **DoD Fase 2 (Aclaración):** Preguntas de ambigüedad respondidas por Rodrigo y documentadas con cita a la fuente.
- [ ] **DoD Fase 3 (Plan Técnico):** `plan.md` define arquitectura, tablas SQLite, endpoints REST y contrato TypeScript sin vacíos.
- [ ] **DoD Fase 4 (Tareas):** `tasks.md` ordenado lógicamente; cada tarea referencia su `RQF-xxx` y su `AC-N`.
- [ ] **DoD Fase 5 (Consistencia):** Reporte de consistencia ejecutado, sin discrepancias abiertas.
- [ ] **DoD Fase 6 (Implementación):** 100% de tests unitarios, integración, E2E y rendimiento pasando en verde.
- [ ] **DoD Global (Entrega):** Tag git `v2.0` empujado; informe PDF dentro de los límites de páginas; PPT lista y demo probada en máquina limpia.

---

## 9. Matriz de Riesgos y Mitigaciones Específicas

| # | Riesgo Identificado | Prob. | Impacto | Señal Temprana de Alerta | Protocolo de Mitigación Inmediata |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **R-01** | **Tests circulares generados por el agente** | Alto | Crítico | El test pasa de inmediato sobre código recién generado sin haber fallado nunca antes. | Los tests se derivan estrictamente de los criterios `AC-N` redactados previamente por el equipo humano. Lester revisa que el test verifique entradas/salidas de negocio y no la implementación interna. |
| **R-02** | **Requisitos inventados fuera de alcance** | Alto | Alto | El agente propone en el plan endpoints para "notificaciones por correo", "exportación a excel" o "roles avanzados". | `constitution.md` prohíbe explícitamente agregar funcionalidades no listadas en `spec.md`. Sección "Fuera de alcance" explícita en el spec. Rechazo inmediato del diff. |
| **R-03** | **Deriva de IDs entre RQF-xxx y RQF-Bxx** | Medio | Alto | El agente empieza a etiquetar pruebas como `PF-B01` o mezcla identificadores en los commits. | Aplicar `DEC-E2-02`. Todo prompt hacia el agente exige: *"Usa estrictamente la nomenclatura RQF-xxx de la Entrega 1 provista en docs/entregable2/equivalencias-requisitos.md"*. |
| **R-04** | **Agotamiento de cuota de Antigravity** | Medio | Alto | Respuestas truncadas o errores de rate limit en Antigravity durante sesiones de plan o implement. | Rotación de cuentas según [§5.4](#54-gestión-de-cuotas-de-antigravity). Desacoplar prompts en tareas pequeñas y modulares (<100 líneas por generación). |
| **R-05** | **Bloqueo entre Frontend y Backend** | Alto | Medio | Jorge no puede avanzar en pantallas porque los endpoints de Rodrigo no existen. | Congelamiento del contrato TypeScript `src/shared/types.ts` en el Día 2. Jorge usa un mock service worker o datos JSON locales para desarrollar toda la UI de forma independiente. |
| **R-06** | **Parálisis por Decisiones Abiertas (H-05, H-10)** | Medio | Medio | Discusiones prolongadas en clarify sobre cómo resolver los mínimos por señal o los tramos de clientes. | Rodrigo, en su rol de Representante del Cliente, fija un supuesto formal documentado en la sesión de aclaración y se avanza. Lo que no toque a F5/F4 se declara explícitamente "Fuera de Alcance". |
| **R-07** | **Desconocimiento del Dominio por Jorge (Nuevo)** | Alto | Medio | Jorge diseña una UI que asume que el sistema rechaza automáticamente casos bajo 60 puntos (violando DEC-08). | Onboarding guiado el Día 0 ([§2.g](#2g-ruta-de-onboarding-técnico-para-jorge-alvarez)) con cuestionario de validación previo a su intervención en diseño. |
| **R-08** | **Conflicto de Interés de Rodrigo (Aceptación)** | Alto | Crítico | Rodrigo aprueba su propio backend sin probar casos de borde. | Aplicación obligatoria de `DEC-E2-03`: criterios congelados en Día 1; sesión sincrónica de aceptación con Lester y Jorge presentes como testigos activos; acta formal firmada en git. |
| **R-09** | **Dependencia de un Solo Integrante (Bus Factor)** | Medio | Alto | Un integrante se enferma o desconecta el fin de semana del sprint. | Repositorio al día con PRs pequeños integrados diariamente. Toda decisión registrada en markdown. Contratos claros para que cualquiera pueda tomar un frente retrasado. |
| **R-10** | **Fuga de Secretos o Datos Reales al Repositorio** | Bajo | Crítico | Commits con credenciales, tokens o archivos con datos sensibles reales. | Uso exclusivo de datos sintéticos ficticios en `data/`. Archivo `.gitignore` configurado estrictamente para ignorar `.env`, logs y caches locales. |

---

## 10. Consultas Pendientes al Profesor y Puntos por Confirmar

### 10.1 Consultas Formales Pendientes de Respuesta Docente
Las siguientes dudas formales han sido levantadas respecto al enunciado y la rúbrica oficial. Mientras el profesor responde, rige el supuesto operativo por defecto establecido por el equipo:

#### Consulta 1: Incorporación de Integrante Nuevo (Jorge Alvarez)
- **Pregunta formulada:** *"La pauta indica que el equipo debe ser de 3 o 4 integrantes ('mismo equipo de la Entrega 1'). En nuestro caso se suma Jorge Alvarez en reemplazo/adición, quien no participó en la Entrega 1. ¿Existe alguna consideración especial para su evaluación individual en la ronda de preguntas?"*
- **Estado:** `[pendiente de respuesta]`
- **Supuesto operativo por defecto del equipo:** Jorge realiza el plan de onboarding riguroso del Día 0 ([§2.g](#2g-ruta-de-onboarding-técnico-para-jorge-alvarez)) y se capacita para defender el modelo de dominio completo y la arquitectura de la Entrega 1 con el mismo estándar que el resto del equipo.

#### Consulta 2: Estructura Exacta de Tablas e Indicadores de la Sección 6.6
- **Pregunta formulada:** *"La pauta exige 'dos tablas obligatorias y tres indicadores' en la sección 6.6, pero solo cita la tabla 6.6.1 en el texto sin definir los nombres exactos ni las fórmulas. ¿Son vinculantes las dos tablas y tres indicadores propuestos en nuestra guía operativa?"*
- **Estado:** `[pendiente de respuesta]`
- **Supuesto operativo por defecto del equipo:** Rige la estructura propuesta en [§7.7](#77-estructura-tentativa-para-sección-66-comparativa-con-entrega-1) (Tabla 6.6.1 de Requisitos, Tabla 6.6.2 de Supuestos, Indicadores TPR, TIH e IRF), la cual se adopta y registra desde el inicio.

#### Consulta 3: Inconsistencia en la Rúbrica de Calificación (Capítulo 8)
- **Pregunta formulada:** *"El texto de la pauta señala: 'La evaluación considera diez criterios... todos ponderan lo mismo (10 %)'. Sin embargo, la tabla inmediatamente inferior lista nueve criterios (omitiendo C7) con ponderaciones asimétricas que suman 100% (ej. C6 al 30%, C4 al 20%, etc.). ¿Cuál ponderación rige para la calificación final?"*
- **Estado:** `[pendiente de respuesta]`
- **Supuesto operativo por defecto del equipo:** El equipo se alinea con la tabla de ponderaciones asimétricas explícita (C6 con 30%, C4 con 20%, C10 con 15%, etc.), priorizando el esfuerzo en la comparativa analítica y la implementación ejecutable.

#### Consulta 4: Universo de Requisitos para Trazabilidad
- **Pregunta formulada:** *"¿El universo cerrado de requisitos del proyecto corresponde a los 49 requisitos del PDF consolidado de la Entrega 1 (`RQF-Bxx`) o a los 75 requisitos del repositorio Markdown (`RQF-xxx`)?"*
- **Estado:** `[pendiente de respuesta]`
- **Supuesto operativo por defecto del equipo:** Se aplica la equivalencia oficial (`DEC-E2-02`), manteniendo la trazabilidad directa sobre el subconjunto de requisitos Must que tocan las dos funcionalidades elegidas (F5 y F4).

---

### 10.2 Lista Consolidada de Puntos `[POR CONFIRMAR]`
1. **`[POR CONFIRMAR cita]`:** Cita textual exacta (§ de la descripción de MIRA o marca de tiempo de ENTn) que respalda formalmente la restricción de marcha blanca solo a siniestros de reembolsos médicos. *(Responsable de ubicar la cita antes del miércoles 14: Angel Salgado).*
2. **`[POR CONFIRMAR fecha y hora]`:** Horario y orden de presentación de la defensa oral del equipo para el lunes 19 de octubre. *(Responsable de consultar con delegado de curso: Rodrigo Guerrero).*
3. **`[POR CONFIRMAR universo de requisitos]`:** Confirmación docente sobre si la evaluación de cobertura de requisitos Must se coteja contra la lista de 49 del PDF o los 75 del markdown. *(Monitorea: Angel Salgado).*
4. **`[POR CONFIRMAR comandos calidad agy]`:** Confirmación práctica durante el setup de si Spec Kit v0.1.x incluye los alias nativos `/speckit-clarify` y `/speckit-analyze` en Antigravity o si se opera automáticamente con el Plan B documentado en `docs/entregable2/prompts/`. *(Verifica en máquina el domingo 11: Lester Gonzalez).*

---
*Fin de la Guía Operativa. Archivo de control versionado para la Entrega 2 de MIRA.*

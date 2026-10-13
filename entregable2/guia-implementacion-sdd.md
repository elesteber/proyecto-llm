# Guía Operativa de Implementación SDD (Spec Kit) — Entrega 2 MIRA

**Taller de Desarrollo de Software Conducido por Agentes de IA**  
**Facultad de Ingeniería, Escuela de Ingeniería Informática — Universidad de Valparaíso**  
**Caso:** MIRA — Plataforma de Inteligencia Multimodal para Decisiones Empresariales (DPRIME SpA)  
**Fecha de actualización:** Lunes 12 de octubre de 2026 (16:30 CLT)  
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
- **Antecedentes de la Entrega 1:** Calificación `67 [POR CONFIRMAR escala, probablemente 6,7 sobre 7,0]`. Dictamen docente: artefactos de análisis aprobados sin solicitud de modificaciones retroactivas; observaciones focalizadas exclusivamente en detalles de la presentación oral.
- **Regla de oro de diseño:** Las decisiones de diseño de software las toman los ingenieros humanos, no el agente. El agente propone alternativas y redacta; nunca elige ni impone soluciones.

### 0.2 Integrantes y Roles Base del Equipo
1. **Rodrigo Guerrero:** Desarrollo Backend (Node.js/TypeScript) y **Representante del Cliente** para la Entrega 2.
2. **Jorge Alvarez:** Desarrollo Frontend / Interfaz de Usuario (Node.js, React, Vite). Integrante que se suma en esta entrega (no participó en la Entrega 1).
3. **Lester Gonzalez:** Estrategia de Pruebas y Aseguramiento de Calidad (automatización, unitarias, integración, E2E, reproducibilidad). Ejerció como Representante del Cliente en la Entrega 1.
4. **Angel Salgado:** Redacción del Informe Escrito, Gobernanza de Documentación, Matriz de Trazabilidad y Bitácora DEC.

---

## 1. Registro de Decisiones Iniciales (Bitácora DEC)

A continuación se registran formalmente las decisiones iniciales del proyecto bajo la plantilla estándar de la bitácora (`DEC-xx`):

### DEC-E2-01: Selección del Método de Desarrollo (SDD con Spec Kit sobre Antigravity)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-01` |
| **Fecha** | 12-10-2026 |
| **Asunto** | Adopción de Spec-Driven Development (Opción A) como método rector para la Entrega 2 |
| **Contexto** | El enunciado del Entregable 2 ([`entregable2-mira-pauta.md`](entregable2-mira-pauta.md#L60-L92)) exige optar formalmente entre Opción A (SDD) y Opción B (BMAD). La Entrega 1 concluyó con 40 pruebas funcionales (PF), 12 pruebas extra-funcionales (PX) y 3 casos de uso críticos detallados paso a paso (UC-01, UC-02, UC-03). |
| **Alternativas** | **(a) Opción A — SDD (GitHub Spec Kit sobre IDE Antigravity):** Enfoque centrado en la especificación (`constitution` → `specify` → `clarify` → `plan` → `tasks` → `implement`).<br>**(b) Opción B — BMAD:** Enfoque centrado en la simulación de un equipo de software mediante 5 roles de agentes en archivos Markdown/YAML (`bmad-agent-analyst`, `bmad-agent-pm`, `bmad-agent-architect`, `bmad-agent-dev`, `bmad-agent-ux-designer`). |
| **Decisión** | Se adopta formalmente la **Opción A (SDD con Spec Kit sobre Antigravity)**. Decisión confirmada por el equipo el 12-10-2026. |
| **Justificación** | Los artefactos heredados de la Entrega 1 presentan una estructura *spec-first*: los flujos primarios y alternativos de UC-01/02/03 y las tablas de requisitos y pruebas ya contienen especificaciones operativas densas. SDD aprovecha directamente estos insumos lineales sin requerir la sobrecarga ceremonial de simular un ciclo multi-rol completo. |
| **Insumo para Discusión 6.7 ("Qué esperaríamos haber encontrado con BMAD")** | Si se hubiese elegido BMAD, se habría contado con roles especializados de software (Mary/Analyst, John/PM, Winston/Architect, Amelia/Dev, Sally/UX) con compuertas estructuradas (`bmad-sprint-planning` emitiendo veredicto *PASS/CONCERNS/FAIL*) y checkpoints humanos obligatorios en el diff durante `bmad-build`. Asimismo, para conciliar las tensiones de las áreas de negocio levantadas en las entrevistas (Daniela, Valentina, Hugo, Sebastián), se habría requerido simular mesas de trabajo mediante `bmad-party-mode`, lo que habría demandado mayor esfuerzo en prompts de personalización de roles antes de iniciar la implementación. |
| **Impacto** | Obligatoriedad de generar los artefactos exigidos: `constitution.md`, `spec.md`, registro de clarificación, `plan.md`, `tasks.md`, reporte de consistencia y commits trazables por tarea. |

---

### DEC-E2-02: Nomenclatura Rectora de Requisitos y Gestión de Divergencias
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-02` |
| **Fecha** | 12-10-2026 |
| **Asunto** | Nomenclatura canónica de requisitos, convención de citación con archivo fuente y gestión de colisión de IDs |
| **Contexto** | En la Entrega 1 conviven múltiples numeraciones y una colisión crítica de identificadores entre fuentes:<br>1. **Colisión interna en Markdown:** Entre [`fase5/requisitos-funcionales-y-no-funcionales-final-final.md`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md) y [`fase5/fase5-lester/requisitos_formato_final.md`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md), los IDs `RQF-020`, `RQF-023`, `RQF-039`, `RQF-040`, `RQF-041` y `RQNF-002` significan conceptos completamente distintos.<br>2. **Discrepancia con el informe PDF:** En [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) (págs. 9-12) se utilizó `RQF-Bxx` (36 requisitos funcionales) y `RQNF-Bxx` (13 no funcionales).<br><br>⚠️ **Tabla de Advertencia: Colisión de IDs entre archivos de Fase 5:**<br>• `RQF-020`: en `final-final.md` = encolar peticiones excedentes; en `fase5-lester` = derivar a bandeja humana o rechazar automáticamente casos bajo 60.<br>• `RQF-023`: en `final-final.md` = crear caso nuevo vinculado al recibir evidencia de caso cerrado; en `fase5-lester` = imponer derivación sobre puntaje automático si alerta de fraude.<br>• `RQF-039`: en `final-final.md` = carga manual por formulario web; en `fase5-lester` = exigir dos aprobaciones separadas antes de modificar umbrales.<br>• `RQF-040`: en `final-final.md` = extraer texto y firmas contenidos en documentos cargados; en `fase5-lester` = aprobar automáticamente según umbral definido (80, 85, 90) sin fraude.<br>• `RQF-041`: en `final-final.md` = detectar objetos y daños en fotos y extraer metadatos; en `fase5-lester` = derivar o rechazar ignorando puntaje si alerta de fraude o señal bajo mínimo.<br>• `RQNF-002`: en `final-final.md` = conservar expedientes de 90 días a 10 años; en `fase5-lester` = reconstruir comportamiento, evidencias y reglas de decisión pasada basándose en historial. |
| **Alternativas** | **(a)** Migrar todo el código, specs y tests a `RQF-Bxx`.<br>**(b)** Adoptar la numeración de `fase5/fase5-lester/requisitos_formato_final.md` como convención rectora (dado que la suite de pruebas de `fase6/pruebas-funcionales.md` apunta directamente a ella) y construir una tabla de equivalencias verificada por contenido hacia `final-final.md` y hacia el PDF.<br>**(c)** Crear una nomenclatura nueva exclusiva para la Entrega 2. |
| **Decisión** | Se adopta la **Alternativa (b)**: **la guía usa la numeración de `fase5/fase5-lester/requisitos_formato_final.md`**, porque las pruebas de [`fase6/pruebas-funcionales.md`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md) apuntan a ella. Se establece la **exigencia formal de que la spec (`spec.md`), la matriz de trazabilidad (`matriz-trazabilidad.md`) y el informe final citen cada requisito con su archivo fuente** (por ejemplo: `RQF-040 [fase5-lester]`, `RQF-028 [final-final]`, `RQF-B10 [PDF pág. 9]`), y se agrega una columna "Fuente" a la matriz de trazabilidad. [pendiente de firma del equipo]. |
| **Justificación** | Las pruebas funcionales existentes (`PF-001` a `PF-045`) fueron programadas y auditadas sobre `fase5-lester/requisitos_formato_final.md`. Modificar los IDs sin trazabilidad de archivo fuente generaría desalineación crítica con la suite de pruebas heredada. |
| **Pendiente por confirmar** | `[POR CONFIRMAR universo de requisitos]`: Se debe contrastar con el docente si el universo cerrado y oficial del proyecto corresponde a `final-final.md`, a `fase5-lester` o al PDF consolidado de 49 requisitos (ver consulta ampliada en [§10.1](#101-consultas-formales-pendientes-de-respuesta-docente)). Mientras tanto, rige la numeración de `fase5-lester` citando siempre el archivo fuente. |
| **Impacto** | Todas las referencias en código fuente, comentarios de tests (`// RQF-040 [fase5-lester]`), especificaciones, matriz de trazabilidad e informe escrito deben utilizar la nomenclatura rectora acompañada explícitamente de su archivo fuente. |

---

### DEC-E2-03: Asignación del Representante del Cliente y Protocolo de Aceptación
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-03` |
| **Fecha** | 12-10-2026 |
| **Asunto** | Rotación obligatoria del Representante del Cliente y protocolo de mitigación operativa |
| **Contexto** | La pauta de la Entrega 2 ([`entregable2-mira-pauta.md`](entregable2-mira-pauta.md#L135-L143)) exige la rotación obligatoria del Representante del Cliente (Lester Gonzalez ejerció en la Entrega 1 y queda inhabilitado). Rodrigo Guerrero asume la representación del cliente pero es a su vez el desarrollador del backend. |
| **Riesgo identificado** | Conflicto de interés técnico: el mismo desarrollador que implementa la lógica de backend evalúa y acepta los criterios de aceptación en la sesión de entrega, con riesgo de auto-aprobación complaciente. |
| **Alternativas** | **(a)** Dejar a Rodrigo como representante sin salvaguardas.<br>**(b)** Asignar a Jorge Alvarez (recién ingresado, sin contexto del cliente).<br>**(c)** Asignar a Rodrigo con protocolo estricto de mitigación cruzada: criterios de aceptación congelados previamente en `spec.md`, con presencia obligatoria de Lester y Jorge durante la sesión de aceptación como observadores y validadores. |
| **Decisión** | Se adopta la **Alternativa (c)**. Rodrigo Guerrero es el Representante del Cliente oficial. Decisión confirmada por el equipo el 12-10-2026. |
| **Mitigación formal** | 1. Los criterios de aceptación (`AC-xx`) quedan fijados en `spec.md` y validados por el equipo *antes* de iniciar la implementación.<br>2. La sesión de aceptación se realiza en sesión sincrónica registrada con Lester (QA) y Jorge (UI) presentes como validadores cruzados.<br>3. Todo rechazo o ajuste en la aceptación se registra en un acta inmutable adjunta al informe. |
| **Impacto** | Garantiza la validez metodológica exigida por el criterio C5 de la rúbrica docente. |

---

### DEC-E2-04: Selección de Funcionalidades del Incremento (F5 + F4)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-04` |
| **Fecha** | 12-10-2026 |
| **Asunto** | Selección formal del par de funcionalidades conectadas para el incremento funcional |
| **Contexto** | El capítulo 4 de la pauta exige implementar exactamente 2 funcionalidades del menú oficial (F1 a F9), conectadas entre sí (productor → consumidor), y que al menos una toque un hallazgo abierto o resuelto con supuestos en la Entrega 1. |
| **Opciones comparadas** | F5+F4 vs. F4+F1 vs. F4+F7 (detalle en [§2.e](#2e-decisión-y-comparación-de-funcionalidades-candidatas-dec-e2-04)). |
| **Decisión** | Se adopta formalmente el par **F5 (Gestión de umbrales) + F4 (Puntaje y decisión por umbrales)**. Decisión confirmada por el equipo el 12-10-2026. |
| **Justificación técnica** | F5 actúa como productor (gestiona, versiona y aprueba umbrales y mínimos por señal); F4 actúa como consumidor (ejecuta el cálculo determinista de puntaje y toma la decisión aplicando los umbrales vigentes aprobados en F5). Par determinista, acotado, sin dependencias de streaming ni websockets; resuelve directamente la inconsistencia abierta H-05 (mínimos por señal) y la decisión DEC-01 (umbral configurable de 90 puntos). |
| **Impacto** | Define la arquitectura de contratos, el modelo de datos SQLite, las pantallas de UI y las suites de prueba. |

---

### DEC-E2-05: Definición del Stack Tecnológico y Herramientas
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-05` |
| **Fecha** | 12-10-2026 |
| **Asunto** | Definición del stack tecnológico de frontend, backend, persistencia y testing |
| **Contexto** | La pauta exige una aplicación web con interfaz en español, operable de punta a punta sin tocar base de datos ni devtools, levantable en menos de 15 minutos desde el README, con pruebas automatizadas, E2E y prueba extra-funcional medible. |
| **Stack acordado** | - **Backend:** Node.js (v20+ LTS) con TypeScript y Express / Fastify.<br>- **Frontend:** React 18+ con TypeScript, Vite y CSS modular / TailwindCSS.<br>- **Persistencia:** SQLite (modo local archivo `mira.db`) con Better-SQLite3 o Drizzle ORM ligero.<br>- **Pruebas unitarias/integración:** Vitest + Supertest.<br>- **Pruebas E2E:** Playwright (modo headless y con navegador).<br>- **Prueba extra-funcional medible:** Prueba automatizada de reproducibilidad y trazabilidad determinista (100% de consistencia decisional sobre versiones guardadas según H-14 / DEC-14); k6 se conserva como herramienta opcional para medir línea base exploratoria de latencia, sin denominarla SLA.<br>- **Seguimiento de defectos:** GitHub Issues (en el repositorio oficial). Decisión confirmada por el equipo el 12-10-2026. |
| **Justificación** | Stack dominado por el equipo (Rodrigo en Node, Jorge en React). SQLite garantiza cero fricción de instalación (sin containers Docker pesados ni bases de datos remotas), asegurando que el evaluador clone y levante el sistema en menos de 5 minutos vía `npm install && npm run dev`. |
| **Impacto** | Define las dependencias de `package.json`, la configuración de CI/test local y el procedimiento de arranque del `README.md`. |

---

### DEC-01: Formalización de Inconsistencia H-01 (Umbral de Aprobación Automática)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-01` (formalización oficial del hallazgo `H-01` / `HC-001`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Fijación del umbral de aprobación automática y resolución de discrepancia interna |
| **Contexto** | En §2.6 conviven valores contradictorios: "sobre 85 se aprueba automáticamente" vs. "a partir de 80 puntos sin señales de fraude". En ENT2 [00:13:05], Camila Ordóñez admite que fueron números referenciales sin base científica ("Yo puse ochenta y cinco, sesenta y cero como referencia... No hay ninguna ciencia detrás de esos números"). En ENT4 [00:11:06], Francisca Leiva (cliente piloto) exige explícitamente: "yo automatizaría solo sobre noventa puntos, no sobre ochenta y cinco". En el análisis de UC-01 de la Entrega 1 quedó consignada la nota "85 vs 80 puntos sin resolver". |
| **Alternativas** | **(a)** Adoptar 80 puntos.<br>**(b)** Adoptar 85 puntos.<br>**(c)** Adoptar 90 puntos rígidos.<br>**(d)** Adoptar umbral **≥ 90 puntos** como valor por defecto, configurable por cliente y flujo en la base de datos. |
| **Decisión** | Se adopta la **Alternativa (d)**: se fija en la especificación que el umbral de aprobación automática es **≥ 90 puntos** como decisión del equipo (operativizando la exigencia de Francisca Leiva en ENT4: "sobre noventa"), parametrizable mediante la funcionalidad F5. Se adopta el valor más alto y conservador entre los valores en conflicto y se deja configurable para ajustarlo empíricamente durante la marcha blanca. Decisión confirmada por el equipo el 12-10-2026. |
| **Justificación** | Se respeta el principio de adoptar el valor más conservador y exigido por el cliente piloto, dejando el motor desacoplado de constantes "quemadas" en código. Esta decisión formaliza y resuelve la nota "85 vs 80 sin resolver" de la Entrega 1, sin alterar retroactivamente los documentos históricos. |
| **Impacto** | Requisitos `RQF-040 [fase5-lester]` (cuyo equivalente verificado por contenido en `final-final.md` es `RQF-005`, y en el PDF es `RQF-B10 [pág. 9]`; mientras que `RQF-044` en `final-final.md` corresponde a configuración de umbrales por cliente/flujo y no a la aprobación automática), caso de uso `UC-01`, caso de prueba `PF-020` (cuya precondición textual en el PDF y en Fase 6 dice "sobre 90", formalizada como "≥ 90" por el equipo) y lógica de evaluación de F4. |

---

### DEC-E2-06: Precedencia Absoluta de Alerta de Fraude con Derivación a Revisión Asistida
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-06` |
| **Fecha** | 12-10-2026 |
| **Asunto** | Regla de precedencia de señales de fraude y destino exclusivo de derivación manual |
| **Contexto** | En MIRA §3 se establece como regla de negocio textual: *"Las señales de fraude tienen precedencia sobre el puntaje total… Un caso con una señal de fraude activa se deriva o se escala, cualquiera sea su puntaje"*. Asimismo, en la Entrega 1, en la relación `Puntaje` ↔ `Umbral` de `modelo_dominio.json` ([`líneas 615-619`](../fases-y-plan-de-trabajo/fase3/modelo_dominio.json#L615-L619)), se ratifica en su excepción detectada: *"Aunque el puntaje sea aprobatorio (ej. mayor a 80/85), si una señal de fraude está activa o una señal individual no alcanza su mínimo propio, se ignora el puntaje y se deriva o rechaza el caso"*. Por su parte, en ENT6 [00:04:06], Daniela Cortés (Cumplimiento) exige que decida una persona: *"En el documento, el tramo bajo sesenta dice 'escalamiento o rechazo'... ese 'o rechazo' es exactamente lo que no puede quedar así... Lo que no puede ocurrir es un rechazo automático. Ahí necesito una persona que decida y que pueda explicar"*. Los requisitos `RQF-023 [fase5-lester]` ([`fase5/fase5-lester/requisitos_formato_final.md:L25`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L25)) y `RQF-028 [final-final]` ([`fase5/requisitos-funcionales-y-no-funcionales-final-final.md:L30`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md#L30)) exigen imponer la derivación sobre el puntaje automático ante alerta de fraude activa (en el PDF de la Entrega 1 su cobertura es parcial por contenido bajo `RQF-B12 [pág. 9]`, donde el PDF estipula resolución de "Rechazado, ignorando el puntaje total", regla que queda formalmente superada por DEC-08 / DEC-E2-06 al exigir derivación a revisión asistida sin rechazo; además, la tabla de pruebas del PDF en pág. 13 incluye `PF-018` que verifica textualmente `RQF-023`). |
| **Alternativas** | **(a)** Permitir que un puntaje perfecto (100) apruebe un caso aunque tenga sospecha de fraude.<br>**(b)** Rechazar automáticamente el caso ante fraude.<br>**(c)** Una señal de fraude activa siempre deriva obligatoriamente a revisión asistida (bandeja manual), independientemente de que el puntaje sea 100 y de que los mínimos individuales se cumplan. |
| **Decisión** | Se adopta la **Alternativa (c)**: **una señal de fraude activa siempre deriva a revisión asistida manual, sin importar el puntaje y sin rechazo automático.** Lo nuevo que aporta esta decisión es únicamente **fijar "siempre derivar"** (a revisión asistida), eliminando las alternativas históricas de escalamiento no asistido o rechazo automático contempladas en MIRA §3 y en `modelo_dominio.json:L618`. Decisión confirmada por el equipo el 12-10-2026. |
| **Justificación** | Concilia armónicamente la regla de precedencia de fraude de MIRA §3 con la prohibición expresa de rechazos automáticos dictada por Cumplimiento (Daniela Cortés, ENT6 [00:04:06] / H-08 / DEC-08). |
| **Impacto** | Lógica de evaluación de F4, requisitos `RQF-023 [fase5-lester]` / `RQF-028 [final-final]` (en PDF cubierto parcialmente por `RQF-B12 [pág. 9]`, superando el rechazo automático), caso de prueba `PF-018` y Caso de Prueba 3 del incremento. |

---

## 2. Preparación Previa a `specify init`

Antes de invocar comandos de generación de Spec Kit, el equipo ejecuta los siguientes pasos preparatorios:

```
[2.a Tabla Equivalencias RQF] ──> [2.b Formalizar DEC-01..16] ──> [2.c Exportar Backlog]
             │
             └──> [2.d Datos de Prueba y Marcha Blanca] ──> [2.e Selección F5+F4]
                           │
                           └──> [2.f Setup Spec Kit en Raíz] ──> [2.g Onboarding Jorge]
```

### 2.a Tabla de Equivalencias de Requisitos y Verificación de IDs
- **Responsable:** Angel Salgado (con validación de Lester Gonzalez).
- **Aclaración crítica sobre IDs verificados en Entrega 1:**
  1. **Existencia de `RQF-001`:** En los archivos Markdown de la Fase 5 ([`fase5/requisitos-funcionales-y-no-funcionales-final-final.md`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md) y [`fase5/fase5-lester/requisitos_formato_final.md`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md)) **SÍ EXISTE `RQF-001`** (corresponde a ingesta de evidencia). La nota del resumen de estado que afirmaba que arrancaba en `RQF-002` era una errata del análisis previo.
  2. **Resolución de la fila `RQF-B13` ↔ `RQF-013` / `RQF-035`:** En [`fase5/fase5-lester/requisitos_formato_final.md:L15`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L15), `RQF-013` es estrictamente *"tiempo restante y alertas visuales por casos detenidos en bandeja"*, el cual fue **deliberadamente excluido de las pruebas en Fase 6** ([`fase6/pruebas-funcionales.md:L3`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md#L3)). La configuración de umbrales corresponde en realidad a `RQF-039 [fase5-lester]` (verificado por `PF-033`), a `RQF-035 [final-final]` / `RQF-044 [final-final]` y a `RQF-B09` en el PDF.
  3. **Discrepancia interna en el PDF (mezcla de nomenclaturas):** El informe PDF de la Entrega 1 mezcla la nomenclatura `RQF-Bxx` (36 requisitos) y `RQNF-Bxx` (13 requisitos) en su tabla consolidada (§3.3, págs. 9-12) con identificadores `RQF-0xx` en su tabla de casos de prueba del set funcional (§3.4, págs. 12-15). Por ejemplo, el caso `PF-018` en la pág. 13 del PDF verifica textualmente `RQF-023` (*"la alerta de fraude tiene precedencia sobre el puntaje"*), confirmando que las pruebas se redactaron originalmente sobre la numeración de `fase5-lester` antes de la consolidación en `RQF-Bxx`.

> ⚠️ **ADVERTENCIA CRÍTICA: Colisión de IDs entre archivos de Fase 5**  
> En [`fase5/requisitos-funcionales-y-no-funcionales-final-final.md`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md) y en [`fase5/fase5-lester/requisitos_formato_final.md`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md), los mismos identificadores numéricos representan requisitos completamente distintos. La siguiente tabla documenta la colisión verificada en los archivos:

| ID en conflicto | Significado en `final-final.md` | Significado en `fase5-lester/requisitos_formato_final.md` (adoptado en esta guía) |
| :--- | :--- | :--- |
| `RQF-020` | Encolar peticiones excedentes tras superar límite de tasa | Derivar a bandeja humana o rechazar automáticamente casos bajo 60 |
| `RQF-023` | Crear caso nuevo vinculado al recibir evidencia de caso cerrado | Imponer derivación sobre puntaje automático si alerta de fraude |
| `RQF-039` | Carga manual por formulario en interfaz web | Exigir dos aprobaciones separadas antes de modificar umbrales |
| `RQF-040` | Extraer texto y firmas contenidos en documentos cargados | Aprobar automáticamente según umbral definido (80, 85, 90) sin fraude |
| `RQF-041` | Detectar objetos y daños en fotos y extraer metadatos | Derivar o rechazar ignorando puntaje si alerta de fraude o señal bajo mínimo |
| `RQNF-002` | Conservar expedientes de 90 días a 10 años | Reconstruir comportamiento, evidencias y reglas de decisión pasada basándose en historial |

Por convención formal (**DEC-E2-02**), la presente guía adopta como numeración rectora la de **`requisitos_formato_final.md`**, debido a que la suite de pruebas de [`fase6/pruebas-funcionales.md`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md) apunta directamente a ella. Se exige que la especificación (`spec.md`), la matriz de trazabilidad y el informe citen cada requisito con su archivo fuente (ejemplo: `RQF-040 [fase5-lester]`).

#### Tabla de Equivalencias Requisitos del Alcance (F5 y F4)
| ID Repositorio Markdown (`fase5-lester`) | ID Alternativo (`final-final.md`) | ID PDF (`Informe Mira - LLM.pdf`, págs 9-12) | Nombre / Enunciado del Requisito | Prioridad MoSCoW | Funcionalidad E2 | Caso de Prueba E1 Asociado (`fase6/pruebas-funcionales.md`) | Estado Verificación ID |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `RQF-040 [fase5-lester]` | `RQF-005` | `RQF-B10 (pág. 9)` | Aprobación automática según umbral configurable (≥ 90 por defecto, decisión del equipo) sin fraude | Must | F4 | `PF-020` | **Verificado en repo y PDF** (prueba en PDF usa umbral 85) |
| `RQF-041 [fase5-lester]` | `[SIN EQUIVALENTE VERIFICADO]` | `RQF-B12 (pág. 9)` (cobertura parcial por contenido; el PDF estipula rechazo automático, superado por DEC-08 / DEC-E2-06) | Derivación a revisión ignorando puntaje si señal bajo mínimo o fraude | Must | F4 | `PF-021` (la opción "o rechaza" queda superada por DEC-08) | **Verificado en repo y PDF (parcial)** |
| `RQF-020 [fase5-lester]` | `[SIN EQUIVALENTE VERIFICADO]` | `RQF-B11 (pág. 9) y RQF-B12 (pág. 9)` (cobertura parcial por contenido; RQF-B11 rango intermedio 60-84 y RQF-B12 rechazo bajo umbral mínimo, superado por DEC-08) | Derivación obligatoria bajo 60 puntos (redefinido por H-08 sin rechazo) | Must | F4 | `PF-015` | **Verificado en repo y PDF (parcial)** |
| `RQF-023 [fase5-lester]` | `RQF-028` | `RQF-B12 (pág. 9)` (cobertura parcial por contenido; el PDF estipula rechazo automático ante fraude, superado por DEC-E2-06; prueba PF-018 en pág. 13 cita RQF-023) | Precedencia de alerta de fraude activa derivando siempre a revisión manual | Must | F4 | `PF-018` | **Verificado en repo y PDF (parcial)** |
| `RQF-039 [fase5-lester]` | `RQF-035` | `[SIN EQUIVALENTE VERIFICADO]` (sin equivalente directo en el PDF; la configuración simple está en RQF-B09, pero la doble aprobación no existe en el PDF) | Exigir dos aprobaciones separadas antes de aplicar modificaciones sobre umbrales de decisión | Must | F5 | `PF-033` | **Verificado físicamente en repo** |
| `[SIN EQUIVALENTE VERIFICADO en lester]` | `RQF-044` | `RQF-B09 (pág. 9)` | Configuración independiente de umbrales numéricos de decisión por cliente y flujo | Must | F5 | `PF-033` (asociado a gestión de umbrales) | **Verificado en final-final y PDF** |
| `RQNF-002 [fase5-lester]` | `RQNF-003` | `[SIN EQUIVALENTE VERIFICADO]` (sin equivalente directo en el PDF) | Reconstrucción de decisiones pasadas basada en historial y versiones guardadas | Must | F4 / F5 | *(Derivado de H-14 / DEC-14)* | **Verificado físicamente en repo** |

- **Nota de Trazabilidad sobre `PF-020`:** En `fase6/pruebas-funcionales.md:L45` y en el PDF (`Informe Mira - LLM.pdf`, pág. 13), el caso de prueba `PF-020` establece textualmente en su precondición y pasos: *"inyectar un caso con puntaje evaluado por sobre 90"*. La decisión formal del equipo (**DEC-01**) fija el umbral como **≥ 90 puntos**, operativizando el criterio inclusivo (un puntaje de exactamente 90.0 puntos aprueba automáticamente si cumple las restantes condiciones).
- **Criterio de término:** Archivo `docs/entregable2/equivalencias-requisitos.md` commitenado en git.

---

### 2.b Formalización de DEC-01 a DEC-16 desde H-01 a H-16
- **Responsable:** Angel Salgado (con revisión del Representante del Cliente, Rodrigo Guerrero).
- **Estado de las Decisiones al 12-10-2026:**
  - `DEC-01` (H-01): **Cerrada y confirmada hoy.** Umbral ≥ 90 parametrizable por flujo (decisión del equipo que fija "≥ 90" formalizando el "sobre noventa" de ENT4; adopta el valor más alto en conflicto y se deja configurable para ajustarlo durante la marcha blanca).
  - `DEC-02` (H-02): Cerrada (retención 5-10 años: 90 días activo, luego frío).
  - `DEC-03` (H-03): Cerrada (rate limits con `Retry-After` y modo bulk).
  - `DEC-04` (H-04): Cerrada (cobro restringido a decisiones automáticas).
  - **`DEC-05` (H-05): ⚠️ ABIERTA** (mínimos por señal individual; entra al alcance de F4 y se resuelve en `clarify` como supuesto documentado del equipo).
  - `DEC-06` (H-06): Cerrada (SSO corporativo obligatorio en producción; en E2 se simula con selector de rol).
  - `DEC-07` (H-07): Cerrada (escritura automática en siniestros vía archivos).
  - `DEC-08` (H-08): Cerrada (prohibición de rechazo automático bajo 60 puntos; siempre derivar a revisión asistida).
  - `DEC-09` (H-09): Cerrada (cobro de 1 validación por siniestro salvo reanálisis sustantivo).
  - **`DEC-10` (H-10): ⚠️ PARCIALMENTE ABIERTA (plan formal MIRA §5.2 adoptado; falta decidir si rige el compromiso de ENT1).** Se formaliza con el texto de **MIRA §5.2 (Plazos)**:  
    > *"El proyecto comienza el 1 de septiembre de 2026 y se organiza en cuatro entregas. La primera, a mediados de octubre, cubre la especificación, el modelo de datos y un prototipo navegable del diseñador de flujos y de la bandeja de revisión. La segunda, a mediados de diciembre, entrega la ingesta de evidencia, el motor sobre documentos e imágenes, el cálculo del puntaje y la interfaz de programación. La tercera, a fines de febrero de 2027, incorpora video y audio, el diseñador completo con versionamiento y la bandeja de revisión asistida, y comienza la marcha blanca con el cliente piloto. La cuarta, a fines de abril de 2027, cubre paneles, medición de consumo, aislamiento multicliente y el despliegue en producción. La marcha blanca se realiza con el proceso de reembolso de gastos médicos de la aseguradora piloto, por ser el de mayor volumen y menor riesgo unitario."* (Fuente: MIRA §5.2 Plazos).  
    *Tensión con compromiso comercial (HC-010):* En ENT1 [00:11:05], Rodrigo Vergara señala que *"la aseguradora quiere estar operando con casos reales en enero, y hay una feria del sector a fines de marzo donde queremos mostrar la plataforma completa funcionando en vivo... No es lo mismo una marcha blanca en febrero que un cliente operando en enero"*. Esta exigencia comercial contradice el cronograma formal de MIRA §5.2 (producción a fines de abril de 2027 y marcha blanca a fines de febrero). Queda `[pendiente de decisión del equipo]` determinar cuál cronograma rige contractualmente el compromiso.  
    *Relación con la configurabilidad del umbral (DEC-01):* De confirmarse el inicio de la marcha blanca en febrero de 2027 con reembolsos de gastos médicos de bajo riesgo unitario, la parametrización de umbrales (F5) permitiría operar inicialmente con un umbral conservador (≥ 90 puntos) y recalibrarlo empíricamente antes de la eventual salida masiva a producción en abril de 2027.
  - **`DEC-11` (H-11): ⚠️ PARCIALMENTE ABIERTA.** Estructura de SLA por tramos según tipo/tamaño definida por Sebastián Alarcón (ENT3); valores numéricos siguen abiertos por falta de pruebas de carga. La prueba extra-funcional de la Entrega 2 no usa latencia, sino reproducibilidad determinista (H-14).
  - `DEC-12` (H-12): Cerrada (rastro inalterable de decisión disociado de evidencia personal).
  - `DEC-13` (H-13): Cerrada (soporte dual: API REST y carpetas compartidas).
  - `DEC-14` (H-14): Cerrada (reconstrucción como trazabilidad de inputs/versiones, base de la prueba extra-funcional).
  - `DEC-15` (H-15): Cerrada (plazo 2 semanas estándar, +2-3 con formulario propio).
  - **`DEC-16` (H-16): ⚠️ ABIERTA** (tramos de facturación 5.000–15.000 y Enterprise; fuera de alcance de F5+F4).

---

### 2.c Exportación y Versionado del Backlog de GitHub Projects
- **Responsable:** Lester Gonzalez (administrador de la cuenta `elesteber`).
- **Objetivo:** Exportar las historias desde GitHub Projects y generar `docs/entregable2/backlog.md` (historias `HU-01` en adelante con criterios Gherkin). Esta tarea corre en paralelo durante lunes y martes sin bloquear el arranque de `constitution` y `specify`.

---

### 2.d Datos de Prueba Ficticios, Marcha Blanca y Señales del Dominio
- **Responsable:** Rodrigo Guerrero (con apoyo de Jorge Alvarez para assets visuales).
- **Contexto de Marcha Blanca:** Según **MIRA §5.2 (Plazos)**, la marcha blanca se realiza con el proceso de **reembolso de gastos médicos** de la aseguradora piloto, por ser el de mayor volumen y menor riesgo unitario.
- **Señales del Dominio en Entrega 1:** En `modelo_dominio.json` ([`líneas 124-142`](../fases-y-plan-de-trabajo/fase3/modelo_dominio.json#L124-L142)), la entidad `Señal` contiene atributos genéricos (`tipo`, `mínimo propio`, `activa / inactiva para fraude`). Para el flujo de reembolso de gastos médicos, los nombres supuestos se alinean conceptualmente con **MIRA §2.6** (*autenticidad de los documentos*, *cruce entre fuentes*; mientras que la *coherencia biométrica* solo aplica si el proceso incorpora biometría, lo cual no aplica en este flujo de reembolso médico básico):
  1. `autenticidad_documentos` `[SUPUESTO del equipo]`: Evaluación de autenticidad e integridad de la evidencia documental (peso: 40%, mínimo: 70) `[SUPUESTO del equipo]`.
  2. `cruce_fuentes` `[SUPUESTO del equipo]`: Cruce y concordancia entre fuentes de datos (boleta, prestador, afiliado) (peso: 40%, mínimo: 70) `[SUPUESTO del equipo]`.
  3. `coherencia_solicitud` `[SUPUESTO del equipo]`: Concordancia clínica y documental de la solicitud médica (la *coherencia biométrica* de MIRA §2.6 solo aplica si el caso incluye datos biométricos) (peso: 20%, mínimo: 60) `[SUPUESTO del equipo]`.
- **Bandera de Fraude:** El **fraude es una bandera aparte** (`alertaFraudeActiva: boolean`), no una señal con ponderación continua (MIRA §2.6 / MIRA §3).
- **Fórmula de agregación del puntaje global (D-08):**
  Puntaje Global = (0.40 * autenticidad_documentos) + (0.40 * cruce_fuentes) + (0.20 * coherencia_solicitud) [SUPUESTO del equipo]

#### Especificación de los Casos de Prueba Ficticios (Aislando una Regla por Caso)
1. **Caso 1 (`CASO-MED-001` — Aprobación Automática):**
   - **Prestación:** Consulta médica de medicina general ($45.000 CLP).
   - **Evidencia ficticia:** `boleta_consulta_001.pdf` y `receta_medica_001.jpg`.
   - **Señales:** Autenticidad documentos = 95; Cruce fuentes = 95; Coherencia solicitud = 90; Alerta fraude = Inactiva (false).
   - **Cálculo:** 0.40 * 95 + 0.40 * 95 + 0.20 * 90 = 38.0 + 38.0 + 18.0 = **94.0 puntos**.
   - **Resultado esperado:** `decision: 'APROBADO_AUTOMATICO'`, `motivo: 'aprobado'` (puntaje ≥ 90, sin señales bajo mínimo, sin alerta de fraude).
2. **Caso 2 (`CASO-MED-002` — Derivación por Señal Bajo Mínimo - Aislando H-05):**
   - **Prestación:** Exámenes de laboratorio de sangre ($120.000 CLP).
   - **Evidencia ficticia:** `orden_laboratorio_002.pdf` y `factura_clinica_002.pdf`.
   - **Señales:** Autenticidad documentos = 100; Cruce fuentes = 100; **Coherencia solicitud = 55** (mínimo exigido = 60 `[SUPUESTO del equipo]`); Alerta fraude = Inactiva (false).
   - **Cálculo:** 0.40 * 100 + 0.40 * 100 + 0.20 * 55 = 40.0 + 40.0 + 11.0 = **91.0 puntos**.
   - **Resultado esperado:** `decision: 'DERIVADO_REVISION'`, `motivo: 'senal_bajo_minimo'` (pese a tener 91 puntos ≥ 90, la señal coherencia [55] está bajo el mínimo [60]).
3. **Caso 3 (`CASO-MED-003` — Derivación por Precedencia de Fraude - Aislando DEC-E2-06):**
   - **Prestación:** Reembolso de medicamentos de alto costo ($280.000 CLP).
   - **Evidencia ficticia:** `boleta_farmacia_adulterada_003.jpg` (manipulación digital de montos simulada por el equipo).
   - **Señales:** Autenticidad documentos = 95; Cruce fuentes = 95; Coherencia solicitud = 90; **Alerta fraude = ACTIVA (true)** (bandera aparte de manipulación documental).
   - **Cálculo:** 0.40 * 95 + 0.40 * 95 + 0.20 * 90 = **94.0 puntos**.
   - **Resultado esperado:** `decision: 'DERIVADO_REVISION'`, `motivo: 'alerta_fraude'` (la bandera de fraude precede al puntaje de 94; deriva a revisión manual asistida, sin rechazo automático).
4. **Caso 4 (`CASO-MED-004` — Derivación por Señal Bajo Mínimo y Ausencia de Rechazo Automático - Aislando H-08 / DEC-08):**
   - **Prestación:** Procedimiento ambulatorio ($60.000 CLP).
   - **Evidencia ficticia:** `recibo_ambulatorio_004.pdf`.
   - **Señales:** Autenticidad documentos = 40; Cruce fuentes = 40; Coherencia solicitud = 60; Alerta fraude = Inactiva (false).
   - **Cálculo:** 0.40 * 40 + 0.40 * 40 + 0.20 * 60 = 16.0 + 16.0 + 12.0 = **44.0 puntos**.
   - **Resultado esperado:** `decision: 'DERIVADO_REVISION'`, `motivo: 'senal_bajo_minimo'` (por precedencia de reglas: no hay fraude, pero autenticidad [40 < 70] y cruce de fuentes [40 < 70] están bajo sus mínimos).
   - **Objetivo de verificación (H-08 / DEC-08):** El test verifica específicamente que ante un caso con puntaje crítico bajo 60 (44 puntos) **nunca se produce un rechazo automático**, sino que el caso se deriva obligatoriamente a revisión asistida.
5. **Caso 5 (`CASO-MED-005` — Derivación por Rango Intermedio):**
   - **Prestación:** Consulta médica con especialista ($50.000 CLP).
   - **Evidencia ficticia:** `bono_consulta_005.pdf`.
   - **Señales:** Autenticidad documentos = 75; Cruce fuentes = 75; Coherencia solicitud = 75; Alerta fraude = Inactiva (false).
   - **Cálculo:** 0.40 * 75 + 0.40 * 75 + 0.20 * 75 = **75.0 puntos**.
   - **Resultado esperado:** `decision: 'DERIVADO_REVISION'`, `motivo: 'puntaje_bajo_umbral'` (todas las señales cumplen mínimos [75>70, 75>70, 75>60], pero el puntaje de 75 no alcanza el umbral ≥ 90).

> **Nota técnica y matemática sobre la imposibilidad de puntaje < 60 sin señales bajo mínimo:**  
> Con los umbrales mínimos asumidos (Autenticidad = 70, Cruce = 70, Coherencia = 60) y las ponderaciones vigentes (0.40, 0.40, 0.20), el puntaje mínimo alcanzable cuando ninguna señal está bajo su mínimo es exactamente 68 puntos (0.40 * 70 + 0.40 * 70 + 0.20 * 60 = 28 + 28 + 12 = 68). Por lo tanto, un caso con "puntaje < 60 sin señales bajo su mínimo" es matemáticamente imposible: cualquier caso con puntaje < 60 tiene forzosamente al menos una señal bajo su mínimo. Debido a la regla de precedencia estricta (`alerta_fraude` > `senal_bajo_minimo` > `puntaje_bajo_umbral`), todo caso con puntaje < 60 recibe el motivo `'senal_bajo_minimo'` (o `'alerta_fraude'`), y nunca `'puntaje_bajo_umbral'`.

---

### 2.e Decisión y Comparación de Funcionalidades Candidatas (DEC-E2-04)
- **Decisión confirmada por el equipo el 12-10-2026:** Se ratifica el par **F5 + F4**.
- La comparación detallada entre F5+F4, F4+F1 y F4+F7 se mantiene como antecedente formal, confirmando que F4+F1 introducía alto riesgo técnico debido a la exclusión deliberada de `RQF-013` (tiempo restante) en la Entrega 1.

---

### 2.f Instalación y Verificación de Spec Kit sobre Antigravity
- **Responsable:** Lester Gonzalez.
- **Ubicación obligatoria de instalación:** En la **raíz del repositorio** (`/home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm`), NO dentro de `entregable2/`. Antigravity debe abrirse en la raíz para que el agente tenga visibilidad completa de `fases-y-plan-de-trabajo/`, `README.md` y `data/`.

#### Procedimiento Seguro de Inicialización
```bash
# 1. Crear y cambiarse a una rama de setup para proteger main
git checkout -b feat/setup-speckit

# 2. Verificar opciones de inicialización en el lugar (revisar si la versión instalada soporta --here o .)
specify init --help

# 3. Inicializar en la raíz del repositorio vinculando la integración de Antigravity ("agy")
#    (Usar --here o . según lo indicado por specify init --help)
specify init --here --integration agy

# 4. Registrar versión oficial de la herramienta para la portada del informe (6.2)
specify version > docs/entregable2/specify-version.txt

# 5. VERIFICACIÓN CRÍTICA: Asegurar que la inicialización no pisó README.md ni archivos de E1
git status
# Comprobar que solo se agregaron .specify/ y .agents/skills/
```

- **Rutas generadas por la herramienta:** Las ubicaciones exactas de `constitution.md` y de las specs quedan marcadas `[POR VERIFICAR tras el init]` (típicamente `memory/constitution.md` o `.specify/memory/constitution.md`, y `specs/FEAT-001/` o `specs/F5-F4/`).
- **Principio no negociable a registrar en la constitución:** Los artefactos de la Entrega 1 (`fases-y-plan-de-trabajo/`) son de solo lectura histórica; ningún comando de Spec Kit puede modificarlos directamente. Cualquier cambio o resolución se formaliza mediante una nueva ficha DEC en `docs/entregable2/decisiones/`.

---

### 2.g Ruta de Onboarding Técnico para Jorge Alvarez
- **Responsable:** Jorge Alvarez (tutelado por Lester Gonzalez y Rodrigo Guerrero).
- **Tiempo estimado:** 4 horas y 30 minutos (ejecutado durante la tarde del lunes 12 de octubre).
- **Ruta:** Dominio MIRA (45 min) → Caso de uso UC-01 (60 min) → Requisitos F5/F4 y pruebas PF-015/018/020/021/033 (60 min) → DEC-01, DEC-06, DEC-08, DEC-E2-06 (45 min) → Cuestionario de validación con Rodrigo y Lester (60 min).

---

## 3. Flujo SDD Fase por Fase

### 3.1 Matriz Operativa de Fases SDD
| Fase | Comando / Skill | Conductor | Insumos desde Entrega 1 | Artefacto Generado y Ruta | Condición Específica de la Pauta | 👤 Revisión Humana Obligatoria | Criterio Objetivo de Término |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **0. Constitución** | `/speckit-constitution` | Humano (Lester ejecuta, Angel custodia) | `DEC-01`, `DEC-05`, `DEC-06`, `DEC-08`, `DEC-12`, `DEC-14`, `DEC-E2-06`. | `constitution.md` `[POR VERIFICAR ruta tras init]` | Incorporar como principios las DEC de E1 que aplican. Prohibir mock de datos en producción y tests circulares. Artefactos E1 de solo lectura. | 👤 Revisión del equipo completo. | Archivo validado y commiteado en rama de setup. |
| **1. Especificación** | `/speckit-specify` | Humano (el equipo redacta) | `UC-01`, `RQF-040 [fase5-lester]`, `RQF-041 [fase5-lester]`, `RQF-020 [fase5-lester]`, `RQF-023 [fase5-lester]`, `RQF-039 [fase5-lester]`, `data/casos_prueba.json`. | `specs/.../spec.md` `[POR VERIFICAR ruta tras init]` | Requisitos citan archivo fuente (`RQF-xxx [fase5-lester]`). Se fija en la spec que el umbral de aprobación automática es ≥ 90 como decisión del equipo (formalizando el "sobre noventa" de ENT4 [00:11:06]). Cero mención a tecnologías. | 👤 Validación por Representante del Cliente (Rodrigo). | Spec con criterios `AC-1` a `AC-6` y sección `[NEEDS CLARIFICATION]`. |
| **2. Aclaración** | `/speckit-clarify` | Humano (Rodrigo responde como cliente) | Entrevistas ENT1..ENT9, `inconsistencias-revisadas.md`, supuestos de señales. | `spec.md` actualizado + `docs/entregable2/clarificaciones.md` | Toda duda se responde con fuente de E1 o se declara y registra como supuesto del equipo. | 👤 Rodrigo responde; Jorge y Lester auditan que no asuma soluciones técnicas. | Cero marcas `[NEEDS CLARIFICATION]` pendientes. |
| **3. Plan Técnico** | `/speckit-plan` | Agente propone, Humano corrige | `spec.md`, `modelo_dominio.json`, `RQNF-002 [fase5-lester]` / `RQNF-003 [final-final]` (reproducibilidad), `DEC-E2-05`. | `plan.md`, `data-model.md`, `research.md` | Declara qué RQNF atiende (reproducibilidad H-14) y cómo se verifica. Define contrato TypeScript `src/shared/types.ts`. | 👤 **COMPUERTA CRÍTICA:** Revisión exhaustiva de arquitectura de datos y contratos antes de tareas. | Plan aprobado por Rodrigo y Jorge; contrato F5↔F4 formalizado. |
| **4. Tareas** | `/speckit-tasks` | Agente genera, Humano refina | `plan.md`, `spec.md`, `backlog.md` (`HU-xxx`). | `tasks.md` | Cada tarea referencia al menos un `RQF-xxx` y un `AC-N`. Tareas atómicas de <2 horas. | 👤 Lester y Rodrigo revisan orden de dependencias. | `tasks.md` ordenado por fases lógicas. |
| **5. Análisis Consistencia** | `/speckit-analyze` (o Plan B prompt) | Agente audita, Humano evalúa | `constitution.md`, `spec.md`, `plan.md`, `tasks.md`. | `docs/entregable2/reporte-analisis-consistencia.md` | Reporte formal de coherencia entre artefactos. Si no está en agy, usar prompt propio y adjuntar. | 👤 Angel y Lester revisan discrepancias y corrigen spec o tareas. | Reporte sin inconsistencias críticas. |
| **6. Implementación** | `/speckit-implement` | Agente propone código, Humano prueba y commitea | `tasks.md`, `plan.md`, suites de pruebas. | `src/` (backend, frontend) y `tests/` | Un commit por tarea. Dos estados de salida (`APROBADO_AUTOMATICO` / `DERIVADO_REVISION`). Comentarios de trazabilidad obligatorios. | 👤 **COMPUERTA DEL DIFF:** El humano corre tests, revisa diff y commitea. | 100% de tests unitarios, E2E y reproducibilidad pasando (`PASS`). |

- **Regla de precedencia estricta del motivo de evaluación (F4):**
  1. Si `alertaFraudeActiva === true` → `motivo: 'alerta_fraude'` (máxima precedencia, MIRA §3 / DEC-E2-06).
  2. Si alguna señal individual < mínimo propio → `motivo: 'senal_bajo_minimo'` (precedencia sobre puntaje global, H-05 / D-07).
  3. Si puntaje global < umbralAprobacion (≥ 90) → `motivo: 'puntaje_bajo_umbral'` (H-01 / DEC-01).
  4. Si puntaje global ≥ umbralAprobacion (≥ 90) sin señales bajo mínimo ni alerta de fraude → `decision: 'APROBADO_AUTOMATICO'`, `motivo: 'aprobado'`.

### 3.2 Pregunta Crítica para la Fase de Aclaración (`clarify`)
- **Pregunta:** *¿Qué papel operativo cumple el umbral de 60 puntos ahora que la decisión `DEC-08` / `H-08` eliminó definitivamente el rechazo automático bajo 60?*
- **Análisis previo y respuesta tentativa del equipo:** Con las ponderaciones asumidas (0.40, 0.40, 0.20) y los mínimos individuales (70, 70, 60), el puntaje mínimo alcanzable sin que ninguna señal caiga bajo su mínimo es de 68 puntos (0.40 * 70 + 0.40 * 70 + 0.20 * 60 = 28 + 28 + 12 = 68). Por lo tanto, cualquier caso con puntaje inferior a 60 presenta forzosamente al menos una señal bajo su mínimo propio. Dado que por la regla de precedencia estricta el motivo es siempre `'senal_bajo_minimo'` y que por DEC-08 todo caso derivado va a revisión asistida (sin rechazo automático), el umbral de 60 puntos resulta matemáticamente redundante para la lógica de decisión.
- **Resolución a confirmar con Rodrigo en `clarify`:** Se propone retirar `umbralRevision = 60` del contrato y del motor de decisión, o conservarlo exclusivamente como etiqueta informativa de severidad visual (*"prioridad alta / riesgo crítico"*) para ordenar la bandeja de trabajo del operador humano.

---

## 4. 👤 Decisiones de Diseño Durante la Implementación

### 4.1 Catálogo de Decisiones de Diseño y Responsabilidades
| # | Decisión Técnica | Opciones Consideradas | Hallazgo / Requisito Vinculado | Quién Propone | 👤 Quién Decide |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-01** | **Estructura de Persistencia (SQLite)** | (a) Monolítico sin tipar.<br>(b) Relacional con tablas `flujos`, `umbrales`, `casos`, `senales` y `auditoria_cambios`. | `modelo_dominio.json`, `RQF-039 [fase5-lester]`, `RQNF-008`. | Rodrigo (Backend) | 👤 Rodrigo + Jorge |
| **D-02** | **Simulación del Motor y Señales** | (a) Generador pseudo-aleatorio.<br>(b) Carga estática determinista desde `data/casos_prueba.json` respaldada en SQLite. | §4.3 pauta (motor no se construye, casos fijos). | Lester (QA) | 👤 Rodrigo (Representante) |
| **D-03** | **Versionado de Umbrales (F5)** | (a) Sobrescritura directa.<br>(b) Histórico inmutable con estado `BORRADOR` / `APROBADO`, timestamp y usuario. | `RQF-039 [fase5-lester]`, `DEC-01`. | Rodrigo (Backend) | 👤 Angel (audita trazabilidad) |
| **D-04** | **Autenticación Simulada (H-06) y Selector de Roles** | (a) Sin login.<br>(b) Selector desplegable de rol y usuario activo en barra superior. Para satisfacer la prueba funcional `PF-033` (*"un segundo administrador distinto"*) vinculada a `RQF-039 [fase5-lester]` / `RQF-035 [final-final]`, el selector **debe permitir al menos dos usuarios simulados distintos con permiso de aprobar cambios de umbral** (ej. `Administrador 1` y `Administrador 2`, o `Diseñador 1` y `Diseñador 2`). MIRA §2.13 y RQF-051 definen formalmente *Operador*, *Diseñador*, *Consultor* y *Administrador*; se agregan roles simulados *Riesgo* `[SUPUESTO del equipo]` y *Auditor* `[SUPUESTO del equipo]`.<br>⚠️ `[POR CONFIRMAR]`: `PF-033` estipula que quien aprueba es un "administrador", mientras que MIRA §2.13 asigna la configuración y edición de flujos y umbrales a quien diseña flujos (*Diseñador*). | `H-06` (SSO obligatorio; simulado para demo), MIRA §2.13, `PF-033`, `RQF-039 [fase5-lester]`. | Jorge (Frontend) | 👤 Rodrigo (Representante) |
| **D-05** | **Inmutabilidad de Auditoría** | (a) Archivo plano `.txt`.<br>(b) Tabla SQLite `rastro_auditoria` append-only bloqueada a `UPDATE`/`DELETE` con triggers. | `H-12`, `RQNF-008`. | Rodrigo (Backend) | 👤 Lester (QA) |
| **D-06** | **Estrategia de Pruebas E2E y Reproducibilidad** | (a) Pruebas manuales en video.<br>(b) Suite Playwright para E2E y test de reproducibilidad determinista al 100% sobre versiones guardadas (H-14). | §6.5 pauta, `H-14`, `DEC-14`. | Lester (QA) | 👤 Lester |
| **D-07** | **Mínimos por Señal (H-05)** | Mínimos fijados como supuestos unificados del equipo alineados con MIRA §2.6: Autenticidad = 70 `[SUPUESTO del equipo]`, Cruce de fuentes = 70 `[SUPUESTO del equipo]`, Coherencia = 60 `[SUPUESTO del equipo]`. | `H-05` (decisión abierta con cliente). | Jorge / Rodrigo | 👤 Rodrigo (Representante) |
| **D-08** | **Fórmula de Agregación y Ponderaciones del Puntaje** | Promedio ponderado determinista: 0.40 * Autenticidad + 0.40 * CruceFuentes + 0.20 * Coherencia [SUPUESTO del equipo]. | `RQF-043` (`final-final.md`), F4. | Rodrigo (Backend) | 👤 Rodrigo + Jorge |
| **D-09** | **Alcance de la Especificación en Spec Kit** | (a) Una sola spec consolidada para F5 y F4.<br>(b) Dos specs separadas (`FEAT-001-F5` y `FEAT-002-F4`). | Gestión de cuota de Antigravity y aislamiento de tareas. | Angel (Informe) | 👤 Rodrigo + Lester |

### 4.2 Protocolo para Decisiones No Declaradas del Agente
Toda propuesta del agente que agregue campos, rutas o reglas no solicitadas en `spec.md` será vetada de inmediato en la inspección del diff. Si afecta la lógica de negocio, se eleva a Rodrigo y se registra en `docs/entregable2/decisiones-agente-rechazadas.md`.

---

## 5. División del Trabajo entre los 4 Integrantes

### 5.1 Frentes de Responsabilidad y Dueños de Artefactos
- **Frente 1: Backend y Motor de Reglas (Rodrigo Guerrero):** Código en `src/backend/`, lógica de F5/F4, Representante del Cliente en fases SDD y aceptación.
- **Frente 2: Frontend y Experiencia de Usuario (Jorge Alvarez):** Código en `src/frontend/`, componentes React de F5/F4 en español, capturas de interfaz.
- **Frente 3: Testing y Aseguramiento de Calidad (Lester Gonzalez):** Setup inicial de Spec Kit en raíz, tests en `tests/` (Vitest, Playwright, reproducibilidad determinista), análisis de consistencia.
- **Frente 4: Informe, Trazabilidad y Gobernanza SDD (Angel Salgado):** Informe PDF (6.1 a 6.8), matriz de trazabilidad, log de prompts, bitácora DEC, diapositivas PPT.

### 5.2 Contrato de Datos Temprano F5 ↔ F4 (`src/shared/types.ts`)
Congelado el **Martes 13 de Octubre (Día 1 de desarrollo)** para desacoplar el trabajo de interfaz y backend:

```typescript
// src/shared/types.ts - Contrato de Interfaces F5 <-> F4
export interface UmbralesFlujo {
  idFlujo: string;
  version: number;
  umbralAprobacion: number;    // Por defecto 90 (DEC-01: umbral >= 90)
  minimoAutenticidad: number;  // H-05 / MIRA §2.6 (supuesto equipo: 70) [SUPUESTO del equipo]
  minimoCruceFuentes: number;  // H-05 / MIRA §2.6 (supuesto equipo: 70) [SUPUESTO del equipo]
  minimoCoherencia: number;    // H-05 / MIRA §2.6 (supuesto equipo: 60) [SUPUESTO del equipo]
  pesoAutenticidad: number;    // D-08 (0.40) [SUPUESTO del equipo]
  pesoCruceFuentes: number;    // D-08 (0.40) [SUPUESTO del equipo]
  pesoCoherencia: number;      // D-08 (0.20) [SUPUESTO del equipo]
  actualizadoPor: string;
  fechaActualizacion: string;
  estado: 'BORRADOR' | 'APROBADO';
}

export interface SenalesCaso {
  autenticidadDocumentos: number; // 0-100 (MIRA §2.6)
  cruceFuentes: number;           // 0-100 (MIRA §2.6)
  coherenciaSolicitud: number;    // 0-100 (coherencia biométrica solo si aplica)
  alertaFraudeActiva: boolean;    // Bandera aparte (MIRA §2.6 / MIRA §3)
}

export interface ResultadoEvaluacion {
  idCaso: string;
  scoreGlobal: number;
  decision: 'APROBADO_AUTOMATICO' | 'DERIVADO_REVISION'; // Únicamente dos estados
  // Precedencia estricta de motivo: alerta_fraude > senal_bajo_minimo > puntaje_bajo_umbral (o 'aprobado' si >= 90)
  motivo: 'aprobado' | 'alerta_fraude' | 'senal_bajo_minimo' | 'puntaje_bajo_umbral';
  senalesBajoMinimo: string[];
  desgloseComponentes: {
    autenticidad: number;
    cruceFuentes: number;
    coherencia: number;
  };
  versionUmbralesAplicada: number;
  timestamp: string;
}
```

### 5.3 Reglas de PR y Revisión Cruzada Obligatoria
- Prohibida la auto-aprobación de PRs.
- PRs Backend (Rodrigo) → Revisa Jorge y Lester.
- PRs Frontend (Jorge) → Revisa Rodrigo y Lester.
- PRs Tests (Lester) → Revisa Rodrigo.
- PRs Documentación/Spec (Angel) → Revisa Rodrigo y Lester.

### 5.4 Gestión de Cuotas de Antigravity
- **Lester:** Ejecuta `specify init` en raíz, `/speckit-constitution` y el análisis de consistencia.
- **Rodrigo:** Ejecuta sesiones de generación backend.
- **Jorge:** Ejecuta sesiones de generación frontend.
- **Angel:** Custodia la gobernanza de `constitution.md`, ejecuta prompts de auditoría documental y comparativa E1.

### 5.5 Matriz RACI
| Actividad / Entregable | Rodrigo (Backend / Cliente) | Jorge (Frontend) | Lester (QA / Testing) | Angel (Informe / Trazab.) |
| :--- | :---: | :---: | :---: | :---: |
| Formalizar DEC-01..16 y DEC-E2-01..06 | **A** | I | C | **R** |
| Exportar `backlog.md` desde GitHub Projects | I | I | **R / A** | C |
| Preparar datos de prueba ficticios | **R / A** | C | C | I |
| Onboarding técnico de Jorge | C | **R / A** | C | I |
| Inicialización Spec Kit en raíz (`agy`) | I | I | **R / A** | I |
| Redacción y custodia de `constitution.md` | C | C | **R** (ejecuta) | **A** (custodia) |
| Redacción de `spec.md` | **A** | C | C | **R** |
| Sesión de Aclaración (`clarify`) | **R / A** | C | C | I |
| Plan Técnico (`plan.md`) y Contrato de Datos | **R / A** | **R** | C | I |
| Generación y refinamiento de `tasks.md` | **R** | **R** | **A** | C |
| Reporte de Análisis de Consistencia | C | C | **R / A** | C |
| Implementación Backend (Node/TS/SQLite) | **R / A** | C | C | I |
| Implementación Frontend (React/Vite/UI) | C | **R / A** | C | I |
| Suites de Pruebas (Vitest, Playwright, Reproducibilidad) | C | C | **R / A** | I |
| Sesión de Aceptación con Cliente | **R / A** | C (validador) | C (validador) | I (acta) |
| Prueba de Usabilidad con Evaluador Externo | I | C | **R / A** | I |
| Redacción del Informe Escrito PDF (6.1 a 6.8) | C | C | C | **R / A** |
| Elaboración de Diapositivas PPT | C | C | C | **R / A** |
| Ensayo y Ejecución de Demo en Vivo | **R** | **R** | **R** | **R / A** |

---

## 6. Calendario Día por Día (12 al 19 de Octubre de 2026)

Cronograma operativo recalculado a partir de hoy **lunes 12 de octubre a las 16:30 CLT**:

```
Lun 12 (16:30+): Setup Spec Kit en raíz, Constitution, Onboarding Jorge
Mar 13:          Specify F5+F4, Contrato Datos src/shared/types.ts, Clarify
Mié 14:          Plan Técnico, Tasks, Análisis de Consistencia, Arranque Código
Jue 15:          Sprint Implementación Backend (F5/F4) + Frontend (F5/F4)
Vie 16:          Integración, E2E Playwright, Test Reproducibilidad (H-14)
Sáb 17:          Usabilidad Externa, Sesión Aceptación Cliente, Redacción Informe
Dom 18:          CONGELAMIENTO (18:00), Tag v2.0, Check README (<15m), PPT
Lun 19:          Ensayo Demo (v2.0), Entrega 14:00 CLT, Exposición Oral
```

### 6.1 Detalle Diario de Tareas
- **Lunes 12 de Octubre (Día 0 — Setup y Arranque SDD, desde 16:30 CLT):**
  - [ ] Lester inicializa Spec Kit en la raíz en rama `feat/setup-speckit` (`specify init --here --integration agy`). Verifica que `README.md` y archivos de E1 no fueron tocados.
  - [ ] Lester ejecuta `/speckit-constitution`. Se incorporan las DEC críticas que rigen la constitución (`DEC-01`, `DEC-05`, `DEC-06`, `DEC-08`, `DEC-12`, `DEC-14`, `DEC-E2-06`).
  - [ ] En paralelo, Angel y Lester avanzan en el resto de fichas DEC y en la exportación de `docs/entregable2/backlog.md`.
  - [ ] Jorge completa la lectura guiada de onboarding (4,5 hrs).
- **Martes 13 de Octubre (Día 1 — Especificación, Contrato y Clarificación):**
  - [ ] Redactar `/speckit-specify` para F5 y F4 con los 5 casos de prueba de gastos médicos.
  - [ ] Rodrigo y Jorge definen y commitean `src/shared/types.ts`.
  - [ ] Ejecutar `/speckit-clarify` con Rodrigo (resolver supuesto H-05 y confirmar función del umbral 60).
- **Miércoles 14 de Octubre (Día 2 — Planificación, Consistencia y Arranque):**
  - [ ] Ejecutar `/speckit-plan` (arquitectura SQLite, Express, React, declaración de reproducibilidad).
  - [ ] 👤 **Revisión humana del plan técnico.**
  - [ ] Ejecutar `/speckit-tasks` y auditoría de consistencia (`/speckit-analyze` o Plan B).
  - [ ] Rodrigo arranca endpoints base; Jorge arranca vistas con mocks.
- **Jueves 15 de Octubre (Día 3 — Sprint de Implementación y Tests Unitarios):**
  - [ ] Rodrigo implementa lógica de evaluación determinista de F4 y CRUD de umbrales F5.
  - [ ] Jorge implementa pantallas de gestión de umbrales (F5) y evaluación de casos (F4).
  - [ ] Lester implementa tests unitarios y de integración en Vitest + Supertest.
  - [ ] Angel inicia redacción de secciones 6.2 y 6.3 del informe.
- **Viernes 16 de Octubre (Día 4 — Integración, E2E y Prueba Extra-funcional):**
  - [ ] Conectar frontend con backend. Evaluar los 5 casos de prueba en la UI.
  - [ ] Lester y Jorge ejecutan suite Playwright para recorrido E2E.
  - [ ] **Lester ejecuta la prueba extra-funcional medible (H-14):** Test automatizado que reevalúa casos pasados con versión histórica de umbrales verificando 100% de reproducibilidad determinista.
  - [ ] Opcional: Ejecutar k6 para medir línea base exploratoria de latencia (reportar como observación).
  - [ ] Angel avanza secciones 6.4 y 6.5.
- **Sábado 17 de Octubre (Día 5 — Usabilidad, Aceptación e Informe Central):**
  - [ ] Prueba de usabilidad con integrante de otro equipo (registrar en `docs/entregable2/usabilidad.md`).
  - [ ] 👤 **Sesión formal de aceptación:** Rodrigo evalúa el software contra los `AC-N` en presencia de Lester y Jorge (acta en `docs/entregable2/sesion-aceptacion.md`).
  - [ ] Angel redacta sección 6.6 (Comparativa con E1) y sección 6.7 (Discusión crítica).
- **Domingo 18 de Octubre (Día 6 — Congelamiento, Tag `v2.0` y PPT):**
  - [ ] **18:00 CLT: CONGELAMIENTO TOTAL DE CÓDIGO (Code Freeze).**
  - [ ] Prueba de clonación en máquina limpia: levantar desde el `README.md` en menos de 15 minutos.
  - [ ] Subir tag oficial: `git tag -a v2.0 -m "Entrega 2 MIRA Oficial" && git push origin v2.0`.
  - [ ] Redactar secciones 6.1 (Resumen ejecutivo) y 6.8 (Conclusiones). Compilar PDF final.
  - [ ] Diseñar diapositivas PPT.
- **Lunes 19 de Octubre (Día 7 — Entrega y Exposición):**
  - [ ] 09:00–11:00 CLT: Ensayo cronometrado de la presentación (15 min) y demo corriendo sobre tag `v2.0`.
  - [ ] 12:00 CLT: Subir informe PDF y PPT.
  - [ ] **14:00 CLT: CIERRE DEFINITIVO DE ENTREGA.**
  - [ ] Defensa oral: `[POR CONFIRMAR fecha y hora]`.

### 6.2 Plan de Contingencia y Política de Recorte Priorizado
Si se presentan atrasos durante el desarrollo:
1. **Recorte 1:** Simplificar estilos visuales a CSS funcional limpio.
2. **Recorte 2:** Reducir la suite E2E a exactamente 1 prueba principal en Playwright (mínimo de pauta).
- **LO QUE NUNCA SE PUEDE RECORTAR:**
  - La conexión funcional real entre F5 y F4.
  - Cumplimiento del `README.md` ejecutable en < 15 minutos (si falla, C4 baja a 3.0 máx).
  - Los casos de prueba ficticios de gastos médicos.
  - La prueba extra-funcional medible (reproducibilidad determinista).
  - La prueba de usabilidad con externo y la sesión de aceptación con cliente.
  - El límite de extensión por sección en el informe PDF.

---

## 7. Sistema de Documentación para el Informe

### 7.1 Estructura de Carpetas en el Repositorio
```
proyecto-llm/
├── .specify/                         # Plantillas de Spec Kit
├── memory/constitution.md            # Principios no negociables [POR VERIFICAR ruta]
├── specs/FEAT-001/                   # Especificación de F5+F4 [POR VERIFICAR ruta]
├── docs/entregable2/
│   ├── equivalencias-requisitos.md   # Mapeo de IDs
│   ├── backlog.md                    # Historias HU-xxx exportadas
│   ├── clarificaciones.md            # Q&A formal con Representante del Cliente
│   ├── reporte-analisis-consistencia.md # Auditoría de coherencia
│   ├── matriz-trazabilidad.md        # RQF -> AC -> Task -> Commit -> Test
│   ├── log-prompts.md                # Registro de interacciones con el agente
│   ├── decisiones/                   # Fichas DEC-01 a DEC-16 y DEC-E2-xx
│   ├── sesion-aceptacion.md          # Acta de aceptación con Rodrigo
│   └── usabilidad.md                 # Registro de prueba con evaluador externo
├── data/
│   ├── casos_prueba.json             # 5 casos ficticios de gastos médicos
│   └── evidencias/                   # Documentos PDF/JPG ficticios
├── src/                              # Código fuente (backend, frontend, shared)
└── tests/                            # Suites automatizadas (unitarias, e2e, reproducibilidad)
```

### 7.2 Convención de Commits Semánticos
`[PREFIJO] [ID-REQUISITO/TAREA]: Descripción clara del cambio`
Prefijos: `[CONSTITUTION]`, `[SPEC]`, `[CLARIFY]`, `[PLAN]`, `[TASK-xx]`, `[HUMAN-FIX]`, `[TEST]`, `[DOC]`.

### 7.3 Plantilla del Log de Prompts (`docs/entregable2/log-prompts.md`)
Campos: `ID Interacción`, `Fecha y Fase`, `Prompt Ingresado`, `Resumen Salida Agente`, `Intervención Humana (Aceptado / Ajustado / Rechazado)`, `Detalle Corrección (Antes / Después)`, `Evaluación Crítica`.

### 7.4 Matriz de Trazabilidad Canónica (`docs/entregable2/matriz-trazabilidad.md`)

> **Regla de citación obligatoria:** La especificación (`spec.md`), la matriz de trazabilidad (`matriz-trazabilidad.md`) y el informe final deben citar cada requisito acompañado de su archivo fuente (ejemplo: `RQF-040 [fase5-lester]`, `RQF-028 [final-final]`, `RQF-B10 [PDF pág. 9]`). Se incorpora la columna canónica **Fuente** para auditar el origen físico de cada requisito:

| Requisito E1 | Fuente | Equivalente Alternativo (`final-final.md`) | Equivalente PDF (`RQF-Bxx`) | Criterio Aceptación Spec (`spec.md`) | Tarea (`tasks.md`) | Archivo Código Fuente (`src/`) | Commit Hash | Prueba Automatizada (`tests/`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `RQF-040` | `fase5-lester` | `RQF-005` | `RQF-B10 (pág. 9)` (prueba usa umbral 85) | `AC-1: Aprobación automática >= 90` | `T-04` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testAutoApproval` |
| `RQF-041` | `fase5-lester` | `[SIN EQUIVALENTE VERIFICADO]` | `RQF-B12 (pág. 9)` (parcial; PDF dice "Rechazado", superado por DEC-08/E2-06) | `AC-2: Derivación por señal bajo mínimo` | `T-05` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testMinSignalGate` |
| `RQF-023` | `fase5-lester` | `RQF-028` | `RQF-B12 (pág. 9)` (parcial; PDF dice "Rechazado", superado por DEC-E2-06) | `AC-3: Precedencia de alerta de fraude` | `T-06` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testFraudPrecedence` |
| `RQF-020` | `fase5-lester` | `[SIN EQUIVALENTE VERIFICADO]` | `RQF-B11 (pág. 9) y RQF-B12 (pág. 9)` (parcial; PDF dice "Rechazado", superado por DEC-08) | `AC-4: Derivación obligatoria < 60` | `T-07` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testUnder60Gate` |
| `RQF-039` | `fase5-lester` | `RQF-035` | `[SIN EQUIVALENTE VERIFICADO]` (sin equivalente directo en PDF) | `AC-5: Edición y versionado de umbrales` | `T-02` | `src/backend/routes/umbrales.ts`| `[hash]` | `tests/integration/umbrales.test.ts` |
| `RQF-044` | `final-final` | `[SIN EQUIVALENTE VERIFICADO en lester]` | `RQF-B09 (pág. 9)` | `AC-7: Configuración de umbrales por flujo/cliente` | `T-01` | `src/backend/routes/umbrales.ts`| `[hash]` | `tests/integration/umbrales.test.ts` |
| `RQNF-002` | `fase5-lester` | `RQNF-003` | `[SIN EQUIVALENTE VERIFICADO]` (sin equivalente directo en PDF) | `AC-6: Reproducibilidad histórica 100%` | `T-12` | `src/backend/routes/eval.ts` | `[hash]` | `tests/reproducibility/deterministic.test.ts` |

### 7.5 Atribución de Origen de los Cambios
Registro auditable distinguiendo cambios originados por el **Representante del Cliente**, el **Equipo de Desarrollo** y el **Agente**.

### 7.6 Mapeo de Secciones del Informe (6.1 a 6.8) y Fuentes
Angel Salgado es el redactor principal del informe con apoyo técnico de Rodrigo (backend), Jorge (UI) y Lester (tests).

### 7.7 Estructura Tentativa para Sección 6.6 (Comparativa con Entrega 1)
> ⚠️ `[SUPUESTO: pendiente de consulta al profesor]`: Rige la estructura tentativa adoptada desde el inicio:
1. **Tabla 6.6.1:** Matriz de Evolución de Requisitos (Sin cambio / Modificado / Descartado / Nuevo, Motivo, Origen).
2. **Tabla 6.6.2:** Matriz de Reconciliación de Supuestos e Inconsistencias (H-xx, Supuesto original, Resolución en código).
3. **Tres Indicadores:** Tasa de Preservación de Requisitos Must (TPR), Tasa de Intervención Humana en Código (TIH) e Índice de Retrabajo por Fase (IRF).
4. **Diferencias Clave entre Entrega 1 y Entrega 2 como Decisiones Deliberadas del Equipo:**
   - **Rechazo automático (RQF-B12) → Derivación asistida siempre (DEC-08 y DEC-E2-06):** En la Entrega 1, el requisito `RQF-B12` (pág. 9) y su caso de prueba estipulaban el rechazo automático de expedientes bajo el umbral mínimo o con alerta de fraude activa (*"Rechazado, ignorando el puntaje total"*). En la Entrega 2, el equipo adopta como decisión deliberada la prohibición absoluta de rechazos automáticos dictada por Cumplimiento (Daniela Cortés, ENT6 [00:04:06]), resolviendo que todo expediente en dicha condición se deriva obligatoriamente a revisión asistida por un operador humano (**DEC-08** y **DEC-E2-06**).
   - **Umbral fijo 85 y rango 60-84 (RQF-B10 y RQF-B11) → Umbral ≥ 90 configurable (DEC-01):** En la Entrega 1, los requisitos `RQF-B10` y `RQF-B11` manejaban un umbral rígido de 85 puntos para aprobación y un rango intermedio de 60-84 para revisión (probados con 95 y 75 puntos respectivamente). En la Entrega 2, el equipo adopta deliberadamente el umbral **≥ 90 puntos** como valor conservador exigido por el cliente piloto (Francisca Leiva, ENT4 [00:11:06]), parametrizable de forma independiente por flujo y cliente mediante la funcionalidad F5 (**DEC-01**).

### 7.8 Medición Objetiva del Aporte del Agente en Git
Cálculo mediante diffs entre commits generados por el agente (`[TASK-xx]`) y commits de corrección humana (`[HUMAN-FIX]`).

---

## 8. Puertas de Calidad y Definición de Terminado (DoD)

### 8.1 Alineación con los Criterios de Evaluación y Descuentos
- **C1: Resumen ejecutivo (5%):** Máximo 1/2 plana; responde qué se construyó, método, 3 cambios y recomendaciones; cero jerga.
- **C2: Introducción y selección (5%):** Máximo 1 plana; justifica F5+F4 por criterio de riesgo, conexión de datos y cruce con H-05/DEC-01.
- **C3: Aplicación del método SDD (10%):** Fases completas en git; DEC en constitution; antes/después en log de prompts; balance costo/valor.
- **C4: Implementación (20%):** Repo levantable en menos de 15 min desde README; ambas funcionalidades operando en español; interfaz de punta a punta.
- **C5: Pruebas y verificación (5%):** Cobertura Must; al menos 1 prueba E2E (Playwright); 1 prueba extra-funcional medible (reproducibilidad determinista 100%); usabilidad externa y aceptación registradas.
- **C6: Comparativa con E1 (30%):** Tablas 6.6.1 y 6.6.2; 3 indicadores calculados; respuestas fundadas en evidencia a bloques A y B, y al menos 4 de C, D, E.
- **C8: Discusión (5%):** Máximo 1 plana; reflexión crítica con lecciones aprendidas y contraste SDD vs BMAD.
- **C9: Conclusiones (5%):** Máximo 1/2 plana; aprendizajes y deudas técnicas.
- **C10: Presentación oral y demo (15%):** 15 min; participan los 4; demo en vivo corriendo estrictamente sobre tag `v2.0`; dominio individual absoluto.

#### Penalizaciones Graves a Evitar
- ❌ **Cita o referencia inexistente:** Descuenta **1.0 punto** por ocurrencia en el criterio afectado.
- ❌ **Repo que no levanta en menos de 15 min:** Nota máxima de C4 topada en **3.0**.
- ❌ **Artefacto obligatorio ausente:** Penalización directa en C3.
- ❌ **Exceso de páginas:** El evaluador corta la lectura al límite de la plana.

### 8.2 Definición de Terminado (DoD) Global
- [ ] Tag git `v2.0` empujado a origin.
- [ ] README verificado en máquina limpia en < 15 min.
- [ ] 100% de tests unitarios, Playwright y reproducibilidad determinista en verde.
- [ ] Acta de aceptación firmada por Rodrigo con Lester y Jorge presentes.
- [ ] Informe PDF dentro de los límites de páginas por sección.

---

## 9. Matriz de Riesgos y Mitigaciones Específicas

| # | Riesgo Identificado | Prob. | Impacto | Señal Temprana de Alerta | Protocolo de Mitigación Inmediata |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **R-01** | **Tests circulares generados por el agente** | Alto | Crítico | El test pasa de inmediato sin haber fallado antes. | Tests derivados de criterios `AC-N` de la Entrega 1. Lester revisa que verifiquen entradas/salidas de negocio. |
| **R-02** | **Requisitos inventados fuera de alcance** | Alto | Alto | Agente propone endpoints o features no solicitadas en `spec.md`. | `constitution.md` prohíbe inventar requisitos; sección "Fuera de alcance" explícita; veto inmediato del diff. |
| **R-03** | **Deriva de IDs entre RQF-xxx y RQF-Bxx** | Medio | Alto | El agente mezcla nomenclaturas en commits o tests. | Aplicar `DEC-E2-02`. Prompts exigen estrictamente la nomenclatura `RQF-xxx` de la Entrega 1. |
| **R-04** | **Agotamiento de cuota de Antigravity** | Medio | Alto | Rate limits o truncado en sesiones de plan/implement. | Rotación de cuentas según [§5.4](#54-gestión-de-cuotas-de-antigravity); prompts modulares de <100 líneas. |
| **R-05** | **Bloqueo entre Frontend y Backend** | Alto | Medio | Jorge no puede avanzar por falta de endpoints. | Contrato `src/shared/types.ts` congelado el Martes 13; Jorge usa mocks locales para desarrollar la UI. |
| **R-06** | **Parálisis por Decisiones Abiertas** | Medio | Medio | Discusiones prolongadas en clarify. | Rodrigo fija supuesto formal documentado en clarify. Lo que no toque F5/F4 se declara fuera de alcance. |
| **R-07** | **Desconocimiento del Dominio por Jorge** | Alto | Medio | Jorge asume reglas incorrectas en UI. | Onboarding guiado el Día 0 ([§2.g](#2g-ruta-de-onboarding-técnico-para-jorge-alvarez)) con cuestionario previo. |
| **R-08** | **Conflicto de Interés de Rodrigo** | Alto | Crítico | Rodrigo aprueba su propio backend sin probar bordes. | `DEC-E2-03`: criterios congelados antes; sesión presencial con Lester y Jorge como validadores; acta inmutable. |
| **R-09** | **Dependencia de un Solo Integrante** | Medio | Alto | Desconexión de un integrante durante el sprint. | PRs pequeños integrados diariamente; contratos claros en git para relevos rápidos. |
| **R-10** | **Fuga de Secretos o Datos Reales** | Bajo | Crítico | Commits con credenciales o datos sensibles. | Solo datos ficticios en `data/`; `.gitignore` estricto para `.env` y temporales. |

---

## 10. Consultas Pendientes al Profesor y Puntos por Confirmar

### 10.1 Consultas Formales Pendientes de Respuesta Docente
1. **Consulta 1 (Jorge Alvarez):** *Condiciones de evaluación individual para nuevo integrante.* Estado: `[pendiente de respuesta]`. Supuesto: Jorge se capacita en onboarding para defender el proyecto al mismo nivel.
2. **Consulta 2 (Estructura de 6.6):** *Vinculación de las 2 tablas y 3 indicadores.* Estado: `[pendiente de respuesta]`. Supuesto: Rige la propuesta metodológica de [§7.7](#77-estructura-tentativa-para-sección-66-comparativa-con-entrega-1).
3. **Consulta 3 (Rúbrica Cap. 8):** *Ponderación asimétrica vs 10 criterios de 10%.* Estado: `[pendiente de respuesta]`. Supuesto: El equipo prioriza la tabla de ponderaciones asimétricas explícita (C6 30%, C4 20%, etc.).
4. **Consulta 4 (Universo y numeración oficial de requisitos):** *¿Qué numeración y universo de requisitos considera el profesor oficial para la evaluación de la Entrega 2?*  
   - Opción 1: `fase5/requisitos-funcionales-y-no-funcionales-final-final.md` (81 requisitos, verificados con `grep -c -E '^\| RQ'`).  
   - Opción 2: `fase5/fase5-lester/requisitos_formato_final.md` (57 requisitos, verificados con `grep -c -E '^\| RQ'`, sobre la cual se redactó la suite `fase6/pruebas-funcionales.md`).  
   - Opción 3: `Informe Mira - LLM.pdf` (págs. 9-12, 49 requisitos verificados en PDF: 36 `RQF-B01..B36` y 13 `RQNF-B01..B13`).  
   Se fundamenta la consulta en que se detectó una colisión severa de identificadores entre ambos archivos Markdown (los mismos IDs `RQF-020`, `023`, `039`, `040`, `041` y `RQNF-002` significan conceptos distintos), en que el informe PDF consolidó solo 36 RQF (dejando sin equivalente directo requisitos como la doble aprobación de umbrales `RQF-039` o alterando la resolución a "Rechazado" en `RQF-B12` frente a la derivación de `RQF-023`), y en que el propio PDF mezcla `RQF-Bxx` en su catálogo de requisitos (§3.3) con `RQF-0xx` en su set de pruebas funcionales (§3.4, pág. 13).  
   *Estado:* `[pendiente de respuesta]`.  
   *Supuesto operativo del equipo:* Rige `DEC-E2-02`, adoptando la numeración de `requisitos_formato_final.md` respaldada por `fase6/pruebas-funcionales.md` y exigiendo citar cada requisito con su archivo fuente (ejemplo: `RQF-040 [fase5-lester]`).

---

## 11. Registro de Verificación de IDs y Pendientes

### 11.1 Tabla de IDs Verificados vs. No Verificados Físicamente en el Repositorio
| Tipo de Identificador | ID Citado en esta Guía | Archivo Fuente en el Repositorio | Estado de Verificación | Observación Técnica |
| :--- | :--- | :--- | :--- | :--- |
| **Requisito Funcional** | `RQF-001 [final-final]` | [`fase5/requisitos-funcionales-y-no-funcionales-final-final.md:L3`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md#L3) | **VERIFICADO** | Existe físicamente (ingesta HTTP); no arranca en RQF-002. En `fase5-lester` corresponde a recepción de evidencia multi-archivo. |
| **Requisito Funcional** | `RQF-020 [fase5-lester]` | [`fase5/fase5-lester/requisitos_formato_final.md:L22`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L22) | **VERIFICADO** | Casos < 60 puntos; redefinido por H-08 sin rechazo automático. En `final-final.md` colisiona con "encolar peticiones excedentes" y queda como `[SIN EQUIVALENTE VERIFICADO]`; en el PDF su cobertura es parcial por contenido bajo `RQF-B11 (pág. 9)` (derivación en rango 60-84) y `RQF-B12 (pág. 9)` (rechazo bajo mínimo, superado por DEC-08 / DEC-E2-06). |
| **Requisito Funcional** | `RQF-023 [fase5-lester]` | [`fase5/fase5-lester/requisitos_formato_final.md:L25`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L25) | **VERIFICADO** | Precedencia de alerta de fraude derivando a revisión humana. En `final-final.md` colisiona con "crear caso nuevo vinculado", su equivalente verificado por contenido es `RQF-028`; en el PDF su cobertura es parcial por contenido bajo `RQF-B12 (pág. 9)` (el PDF estipula "Rechazado, ignorando el puntaje total", superado por DEC-E2-06; en pág. 13 la prueba `PF-018` cita textualmente `RQF-023`). |
| **Requisito Funcional** | `RQF-039 [fase5-lester]` | [`fase5/fase5-lester/requisitos_formato_final.md:L41`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L41) | **VERIFICADO** | Dos aprobaciones separadas antes de modificar umbrales. En `final-final.md` colisiona con "carga manual por formulario", su equivalente verificado por contenido es `RQF-035`; en el PDF queda `[SIN EQUIVALENTE VERIFICADO]` (sin equivalente directo; `RQF-B09` cubre configuración simple pero no exige doble aprobación). |
| **Requisito Funcional** | `RQF-040 [fase5-lester]` | [`fase5/fase5-lester/requisitos_formato_final.md:L42`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L42) | **VERIFICADO** | Aprobación automática según umbral definido (≥ 90 por decisión del equipo). En `final-final.md` colisiona con "extraer texto y firmas", su equivalente verificado por contenido es `RQF-005`; en el PDF corresponde a `RQF-B10 (pág. 9)` (verificado por el equipo; su prueba en PDF usa umbral 85). |
| **Requisito Funcional** | `RQF-041 [fase5-lester]` | [`fase5/fase5-lester/requisitos_formato_final.md:L43`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L43) | **VERIFICADO** | Derivación si alerta de fraude o señal bajo mínimo. En `final-final.md` colisiona con "detectar objetos y daños en fotos" y queda como `[SIN EQUIVALENTE VERIFICADO]`; en el PDF su cobertura es parcial por contenido bajo `RQF-B12 (pág. 9)` (el PDF estipula rechazo automático, superado por DEC-08 / DEC-E2-06). |
| **Requisito Funcional** | `RQF-044 [final-final]` / `RQF-B09` | [`fase5/requisitos-funcionales-y-no-funcionales-final-final.md:L46`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md#L46) y PDF pág. 9 | **VERIFICADO** | Configuración de umbrales numéricos de decisión por flujo y cliente (F5). En `final-final.md` es `RQF-044`; en el PDF es `RQF-B09 (pág. 9)`; en `fase5-lester` queda como `[SIN EQUIVALENTE VERIFICADO en lester]` (en lester solo existe `RQF-039` que exige doble aprobación). |
| **Requisito (Excluido)** | `RQF-013 [fase5-lester]` | [`fase5/fase5-lester/requisitos_formato_final.md:L15`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L15) | **VERIFICADO (Excluido)** | Tiempo restante en bandeja; excluido en `fase6/pruebas-funcionales.md:L3`. |
| **Requisito No Funcional**| `RQNF-002 [fase5-lester]`| [`fase5/fase5-lester/requisitos_formato_final.md:L57`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L57) | **VERIFICADO** | Reconstrucción de decisiones pasadas basada en historial. En `final-final.md` colisiona con "conservar expedientes de 90 días a 10 años", su equivalente verificado por contenido es `RQNF-003`; en el PDF queda `[SIN EQUIVALENTE VERIFICADO]` (sin equivalente directo). |
| **Requisitos PDF** | `RQF-B01` a `RQF-B36` y `RQNF-B01` a `RQNF-B13` | [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) (págs 9-12) | **VERIFICADO en PDF** | Conteo exacto: 49 requisitos (36 funcionales `RQF-B01..B36` y 13 no funcionales `RQNF-B01..B13`). Cotejo verificado con F5+F4: `RQF-B09` (configuración de umbrales = `RQF-044`), `RQF-B10` (aprobación automática = `RQF-040 [lester]` / `RQF-005 [final-final]`), `RQF-B11` (derivación rango 60-84) y `RQF-B12` (rechazo bajo umbral o fraude, cubriendo parcialmente por contenido `RQF-020`, `RQF-023` y `RQF-041`, superado el rechazo por DEC-08 / DEC-E2-06). `RQF-039` y `RQNF-002` no tienen equivalente directo en el PDF. |
| **Prueba Funcional** | `PF-015` | [`fase6/pruebas-funcionales.md:L34`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md#L34) | **VERIFICADO** | Verifica RQF-020 [fase5-lester] (caso con 45 puntos escala a humano según H-08). |
| **Prueba Funcional** | `PF-018` | [`fase6/pruebas-funcionales.md:L43`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md#L43) | **VERIFICADO** | Verifica RQF-023 [fase5-lester] (puntaje 100 con fraude deriva a revisión manual). |
| **Prueba Funcional** | `PF-020` | [`fase6/pruebas-funcionales.md:L45`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md#L45) | **VERIFICADO** | Verifica RQF-040 [fase5-lester] (la precondición en PF-020 dice "sobre 90"; la decisión del equipo DEC-01 es ≥ 90). |
| **Prueba Funcional** | `PF-021` | [`fase6/pruebas-funcionales.md:L46`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md#L46) | **VERIFICADO** | Verifica RQF-041 [fase5-lester] (puntaje 100 con señal bajo mínimo deriva o rechaza; la opción "o rechaza" queda formalmente superada por DEC-08, rigiendo únicamente la derivación). |
| **Prueba Funcional** | `PF-033` | [`fase6/pruebas-funcionales.md:L69`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md#L69) | **VERIFICADO** | Verifica RQF-039 [fase5-lester] (cambio de umbral requiere dos aprobaciones de administradores distintos; ver D-04). |
| **Caso de Uso** | `UC-01` | [`fase4/Fase 4 — Casos de uso (§5.3.2).md:L15`](../fases-y-plan-de-trabajo/fase4/Fase%204%20%E2%80%94%20Casos%20de%20uso%20%28%C2%A75.3.2%29.md#L15) | **VERIFICADO** | Evaluar caso automáticamente (contiene nota "85 vs 80 sin resolver"). |
| **Inconsistencias** | `H-01`, `H-05`, `H-08`, `H-10`, `H-11`, `H-14` | [`fase2/inconsistencias-revisadas.md`](../fases-y-plan-de-trabajo/fase2/inconsistencias-revisadas.md) | **VERIFICADO** | Todas corresponden a filas HC-001, HC-005, HC-008, HC-010, HC-011, HC-014. |
| **Citas de Entrevistas**| `ENT2 [00:13:05]`, `ENT4 [00:11:06]`, `ENT6 [00:21:16]`, `ENT3 [00:08:57]` | [`fase2/inconsistencias-revisadas.md`](../fases-y-plan-de-trabajo/fase2/inconsistencias-revisadas.md) | **VERIFICADO** | Marcas de tiempo cotejadas contra las fuentes de Fase 2. |

### 11.2 Lista Consolidada de Puntos `[POR VERIFICAR]` y `[POR CONFIRMAR]`
1. `[POR CONFIRMAR escala, probablemente 6,7 sobre 7,0]`: Escala de nota de la Entrega 1 consignada como 67 en el acta.
2. `[POR CONFIRMAR fecha y hora]`: Bloque horario de la defensa oral del equipo el lunes 19 de octubre.
3. `[pendiente de decisión del equipo]`: Resolución de la tensión de H-10 (HC-010) entre el cronograma formal de MIRA §5.2 (producción a fines de abril de 2027 y marcha blanca a fines de febrero) y el compromiso comercial expresado en ENT1 [00:11:05] (casos reales en enero de 2027 y feria a fines de marzo).
4. `[POR CONFIRMAR universo y numeración oficial de requisitos]`: Confirmación del docente en Consulta 4 sobre cuál numeración y universo rige formalmente la evaluación: `final-final.md` (81 requisitos, verificados con grep), `fase5-lester` (57 requisitos, verificados con grep) o el PDF consolidado (49 requisitos verificados en PDF: 36 RQF y 13 RQNF).
5. `[POR CONFIRMAR rol en PF-033 vs MIRA §2.13]`: `PF-033` exige que la segunda aprobación sea de un "administrador", mientras que MIRA §2.13 asigna la configuración de flujos y umbrales a quien diseña flujos (*Diseñador*).
6. `[POR VERIFICAR tras el init]`: Rutas relativas exactas generadas por Spec Kit al inicializar en la raíz (`memory/constitution.md` y `specs/...`).
7. `[SUPUESTO del equipo]`: Nombres de señales concretas alineadas conceptualmente con MIRA §2.6 (`autenticidad_documentos`, `cruce_fuentes`, `coherencia_solicitud` [biométrica solo si aplica]), bandera de fraude aparte (`alertaFraudeActiva`), umbrales mínimos (70, 70, 60), ponderaciones (40%, 40%, 20%), y roles simulados para autenticación (*Riesgo* y *Auditor* en D-04).
8. `[SUPUESTO: pendiente de consulta al profesor]`: Estructura tentativa de las tablas 6.6.1, 6.6.2 y los tres indicadores TPR, TIH e IRF.

---
*Fin de la Guía Operativa. Archivo de control versionado para la Entrega 2 de MIRA.*

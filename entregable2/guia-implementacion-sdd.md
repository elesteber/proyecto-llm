# Guía Operativa de Implementación SDD (Spec Kit) — Entrega 2 MIRA

**Taller de Desarrollo de Software Conducido por Agentes de IA**  
**Facultad de Ingeniería, Escuela de Ingeniería Informática — Universidad de Valparaíso**  
**Caso:** MIRA — Plataforma de Inteligencia Multimodal para Decisiones Empresariales (DPRIME SpA)  
**Fecha de actualización:** Miércoles 14 de octubre de 2026  
**Fecha límite de entrega:** Lunes 19 de octubre de 2026, 14:00 hrs (tag `v2.0`)  
**Método seleccionado:** Opción A — Spec-Driven Development (SDD) con GitHub Spec Kit sobre Antigravity  

---

## 0. Contexto y Reglas de Juego del Equipo

### 0.1 Parámetros Generales de la Entrega
- **Número de grupo:** Grupo 4.
- **Plazo final:** Lunes 19 de octubre de 2026, antes de las 14:00 CLT (con la etiqueta git `v2.0`). Todo commit posterior queda fuera de evaluación según reglamento.
- **Entregables obligatorios:**
  1. Informe escrito en formato PDF (`4-MIRA-Alvarez-Gonzalez-Guerrero-Salgado.pdf`) con extensiones máximas estrictas por sección (ver [§8](#8-puertas-de-calidad-y-definición-de-terminado-dod)).
  2. Repositorio de código fuente con historial versionado, artefactos del framework SDD, datos de prueba ficticios, suite automatizada y `README.md` operativo (entrega antes de las 14:00 con la etiqueta `v2.0`).
  3. Presentación en PPT de soporte.
  4. Exposición oral de 15 minutos (incluye demostración en vivo del software corriendo sobre el tag `v2.0`) + 5 minutos de preguntas individuales. Presentación a las 14:30 o en otro día `[POR CONFIRMAR en clase]`.
- **Antecedentes de la Entrega 1:** Calificación 6,7 (no se cita en el informe). Dictamen docente: retroalimentación del profesor fue *"todo bien, solo detalles en la presentación"*; no modifica ningún requisito, y se registra así en la bitácora.
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
| **Impacto** | Obligatoriedad de generar los artefactos exigidos: `.specify/memory/constitution.md`, `spec.md`, registro de clarificación, `plan.md`, `tasks.md`, reporte de consistencia y commits trazables por tarea. |

---

### DEC-E2-02: Nomenclatura Rectora de Requisitos y Gestión de Divergencias
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-02` |
| **Fecha** | 12-10-2026 |
| **Asunto** | Nomenclatura canónica de requisitos, convención de citación con archivo fuente y gestión de colisión de IDs |
| **Contexto** | En la Entrega 1 conviven múltiples numeraciones y una colisión crítica de identificadores entre fuentes:<br>1. **Colisión interna en Markdown:** Entre [`fase5/requisitos-funcionales-y-no-funcionales-final-final.md`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md) y [`fase5/fase5-lester/requisitos_formato_final.md`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md), los IDs `RQF-020`, `RQF-023`, `RQF-039`, `RQF-040`, `RQF-041` y `RQNF-002` significan conceptos completamente distintos.<br>2. **Discrepancia con el informe PDF:** En [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) (págs. 9-12) se utilizó `RQF-Bxx` (36 requisitos funcionales) y `RQNF-Bxx` (13 no funcionales).<br><br>⚠️ **Tabla de Advertencia: Colisión de IDs entre archivos de Fase 5:**<br>• `RQF-020`: en `final-final.md` = encolar peticiones excedentes; en `fase5-lester` = derivar a bandeja humana o rechazar automáticamente casos bajo 60.<br>• `RQF-023`: en `final-final.md` = crear caso nuevo vinculado al recibir evidencia de caso cerrado; en `fase5-lester` = imponer derivación sobre puntaje automático si alerta de fraude.<br>• `RQF-039`: en `final-final.md` = carga manual por formulario web; en `fase5-lester` = exigir dos aprobaciones separadas antes de modificar umbrales.<br>• `RQF-040`: en `final-final.md` = extraer texto y firmas contenidos en documentos cargados; en `fase5-lester` = aprobar automáticamente según umbral definido (80, 85, 90) sin fraude.<br>• `RQF-041`: en `final-final.md` = detectar objetos y daños en fotos y extraer metadatos; en `fase5-lester` = derivar o rechazar ignorando puntaje si alerta de fraude o señal bajo mínimo.<br>• `RQNF-002`: en `final-final.md` = conservar expedientes de 90 días a 10 años; en `fase5-lester` = reconstruir comportamiento, evidencias y reglas de decisión pasada basándose en historial. |
| **Alternativas** | **(a)** Migrar todo el código, specs y tests a `RQF-Bxx`.<br>**(b)** Adoptar la numeración de `fase5/fase5-lester/requisitos_formato_final.md` como convención rectora (dado que la suite de pruebas de `fase6/pruebas-funcionales.md` apunta directamente a ella) y construir una tabla de equivalencias verificada por contenido hacia `final-final.md` y hacia el PDF.<br>**(c)** Crear una nomenclatura nueva exclusiva para la Entrega 2. |
| **Decisión** | Se adopta la **Alternativa (b)**: **la guía usa la numeración de `fase5/fase5-lester/requisitos_formato_final.md`** (versión final cruzada con las pruebas de [`fase6/pruebas-funcionales.md`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md)), porque las pruebas apuntan directamente a ella. Se establece la **exigencia formal de que la spec (`spec.md`), la matriz de trazabilidad (`matriz-trazabilidad.md`) y el informe final citen cada requisito con su archivo fuente** (por ejemplo: `RQF-040 [fase5-lester]`, `RQF-028 [final-final]`) **y con el identificador `RQF-Bxx` del PDF como referencia cruzada** (ej. `RQF-B10 [PDF pág. 9]`), agregando una columna "Fuente" a la matriz de trazabilidad. |
| **Firma** | Confirmada por el equipo completo el 13-10-2026. |
| **Justificación** | Las pruebas funcionales existentes (`PF-001` a `PF-045`) fueron programadas y auditadas sobre `fase5-lester/requisitos_formato_final.md`. Modificar los IDs sin trazabilidad de archivo fuente generaría desalineación crítica con la suite de pruebas heredada. |
| **Estado de confirmación** | Decisión interna que resuelve la ambigüedad del universo de requisitos (ver Consulta 4 en [§10.1](#101-resoluciones-internas-de-ambigüedades-del-enunciado-dec-e2-07-08-09-y-dec-e2-02)): confirmada por el equipo completo el 13-10-2026. |
| **Impacto** | Todas las referencias en código fuente, comentarios de tests (`// RQF-040 [fase5-lester]`), especificaciones, matriz de trazabilidad e informe escrito deben utilizar la nomenclatura rectora acompañada explícitamente de su archivo fuente y referencia al PDF. |

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

### DEC-02: Formalización de Inconsistencia H-02 (Plazo de Retención de Evidencia)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-02` (formalización oficial del hallazgo `H-02` / `HC-002`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Plazo de retención de evidencia original ante conflicto entre la plataforma y la aseguradora |
| **Contexto** | MIRA §2.11 establece que *"la evidencia y los resultados se conservan noventa días, plazo tras el cual la evidencia original se elimina"*. En ENT6 [00:07:26], Daniela Cortés (Cumplimiento) señala: *"Noventa días es imposible. Un siniestro puede reclamarse ante la comisión mucho después... Nosotros conservamos cinco años, y en algunos productos diez. Si la plataforma borra la evidencia a los noventa días, nos deja sin respaldo justo cuando lo necesitamos."* (Fuente: `fase2/consolidacion-contradicciones.md`, fila `HC-002`.) |
| **Alternativas** | **(a)** Mantener el plazo de 90 días de la plataforma, ignorando el requisito regulatorio de la aseguradora.<br>**(b)** Adoptar el plazo máximo de la aseguradora (10 años) para todos los productos sin distinción.<br>**(c)** Adoptar el plazo de la aseguradora por producto (5 a 10 años), con almacenamiento activo los primeros 90 días y archivo frío el resto del período. |
| **Decisión** | Se adopta la **Alternativa (c)**: se mantiene el almacenamiento activo de evidencia por 90 días y luego se traslada a archivo frío hasta cumplir el plazo de retención definido por producto de la aseguradora (5 a 10 años), en lugar de eliminarla a los 90 días. |
| **Justificación** | Prioriza el requisito regulatorio/contractual de la aseguradora (evidencia necesaria ante reclamos tardíos) sobre el valor de diseño original de la plataforma, sin incurrir en el costo de mantener todo en almacenamiento activo indefinidamente. |
| **Impacto** | Fuera del alcance funcional directo de F5 y F4 en esta entrega (afecta el módulo de gestión de evidencia/expedientes, no implementado en el incremento); impacto documental para la comparativa 6.6. |

---

### DEC-03: Formalización de Inconsistencia H-03 (Límite de Llamadas / Rate Limit)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-03` (formalización oficial del hallazgo `H-03` / `HC-003`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Comportamiento del sistema ante exceso del límite de llamadas a la API |
| **Contexto** | MIRA §2.10 define *"el límite general es de mil llamadas por minuto por cliente... límite de cien llamadas por minuto para los ambientes de integración"*, sin especificar qué ocurre al superarlo. En ENT7 [00:06:37], Hugo Marambio advierte: *"Si el límite de integración es cien por minuto, cuando yo haga la carga inicial de casos históricos, o cuando se me acumulen dos días de casos por una caída, voy a superarlo en el primer minuto. Necesito saber qué pasa cuando lo supero: ¿me rechazan las llamadas?, ¿me encolan?"* (Fuente: `fase2/consolidacion-contradicciones.md`, fila `HC-003`.) |
| **Alternativas** | **(a)** Rechazar sin más toda llamada que exceda el límite, sin mecanismo de aviso.<br>**(b)** Encolar indefinidamente todo exceso, sin límite propio.<br>**(c)** Definir un modo de carga por lote (*bulk*) con límite propio para cargas masivas predecibles, y para tráfico estándar, rechazar el exceso con cabecera `Retry-After`. |
| **Decisión** | Se adopta la **Alternativa (c)**. |
| **Justificación** | Diferencia el tráfico operativo normal (protegido con rechazo informativo y reintento guiado por `Retry-After`) de cargas masivas predecibles —como la carga histórica inicial o el *catch-up* tras una caída—, que requieren una vía propia y no deben competir con el límite de integración estándar. |
| **Impacto** | Fuera del alcance funcional de F5 y F4 en esta entrega (afecta la capa de integración/API general, no el motor de decisión ni la gestión de umbrales); impacto documental para la comparativa 6.6. |

---

### DEC-04: Formalización de Inconsistencia H-04 (Criterio de Cobro de Casos Derivados)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-04` (formalización oficial del hallazgo `H-04` / `HC-004`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Determinación de si los casos derivados a revisión humana se facturan |
| **Contexto** | La propuesta comercial enviada al cliente (ENT8 [00:02:36], Valentina Ruiz-Tagle) establece: *"lo que le vendimos a la aseguradora es la decisión: si la plataforma resuelve el caso sola, se cobra. Si el caso termina en el escritorio de un analista... no hay nada que cobrar."* En tensión, ENT1 [00:06:26] registra la opinión de Rodrigo Vergara (sponsor): *"Ahí también hubo trabajo nuestro. El análisis se hizo igual. Yo diría que se cobra."* (Fuente: `fase2/consolidacion-contradicciones.md`, fila `HC-004`.) |
| **Alternativas** | **(a)** Cobrar todo caso procesado, incluidos los derivados a revisión humana, siguiendo la opinión interna de Rodrigo Vergara.<br>**(b)** No cobrar ningún caso derivado, siguiendo estrictamente la propuesta comercial ya enviada al cliente. |
| **Decisión** | Se adopta la **Alternativa (b)**: se mantiene el criterio ya comprometido por escrito con el cliente — se cobra únicamente cuando la plataforma resuelve el caso de forma automática; los casos derivados a revisión humana no se facturan. |
| **Justificación** | La propuesta comercial ya fue enviada y es un compromiso externo vigente con el cliente; modificarlo retroactivamente por una opinión interna no documentada formalmente generaría un conflicto contractual. |
| **Impacto** | Fuera del alcance funcional de F5 y F4 en esta entrega (afecta el módulo de facturación/medición de consumo, F7, no implementado en el incremento); impacto documental para la comparativa 6.6. |

---

### DEC-05: Formalización de Inconsistencia H-05 (Mínimos por Señal y Ponderaciones del Puntaje)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-05` (formalización oficial del hallazgo `H-05` / `HC-005`) |
| **Fecha** | 14-10-2026 (cerrada en sesión formal de `/speckit-clarify` con Rodrigo Guerrero como representante del cliente) |
| **Asunto** | Mínimos individuales por señal y ponderaciones del puntaje global en el flujo de reembolso médico |
| **Contexto** | MIRA §2.6 declara explícitamente que *"el detalle de qué señales tienen mínimo propio y cuáles son sus valores está pendiente de definir con el área de riesgo del cliente piloto"* (`HC-005`/`H-05`), sin fijar fórmula de cálculo del puntaje ni valores de mínimos. En ENT3 [00:21:47], Sebastián señala: *"mínimos por señal… aunque nadie ha definido cuáles son"* (cita verificada contra el MIRA docx, ver `INT-021`/`DEC-E2-10`). |
| **Alternativas** | **(a)** Dejar los mínimos y pesos sin definir y posponer la especificación hasta coordinar con el área de riesgo real del cliente (bloquea el sprint).<br>**(b)** Definir valores arbitrarios sin declarar su carácter de supuesto.<br>**(c)** Fijar valores razonables como `[SUPUESTO del equipo]`, explícitamente declarados como tales, modificables dinámicamente desde F5 con doble control, y someterlos a confirmación del representante del cliente en la sesión formal de `/speckit-clarify`. |
| **Decisión** | Se adopta la **Alternativa (c)**: mínimos individuales — `autenticidad_documentos` = 70, `cruce_fuentes` = 70, `coherencia_solicitud` = 60 — y ponderaciones — 0,40 / 0,40 / 0,20 — ratificados por Rodrigo Guerrero como representante del cliente en la sesión de `/speckit-clarify` del 14-10-2026, con la bandera de fraude (`alertaFraudeActiva`) tratada aparte, no como señal ponderada. |
| **Justificación** | Permite avanzar con la implementación sin bloquear el sprint por falta de un dato que la propia Entrega 1 reconoce como pendiente, dejando los valores configurables y versionados en F5 para ajustarlos empíricamente más adelante sin requerir cambios de código. |
| **Impacto** | Contrato `src/shared/types.ts` (campos `minimoAutenticidad`, `minimoCruceFuentes`, `minimoCoherencia`, `pesoAutenticidad`, `pesoCruceFuentes`, `pesoCoherencia`), lógica de evaluación de F4, y los 6 casos de prueba de `data/casos_prueba.json` (§2.d). |

---

### DEC-06: Formalización de Inconsistencia H-06 (Autenticación SSO Corporativo)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-06` (formalización oficial del hallazgo `H-06` / `HC-006`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Mecanismo de autenticación de usuarios del cliente (SSO corporativo vs. credenciales propias) |
| **Contexto** | MIRA §2.13 establece que *"los usuarios de los clientes se autentican con las credenciales que administra la propia plataforma"*, mientras que en ENT7 [00:18:26] Hugo Marambio exige: *"Nuestros usuarios se autentican contra el directorio corporativo... No voy a administrar un segundo juego de contraseñas para cincuenta analistas... eso va a tener que cambiar para nosotros."* (Fuente: `fase2/consolidacion-contradicciones.md`, fila `HC-006`.) |
| **Alternativas** | **(a)** Mantener credenciales propias de la plataforma, como indica el documento original.<br>**(b)** Tratar la autenticación contra el directorio corporativo del cliente (SSO) como requisito duro del proyecto en producción, incorporándolo formalmente al alcance y cronograma. |
| **Decisión** | Se adopta la **Alternativa (b)** para el entorno de producción. Para la Entrega 2 (incremento F5+F4), se simula mediante un selector de rol/usuario en la interfaz (`D-04`), dejando explícito que esto no sustituye la implementación real de SSO exigida para producción. |
| **Justificación** | El cliente piloto condiciona su adopción a no administrar un segundo set de credenciales; simular la identidad en el incremento permite probar la separación de roles de doble control (F5) sin construir la integración SSO real, que está fuera del alcance de este sprint. |
| **Impacto** | Selector de identidad simulada en la interfaz de F5/F4 (`D-04`, `contracts/session-simulada.md`); la integración SSO real queda fuera del alcance de F5+F4 y se registra como pendiente para una entrega posterior. |

---

### DEC-07: Formalización de Inconsistencia H-07 (Escritura de Resultados en el Sistema de Siniestros)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-07` (formalización oficial del hallazgo `H-07` / `HC-007`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Modalidad de escritura de resultados en el sistema de siniestros del cliente |
| **Contexto** | En ENT7 [00:03:46], Hugo Marambio señala: *"Hay que decidir si el resultado se escribe automático o si el operador lo transcribe"*, sin que el documento original fije una decisión. (Fuente: `fase2/consolidacion-contradicciones.md`, fila `HC-007`.) |
| **Alternativas** | **(a)** Transcripción manual del resultado por un operador.<br>**(b)** Escritura automática de los resultados en el sistema de siniestros, vía el mismo mecanismo de intercambio de archivos definido para la integración con el cliente piloto (`HC-013`/`H-13`). |
| **Decisión** | Se adopta la **Alternativa (b)**: la escritura de resultados se automatiza, usando el mecanismo de intercambio de archivos ya acordado para la integración (no transcripción manual). |
| **Justificación** | Evita el riesgo de error humano y el costo operativo de transcripción manual recurrente, reutilizando el mecanismo de integración ya definido para el cliente piloto en lugar de construir uno nuevo. |
| **Impacto** | Fuera del alcance funcional de F5 y F4 en esta entrega (afecta el módulo de integración y escritura de resultados hacia el sistema externo del cliente); impacto documental para la comparativa 6.6. |

---

### DEC-08: Formalización de Inconsistencia H-08 (Prohibición de Rechazo Automático Bajo 60 Puntos)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-08` (formalización oficial del hallazgo `H-08` / `HC-008`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Prohibición de rechazo automático para casos con puntaje bajo 60 |
| **Contexto** | MIRA §2.6 permite, en su redacción original, que *"los casos evaluados con un puntaje por debajo de 60 son escalados o rechazados"* (`HC-008`/`H-08`). En ENT6 [00:04:06], Daniela Cortés (Cumplimiento) exige: *"En el documento, el tramo bajo sesenta dice 'escalamiento o rechazo'... ese 'o rechazo' es exactamente lo que no puede quedar así... Lo que no puede ocurrir es un rechazo automático. Ahí necesito una persona que decida y que pueda explicar."* |
| **Alternativas** | **(a)** Mantener la opción de rechazo automático para el tramo bajo 60 puntos, como permite la redacción original.<br>**(b)** Eliminar completamente la opción de rechazo automático para ese tramo, escalando siempre a un analista humano que deba justificar la decisión. |
| **Decisión** | Se adopta la **Alternativa (b)**: se elimina la opción de rechazo automático para el tramo bajo 60 puntos; todo caso en ese tramo se deriva obligatoriamente a revisión humana asistida. |
| **Justificación** | Da cumplimiento a la exigencia explícita del área de Cumplimiento, que condiciona la operación del sistema a que ninguna denegación de reembolso ocurra sin intervención y justificación humana. |
| **Impacto** | Principio I de la constitución (prohibición absoluta de rechazo automático), lógica de evaluación de F4 (estados `APROBADO_AUTOMATICO` / `DERIVADO_REVISION` únicamente), formalizado técnicamente junto con `DEC-E2-06` y `DEC-E2-10(b)` mediante el campo informativo `riesgoAltoRechazo`. |

---

### DEC-09: Formalización de Inconsistencia H-09 (Cobro por Reevaluaciones)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-09` (formalización oficial del hallazgo `H-09` / `HC-009`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Contabilización de reevaluaciones de un mismo caso para efectos de cobro |
| **Contexto** | En ENT8 [00:07:26], Valentina Ruiz-Tagle documenta posiciones divergentes: *"Yo diría dos, porque hubo dos análisis"* frente a *"El cliente va a decir una, porque es un solo siniestro"*, concluyendo *"Necesitamos una definición escrita antes de la marcha blanca y no después de la primera factura."* (Fuente: `fase2/consolidacion-contradicciones.md`, fila `HC-009`.) |
| **Alternativas** | **(a)** Cobrar siempre dos validaciones por cualquier reevaluación.<br>**(b)** Cobrar siempre una sola validación por caso, sin excepción.<br>**(c)** Cobrar una validación por caso, salvo que exista evidencia nueva sustantiva que gatille un reanálisis completo, en cuyo caso se cobra una segunda validación. |
| **Decisión** | Se adopta la **Alternativa (c)**. |
| **Justificación** | Equilibra el interés del cliente (no pagar dos veces por el mismo siniestro sin razón) con el de la aseguradora (reconocer el costo de un reanálisis genuino cuando hay evidencia nueva sustantiva), evitando la ambigüedad que exponía Valentina. |
| **Impacto** | Fuera del alcance funcional de F5 y F4 en esta entrega (afecta el módulo de medición de consumo/facturación, F7); impacto documental para la comparativa 6.6. Relacionado conceptualmente con la prueba de reproducibilidad histórica (`DEC-14`), que sí está en alcance vía F4/F5. |

---

### DEC-10: Formalización de Inconsistencia H-10 (Cronograma Formal vs. Compromiso Comercial)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-10` (formalización oficial del hallazgo `H-10` / `HC-010`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Tensión entre el cronograma formal del proyecto y el compromiso comercial con el cliente piloto |
| **Contexto** | MIRA §5.2 fija el cronograma formal en 4 entregas, con marcha blanca a fines de febrero de 2027 y producción a fines de abril de 2027. En ENT1 [00:11:05], Rodrigo Vergara (sponsor) señala: *"la aseguradora quiere estar operando con casos reales en enero, y hay una feria del sector a fines de marzo donde queremos mostrar la plataforma completa funcionando en vivo... No es lo mismo una marcha blanca en febrero que un cliente operando en enero."* |
| **Alternativas** | **(a)** Adoptar el compromiso comercial informal (operar en enero) por sobre el cronograma formal, acelerando el plan.<br>**(b)** Rige el cronograma formal de MIRA §5.2 sin modificaciones, registrando la tensión comercial como riesgo.<br>**(c)** Aclarar primero con el cliente si "operar en enero" significa lanzamiento productivo completo o un piloto supervisado de volumen acotado, antes de decidir. |
| **Decisión** | Se adopta la **Alternativa (b)** para efectos de esta entrega: rige el plan formal de MIRA §5.2; la tensión comercial queda registrada como riesgo formal en la matriz de riesgos (`R-11`, §9), sin alterar el cronograma. La aclaración de la Alternativa (c) queda pendiente de gestión comercial, fuera del alcance técnico de F5+F4. |
| **Justificación** | El cronograma formal es el compromiso contractual vigente; comprometer una aceleración sin antes aclarar su alcance real con el cliente expondría al equipo a un riesgo de incumplimiento no gestionado. |
| **Impacto** | Matriz de riesgos del proyecto (`R-11`, §9); sin impacto directo en el código de F5/F4 de esta entrega, salvo la configurabilidad del umbral de aprobación (`DEC-01`), que permite operar inicialmente conservador y recalibrar en la marcha blanca. |

---

### DEC-11: Formalización de Inconsistencia H-11 (SLA de Procesamiento por Tramos) — ⚠️ PARCIALMENTE ABIERTA
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-11` (formalización oficial del hallazgo `H-11` / `HC-011`) |
| **Fecha** | 12-10-2026 (estructura definida); los valores numéricos no tienen fecha de cierre — la ficha permanece parcialmente abierta |
| **Asunto** | SLA de tiempo de procesamiento por caso (inviabilidad del valor único de 5 segundos) |
| **Contexto** | MIRA §4 exige que *"ningún caso debe demorar más de cinco segundos en procesarse"*. En ENT3 [00:08:57], Sebastián Alarcón objeta: *"Un caso de reembolso médico de verdad trae doce documentos... se va a treinta o cuarenta segundos. Un video de cinco minutos con análisis por eventos son varios minutos... Prometer cinco segundos para todo caso, como quedó en el documento, es prometer algo que el motor no puede hacer."* |
| **Alternativas** | **(a)** Mantener el requisito original de 5 segundos para todo caso, aun sabiendo que es técnicamente inviable.<br>**(b)** Eliminar todo compromiso de tiempo de procesamiento.<br>**(c)** Redefinir el SLA por tramos según tipo/tamaño de archivo, dejando pendientes los valores numéricos exactos hasta contar con pruebas de carga. |
| **Decisión** | Se adopta la **Alternativa (c)** solo en su estructura: el SLA se redefine por tramos según tipo/tamaño en lugar de un número único. **Los valores numéricos exactos por tramo permanecen sin definir** por falta de pruebas de carga suficientes — esta ficha queda formalmente **⚠️ PARCIALMENTE ABIERTA**. Para la Entrega 2, el equipo decide no construir una prueba extra-funcional de latencia (no hay base de datos para fijar un SLA creíble) y en su lugar implementa la prueba extra-funcional de reproducibilidad determinista (`DEC-14`/`H-14`), que sí es medible sin datos de producción. |
| **Justificación** | Prometer un número sin respaldo empírico incurriría en el mismo defecto que el documento original (requisito no verificable); se prefiere declarar la estructura y dejar los valores pendientes de forma honesta, antes que inventar cifras sin sustento. |
| **Impacto** | No se implementa prueba extra-funcional de latencia en F4/F5 de esta entrega; la prueba extra-funcional medible exigida por la pauta (§6.5) se cubre con `SC-004` (reproducibilidad). Pendiente para una entrega futura: ejecutar pruebas de carga reales y fijar los valores de SLA por tramo. |

---

### DEC-12: Formalización de Inconsistencia H-12 (Rastro Inalterable vs. Derecho de Eliminación)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-12` (formalización oficial del hallazgo `H-12` / `HC-012`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Compatibilización entre la inalterabilidad del rastro de auditoría y el derecho del titular a eliminar sus datos |
| **Contexto** | MIRA §2.11 establece que *"el rastro es inalterable. Ningún usuario... puede modificarlo ni eliminarlo"*, mientras que §3 exige que *"los datos personales contenidos en la evidencia... se eliminan cuando el titular ejerce su derecho a que se eliminen."* En ENT6 [00:10:08], Daniela Cortés señala: *"esas dos frases juntas no funcionan. Alguien tiene que sentarse a resolver eso con criterio: qué se elimina, qué se conserva anonimizado y qué se conserva sí o sí porque existe una obligación legal que prevalece sobre la solicitud del titular."* |
| **Alternativas** | **(a)** Priorizar la inalterabilidad absoluta, negando toda solicitud de eliminación de datos personales.<br>**(b)** Priorizar el derecho de eliminación, permitiendo borrar también el registro de auditoría.<br>**(c)** Separar el rastro de decisión (metadato: quién, cuándo, score, decisión), que se mantiene inalterable, del contenido personal de la evidencia, que puede anonimizarse ante una solicitud válida sin eliminar el registro de que la decisión existió. |
| **Decisión** | Se adopta la **Alternativa (c)**, propuesta por Daniela Cortés. |
| **Justificación** | Permite cumplir simultáneamente la obligación regulatoria de mantener un rastro de decisión inalterable (necesario ante auditorías) y el derecho del titular a que se anonimice su información personal, sin que una obligación anule a la otra. |
| **Impacto** | Diseño de las tablas de auditoría (triggers inmutables en `auditoria_evaluaciones`, `rastro_auditoria`, implementadas en F4/F5 de esta entrega conforme al Principio VIII de la constitución); la funcionalidad específica de anonimización de datos personales queda fuera del alcance de F5+F4 en esta entrega. |

---

### DEC-13: Formalización de Inconsistencia H-13 (Integración API REST vs. Archivos)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-13` (formalización oficial del hallazgo `H-13` / `HC-013`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Modalidad de integración con el sistema central del cliente piloto |
| **Contexto** | MIRA §2.10 asume integración vía API REST donde *"el cliente integra ese punto de acceso desde sus sistemas y envía la evidencia en la misma llamada"*, pero en ENT7 [00:01:06], Hugo Marambio advierte: *"Nuestro sistema central de siniestros... no expone servicios web. Lo que sí tiene es un intercambio de archivos... Todo lo que ustedes diseñen asumiendo llamadas en línea contra nuestro core no va a funcionar."* |
| **Alternativas** | **(a)** Mantener únicamente la integración vía API REST, como en el documento original (inviable para el cliente piloto).<br>**(b)** Reemplazar completamente la API REST por intercambio de archivos.<br>**(c)** Soportar ambos patrones de integración: API REST para clientes que la expongan, e intercambio de archivos para clientes cuyo core no expone servicios web (caso del cliente piloto). |
| **Decisión** | Se adopta la **Alternativa (c)**. |
| **Justificación** | Preserva la arquitectura general basada en API REST para clientes futuros que sí expongan servicios web, sin descartarla, mientras resuelve la restricción técnica real y verificada del cliente piloto actual. |
| **Impacto** | Fuera del alcance funcional directo de F5 y F4 en esta entrega (afecta la capa general de integración con sistemas externos); impacto documental para la comparativa 6.6. |

---

### DEC-14: Formalización de Inconsistencia H-14 (Reproducibilidad como Trazabilidad)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-14` (formalización oficial del hallazgo `H-14` / `HC-014`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Redefinición de "reconstruir una decisión pasada" ante el no determinismo de modelos generativos |
| **Contexto** | MIRA §2.11 exige que *"debe ser posible reconstruir una decisión pasada tal como se tomó, es decir, con las versiones de los módulos y del flujo que estaban vigentes en ese momento."* En ENT3 [00:03:25], Sebastián Alarcón objeta: *"buena parte del análisis se apoya en modelos generativos, que no son deterministas... Puedes fijar parámetros para reducir la variación, pero no la eliminas. Y los proveedores actualizan sus modelos sin avisar... Si el documento promete reproducibilidad y firmamos eso, estamos firmando algo que no se cumple."* |
| **Alternativas** | **(a)** Mantener la promesa de reproducibilidad exacta del output de los modelos generativos, sabiendo que es técnicamente inviable.<br>**(b)** Eliminar todo compromiso de reconstrucción histórica.<br>**(c)** Redefinir "reconstruir una decisión pasada" como trazabilidad completa (inputs, versión de modelo/umbrales, parámetros y lógica vigentes en ese momento), sin prometer reproducibilidad exacta del output de un modelo generativo no determinista. |
| **Decisión** | Se adopta la **Alternativa (c)**. |
| **Justificación** | Permite cumplir el espíritu auditable del requisito original (poder explicar cómo se tomó una decisión pasada) sin comprometerse a algo que Sebastián demuestra como técnicamente imposible de garantizar con modelos generativos no deterministas. |
| **Impacto** | Fundamenta directamente la prueba extra-funcional obligatoria de esta entrega (`tests/reproducibility/deterministic.test.ts`, `SC-004`, Principio VIII de la constitución): como el motor de F4 es determinista (reglas simuladas, no generativo), se exige y se verifica reproducibilidad 100% exacta al reevaluar un caso histórico contra la versión de umbrales archivada en SQLite, cumpliendo la trazabilidad exigida sin las limitaciones que señaló Sebastián para modelos generativos reales. |

---

### DEC-15: Formalización de Inconsistencia H-15 (Plazo de Onboarding de Cliente Nuevo)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-15` (formalización oficial del hallazgo `H-15` / `HC-015`) |
| **Fecha** | 12-10-2026 |
| **Asunto** | Plazo realista de incorporación de un cliente nuevo en producción |
| **Contexto** | MIRA §2.16 fija como meta que *"un cliente nuevo pueda estar procesando casos de prueba el mismo día en que se firma... y en producción dentro de dos semanas."* En ENT2 [00:10:26], Camila Ordóñez matiza: *"Cuando llega un formulario propio de un cliente, con su formato, tomamos entre dos y tres semanas en dejarlo funcionando bien."* |
| **Alternativas** | **(a)** Mantener la meta única de 2 semanas para todo cliente nuevo, sin distinción.<br>**(b)** Descartar la meta de 2 semanas por considerarla irreal en todos los casos.<br>**(c)** Mantener la meta de 2 semanas para clientes sin formulario personalizado, y comunicar un plazo adicional realista de 2-3 semanas específicamente para la configuración de un formulario propio. |
| **Decisión** | Se adopta la **Alternativa (c)**. |
| **Justificación** | Reconcilia la meta comercial (que sigue siendo válida para el caso estándar) con la estimación operativa real de quien ejecuta la configuración, evitando comprometer un plazo que el propio equipo de producto sabe que no puede cumplir cuando hay personalización de formulario. |
| **Impacto** | Fuera del alcance funcional de F5 y F4 en esta entrega (afecta el proceso comercial/de onboarding de nuevos clientes); impacto documental para la comparativa 6.6. |

---

### DEC-16: Formalización de Inconsistencia H-16 (Tramos de Facturación del Cliente Piloto) — ⚠️ ABIERTA
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-16` (formalización oficial del hallazgo `H-16` / `HC-016`) |
| **Fecha** | 12-10-2026 (sin fecha de cierre — permanece abierta, fuera de alcance de F5+F4) |
| **Asunto** | Tramos de facturación insuficientes para el volumen del cliente piloto |
| **Contexto** | MIRA §2.14 define tramos *"hasta dos mil validaciones mensuales, de dos mil a cinco mil, y sobre cinco mil"* sin precio para el tramo superior. En ENT4 [00:03:07], Francisca Leiva señala: *"Si una validación es un documento, son cuarenta mil. Si es un caso, son doce mil. En ningún escenario son dos mil."* En ENT8 [00:15:16], Valentina Ruiz-Tagle agrega: *"Los tramos están definidos hasta diez mil validaciones mensuales y hay un tramo que dice 'diez mil o más' sin precio. Ese es el tramo en el que va a caer el cliente piloto."* |
| **Alternativas** | **(a)** Mantener los tramos actuales sin modificación, dejando sin base comercial al cliente piloto.<br>**(b)** Agregar un único tramo nuevo con precio fijo (5.000-15.000) suficiente para cubrir al cliente piloto bajo cualquiera de las dos definiciones de "validación" en disputa (documento vs. caso), dejando el tramo sobre 15.000 como "Enterprise/a convenir" hasta contar con más datos de costo real. |
| **Decisión** | Se propone la **Alternativa (b)**, pero **queda formalmente ⚠️ ABIERTA**: pendiente de validar con finanzas/comercial, y depende de resolver primero la definición de "validación" (documento vs. caso), que tampoco está cerrada. |
| **Justificación** | No corresponde al equipo técnico fijar unilateralmente un precio comercial sin la validación del área de finanzas; se documenta la propuesta como punto de partida para esa conversación, sin presentarla como decisión cerrada. |
| **Impacto** | Fuera del alcance funcional de F5 y F4 en esta entrega (afecta el módulo de medición de consumo/facturación, F7); queda registrada como pendiente abierta para la comparativa 6.6 y para una entrega futura, sin bloquear el incremento actual. |

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

### DEC-E2-07: Conformación del Equipo (4 Integrantes), Declaración en 6.2 y Delimitación de Tres Insumos Base
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-07` |
| **Fecha** | 13-10-2026 |
| **Asunto** | Conformación del equipo de 4 integrantes, declaración de participación de Jorge Alvarez en sección 6.2 y delimitación de los tres insumos base |
| **Contexto** | El equipo está compuesto por 4 integrantes (Rodrigo Guerrero, Jorge Alvarez, Lester Gonzalez, Angel Salgado). Jorge Alvarez no participó en la Entrega 1 (la realizaron tres personas), lo que requiere ser declarado explícitamente ante la evaluación docente. Ante la indicación del profesor de resolver internamente las ambigüedades del enunciado, el equipo establece la postura oficial. |
| **Decisión** | 1. **Composición del equipo:** El equipo se ratifica formalmente en 4 integrantes. El informe declara explícitamente en la sección 6.2 que Jorge Alvarez no participó en la Entrega 1.<br>2. **Tres insumos base:** Se formalizan los tres insumos rectores para la Entrega 2:<br>• **Descripción de MIRA:** Documento de contexto y especificación del sistema DPRIME SpA.<br>• **Retroalimentación de la Entrega 1:** Dictamen docente recibido (*"todo bien, solo detalles en la presentación"*); se establece que no modifica ningún requisito y se registra así en la bitácora.<br>• **Análisis de la Entrega 1:** Informe consolidado y artefactos de las fases 1 a 6 heredados del sprint anterior.<br>Resolución interna confirmada por el equipo completo el 13-10-2026. |
| **Firma** | Confirmada por el equipo completo el 13-10-2026. |
| **Justificación** | Transparenta la situación del nuevo integrante ante la evaluación docente (sección 6.2) y delimita de forma cerrada los insumos de entrada, garantizando que la retroalimentación docente no altera los requisitos vigentes. |
| **Impacto** | Sección 6.2 del informe escrito, bitácora de decisiones, definición del sprint y plan de trabajo de Jorge Alvarez. |

---

### DEC-E2-08: Estructura Canónica de Sección 6.6, Tablas de Evolución y Fórmulas de Indicadores
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-08` |
| **Fecha** | 13-10-2026 |
| **Asunto** | Estructura formal de la sección 6.6 (Comparativa con Entrega 1), gobernanza de tablas 6.6-A y 6.6-B, y fórmulas de indicadores (TPR, TIH, IRF) |
| **Contexto** | El criterio C6 de la rúbrica (30% de la evaluación) exige contrastar cuantitativa y cualitativamente la Entrega 2 frente a la Entrega 1. El profesor indicó que el equipo resuelva internamente las ambigüedades sobre la vinculación de tablas e indicadores. |
| **Decisión** | Se fija formalmente la estructura, métricas y gobernanza de la sección 6.6:<br>1. **Estructura de la sección:**<br>• **Tabla 6.6-A: Evolución de requisitos:** Columnas obligatorias: `Requisito E1 con fuente`, `Clasificación` (*Sin cambio* / *Modificado* / *Diferido por alcance* / *Nuevo*), `Qué cambió`, `Origen` (*equipo* / *cliente* / *agente*), `Evidencia`.<br>• **Subsección 6.6.1:** Reservada exclusivamente para las preguntas guía de reflexión del enunciado.<br>• **Tabla 6.6-B: Hallazgos y supuestos:** Columnas obligatorias: `H-xx`, `Qué decía la E1`, `Estado en la E2`, `Quién lo detectó`, `Evidencia`.<br>2. **Fórmulas de los indicadores cuantitativos:**<br>• **TPR (Tasa de Preservación de Requisitos Must):** `Must de F4/F5 sin cambio ÷ Must de F4/F5 × 100`<br>• **TIH (Tasa de Intervención Humana en Código):** `Commits de corrección humana ÷ Commits de tareas × 100`<br>• **IRF (Índice de Retrabajo por Fase):** `Artefactos de fase con corrección humana sustantiva ÷ Artefactos de la fase`<br>3. **Gobernanza y llenado diario:** Las tablas se llenan cada día; Angel Salgado es el responsable de su actualización.<br>Resolución interna confirmada por el equipo completo el 13-10-2026. Reemplaza el contenido de §7.7 y quita `[SUPUESTO: pendiente de consulta al profesor]`. |
| **Firma** | Confirmada por el equipo completo el 13-10-2026. |
| **Justificación** | Estandariza un marco cuantitativo verificable y auditable para el criterio de mayor ponderación de la rúbrica (30%), garantizando evidencia acumulada día a día para el informe. |
| **Impacto** | Reemplaza íntegramente §7.7, define los campos de seguimiento diario y rige la redacción de la sección 6.6 del informe final por Angel Salgado. |

---

### DEC-E2-09: Ponderaciones de Rúbrica, Límite de 11 Planas, Política de Citas y Verificación Pre-Entrega
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-09` |
| **Fecha** | 13-10-2026 |
| **Asunto** | Aplicación estricta de la tabla de ponderaciones de la rúbrica, límite de 11 planas A4 más anexos, asunción de penalización −1,0 por cita inexistente y script de verificación en DoD |
| **Contexto** | Existen ambigüedades en el enunciado respecto a si rige una división simétrica o la tabla de ponderaciones del capítulo 8, la equivalencia de 1 plana y el impacto de citas rotas. El profesor indicó que el equipo resuelva internamente estas definiciones. |
| **Decisión** | Se adoptan internamente las siguientes reglas rectoras:<br>1. **Ponderaciones de evaluación:** Rige la tabla de ponderaciones de la rúbrica docente: C6 (30%), C4 (20%), C10 (15%), C3 (10%), y 5% para los demás criterios evaluados (C1, C2, C5, C8, C9; falta C7 en la pauta).<br>2. **Límite de extensión física:** 1 plana equivale a 1 página A4. Las tablas y figuras del cuerpo principal quedan contenidas dentro del límite, sumando un total de 11 planas más anexos. La trazabilidad (`matriz-trazabilidad.md`) y la bitácora de decisiones van como anexos (en el cuerpo mandan: 6.7 Discusión y 6.8 Conclusiones).<br>3. **Descuento por cita inexistente:** Se asume preventivamente el descuento de −1,0 punto por cada ocurrencia.<br>4. **Script de verificación pre-entrega:** Antes de entregar se corre obligatoriamente un script que verifique IDs, citas y hashes de commit en el repositorio, agregándose a la definición de terminado (§8.2).<br>5. **Artefactos obligatorios en DoD:** Se formaliza en §8.2 la lista obligatoria: constitución (`.specify/memory/constitution.md`), spec (`spec.md`), registro de clarificación (`clarificaciones.md`), plan (`plan.md`), tareas (`tasks.md`) y reporte de análisis de consistencia (`reporte-analisis-consistencia.md`).<br>Resolución interna confirmada por el equipo completo el 13-10-2026. |
| **Firma** | Confirmada por el equipo completo el 13-10-2026. |
| **Justificación** | Asegura foco operativo en los criterios de mayor ponderación (C6 30%, C4 20%), previene cortes de lectura por exceder 11 planas y elimina el riesgo de descuentos de −1,0 punto mediante verificación pre-entrega automatizada. |
| **Impacto** | Modifica la Definición de Terminado (§8.2), rige la diagramación del informe por Angel Salgado y programa el script de verificación automatizado en QA a cargo de Lester Gonzalez. |

---

### DEC-E2-10: Decisiones Integrales de Diseño Funcional y Técnico para F5 (Gestión de Umbrales) y F4 (Motor de Decisión)
| Campo | Contenido |
| :--- | :--- |
| **ID** | `DEC-E2-10` |
| **Fecha** | 13-10-2026 |
| **Asunto** | Parámetros de señales/pesos/mínimos (F5), tratamiento de riesgo de rechazo sin rechazo automático (F4), unificación de spec y gobernanza de roles |
| **Contexto** | Tras el análisis de MIRA §2.6, §2.13, §3, las entrevistas (ENT1, ENT3, ENT5, ENT6) y la necesidad de acotar el incremento F5+F4 para la Entrega 2, el equipo resuelve integralmente en reunión del 13-10-2026 las definiciones pendientes de diseño y arquitectura de contratos. |
| **Decisión** | El equipo completo adopta y confirma formalmente las siguientes cuatro decisiones:<br><br>**(a) Señales del dominio, pesos, mínimos y reglas de validación en F5:**<br>• Se mantienen como `[SUPUESTO del equipo]` las tres señales del flujo de reembolso médico: `autenticidad_documentos` (peso 0,40, mínimo 70), `cruce_fuentes` (peso 0,40, mínimo 70) y `coherencia_solicitud` (peso 0,20, mínimo 60). Fuente documental: MIRA §2.6 declara explícitamente que *"el detalle de qué señales tienen mínimo propio y cuáles son sus valores está pendiente de definir con el área de riesgo del cliente piloto"* y no fija fórmula de cálculo; asimismo se cita ENT3 [00:21:47] (VERIFICADO; fuente: MIRA docx, ENT3 [00:21:47], Sebastián: *"mínimos por señal… aunque nadie ha definido cuáles son"*).<br>• Pesos, mínimos y umbrales son modificables dinámicamente desde la interfaz web de F5 mediante flujo de doble control (Diseñador propone, Administrador aprueba) y quedan versionados con trazabilidad inmutable.<br>• Reglas de validación estrictas: la suma de los tres pesos debe ser exactamente 1,0 (suma de pesos = 1,0), y todos los mínimos y umbrales deben ser valores numéricos acotados entre 0 y 100 (0 <= x <= 100). Rodrigo Guerrero (representante del cliente en la E2) confirma o ajusta estos valores en la sesión formal de `/speckit-clarify`.<br><br>**(b) Opción A para gestión de riesgo de rechazo (se mantiene DEC-08 sin rechazo automático):**<br>• Se ratifica la **Opción A**: el sistema **NUNCA genera rechazo automático**, conservando estrictamente dos únicos resultados de salida: `APROBADO_AUTOMATICO` y `DERIVADO_REVISION`.<br>• Se incorpora en el contrato de datos el atributo booleano `riesgoAltoRechazo: boolean`, calculado estrictamente *después* de aplicar las reglas de decisión y sin alterar en ningún caso el resultado emitido. Es `true` si se cumple al menos una de dos condiciones:<br>&nbsp;&nbsp;1. Existen al menos dos señales individuales bajo su respectivo mínimo propio (conteo de señales bajo mínimo >= 2), O<br>&nbsp;&nbsp;2. El puntaje global es estrictamente menor que `umbralRiesgoAlto` (valor por defecto = 60, configurable y versionado desde F5).<br>• Interfaz de usuario: la vista de resultados de F4 despliega una advertencia visual destacada (*"Riesgo alto de rechazo: decide un operador"*), y **nunca utiliza la palabra "rechazado"** para una decisión emitida por el sistema.<br>• *Alternativas descartadas documentadas:*<br>&nbsp;&nbsp;• *Alternativa B (Rechazo propuesto con confirmación en un clic):* Descartada porque Daniela Cortés en ENT6 [00:01:21] advierte enfáticamente contra interfaces donde el operador simplemente *"apriete aceptar en tres segundos"*, y Marco en ENT5 [00:15:16] evidencia el sesgo de anclaje de predisponer al operador al ver un número antes que la evidencia clínica.<br>&nbsp;&nbsp;• *Alternativa C (Rechazo automático configurable, apagado por defecto):* Descartada porque en ENT6 [00:04:06] Daniela Cortés afirma que no se rechaza automáticamente y que la intervención humana es indelegable ante denegaciones, y su inclusión duplicaría innecesariamente la matriz de pruebas y el alcance del sprint.<br>*(Verificación de fuentes: ENT5 [00:15:16] verificada en HC-016 y H-12; ENT6 [00:04:06] verificada en HC-008; ENT6 [00:01:21] verificada en MIRA docx; MIRA §2.6 y §3 verificadas; ENT3 [00:21:47] VERIFICADO (fuente: MIRA docx, Sebastián: *"mínimos por señal… aunque nadie ha definido cuáles son"*)).*<br><br>**(c) Especificación unificada (Cierre de D-09):**<br>• Se redacta **una sola especificación técnica consolidada** (`spec.md`) para el incremento conjunto F5 + F4, estructurando las tareas de desarrollo en `tasks.md` con etiquetas explícitas `[F5]` o `[F4]` para preservar el orden productor → consumidor sin fragmentar la gobernanza de Spec Kit.<br><br>**(d) Protocolo de aprobación de cambios de umbral (Cierre de D-04 y `[POR CONFIRMAR rol en PF-033]`):**<br>• Un usuario con rol *Diseñador* propone la modificación de umbrales/mínimos (estado `BORRADOR`), y un usuario con rol *Administrador* distinto aprueba la propuesta (pasa a `APROBADO` y vigencia operativa). Quien propone nunca puede aprobar.<br>• Alineación documental: cubre simultáneamente MIRA §2.13 (que asigna el diseño y edición de flujos y umbrales al *Diseñador*), ENT6 [00:21:16] (que exige dos aprobaciones separadas) y la intención de la prueba funcional `PF-033` (que exige aprobación por un "administrador", documentándose la diferencia respecto a su redacción literal). Cierra formalmente la duda D-04, el criterio de aceptación de F5 y el pendiente `[POR CONFIRMAR rol en PF-033 vs MIRA §2.13]`. |
| **Firma** | Confirmada por el equipo completo el 13-10-2026. |
| **Justificación** | Resuelve de manera integral la tensión entre la prohibición normativa de rechazo automático y la necesidad de visibilizar casos de alta criticidad, armoniza los roles de MIRA con las pruebas de la Entrega 1, y consolida la arquitectura del incremento en un único contrato TypeScript desacoplado. |
| **Impacto** | Contrato `src/shared/types.ts` (§5.2), especificación (`spec.md`), matriz de casos de prueba (§2.d), lógica del motor de decisión (§3.1), catálogo de decisiones D-04, D-07, D-08, D-09 (§4.1), y eliminación de pendientes en §11.2. |

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
| `RQF-020 [fase5-lester]` | `[SIN EQUIVALENTE VERIFICADO]` | `RQF-B12 (pág. 9)` (cobertura parcial por contenido; el PDF estipula rechazo bajo umbral mínimo o fraude, superado por DEC-08 / DEC-E2-06 / DEC-E2-10) | Derivación obligatoria bajo 60 puntos (redefinido por H-08 sin rechazo) | Must | F4 | `PF-015` | **Verificado en repo y PDF (parcial)** |
| `[SIN EQUIVALENTE VERIFICADO en lester]` | `RQF-004 [final-final]` | `RQF-B11 (pág. 9)` (rango de 60-84 sin aprobar ni rechazar) | Derivación a revisión asistida en rango intermedio de puntaje (60 a 89.9 puntos) sin aprobar ni rechazar | Must | F4 | `[sin prueba heredada verificada]` (PF-004 verifica límite de tasa de RQF-004 [lester]) | **Verificado en final-final y PDF** (sin equivalente en fase5-lester ni prueba funcional heredada) |
| `RQF-023 [fase5-lester]` | `RQF-028` | `RQF-B12 (pág. 9)` (cobertura parcial por contenido; el PDF estipula rechazo automático ante fraude, superado por DEC-E2-06; prueba PF-018 en pág. 13 cita RQF-023) | Precedencia de alerta de fraude activa derivando siempre a revisión manual | Must | F4 | `PF-018` | **Verificado en repo y PDF (parcial)** |
| `RQF-039 [fase5-lester]` | `RQF-035 [final-final]` | `[SIN EQUIVALENTE VERIFICADO]` (sin equivalente directo en el PDF; la configuración simple está en RQF-B09, pero la doble aprobación no existe en el PDF) | Exigir dos aprobaciones separadas antes de aplicar modificaciones sobre umbrales de decisión | Must | F5 | `PF-033` | **Verificado físicamente en repo** |
| `[SIN EQUIVALENTE VERIFICADO en lester]` | `RQF-044` | `RQF-B09 (pág. 9)` | Configuración independiente de umbrales numéricos de decisión por cliente y flujo | Must | F5 | `PF-033` (asociado indirectamente a RQF-044 / RQF-B09) | **Verificado en final-final y PDF** |
| `RQNF-002 [fase5-lester]` | `RQNF-003` | `[SIN EQUIVALENTE VERIFICADO]` (sin equivalente directo en el PDF) | Reconstrucción de decisiones pasadas basada en historial y versiones guardadas | Must | F4 / F5 | *(Derivado de H-14 / DEC-14)* | **Verificado físicamente en repo** |

- **Nota de Trazabilidad sobre `PF-020`:** En `fase6/pruebas-funcionales.md:L45` y en el PDF (`Informe Mira - LLM.pdf`, pág. 13), el caso de prueba `PF-020` establece textualmente en su precondición y pasos: *"inyectar un caso con puntaje evaluado por sobre 90"*. La decisión formal del equipo (**DEC-01**) fija el umbral como **≥ 90 puntos**, operativizando el criterio inclusivo (un puntaje de exactamente 90.0 puntos aprueba automáticamente si cumple las restantes condiciones).
- **Criterio de término:** Archivo `docs/entregable2/equivalencias-requisitos.md` commitenado en git.

---

### 2.b Formalización de DEC-01 a DEC-16 desde H-01 a H-16
- **Responsable:** Angel Salgado (con revisión de Rodrigo Guerrero (representante del cliente en la E2)).
- **Estado al 18-10-2026:** las 16 fichas completas (Contexto, Alternativas, Decisión, Justificación, Impacto) viven en la sección 1 de esta guía, junto a `DEC-01` y las `DEC-E2-xx`. Resumen de estado:
  - `DEC-01` (H-01): **Cerrada.** Umbral ≥ 90 parametrizable por flujo. Ficha completa en §1.
  - `DEC-02` (H-02): Cerrada (retención 5-10 años: 90 días activo, luego frío). Ficha completa en §1.
  - `DEC-03` (H-03): Cerrada (rate limits con `Retry-After` y modo bulk). Ficha completa en §1.
  - `DEC-04` (H-04): Cerrada (cobro restringido a decisiones automáticas). Ficha completa en §1.
  - `DEC-05` (H-05): Cerrada en `clarify` (14-10-2026) (mínimos 70/70/60, pesos 0,40/0,40/0,20, ratificados por Rodrigo Guerrero). Ficha completa en §1.
  - `DEC-06` (H-06): Cerrada (SSO corporativo obligatorio en producción; en E2 se simula con selector de rol). Ficha completa en §1.
  - `DEC-07` (H-07): Cerrada (escritura automática en siniestros vía archivos). Ficha completa en §1.
  - `DEC-08` (H-08): Cerrada (prohibición de rechazo automático bajo 60 puntos; formalizado con `riesgoAltoRechazo` en DEC-E2-10). Ficha completa en §1.
  - `DEC-09` (H-09): Cerrada (cobro de 1 validación por siniestro salvo reanálisis sustantivo). Ficha completa en §1.
  - `DEC-10` (H-10): Cerrada (rige el plan formal de MIRA §5.2; compromiso comercial registrado como riesgo `R-11` en §9). Ficha completa en §1.
  - **`DEC-11` (H-11): ⚠️ PARCIALMENTE ABIERTA.** Estructura de SLA por tramos definida; valores numéricos siguen abiertos por falta de pruebas de carga. Ficha completa en §1.
  - `DEC-12` (H-12): Cerrada (rastro inalterable de decisión disociado de evidencia personal). Ficha completa en §1.
  - `DEC-13` (H-13): Cerrada (soporte dual: API REST y carpetas compartidas). Ficha completa en §1.
  - `DEC-14` (H-14): Cerrada (reconstrucción como trazabilidad de inputs/versiones, base de la prueba extra-funcional). Ficha completa en §1.
  - `DEC-15` (H-15): Cerrada (plazo 2 semanas estándar, +2-3 con formulario propio). Ficha completa en §1.
  - **`DEC-16` (H-16): ⚠️ ABIERTA** (tramos de facturación 5.000–15.000 y Enterprise; fuera de alcance de F5+F4). Ficha completa en §1.

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
- **Fórmula de agregación del puntaje global (D-08 / DEC-E2-10):**
  Puntaje Global = (0.40 * autenticidad_documentos) + (0.40 * cruce_fuentes) + (0.20 * coherencia_solicitud) [SUPUESTO del equipo]
- **Regla de cálculo de riesgo alto de rechazo (DEC-E2-10):**
  `riesgoAltoRechazo = (conteoSenalesBajoMinimo >= 2) || (scoreGlobal < umbralRiesgoAlto)`
  (donde `umbralRiesgoAlto = 60` por defecto, configurable en F5 y versionado).

#### Especificación de los Casos de Prueba Ficticios (Aislando una Regla por Caso)
1. **Caso 1 (`CASO-MED-001` — Aprobación Automática):**
   - **Prestación:** Consulta médica de medicina general (45.000 CLP).
   - **Evidencia ficticia:** `boleta_consulta_001.pdf` y `receta_medica_001.jpg`.
   - **Señales:** Autenticidad documentos = 95; Cruce fuentes = 95; Coherencia solicitud = 90; Alerta fraude = Inactiva (false).
   - **Cálculo:** 0.40 * 95 + 0.40 * 95 + 0.20 * 90 = 38.0 + 38.0 + 18.0 = **94.0 puntos**.
   - **Resultado esperado:** `decision: 'APROBADO_AUTOMATICO'`, `motivo: 'aprobado'`, `riesgoAltoRechazo: false` (puntaje 94.0 ≥ 90, sin señales bajo mínimo, sin alerta de fraude; puntaje ≥ 60).
2. **Caso 2 (`CASO-MED-002` — Derivación por Señal Bajo Mínimo - Aislando H-05):**
   - **Prestación:** Exámenes de laboratorio de sangre (120.000 CLP).
   - **Evidencia ficticia:** `orden_laboratorio_002.pdf` y `factura_clinica_002.pdf`.
   - **Señales:** Autenticidad documentos = 100; Cruce fuentes = 100; **Coherencia solicitud = 55** (mínimo exigido = 60 `[SUPUESTO del equipo]`); Alerta fraude = Inactiva (false).
   - **Cálculo:** 0.40 * 100 + 0.40 * 100 + 0.20 * 55 = 40.0 + 40.0 + 11.0 = **91.0 puntos**.
   - **Resultado esperado:** `decision: 'DERIVADO_REVISION'`, `motivo: 'senal_bajo_minimo'`, `riesgoAltoRechazo: false` (pese a tener 91 puntos ≥ 90, la señal coherencia [55 < 60] deriva a revisión; puntaje 91 ≥ 60 y solo una señal bajo mínimo, por lo que no activa advertencia de riesgo alto).
3. **Caso 3 (`CASO-MED-003` — Derivación por Precedencia de Fraude - Aislando DEC-E2-06):**
   - **Prestación:** Reembolso de medicamentos de alto costo (280.000 CLP).
   - **Evidencia ficticia:** `boleta_farmacia_adulterada_003.jpg` (manipulación digital de montos simulada por el equipo).
   - **Señales:** Autenticidad documentos = 95; Cruce fuentes = 95; Coherencia solicitud = 90; **Alerta fraude = ACTIVA (true)** (bandera aparte de manipulación documental).
   - **Cálculo:** 0.40 * 95 + 0.40 * 95 + 0.20 * 90 = **94.0 puntos**.
   - **Resultado esperado:** `decision: 'DERIVADO_REVISION'`, `motivo: 'alerta_fraude'`, `riesgoAltoRechazo: false` (la bandera de fraude precede al puntaje de 94; deriva a revisión manual asistida sin rechazo automático; al no tener señales bajo mínimo ni puntaje < 60, no activa riesgoAltoRechazo).
4. **Caso 4 (`CASO-MED-004` — Derivación con Advertencia de Riesgo Alto - Aislando H-08 / DEC-08 / DEC-E2-10):**
   - **Prestación:** Procedimiento ambulatorio (60.000 CLP).
   - **Evidencia ficticia:** `recibo_ambulatorio_004.pdf`.
   - **Señales:** Autenticidad documentos = 40 (mínimo 70); Cruce fuentes = 40 (mínimo 70); Coherencia solicitud = 60 (cumple mínimo 60); Alerta fraude = Inactiva (false).
   - **Cálculo:** 0.40 * 40 + 0.40 * 40 + 0.20 * 60 = 16.0 + 16.0 + 12.0 = **44.0 puntos**.
   - **Resultado esperado:** `decision: 'DERIVADO_REVISION'`, `motivo: 'senal_bajo_minimo'`, `riesgoAltoRechazo: true` (se deriva obligatoriamente sin rechazo automático; activa advertencia destacada *"Riesgo alto de rechazo: decide un operador"* porque cumple ambas condiciones: puntaje 44 < 60 y dos señales bajo mínimo [autenticidad 40 < 70 y cruce 40 < 70]).
   - **Objetivo de verificación (H-08 / DEC-08 / DEC-E2-10):** El test verifica específicamente que ante un caso con puntaje crítico bajo 60 y dos señales bajo mínimo, **el sistema nunca rechaza automáticamente**, sino que deriva con advertencia visual de riesgo alto.
5. **Caso 5 (`CASO-MED-005` — Derivación por Rango Intermedio):**
   - **Prestación:** Consulta médica con especialista (50.000 CLP).
   - **Evidencia ficticia:** `bono_consulta_005.pdf`.
   - **Señales:** Autenticidad documentos = 75; Cruce fuentes = 75; Coherencia solicitud = 75; Alerta fraude = Inactiva (false).
   - **Cálculo:** 0.40 * 75 + 0.40 * 75 + 0.20 * 75 = 30.0 + 30.0 + 15.0 = **75.0 puntos**.
   - **Resultado esperado:** `decision: 'DERIVADO_REVISION'`, `motivo: 'puntaje_bajo_umbral'`, `riesgoAltoRechazo: false` (todas las señales cumplen mínimos [75>70, 75>70, 75>60], puntaje 75 ≥ 60 pero 75 < 90; deriva a revisión sin alerta de riesgo alto).
6. **Caso 6 (`CASO-MED-006` — Derivación con Riesgo Alto por Puntaje Crítico con Una Sola Señal Bajo Mínimo):**
   - **Prestación:** Reembolso de exámenes complejos con documentación ilegible (95.000 CLP).
   - **Evidencia ficticia:** `examen_complejo_006.pdf`.
   - **Señales:** Autenticidad documentos = 0 (mínimo 70); Cruce fuentes = 70 (cumple mínimo 70); Coherencia solicitud = 60 (cumple mínimo 60); Alerta fraude = Inactiva (false).
   - **Cálculo:** 0.40 * 0 + 0.40 * 70 + 0.20 * 60 = 0.0 + 28.0 + 12.0 = **40.0 puntos**.
   - **Resultado esperado:** `decision: 'DERIVADO_REVISION'`, `motivo: 'senal_bajo_minimo'`, `riesgoAltoRechazo: true` (deriva por autenticidad 0 < 70; activa advertencia de riesgo alto estrictamente por puntaje global crítico [40.0 < umbralRiesgoAlto de 60], demostrando que una sola señal bajo mínimo con puntaje < 60 activa la advertencia).
7. **Prueba Unitaria Directa Complementaria (Aislando Regla de Dos Señales Bajo Mínimo con Puntaje Alto):**
   - **Ámbito:** Prueba unitaria en `tests/unit/engine.test.ts` (no requiere caso adicional en `data/`).
   - **Señales:** Autenticidad documentos = 65 (mínimo 70); Cruce fuentes = 65 (mínimo 70); Coherencia solicitud = 100 (cumple mínimo 60); Alerta fraude = Inactiva (false).
   - **Cálculo:** 0.40 * 65 + 0.40 * 65 + 0.20 * 100 = 26.0 + 26.0 + 20.0 = **72.0 puntos**.
   - **Resultado esperado:** `decision: 'DERIVADO_REVISION'`, `motivo: 'senal_bajo_minimo'`, `riesgoAltoRechazo: true`.
   - **Objetivo de verificación:** Aísla de forma independiente la condición de "al menos dos señales bajo su mínimo" (conteo = 2 >= 2), verificando que activa `riesgoAltoRechazo = true` a pesar de que el puntaje global (72.0) supera holgadamente el `umbralRiesgoAlto` (60).

> **Nota técnica y matemática sobre el papel del umbral 60 (`umbralRiesgoAlto`):**  
> Con los umbrales mínimos asumidos (Autenticidad = 70, Cruce = 70, Coherencia = 60) y las ponderaciones vigentes (0.40, 0.40, 0.20), el puntaje mínimo alcanzable cuando ninguna señal está bajo su mínimo es exactamente 68 puntos (0.40 * 70 + 0.40 * 70 + 0.20 * 60 = 28 + 28 + 12 = 68). Por lo tanto, cualquier caso con puntaje < 60 presenta forzosamente al menos una señal bajo su mínimo propio. En virtud de **DEC-E2-10**, el valor 60 no se retira, sino que se consagra operativamente como **`umbralRiesgoAlto`**: no genera rechazo automático (prohibido por DEC-08 / ENT6), sino que activa la bandera informativa `riesgoAltoRechazo: true` para advertir al operador humano en la bandeja de revisión asistida.

---

### 2.e Decisión y Comparación de Funcionalidades Candidatas (DEC-E2-04)
- **Decisión confirmada por el equipo el 12-10-2026:** Se ratifica el par **F5 + F4**.
- La comparación detallada entre F5+F4, F4+F1 y F4+F7 se mantiene como antecedente formal, confirmando que F4+F1 introducía alto riesgo técnico debido a la exclusión deliberada de `RQF-013` (tiempo restante) en la Entrega 1.

---

### 2.f Instalación y Verificación de Spec Kit sobre Antigravity
- **Responsable:** Lester Gonzalez.
- **Ubicación obligatoria de instalación:** En la **raíz del repositorio** (`/home/lester/Documents/LLMtareas/tareas/trabajo-final/proyecto-llm`), NO dentro de `entregable2/`. Antigravity debe abrirse en la raíz para que el agente tenga visibilidad completa de `fases-y-plan-de-trabajo/`, `README.md` y `data/`.
- **Estado de la instalación:** **REALIZADA EXITOSAMENTE el 12-10-2026 (~23:30 CLT)** en la rama `feat/setup-speckit` (commit `18bbb67`).
- **Versión oficial instalada de la CLI:** `1.0.2.dev0`, registrada formalmente en `docs/entregable2/specify-version.txt`.

#### Procedimiento Ejecutado y Verificación
```bash
# 1. Crear y cambiarse a la rama de setup para proteger main
git checkout -b feat/setup-speckit

# 2. Inicializar en la raíz del repositorio vinculando la integración de Antigravity ("agy")
specify init --here --integration agy

# 3. Registrar versión oficial de la herramienta para trazabilidad e informe (6.2)
specify version > docs/entregable2/specify-version.txt

# 4. Verificación de integridad: se constató que README.md y los archivos de E1 no sufrieron modificaciones
git status
```

#### Artefactos y Rutas Verificadas tras la Inicialización
1. **Constitución:** Ubicada exactamente en **`.specify/memory/constitution.md`** (copiada automáticamente a partir de la plantilla `.specify/templates/constitution-template.md`, actualmente en estado inicial pendiente de completar con las DEC del equipo).
2. **Directorio `.specify/`:** Contiene la configuración (`init-options.json`, `integration.json`) y las subcarpetas `.specify/memory/`, `.specify/scripts/bash/`, `.specify/templates/`, `.specify/workflows/` e `.specify/integrations/`.
3. **Skills instaladas en `.agents/skills/` (10 skills operativas):**
   - `/speckit-constitution`: Creación y actualización de la constitución del proyecto.
   - `/speckit-specify`: Creación de la especificación técnica ejecutable.
   - `/speckit-clarify`: Sesión estructurada de clarificación con el cliente.
   - `/speckit-checklist`: Generación de listas de chequeo de calidad.
   - `/speckit-plan`: Planificación técnica, arquitectura y contratos de datos.
   - `/speckit-tasks`: Desglose de tareas atómicas y ordenamiento de dependencias.
   - `/speckit-analyze`: Auditoría no destructiva de consistencia cruzada entre artefactos.
   - `/speckit-implement`: Ejecución de la implementación guiada por tareas y tests.
   - `/speckit-converge`: Evaluación del estado del código contra la spec y adición de tareas pendientes.
   - `/speckit-taskstoissues`: Conversión de tareas a GitHub Issues para seguimiento.
4. **Carpeta de specs y archivo de especificación:** Verificado y alojado en **`specs/001-f5-f4-umbrales-evaluacion/spec.md`** tras la ejecución de `/speckit-specify` y validado en `/speckit-clarify` (el archivo de control `.specify/feature.json` apunta directamente a esta carpeta).

#### Habilidades Adicionales y Gobernanza de Issues
- **Uso de `/speckit-converge`:** Disponible en esta versión para auditar el estado del código contra la spec y generar tareas para trabajo faltante.
- **Uso de `/speckit-taskstoissues`:** Quien ejecute `/speckit-taskstoissues` debe **revisar minuciosamente el borrador de issues antes de aceptar su publicación remota** en GitHub. El equipo decidirá si se utiliza para la gestión del sprint; queda `[POR VERIFICAR]` qué permisos de API o token de GitHub (`GITHUB_TOKEN` o autenticación CLI `gh`) requiere en el entorno local.

> ⚠️ **ADVERTENCIA DE SEGURIDAD CRÍTICA DE SPEC KIT:**  
> El directorio `.agents/` puede almacenar datos temporales, cachés o credenciales locales del entorno de desarrollo. Por directriz de seguridad estricta, **únicamente debe versionarse en git el subdirectorio `.agents/skills/`** (y sus archivos `SKILL.md`). El resto de archivos dentro de `.agents/` no debe incluirse en commits.

- **Principio no negociable a registrar en la constitución:** Los artefactos de la Entrega 1 (`fases-y-plan-de-trabajo/`) son de solo lectura histórica; ningún comando de Spec Kit puede modificarlos directamente. Cualquier cambio o resolución se formaliza mediante una nueva ficha DEC en `docs/entregable2/decisiones/`.
- **Principio rector del motor de decisión en la constitución (§2.f / §3.1 / DEC-08 / DEC-E2-10):** *"El sistema nunca rechaza automáticamente un caso; el máximo efecto es derivarlo, con advertencia de riesgo alto cuando corresponda"*.

---

### 2.g Ruta de Onboarding Técnico para Jorge Alvarez
- **Responsable:** Jorge Alvarez (tutelado por Lester Gonzalez y Rodrigo Guerrero).
- **Tiempo estimado:** 4 horas y 30 minutos (ejecutado durante la tarde del lunes 12 de octubre).
- **Ruta:** Dominio MIRA (45 min) → Caso de uso UC-01 (60 min) → Requisitos F5/F4 y pruebas PF-015/018/020/021/033 (60 min) → DEC-01, DEC-06, DEC-08, DEC-E2-06, DEC-E2-10 (45 min) → Cuestionario de validación con Rodrigo y Lester (60 min).

---

## 3. Flujo SDD Fase por Fase

### 3.1 Matriz Operativa de Fases SDD
| Fase | Comando / Skill | Conductor | Insumos desde Entrega 1 | Artefacto Generado y Ruta | Condición Específica de la Pauta | 👤 Revisión Humana Obligatoria | Criterio Objetivo de Término |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **0. Constitución** | `/speckit-constitution` | Humano (Lester ejecuta, Angel custodia) | `DEC-01`, `DEC-05`, `DEC-06`, `DEC-08`, `DEC-12`, `DEC-14`, `DEC-E2-06`, `DEC-E2-10`. | `.specify/memory/constitution.md` (ruta verificada; ratificada v1.0.0 el 14-10-2026) | Incorporar como principios las DEC de E1 que aplican. Prohibir mock de datos en producción y tests circulares. Artefactos E1 de solo lectura. Registrar principio rector: *"El sistema nunca rechaza automáticamente un caso; el máximo efecto es derivarlo, con advertencia de riesgo alto cuando corresponda"*. | 👤 Revisión del equipo completo. | Archivo validado y commiteado en rama de setup. |
| **1. Especificación** | `/speckit-specify` | Humano (el equipo redacta) | `UC-01`, `RQF-040 [fase5-lester]`, `RQF-041 [fase5-lester]`, `RQF-020 [fase5-lester]`, `RQF-023 [fase5-lester]`, `RQF-039 [fase5-lester]`, `data/casos_prueba.json`. | `specs/001-f5-f4-umbrales-evaluacion/spec.md` (ruta canónica verificada; `.specify/feature.json` apunta a ella) | Una sola spec consolidada para F5 y F4 (DEC-E2-10(c)). Requisitos citan archivo fuente (`RQF-xxx [fase5-lester]`) y RQF-Bxx de referencia cruzada. Se fija en la spec que el umbral de aprobación automática es ≥ 90 (DEC-01 / ENT4 [00:11:06]) y umbral de riesgo alto es 60 (DEC-E2-10). Cero mención a tecnologías. | 👤 Validación por Rodrigo Guerrero (representante del cliente en la E2). | Spec con criterios `AC-1` a `AC-6` validada en `clarify`. |
| **2. Aclaración** | `/speckit-clarify` | Humano (Rodrigo Guerrero (representante del cliente en la E2) responde como cliente) | Entrevistas ENT1..ENT9, `inconsistencias-revisadas.md`, supuestos de señales. | `specs/001-f5-f4-umbrales-evaluacion/spec.md` validado + `docs/entregable2/clarificaciones.md` (Compuerta 2: aprobada por el cliente y revisada por Lester; pendiente revisión de Jorge y Angel y confirmación de §7.1(f)) | Toda duda se responde con fuente de E1 o se declara y registra como supuesto del equipo. Rodrigo ratificó mínimos 70/70/60 y pesos 0,40/0,40/0,20 como `[SUPUESTO del equipo]`, selector de 5 identidades fijas y regla `umbralAprobacion > umbralRiesgoAlto`. | 👤 Rodrigo responde; Jorge y Lester auditan que no asuma soluciones técnicas. | Cero [NEEDS CLARIFICATION]; Compuerta 2 completa tras revisión de Jorge y Angel. |
| **3. Plan Técnico** | `/speckit-plan` | Agente propone, Humano corrige | `spec.md`, `modelo_dominio.json`, `RQNF-002 [fase5-lester]` / `RQNF-003 [final-final]` (reproducibilidad), `DEC-E2-05`, `DEC-E2-10`. | `plan.md`, `data-model.md`, `research.md` | Declara qué RQNF atiende (reproducibilidad H-14) y cómo se verifica. Define contrato TypeScript `src/shared/types.ts` con `umbralRiesgoAlto` y `riesgoAltoRechazo`. | 👤 **COMPUERTA CRÍTICA:** Revisión exhaustiva de arquitectura de datos y contratos antes de tareas. | Plan aprobado por Rodrigo y Jorge; contrato F5↔F4 formalizado. |
| **4. Tareas** | `/speckit-tasks` | Agente genera, Humano refina | `plan.md`, `spec.md`, `backlog.md` (`HU-xxx`). | `tasks.md` | Cada tarea referencia al menos un `RQF-xxx` y un `AC-N`. Tareas etiquetadas como `[F5]` o `[F4]` (DEC-E2-10(c)). Tareas atómicas de <2 horas. | 👤 Lester y Rodrigo revisan orden de dependencias. | `tasks.md` ordenado por fases lógicas. |
| **5. Análisis Consistencia** | `/speckit-analyze` (verificada en `.agents/skills/speckit-analyze`) | Agente audita, Humano evalúa | `.specify/memory/constitution.md`, `spec.md`, `plan.md`, `tasks.md`. | `docs/entregable2/reporte-analisis-consistencia.md` | Reporte formal de coherencia entre artefactos. Skills complementarias disponibles: `/speckit-converge` (auditoría de cobertura) y `/speckit-taskstoissues` (conversión opcional a issues previa revisión). | 👤 Angel y Lester revisan discrepancias y corrigen spec o tareas. | Reporte sin inconsistencias críticas. |
| **6. Implementación** | `/speckit-implement` | Agente propone código, Humano prueba y commitea | `tasks.md`, `plan.md`, suites de pruebas. | `src/` (backend, frontend) y `tests/` | Un commit por tarea. Dos estados de salida (`APROBADO_AUTOMATICO` / `DERIVADO_REVISION`). Advertencia visual de riesgo alto sin usar palabra "rechazado". Comentarios de trazabilidad obligatorios. | 👤 **COMPUERTA DEL DIFF:** El humano corre tests, revisa diff y commitea. | 100% de tests unitarios, E2E y reproducibilidad pasando (`PASS`). |

- **Regla de precedencia estricta del orden de evaluación (F4):**
  1. Si `alertaFraudeActiva === true` → `decision: 'DERIVADO_REVISION'`, `motivo: 'alerta_fraude'` (máxima precedencia, MIRA §3 / DEC-E2-06).
  2. Si alguna señal individual < mínimo propio → `decision: 'DERIVADO_REVISION'`, `motivo: 'senal_bajo_minimo'` (precedencia sobre puntaje global, H-05 / D-07).
  3. Si puntaje global ≥ umbralAprobacion (≥ 90) sin señales bajo mínimo ni alerta de fraude → `decision: 'APROBADO_AUTOMATICO'`, `motivo: 'aprobado'` (H-01 / DEC-01).
  4. En cualquier otro caso (puntaje global < umbralAprobacion sin fraude ni señales bajo mínimo) → `decision: 'DERIVADO_REVISION'`, `motivo: 'puntaje_bajo_umbral'`.

- **Regla independiente de cálculo de riesgo alto de rechazo (`riesgoAltoRechazo: boolean`):**
  - Se evalúa con posterioridad a las reglas de decisión anteriores y **no altera el resultado** (`decision`), preservando el principio constitucional de no rechazar automáticamente.
  - `riesgoAltoRechazo = (cantidad de señales bajo mínimo >= 2) || (scoreGlobal < umbralRiesgoAlto)`.
  - El parámetro `umbralRiesgoAlto` tiene valor por defecto **60** (configurable en F5 y versionado).
  - En la vista de resultado de F4: si `riesgoAltoRechazo === true`, se despliega una advertencia visual destacada (*"Riesgo alto de rechazo: decide un operador"*). Por mandato normativo y diseño ético (ENT6 [00:04:06]), **nunca se utiliza la palabra "rechazado"** para una decisión emanada del sistema.

### 3.2 Pregunta Crítica de la Fase de Aclaración (`clarify`) — Resuelta por el Equipo (DEC-E2-10 y Sesión 14-10-2026)
- **Pregunta:** *¿Qué papel operativo cumple el umbral de 60 puntos ahora que la decisión `DEC-08` / `H-08` eliminó definitivamente el rechazo automático bajo 60?*
- **Análisis previo del equipo:** Con las ponderaciones asumidas (0.40, 0.40, 0.20) y los mínimos individuales (70, 70, 60), el puntaje mínimo alcanzable sin que ninguna señal caiga bajo su mínimo es de 68 puntos (0.40 * 70 + 0.40 * 70 + 0.20 * 60 = 28 + 28 + 12 = 68). Por lo tanto, cualquier caso con puntaje inferior a 60 presenta forzosamente al menos una señal bajo su mínimo propio. Dado que por la regla de precedencia estricta el motivo es siempre `'senal_bajo_minimo'` y que por DEC-08 todo caso derivado va a revisión asistida (sin rechazo automático), el valor 60 no operaba como corte de decisión.
- **Resolución confirmada en `/speckit-clarify` (Pregunta 3, 14-10-2026):** Se mantiene formalmente como **`umbralRiesgoAlto`** (60 por defecto en F5 y versionado) exigiendo obligatoriamente en F5 la validación estricta de consistencia `umbralAprobacion > umbralRiesgoAlto` (90 > 60), preservando el rango de derivación ordinaria (60 a 89.9 puntos). En F4, el caso siempre se deriva (`decision: 'DERIVADO_REVISION'`) con cero rechazos automáticos (`DEC-08`, `DEC-E2-10(b)`). La advertencia `riesgoAltoRechazo: true` se activa si se cumple al menos una de dos condiciones: dos o más señales bajo mínimo O `scoreGlobal < umbralRiesgoAlto`. El motivo de derivación lo fija el orden de evaluación de RN-04: con los valores por defecto (mínimos 70/70/60 y pesos 0.40/0.40/0.20), un puntaje < 60 implica forzosamente al menos una señal bajo mínimo y por ende `motivo: 'senal_bajo_minimo'`, salvo que haya alerta de fraude, que tiene precedencia (`alerta_fraude`); con otra configuración de parámetros puede ser `motivo: 'puntaje_bajo_umbral'`. Cierra formalmente la duda y queda consignada en `docs/entregable2/clarificaciones.md`.

### 3.3 Registro de Ejecución Real de la Fase de Implementación (`/speckit-implement`)

La fase de implementación para el backend de MIRA fue ejecutada siguiendo estrictamente las directivas de SDD, la especificación consolidada y la constitución:

1. **Estrategia de Ramificación:**  
   Se creó y utilizó la rama técnica combinada `feat/backend-frontend` a partir de la rama `feat/frontend-ui`, asegurando que el backend se implemente en consonancia directa con las vistas React, el proxy inverso y los contratos formalizados.
2. **Alcance y Ejecución por Fases (Fases 0 a 6):**  
   Rodrigo Guerrero completó las **23 tareas de backend** bajo el ciclo TDD (pruebas rojas fallidas primero, seguidas de la implementación en verde):
   - **Fase 0 (Infraestructura Base):** `T001` (dependencias y scripts), `T004` (DDL SQLite, triggers inmutables y claves foráneas activas con PRAGMA), `T005` (catálogo `data/casos_prueba.json` y script de siembra idempotente v1), `T006` (servidor Express modular desacoplado de listen con middlewares), `T031`/`T034` (sesión simulada con cookie `mira_session` y 5 identidades fijas), `T051` (repositorio `umbrales-repo.ts`).
   - **Fase 1 (Motor F4 - US1):** `T008`/`T009` (pruebas unitarias e integración de fraude y señal bajo mínimo), `T010`/`T011` (motor `evaluacion-engine.ts` y controlador/rutas con inserción inmutable en auditoría).
   - **Fase 2 (Aprobación Automática - US2 / MVP):** `T014`/`T015` (pruebas unitarias e integración de cálculo ponderado), `T016`/`T017` (lógica de aprobación `score >= 90` y endpoint `GET /api/evaluacion/casos`).
   - **Fase 3 (Advertencia de Riesgo Alto - US3):** `T020`/`T021` (pruebas de `riesgoAltoRechazo: true` y garantía de cero rechazo), `T022` (cálculo de riesgo alto con salidas exclusivas `APROBADO_AUTOMATICO` / `DERIVADO_REVISION`).
   - **Fase 4 (Gestión de Umbrales en Borrador - US4):** `T024`/`T025` (pruebas de validación matemática y gestión de borradores), `T026`/`T027` (servicio y endpoints de F5 con índice único de 1 borrador por flujo).
   - **Fase 5 (Doble Control y Resolución Formal - US5):** `T032`/`T033` (pruebas de segregación de roles y desestimación), `T035`/`T036` (resolución formal con bloqueo estricto de auto-aprobación `aprobador !== proponente` retornando 403 Forbidden).
   - **Fase 6 (Historial y Reproducibilidad - US6):** `T039` (pruebas de inmutabilidad en triggers SQLite y claves foráneas activas), `T041` (historial cronológico de versiones) y `T042` (reevaluación histórica determinista).
3. **Regla de Commits Atómicos (Principio IX):**  
   Cada tarea se verificó en verde con la suite automatizada y se commiteó individualmente en modo imperativo con el formato canónico `[TASK-xxx] Descripción`.
4. **Intervenciones Humanas Aisladas (`[HUMAN-FIX]`):**  
   - `86c0bad`: Aislamiento del estado de base de datos en tests de repositorio y API limpiando versiones $> 1$ en `beforeEach`/`afterAll`.
   - `d63b5e8`: Actualización de `tsconfig.json` (`moduleResolution: "bundler"`, `jsx: "react-jsx"`) y tipado de cookies en `session-api.test.ts`, erradicando errores en el IDE y logrando `npx tsc --noEmit` en código 0 sin errores.
5. **Artefacto Operativo de Pruebas:**  
   Se generó la guía operativa y de procedimientos [docs/entregable2/guia_Procedimiento_MiraWeb.md](guia_Procedimiento_MiraWeb.md) detallando las pruebas de consola, navegación interactiva y llamadas a la API REST.
6. **Estado de Pruebas Automatizadas:**  
   **49 pruebas pasando al 100%** en Vitest distribuidas en 7 suites de prueba sin regresiones ni alertas de TypeScript.

---

## 4. 👤 Decisiones de Diseño Durante la Implementación

### 4.1 Catálogo de Decisiones de Diseño y Responsabilidades
| # | Decisión Técnica | Opciones Consideradas | Hallazgo / Requisito Vinculado | Quién Propone | 👤 Quién Decide |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-01** | **Estructura de Persistencia (SQLite)** | (a) Monolítico sin tipar.<br>(b) Relacional con tablas `flujos`, `umbrales`, `casos`, `senales` y `auditoria_cambios`. | `modelo_dominio.json`, `RQF-039 [fase5-lester]`, `RQNF-008`. | Rodrigo (Backend) | 👤 Rodrigo + Jorge |
| **D-02** | **Simulación del Motor y Señales** | (a) Generador pseudo-aleatorio.<br>(b) Carga estática determinista desde `data/casos_prueba.json` respaldada en SQLite. | §4.3 pauta (motor no se construye, casos fijos). | Lester (QA) | 👤 Rodrigo Guerrero (representante del cliente en la E2) |
| **D-03** | **Versionado de Umbrales (F5)** | (a) Sobrescritura directa.<br>(b) Histórico inmutable con estados `BORRADOR`, `APROBADO` y `DESESTIMADO` (clarify P2), timestamp y usuario. | `RQF-039 [fase5-lester]`, `DEC-01`. | Rodrigo (Backend) | 👤 Angel (audita trazabilidad) |
| **D-04** | **Autenticación Simulada (H-06) y Flujo de Aprobación de Umbrales** | (a) Sin login.<br>(b) Selector desplegable de rol y usuario activo. **Ratificado en `clarify` (Pregunta 2, 14-10-2026):** Se fijaron exactamente las 5 identidades preconfiguradas en la barra superior (`Diseñador 1`, `Diseñador 2`, `Administrador 1`, `Administrador 2`, `Operador 1`), cubriendo armónicamente MIRA §2.13, ENT6 [00:21:16] y la prueba `PF-033` (quien propone nunca puede auto-aprobar). Se establece la regla de máximo un único cambio en estado `BORRADOR` activo por flujo a la vez, con acciones de *Aprobar* (pasa a `APROBADO` como nueva versión inmutable según D-03) o *Desestimar* (descarta la propuesta) por un Administrador independiente, con rastro inalterable de auditoría (D-05). | `H-06`, MIRA §2.13, `PF-033`, `RQF-039 [fase5-lester]`, ENT6 [00:21:16], DEC-E2-10. | Jorge (Frontend) | 👤 Rodrigo Guerrero (representante del cliente en la E2) (CERRADA) |
| **D-05** | **Inmutabilidad de Auditoría** | (a) Archivo plano `.txt`.<br>(b) Tabla SQLite `rastro_auditoria` append-only bloqueada a `UPDATE`/`DELETE` con triggers. | `H-12`, `RQNF-008`. | Rodrigo (Backend) | 👤 Lester (QA) |
| **D-06** | **Estrategia de Pruebas E2E y Reproducibilidad** | (a) Pruebas manuales en video.<br>(b) Suite Playwright para E2E y test de reproducibilidad determinista al 100% sobre versiones guardadas (H-14). | §6.5 pauta, `H-14`, `DEC-14`. | Lester (QA) | 👤 Lester |
| **D-07** | **Mínimos por Señal (H-05)** | Mínimos ratificados formalmente en `clarify` (Pregunta 1, 14-10-2026) como `[SUPUESTO del equipo]`: Autenticidad = 70, Cruce de fuentes = 70, Coherencia = 60. MIRA §2.6 señala que están pendientes de definir con área de riesgo y ENT3 [00:21:47] (VERIFICADO; fuente: MIRA docx, Sebastián: *"mínimos por señal… aunque nadie ha definido cuáles son"*). Son modificables en F5 bajo el flujo Diseñador propone / Administrador aprueba y quedan versionados. Regla de validación: cada mínimo debe estar entre 0 y 100 inclusive (0 <= x <= 100). | `H-05`, MIRA §2.6, ENT3 [00:21:47] (VERIFICADO), DEC-E2-10, DEC-05. | Jorge / Rodrigo | 👤 Rodrigo Guerrero (representante del cliente en la E2) (CERRADA) |
| **D-08** | **Fórmula de Agregación y Ponderaciones del Puntaje** | Promedio ponderado determinista ratificado en `clarify` (Pregunta 1, 14-10-2026) como `[SUPUESTO del equipo]`: 0.40 * Autenticidad + 0.40 * CruceFuentes + 0.20 * Coherencia (suma = 1.00). MIRA §2.6 no provee fórmula explícita; la fórmula y los pesos son `[SUPUESTO del equipo]` y no provienen de ningún RQF. Modificables en F5 y versionados bajo el flujo Diseñador propone / Administrador aprueba. Reglas de validación: la suma de los tres pesos debe ser exactamente 1.00 (100%), y cada peso individual debe estar entre 0.00 y 1.00. | `RQF-043 [final-final]` (puntaje de confianza 0–100 con desglose de señales; sin equivalente definido en el archivo rector fase5-lester, donde RQF-043 es otro requisito), MIRA §2.6, F4, DEC-E2-10. La fórmula y los pesos son `[SUPUESTO del equipo]` y no provienen de ningún RQF. | Rodrigo (Backend) | 👤 Rodrigo + Jorge (CERRADA) |
| **D-09** | **Alcance de la Especificación en Spec Kit** | (a) Una sola spec consolidada para F5 y F4.<br>(b) Dos specs separadas.<br>**Resolución (DEC-E2-10(c)):** Se aprueba la opción (a): **una sola spec consolidada para F5 y F4**, con las tareas en `tasks.md` etiquetadas explícitamente como `[F5]` o `[F4]` para mantener trazabilidad y control de avance. Cierra D-09. | Gestión de cuota de Antigravity, acoplamiento de contratos y DEC-E2-10. | Angel (Informe) | 👤 Rodrigo + Lester (CERRADA) |

### 4.2 Protocolo para Decisiones No Declaradas del Agente
Toda propuesta del agente que agregue campos, rutas o reglas no solicitadas en `spec.md` será vetada de inmediato en la inspección del diff. Si afecta la lógica de negocio, se eleva a Rodrigo y se registra en `docs/entregable2/decisiones-agente-rechazadas.md`.

---

## 5. División del Trabajo entre los 4 Integrantes

### 5.1 Frentes de Responsabilidad y Dueños de Artefactos
- **Frente 1: Backend y Motor de Reglas (Rodrigo Guerrero):** Código en `src/backend/`, lógica de F5/F4, Representante del Cliente en fases SDD y aceptación.
- **Frente 2: Frontend y Experiencia de Usuario (Jorge Alvarez):** Código en `src/frontend/`, componentes React de F5/F4 en español, capturas de interfaz.
- **Frente 3: Testing y Aseguramiento de Calidad (Lester Gonzalez):** Setup inicial de Spec Kit en raíz (realizado 12-10-2026 v1.0.2.dev0 en rama `feat/setup-speckit`), custodia técnica de `.specify/` y `.agents/skills/`, tests en `tests/` (Vitest, Playwright, reproducibilidad determinista), análisis de consistencia.
- **Frente 4: Informe, Trazabilidad y Gobernanza SDD (Angel Salgado):** Informe PDF (6.1 a 6.8), matriz de trazabilidad, log de prompts, bitácora DEC, custodia de `.specify/memory/constitution.md`, diapositivas PPT.

### 5.2 Contrato de Datos Temprano F5 ↔ F4 (`src/shared/types.ts`)
Se congela tras aprobar el plan técnico (commit [PLAN], Compuerta 3); el contrato vigente es data-model.md §4:

```typescript
// src/shared/types.ts - Contrato de Interfaces F5 <-> F4
export interface UmbralesFlujo {
  idFlujo: string;
  version: number;
  umbralAprobacion: number;    // Por defecto 90 (DEC-01: umbral >= 90)
  umbralRiesgoAlto: number;    // Por defecto 60 (DEC-E2-10: activa advertencia riesgoAltoRechazo si score < umbralRiesgoAlto)
  minimoAutenticidad: number;  // H-05 / MIRA §2.6 (supuesto equipo: 70) [SUPUESTO del equipo]
  minimoCruceFuentes: number;  // H-05 / MIRA §2.6 (supuesto equipo: 70) [SUPUESTO del equipo]
  minimoCoherencia: number;    // H-05 / MIRA §2.6 (supuesto equipo: 60) [SUPUESTO del equipo]
  pesoAutenticidad: number;    // D-08 (0.40) [SUPUESTO del equipo]
  pesoCruceFuentes: number;    // D-08 (0.40) [SUPUESTO del equipo]
  pesoCoherencia: number;      // D-08 (0.20) [SUPUESTO del equipo]
  proponente: string;          // Diseñador que crea la propuesta (D-04, PF-033)
  aprobador?: string;          // Administrador independiente que aprueba/desestima (D-04, PF-033)
  fechaPropuesta: string;      // ISO 8601 UTC
  fechaResolucion?: string;    // ISO 8601 UTC
  estado: 'BORRADOR' | 'APROBADO' | 'DESESTIMADO'; // 3 estados de ciclo de vida (D-03, D-04)
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
  decision: 'APROBADO_AUTOMATICO' | 'DERIVADO_REVISION'; // Únicamente dos estados (DEC-08 / DEC-E2-10)
  // Precedencia estricta de motivo: alerta_fraude > senal_bajo_minimo > puntaje_bajo_umbral (o 'aprobado' si >= 90)
  motivo: 'aprobado' | 'alerta_fraude' | 'senal_bajo_minimo' | 'puntaje_bajo_umbral';
  riesgoAltoRechazo: boolean; // DEC-E2-10: true si >= 2 señales bajo mínimo O scoreGlobal < umbralRiesgoAlto (no cambia decision)
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
- **Lester:** Ejecuta `specify init` en raíz (completado el 12-10-2026 v1.0.2.dev0), `/speckit-constitution` (en `.specify/memory/constitution.md`) y el análisis de consistencia (`/speckit-analyze`).
- **Rodrigo:** Ejecuta sesiones de generación backend.
- **Jorge:** Ejecuta sesiones de generación frontend.
- **Angel:** Custodia la gobernanza de `.specify/memory/constitution.md`, ejecuta prompts de auditoría documental y comparativa E1.

### 5.5 Matriz RACI
| Actividad / Entregable | Rodrigo (Backend / Cliente) | Jorge (Frontend) | Lester (QA / Testing) | Angel (Informe / Trazab.) |
| :--- | :---: | :---: | :---: | :---: |
| Formalizar DEC-01..16 y DEC-E2-01..06 | **A** | I | C | **R** |
| Exportar `backlog.md` desde GitHub Projects | I | I | **R / A** | C |
| Preparar datos de prueba ficticios | **R / A** | C | C | I |
| Onboarding técnico de Jorge | C | **R / A** | C | I |
| Inicialización Spec Kit en raíz (`agy` v1.0.2.dev0) | I | I | **R / A** (completado) | I |
| Redacción y custodia de `.specify/memory/constitution.md` | C | C | **R** (ejecuta) | **A** (custodia) |
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

Cronograma operativo recalculado a partir de hoy **martes 13 de octubre de 2026** (fecha de confirmación de acuerdos de diseño):

```
Lun 12 (~23:30): Setup Spec Kit en raíz REALIZADO (v1.0.2.dev0 en feat/setup-speckit)
Mar 13:          Acuerdos DEC-E2-10, Constitución, Specify F5+F4 (spec única), Contrato Types, Clarify
Mié 14 a Vie 16: Sprint de Implementación (Miércoles a Viernes): Backend, Frontend, Tests, Integración y E2E
Sáb 17:          Prueba Usabilidad con Integrante de Otro Equipo y Sesión Formal de Aceptación con Rodrigo Guerrero (representante del cliente en la E2)
Dom 18:          CONGELAMIENTO TOTAL (18:00 CLT), Tag v2.0, Check README (<15m), Cierre Informe PDF y PPT
Lun 19:          Ensayo Demo (v2.0), Entrega 14:00 CLT, Exposición Oral [POR CONFIRMAR en clase]
```

### 6.1 Detalle Diario de Tareas
- **Lunes 12 de Octubre (Día 0 — Setup Inicial Realizado, ~23:30 CLT):**
  - [x] **Setup Spec Kit en raíz:** Lester inicializó Spec Kit con `specify init --here --integration agy` en la rama `feat/setup-speckit` (CLI v1.0.2.dev0 registrada en `docs/entregable2/specify-version.txt`, commit `18bbb67`). Se verificó que `README.md` y archivos de E1 no sufrieron modificaciones.
  - [x] Jorge avanza en la lectura guiada de onboarding (4,5 hrs).
- **Martes 13 a Miércoles 14 de Octubre (Día 1 — Acuerdos de Diseño, Constitución, Especificación y Clarificación):**
  - [x] **Alineación del equipo y acuerdos de diseño:** Confirmación unánime de `DEC-E2-02`, `DEC-E2-07`, `DEC-E2-08`, `DEC-E2-09` y `DEC-E2-10`. Se formaliza que no se retira el umbral de 60 sino que opera como `umbralRiesgoAlto` activando `riesgoAltoRechazo: boolean` sin rechazo automático (DEC-08).
  - [x] **Ejecución de `/speckit-constitution`:** Lester completó `.specify/memory/constitution.md` incorporando los principios rectores de E1 y el mandato: *"El sistema nunca rechaza automáticamente un caso; el máximo efecto es derivarlo, con advertencia de riesgo alto cuando corresponda"*.
  - [x] **Redacción de `/speckit-specify` para F5 y F4:** Una sola spec consolidada (DEC-E2-10(c)) con los casos de prueba de gastos médicos generada en `specs/001-f5-f4-umbrales-evaluacion/spec.md`.
  - [x] Rodrigo y Jorge congelan el contrato de interfaces preliminar con `umbralRiesgoAlto` y `riesgoAltoRechazo` en `src/shared/types.ts`: se congela tras aprobar el plan (commit [PLAN], Compuerta 3).
  - [x] **Ejecución y cierre de `/speckit-clarify`:** Rodrigo Guerrero (representante del cliente en la E2) ratificó formalmente los supuestos de mínimos 70/70/60, pesos 0,40/0,40/0,20, selector de 5 identidades fijas y regla `umbralAprobacion > umbralRiesgoAlto`, documentados en `docs/entregable2/clarificaciones.md` (Compuerta 2: aprobada por el cliente y revisada por Lester; pendiente revisión de Jorge y Angel y confirmación de §7.1(f)).
  - [ ] Angel y Lester avanzan en la redacción de fichas DEC y exportación de `docs/entregable2/backlog.md`.
- **Miércoles 14 a Viernes 16 de Octubre (Días 2 a 4 — Sprint de Implementación de Miércoles a Viernes):**
  - **Miércoles 14 de Octubre (Día 2 — Plan Técnico, Tareas y Arranque):**
    - [x] Ejecutar `/speckit-plan` (arquitectura SQLite, Express, React, declaración de reproducibilidad).
    - [x] 👤 **Revisión humana del plan técnico (Compuerta Crítica):** Aprobada en PR #16 por Rodrigo y Jorge.
    - [x] Ejecutar `/speckit-tasks` (tareas etiquetadas `[F5]` y `[F4]`) y auditoría de consistencia con `/speckit-analyze`.
    - [x] Arranque de código: Rodrigo inicializa base de datos SQLite y endpoints base; Jorge estructura layout de componentes React.
  - **Jueves 15 de Octubre (Día 3 — Implementación Núcleo y Tests Unitarios):**
    - [x] Rodrigo implementa lógica de motor determinista de F4 (precedencia estricta de motivo y cálculo de `riesgoAltoRechazo`) y CRUD de umbrales F5 con versionado inmutable (Fases 0 a 6 completadas).
    - [x] Jorge implementa pantallas React en español: configuración de umbrales con flujo Diseñador propone / Administrador aprueba (F5) y evaluación con advertencia visual de riesgo alto sin usar palabra "rechazado" (F4).
    - [x] Lester y Rodrigo implementan tests unitarios e integración en Vitest: Casos 1 a 6, fraude, mínimos y doble control (49 tests PASS).
    - [ ] Angel inicia redacción de secciones 6.2 y 6.3 del informe.
  - **Viernes 16 de Octubre (Día 4 — Integración, E2E y Prueba Extra-funcional Medible):**
    - [x] Conectar frontend con backend en rama combinada `feat/backend-frontend`. Evaluar la suite de casos de prueba en la interfaz web de punta a punta.
    - [ ] Lester y Jorge ejecutan suite Playwright para recorrido E2E.
    - [ ] **Lester ejecuta la prueba extra-funcional medible (H-14):** Test automatizado que reevalúa casos históricos contra versiones de umbrales guardadas, verificando 100% de reproducibilidad determinista.
    - [ ] Angel avanza secciones 6.4 y 6.5 del informe.
- **Sábado 17 de Octubre (Día 5 — Prueba de Usabilidad, Sesión de Aceptación con Cliente y Redacción Central):**
  - [ ] **Prueba de usabilidad con integrante de otro equipo:** Evaluación de usabilidad de la interfaz F5+F4 por un evaluador externo independiente; registro formal en `docs/entregable2/usabilidad.md`.
  - [ ] 👤 **Sesión formal de aceptación con el cliente:** Rodrigo Guerrero (representante del cliente en la E2) evalúa el software integrado contra los criterios `AC-1` a `AC-6` en presencia de Lester y Jorge como observadores (acta firmada en `docs/entregable2/sesion-aceptacion.md`).
  - [ ] Angel redacta sección 6.6 (Comparativa con E1: tablas 6.6-A y 6.6-B, indicadores TPR, TIH, IRF) y sección 6.7 (Discusión crítica).
- **Domingo 18 de Octubre (Día 6 — Congelamiento, Tag `v2.0` y Cierre de Documentación):**
  - [ ] **18:00 CLT: CONGELAMIENTO TOTAL DE CÓDIGO (Code Freeze).**
  - [ ] Prueba de clonación en máquina limpia: levantar aplicación desde `README.md` en menos de 15 minutos (requisito crítico de C4).
  - [ ] Subir tag oficial: `git tag -a v2.0 -m "Entrega 2 MIRA Oficial" && git push origin v2.0`.
  - [ ] Redactar secciones 6.1 (Resumen ejecutivo) y 6.8 (Conclusiones). Compilar PDF final dentro del límite de 11 planas A4.
  - [ ] Diseñar diapositivas PPT para la presentación oral.
- **Lunes 19 de Octubre (Día 7 — Ensayo, Entrega y Exposición):**
  - [ ] 09:00–11:00 CLT: Ensayo cronometrado de la presentación (15 min) y demo corriendo sobre tag `v2.0` con participación de los 4 integrantes.
  - [ ] 12:00 CLT: Subir informe PDF y diapositivas PPT a la plataforma.
  - [ ] **14:00 CLT: CIERRE DEFINITIVO DE ENTREGA.**
  - [ ] Exposición oral y demo en vivo: `[POR CONFIRMAR en clase]` (fecha y hora exacta).

### 6.2 Plan de Contingencia y Política de Recorte Priorizado
Dado que la implementación está concentrada de miércoles a viernes y que el sábado 17 de octubre está fijado para la prueba de usabilidad externa y la sesión de aceptación con Rodrigo Guerrero (representante del cliente en la E2), las compuertas del fin de semana son inamovibles. Si se presentan atrasos durante el sprint de implementación (miércoles a viernes):
1. **Recorte 1:** Simplificar estilos visuales a CSS funcional limpio sin animaciones accesorias ni micro-interacciones complejas.
2. **Recorte 2:** Reducir la suite E2E a exactamente 1 prueba principal en Playwright (mínimo exigido por la pauta: flujo continuo de modificar umbral en F5 y evaluar caso derivado en F4).
- **LO QUE NUNCA SE PUEDE RECORTAR:**
  - La conexión funcional real entre F5 y F4 con persistencia en base de datos SQLite.
  - La implementación completa de miércoles a viernes que habilita las compuertas del sábado 17: la prueba de usabilidad con un integrante de otro equipo y la sesión formal de aceptación con Rodrigo Guerrero (representante del cliente en la E2).
  - Cumplimiento del `README.md` ejecutable en < 15 minutos en máquina limpia (si falla, la nota de C4 se topa en 3.0 máx).
  - Los casos de prueba ficticios de gastos médicos (Casos 1 al 6 y prueba directa de dos señales bajo mínimo).
  - La prueba extra-funcional medible de reproducibilidad determinista al 100% sobre versiones guardadas (H-14).
  - El límite de extensión de 11 planas A4 para el cuerpo del informe escrito PDF más anexos.

---

## 7. Sistema de Documentación para el Informe

### 7.1 Estructura de Carpetas en el Repositorio
```
proyecto-llm/
├── .agents/
│   └── skills/                       # 10 skills de Spec Kit (solo se versiona skills/)
├── .specify/                         # Configuración, scripts, templates y workflows
│   ├── memory/
│   │   └── constitution.md           # Principios no negociables (verificado en .specify/memory/)
│   ├── scripts/bash/                 # Scripts auxiliares de inicialización y plantillas
│   └── templates/                    # Plantillas oficiales (constitution, spec, plan, tasks)
├── specs/                            # Carpeta de specs: specs/001-f5-f4-umbrales-evaluacion/spec.md (verificada y validada en clarify)
├── docs/entregable2/
│   ├── specify-version.txt           # Registro oficial CLI v1.0.2.dev0 (12-10-2026)
│   ├── equivalencias-requisitos.md   # Mapeo de IDs
│   ├── backlog.md                    # Historias HU-xxx exportadas
│   ├── clarificaciones.md            # Q&A formal con Representante del Cliente
│   ├── reporte-analisis-consistencia.md # Auditoría de coherencia
│   ├── matriz-trazabilidad.md        # RQF -> AC -> Task -> Commit -> Test
│   ├── log-prompts.md                # Registro de interacciones con el agente
│   ├── decisiones/                   # Fichas DEC-01 a DEC-16 y DEC-E2-xx
│   ├── sesion-aceptacion.md          # Acta de aceptación con Rodrigo Guerrero (representante del cliente en la E2)
│   └── usabilidad.md                 # Registro de prueba con evaluador externo
├── data/
│   ├── casos_prueba.json             # 6 casos ficticios de gastos médicos (AC-1..AC-6)
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
| `RQF-040` | `fase5-lester` | `RQF-005` | `RQF-B10 (pág. 9)` (prueba usa umbral 85) | `AC-1: Aprobación automática >= 90 (CASO-MED-001)` | `T-04` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testAutoApproval` |
| `RQF-041` | `fase5-lester` | `[SIN EQUIVALENTE VERIFICADO]` | `RQF-B12 (pág. 9)` (parcial; PDF dice "Rechazado", superado por DEC-08/E2-06) | `AC-2: Derivación por señal bajo mínimo (CASO-MED-002)` | `T-05` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testMinSignalGate` |
| `RQF-023` | `fase5-lester` | `RQF-028` | `RQF-B12 (pág. 9)` (parcial; PDF dice "Rechazado", superado por DEC-E2-06) | `AC-3: Precedencia de alerta de fraude (CASO-MED-003)` | `T-06` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testFraudPrecedence` |
| `RQF-020` | `fase5-lester` | `[SIN EQUIVALENTE VERIFICADO]` | `RQF-B11 (pág. 9) y RQF-B12 (pág. 9)` (Modificado: rechazo automático → derivación con advertencia de riesgo alto [umbralRiesgoAlto = 60]. Origen: equipo, con base en ENT6) | `AC-4: Derivación con advertencia de riesgo alto por puntaje crítico y 2 señales bajo mínimo (CASO-MED-004)` | `T-07` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testHighRiskWarning` |
| `RQF-004` | `final-final` | `[SIN EQUIVALENTE VERIFICADO en fase5-lester; RQF-020 cubre solo puntaje < 60]` | `RQF-B11 (pág. 9) y RQF-B12 (pág. 9)` (cobertura parcial por contenido; RQF-B11 rango intermedio 60-84 y RQF-B12 rechazo bajo umbral mínimo, superado por DEC-08) | `AC-5: Derivación estándar en rango intermedio de puntaje (CASO-MED-005)` | `T-08` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testIntermediateRange` |
| `RQF-020` | `fase5-lester` | `[SIN EQUIVALENTE VERIFICADO]` | `RQF-B12 (pág. 9)` (superado por DEC-08 / DEC-E2-10) | `AC-6: Derivación con advertencia de riesgo alto por puntaje crítico con 1 sola señal bajo mínimo (CASO-MED-006)` | `T-09` | `src/backend/engine.ts` | `[hash]` | `tests/unit/engine.test.ts:testCriticalScoreWarning` |
| `RQF-044` | `final-final` | `[SIN EQUIVALENTE VERIFICADO en lester]` | `RQF-B09 (pág. 9)` | `FR-001 / FR-003: Configuración de umbrales por flujo y propuesta en borrador` | `T-01` | `src/backend/routes/umbrales.ts` | `[hash]` | `tests/integration/umbrales.test.ts` |
| `RQF-039` | `fase5-lester` | `RQF-035 [final-final]` | `[SIN EQUIVALENTE VERIFICADO]` (sin equivalente directo en PDF) | `FR-002: Doble control y aprobación de umbrales (SC-003)` | `T-02` | `src/backend/routes/umbrales.ts` | `[hash]` | `tests/integration/umbrales.test.ts` |
| `RQNF-002` | `fase5-lester` | `RQNF-003` | `[SIN EQUIVALENTE VERIFICADO]` (sin equivalente directo en PDF) | `FR-004 / FR-012: Historial inmutable y reproducibilidad determinista al 100% (SC-004)` | `T-12` | `src/backend/routes/eval.ts` | `[hash]` | `tests/reproducibility/deterministic.test.ts` |

> **Nota:** Tarea (tasks.md): identificadores provisionales hasta ejecutar /speckit-tasks. (La prueba unitaria directa `PU-1` se especifica en `spec.md §6.2` como verificación complementaria del motor).

### 7.5 Atribución de Origen de los Cambios
Registro auditable distinguiendo cambios originados por el **Representante del Cliente**, el **Equipo de Desarrollo** y el **Agente**.

### 7.6 Mapeo de Secciones del Informe (6.1 a 6.8) y Fuentes
Angel Salgado es el redactor principal del informe con apoyo técnico de Rodrigo (backend), Jorge (UI) y Lester (tests).

### 7.7 Estructura y Métricas de la Sección 6.6 (Comparativa con Entrega 1) — DEC-E2-08
Conforme a la resolución interna **DEC-E2-08**, la sección 6.6 del informe escrito se estructura y gobierna formalmente bajo el siguiente estándar:

1. **Tabla 6.6-A: Evolución de Requisitos**  
   Columnas obligatorias:
   - `Requisito E1 con fuente` (ejemplo: `RQF-040 [fase5-lester]`, `RQF-028 [final-final]`, `RQF-B10 [PDF pág. 9]`).
   - `Clasificación`: *Sin cambio* / *Modificado* / *Diferido por alcance* / *Nuevo*.
   - `Qué cambió`: Descripción concreta del cambio o refinamiento técnico.
   - `Origen`: *equipo* / *cliente* / *agente*.
   - `Evidencia`: Hash de commit, archivo de spec, test o acta de decisión.

   *Fila canónica de RQF-B12 / RQF-020 en Tabla 6.6-A:*
   | Requisito E1 con fuente | Clasificación | Qué cambió | Origen | Evidencia |
   | :--- | :--- | :--- | :--- | :--- |
   | `RQF-B12 [PDF pág. 9]` / `RQF-020 [fase5-lester]` | Modificado | Modificado: rechazo automático → derivación con advertencia de riesgo alto (umbralRiesgoAlto = 60). El sistema nunca rechaza automáticamente un caso; el máximo efecto es derivarlo a revisión humana asistida con advertencia destacada. | equipo, con base en ENT6 | `DEC-08`, `DEC-E2-06`, `DEC-E2-10`, `tests/unit/engine.test.ts:testHighRiskWarning` |

2. **Subsección 6.6.1: Preguntas Guía de Reflexión**  
   Espacio reservado exclusivamente para el desarrollo de las preguntas guía de análisis cualitativo exigidas en el enunciado (bloques A y B obligatorios, y al menos 4 de C, D, E).

3. **Tabla 6.6-B: Hallazgos y Supuestos**  
   Columnas obligatorias:
   - `H-xx`: Identificador canónico del hallazgo o inconsistencia (ej. `H-01`, `H-05`, `H-08`, `H-10`, `H-14`).
   - `Qué decía la E1`: Definición o supuesto heredado de la Entrega 1.
   - `Estado en la E2`: Resolución formal implementada en la Entrega 2.
   - `Quién lo detectó`: Integrante, rol o stakeholder origen de la detección.
   - `Evidencia`: Ficha DEC, commit, test automatizado o acta de clarify.

4. **Fórmulas de los Tres Indicadores Cuantitativos:**
   - **TPR (Tasa de Preservación de Requisitos Must):**
     TPR = Must de F4/F5 sin cambio / Must de F4/F5 x 100
   - **TIH (Tasa de Intervención Humana en Código):**
     TIH = Commits de corrección humana / Commits de tareas x 100
   - **IRF (Índice de Retrabajo por Fase):**
     IRF = Artefactos de fase con corrección humana sustantiva / Artefactos de la fase

5. **Gobernanza y Responsabilidad:**
   - Las tablas 6.6-A y 6.6-B se completan **cada día** durante el sprint.
   - **Angel Salgado** es el responsable exclusivo de su llenado y mantenimiento.

6. **Diferencias Clave entre Entrega 1 y Entrega 2 como Decisiones Deliberadas del Equipo:**
   - **Rechazo automático (RQF-B12) → Derivación asistida siempre con advertencia de riesgo alto (DEC-08, DEC-E2-06 y DEC-E2-10):** En la Entrega 1, el requisito `RQF-B12` (pág. 9) y su caso de prueba estipulaban el rechazo automático de expedientes bajo el umbral mínimo o con alerta de fraude activa (*"Rechazado, ignorando el puntaje total"*). En la Entrega 2, el equipo adopta como decisión deliberada la prohibición absoluta de rechazos automáticos dictada por Cumplimiento (Daniela Cortés, ENT6 [00:04:06]), resolviendo que todo expediente en dicha condición se deriva obligatoriamente a revisión asistida por un operador humano (**DEC-08** y **DEC-E2-06**). Se anota formalmente: *"Modificado: rechazo automático → derivación con advertencia de riesgo alto (umbralRiesgoAlto = 60). Origen: equipo, con base en ENT6"*.
   - **Umbral fijo 85 y rango 60-84 (RQF-B10 y RQF-B11) → Umbral ≥ 90 configurable (DEC-01):** En la Entrega 1, los requisitos `RQF-B10` y `RQF-B11` manejaban un umbral rígido de 85 puntos para aprobación y un rango intermedio de 60-84 para revisión (probados con 95 y 75 puntos respectivamente). En la Entrega 2, el equipo adopta deliberadamente el umbral **≥ 90 puntos** como valor conservador exigido por el cliente piloto (Francisca Leiva, ENT4 [00:11:06]), parametrizable de forma independiente por flujo y cliente mediante la funcionalidad F5 (**DEC-01**).

### 7.8 Medición Objetiva del Aporte del Agente en Git
Cálculo mediante diffs entre commits generados por el agente (`[TASK-xx]`) y commits de corrección humana (`[HUMAN-FIX]`).

---

## 8. Puertas de Calidad y Definición de Terminado (DoD)

### 8.1 Alineación con los Criterios de Evaluación y Descuentos
- **C1: Resumen ejecutivo (5%):** Máximo 1/2 plana; responde qué se construyó, método, 3 cambios y recomendaciones; cero jerga.
- **C2: Introducción y selección (5%):** Máximo 1 plana; justifica F5+F4 por criterio de riesgo, conexión de datos y cruce con H-05/DEC-01.
- **C3: Aplicación del método SDD (10%):** Fases completas en git; DEC en `.specify/memory/constitution.md`; antes/después en log de prompts; balance costo/valor.
- **C4: Implementación (20%):** Repo levantable en menos de 15 min desde README; ambas funcionalidades operando en español; interfaz de punta a punta.
- **C5: Pruebas y verificación (5%):** Cobertura Must; al menos 1 prueba E2E (Playwright); 1 prueba extra-funcional medible (reproducibilidad determinista 100%); usabilidad externa y aceptación registradas.
- **C6: Comparativa con E1 (30%):** Tablas 6.6-A y 6.6-B (subsección 6.6.1 para preguntas guía); 3 indicadores calculados (TPR, TIH, IRF); respuestas fundadas en evidencia a bloques A y B, y al menos 4 de C, D, E.
- **C8: Discusión (5%):** Máximo 1 plana; reflexión crítica con lecciones aprendidas y contraste SDD vs BMAD (el cuerpo manda junto a Conclusiones).
- **C9: Conclusiones (5%):** Máximo 1/2 plana; aprendizajes y deudas técnicas (el cuerpo manda junto a Discusión).
- **C10: Presentación oral y demo (15%):** 15 min; participan los 4; demo en vivo corriendo estrictamente sobre tag `v2.0`; dominio individual absoluto.
*(Nota: la pauta suma 100% omitiendo C7).*

#### Penalizaciones Graves a Evitar
- ❌ **Cita o referencia inexistente:** Se asume preventivamente un descuento de **−1,0 punto** por ocurrencia en el criterio afectado (según DEC-E2-09).
- ❌ **Repo que no levanta en menos de 15 min:** Nota máxima de C4 topada en **3.0**.
- ❌ **Artefacto obligatorio ausente:** Penalización directa en C3.
- ❌ **Exceso de páginas:** Límite estricto de **11 planas A4** para el cuerpo del informe más anexos (tablas y figuras dentro del límite; matriz de trazabilidad y bitácora en anexos). El evaluador corta la lectura al límite de la plana.

### 8.2 Definición de Terminado (DoD) Global
- [ ] Tag git `v2.0` empujado a origin (entrega el lunes 19 antes de las 14:00 hrs con la etiqueta `v2.0`).
- [ ] README verificado en máquina limpia en < 15 min.
- [ ] 100% de tests unitarios, Playwright y reproducibilidad determinista en verde.
- [ ] Acta de aceptación firmada por Rodrigo Guerrero (representante del cliente en la E2) con Lester y Jorge presentes.
- [ ] Informe PDF dentro del límite de 11 planas A4 (tablas y figuras dentro del límite; trazabilidad y bitácora como anexos).
- [ ] **Script de verificación pre-entrega:** Ejecución obligatoria antes de entregar de un script automatizado que verifique físicamente en el repositorio la existencia de IDs, citas documentales y hashes de commit (asegura cero citas inexistentes, previniendo descuento de −1,0 por ocurrencia según DEC-E2-09).
- [ ] **Lista de artefactos obligatorios presentes en el repositorio:**
  - [x] Constitución: `.specify/memory/constitution.md`.
  - [x] Especificación: `specs/001-f5-f4-umbrales-evaluacion/spec.md` (validada en clarify).
  - [x] Registro de clarificación: `docs/entregable2/clarificaciones.md` (Compuerta 2: aprobada por el cliente y revisada por Lester; pendiente revisión de Jorge y Angel y confirmación de §7.1(f)).
  - [ ] Plan de implementación: `plan.md`.
  - [ ] Lista de tareas de desarrollo: `tasks.md`.
  - [ ] Reporte de análisis de consistencia: `docs/entregable2/reporte-analisis-consistencia.md`.

---

## 9. Matriz de Riesgos y Mitigaciones Específicas

| # | Riesgo Identificado | Prob. | Impacto | Señal Temprana de Alerta | Protocolo de Mitigación Inmediata |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **R-01** | **Tests circulares generados por el agente** | Alto | Crítico | El test pasa de inmediato sin haber fallado antes. | Tests derivados de criterios `AC-N` de la Entrega 1. Lester revisa que verifiquen entradas/salidas de negocio. |
| **R-02** | **Requisitos inventados fuera de alcance** | Alto | Alto | Agente propone endpoints o features no solicitadas en `spec.md`. | `.specify/memory/constitution.md` prohíbe inventar requisitos; sección "Fuera de alcance" explícita; veto inmediato del diff. |
| **R-03** | **Deriva de IDs entre RQF-xxx y RQF-Bxx** | Medio | Alto | El agente mezcla nomenclaturas en commits o tests. | Aplicar `DEC-E2-02`. Prompts exigen estrictamente la nomenclatura `RQF-xxx` de la Entrega 1. |
| **R-04** | **Agotamiento de cuota de Antigravity** | Medio | Alto | Rate limits o truncado en sesiones de plan/implement. | Rotación de cuentas según [§5.4](#54-gestión-de-cuotas-de-antigravity); prompts modulares de <100 líneas. |
| **R-05** | **Bloqueo entre Frontend y Backend** | Alto | Medio | Jorge no puede avanzar por falta de endpoints. | Contrato `src/shared/types.ts` congelado el Martes 13; Jorge usa mocks locales para desarrollar la UI. |
| **R-06** | **Parálisis por Decisiones Abiertas** | Medio | Medio | Discusiones prolongadas en clarify. | Rodrigo Guerrero (representante del cliente en la E2) fija supuesto formal documentado en clarify. Lo que no toque F5/F4 se declara fuera de alcance. |
| **R-07** | **Desconocimiento del Dominio por Jorge** | Alto | Medio | Jorge asume reglas incorrectas en UI. | Onboarding guiado el Día 0 ([§2.g](#2g-ruta-de-onboarding-técnico-para-jorge-alvarez)) con cuestionario previo. |
| **R-08** | **Conflicto de Interés de Rodrigo Guerrero** | Alto | Crítico | Rodrigo Guerrero (representante del cliente en la E2) aprueba su propio backend sin probar bordes. | `DEC-E2-03`: criterios congelados antes; sesión presencial con Lester y Jorge como validadores; acta inmutable. |
| **R-09** | **Dependencia de un Solo Integrante** | Medio | Alto | Desconexión de un integrante durante el sprint. | PRs pequeños integrados diariamente; contratos claros en git para relevos rápidos. |
| **R-10** | **Fuga de Secretos o Datos Reales** | Bajo | Crítico | Commits con credenciales o datos sensibles. | Solo datos ficticios en `data/`; `.gitignore` estricto para `.env` y temporales. |
| **R-11** | **Tensión de cronograma comercial vs. plan formal (H-10 / DEC-10)** | Alto | Crítico | Presión de stakeholders comerciales o del cliente piloto para adelantar ingesta de casos reales a enero de 2027 o comprometer hitos por la feria de fines de marzo de 2027 (declaración de Rodrigo Vergara (sponsor, ENT1 [00:11:05])). | Rige el plan formal de MIRA §5.2 (marcha blanca a fines de febrero y paso a producción a fines de abril de 2027). Mitigación: registrar la discrepancia, mantener el alcance F5+F4 y regirse por MIRA §5.2. Cualquier demostración en feria con datos simulados/sintéticos en entorno de pruebas: [propuesta pendiente de decisión del equipo]. |

---

## 10. Consultas Pendientes al Profesor y Puntos por Confirmar

### 10.1 Resoluciones Internas de Ambigüedades del Enunciado (DEC-E2-02, 07, 08, 09 y 10)
El profesor indicó al equipo que resolviera internamente las ambigüedades del enunciado. Las consultas quedan resueltas internamente mediante decisiones formales confirmadas por el equipo completo el 13-10-2026:

1. **Consulta 1 (Evaluación individual de nuevo integrante):** *Resuelta internamente mediante `DEC-E2-07`.*  
   Equipo ratificado en 4 personas. Jorge Alvarez no participó en la Entrega 1, lo cual se declara formalmente en la sección 6.2 del informe. Se fijan los tres insumos base: descripción de MIRA, retroalimentación de la Entrega 1 (*"todo bien, solo detalles en la presentación"*, sin modificación de requisitos) y análisis de la Entrega 1 (informe y artefactos de fases 1 a 6).  
   *Estado:* **RESUELTA INTERNAMENTE (`DEC-E2-07`, confirmada por el equipo completo el 13-10-2026)**.

2. **Consulta 2 (Estructura de 6.6 y vinculación de tablas/indicadores):** *Resuelta internamente mediante `DEC-E2-08`.*  
   Se fija la estructura canónica de la sección 6.6: Tabla 6.6-A (evolución de requisitos con columnas: requisito E1 con fuente, clasificación *Sin cambio* / *Modificado* / *Diferido por alcance* / *Nuevo*, qué cambió, origen equipo-cliente-agente, evidencia), subsección 6.6.1 reservada para las preguntas guía de reflexión, y Tabla 6.6-B (hallazgos y supuestos: H-xx, qué decía la E1, estado en la E2, quién lo detectó, evidencia). Se formalizan las fórmulas de los tres indicadores (TPR, TIH, IRF). Las tablas se llenan diariamente; Angel Salgado es responsable.  
   *Estado:* **RESUELTA INTERNAMENTE (`DEC-E2-08`, confirmada por el equipo completo el 13-10-2026)**.

3. **Consulta 3 (Ponderaciones de la rúbrica y límites del informe):** *Resuelta internamente mediante `DEC-E2-09`.*  
   Rige la tabla de ponderaciones de la rúbrica del enunciado (C6 30%, C4 20%, C10 15%, C3 10%, demás 5%; falta C7). Límite de 11 planas A4 para el cuerpo del informe más anexos (tablas y figuras dentro del límite; matriz de trazabilidad y bitácora en anexos, mandando en el cuerpo 6.7 Discusión y 6.8 Conclusiones). Se asume preventivamente el descuento de −1,0 por cita inexistente y se exige en la definición de terminado (§8.2) correr un script de verificación pre-entrega (IDs, citas, hashes de commit), junto a la presencia de los artefactos obligatorios.  
   *Estado:* **RESUELTA INTERNAMENTE (`DEC-E2-09`, confirmada por el equipo completo el 13-10-2026)**.

4. **Consulta 4 (Universo y numeración oficial de requisitos):** *Resuelta internamente mediante `DEC-E2-02`.*  
   Ante la colisión severa de identificadores entre `final-final.md` (81 requisitos) y `fase5-lester` (57 requisitos), y la consolidación de 49 requisitos en el PDF (`RQF-Bxx`), rige la decisión interna **`DEC-E2-02`**: se adopta la numeración de `fase5/fase5-lester/requisitos_formato_final.md` (respaldada por la suite de pruebas `fase6/pruebas-funcionales.md`) con la exigencia formal de citar cada requisito con su archivo fuente (ejemplo: `RQF-040 [fase5-lester]`) y su identificador de referencia cruzada del PDF (`RQF-Bxx`).  
   *Estado:* **RESUELTA INTERNAMENTE (`DEC-E2-02`, confirmada por el equipo completo el 13-10-2026)**.

5. **Consulta 5 (Decisiones de diseño de F5 + F4 y umbral 60):** *Resuelta internamente mediante `DEC-E2-10`.*  
   Se ratifican los supuestos de señales (mínimos 70/70/60, pesos 0,40/0,40/0,20), no se retira el 60 sino que pasa a ser `umbralRiesgoAlto` (Opción A: activa advertencia destacada sin rechazo automático), se define spec única para F5+F4 con tareas etiquetadas `[F5]` y `[F4]`, y se aprueba el flujo Diseñador propone / Administrador aprueba (cerrando rol de PF-033).  
   *Estado:* **RESUELTA INTERNAMENTE (`DEC-E2-10`, confirmada por el equipo completo el 13-10-2026)**.

---

## 11. Registro de Verificación de IDs y Pendientes

### 11.1 Tabla de IDs Verificados vs. No Verificados Físicamente en el Repositorio
| Tipo de Identificador | ID Citado en esta Guía | Archivo Fuente en el Repositorio | Estado de Verificación | Observación Técnica |
| :--- | :--- | :--- | :--- | :--- |
| **Requisito Funcional** | `RQF-001 [final-final]` | [`fase5/requisitos-funcionales-y-no-funcionales-final-final.md:L3`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md#L3) | **VERIFICADO** | Existe físicamente (ingesta HTTP); no arranca en RQF-002. En `fase5-lester` corresponde a recepción de evidencia multi-archivo. |
| **Requisito Funcional** | `RQF-004 [final-final]` | [`fase5/requisitos-funcionales-y-no-funcionales-final-final.md:L6`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md#L6) | **VERIFICADO en final-final y PDF** | Derivación a revisión asistida en rango intermedio de puntaje (caso de 75 puntos). En `fase5-lester` colisiona por ID con "validar flujo contra límite de cliente" (L6) y queda como `[SIN EQUIVALENTE VERIFICADO en fase5-lester]`; en el PDF corresponde a `RQF-B11 (pág. 9)` (rango 60-84 sin aprobar ni rechazar). En Fase 6 queda sin prueba heredada verificada (`PF-004` en L12 verifica el límite de tasa de `RQF-004 [fase5-lester]`). |
| **Requisito Funcional** | `RQF-020 [fase5-lester]` | [`fase5/fase5-lester/requisitos_formato_final.md:L22`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L22) | **VERIFICADO** | Casos < 60 puntos; modificado por DEC-08 / DEC-E2-10: rechazo automático → derivación con advertencia de riesgo alto (umbralRiesgoAlto = 60). Origen: equipo, con base en ENT6. En `final-final.md` colisiona por ID con "encolar peticiones excedentes" (RQF-020 en final-final.md:L22, equivalente por contenido a RQF-005 [fase5-lester]) y queda como `[SIN EQUIVALENTE VERIFICADO en final-final]`; en el PDF su cobertura es parcial por contenido exclusivamente bajo `RQF-B12 (pág. 9)` (el rechazo automático fue superado por DEC-08 / DEC-E2-06 / DEC-E2-10). |
| **Requisito Funcional** | `RQF-023 [fase5-lester]` | [`fase5/fase5-lester/requisitos_formato_final.md:L25`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L25) | **VERIFICADO** | Precedencia de alerta de fraude derivando a revisión humana. En `final-final.md` colisiona con "crear caso nuevo vinculado", su equivalente verificado por contenido es `RQF-028`; en el PDF su cobertura es parcial por contenido bajo `RQF-B12 (pág. 9)` (el PDF estipula "Rechazado, ignorando el puntaje total", superado por DEC-E2-06; en pág. 13 la prueba `PF-018` cita textualmente `RQF-023`). |
| **Requisito Funcional** | `RQF-039 [fase5-lester]` | [`fase5/fase5-lester/requisitos_formato_final.md:L41`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L41) | **VERIFICADO** | Dos aprobaciones separadas antes de modificar umbrales. En `final-final.md` colisiona con "carga manual por formulario", su equivalente verificado por contenido es `RQF-035 [final-final]`; en el PDF queda `[SIN EQUIVALENTE VERIFICADO]` (sin equivalente directo; `RQF-B09` cubre configuración simple pero no exige doble aprobación). |
| **Requisito Funcional** | `RQF-040 [fase5-lester]` | [`fase5/fase5-lester/requisitos_formato_final.md:L42`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L42) | **VERIFICADO** | Aprobación automática según umbral definido (≥ 90 por decisión del equipo). En `final-final.md` colisiona con "extraer texto y firmas", su equivalente verificado por contenido es `RQF-005`; en el PDF corresponde a `RQF-B10 (pág. 9)` (verificado por el equipo; su prueba en PDF usa umbral 85). |
| **Requisito Funcional** | `RQF-041 [fase5-lester]` | [`fase5/fase5-lester/requisitos_formato_final.md:L43`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L43) | **VERIFICADO** | Derivación si alerta de fraude o señal bajo mínimo. En `final-final.md` colisiona con "detectar objetos y daños en fotos" y queda como `[SIN EQUIVALENTE VERIFICADO]`; en el PDF su cobertura es parcial por contenido bajo `RQF-B12 (pág. 9)` (el PDF estipula rechazo automático, superado por DEC-08 / DEC-E2-06). |
| **Requisito Funcional** | `RQF-044 [final-final]` / `RQF-B09` | [`fase5/requisitos-funcionales-y-no-funcionales-final-final.md:L46`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md#L46) y PDF pág. 9 | **VERIFICADO** | Configuración de umbrales numéricos de decisión por flujo y cliente (F5). En `final-final.md` es `RQF-044`; en el PDF es `RQF-B09 (pág. 9)`; en `fase5-lester` queda como `[SIN EQUIVALENTE VERIFICADO en lester]` (en lester solo existe `RQF-039` que exige doble aprobación). |
| **Requisito (Excluido)** | `RQF-013 [fase5-lester]` | [`fase5/fase5-lester/requisitos_formato_final.md:L15`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L15) | **VERIFICADO (Excluido)** | Tiempo restante en bandeja; excluido en `fase6/pruebas-funcionales.md:L3`. |
| **Requisito No Funcional**| `RQNF-002 [fase5-lester]`| [`fase5/fase5-lester/requisitos_formato_final.md:L57`](../fases-y-plan-de-trabajo/fase5/fase5-lester/requisitos_formato_final.md#L57) | **VERIFICADO** | Reconstrucción de decisiones pasadas basada en historial. En `final-final.md` colisiona con "conservar expedientes de 90 días a 10 años", su equivalente verificado por contenido es `RQNF-003`; en el PDF queda `[SIN EQUIVALENTE VERIFICADO]` (sin equivalente directo). |
| **Requisitos PDF** | `RQF-B01` a `RQF-B36` y `RQNF-B01` a `RQNF-B13` | [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) (págs 9-12) | **VERIFICADO en PDF** | Conteo exacto: 49 requisitos (36 funcionales `RQF-B01..B36` y 13 no funcionales `RQNF-B01..B13`). Cotejo verificado con F5+F4: `RQF-B09` (configuración de umbrales = `RQF-044 [final-final]`), `RQF-B10` (aprobación automática = `RQF-040 [fase5-lester]` / `RQF-005 [final-final]`), `RQF-B11` (derivación rango 60-84 = `RQF-004 [final-final]`) y `RQF-B12` (rechazo bajo umbral o fraude, cubriendo parcialmente por contenido `RQF-020 [fase5-lester]`, `RQF-023 [fase5-lester]` y `RQF-041 [fase5-lester]`, superado el rechazo por DEC-08 / DEC-E2-06). `RQF-039 [fase5-lester]` y `RQNF-002 [fase5-lester]` no tienen equivalente directo en el PDF. |
| **Prueba Funcional** | `PF-015` | [`fase6/pruebas-funcionales.md:L34`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md#L34) | **VERIFICADO** | Verifica RQF-020 [fase5-lester] (caso con 45 puntos escala a humano según H-08). |
| **Prueba Funcional** | `PF-018` | [`fase6/pruebas-funcionales.md:L43`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md#L43) | **VERIFICADO** | Verifica RQF-023 [fase5-lester] (puntaje 100 con fraude deriva a revisión manual). |
| **Prueba Funcional** | `PF-020` | [`fase6/pruebas-funcionales.md:L45`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md#L45) | **VERIFICADO** | Verifica RQF-040 [fase5-lester] (la precondición en PF-020 dice "sobre 90"; la decisión del equipo DEC-01 es ≥ 90). |
| **Prueba Funcional** | `PF-021` | [`fase6/pruebas-funcionales.md:L46`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md#L46) | **VERIFICADO** | Verifica RQF-041 [fase5-lester] (puntaje 100 con señal bajo mínimo deriva o rechaza; la opción "o rechaza" queda formalmente superada por DEC-08, rigiendo únicamente la derivación). |
| **Prueba Funcional** | `PF-033` | [`fase6/pruebas-funcionales.md:L69`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md#L69) | **VERIFICADO** | Verifica RQF-039 [fase5-lester] (cambio de umbral requiere dos aprobaciones; resuelto por DEC-E2-10(d): Diseñador propone, Administrador aprueba; asociado indirectamente a RQF-044 / RQF-B09). |
| **Caso de Uso** | `UC-01` | [`fase4/Fase 4 — Casos de uso (§5.3.2).md:L15`](../fases-y-plan-de-trabajo/fase4/Fase%204%20%E2%80%94%20Casos%20de%20uso%20%28%C2%A75.3.2%29.md#L15) | **VERIFICADO** | Evaluar caso automáticamente (contiene nota "85 vs 80 sin resolver"). |
| **Inconsistencias** | `H-01`, `H-05`, `H-08`, `H-10`, `H-11`, `H-14` | [`fase2/inconsistencias-revisadas.md`](../fases-y-plan-de-trabajo/fase2/inconsistencias-revisadas.md) | **VERIFICADO** | Todas corresponden a filas HC-001, HC-005, HC-008, HC-010, HC-011, HC-014. |
| **Citas de Entrevistas**| `ENT2 [00:13:05]`, `ENT4 [00:11:06]`, `ENT5 [00:15:16]`, `ENT6 [00:01:21]`, `ENT6 [00:04:06]`, `ENT6 [00:21:16]`, `ENT3 [00:08:57]` | [`fase2/inconsistencias-revisadas.md`](../fases-y-plan-de-trabajo/fase2/inconsistencias-revisadas.md) | **VERIFICADO** | Marcas de tiempo cotejadas contra las fuentes de Fase 2. ENT5 [00:15:16] (sesgo de anclaje), ENT6 [00:01:21] ("apriete aceptar en tres segundos"), ENT6 [00:04:06] (prohibición de rechazo automático e intervención humana indelegable) y ENT6 [00:21:16] (doble aprobación de umbrales) verificadas físicamente. |
| **Cita de Entrevista** | `ENT3 [00:21:47]` | Transcripción ENT3 / MIRA docx | **VERIFICADO** | Marca de tiempo y cita verificadas (fuente: MIRA docx, ENT3 [00:21:47], Sebastián: *"mínimos por señal… aunque nadie ha definido cuáles son"*). Citada en DEC-E2-10(a) y D-07. |

### 11.2 Lista Consolidada de Puntos `[POR VERIFICAR]` y `[POR CONFIRMAR]`
1. `[POR CONFIRMAR en clase]`: Horario y día exacto de la exposición oral del equipo (a las 14:30 o en otro día según fije el profesor).
2. **RATIFICADO en `clarify` (14-10-2026)** como `[SUPUESTO del equipo]` por Rodrigo Guerrero (representante del cliente en la E2): Nombres de señales concretas alineadas conceptualmente con MIRA §2.6 (`autenticidad_documentos`, `cruce_fuentes`, `coherencia_solicitud` [biométrica solo si aplica]), bandera de fraude aparte (`alertaFraudeActiva`), umbrales mínimos (70, 70, 60), ponderaciones (40%, 40%, 20%), y 5 identidades fijas en la barra superior para autenticación simulada en D-04 (`Diseñador 1`, `Diseñador 2`, `Administrador 1`, `Administrador 2`, `Operador 1`). Registrado formalmente en `docs/entregable2/clarificaciones.md` y `specs/001-f5-f4-umbrales-evaluacion/spec.md`.
3. **VERIFICADO** (fuente: MIRA docx, ENT3 [00:21:47], Sebastián: *"mínimos por señal… aunque nadie ha definido cuáles son"*): Marca de tiempo ENT3 [00:21:47] citada en DEC-E2-10(a) y D-07 respecto a que los umbrales mínimos de señales están pendientes de definir con el área de riesgo del cliente piloto.
4. `[POR VERIFICAR]`: Permisos y credenciales requeridas para ejecutar `/speckit-taskstoissues` contra el repositorio GitHub (`GITHUB_TOKEN` o autenticación CLI `gh`), en caso de que el equipo decida utilizarlo para crear issues automáticamente.

---
*Fin de la Guía Operativa. Archivo de control versionado para la Entrega 2 de MIRA.*

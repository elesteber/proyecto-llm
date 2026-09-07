# Resumen en profundidad — Proyecto MIRA (Entregable 1)

## 0. Contexto y encuadre del trabajo

El curso es **ICI525 – Taller de Desarrollo de Software Conducido por Agentes de IA** (Universidad de Valparaíso, prof. Diego Gatica Pizarro). La actividad ("Entregable 1") pide tomar una descripción de proyecto redactada por un cliente de negocio —no por un ingeniero de requisitos— y producir, con apoyo de LLMs pero bajo control humano explícito, un conjunto de artefactos de ingeniería de requisitos suficiente para "empezar a construir mañana sin releer el documento original". El foco de evaluación no es la fluidez de lo producido, sino la **trazabilidad** (toda afirmación citada a su fuente), la **detección y resolución de inconsistencias**, y el **uso justificado de técnicas de prompting**.

**Caso de negocio:** MIRA, una plataforma de IA multimodal para automatizar decisiones (aprobar/rechazar/derivar) sobre casos de negocio —el ejemplo ancla es liquidación de siniestros de seguros—, desarrollada por la consultora **DPRIME SpA**. El material fuente es un documento de ~29 páginas (`MIRA-descripcion-proyecto.docx`, con secciones §1 a §6) más **9 entrevistas transcritas con timestamp** (ENT1–ENT9) a distintos roles: el gerente general de DPRIME (Rodrigo Vergara), la directora de producto (Camila Ordóñez), el líder de ingeniería de modelos (Sebastián Alarcón), gente de la aseguradora piloto (Francisca Leiva, Marco Peñailillo), cumplimiento (Daniela Cortés), arquitectura de tecnología del cliente (Hugo Marambio), finanzas (Valentina Ruiz-Tagle) y operación/soporte (Tomás Berríos).

**Equipo:** Lester Gonzales, Rodrigo Guerrero, Ángel Salgado. El representante del cliente identificado en la portada del informe es **Francisca Leiva** (subgerenta de operaciones de siniestros de la aseguradora piloto) — es decir, el equipo adoptó ese rol conceptualmente al tomar decisiones "en nombre" de ese interesado.

**Entrega:** lunes 7 de septiembre de 2026, 14:00. Trabajo distribuido por fases entre el 24 de agosto y el 7 de septiembre, con la carga más fuerte concentrada en los últimos 3 días (5, 6 y 7 de septiembre).

---

## 1. La estrategia general: un plan de trabajo antes de tocar el documento

Antes de escribir el primer prompt, el equipo armó `Plan_de_Trabajo_MIRA.md`: una guía fase por fase (0 a 9) que asigna qué técnica de prompting usar en cada artefacto, dónde combinarlas, y qué decisiones quedan explícitamente vetadas al modelo (marcadas con 👤). La razón de fondo, explícita en el enunciado del curso: **un LLM al que se le pide un resumen de entrada elimina exactamente las contradicciones que la actividad evalúa**. Por eso la Fase 0 fue puramente de planificación de lectura (con **Plan-and-Solve Prompting**), no de extracción.

El hilo de artefactos siguió el orden estándar de ingeniería de requisitos: **Dominio → Casos de uso → Requisitos (RF/RNF) → Pruebas → Backlog → Diagrama de secuencia (SSD)**, porque cada uno consume al anterior y generarlos todos de un tirón produce contradicciones internas.

---

## 2. Fase 1 — Inventario estructurado (la base de todo lo demás)

**Objetivo:** convertir el documento + 9 entrevistas en una base de datos de afirmaciones citables, clasificadas por tipo, antes de escribir cualquier artefacto de análisis.

**Técnica:** Grounded Prompting + Structured Output Prompting combinadas. Cada afirmación extraída sigue un esquema fijo:
```
{texto, cita_textual, fuente, tipo, seccion_o_entrevista}
```
donde `tipo` ∈ {necesidad, solución_decidida, opinión, regla_de_negocio} — la razón de esta taxonomía es que el documento fuente "mezcla necesidades, soluciones ya decididas y opiniones personales" (enunciado del curso), y tratar una opinión personal como si fuera un requisito habría contaminado todos los artefactos posteriores.

**Cobertura:** 38 fuentes procesadas — 27 subsecciones del documento (1.1–5.3) + 9 entrevistas (ENT1–ENT9), organizadas en `fases-y-plan-de-trabajo/estructura-texto/*.json`.

**Evolución del prompt (4 versiones), documentada explícitamente para la sección de "técnicas de prompting" del informe:**
- **v1 → v2:** las categorías `solución_decidida` vs `regla_de_negocio` no tenían un criterio de desempate, así que la misma afirmación se clasificaba distinto según el ítem. Se agregó un orden de evaluación estricto de 4 pasos (opinión → regla de negocio → solución decidida → necesidad).
- **v2 → v3:** el modelo fusionaba en una sola frase genérica afirmaciones de fuentes distintas que en realidad se contradecían (ej. la opinión de un gerente + una cita contractual + una necesidad quedaron resumidas como "existen diferentes interpretaciones internas"), **borrando justo la contradicción que la Fase 2 necesitaba encontrar**. Se agregó una regla anti-fusión explícita.
- **v3 → v4 (final):** apareció un problema nuevo — el modelo generaba lo que "el cliente podría argumentar" sin que la fuente lo dijera (relleno especulativo). Se prohibió explícitamente anticipar posturas de terceros y se exigió el campo `cita_textual` (máx. 20 palabras, literal) para poder auditar cada entrada sin volver a escuchar el audio completo.

Esta progresión es en sí misma una de las piezas de evidencia "antes/después" que exige la sección 5.4 del informe (Grounded Prompting).

---

## 3. Fase 2 — Detección de inconsistencias (§5.5 del informe)

**Objetivo:** encontrar contradicciones entre fuentes, ambigüedades, vacíos, requisitos no verificables, conflictos entre interesados y decisiones pendientes declaradas.

**Técnica:** Grounded Prompting sobre el inventario ya construido (agrupar por tema, señalar dónde dos entradas con fuente distinta se contradicen, citando ambas). El plan de trabajo dejaba abierta también la opción de aislar el contexto (variante de Chain-of-Verification) si el modelo "limaba" contradicciones en vez de reportarlas — no quedó registrado en los artefactos si tuvieron que recurrir a esa variante.

**Regla dura, no negociable en todo el proyecto:** *la resolución de cada inconsistencia (columna "Decisión") es 100% humana*. El modelo propone alternativas; el equipo, en el rol de representante del cliente, elige. Esto se ve reflejado en que cada hallazgo (H-xx / HC-xxx) tiene una columna "Decisión" redactada por el equipo, con la lógica de negocio explicada (no solo "se elige la opción A").

**Resultado:** el equipo llegó a producir dos rondas de trabajo sobre esto —una tabla intermedia de 15 hallazgos (H-01 a H-15) y una consolidación posterior de **16 hallazgos numerados H-01 a H-16** que es la que terminó en el informe final. Ejemplos representativos de los 16, con su naturaleza de conflicto:

| ID | Tema | Tipo de conflicto | Decisión tomada |
|---|---|---|---|
| H-01 | Umbral de aprobación automática: §2.6 dice 85 y también 80 puntos; el cliente piloto (ENT4) pide 90 | Contradicción entre fuentes (además interna al documento) | Se fija en **90 puntos**, configurable por cliente, a recalibrar con la marcha blanca |
| H-02 | Retención de evidencia: plataforma dice 90 días; la aseguradora exige 5–10 años por regulación | Conflicto entre interesados | Se adopta el plazo de la aseguradora; 90 días en almacenamiento activo, luego archivo frío |
| H-03 | Rate limit de API (100/min integración, 1000/min producción) sin definir comportamiento ante exceso | Vacío | Rechazo con `Retry-After` en tráfico estándar + modo de carga por lote (bulk) para cargas masivas predecibles |
| H-07 | ¿Escritura del resultado en el sistema de siniestros del cliente es automática o transcripción manual? | Decisión pendiente declarada por la propia fuente | Automática, vía el mismo mecanismo de archivos de H-13 |
| H-08 | ¿Rechazo automático permitido bajo 60 puntos? Compliance (Daniela) lo veta | Conflicto entre interesados | Se elimina el rechazo automático bajo 60; escala obligatoriamente a un humano que debe justificar |
| H-11 | SLA de "máximo 5 segundos por caso" es técnicamente inviable según ingeniería de modelos (casos reales tardan 30–40s o minutos con video) | Requisito no verificable | Se redefine el SLA por tramos según tipo/tamaño de evidencia; valores exactos pendientes de pruebas de carga |
| H-12 | Rastro de auditoría "inalterable" vs. derecho a eliminación de datos personales | Decisión pendiente declarada | Se separa el metadato de decisión (inalterable) del contenido personal de la evidencia (anonimizable) |
| H-13 | Integración vía API REST (documento) vs. intercambio de archivos en carpeta compartida (cliente piloto, cuyo core no expone servicios web) | Contradicción entre fuentes | La plataforma soporta **ambos** patrones; para el cliente piloto rige el de archivos |
| H-14 | "Reconstruir una decisión pasada" interpretado como reproducibilidad exacta, imposible con modelos generativos no deterministas | Requisito no verificable | Se redefine como trazabilidad completa (inputs, versión de modelo, parámetros), no reproducibilidad exacta del output |
| H-16 | Volumen real del cliente piloto (12.000–40.000 validaciones/mes) excede los tramos de facturación definidos (hasta 5.000/10.000) | Vacío | Se agrega un tramo nuevo (5.000–15.000) con precio fijo; sobre 15.000, Enterprise a convenir |

Cada fila de la tabla real tiene columnas **Fuente en conflicto** con cita exacta (sección o `ENTn [mm:ss]`) — este es el punto que la rúbrica del curso penaliza doblemente si la cita no corresponde al contenido citado, así que fue tratado con cuidado.

**Nota importante para preguntas:** existen en el repo **dos tablas de inconsistencias distintas** (`inconsistencias-revisadas.md` con 15 ítems H-01…H-15, formato "Entrada A / Entrada B / Naturaleza del conflicto"; y `consolidacion-contradicciones.md`/`.json` con 16 ítems HC-001…HC-016 y luego renombrados H-01…H-16 en el informe final). Esto refleja una iteración real del proceso: primero se detectaron los conflictos en bruto, después se consolidaron con columna "Decisión" explícita. Si preguntan "¿por qué hay dos numeraciones?", la respuesta correcta es esa: es la evolución de detección → resolución, no una duplicación por error.

---

## 4. Fase 3 — Modelo de dominio (§5.3.1)

**Técnica:** Grounded Prompting, pero con una complicación operativa real: el límite de 10 archivos adjuntos por prompt obligó a **dividir las 38 fuentes en 4 lotes** y añadir una etapa de **consolidación entre lotes** que no existió en la Fase 2 (donde cada grupo era independiente). Esto es porque el mismo concepto de negocio se nombra distinto en secciones distintas (vocabulario inconsistente, ya detectado en Fase 2) y no basta con pegar los 4 borradores: hay que fusionar entidades equivalentes.

**Resultado (`modelo_dominio.json`):** ~24 entidades (Caso, Evidencia, Puntaje, Señal, Flujo, Bloque, Umbral, Operador, Decisión del Operador, Módulo de análisis, Punto de Acceso, Registro de auditoría, Cliente, Usuario, Panel, Bandeja, Plantilla de flujo, Validación, Notificación, Incidente, Servicio externo, Sistema de siniestros, Decisión, Plataforma, Asegurado), cada una con: atributos, **términos usados** (para el glosario) y **fuentes** exactas que la respaldan. Las relaciones documentan explícitamente las cardinalidades "sucias" (excepciones), por ejemplo: *Caso–Decisión (1 a 1) pero "ningún caso puede quedar sin resolución"*, o *Cliente–Umbral, donde modificar un umbral crítico exige dos aprobaciones separadas*. Se generó también un bloque de `fusiones_dudosas` (ej. ¿Usuario y Operador son la misma entidad? ¿Flujo y Plantilla de flujo?) que el equipo dejó explícitamente para revisión humana en vez de decidir automáticamente.

**Hallazgo de proceso digno de mención (para la sección de Discusión):** el modelo insistía en inyectar marcadores de cita automáticos tipo `[cite: 1]` en vez de copiar el campo `fuente` real —un comportamiento de la *plataforma* del LLM al adjuntar archivos (no algo causado por el prompt), confirmado preguntándole directamente al modelo. Costó 3 iteraciones de "barrera de formato" (bloque JSON puro + paso de autolimpieza + válvula de escape) resolverlo. Además, al repetir un lote, apareció contenido que parecía alucinación (mencionaba una entrevista que no correspondía) — al revisar, resultó ser **error humano**: se había adjuntado el archivo equivocado por un error de tipeo tras repetir el procedimiento manual más de 30 veces. Es un ejemplo concreto y honesto para la sección de Discusión sobre "atribuirle al modelo un fallo que en realidad es del proceso humano".

---

## 5. Fase 4 — Casos de uso (§5.3.2)

**Técnica:** Plan-and-Solve (selección de candidatos) + Grounded Prompting (redacción), aplicadas en dos pasos separados y explícitamente documentados con evidencia antes/después.

**Paso 1 (Plan-and-Solve):** se pidió al modelo, **sin redactar nada todavía**, una lista de candidatos a caso de uso con riesgo estimado y justificación de una línea, priorizando si algún hallazgo H-xx sin resolver afecta directamente su flujo. El modelo devolvió **11 candidatos**; 4 quedaron con riesgo "alto". El equipo confirmó y descartó explícitamente "Diseñar y publicar un flujo" del detalle extendido.

**Resultado:** **11 casos de uso identificados en total** (UC-01 a UC-11), organizados en 3 diagramas PlantUML por grupo de actores (Operador/Administrador; Diseñador de Flujos; Supervisor/Equipo DPRIME) para legibilidad.

**Los 3 casos de uso críticos elegidos (criterio: riesgo de rehacer trabajo si se especifican mal)** — cada uno especificado en formato extendido completo (actor, precondiciones, flujo principal numerado, alternativos, excepción, postcondiciones, todo citado a §x.y o ENTn):

1. **UC-01 — Evaluar caso automáticamente**: motor de análisis que va de "llega evidencia" a "decisión (aprobar/rechazar/derivar) + registro de auditoría". Riesgo: H-01 (umbral bajo 60) sin resolver al momento de especificarlo obligaba a rehacer el motor de decisión completo.
2. **UC-02 — Integrar caso vía interfaz de programación**: tiene **dos flujos principales alternativos** (Flujo A síncrono vía API REST, Flujo B asíncrono vía carpeta de archivos) porque el cliente piloto no expone servicios web. Riesgo: era el contrato con el sistema del cliente, no un detalle interno.
3. **UC-03 — Resolver caso en revisión asistida**: pantalla del operador humano. Riesgo: H-12 sin resolver (mostrar el puntaje antes o después de la evidencia, por sesgo de anclaje) cambia el layout completo de la pantalla que, según el propio documento, "decide si la plataforma se usa o no".

**Ejemplo real de "antes/después" con Grounded Prompting (documentado para §5.4):** en un primer intento sobre CU-01, el paso de aprobación automática se redactó usando solo el umbral de 85 puntos, **omitiendo silenciosamente** que la fuente también mencionaba 80 puntos. Al agregar la regla explícita "si dos entradas se contradicen, no elijas, señala la contradicción", el mismo paso quedó marcado como pregunta pendiente en vez de imprimirse como hecho resuelto — y esto reveló una inconsistencia interna (85 vs 80 en la misma sección §2.6) que ni la Fase 1 ni la Fase 2 habían capturado.

Los otros 8 casos de uso (UC-04 a UC-11: diseñar/publicar flujo, configurar umbrales, consultar auditoría, paneles, facturación, notificaciones, incorporación de cliente nuevo, comparar versión de módulo) quedaron descritos en formato breve, no extendido — cumpliendo la exigencia del enunciado (solo los 3 críticos van en detalle).

---

## 6. Fase 5 — Requisitos funcionales y no funcionales (§5.3.3)

**Técnica:** Structured Output + Grounded Prompting para la tabla, más **LLM-as-a-Judge obligatorio sobre cada RNF** antes de aceptarlo, con una rúbrica de 6 partes (fuente del estímulo, estímulo, artefacto, entorno, respuesta, medida numérica/objetiva). Cualquier RNF que no cumpla se marca `[NO CUMPLE: falta X]` **sin corregirlo automáticamente** — queda para que el equipo lo resuelva.

**Ejemplo real de la rúbrica en acción:** un RNF que decía "El sistema debe procesar los casos de integración de forma asincrónica, sin perder información por caídas" fue marcado por el juez como `[NO CUMPLE: falta Entorno y Medida de respuesta numérica]` en vez de aceptarse tal cual.

**Estado real de este artefacto (importante antes de armar el informe final):** hubo **dos líneas de trabajo en paralelo** que terminaron concatenadas sin deduplicar en el archivo `requisitos-funcionales-y-no-funcionales-final-final.md`:
- Un primer bloque de **53 RQF + varios RQNF** (numeración RQF-001 a RQF-053), más granular, con columna de verificación redactada en detalle (PF-xx).
- Un segundo bloque de **13 RQF + 8 RQNF** (RQF-001 a RQF-013 reutilizando IDs, RQNF-001 a RQNF-008), más consolidado/de alto nivel, con la columna de verificación vacía (placeholder `PF-`).

El propio archivo de Fase 6 lo señala explícitamente como **pendiente de reconciliar antes de la entrega final** — no se resolvió en la fase de pruebas porque no era su alcance, solo se usó como fuente citando cada bloque por separado. Esto es algo que **hay que cerrar antes de armar el informe final o la presentación**, porque tal como está hoy en el repo, la tabla de requisitos del informe tiene IDs duplicados (dos "RQF-001", etc.).

Dos requisitos quedaron marcados explícitamente como **no verificables tal como están** (RQF-034 y RQF-052), siguiendo la misma filosofía de "documentar el vacío, no inventar un umbral" — por ejemplo, RQF-034 depende del tramo de precio sin definir sobre 10.000 validaciones (relacionado con H-16), y RQF-052 pide "medir fallos y sesgos" sin que exista una métrica definida de qué es un sesgo.

---

## 7. Fase 6 — Pruebas funcionales y extra-funcionales (§5.3.4, §5.3.5)

**Técnica:** Plan-and-Solve (planificar cobertura antes de redactar caso por caso) + Structured Output (formato fijo) + Grounded Prompting (cada prueba cita su RQF/RQNF de origen y, cuando aplica, el hallazgo H-xx que fijó el valor concreto que se está verificando).

**Resultado:**
- **45 pruebas funcionales (PF-001 a PF-045):** 42 cubren uno a uno los RQF Must (se excluyó deliberadamente RQF-013, sobre el conteo regresivo de tiempo restante, con justificación documentada), y 3 adicionales cubren extensiones de los casos de uso críticos cuyo RQF de origen no era Must.
- **11 pruebas extra-funcionales (PX-001 a PX-011):** rendimiento, disponibilidad, continuidad ante caída de proveedor externo, seguridad, cumplimiento normativo, usabilidad, volumen de datos, escalabilidad. La prueba de escalabilidad (PX-011) se dejó marcada explícitamente como **no verificable** — hereda el mismo veredicto `[NO CUMPLE]` que ya tenía el RNF correspondiente en Fase 5, en vez de inventarle un umbral.

**Exclusiones justificadas explícitamente** (buen material para la sección "por qué eligieron esos atributos y no otros"): no se generó prueba de "consumo de recursos del dispositivo" porque MIRA es una plataforma cloud/web sin componente móvil propio en este alcance (la app móvil de captura está fuera de alcance, §5.1); tampoco se probó "reversibilidad de despliegue" porque es una propiedad de *release engineering*, no un atributo de calidad observable por el usuario final — no encaja en las seis categorías que pide el enunciado.

---

## 8. Fase 8 — Diagrama de secuencia de sistema (§5.3.7)

**Caso de uso elegido:** UC-02 (Integrar caso vía interfaz de programación), en su **Flujo B** (el que rige realmente para el cliente piloto tras resolver H-13). MIRA se trata como caja negra —sin descomponer Controller/Service/Repository— con solo 3 actores visibles: Sistema del Cliente, MIRA, Sistema de Siniestros del Cliente.

**Técnica:** Grounded Prompting, pero anclado no a una fuente documental sino **al propio caso de uso ya escrito** — cada mensaje del diagrama debe citar el número de paso exacto de CU-02, y donde CU-02 dejó preguntas sin resolver (ej. rechazo vs. encolamiento por exceso de límite), el diagrama debe representarlo como **rama explícitamente sin resolver**, no elegir una opción para "verse terminado".

**Este es probablemente el ejemplo más valioso para la sección de Discusión del informe**, porque documenta un fallo sutil real en dos capas:

1. **Fallo obvio:** el modelo agregó un mensaje "MIRA valida el esquema del archivo" que no existe en CU-02 (esa verificación ocurre dentro de UC-01, no de UC-02). Fácil de detectar: no tenía cita.
2. **Fallo sutil ("el que de verdad importa"):** una primera versión del diagrama citaba un "Paso 6" con formato de cita perfectamente correcto — pero **ese paso no existe en ningún flujo real de CU-02** (Flujo A tiene 5 pasos, Flujo B tiene 3). El modelo había fusionado el arranque del Flujo A (síncrono) con el desenlace del Flujo B (archivo) bajo una numeración inventada. **Una primera revisión humana, chequeando "¿tiene cita? sí", no lo detectó** — pasó el checklist. Solo una **segunda revisión independiente**, releyendo CU-02 completo desde cero contra el diagrama, encontró que no existía tal paso 6. La lección explícita que dejaron escrita: *Grounded Prompting exige citar, pero no verifica que lo citado exista de verdad* — una cita con forma correcta pero contenido inventado es más peligrosa que un mensaje sin cita, porque pasa la revisión superficial.

Además, documentaron que un diagrama anclado **no se actualiza solo**: las tres preguntas abiertas del primer diagrama (arquitectura síncrona/asíncrona, transcripción manual, comportamiento ante exceso de límite) se resolvieron después en el informe (H-13, H-07, H-03), y hubo que hacer una pasada de re-verificación explícita del diagrama para reflejarlo — no ocurrió automáticamente.

**Versión final del diagrama:** representa el Flujo B completo con 3 ramas (`alt`): plataforma caída (evidencia queda en la carpeta sin pérdida), plataforma disponible (ejecuta UC-01, escribe resultado por archivo automáticamente), y exceso de volumen (marcado explícitamente como pregunta abierta, con el mismo peso visual que las ramas resueltas, en vez de una nota al margen).

---

## 9. Backlog (§5.3.6) — estado pendiente

No se encontró en el repositorio un archivo de backlog (historias de usuario, DoD) equivalente a los de las otras fases. El informe (`.docx`) tiene la sección "Backlog" con solo los encabezados de tabla (Campos, Historia, Requisitos, Criterios de aceptación, Estimación, Prioridad) **sin filas de contenido**. Esto es uno de los **siete artefactos obligatorios de §5.3** y su ausencia, según la rúbrica del curso, hace que "la sección completa se evalúe con la mitad del puntaje" — es el punto más urgente a cerrar antes de la entrega si aún no se hizo en una rama no revisada.

---

## 10. Las 5 técnicas de prompting — cómo quedaron documentadas en el informe (§4)

El informe (`.docx`) tiene una sección 4 con 5 subsecciones ya redactadas, cada una con Tarea realizada / Justificación técnica / Antes / Después:

1. **4.1 Grounded Prompting** — redacción de flujos de casos de uso (Fase 4) y extracción del modelo de dominio (Fase 3). Antes/después: el caso del umbral 85 vs 80 puntos omitido silenciosamente.
2. **4.2 Structured Output Prompting** — consolidación de inconsistencias en tabla Markdown (Fase 2). Antes/después: la interfaz de chat truncaba los timestamps `[mm:ss]` interpretándolos como sintaxis Markdown, y un formato de tabla transpuesta (16 columnas) forzaba a recortar contenido; se corrigió pidiendo bloque de código explícito con ítems en filas.
3. **4.3 LLM-as-a-Judge** — auditoría de RNF (Fase 5), con el ejemplo del RNF de "asincronía sin pérdida" marcado `[NO CUMPLE]`.
4. **4.4 Plan-and-Solve + Grounded Prompting** (combinadas) — selección de casos de uso críticos + redacción de su flujo.
5. **4.5 Plan-and-Solve Prompting** (sola) — selección de candidatos a caso de uso por riesgo, con el ejemplo de los 11 candidatos devueltos y 4 de riesgo alto.

**Nota:** el enunciado pide *al menos 5* técnicas nombradas con referencia bibliográfica formal. El informe actual no incluye las referencias bibliográficas (Wang et al. 2023 para Plan-and-Solve, Weller et al. 2024 para Grounded/"According to...", Tam et al. 2024 para Structured Output, Dhuliawala et al. 2024 para CoVe, Zheng et al. 2023 para LLM-as-a-Judge) — estas sí están listadas en `Resumen_Requisitos_con_Agentes_IA.md` (el resumen de clase) y deberían trasladarse al informe o a las diapositivas, porque la rúbrica exige "nombre formal de la técnica, en inglés, con la referencia bibliográfica correspondiente". **Chain-of-Verification (CoVe)** se planificó como técnica opcional (Fase 2 y Fase 8) pero no quedó documentado si efectivamente se ejecutó como tal en algún punto — vale la pena verificarlo antes de afirmarlo en la presentación.

---

## 11. Estado del informe final (`.docx`) — qué está completo y qué falta

Reconstruyendo el documento real (`informe proyecto/Informe Mira - LLM.docx`):

**Completo:** Resumen ejecutivo, Introducción, Modelo de dominio (glosario con ~15 términos), tabla de Requisitos funcionales y no funcionales (con la duplicación pendiente de resolver), sección 4 completa (5 técnicas con antes/después), sección 5.1 con los 16 hallazgos de inconsistencias con su resolución y decisión.

**Pendiente / vacío en el `.docx` actual:**
- **Backlog** (sección 3.6): solo encabezados de tabla, sin contenido.
- **Discusión** (sección 6): las 5 preguntas guía del enunciado están copiadas pero **sin respuesta** ("R:" vacío) — esta sección es explícitamente "reflexión propia del equipo, no delegable a un modelo", así que hay que redactarla a mano antes de la entrega.
- **Conclusiones** (sección 7): vacía.
- **Anexos** (sección 8): solo la plantilla de bitácora de decisiones (DEC-00) sin ninguna decisión real cargada — falta trasladar ahí los DEC-xx reales que respaldan las decisiones de H-01 a H-16, y los prompts/evidencia de antes-después.
- Diagrama de casos de uso y de secuencia: el `.docx` tiene los títulos de subsección pero conviene confirmar que las imágenes (`fase4/diagramasCU/*.png`, `fase8/sdd.png`) estén efectivamente insertadas en el documento y no solo referenciadas en los `.md` de trabajo.

---

## 12. Los hallazgos "meta" más útiles para la sección de Discusión y para responder preguntas del jurado

Estos son los momentos donde el proceso mismo, no solo el resultado, deja lecciones defendibles oralmente:

- **El modelo rellena huecos con fluidez, no con veracidad**: el caso del umbral 85/80 puntos, repetido en Fase 3 y Fase 4, muestra que sin una regla explícita de "señala, no elijas", el modelo produce una especificación limpia mezclando dos cifras contradictorias.
- **Una cita con formato correcto no garantiza que el contenido citado exista** — el bug del "Paso 6" en el SSD es el ejemplo más fuerte del proyecto: pasó una primera revisión humana precisamente porque *parecía* estar bien anclado.
- **No todo error atribuible al modelo es del modelo** — el caso del archivo mal adjuntado en la Fase 3 (error humano tras 30+ repeticiones manuales) es honestidad valiosa para la pregunta "¿dónde el modelo fue engañoso y dónde fue el equipo?".
- **Restricciones de plataforma pueden imitar comportamiento del prompt** — el marcador `[cite: n]` inyectado automáticamente al adjuntar archivos (no al pegar texto) es un matiz técnico que distingue "falla de la técnica de prompting" de "falla de la herramienta".
- **Un artefacto anclado (Grounded) no se propaga automáticamente cuando su fuente cambia** — el SSD quedó desactualizado respecto a decisiones tomadas después en Fase 2, y se necesitó una segunda pasada explícita de re-verificación.
- **Las decisiones humanas quedaron consistentemente separadas de las propuestas del modelo** en las columnas "Decisión" de la tabla de inconsistencias — el modelo nunca decide cuál fuente prevalece, solo presenta alternativas.

---

## 13. Checklist de lo que falta antes de la entrega

1. **Reconciliar la tabla de RF/RNF** (dos bloques con IDs duplicados en `requisitos-funcionales-y-no-funcionales-final-final.md`) en una sola tabla priorizada MoSCoW sin duplicados.
2. **Completar el Backlog** (§3.6) — historias de usuario con criterios de aceptación verificables, estimación y DoD (6–10 ítems) — es uno de los 7 artefactos obligatorios y penaliza fuerte si falta.
3. **Redactar Discusión y Conclusiones** en el `.docx` — actualmente son placeholders vacíos, y son secciones explícitamente no delegables al modelo.
4. **Cargar la bitácora de decisiones (Anexos)** con los DEC-xx reales que sustentan H-01 a H-16, más evidencia de prompts (capturas) referenciada en la sección 4.
5. **Agregar las referencias bibliográficas formales** de las 5 técnicas a la sección 4 o a las diapositivas.
6. Confirmar que los diagramas (casos de uso, dominio, SSD) están efectivamente insertados como imágenes en el `.docx`, no solo linkeados en los `.md` de trabajo.
7. Verificar extensión del informe contra los máximos de la rúbrica (8 planas para análisis de requisitos, 2 planas para técnicas, 2 planas para inconsistencias, etc.) — con 53+13 RQF y 45+11 pruebas, el riesgo de exceder el límite de página es real y "lo que sigue no se lee".

---

*Documento generado a partir de una revisión completa del repositorio (commits, artefactos de cada fase e informe `.docx`) para servir de guía de preparación de la presentación oral y como referencia rápida ante posibles preguntas.*

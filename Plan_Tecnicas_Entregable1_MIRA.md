# Plan de trabajo — Entregable 1: Caso MIRA
### Qué técnica usar en cada fase, dónde combinar, y dónde exige revisión humana

> Este documento es una guía de referencia para ordenar el trabajo, no un procedimiento rígido. Está pensado para decidir **antes** de abrir el documento MIRA-descripcion-proyecto.docx, siguiendo la recomendación del enunciado: no partir pidiéndole un resumen al modelo.

**Leyenda:**
- 🎯 Técnica recomendada
- 🔀 Encajan varias técnicas — quedan las opciones para que decidan como equipo
- 👤 Punto que exige revisión / decisión humana antes de dar por cerrado el paso

---

## Fase 0 — Antes de tocar el documento

**Objetivo:** no perder las contradicciones que vive en los detalles, que es justo lo que el enunciado advierte que pasa si se pide un resumen directo.

🎯 **Plan-and-Solve Prompting** — antes de extraer nada, pídele al modelo (o decidan ustedes) un plan de lectura: en qué orden se procesa el documento (capítulo por capítulo, cruzando con las entrevistas ENT1–ENT8), qué se extrae de cada sección, y en qué formato queda cada extracción. No ejecuten la extracción todavía — solo el plan, y revísenlo entre ustedes antes de aplicarlo.

👤 El plan de lectura lo aprueba el equipo, no se ejecuta directo lo que proponga el modelo.

### Plan de lectura sugerido (a falta de tener el docx real a la vista)

Basado en las pistas que ya deja el enunciado (numeración §1, §2.5.x; reglas RN-xx; no funcionales RNF-xx; entrevistas ENT1 a ENT8 con timestamp), el documento parece tener al menos tres capas distintas — cuerpo narrativo, reglas/no-funcionales referenciadas aparte, y transcripciones de entrevistas — que conviene leer en pasadas separadas en vez de una sola lectura corrida. Si suben el .docx real ajusto esto al índice exacto, pero la lógica de las pasadas no debería cambiar mucho:

**Pasada 1 — Mapa estructural (sin leer contenido en detalle, ~10-15 min).**
Recorran solo el índice y los títulos de sección. Anoten: cuántos capítulos tiene, si existe un listado consolidado de reglas de negocio (RN-xx) y no funcionales (RNF-xx) en algún anexo, y cuántas entrevistas hay y de qué rol es cada entrevistado (técnico, supervisor, cliente, etc. — el rol importa para pesar después una opinión vs. un requisito real). El objetivo es tener el "esqueleto" antes de llenarlo, para que la Fase 1 (inventario) tenga dónde archivar cada cosa.

**Pasada 2 — Cuerpo del documento, sección por sección, en orden.**
Lean cada sección completa y, por cada afirmación relevante, clasifíquenla en el momento con la misma taxonomía de la Fase 1 (necesidad / solución ya decidida / opinión / regla de negocio) — no resuman, solo etiqueten y sigan. Pueden dividirse el documento por capítulos entre el equipo; lo importante es que sea lectura humana antes de meter al modelo, precisamente porque el enunciado advierte que "las contradicciones viven en los detalles que el resumen elimina".

**Pasada 3 — Entrevistas, cruzadas con la Pasada 2, no leídas aparte.**
No lean las 8 entrevistas de corrido al final: vayan tema por tema. Si en la Pasada 2 marcaron que §2.5.2 habla de tiempo de respuesta, busquen en ese momento qué dice cada entrevista sobre tiempo de respuesta. El enunciado ya advierte que el cuerpo del documento "no siempre recoge fielmente lo que se dijo" en las entrevistas — cruzarlas de inmediato es la forma de notarlo mientras el contexto de la sección sigue fresco, en vez de descubrirlo recién en la Fase 2.

**Pasada 4 — Consolidación.**
Recién acá se junta todo en el inventario único de la Fase 1 (con Grounded + Structured Output). Las Pasadas 1-3 son lectura y etiquetado humano; la Fase 1 formal es donde eso se pasa a un formato citable y estructurado con ayuda del modelo.

**Plantilla para pedirle el plan afinado al modelo una vez tengan el .docx abierto (Plan-and-Solve real):**
```text
Aquí está el índice completo de MIRA-descripcion-proyecto.docx: [pegar índice/títulos].
También hay 8 entrevistas transcritas (ENT1 a ENT8) referenciadas por timestamp.

NO extraigas contenido todavía.

Propón un plan de lectura por secciones, en este formato:
[
  {
    "seccion": "...",
    "que_buscar": "...",
    "entrevistas_relacionadas_probables": "...",
    "riesgo_de_contradiccion": "alto/medio/bajo y por qué"
  }
]

Ordena por riesgo de contradicción primero, no por orden del índice.
```
Esto invierte el orden "natural" de lectura: conviene leer primero las secciones que el propio plan marque como de mayor riesgo, no necesariamente empezar por la sección 1 — así el equipo llega con más atención justo donde más rinde.

👤 El plan de lectura (el sugerido arriba y el que devuelva el modelo con el índice real) lo aprueba el equipo antes de ejecutarlo. Si suben el documento real conviene volver a correr este paso con el índice verdadero, en vez de asumir que la numeración §2.5.x se mantiene igual en todo el documento.

---

## Fase 1 — Inventario estructurado del documento y las entrevistas

**Objetivo:** convertir las 29 páginas + entrevistas en una base de datos de afirmaciones citables, antes de escribir ningún artefacto de análisis.

🔀 **Grounded Prompting + Structured Output Prompting, combinadas.**
- *Structured Output* define el esquema de cada afirmación extraída: `{texto, fuente, tipo (necesidad / solución ya decidida / opinión / regla de negocio), seccion_o_entrevista}`.
- *Grounded Prompting* obliga a que cada entrada del inventario cite exactamente §x.y o ENTn [mm:ss], y que lo que no tenga cita quede fuera del inventario en vez de completarse por inferencia.

Usarlas juntas es más natural que elegir una: el esquema fijo sin la regla de anclaje se llenaría de inferencias silenciosas, y el anclaje sin esquema fijo produce prosa que vuelve a esconder los vacíos.

**Por qué conviene separar esta fase de las siguientes:** el documento "mezcla necesidades, soluciones ya decididas y opiniones personales" (enunciado, §2). Etiquetar el *tipo* de cada afirmación en el inventario evita arrastrar una opinión personal como si fuera un requisito en los artefactos que vienen después.

👤 Revisar una muestra del inventario contra el documento original antes de seguir — una cita mal puesta acá se propaga a todos los artefactos que dependen de ella, y el enunciado penaliza el doble una cita que no corresponde.

---

## Fase 2 — Detección de inconsistencias (§5.5)

**Objetivo:** encontrar contradicciones entre fuentes, ambigüedades, vacíos y requisitos no verificables.

🔀 Dos formas razonables de encarar esto — elijan según cuánto tiempo quieran invertir:

- **Opción A — Grounded Prompting sobre el inventario ya construido:** pedirle al modelo que agrupe las entradas del inventario por tema y señale dónde dos entradas con distinta fuente se contradicen, exigiendo que cite ambas.
- **Opción B — variante del principio de CoVe (aislar el contexto):** el mismo modelo que arma el inventario tiende a ser "generoso" resolviendo tensiones sin avisar, igual que pasa cuando se le pide que revise su propio resumen. Si notan que el modelo está "limando" contradicciones en vez de reportarlas, prueben pedir la comparación en una conversación nueva, dándole solo dos fragmentos del inventario a la vez (sin el resto del análisis a la vista) y preguntando explícitamente "¿estas dos afirmaciones son compatibles? cita ambas".

Empiecen con la Opción A; si ven que el modelo suaviza conflictos reales, cambien a la B para esa parte.

👤 **La resolución de cada inconsistencia (columna "Decisión" de la tabla §5.5) es 100% humana.** El modelo puede proponer alternativas — nunca elegir cuál prevalece. Eso lo decide el representante del cliente y queda en la bitácora (DEC-xx).

---

## Fase 3 — Modelo de dominio (§5.3.1)

🎯 **Grounded Prompting.** Cada entidad y cada relación del diagrama debe poder citar la frase del inventario que la justifica. Esto es literalmente la contramedida que se vio en clase contra "inventa entidades plausibles" (el modelo mete "Departamento" o "Turno" porque las vio mil veces en su entrenamiento, no porque el documento las mencione).

Al pedir el glosario, exijan explícitamente que declare cuándo dos términos del documento se refieren al mismo concepto del negocio (el enunciado avisa que el vocabulario es inconsistente entre fuentes) — eso es también anclaje en fuentes, no una técnica aparte.

👤 Revisar que ninguna entidad tenga cardinalidad "limpia" donde el negocio tiene una excepción mencionada en una entrevista — eso no lo detecta el modelo solo, hay que leerlo contra el inventario.

---

## Fase 4 — Casos de uso (§5.3.2)

🔀 **Plan-and-Solve + Grounded Prompting, en dos pasos distintos.**
1. *Plan-and-Solve* para decidir **cuáles tres** casos de uso son los más críticos (por riesgo, según pide el enunciado) — pídanle al modelo una lista de candidatos con el riesgo estimado de cada uno y por qué, antes de especificar ninguno en detalle. Esa selección se revisa y se justifica en una línea, como pide el enunciado.
2. *Grounded Prompting* al redactar el flujo principal y, sobre todo, las extensiones — cada extensión (3a, 3b, 3c) debe citar de dónde sale, o quedar listada aparte como pregunta pendiente para el representante del cliente. Esto ataca directamente el error típico de "extensiones genéricas" visto en clase.

👤 La elección final de los tres casos de uso críticos la valida el equipo — el riesgo de negocio no siempre es evidente solo desde el texto.

---

## Fase 5 — Requisitos funcionales y no funcionales (§5.3.3)

🔀 **Structured Output Prompting + Grounded Prompting** para generar la tabla (mismo combo de la Fase 1, aplicado ahora a nivel de requisito: ID, tipo, enunciado, prioridad, fuente, verificación).

🎯 Además, **LLM-as-a-Judge** específicamente para los requisitos no funcionales: la clase señaló de forma explícita correr la rúbrica de esta técnica sobre la lista de RNF antes de aceptarla. Rúbrica sugerida: ¿tiene las 6 partes del escenario (fuente, estímulo, artefacto, entorno, respuesta, medida)? ¿el umbral es numérico o verificable objetivamente? Cada RNF que no cumpla se marca `NO CUMPLE` con la parte que falta — no se corrige automáticamente, vuelve al equipo.

👤 La priorización MoSCoW final es decisión del equipo. El enunciado es explícito: "una lista donde todo es Must no es una priorización" — eso hay que discutirlo, no delegarlo.

---

## Fase 6 — Casos de prueba, funcionales y extra-funcionales (§5.3.4, §5.3.5)

🔀 **Plan-and-Solve** primero (planificar qué casos cubren cada requisito Must y qué flujos alternativos/de excepción faltan, antes de redactar los casos uno por uno) + **Structured Output Prompting** para el formato de cada caso (ID, verifica, precondición, pasos, resultado esperado).

👤 Revisar que exista al menos un caso por flujo alternativo o de excepción de cada caso de uso detallado — el enunciado marca esto como requisito explícito y es fácil que el modelo cubra solo el camino feliz si no se le pide expresamente.

---

## Fase 7 — Backlog (§5.3.6)

🔀 **Structured Output Prompting** para el formato de cada historia (ID, historia, requisitos, criterios de aceptación, estimación, prioridad) + 🎯 **LLM-as-a-Judge** para revisar que los criterios de aceptación no sean circulares. Esto también estaba explícito en la clase anterior como contramedida al backlog "inflado" (criterios tipo "dado que soy usuario, cuando hago X, entonces pasa X" que no verifican nada).

👤 **La estimación de tamaño relativo la define el equipo, no el modelo** — no existe velocidad histórica que el modelo pueda usar, así que cualquier número que proponga es una simulación, no una estimación real.
👤 El orden del backlog (por valor y riesgo) también se valida en equipo, no se acepta el orden que proponga el modelo sin revisar el criterio.

---

## Fase 8 — Diagrama de secuencia de sistema (§5.3.7)

🎯 **Grounded Prompting**, anclado esta vez no a una fuente externa sino al propio caso de uso ya especificado: cada mensaje del diagrama debe asociarse al número de paso del flujo principal o de una extensión ya escrita. Si el modelo agrega un mensaje que no está en el caso de uso, es un error, no un detalle extra.

Opcional, si el diagrama sale con inconsistencias: usar el mismo principio de aislamiento de CoVe — pedir en una conversación nueva "¿este diagrama contiene algún paso que no aparezca en este caso de uso?" pasando ambos documentos, sin el historial de cómo se generó el diagrama.

👤 Revisión de consistencia final entre el diagrama (5.3.7) y el caso de uso (5.3.2) — el enunciado lo dice explícito: "si el diagrama muestra un paso que el caso de uso no menciona, uno de los dos está mal".

---

## Fase 9 — Redacción de "Técnicas de prompting utilizadas" (§5.4)

No es una fase de análisis, es documentación. A medida que avancen por las fases 1 a 8, **vayan guardando el prompt real y su salida cuando noten un antes/después claro** (ej. el inventario sin Grounded Prompting vs. con él, o los RNF antes y después de pasar la rúbrica de Judge). El enunciado pide justamente eso — antes/después, no una lista genérica de técnicas — y es mucho más fácil juntarlo sobre la marcha que reconstruirlo al final.

👤 Incluyan también los casos donde una técnica no funcionó bien para su caso — el enunciado dice explícitamente que eso suma puntaje.

---

## Resumen — técnica por fase

| Fase | Técnica(s) | ¿Combinadas o a elegir? |
|---|---|---|
| 0. Plan de lectura | Plan-and-Solve | Única |
| 1. Inventario del documento | Grounded + Structured Output | Combinadas |
| 2. Inconsistencias | Grounded (+ variante de CoVe si hace falta aislar) | A elegir según necesidad |
| 3. Modelo de dominio | Grounded | Única |
| 4. Casos de uso | Plan-and-Solve (selección) + Grounded (redacción) | Combinadas, en pasos distintos |
| 5. RF y RNF | Structured Output + Grounded + Judge (solo RNF) | Combinadas |
| 6. Casos de prueba | Plan-and-Solve + Structured Output | Combinadas |
| 7. Backlog | Structured Output + Judge | Combinadas |
| 8. SSD | Grounded (+ CoVe opcional) | Principal + opcional |

---

## Checklist de revisión humana (no delegable al modelo)

- [ ] Resolución de cada inconsistencia y su justificación (bitácora DEC-xx)
- [ ] Verificación de una muestra de citas del inventario contra el documento original
- [ ] Selección final de los 3 casos de uso críticos y del caso de uso del SSD
- [ ] Priorización MoSCoW de los requisitos
- [ ] Estimación de tamaño y orden final del backlog
- [ ] Consistencia final entre el SSD y el caso de uso correspondiente
- [ ] Sección de Discusión (§5.6) — reflexión propia del equipo, no delegable por definición

---

## Puntos abiertos para decidir en equipo

1. **Fase 2 (inconsistencias):** ¿parten directo con la variante de aislamiento (Opción B) o prueban primero la más simple (Opción A) y solo cambian si ven que el modelo suaviza conflictos?
2. **Fase 8 (SSD):** ¿usan el chequeo de aislamiento tipo CoVe siempre, o solo si a simple vista el diagrama y el caso de uso no calzan?
3. **Rol de representante del cliente:** definan quién lo asume en esta entrega y si van a rotarlo — afecta cómo distribuyen las fases 2, 4 y 7, que dependen más de decisiones que de generación.

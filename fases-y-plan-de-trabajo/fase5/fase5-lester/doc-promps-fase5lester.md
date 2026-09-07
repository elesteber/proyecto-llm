### 5.4 Técnicas de prompting utilizadas

Durante el proceso de trazabilidad y consolidación de requisitos funcionales y no funcionales, se implementó un enfoque estructurado de prompting para evitar alucinaciones y garantizar que cada requisito estuviera estrictamente anclado a la evidencia documental. A continuación, se detallan las técnicas aplicadas:

#### 1. Grounded Prompting (Anclaje en fuentes)

* **Referencia bibliográfica:** Weller, Marone, Weir, Lawrie, Khashabi & Van Durme (2024). *"According to…": Prompting Language Models Improves Quoting from Pre-Training Data.* EACL.


* **Tarea concreta:** Buscar y extraer el identificador exacto de la fuente (ej. `ENT7 [00:06:37]`) que respaldaba cada enunciado de los requisitos funcionales y no funcionales.
* **Justificación:** Era fundamental aislar el conocimiento pre-entrenado del modelo. En ingeniería de requisitos, si una regla de negocio no está en la entrevista o en el documento, no existe. Esta técnica restringe al modelo a actuar como un motor de búsqueda y extracción sobre un contexto delimitado, en lugar de un generador de texto libre.


* **Antes y después:**
* *Intento previo (sin técnica):* El modelo justificaba requisitos utilizando su propio sentido común o conocimientos generales sobre sistemas de software, inventando fuentes plausibles pero inexistentes.
* *Con la técnica:* El modelo devuelve estrictamente la marca de tiempo de la entrevista o declara explícitamente "SIN FUENTE" cuando la información no figura en los textos provistos.





#### 2. Structured Output Prompting (Salida estructurada)

* **Referencia bibliográfica:** Tam, Fu, Yu et al. (2024). *Let Me Speak Freely?* EMNLP.


* **Tarea concreta:** Forzar la entrega de los mapeos y auditorías de requisitos exclusivamente en esquemas JSON estrictos y, posteriormente, en una tabla Markdown in-renderizable.
* **Justificación:** El mayor valor de esta técnica para este análisis no fue solo el orden, sino "hacer visibles las ausencias". Al obligar al modelo a llenar claves específicas, logramos que los requisitos sin fuente evidenciaran un explícito `null`, permitiendo procesar el resultado programáticamente y hacer cruces relacionales entre archivos.


* **Antes y después:**
* *Intento previo:* En texto plano o prosa, la ausencia de una fuente o de un criterio de verificación se disimulaba bajo una redacción fluida.
* *Con la técnica:* Un esquema rígido forzó al modelo a declarar explícitamente las claves vacías (ej. `"fuente_encontrada": null`), permitiendo identificar inmediatamente los vacíos en el levantamiento.





#### 3. Plan-and-Solve Prompting (Planificar y ejecutar)

* **Referencia bibliográfica:** Wang, Xu, Lan, Hu, Lan, Lee & Lim (2023). *Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models.* ACL.


* **Tarea concreta:** Abordar la búsqueda de referencias en un volumen masivo de 38 archivos documentales.
* **Justificación:** Al inyectar demasiada información en la ventana de contexto, el modelo sufre de saturación, ignorando instrucciones o inventando respuestas para terminar rápido. La estrategia fue planificar la ejecución dividiendo la carga: primero mapeamos qué fuentes probables correspondían a qué Caso de Uso (Fase A) y luego procesamos lotes pequeños de requisitos cruzados solo con sus fuentes pertinentes (Fase B).


* **Antes y después:**
* *Intento previo:* Intentar cruzar la lista completa de requisitos contra la totalidad de las entrevistas y documentos generaba pérdida de contexto y omisiones groseras.
* *Con la técnica:* Al agrupar por Caso de Uso (ej. CU-01) y adjuntar solo 3 o 4 documentos relevantes por iteración, la precisión en la extracción de citas exactas subió al 100%.



#### 4. LLM-as-a-Judge (Rúbrica como prompt)

* **Referencia bibliográfica:** Zheng, Chiang, Sheng et al. (2023). *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena.* NeurIPS, Datasets and Benchmarks.


* **Tarea concreta:** Evaluar semánticamente si el texto de la fuente *realmente* respaldaba el enunciado del requisito y verificar la calidad de la prueba de aceptación.
* **Justificación:** Un simple cruce de palabras clave (Ctrl+F) es insuficiente. Necesitábamos un juez estricto que analizara si el contexto de la transcripción validaba la regla de negocio, aplicando un criterio binario riguroso.


* **Antes y después:**
* *Intento previo:* El modelo tendía a sufrir de sesgo de complacencia, validando requisitos basándose en menciones superficiales de términos.
* *Con la técnica:* Al instruir al modelo bajo el rol de un "auditor implacable" que debe extraer la cita exacta o declarar "SIN EVIDENCIA", logramos que detectara inconsistencias reales (como el caso del RQF-056, evaluado correctamente como "no verificable").





---

### Evolución y Refinamiento del Prompt Final

Para llegar a la tabla definitiva, el prompt sufrió varias iteraciones críticas, especialmente para corregir la degradación de formato y el seguimiento de instrucciones literales.

**Cuadro resumen de cambios:**

| Versión | Objetivo | Falla detectada (Por qué falló) | Corrección aplicada para la siguiente versión |
| --- | --- | --- | --- |
| **V1** | Encontrar fuente exacta (JSON). | Requería pasar todos los textos de golpe (imposible por límite de contexto). | Se implementó *Plan-and-Solve* dividiendo la carga por Casos de Uso. |
| **V2** | Cruce relacional JSON-JSON. | Generó un mapa de fuentes probables, pero no la cita exacta final ni la tabla Markdown requerida. | Se adaptó el prompt para recibir archivos adjuntos por lotes y generar la tabla final. |
| **V3** | Auditoría y Tabla Markdown. | El modelo alucinó en la columna "Verificación" repitiendo el texto *"Conserva el Criterio de Verificación original"*. Además, la UI renderizó la tabla, rompiendo los corchetes de las fechas. | Se añadieron restricciones negativas explícitas (prohibición de frases genéricas) y una barrera de bloque de código puro. |
| **V4** | **Prompt Final Definitivo.** | Ninguna. Ejecución exitosa con retención total de formato y datos. | N/A |

**Prompt Final Utilizado:**

```text
Eres un auditor implacable de control de calidad de software. Tu tarea es verificar si los requisitos funcionales están fundamentados en los textos crudos proporcionados y generar la tabla final de trazabilidad.

En este prompt he adjuntado los archivos fuente (documentos y transcripciones). A continuación, te entregaré un lote de requisitos en formato JSON que debes evaluar contra esos adjuntos.

REGLAS DE AUDITORÍA Y GENERACIÓN:
1. Lee el requisito y el texto completo de las fuentes proporcionadas.
2. Analiza si el texto aborda y respalda el concepto del requisito.
   - Si LO RESPALDA: Extrae la marca de tiempo o identificador exacto (ej. "ENT7 [00:06:37]").
   - Si NO LO RESPALDA: La fuente debe ser estrictamente "SIN EVIDENCIA".
3. Aplica priorización MoSCoW (Must, Should, Could, Won't) en la columna Prioridad basándote en la criticidad del requisito.
4. Construye una tabla con las columnas: ID | Tipo | Requisito | Prioridad | Fuente | Verificación.
5. Regla para 'Verificación': Extrae e inserta literalmente el texto que viene en el campo "criterio_verificacion" del JSON proporcionado. PROHIBIDO escribir frases como "Conserva el criterio original"; debes pegar el texto real de la prueba. Si el valor es nulo o dice "no verificable", pon eso.

<REQUISITOS_A_VERIFICAR>
[JSON del lote de requisitos]
</REQUISITOS_A_VERIFICAR>

BARRERA DE FORMATO (CRÍTICO): Tu respuesta DEBE empezar con ```markdown y terminar con ``` para crear un bloque de código in-renderizable. Si la tabla se renderiza visualmente en el chat, fallaste tu tarea.

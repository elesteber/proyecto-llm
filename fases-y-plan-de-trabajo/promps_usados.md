### Técnicas Utilizadas

| Técnica | Propósito en el Proyecto | Extracto del Prompt Clave |
| :--- | :--- | :--- |
| **Grounded Prompting** | Anclar al modelo estrictamente a las entrevistas e inventarios, impidiendo que invente supuestos genéricos o llene vacíos con conocimiento externo. | *"Trabaja ÚNICAMENTE con las entradas del inventario [...] Cada paso del flujo [...] debe terminar citando su fuente exacta"*. |
| **Structured Output** | Forzar esquemas fijos (tablas Markdown o JSON) para estandarizar las salidas, visibilizar datos faltantes y evitar el truncamiento de información larga. | *"Genera una tabla en formato Markdown [...] No resumas ni acortes ningún campo [...] Devuelve la tabla dentro de un bloque de código markdown"*. |
| **LLM-as-a-Judge** | Convertir al modelo en un auditor estricto para evaluar los Requisitos No Funcionales (RQNF) contra una rúbrica de 6 partes, asegurando métricas objetivas. | *"Pásalo por esta rúbrica de evaluación [...] Si el RQNF NO CUMPLE [...] agrega al final la etiqueta: [NO CUMPLE: falta {indicar qué parte}]"*. |
| **Plan-and-Solve** | Separar la planificación (seleccionar casos por riesgo) de la ejecución (redactar los flujos), evitando sesgos y compromisos prematuros. | *"NO redactes ningún caso de uso todavía. A partir del inventario, identifica el conjunto de casos de uso [...] Ordena por riesgo"*. |

### Técnica Descartada

| Técnica | ¿Por qué NO se utilizó? |
| :--- | :--- |
| **Resumen de Texto (Summarization)** | Porque las contradicciones, opiniones conflictivas y vacíos legales viven exactamente en los detalles que un resumen elimina automáticamente. Pedir un resumen inicial del documento habría destruido la posibilidad de detectar las inconsistencias críticas que sustentaron todo el análisis. |

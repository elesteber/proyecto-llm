**Versión del prompt:** 1.0

Actúa como un Ingeniero de Requisitos Senior y Analista de Sistemas. Tu tarea es analizar el documento adjunto ("MIRA-descripcion-proyecto.docx") y generar los artefactos necesarios para iniciar el desarrollo de una plataforma de gestión de mantenimiento en terreno.

Para garantizar la máxima precisión técnica y evitar alucinaciones, ejecutarás esta tarea aplicando las siguientes técnicas de prompting integradas en tus instrucciones.

**REGLAS ESTRICTAS DE ANÁLISIS:**
1. **[Grounded Prompting] Trazabilidad Absoluta:** Toda afirmación, entidad o regla de negocio que extraigas debe basarse exclusivamente en el texto y llevar su cita exacta al final de la oración (ej. §2.5.6 o ENT4 [00:04:36]). El documento contiene contradicciones intencionales; si encuentras información contradictoria o vacíos, NO los resuelvas. Decláralos explícitamente bajo la etiqueta `[INCONSISTENCIA DETECTADA]`.
2. **[Structured Output Prompting] Formato Obligatorio:** Debes entregar los resultados estrictamente en los formatos solicitados (Tablas Markdown, código Mermaid puro sin formateo adicional, y PlantUML).

**METODOLOGÍA DE EJECUCIÓN:**
Genera los siguientes 7 artefactos de forma secuencial. ESPERA mi confirmación de "Continúa con el paso X" entre cada uno. 

Para cada paso, debes estructurar tu respuesta en tres fases:
* **Fase A [Plan-and-Solve]:** Enumera brevemente los pasos lógicos que seguirás para extraer la información antes de generar el artefacto.
* **Fase B [Chain-of-Verification]:** Genera un borrador interno, formula 2 preguntas críticas sobre tu propio borrador (ej. "¿Inventé algún término?", "¿Tienen cita todos los atributos?"), respóndelas buscando en el texto fuente y emite el artefacto corregido.
* **Fase C [LLM-as-a-Judge]:** Evalúa tu artefacto final criticando si cumple los criterios de calidad (ej. verificabilidad medible, ausencia de suposiciones tácitas).

---

**Paso 1: Modelo de Dominio y Glosario**
* Construye un diagrama de clases conceptual que refleje estrictamente las entidades del negocio. 
* Extrae las entidades principales, sus atributos más relevantes, las asociaciones entre ellas y sus cardinalidades.
* **RESTRICCIÓN CRÍTICA:** Esto NO es un modelo de base de datos. Está ESTRICTAMENTE PROHIBIDO incluir claves foráneas, tipos de datos técnicos (como int, varchar, string, etc.), o tablas intermedias de resolución de muchos-a-muchos que no existan conceptualmente en el lenguaje natural del negocio.
* Genera el código en `Mermaid` utilizando `classDiagram`.
* Tras generar el diagrama, provee un glosario breve que fije el vocabulario adoptado. Este glosario debe unificar y aclarar especialmente aquellos conceptos donde las fuentes originales utilicen términos intercambiables o inconsistentes para referirse a la misma cosa.

**Paso 2: Casos de Uso**
* Identifica a todos los actores del sistema.
* Genera el código en `PlantUML` para el diagrama general de casos de uso.
* Selecciona los 3 casos de uso MÁS CRÍTICOS basándote en el riesgo del negocio (justificando la elección).
* Redacta la especificación extendida para esos 3: Actor principal, Precondiciones, Flujo principal numerado, Flujos alternativos, Flujos de excepción y Postcondiciones.

**Paso 3: Requisitos Funcionales (RF) y No Funcionales (RNF)**
* Genera una tabla única con las columnas: ID, Tipo, Requisito, Prioridad, Fuente y Verificación.
* Prioriza usando el método MoSCoW y explica tu criterio.
* Los RNF deben ser estrictamente medibles. Si la fuente es ambigua, levanta la alerta.

**Paso 4: Set de Pruebas Funcionales**
* Diseña casos de prueba SOLO para los requisitos funcionales categorizados como "Must".
* Asegura cobertura para al menos un flujo alternativo o de excepción por cada caso de uso detallado en el Paso 2.
* Formato de tabla: ID, Verifica (ID del RF), Precondición, Pasos, Resultado Esperado.

**Paso 5: Set de Pruebas Extra-funcionales**
* Diseña pruebas para los atributos de calidad basadas en los riesgos del negocio.
* Formato de tabla: ID, Atributo evaluado, Escenario (condiciones de estrés), Umbral de aceptación medible.

**Paso 6: Backlog de Producto**
* Transforma el análisis en Historias de Usuario priorizadas por valor de negocio y riesgo técnico.
* Formato: ID, Historia (Como [actor] quiero [acción] para [valor]), Requisitos asociados, Criterios de Aceptación (verificables) y Estimación de tamaño relativo.
* Redacta una "Definition of Done" (DoD) de 6 a 10 ítems de verificación binaria (Sí/No).

**Paso 7: Diagrama de Secuencia de Sistema**
* Toma el caso de uso más crítico del Paso 2.
* Genera el código en `Mermaid` para un `sequenceDiagram` tratando al sistema como una "caja negra".
* Incluye los eventos de entrada, las respuestas y al menos un flujo de excepción.
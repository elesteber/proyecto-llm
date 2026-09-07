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


## Anexos

### Anexo A: Evidencia de uso - Salida del Prompt Final de Consolidación

A continuación se expone la salida directa (Matriz de Requisitos Funcionales y No Funcionales) generada por el modelo tras la ejecución del "Prompt Final Utilizado", documentado en la sección 5.4. 

Esta salida demuestra la aplicación conjunta de las técnicas de *Plan-and-Solve* (ordenamiento y reasignación en pasos), *LLM-as-a-Judge* (fusión semántica de duplicados) y *Structured Output* (formato de tabla estricto).

| ID | Tipo | Requisito | Prioridad | Fuente | Verificación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| RQF-001 | Funcional | El sistema debe procesar la ingesta de archivos de evidencia mediante peticiones HTTP dirigidas a su API expuesta. | Must | Sección 2.10, §2.4, §1.6 (piloto 3) | Enviar una petición POST a la API con un PDF adjunto y validar que el sistema responde con un código 200 y el ID del caso. |
| RQF-002 | Funcional | El sistema debe capturar automáticamente los archivos de evidencia depositados en una carpeta compartida de red monitoreada. | Must | ENT7 [00:01:06], §2.4, §1.6 (piloto 3) | Colocar un documento PDF en el directorio de red configurado y constatar que el sistema inicia un caso con dicho archivo sin intervención manual. |
| RQF-003 | Funcional | El sistema debe determinar la legibilidad del archivo recibido antes de invocar los recursos del motor de análisis. | Must | Sección 2.4, §1.6 (piloto 3) | Cargar un archivo de imagen corrupto y comprobar que el sistema interrumpe el caso emitiendo un estado de "Evidencia ilegible" sin iniciar el procesamiento. |
| RQF-004 | Funcional | El sistema debe derivar a revisión asistida los casos cuyo puntaje se encuentre en el rango intermedio definido, o aquellos con señales bajo el mínimo aceptable. | Must | Sección 2.6, §3, ENT3 [00:18:36], ENT2 [00:13:05] | Procesar un caso que arroje 75 puntos (estando en el rango de revisión) y confirmar que se encola en la bandeja del operador humano con estado "Pendiente". |
| RQF-005 | Funcional | El sistema debe aprobar automáticamente los casos cuyo puntaje iguale o supere el umbral máximo definido y carezcan de alertas de fraude. | Must | Sección 2.6, §3, ENT3 [00:18:36], ENT2 [00:13:05] | Inyectar un caso limpio con puntaje 95 (siendo el umbral 85) y comprobar que el expediente pasa directamente al estado "Aprobado". |
| RQF-006 | Funcional | El sistema debe rechazar automáticamente los casos que obtengan un puntaje inferior al umbral mínimo o que presenten una alerta de fraude activa. | Must | Sección 3, §2.6, ENT3 [00:18:36], ENT2 [00:13:05] | Cargar un documento con una inconsistencia grave predefinida como fraude y validar que el caso se cierra con resolución de "Rechazado", ignorando el puntaje total. |
| RQF-007 | Funcional | El sistema debe aplicar la resolución del caso cuando el operador ejecuta la acción de aprobar, rechazar o solicitar antecedentes desde la interfaz. | Must | Sección 2.7, ENT4 [00:16:26], ENT5 [00:05:07] | Presionar el botón "Solicitar antecedentes" en un caso abierto, confirmar, y verificar que el estado del caso se bloquea en espera de información adicional. |
| RQF-008 | Funcional | El sistema debe guardar el motivo ingresado por el operador y marcar con una etiqueta de discrepancia y revisión algorítmica obligatoria si la decisión contradice la sugerencia de la plataforma. | Must | Sección 2.7, Sección 3, ENT4 [00:16:26], ENT5 [00:05:07] | Aprobar manualmente un caso cuyo puntaje sugería rechazo y validar en la base de datos que se registra el comentario del operador junto a indicadores booleanos de discrepancia y reentrenamiento. |
| RQF-009 | Funcional | El sistema debe emitir alertas dirigidas a los operadores cuando los expedientes en su bandeja de entrada estén próximos a vencer su tiempo límite de servicio. | Must | Sección 2.7, §2.15, ENT9 [00:03:26] | Configurar un caso con 10 minutos restantes de SLA y validar que la plataforma despliega una advertencia visual y envía un correo electrónico al operador asignado. |
| RQF-010 | Funcional | El sistema debe actualizar el panel visual de consumo en tiempo real mostrando el conteo de validaciones útiles efectuadas por el cliente. | Must | Sección 2.14, ENT8 [00:02:36], ENT8 [00:12:36] | Procesar un lote de 10 casos exitosos mediante API y recargar el panel web del cliente para comprobar que el medidor de consumo subió exactamente 10 unidades. |
| RQF-011 | Funcional | El sistema debe procesar la consolidación mensual del consumo separada en tramos tarifarios y generar el archivo de detalle para la facturación externa sin cálculo manual. | Must | Sección 2.14, ENT8 [00:02:36], ENT8 [00:12:36] | Simular la llegada del fin de mes fiscal y verificar que el sistema habilita un archivo de volcado de consumos clasificado por volumen sin emitir documento tributario. |
| RQF-012 | Funcional | El sistema debe excluir del medidor de consumo aquellas transacciones que hayan fallado por errores internos de la plataforma, repeticiones de sistema o por recepción de evidencias ilegibles. | Must | Sección 3, Sección 2.14, §2.14, ENT8 [00:02:36], ENT8 [00:12:36] | Cargar un documento dañado que arroje error, verificar el cierre temprano del caso y confirmar en el dashboard que el contador mensual de validaciones cobrables no aumentó. |
| RQF-013 | Funcional | El sistema debe registrar un historial inalterable bloqueando borrados de administradores, detallando evidencias ingresadas, módulos ejecutados, reglas, puntajes y decisiones de usuarios. | Must | Sección 2.11, §3, ENT3 [00:05:47], ENT6 [00:17:06] | Intentar modificar el registro de auditoría de un caso cerrado utilizando credenciales de administrador y verificar que el sistema rechaza la operación por reglas de inmutabilidad de BD. |
| RQF-014 | Funcional | El sistema debe soportar el inicio de sesión autenticando tanto por credenciales nativas como mediante la federación a un directorio corporativo (LDAP/SSO). | Must | Sección 2.13, ENT7 [00:18:26] | Configurar el proveedor de identidad corporativo (ej. Entra ID) y verificar que un usuario puede ingresar al sistema utilizando su esquema SSO validado. |
| RQF-015 | Funcional | El sistema debe guardar las etiquetas de las versiones específicas de los flujos y módulos que operaban en el instante preciso del análisis del caso, ignorando actualizaciones publicadas a posteriori. | Must | Sección 3, §2.11, ENT3 [00:05:47], ENT6 [00:17:06] | Consultar la auditoría de un caso procesado hace dos meses y comprobar que la metadata indica que fue evaluado con el "Modelo v1.2", a pesar de que el entorno productivo actual utilice la v2.0. |
| RQF-016 | Funcional | El sistema debe registrar la autorización activa o revocación del cliente para condicionar y permitir el uso de su data propietaria en la extracción y entrenamiento de los modelos de la plataforma. | Must | Sección 2.18, ENT5 [00:10:05] | Retirar el permiso de uso de datos desde la configuración del cliente y validar que el sistema omite silenciosamente todos los expedientes de ese tenant en cualquier pipeline de entrenamiento. |
| RQF-017 | Funcional | El sistema debe estructurar su respuesta de API incluyendo el identificador único del caso, la decisión, el puntaje algorítmico, el desglose de señales y el enlace al rastro de auditoría. | Must | Sección 2.10, §3, ENT3 [00:12:16] | Ejecutar un llamado al punto de acceso y validar que el payload de respuesta contiene la estructura JSON con las llaves requeridas (case_id, score, signals, audit_url, decision). |
| RQF-018 | Funcional | El sistema debe recibir una o múltiples piezas de evidencia cuando un actor inicia una petición. | Must | Sección 2.4 | 1. Iniciar un caso enviando una carga que contenga un archivo en formato PDF, imagen o video y validar que la plataforma no lo rechace. |
| RQF-019 | Funcional | El sistema debe validar el flujo de peticiones de entrada contra el límite configurado por cliente cuando se recibe una nueva llamada. | Must | Sección 2.10 | Simular 1001 peticiones simultáneas desde el mismo cliente y verificar que el sistema levanta una bandera de límite excedido en el registro interno. |
| RQF-020 | Funcional | El sistema debe encolar las peticiones excedentes para su procesamiento posterior cuando se supera el límite de tasa permitido, asumiendo la retención como estrategia de negocio. | Must | ENT7 [00:09:56] | Superar el límite de peticiones por minuto y confirmar que los casos excedentes ingresan a una cola en lugar de retornar un error HTTP 429 de rechazo inmediato. |
| RQF-021 | Funcional | El sistema debe asignar un identificador propio, único y permanente al caso tras recibir exitosamente la petición. | Must | Sección 3 | Crear dos casos idénticos consecutivamente y constatar que ambos tienen identificadores alfanuméricos distintos que no cambian a lo largo del ciclo de vida. |
| RQF-022 | Funcional | El sistema debe asociar la evidencia adicional al registro del caso original cuando el identificador corresponde a un caso que permanece en estado abierto. | Must | Sección 2.4 | Enviar un segundo documento referenciando el ID de un caso abierto y verificar en la base de datos que el archivo se adjuntó al mismo caso y gatilló una reevaluación. |
| RQF-023 | Funcional | El sistema debe crear un caso nuevo vinculado al registro anterior cuando recibe evidencia dirigida a un caso que ya se encuentra en estado cerrado. | Must | Sección 3 | Enviar nueva evidencia a un ID de caso resuelto y cerrado, y verificar que se genera un nuevo ID con una referencia explícita al ID antiguo. |
| RQF-024 | Funcional | El sistema debe resaltar la ubicación del hallazgo en el visor de documentos cuando el operador interactúa con los datos extraídos. | Must | Sección 2.7 | Hacer clic en el campo 'Fecha de evento' extraído y verificar que el visualizador del PDF hace zoom o encuadra automáticamente sobre la fecha en el documento original. |
| RQF-025 | Funcional | El sistema debe exhibir textualmente el motivo específico de la derivación manual cuando el operador abre el expediente. | Must | Sección 2.7 | Abrir un caso derivado por inconsistencia y verificar que se muestra la frase que explica la razón, no solo un código numérico interno de error. |
| RQF-026 | Funcional | El sistema debe preservar el valor original junto a la modificación ingresada cuando el operador corrige manualmente un dato extraído por la máquina. | Must | Sección 3 | Sobrescribir un monto de 1000 a 100 y confirmar mediante API/Auditoría que el payload guarda el historial 'valor original: 1000' y 'valor corregido: 100'. |
| RQF-027 | Funcional | El sistema debe bloquear la acción de aprobación indicando la falla en pantalla si el motivo de derivación a bandeja corresponde a la indisponibilidad de un módulo de análisis. | Must | Sección 3 | Simular la caída del módulo OCR, abrir un caso derivado por este motivo y verificar que el botón 'Aprobar' se encuentra deshabilitado. |
| RQF-028 | Funcional | El sistema debe imponer la derivación a bandeja humana sobre el puntaje automático si se detecta una alerta de fraude activa en el caso. | Must | Sección 3 | Forzar un caso con puntaje perfecto para aprobación automática que tenga en paralelo una alerta de fraude, y verificar que no se aprueba automáticamente. |
| RQF-029 | Funcional | El sistema debe clasificar el caso finalizado evaluando si su ejecución se considera una validación útil al momento de emitir el veredicto (cobrable). | Must | Sección 2.14 | Consultar un caso recién terminado en la base de datos y verificar que tiene un flag booleano asignado determinando si es cobrable o no. |
| RQF-030 | Funcional | El sistema debe marcar la ejecución como cobrable basándose en el criterio acordado de intervención humana o resolución automática. | Must | ENT8 [00:02:36] | Procesar un caso que finaliza derivado en el escritorio humano y verificar si su flag de cobro es 'true' o 'false', comprobando la correcta aplicación del acuerdo. |
| RQF-031 | Funcional | El sistema debe mostrar al Área Comercial exactamente la misma vista del contador de volumen acumulado habilitada para el cliente. | Must | ENT8 [00:12:36] | Ingresar a la plataforma con rol comercial y comparar el dashboard con el dashboard del cliente, certificando que los montos, listados y desglose empatan a la perfección. |
| RQF-032 | Funcional | El sistema debe actualizar el contador de cobro de acuerdo a la política definida para las reevaluaciones de casos por nueva evidencia. | Must | ENT8 [00:07:26] | Procesar nueva evidencia para un ID de caso existente y confirmar que el contador mensual del cliente suma o ignora el nuevo cobro según se configure comercialmente. |
| RQF-033 | Funcional | El sistema debe procesar la eliminación de la evidencia e información biométrica de un individuo cuando lo solicite el titular, ajustándose a la resolución normativa sobre inalterabilidad. | Must | Sección 3 | Se emite una solicitud de borrado de datos de un titular y el sistema ejecuta la acción correspondiente según el comportamiento definido finalmente por cumplimiento. |
| RQF-034 | Funcional | El sistema debe sincronizar el resultado y veredicto del caso hacia el sistema central de siniestros mediante un flujo automatizado o de transcripción. | Must | ENT7 [00:03:46] | Una vez un caso pasa a estado cerrado, la resolución impacta en el sistema core del cliente a través de la vía de integración tecnológica. |
| RQF-035 | Funcional | El sistema debe exigir la autorización mediante dos aprobaciones separadas antes de guardar y aplicar cualquier modificación sobre los umbrales de decisión. | Must | ENT6 [00:21:16] | Un administrador ajusta un umbral y el sistema lo mantiene en estado pendiente (sin aplicar) hasta que un segundo administrador distinto emite su aprobación en el panel. |
| RQF-036 | Funcional | El sistema debe sobreescribir la recomendación algorítmica y asentar como resolución activa la decisión ingresada por el revisor humano cuando exista una discrepancia. | Must | ENT4 [00:19:06] | Un operador modifica un campo extraído erróneamente que cambiaba el puntaje. El sistema guarda la decisión y el caso se cierra con el estado humano sin revertirlo por el motor. |
| RQF-037 | Funcional | El sistema debe ejecutar el motor de inferencia nuevamente al anexar materiales posteriores y contabilizar la reevaluación conforme a las políticas comerciales. | Must | Sección 2.4 | Se procesa evidencia complementaria para forzar una reevaluación. El sistema registra el evento en el panel de consumo sumando cero o un crédito según la regla de negocio. |
| RQF-038 | Funcional | El sistema debe rechazar la publicación productiva de un flujo lógico si su configuración carece de al menos un módulo de análisis en estado activo. | Must | Sección 3 | Un usuario diseña un flujo usando bloques conectores pero apaga u omite un módulo. Al presionar 'Publicar', el sistema muestra una restricción dura. |
| RQF-039 | Funcional | El sistema debe permitir la carga manual de evidencia mediante un formulario en la interfaz de usuario web. | Must | §2.4, §1.6 (piloto 3) | Subir un archivo de imagen mediante el botón de carga en el portal web y verificar que se adjunta correctamente al caso activo. |
| RQF-040 | Funcional | El sistema debe extraer e interpretar texto y firmas contenidos en los documentos cargados. | Must | §2.5, §2.6 | Subir un contrato firmado escaneado y validar que el motor OCR extrae los párrafos correctos e identifica la presencia de una firma humana. |
| RQF-041 | Funcional | El sistema debe detectar objetos, evaluar daños y extraer metadatos de las fotografías ingresadas. | Must | §2.5, §2.6 | Cargar la fotografía de un vehículo chocado y verificar que el sistema identifica visualmente la zona del daño y extrae la fecha del metadato EXIF. |
| RQF-042 | Funcional | El sistema debe generar transcripciones textuales contextualizadas a partir de la evidencia de audio ingresada. | Must | §2.5, §2.6 | Ingresar un archivo de audio MP3 y corroborar que el sistema retorna una transcripción en texto plano coherente con las palabras habladas. |
| RQF-043 | Funcional | El sistema debe calcular y emitir un puntaje de confianza numérico de 0 a 100 acompañado del desglose de las señales analizadas. | Must | §2.5, §2.6 | Finalizar la evaluación de un expediente y confirmar en la respuesta que se incluye una variable "score" (ej. 85) y un arreglo detallando las "signals" que lo componen. |
| RQF-044 | Funcional | El sistema debe permitir al administrador configurar los umbrales numéricos de decisión de forma independiente para cada cliente y flujo. | Must | §2.6, §3, ENT3 [00:18:36], ENT2 [00:13:05] | Modificar el umbral de aprobación automática a 90 puntos en el panel de control y verificar que la configuración se guarda y aplica a los nuevos casos. |
| RQF-045 | Funcional | El sistema debe consolidar la evidencia, el puntaje total, el desglose de señales y la razón de derivación en una pantalla única en la bandeja del operador. | Must | §2.7, ENT4 [00:16:26], ENT5 [00:05:07] | Abrir un expediente desde la bandeja de revisión y constatar visualmente que los datos del modelo, la causa de derivación y el visor del documento están en la misma vista. |
| RQF-046 | Funcional | El sistema debe disponer de una interfaz gráfica tipo drag-and-drop para ensamblar el flujo de análisis conectando bloques lógicos funcionales. | Must | §2.8, ENT2 [00:00:58] | Ingresar al diseñador de flujos, arrastrar un módulo de ingesta y uno de OCR al lienzo, conectarlos, guardar y validar que no ocurren errores de esquema. |
| RQF-047 | Funcional | El sistema debe almacenar el historial de versiones del flujo guardado permitiendo comparar y restaurar configuraciones anteriores. | Must | §2.8, ENT2 [00:00:58] | Ingresar a las opciones de un flujo actual (v2), seleccionar revertir a v1 y comprobar que el lienzo recarga mostrando los módulos de la versión anterior. |
| RQF-048 | Funcional | El sistema debe auto-generar un punto de acceso (endpoint) seguro con límite de peticiones tras publicar exitosamente un flujo en el diseñador. | Must | §2.10, ENT3 [00:12:16] | Finalizar la publicación de un flujo y verificar en el panel de integración que se detalla una URL única válida para comenzar a inyectar peticiones POST. |
| RQF-049 | Funcional | El sistema debe habilitar la descarga completa del rastro de auditoría del caso. | Must | §2.11, §3, ENT3 [00:05:47], ENT6 [00:17:06] | Hacer clic en "Descargar Auditoría" en la vista del caso y validar la obtención de un documento que contenga la línea de tiempo íntegra de eventos. |
| RQF-050 | Funcional | El sistema debe aplicar un aislamiento multitenant estricto que impida que los usuarios de una organización accedan o visualicen expedientes de otra. | Must | §2.13, ENT7 [00:18:26] | Iniciar sesión como usuario del Cliente A, intentar resolver por URL el ID de un expediente del Cliente B, y validar que el sistema arroja error de acceso denegado. |
| RQF-051 | Funcional | El sistema debe restringir los menús y acciones de la plataforma dependiendo del perfil de permisos asignado (ej. administrador, operador, diseñador). | Must | §2.13, ENT7 [00:18:26] | Autenticarse con el rol estricto de 'Operador de casos' y confirmar que los apartados de configuración de facturación y diseño no son accesibles. |
| RQF-052 | Funcional | El sistema debe emitir un mensaje de error claro para usuarios no técnicos cuando se interrumpe el análisis por detección de un archivo ilegible. | Should | Sección 2.4 | Cargar una imagen en formato no soportado y verificar que la notificación de error exprese textualmente el motivo sin exponer trazas de excepciones de código. |
| RQF-053 | Funcional | El sistema debe ocultar el puntaje total del caso cuando el operador selecciona el registro para iniciar la inspección de la evidencia. | Should | ENT5 [00:15:16] | Abrir un caso derivado y comprobar que el elemento de interfaz (UI) del 'puntaje total' no es visible en la pantalla principal de evaluación. |
| RQF-054 | Funcional | El sistema debe revelar el puntaje obtenido y el desglose de señales una vez que el operador finaliza la revisión de la evidencia. | Should | ENT5 [00:15:16] | Marcar los documentos como revisados en la interfaz y verificar que el bloque de UI oculto con el puntaje total y señales se vuelve visible. |
| RQF-055 | Funcional | El sistema debe derivar el expediente al estado de investigación si el operador clasifica la evidencia como falsificación comprobada. | Should | ENT5 [00:05:07] | Seleccionar la acción de 'Falsificación' en un caso y verificar que el sistema cambia su estado a 'En Investigación' de fraude. |
| RQF-056 | Funcional | El sistema debe instanciar la configuración de un cliente nuevo copiando una plantilla preconfigurada que incluya un caso de uso, módulos, reglas y umbrales base. | Should | Sección 2.16 | Al dar de alta un nuevo cliente, el sistema aplica una plantilla y genera un flujo publicable sin requerir configuración manual desde cero. |
| RQF-057 | Funcional | El sistema debe alojar los casos no resueltos por errores de automatización en una bandeja específica para posibilitar su intervención por parte de usuarios de soporte. | Should | ENT9 [00:16:46] | Ante una excepción técnica del motor de análisis, el expediente se despliega en una bandeja accesible por el soporte técnico con opciones para reprocesar. |
| RQF-058 | Funcional | El sistema debe despachar notificaciones al personal supervisor al detectar un incremento anormal en la tasa de derivación manual o detecciones de fraude. | Should | §2.15, ENT9 [00:03:26] | Inyectar consecutivamente 20 casos preconfigurados como fraude y verificar que el sistema identifica el pico estadístico y notifica al usuario con rol de supervisión. |
| RQF-059 | Funcional | El sistema debe transmitir alertas técnicas al equipo de soporte de la plataforma en caso de ocurrir fallos, degradaciones de red o caídas de módulos de análisis. | Should | §2.15, ENT9 [00:03:26] | Simular un corte de comunicación hacia la base de datos principal y constatar que se dispara un evento de alerta mediante webhook. |
| RQF-060 | Funcional | El sistema debe mostrar en los paneles gráficos métricas operativas actualizadas sobre volumen procesado y tiempos promedio de resolución. | Should | §2.12, ENT4 [00:19:06] | Ingresar al panel global y confirmar el renderizado del gráfico de barras del volumen diario y que el tiempo refleja los casos de las últimas 24 horas. |
| RQF-061 | Funcional | El sistema debe calcular y mostrar el porcentaje de casos históricos donde las decisiones de los operadores contradicen el veredicto sugerido por la plataforma. | Should | §2.12, ENT4 [00:19:06] | Procesar 10 expedientes, contradiciendo la recomendación del motor en 2 de ellos, y confirmar que el widget de discrepancia en el panel refleja una tasa del 20%. |
| RQF-062 | Funcional | El sistema debe enlazar visualmente los expedientes que se generen bajo el mismo identificador de titular o asegurado dentro de un umbral de tiempo predefinido. | Should | §3, ENT4 [00:08:35] | Crear dos casos utilizando el mismo número de documento con 5 minutos de diferencia y validar que aparece el otro en el apartado de "Relacionados". |
| RQF-063 | Funcional | El sistema debe exportar un vaciado empaquetado de los flujos y las operaciones históricas consumadas bajo petición del cliente. | Could | Sección 3 | Un administrador solicita extraer su información y el sistema gatilla la generación de un archivo de volcado con todos sus historiales. |
| RQF-064 | Funcional | El sistema debe recopilar los reportes de error, discrepancias y correcciones manuales ingresadas para disponibilizarlos como insumo de reentrenamiento. | Could | §2.18, ENT5 [00:10:05] | Corregir manualmente un monto extraído por el OCR y comprobar que se guarda una traza del valor antiguo y nuevo en el dataset de mejora continua. |
| RQNF-001 | No Funcional | El sistema debe encolar en espera las peticiones en curso y reintentar su procesamiento en lugar de abortarlas o descartarlas frente a la falla de respuesta de un servicio externo o de terceros. | Must | Sección 3, §4, §2.17, ENT7 [00:09:56], ENT9 [00:06:07] | Forzar la caída de un servicio externo, inyectar un caso y corroborar que el expediente no se pierde ni genera error crítico, sino que aguarda en una cola de reintento. |
| RQNF-002 | No Funcional | El sistema debe conservar los expedientes y la evidencia por el período temporal que se defina en el rango de 90 días a 10 años. | Must | Sección 2.11 | Se verifica que un expediente y sus evidencias persisten sin degradación ni eliminación automática hasta cumplirse el plazo definitivo acordado. |
| RQNF-003 | No Funcional | El sistema debe reconstruir el comportamiento, las evidencias y las reglas de una decisión pasada basándose en su historial, con la exactitud técnica acordada. | Must | Sección 2.11 | Se consulta el historial de un caso cerrado y el sistema despliega las reglas, evidencias y componentes exactos que motivaron el veredicto. |
| RQNF-004 | No Funcional | El sistema debe limitar el tráfico en los ambientes de integración a un máximo de 100 llamadas por minuto por cliente. | Must | Sección 4 | Se ejecutan 101 llamadas en menos de 60 segundos hacia un punto de acceso de integración y el sistema devuelve un error HTTP 429. |
| RQNF-005 | No Funcional | El sistema debe mantener su disponibilidad operativa alcanzando al menos un 99.9% del tiempo (uptime) a nivel mensual. | Must | §4, §2.17, ENT7 [00:09:56], ENT9 [00:06:07] | Analizar las métricas de monitoreo de red de los últimos 30 días y confirmar matemáticamente que los minutos de indisponibilidad total sumados no excedieron los 43,8 minutos. |
| RQNF-006 | No Funcional | El sistema debe completar el procesamiento analítico completo de un caso típico que incluya hasta 12 imágenes/documentos en un tiempo inferior a 5 segundos de forma síncrona. | Must | §4, §3, ENT3 [00:08:57] | Lanzar una prueba de rendimiento subiendo un caso estándar por API y medir el tiempo transcurrido, verificando respuesta en ≤ 5000 ms. |
| RQNF-007 | No Funcional | El sistema debe derivar el análisis de evidencias multimedia pesadas (como videos largos o audios grandes) hacia un flujo asíncrono para no bloquear los procesos rápidos. | Must | §4, §3, ENT3 [00:08:57] | Enviar un video de 30 MB mediante API, verificar que retorna "202 Accepted" casi al instante, y que el estado cambia a procesado minutos después por backend. |
| RQNF-008 | No Funcional | El sistema debe cargar completamente la interfaz gráfica (DOM y recursos críticos) de las pantallas principales frente al operador en un máximo de 2 segundos. | Must | §4, §3, ENT3 [00:08:57] | Acceder a la bandeja de trabajo, auditar los tiempos de carga y confirmar que el evento LCP se resuelve en menos de 2000 milisegundos. |
| RQNF-009 | No Funcional | El sistema debe aprovisionar sus bases de datos y almacenamiento de objetos dentro de infraestructura localizada físicamente en Chile para los clientes nacionales. | Must | §4, ENT6 [00:13:36] | Revisar el aprovisionamiento de la arquitectura cloud y auditar que los servicios de persistencia de datos productivos apuntan exclusivamente a la zona (ej. sa-santiago-1). |
| RQNF-010 | No Funcional | El sistema debe estar diseñado arquitectónicamente para añadir capacidad de procesamiento paralela (escalado horizontal) absorbiendo picos por sobre el volumen estimado. | Must | §4, ENT8 [00:15:16] | Lanzar 150 peticiones simultáneas por segundo en entorno de estrés y verificar que el cluster autoescala levantando nodos adicionales sin degradación. |
| RQNF-011 | No Funcional | El sistema debe permitir el despliegue de nuevas versiones del producto en los ambientes sin interrumpir la operación (Zero Downtime) y garantizar la reversibilidad. | Must | §4, ENT2 [00:05:16] | Generar peticiones continuas al sistema mediante un script mientras se lanza actualización; validar que ninguna solicitud se rechaza y que un rollback devuelve el estado intacto. |
| RQNF-012 | No Funcional | El sistema debe enmascarar u ofuscar toda información confidencial de clientes antes de replicar bases de datos a los entornos de desarrollo o integración. | Must | §4, ENT2 [00:05:16] | Ejecutar el volcado de datos desde Producción hacia Testing y verificar mediante consultas en el destino que los identificadores y nombres aparecen truncados o sustituidos. |
| RQNF-013 | No Funcional | El sistema debe asegurar los archivos y bases de datos empleando cifrado estándar para todos sus recursos de almacenamiento permanente (reposo) y comunicaciones (tránsito). | Must | §4, §2.11, ENT6 [00:07:26] | Comprobar mediante escaneo de seguridad en la nube que los volúmenes presentan encriptación AES-256 (KMS) activa y el balanceador bloquea peticiones HTTP no cifradas. |
| RQNF-014 | No Funcional | El sistema debe ejecutar una rutina automatizada que borre los datos y expedientes de forma permanente una vez transcurrido el plazo máximo de retención normativo dictado. | Must | §4, §2.11, ENT6 [00:07:26] | Alterar artificialmente la fecha de un caso para que supere el límite legal, ejecutar el cron de limpieza y confirmar que el registro es expurgado del disco. |
| RQNF-015 | No Funcional | El sistema debe completar los procesos sistémicos para el alta en producción de un cliente nuevo dentro del plazo que se defina frente a la brecha estimada de 2 a 3 semanas. | Should | Sección 2.16 | Se mide el tiempo total de procesamiento desde la creación del tenant hasta su disponibilidad en producción, verificando que no exceda el límite estipulado. |
| RQNF-016 | No Funcional | El sistema debe prevenir el registro de cualquier Dato de Identificación Personal (PII) o evidencia privada dentro de las trazas en texto plano y logs de depuración del servidor. | Should | §4, ENT9 [00:12:21] | Generar una excepción provocada por un documento que contiene el texto "Juan Pérez", y revisar el repositorio de logs para asegurar que no incluye esa cadena. |
| RQNF-017 | No Funcional | El sistema debe manejar todo acceso a servicios de terceros y tokens de clientes almacenando las credenciales exclusivamente mediante herramientas encriptadas (gestores de secretos). | Should | §4, ENT9 [00:12:21] | Auditar el código fuente y las variables de entorno corroborando que no existen contraseñas en texto claro, dependiendo del manejador de llaves. |
# Entregable 1

## Articulación y análisis de requisitos asistido por LLM

**Caso MIRA**

Taller de Desarrollo de Software Conducido por Agentes de IA  
Escuela de Ingeniería Informática  
Universidad de Valparaíso

| **Campo** | **Detalle** |
| :--- | :--- |
| **Actividad** | Articulación y análisis de requisitos a partir de una descripción de proyecto |
| **Caso de trabajo** | MIRA --- Mantenimiento Integrado y Registro de Activos, Vertiente Servicios Industriales S.A. |
| **Fecha de entrega** | Lunes 7 de septiembre de 2026, 14:00 |
| **Integrantes por equipo** | 3 o 4 |
| **Tiempo de presentación** | 15 minutos |
| **Tiempo de preguntas** | 5 minutos |
| **Entregables** | PPT y presentación oral |
| **Modalidad de evaluación** | Grupal, con preguntas individuales durante la ronda de preguntas |

**Entrega: lunes 7 de septiembre de 2026**

---

## Tabla de contenidos

- [1. Objetivo](#1-objetivo)
- [2. Material de trabajo](#2-material-de-trabajo)
- [3. Rol del representante del cliente](#3-rol-del-representante-del-cliente)
- [4. Documentación de decisiones](#4-documentación-de-decisiones)
- [5. Entregables](#5-entregables)
- [6. Presentación oral](#6-presentación-oral)
- [7. Evaluación](#7-evaluación)
- [8. Condiciones de entrega](#8-condiciones-de-entrega)
- [9. Recomendaciones](#9-recomendaciones)

---

## 1. Objetivo

### 1.1 Objetivo general

Aplicar técnicas básicas de prompting para articular y analizar requisitos de manera precisa a partir de una descripción de proyecto redactada por la contraparte de negocio, produciendo artefactos que permitan iniciar el desarrollo.

El énfasis de la actividad en la **completitud y precisión**: que cada afirmación del análisis sea trazable a una fuente, que las ambigüedades queden explicitadas en vez de resueltas por conveniencia, y que las decisiones tomadas queden registradas junto con su justificación.

### 1.2 Objetivos específicos

Al finalizar la actividad, el equipo debe ser capaz de:

- Aplicar y nombrar correctamente al menos cinco técnicas de prompting, justificando por qué cada una es apropiada para la tarea en que se usó.
- Transformar una descripción de necesidades en lenguaje natural en artefactos de análisis: modelo de dominio, casos de uso, requisitos funcionales y no funcionales, casos de prueba, backlog y diagrama de secuencia de sistema.
- Detectar inconsistencias, ambigüedades y vacíos en la documentación de entrada, y resolverlos mediante consulta a la contraparte en vez de suposiciones tácitas.
- Distinguir entre lo que dice la fuente, lo que infiere el modelo y lo que decidió el equipo.
- Documentar decisiones de análisis de forma que un tercero pueda reconstruir por qué el sistema quedó especificado como quedó.

### 1.3 Qué se espera como salida

La salida de la actividad debe ser un conjunto de artefactos **suficiente para iniciar el desarrollo**. El criterio operativo es el siguiente: si otro equipo tomara sus artefactos y comenzara a construir el sistema mañana, ¿podría hacerlo sin volver a leer el documento de necesidades? Si la respuesta es no, el análisis está incompleto.

---

## 2. Material de trabajo

El equipo trabaja sobre el documento MIRA-descripcion-proyecto.docx, que contiene la descripción de necesidades de Vertiente Servicios Industriales S.A. para una plataforma de gestión de mantenimiento en terreno.

Ese documento fue redactado por la contraparte de negocio, no por un ingeniero de requisitos. En consecuencia:

- Mezcla necesidades, soluciones ya decididas y opiniones personales.
- Contiene contradicciones entre capítulos y entre el cuerpo del documento y las entrevistas.
- Contiene requisitos no verificables y decisiones dejadas explícitamente abiertas.
- Usa vocabulario inconsistente para referirse a los mismos objetos del negocio.

Nada de esto es un defecto del material: es la condición normal en que llega un proyecto real. Descubrirlo, nombrarlo y resolverlo es la actividad.

---

## 3. Rol del representante del cliente

Un integrante del equipo asume el rol de **representante del cliente**: es quien quiere que el sistema se construya y quien responde por él.

**Sus responsabilidades son:**

- Aclarar las dudas que el resto del equipo levante sobre el documento.
- Resolver las inconsistencias detectadas, tomando una decisión explícita cuando el documento se contradice.
- Velar por que el alcance acordado se cumpla y por que los artefactos producidos reflejen efectivamente lo que el negocio necesita.
- Rechazar lo que no corresponda: si el equipo especifica algo que el cliente no pidió, es su deber señalarlo.

**Reglas del rol:**

- El representante del cliente responde **fundado en el documento y en las entrevistas**. Cuando la fuente no alcanza para responder, no inventa: declara el supuesto, lo registra como decisión y sigue adelante. Un supuesto declarado es una respuesta válida; un supuesto silencioso, no.
- El rol **puede rotar entre entregas**. Se recomienda que rote, para que todos los integrantes experimenten ambos lados de la conversación.
- Quien ejerce el rol en esta entrega debe quedar identificado en la portada del informe.

---

## 4. Documentación de decisiones

Toda decisión de análisis debe quedar registrada. Se entiende por decisión cualquier elección del equipo que no esté determinada por la fuente: resolver una contradicción, acotar un alcance, fijar un valor que el documento dejó abierto, o descartar una necesidad expresada por algún entrevistado.

El registro se lleva en una bitácora de decisiones, con el siguiente formato mínimo:

| **Campo** | **Contenido** |
| :--- | :--- |
| **ID** | DEC-01, DEC-02, ... |
| **Fecha** | Fecha en que se tomó |
| **Asunto** | Qué se decidió, en una línea |
| **Contexto** | Qué decían las fuentes, con cita (§x.y o ENTn [mm:ss]) |
| **Alternativas** | Al menos dos opciones consideradas |
| **Decisión** | Qué se resolvió |
| **Justificación** | Por qué, y quién la validó |
| **Impacto** | Qué requisitos, casos de uso o pruebas se ven afectados |

**Ejemplo:**

| **Campo** | **Contenido** |
| :--- | :--- |
| **ID** | DEC-04 |
| **Fecha** | 28-08-2026 |
| **Asunto** | Momento en que se descuenta el stock de la bodega móvil |
| **Contexto** | §2.5.6 y RN-08 indican que el descuento ocurre al cerrar la OT. ENT4 [00:04:36] sostiene que debe ocurrir al instalar la pieza. ENT2 [00:04:16] pide además una reserva desde la planificación. |
| **Alternativas** | (a) Descuento al cierre de la OT. (b) Descuento al declarar el consumo, con reserva previa en la planificación. |
| **Decisión** | Se adopta (b): reserva al asignar y descuento al declarar el consumo, sincronizable sin conexión. |
| **Justificación** | El descuento al cierre deja el inventario desactualizado mientras la OT permanece abierta, lo que es precisamente el problema descrito en §1.3.4. Validado con el representante del cliente el 28-08. |
| **Impacto** | RF-31, RF-38, RN-08, CU-07, caso de prueba PF-12. |

---

## 5. Entregables

El equipo entrega dos piezas:

- **Informe escrito**, con la estructura y las extensiones máximas definidas en este capítulo.
- **Presentación oral** de 15 minutos, más 5 minutos de preguntas, basada en el mismo contenido.

Las extensiones indicadas son máximos y se hacen cumplir. Un informe que exceda el límite se evalúa hasta la última página permitida; lo que siga no se lee. La restricción es parte del ejercicio: sintetizar es una competencia de análisis, no una formalidad administrativa.

| **Sección** | **Extensión máxima** |
| :--- | :--- |
| Resumen ejecutivo | 1/2 plana |
| Introducción | 1 plana |
| Análisis de requisitos | 8 planas |
| Técnicas de prompting utilizadas | 2 planas |
| Inconsistencias detectadas y su resolución (usar formato) | 2 planas |
| Discusión | 1 plana |
| Conclusiones | 1/2 plana |
| Anexos (bitácora de decisiones y prompts) | Sin límite, no se evalúa por extensión |

### 5.1 Resumen ejecutivo

Media plana. Dirigido a quien decide, no a quien programa. Debe responder: qué problema se analizó, qué se produjo, cuáles fueron los tres hallazgos más relevantes y qué se recomienda hacer a continuación. Sin jerga técnica y sin describir el proceso de trabajo.

### 5.2 Introducción

Una plana. Contexto del caso, alcance del análisis, supuestos generales, composición del equipo e identificación de quién ejerció el rol de representante del cliente en esta entrega.

### 5.3 Análisis de requisitos

Ocho planas como máximo, que deben incluir los siete artefactos siguientes. La distribución del espacio entre ellos es decisión del equipo, pero ninguno puede estar ausente.

#### 5.3.1 Modelo de dominio

Diagrama de clases conceptual con las entidades del negocio, sus atributos relevantes, las asociaciones y las cardinalidades. No es un modelo de base de datos: no lleva claves foráneas, tipos de dato ni tablas intermedias que no existan en el lenguaje del negocio.

Debe acompañarse de un glosario breve que fije el vocabulario adoptado, especialmente donde las fuentes usan términos intercambiables para cosas distintas.

Se sugiere Mermaid (classDiagram) para este artefacto.

#### 5.3.2 Casos de uso

Diagrama de casos de uso con actores y, para los tres casos de uso más críticos, la especificación en formato extendido: actor principal, precondiciones, flujo principal numerado, flujos alternativos, flujos de excepción y postcondiciones.

El criterio para elegir los tres es el riesgo: aquellos donde una especificación equivocada obliga a rehacer trabajo. Justifique la elección en una línea.

Se sugiere PlantUML para el diagrama de casos de uso.

#### 5.3.3 Requisitos funcionales y no funcionales

Tabla única priorizada, con identificador estable, categoría, enunciado, prioridad, fuente y criterio de verificación. Los requisitos no funcionales deben quedar expresados de forma **medible**: si no se puede escribir la condición bajo la cual el requisito se considera cumplido, el requisito está mal formulado y debe llevar una decisión asociada que lo acote.

**Formato exigido, con ejemplos:**

| **ID** | **Tipo** | **Requisito** | **Prioridad** | **Fuente** | **Verificación** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| RQF-014 | Funcional | El técnico debe poder registrar el consumo de un repuesto asociándolo al equipo intervenido, sin conexión a internet. | Must | §2.5.5, ENT3 [00:04:05], DEC-04 | PF-12 |
| RQF-021 | Funcional | El sistema debe calcular el vencimiento del compromiso de respuesta considerando el calendario de cobertura del contrato. | Must | §2.5.2, RN-03, DEC-01 | PF-05, PF-06 |
| RQNF-003 | No funcional | La sincronización de una OT completa con hasta 8 fotografías debe finalizar en menos de 90 segundos sobre una conexión móvil de 1 Mbps. | Should | RNF-06, ENT3 [00:23:45], DEC-09 | PX-04 |
| RQNF-007 | No funcional | El registro de auditoría debe conservarse 7 años y ser inalterable para todo perfil, incluido el administrador. | Must | RNF-10, ENT6 [00:10:35], DEC-06 | PX-08 |

Priorice con MoSCoW (Must, Should, Could, Won't) y declare el criterio usado para asignar cada nivel. Una lista donde todo es Must no es una priorización.

#### 5.3.4 Set de pruebas funcionales

Conjunto de casos de prueba que verifican los requisitos funcionales priorizados como Must. Cada caso debe tener identificador, requisito que verifica, precondición, pasos, datos de entrada y resultado esperado observable.

| **ID** | **Verifica** | **Precondición** | **Pasos** | **Resultado esperado** |
| :--- | :--- | :--- | :--- | :--- |
| PF-12 | RQF-014 | Técnico con OT asignada y repuesto R-4471 en su bodega móvil. Dispositivo sin conexión. | Abrir la OT, declarar consumo de una unidad de R-4471, cerrar la OT, restablecer la conexión. | Al sincronizar, el stock del furgón disminuye en una unidad, el consumo queda asociado al equipo y no se genera un segundo descuento. |

Se espera cobertura de al menos un flujo alternativo o de excepción por cada caso de uso especificado en detalle. Un set de pruebas que solo recorre el camino feliz no asegura nada.

#### 5.3.5 Set de pruebas extra-funcionales

Pruebas orientadas a los atributos de calidad: rendimiento, disponibilidad, seguridad, usabilidad, operación sin conexión, volumen de datos y consumo de recursos del dispositivo. Cada prueba debe indicar el atributo evaluado, el escenario, la carga o condición aplicada y el umbral de aceptación.

| **ID** | **Atributo** | **Escenario** | **Umbral** |
| :--- | :--- | :--- | :--- |
| PX-04 | Rendimiento en red degradada | Sincronización de 40 OT acumuladas tras 6 horas sin señal, a 1 Mbps. | Ninguna OT perdida; sincronización completa en menos de 10 minutos; sin bloqueo de la interfaz. |
| PX-08 | Seguridad y auditoría | Intento de modificación directa de un registro de auditoría con perfil administrador. | La operación es rechazada y el intento queda registrado. |

Justifique por qué eligió esos atributos y no otros: el criterio es el riesgo del negocio, no la disponibilidad de herramientas de prueba.

#### 5.3.6 Backlog

Backlog de producto derivado de los requisitos, expresado como historias de usuario con criterios de aceptación verificables y un tamaño relativo estimado. Debe estar ordenado, y el orden debe estar justificado por valor de negocio y riesgo técnico, no por comodidad de implementación.

**Ejemplo de ítem:**

| **Campo** | **Contenido** |
| :--- | :--- |
| **ID** | HU-018 |
| **Historia** | Como técnico en terreno, quiero declarar los repuestos que instalé aunque no tenga señal, para que el inventario de mi furgón refleje la realidad sin que yo tenga que recordarlo después. |
| **Requisitos** | RQF-014, RQNF-003 |
| **Criterios de aceptación** | (1) Puedo seleccionar un repuesto de mi bodega móvil estando sin conexión. (2) La declaración queda pendiente de sincronizar y es visible como tal. (3) Al recuperar señal, el descuento se aplica una sola vez. (4) Si el repuesto ya no está en mi stock al sincronizar, el sistema levanta una discrepancia en vez de descartar el dato. |
| **Estimación** | 8 |
| **Prioridad** | Must |

Incluya además la definición de terminado (DoD) que el equipo aplicará, como una lista de verificación binaria de entre 6 y 10 ítems.

Se recomienda GitHub Projects para gestionar el backlog. Adjunte el enlace o una captura en anexos.

#### 5.3.7 Diagrama de secuencia de sistema

Diagrama de secuencia de sistema para el caso de uso más crítico, mostrando el intercambio entre los actores y el sistema como caja negra, incluyendo los eventos de sistema, las respuestas y al menos un flujo de excepción.

Debe ser consistente con el flujo del caso de uso especificado en 5.3.2. Si el diagrama muestra un paso que el caso de uso no menciona, uno de los dos está mal.

Se sugiere Mermaid (sequenceDiagram).

---

### 5.4 Técnicas de prompting utilizadas

Dos planas. Mencione y justifique al menos cinco técnicas efectivamente utilizadas durante el trabajo. Para cada una:

- Nombre formal de la técnica, en inglés, con la referencia bibliográfica correspondiente.
- Para qué tarea concreta del análisis se usó.
- Por qué era la técnica apropiada para esa tarea y no otra.
- Qué mejoró respecto de un intento previo sin la técnica. Se valora especialmente mostrar el antes y el después.

No se acepta una enumeración genérica de técnicas conocidas. La evidencia de uso ---el prompt real y su salida--- va en anexos, y la sección se evalúa sobre la calidad de la justificación, no sobre la cantidad de técnicas nombradas.

Una advertencia: la técnica que produjo una salida vistosa no es necesariamente la que produjo una salida correcta. Si alguna técnica funcionó mal para su caso, decirlo suma puntaje.

---

### 5.5 Inconsistencias detectadas y su resolución

Dos planas. Tabla con las inconsistencias, ambigüedades y vacíos encontrados en el documento de necesidades. Para cada una:

| **ID** | **Hallazgo** | **Fuentes en conflicto** | **Tipo** | **Resolución** | **Decisión** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| H-03 | El tiempo de respuesta comprometido para clientes de categoría Platino difiere entre las fuentes. | §2.5.2 (4 h), RN-04 (6 h), ENT1 [00:03:44] (2 h), ENT8 [00:03:05] (4 h contractuales más 2 h prometidas verbalmente) | Contradicción entre fuentes | Se adopta el valor contractual y se parametriza por contrato; el compromiso verbal se registra como riesgo comercial. | DEC-01 |

**Tipos a utilizar:** contradicción entre fuentes, ambigüedad, requisito no verificable, vacío (regla de negocio sin requisito que la soporte), conflicto entre interesados y decisión pendiente declarada.

**Toda inconsistencia reportada debe llevar cita verificable.** Un hallazgo sin cita no se considera hallazgo. Una cita que no corresponde al contenido citado descuenta el doble de lo que suma un hallazgo válido: en análisis de requisitos, afirmar con seguridad algo que la fuente no dice es más dañino que no haberlo detectado.

Se evalúa la resolución tanto como la detección. Detectar que dos fuentes se contradicen es la parte fácil; decidir cuál prevalece, con qué criterio y con qué consecuencias, es el trabajo.

---

### 5.6 Discusión

Una plana. Aquí el equipo reflexiona, no resume. Algunas preguntas que la sección puede abordar:

- ¿Dónde el modelo fue de mayor ayuda y dónde fue activamente engañoso?
- ¿Qué inconsistencias detectó el modelo por sí solo y cuáles solo aparecieron por lectura humana?
- ¿Cuántas veces el modelo resolvió una ambigüedad sin avisar que la estaba resolviendo? ¿Cómo se dieron cuenta?
- ¿Qué habría pasado si hubieran llevado los artefactos directamente a implementación sin la conversación con el representante del cliente?
- ¿Qué parte del trabajo no delegarían a un modelo la próxima vez, y por qué?

---

### 5.7 Conclusiones

Media plana. Cierre sobre el objetivo de aprendizaje: qué sabe hacer el equipo ahora que no sabía hacer antes, y qué queda pendiente.

---

## 6. Presentación oral

La presentación dura **15 minutos**, seguidos de **5 minutos de preguntas**. El tiempo se controla y se corta: a los 15 minutos la exposición termina, esté donde esté.

**Distribución sugerida:**

| **Bloque** | **Tiempo sugerido** |
| :--- | :--- |
| Contexto y alcance del análisis | 2 min |
| Artefactos de análisis (dominio, casos de uso, requisitos) | 5 min |
| Aseguramiento de calidad: pruebas y backlog | 3 min |
| Técnicas de prompting e inconsistencias resueltas | 4 min |
| Cierre | 1 min |

**Condiciones:**

- Expone todo el equipo. La distribución del tiempo entre integrantes es decisión del equipo, pero nadie puede quedar sin hablar.
- Durante los 5 minutos de preguntas, cualquier integrante puede ser preguntado sobre cualquier parte del trabajo. Responder "esa parte la hizo otro" no es una respuesta aceptable.
- No se lee la diapositiva. Las diapositivas soportan la exposición, no la reemplazan.

---

## 7. Evaluación

| **Criterio** | **Ponderación** |
| :--- | :--- |
| Completitud y coherencia de los artefactos de análisis | 20 % |
| Precisión y trazabilidad: toda afirmación citada a su fuente | 15 % |
| Detección y resolución de inconsistencias | 15 % |
| Calidad de las pruebas funcionales y extra-funcionales | 10 % |
| Backlog utilizable, priorizado y con criterios de aceptación verificables | 10 % |
| Técnicas de prompting: uso efectivo y justificación | 15 % |
| Documentación de decisiones | 5 % |
| Presentación oral y respuestas a preguntas | 10 % |

**Descuentos:**

- Cita inexistente o que no corresponde al contenido: descuenta el doble de lo que suma un hallazgo válido.
- Requisito no funcional sin criterio de verificación medible: no se contabiliza.
- Exceso de extensión: no se evalúa el contenido que supera el límite de la sección.
- Artefacto ausente entre los siete exigidos en 5.3: la sección completa se evalúa con la mitad del puntaje.

---

## 8. Condiciones de entrega

- Formato del presentación: PPT. Los diagramas deben ser legibles al imprimir; una captura borrosa de una herramienta no cumple.
- Repositorio del equipo con el historial de trabajo. Se espera que los commits reflejen la evolución del análisis, no una carga única el día de la entrega.
- Nomenclatura del archivo: A1-MIRA-\<apellidos separados por guion\>.pdf.
- Plazo: lunes 7 de septiembre de 2026 hasta las 14:00. La entrega fuera de plazo se descuenta según el reglamento del curso.

---

## 9. Recomendaciones

- **Lea el documento completo antes de escribir el primer prompt.** El equipo que empieza pidiéndole al modelo que resuma las 29 páginas pierde exactamente aquello que la actividad evalúa: las contradicciones viven en los detalles que el resumen elimina.
- **Las entrevistas son fuente primaria.** El cuerpo del documento fue redactado después y no siempre recoge fielmente lo que se dijo. Cuando ambos difieren, eso es un hallazgo, no un error de transcripción.
- **Desconfíe de la fluidez.** Un modelo produce una especificación completa y bien redactada aunque la fuente sea contradictoria: rellena los huecos sin avisar. Su trabajo es encontrar dónde rellenó.
- **Trate al representante del cliente como a un cliente real.** Prepare las preguntas, no improvise. Un cliente al que se le pregunta todo de a poco, sin orden, responde cada vez peor.
- **Registre la decisión en el momento en que la toman.** Reconstruirla el día antes de la entrega produce justificaciones inventadas, y se nota.
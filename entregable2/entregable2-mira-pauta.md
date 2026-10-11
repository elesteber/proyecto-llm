# Entregable 2 — Desarrollo conducido por especificación y por agentes: SDD o BMAD

**Caso MIRA**

Taller de Desarrollo de Software Conducido por Agentes de IA
Escuela de Ingeniería Informática, Facultad de Ingeniería
Universidad de Valparaíso

**Entrega: lunes 19 de octubre de 2026** *(fecha original: lunes 5 de octubre de 2026)*

| Campo | Detalle |
|---|---|
| Actividad | Construcción de un incremento funcional de MIRA mediante SDD o BMAD, a partir del análisis de la Entrega 1, y comparación crítica con ese análisis |
| Caso de trabajo | MIRA — Plataforma de inteligencia multimodal para decisiones empresariales, DPRIME SpA |
| Fecha de entrega | Lunes 19 de octubre de 2026, 14:00 |
| Integrantes por equipo | 3 o 4 (mismo equipo de la Entrega 1) |
| Tiempo de presentación | 15 minutos, con demostración en vivo incluida |
| Tiempo de preguntas | 5 minutos |
| Entregables | Informe escrito (PDF), repositorio con código y artefactos del framework, PPT y presentación oral |
| Modalidad de evaluación | Grupal, con preguntas individuales durante la ronda de preguntas |

---

## 1. Objetivo

### 1.1 Objetivo general

Aplicar un método de desarrollo conducido por especificación (SDD, Spec-Driven Development) o por agentes con roles (BMAD) para transformar el análisis de requisitos de la Entrega 1 en un incremento funcional de MIRA, con interfaz de usuario incluida, y evaluar críticamente qué ocurre con los requisitos, los supuestos y las decisiones cuando un agente los lleva desde el análisis hasta el código.

El énfasis de la actividad está en la continuidad y la trazabilidad: el análisis de la Entrega 1 es la entrada del proceso, no un documento archivado. Lo que interesa no es solo que el software funcione, sino poder explicar qué se mantuvo, qué cambió, por qué cambió y quién lo decidió: el equipo, el representante del cliente o el agente, con o sin aviso.

### 1.2 Objetivos específicos

Al finalizar la actividad, el equipo debe ser capaz de:

- Configurar y operar de punta a punta un método SDD o BMAD, produciendo los artefactos exigidos en cada fase y revisándolos antes de avanzar a la siguiente.
- Usar el informe de la Entrega 1 (requisitos, bitácora de decisiones, hallazgos y backlog) como entrada del método, preservando los identificadores de origen.
- Implementar dos funcionalidades de MIRA, con interfaz y lógica de negocio, verificadas por pruebas automatizadas derivadas de las pruebas de la Entrega 1.
- Mantener una cadena de trazabilidad verificable: requisito de la Entrega 1, especificación, tarea o historia, commit y prueba.
- Comparar el resultado con la Entrega 1 e identificar requisitos modificados, supuestos invalidados y decisiones reabiertas, distinguiendo quién originó cada cambio.
- Detectar las decisiones que el agente tomó sin declararlas y llevarlas al representante del cliente antes de darlas por buenas.

### 1.3 Qué se espera como salida

La salida es un incremento ejecutable y trazable. El criterio operativo es el siguiente: un evaluador clona el repositorio, sigue el README y, en menos de 15 minutos, tiene las dos funcionalidades corriendo sobre los datos de prueba del equipo. Además, puede tomar cualquier requisito Must de la Entrega 1 incluido en el alcance y seguirlo hasta su especificación, su tarea, su código y su prueba. Si alguna de las dos condiciones no se cumple, el incremento está incompleto.

---

## 2. Material de trabajo

El equipo trabaja sobre tres insumos:

- Descripción del proyecto MIRA
- Retroalimentación recibida en la corrección de la Entrega 1. Puede incorporarse, pero toda corrección que modifique un requisito o una decisión se registra en la bitácora como decisión nueva, no se edita en silencio el informe anterior.

> Nota: el documento original dice "tres insumos" pero lista solo dos.

---

## 3. Métodos admitidos

Cada equipo elige uno de los dos métodos y lo declara en la portada del informe, junto con la herramienta concreta y su versión. No se aceptan mezclas ad hoc: si el equipo adapta el método, la adaptación se documenta como decisión.

### 3.1 Opción A: SDD (Spec-Driven Development)

Se recomienda GitHub Spec Kit; se aceptan herramientas equivalentes (por ejemplo, Kiro) siempre que cubran las fases indicadas. La especificación es el artefacto principal y el código se deriva de ella.

| Fase | Artefacto mínimo exigido | Condición específica de esta entrega |
|---|---|---|
| Constitución | Archivo de principios no negociables del proyecto | Debe incorporar como principios las decisiones DEC de la Entrega 1 que apliquen al alcance, citando su identificador. |
| Especificación | Especificación funcional de cada funcionalidad | Cada requisito conserva su ID de la Entrega 1 (RQF-xxx); los requisitos nuevos llevan ID nuevo y fuente. |
| Aclaración | Registro de preguntas y respuestas | Toda pregunta del agente se responde con el representante del cliente y se cita la fuente o la decisión. |
| Plan | Plan técnico: arquitectura, datos, contratos | Debe declarar qué RQNF de la Entrega 1 atiende y cómo se verifican. |
| Tareas | Lista de tareas ordenada | Cada tarea referencia al menos un requisito. |
| Análisis de consistencia | Reporte de consistencia entre artefactos | Si la herramienta no lo ofrece, el equipo lo realiza con un prompt propio y lo adjunta. |
| Implementación | Código, pruebas y commits | Un commit o PR por tarea o grupo coherente de tareas. |

### 3.2 Opción B: BMAD

Se usa BMAD-METHOD u otra implementación del mismo esquema de agentes con roles. Cada rol produce un artefacto que el rol siguiente consume.

| Rol | Artefacto mínimo exigido | Condición específica de esta entrega |
|---|---|---|
| Analyst | Project brief | Construido desde el informe de la Entrega 1; cita las DEC y los H que acotan el alcance. |
| PM | PRD | Requisitos con el ID de la Entrega 1; los nuevos con ID nuevo y fuente. |
| UX Expert | Especificación de interfaz | Obligatorio en esta entrega, porque el front está en el alcance. |
| Architect | Documento de arquitectura | Declara qué RQNF de la Entrega 1 atiende y cómo se verifican. |
| PO | Validación y fragmentación de documentos | Registra las inconsistencias detectadas entre PRD y arquitectura. |
| SM | Historias | Cada historia referencia la HU de origen del backlog de la Entrega 1, si existe. |
| Dev y QA | Código, pruebas y revisión de QA | Un commit o PR por historia; la revisión de QA queda en el repositorio. |

### 3.3 Reglas comunes a ambos métodos

- Los artefactos de cada fase viven en el repositorio y se versionan. Se espera ver en el historial la secuencia de fases, no una carga única.
- El equipo revisa cada artefacto antes de pasar a la fase siguiente. Las correcciones humanas a un artefacto generado se hacen en un commit propio, para que el diff muestre qué cambió el equipo.
- Se conserva evidencia del trabajo con el agente: prompts, comandos y salidas relevantes, en anexos o en una carpeta del repositorio.

---

## 4. Alcance del incremento

### 4.1 Selección de funcionalidades

El equipo implementa dos funcionalidades, cada una con su interfaz de usuario y su lógica de negocio, elegidas desde el siguiente menú. Cada funcionalidad se implementa completa dentro de su alcance: una interfaz sin reglas o unas reglas sin interfaz no cuentan como funcionalidad.

| ID | Funcionalidad | Alcance mínimo |
|---|---|---|
| F1 | Bandeja de revisión asistida | Lista de casos derivados, razón de derivación, desglose de señales, evidencia con ubicación del hallazgo, decisión del operador con motivo, marca de discrepancia, tiempo restante y alerta de vencimiento. |
| F2 | Diseñador de flujos con versiones | Armado de un flujo con bloques, prueba sobre casos de ejemplo, publicación explícita, historial de versiones y reversión. |
| F3 | Ingesta y validación de legibilidad | Carga de evidencia desde el navegador, asociación a un caso, verificación de legibilidad y rechazo con razón comprensible. |
| F4 | Puntaje y decisión por umbrales | Cálculo del puntaje con componentes, mínimos por señal, precedencia de señales de fraude y decisión resultante. |
| F5 | Gestión de umbrales | Configuración de umbrales por flujo, registro de autor, fecha y valor anterior, y aprobación del cambio. |
| F6 | Rastro de auditoría y expediente | Registro inalterable de lo ocurrido en un caso, consulta desde la interfaz y descarga del expediente. |
| F7 | Medición de consumo | Conteo de validaciones según el criterio definido, visible para el cliente, con detalle caso a caso. |
| F8 | Panel de indicadores | Volumen, proporción automática y derivada, tiempos de resolución y casos en que el operador contradijo a la plataforma. |
| F9 | Catálogo de módulos con versión fijada | Panel de módulos activos y versión, fijación de versión por flujo y comparación antes de actualizar. |

### 4.2 Reglas de selección

- Las dos funcionalidades deben conectarse: una produce o modifica datos que la otra consume. Por ejemplo, F4 con F1, F2 con F9, F1 con F6 o F5 con F4. Dos funcionalidades aisladas no cumplen la regla.
- Al menos una debe tocar un hallazgo que el equipo dejó abierto o resolvió con un supuesto en la Entrega 1.

### 4.3 Motor simulado y datos de prueba

El motor de análisis no se construye. El equipo prepara un conjunto de al menos 3 casos de prueba que ya traen las señales, el puntaje y sus componentes, con evidencia de ejemplo ficticia (imágenes o PDF creados por el equipo, nunca datos reales, en línea con el capítulo 4).

### 4.4 Interfaz y tecnología

- Aplicación web con la interfaz en español. El stack es libre, pero se declara en el plan o en la arquitectura y se justifica.
- La interfaz debe permitir recorrer las dos funcionalidades de punta a punta sin usar herramientas de desarrollo ni editar la base de datos a mano.
- El repositorio incluye un README con los pasos para levantar el sistema y cargar los datos de prueba.

---

## 5. Rol del representante del cliente

Se mantiene el rol definido en la Entrega 1 y debe rotar: quien lo ejerza en esta entrega no puede ser quien lo ejerció en la anterior, y queda identificado en la portada del informe. En esta entrega el rol suma tres responsabilidades:

- Validar la constitución o el brief antes de la especificación, confirmando que refleja las decisiones de la Entrega 1.
- Responder las preguntas que el agente levante en la fase de aclaración o en el PRD, fundado en el documento, las entrevistas y la bitácora. Si no hay fuente, declara el supuesto y lo registra.
- Aceptar o rechazar cada funcionalidad contra sus criterios de aceptación, en una sesión de aceptación registrada en el informe.

---

## 6. Entregables

El equipo entrega cuatro piezas: el informe escrito con la estructura de este capítulo, el repositorio con código, artefactos del método y datos de prueba, la presentación en PPT y la exposición oral con demostración en vivo.

Las extensiones son máximos y se hacen cumplir: lo que exceda el límite de una sección no se lee.

| Sección | Extensión máxima |
|---|---|
| 6.1 Resumen ejecutivo | 1/2 plana |
| 6.2 Introducción y selección de funcionalidades | 1 plana |
| 6.3 Aplicación del método | 2 planas |
| 6.4 Implementación | 1,5 planas |
| 6.5 Pruebas y verificación | 1,5 planas |
| 6.6 Comparativa con la Entrega 1 | 3 planas |
| 6.7 Discusión | 1 plana |
| 6.8 Conclusiones | 1/2 plana |
| Anexos (matriz completa, bitácora, prompts, capturas) | Sin límite, no se evalúa por extensión |

> Nota: el índice del documento original menciona una sección "6.7 Trazabilidad y bitácora de decisiones" (con error de referencia), pero el cuerpo y la tabla de extensiones numeran 6.7 como Discusión y 6.8 como Conclusiones.

### 6.1 Resumen ejecutivo

Media plana, dirigida a quien decide. Debe responder qué se construyó, con qué método, cuáles fueron los tres cambios más relevantes respecto del análisis de la Entrega 1 y qué se recomienda hacer a continuación. Sin jerga técnica y sin describir el proceso de trabajo.

### 6.2 Introducción y selección de funcionalidades

Una plana. Contexto del incremento, funcionalidades elegidas y su justificación según las reglas de 4.2, método y herramienta con su versión, stack tecnológico, composición del equipo e identificación de quien ejerció el rol de representante del cliente.

### 6.3 Aplicación del método

Dos planas. Recorrido por las fases del método elegido, mostrando para cada una qué artefacto se produjo, qué entrada recibió y qué corrigió el equipo sobre lo que generó el agente. No se trata de describir la herramienta, sino de mostrar cómo se usó en este caso.

Debe incluir, como mínimo:

- Cómo se tradujeron las decisiones de la Entrega 1 a la constitución o al brief, con al menos dos ejemplos concretos.
- Las preguntas relevantes que el agente levantó y cómo se respondieron.
- Al menos un caso en que el equipo rechazó o corrigió un artefacto generado, con el antes y el después.
- Qué fase aportó más valor y cuál fue más costosa en relación con lo que aportó.

### 6.4 Implementación

Una plana y media. Arquitectura del incremento (se sugiere un diagrama de contenedores o componentes en Mermaid), modelo de datos efectivamente implementado, capturas de la interfaz de ambas funcionalidades y estado real del incremento: qué funciona, qué funciona parcialmente y qué quedó fuera. Declarar lo que no funciona suma; ocultarlo y que aparezca en la demostración resta.

Debe indicarse, de forma aproximada y con evidencia en el repositorio, qué parte del código generó el agente sin cambios, qué parte corrigió el equipo y qué parte escribió el equipo.

### 6.5 Pruebas y verificación

Una plana y media. Las pruebas se derivan de las pruebas PF y PX de la Entrega 1 que correspondan al alcance; las que fue necesario reescribir se identifican y se explica por qué. Se exige:

- Pruebas automatizadas que cubran los requisitos Must del alcance, incluidas las reglas del capítulo 3 aplicables y al menos un flujo alternativo o de excepción por funcionalidad.
- Al menos una prueba de extremo a extremo por funcionalidad, que recorra la interfaz.
- Al menos una prueba extra-funcional con umbral medible, heredada o reformulada desde un RQNF de la Entrega 1.
- Una prueba de usabilidad simple: un integrante de otro equipo resuelve una tarea de cada funcionalidad sin instrucciones previas, en línea con el capítulo 4. Se registra la tarea, si la completó, el tiempo y las dificultades observadas.
- La sesión de aceptación con el representante del cliente: qué criterios se aceptaron y cuáles se rechazaron.

> **Advertencia:** un agente tiende a escribir pruebas que confirman su propia implementación. Las pruebas deben verificar los criterios de aceptación de la Entrega 1, no el comportamiento que el código ya tiene.

### 6.6 Comparativa con la Entrega 1

Tres planas. Es la sección central del informe. Compara lo analizado en la Entrega 1 con lo que quedó especificado e implementado, y se compone de dos tablas obligatorias, tres indicadores y las respuestas a las preguntas guía.

> Nota: el documento original no detalla en el texto cuáles son las dos tablas ni los tres indicadores (solo hace referencia a una "tabla 6.6.1" para clasificar los requisitos cambiados).

#### 6.6.1 Preguntas guía

Las preguntas de los bloques A y B son obligatorias. De los bloques C, D y E se responden al menos cuatro. Cada respuesta se apoya en evidencia del repositorio o en una cita, no en impresiones.

**A. Requisitos**

- ¿Qué requisitos cambiaron? Clasifíquelos según la tabla 6.6.1 y explique el motivo de los más relevantes.
- ¿Qué requisitos Must de la Entrega 1 no llegaron a especificación, tarea o prueba, y por qué?
- ¿Qué agregó el método o el agente sin respaldo en ninguna fuente? ¿Se aceptó o se rechazó, y con qué criterio?
- ¿Qué RNF de la Entrega 1 no pudieron traducirse en una prueba automatizada? ¿Estaba mal formulado el requisito o es una limitación del método?

**B. Supuestos y decisiones**

- ¿Los supuestos se mantuvieron iguales? ¿Cuáles se invalidaron al bajar a plan o a código, y quién lo detectó: el equipo, el agente o el representante del cliente?
- ¿Qué decisiones de la bitácora respetó el método y cuáles contradijo o reabrió sin avisar?
- ¿Qué ambigüedades resolvió el agente por su cuenta? ¿Coinciden con lo que habría decidido el representante del cliente?

**C. Inconsistencias**

- ¿Qué hallazgos de la Entrega 1 siguen abiertos? ¿Qué hallazgos nuevos aparecieron solo al diseñar o implementar?
- ¿El plan técnico o la arquitectura contradicen algún requisito o alguna restricción del capítulo 4?

**D. Modelo y calidad**

- ¿Cambió el modelo de dominio? ¿Qué entidades o atributos nuevos exigió la implementación?
- ¿Los criterios de aceptación de la Entrega 1 eran lo bastante precisos para generar pruebas ejecutables? ¿Cuáles hubo que reescribir?

**E. Proceso**

- ¿Qué artefacto de la Entrega 1 fue más útil como entrada al método y cuál resultó irrelevante?
- Sabiendo lo que saben ahora, ¿qué harían distinto en la Entrega 1?
- ¿Cuánto de la especificación final escribió el equipo y cuánto el agente? ¿Cómo lo evidencian con commits o diffs?

### 6.7 Discusión

Una plana. Aquí el equipo reflexiona, no resume. Algunas preguntas que la sección puede abordar:

- ¿Dónde el método aportó estructura útil y dónde fue burocracia que no mejoró el resultado?
- ¿La constitución o el PRD lograron que el agente respetara las decisiones de la Entrega 1? ¿Dónde fallaron?
- ¿Qué se perdió en el camino entre la especificación y el código?
- ¿Cómo se compara este trabajo con el prompting directo de la Entrega 1 en precisión, esfuerzo y control?
- ¿Qué esperarían encontrar si hubieran usado el otro método?

### 6.8 Conclusiones

Media plana. Cierre sobre el objetivo de aprendizaje: qué sabe hacer el equipo ahora que no sabía antes y qué queda pendiente para la siguiente entrega.

---

## 7. Presentación oral

La presentación dura 15 minutos, seguidos de 5 minutos de preguntas. El tiempo se controla y se corta.

| Bloque | Tiempo sugerido |
|---|---|
| Contexto, funcionalidades elegidas y método | 2 min |
| Aplicación del método y artefactos principales | 3 min |
| Demostración en vivo de las dos funcionalidades | 4 min |
| Comparativa con la Entrega 1 | 5 min |
| Cierre | 1 min |

Condiciones:

- Expone todo el equipo y nadie puede quedar sin hablar.
- La demostración se hace sobre la versión etiquetada que se entregó. Se permite un video de respaldo grabado sobre esa misma versión, solo si la demostración en vivo falla por causas ajenas al equipo.
- Durante las preguntas, cualquier integrante puede ser consultado sobre cualquier parte del trabajo, incluido el código. Responder "esa parte la hizo otro" o "eso lo generó el agente" no es una respuesta aceptable.
- No se lee la diapositiva ni materiales de apoyo.

---

## 8. Evaluación

La evaluación considera diez criterios. Cada criterio se califica con nota de 1,0 a 7,0 y todos ponderan lo mismo (10 %). La nota final es el promedio simple de las diez notas, con un decimal.

| Criterio | Ponderación |
|---|---|
| C1. Resumen ejecutivo | 5 % |
| C2. Introducción y selección de funcionalidades | 5 % |
| C3. Aplicación del método (SDD o BMAD) | 10 % |
| C4. Implementación | 20 % |
| C5. Pruebas y verificación | 5 % |
| C6. Comparativa con la Entrega 1 | 30 % |
| C8. Discusión | 5 % |
| C9. Conclusiones | 5 % |
| C10. Presentación oral, demostración y respuestas | 15 % |

> Nota: el documento original es inconsistente aquí. Dice "diez criterios" con peso igual de 10 %, pero la tabla lista nueve (falta C7) con ponderaciones distintas que suman 100 %.

Descuentos, aplicados sobre la nota del criterio afectado:

- Cita o referencia inexistente (a la fuente, a un commit, a una prueba o a una decisión): descuenta 1,0 punto en el criterio donde aparece, por cada ocurrencia, hasta llegar a 1,0.
- Artefacto obligatorio del método ausente.
- Funcionalidad que no se puede levantar siguiendo el README: la nota máxima de C4 es 3,0.
- Exceso de extensión: no se evalúa el contenido que supera el límite de la sección.

---

## 9. Rúbrica

Cada criterio se califica según los descriptores siguientes. Las notas intermedias se asignan cuando el trabajo cumple parcialmente el nivel superior. La calificación 4,0 corresponde al cumplimiento suficiente del criterio.

| Criterio | 7,0 | 5,0 a 6,0 | 3,0 a 4,0 | 1,0 a 2,0 |
|---|---|---|---|---|
| C1. Resumen ejecutivo | Responde las cuatro preguntas de 6.1 en media plana, sin jerga. Los tres cambios elegidos son los más relevantes y la recomendación es accionable. | Responde las cuatro preguntas, con algo de jerga o con cambios no del todo prioritarios. | Omite alguna pregunta, describe el proceso en vez de los resultados o supera la extensión. | Ausente o sin relación con el trabajo. |
| C2. Introducción y selección | Contexto, método con versión, stack, equipo y representante identificados. Selección justificada por riesgo, con conexión explícita entre funcionalidades y cruce con un hallazgo de la E1. | Elementos completos; la justificación es correcta pero genérica. | Falta algún elemento o la justificación no usa el criterio de riesgo. | Ausente o incumple las reglas de 4.2. |
| C3. Aplicación del método | Todas las fases con su artefacto en el repositorio. Las DEC se reflejan en la constitución o el brief. Se muestran preguntas del agente, correcciones del equipo con antes y después, y una evaluación honesta de costo y valor por fase. | Fases completas y trazables a la E1, con evidencia de revisión humana en la mayoría. | Fases incompletas o artefactos aceptados sin revisión visible; la E1 aparece poco como entrada. | No se aplicó el método o se partió de la descripción cruda. |
| C4. Implementación | Las dos funcionalidades corren desde el README, conectadas entre sí, con interfaz en español recorrible de punta a punta. Arquitectura y modelo claros; estado declarado con honestidad y aporte del agente evidenciado. | Ambas funcionan con defectos menores o con alguna parte de la interfaz incompleta. | Una funcionalidad incompleta, sin conexión real entre ellas o con fallas en la demostración. | No se puede levantar o no existe interfaz. |
| C5. Pruebas y verificación | Pruebas automatizadas derivadas de la E1 que cubren los Must, reglas del capítulo 3 y excepciones. E2E por funcionalidad, prueba extra-funcional medible, usabilidad con externo y sesión de aceptación registradas. | Cobertura de Must y E2E completas; falta profundidad en excepciones, usabilidad o aceptación. | Pruebas solo del camino feliz o no vinculadas a los criterios de la E1. | Sin pruebas automatizadas. |
| C6. Comparativa con la E1 | Ambas tablas completas y verificables, tres indicadores calculados y respuestas A, B y cuatro de C a E fundadas en evidencia. Distingue con precisión qué originó el equipo, el cliente y el agente. | Tablas e indicadores completos; algunas respuestas son descriptivas más que analíticas. | Falta una tabla, algún indicador o las respuestas obligatorias; afirmaciones sin evidencia. | Ausente o se limita a resumir el trabajo. |
| C8. Discusión | Reflexión crítica con ejemplos concretos del caso. Reconoce dónde el método o el agente falló y extrae aprendizajes transferibles. | Reflexión pertinente con algún ejemplo concreto. | Mayormente resume o generaliza sin ejemplos. | Ausente. |
| C9. Conclusiones | Cierre sobre el aprendizaje, específico, con pendientes concretos y coherentes con la discusión. | Cierre correcto pero general. | Repite el resumen o no aborda el aprendizaje. | Ausente. |
| C10. Presentación y respuestas | Respeta el tiempo, participa todo el equipo, la demostración en vivo funciona sobre la versión etiquetada y todos responden con dominio, incluido el código. | Buena exposición y demostración, con alguna respuesta imprecisa. | Excede el tiempo, lee diapositivas, la demostración falla o hay integrantes que no responden. | No se presenta o no hay demostración. |

---

## 10. Condiciones de entrega

- Informe en PDF con la nomenclatura `NUMEROGRUPO-MIRA-<apellidos separados por guion>.pdf`, y presentación en PPT. Los diagramas deben ser legibles.
- Repositorio del equipo con el código, los artefactos del método, los datos de prueba y el README. La versión evaluada se identifica con la etiqueta `v2.0`; los commits posteriores a la hora de entrega no se consideran.
- Plazo de entrega: **lunes 19 de octubre de 2026 hasta las 14:00** *(fecha original: 5 de octubre)*. La entrega fuera de plazo se descuenta según el reglamento del curso.
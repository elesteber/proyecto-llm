# Requisitos con Agentes de IA
### Del vibe coding a un entregable defendible

---

## 1. Vibe coding

**Qué es:** término acuñado por Andrej Karpathy (febrero 2025) para una práctica que ya existía: describir lo que quieres en lenguaje natural, aceptar lo que el modelo devuelve y seguir iterando por descripción, sin leer el código.

**El ciclo, en la práctica:** pides algo → corre → falla → pegas el error → sigues. En ningún momento alguien lee el diff.

No es una mala práctica por definición — es una práctica *sin control*, y su valor depende de para qué se use.

**Lo que sí resuelve:**
- **Velocidad de exploración:** un prototipo desechable en minutos, no en días.
- **Barrera de entrada:** alguien sin dominio del stack llega a algo que corre.
- **Descubrimiento:** a veces no sabes qué quieres hasta que lo ves andando.
- **Trabajo desechable:** scripts de una vez, migraciones puntuales, demos.

**Dónde revienta:**
- **No sabes qué pediste:** sin requisitos no hay forma de decir si está bien. "Funciona" no es lo mismo que "es correcto".
- **El 80% en veinte minutos:** el 20% que falta exige entender el código que nadie leyó.
- **Deuda invisible:** decisiones de arquitectura tomadas por defecto por el modelo, que nadie audita ni puede justificar.
- **No escala al equipo:** nadie más puede recibir ese código — ni tú mismo en tres semanas.

> El problema del vibe coding no es el código: es que nadie definió qué se estaba construyendo. Por eso el curso parte por requisitos y no por programar.

---

## 2. Las cinco técnicas de prompting

Cada técnica se enseñó en tres pasos: primero se intenta sin instrucciones especiales (y falla de forma predecible), luego se explica el problema de fondo, y finalmente se aplica la técnica y se compara el antes/después.

### Técnica 1 — Grounded Prompting (anclaje en fuentes)

**El problema:** el modelo no distingue entre lo que le entregaste y lo que aprendió en su entrenamiento. Todo entra al mismo saco, y rellena los huecos con lo que recuerda.

**Los tres pasos de la técnica:**
1. **Separar** — cada fuente en su propia etiqueta, con un identificador.
2. **Citar** — toda afirmación termina con la fuente de donde salió.
3. **Marcar** — lo que no tiene fuente se declara explícitamente, no se rellena.

**¿Cuándo vale la pena usarla?** Cuando el modelo debe responder basándose en documentación interna, políticas de empresa, correos, transcripciones de entrevistas con clientes, o cualquier caso con varias fuentes que podrían contradecirse entre sí.

**Plantilla:**
```text
Eres un asistente estricto. Responde ÚNICAMENTE con base en las fuentes
proporcionadas a continuación.

Reglas:
1. Si las fuentes se contradicen, repórtalas por separado. No promedies
   ni concilies.
2. Cada afirmación debe terminar con el identificador de su fuente,
   ej: [WEB] o [MAIL].
3. Si la respuesta no está en las fuentes, dilo explícitamente.

<WEB> [texto de la fuente 1] </WEB>
<MAIL> [texto de la fuente 2] </MAIL>

Pregunta: ¿Cuál es el plazo de devolución para artículos electrónicos?
```

**Antes vs. después:**
- Antes: "El plazo es de 30 días, aunque en electrónica puede ser menor." (conflicto disuelto en una frase suave)
- Después: "30 días [WEB]. 14 días en electrónica [MAIL]. Las fuentes se contradicen." (conflicto reportado, queda claro que hay que preguntarle al cliente cuál rige)

**Referencia:** Weller, Marone, Weir, Lawrie, Khashabi & Van Durme (2024). *"According to…": Prompting Language Models Improves Quoting from Pre-Training Data.* EACL.

---

### Técnica 2 — Structured Output Prompting (salida estructurada)

**El problema:** en prosa, un dato que falta se lee igual de bien que un dato que está — la fluidez del texto tapa el hueco. Su mayor valor no es el orden: es **hacer visibles las ausencias**.

**Los tres pasos de la técnica:**
1. **Esquema fijo** — se define de antemano qué campos debe traer la salida.
2. **Campos vacíos** — lo que falta aparece como `null`, no desaparece.
3. **Comparable** — dos ejecuciones se pueden diffear y auditar.

**¿Cuándo vale la pena usarla?** Para extraer entidades de texto desestructurado, procesar facturas, migrar datos entre formatos, o siempre que la salida vaya a ser consumida automáticamente por otro script o API.

**Plantilla:**
```text
Extrae la información del siguiente texto y devuélvela ESTRICTAMENTE en
JSON, sin markdown y sin texto introductorio.

Esquema requerido:
{
  "titulo": "string",
  "autor": "string",
  "anio": "number | null",
  "editorial": "string | null",
  "paginas": "number | null",
  "no_encontrado": ["claves cuyo valor quedó en null"]
}

Regla crítica: no infieras ni uses conocimiento externo. Si un dato no
aparece explícitamente en el texto, su valor DEBE ser null y su clave
debe agregarse a "no_encontrado".

Texto: [pegar aquí]
```

**Antes vs. después:**
- Antes: "El nombre de la rosa, de Umberto Eco, publicado en 1980 por Lumen." (el año se rellenó en silencio con conocimiento externo del modelo)
- Después: `anio: null · no_encontrado: ["anio"]` (el hueco queda visible y filtrable)

**Contrapunto a tener en cuenta:** Tam et al. (2024), *Let Me Speak Freely?*, EMNLP — forzar formatos rígidos puede degradar el razonamiento del modelo en algunas tareas, así que conviene evaluar si vale la pena el costo.

**Referencia:** Tam, Fu, Yu et al. (2024). EMNLP.

---

### Técnica 3 — Plan-and-Solve Prompting (planificar y ejecutar)

**El problema:** cuando el modelo tiene que producir el resultado y decidir *cómo* producirlo al mismo tiempo, gana la urgencia por generar y se salta pasos.

**Los tres pasos de la técnica:**
1. **Fase A** — el modelo solo planifica, no produce nada todavía.
2. **Revisión** — el plan se corrige; cuesta dos minutos.
3. **Fase B** — se ejecuta un paso a la vez, usando las salidas anteriores.

**¿Cuándo vale la pena usarla?** Refactorizaciones grandes, migraciones, arquitecturas complejas o documentos largos — cualquier tarea donde revisar el plan sea mucho más barato que revisar el resultado completo.

**Plantilla (Fase 1 — el plan):**
```text
Quiero migrar un blog de WordPress a un generador de sitios estáticos
(Astro), conservando el SEO.

NO ejecutes ningún paso todavía. NO escribas código.

Devuelve solo el plan, en este formato JSON:
[
  {
    "paso": 1,
    "objetivo": "...",
    "entradas_necesarias": "...",
    "salida_esperada": "...",
    "criterio_de_listo": "...",
    "riesgo_asociado": "...",
    "requiere_decision_mia": true/false
  }
]

Ordena los pasos por dependencia real y justifica el orden. Esperaré tu
plan antes de autorizar el paso 1.
```

**Antes vs. después:**
- Antes: el modelo empieza a escribir scripts en el primer mensaje; el inventario de URLs (paso crítico) nunca ocurre.
- Después: siete pasos ordenados, el inventario de URLs queda primero y marca dos decisiones que te corresponden a ti.

**Referencia:** Wang, Xu, Lan, Hu, Lan, Lee & Lim (2023). *Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models.* ACL.

---

### Técnica 4 — Chain-of-Verification / CoVe (verificación en cadena)

**El problema:** el modelo es coherente *consigo mismo*, no con las fuentes. Si en el mismo chat le pides que revise lo que acaba de escribir, lo está defendiendo desde adentro — dirá que está todo bien sin haber verificado nada realmente.

**Los tres pasos de la técnica:**
1. **Preguntar** — el modelo genera preguntas de verificación cerradas sobre su propia salida (enfocadas en cifras, fechas, nombres propios, atribuciones).
2. **Aislar** — esas preguntas se responden en un **contexto nuevo, sin poder ver la salida original** — una conversación nueva, e idealmente un modelo distinto o una instancia limpia, para que no pueda defenderla.
3. **Reconstruir** — se corrige lo que la verificación aislada derribó.

**¿Cuándo vale la pena usarla?** Resúmenes ejecutivos, reportes financieros, historiales médicos o cualquier tarea donde una alucinación (un número o una fecha inventada) tenga un costo alto.

**Plantilla:**
```text
[Turno 1 — Modelo/conversación A]
Resume este artículo en 3 párrafos: [texto]

[Turno 2 — misma conversación]
A partir del resumen que acabas de escribir, genera 8 preguntas de
verificación cerradas, priorizando cifras, fechas y declaraciones
atribuidas a personas. Devuelve SOLO las preguntas.

[Turno 3 — conversación NUEVA, sin el resumen a la vista]
Aquí tienes el texto original: [texto]. Responde estas preguntas
citando el párrafo exacto del que sale cada respuesta. Si el texto no
lo menciona, responde "SIN EVIDENCIA EN EL TEXTO".
Preguntas: [las del turno 2]

[Turno 4 — de vuelta en la conversación A]
Al verificar tus datos contra la fuente, las preguntas 3 y 4 volvieron
"SIN EVIDENCIA EN EL TEXTO". Reescribe el resumen eliminando esas
afirmaciones y ciñéndote a los hechos verificados.
```

**Antes vs. después:**
- Antes: "He verificado el resumen y es correcto." (se releyó a sí mismo, no verificó nada)
- Después: "Tres de ocho preguntas vuelven SIN EVIDENCIA: una cifra y dos atribuciones no estaban en el artículo."

**Referencia:** Dhuliawala, Komeili, Xu, Raileanu, Li, Celikyilmaz & Weston (2024). *Chain-of-Verification Reduces Hallucination in Large Language Models.* Findings of ACL.

---

### Técnica 5 — LLM-as-a-Judge (rúbrica como prompt)

**El problema:** evaluar texto abierto no tiene métrica automática decente. Si le pides a un LLM "ponle nota del 1 al 7", da un número arbitrario que premia lo largo y verboso por sobre lo preciso.

**Los tres pasos de la técnica:**
1. **Criterios** — una rúbrica de criterios binarios, no una nota global.
2. **Evidencia** — cada incumplimiento debe ir acompañado de la cita textual que lo demuestra.
3. **Sin nota global** — se prohíbe la calificación única: ahí es donde entran los sesgos de verbosidad y posición.

Para reducir sesgo de autopreferencia, conviene que el modelo juez sea distinto al que generó el texto (o al menos una instancia nueva y "limpia", sin el contexto de haberlo escrito).

**¿Cuándo vale la pena usarla?** Auditorías de código (code review automatizado), validación de historias de usuario contra el formato INVEST, o filtrado de descripciones de cargo/candidatos en RR.HH.

**Plantilla:**
```text
Eres un auditor de control de calidad implacable. Evalúa el siguiente
texto ESTRICTAMENTE contra la rúbrica. NO des una nota global (ni
números ni letras) ni retroalimentación general.

Evalúa cada criterio como CUMPLE o NO CUMPLE. Por cada NO CUMPLE, cita
textualmente la frase donde ocurre el problema.

Rúbrica:
[C1] Independiente: sin dependencias técnicas duras con otras historias.
[C2] Negociable: deja espacio para que el equipo decida el "cómo".
[C3] Testeable: al menos dos criterios de aceptación claros y validables.

Texto a evaluar: [pegar aquí]

Formato de salida:
- [C1]: CUMPLE / NO CUMPLE — [evidencia o justificación]
- [C2]: ...
- [C3]: ...
```

**Antes vs. después:**
- Antes: "6,2. Está bien redactada y es completa." (premia la más larga, no la más correcta)
- Después: "C1 'perfil proactivo' · C3 'gente joven' (sesgo de edad) · C2 sin banda salarial." — tres hallazgos citables y discutibles.

**Referencia:** Zheng, Chiang, Sheng et al. (2023). *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena.* NeurIPS, Datasets and Benchmarks.

---

## 3. Los artefactos de ingeniería de requisitos

Cada artefacto consume al anterior — por eso el orden importa, y por eso un agente no puede producirlos todos en una sola llamada sin contradecirse a sí mismo. Para cada uno, la clase mostró **los errores típicos de un agente de IA** y la **contramedida** de prompting correspondiente.

### 3.1 Modelo de dominio

Representación de las entidades del negocio y sus relaciones, escrita en el vocabulario del cliente. **Existe aunque el sistema no exista.**

- **Qué entra:** sustantivos que el cliente usa y que existirían sin software.
- **Qué no entra:** identificadores técnicos, fechas de creación, tablas puente.
- **Cardinalidad:** importa el "normalmente uno, a veces dos" del negocio, no la cardinalidad "limpia".

```
erDiagram
  ESTUDIANTE ||--o{ INSCRIPCION : realiza
  SECCION    ||--o{ INSCRIPCION : recibe
  ASIGNATURA ||--o{ SECCION     : se_dicta_en
  ASIGNATURA }o--o{ ASIGNATURA  : es_prerrequisito
```

> Si un término del modelo no está en el glosario, el problema no es el modelo: falta el glosario.

**Con un agente — errores típicos:**
- **Salta al diseño:** devuelve tablas, claves foráneas y tipos SQL. Eso es persistencia, no dominio.
- **Inventa entidades plausibles:** "Departamento", "Facultad", "Periodo" — las vio mil veces en su entrenamiento, no en tus fuentes.
- **Aplana la cardinalidad:** pone `1..*` limpio donde el negocio tiene una excepción mencionada en una entrevista.
- **Ignora las reglas del dominio:** dibuja la relación pero no la restricción que la gobierna.

*Vibe coding sin modelo:* las tablas quedan implícitas en el código, distintas en cada módulo, y nadie puede discutirlas porque no están escritas en ninguna parte.

**Contramedida:** prohibir campos técnicos, exigir que cada entidad y cada relación cite la frase que la justifica, y revisar la cardinalidad con el cliente.

### 3.2 Casos de uso

Descripción de la interacción entre un actor y el sistema para lograr un objetivo — **incluyendo lo que ocurre cuando algo se sale de lo previsto.**

1. **Nivel correcto:** objetivo de usuario, no paso interno ("Inscribir asignatura", no "Validar prerrequisito").
2. **Estructura:** actor, precondición, garantía de éxito, flujo principal numerado, extensiones.
3. **Extensiones:** 3a, 3b, 3c — qué pasa si no hay cupo, si el pago no está al día, si se cae la conexión.
4. **Frecuencia:** cuántas veces al día ocurre; decide dónde vale la pena invertir.

> El flujo principal lo adivina cualquiera. El valor de un caso de uso está en las excepciones.

**Con un agente — errores típicos:**
- **Extensiones genéricas:** "el sistema muestra un mensaje de error" no es una extensión, es relleno.
- **CRUD por defecto:** crea un caso de uso por cada verbo CRUD de cada entidad, aunque nadie lo pidió.
- **Mezcla de niveles:** pone pasos internos del sistema junto a objetivos de usuario en la misma lista.
- **Cierra los huecos solo:** donde la fuente no dice qué pasa, inventa una regla razonable sin avisar.

**Contramedida:** pedir que cada extensión cite su fuente, y que liste aparte —como preguntas para el cliente— las que no puede completar.

### 3.3 Requisitos funcionales

Enunciados de comportamiento **observable**, derivados de los casos de uso (no se inventan en una lista aparte).

- **Formato:** sistema + verbo + objeto + condición. Un solo verbo por enunciado.
- **Atributos:** ID, enunciado, fuente, prioridad, caso de uso de origen, criterio de verificación.
- **Prueba ácida:** ¿puedo escribir un test que falle? Si no, está mal escrito.
- **Observable desde afuera:** "Guarda en la tabla X" no es un requisito funcional.

### 3.4 Requisitos no funcionales

No se derivan de los casos de uso: se derivan de **escenarios de uso bajo condiciones**, en seis partes:

| Parte | Pregunta | Ejemplo |
|---|---|---|
| Fuente | ¿Quién genera el estímulo? | Operador de mesa |
| Estímulo | ¿Qué ocurre? | Carga un lote de 50 documentos |
| Artefacto | ¿Sobre qué parte? | Servicio de validación |
| Entorno | ¿Bajo qué condición? | Hora peak, fin de mes |
| Respuesta | ¿Qué debe hacer? | Procesa el lote y notifica |
| Medida | ¿Cómo se comprueba? | p95 ≤ 90 s, sin pérdida |

> Un requisito funcional se puede agregar después. Un no funcional decide la arquitectura: si llega tarde, se rehace.

### 3.5 De caso de uso a caso de prueba

Cadena: **Caso de uso → Requisito funcional → Criterio de aceptación → Caso de prueba.**

- **Partición de equivalencia:** un caso de prueba por clase de entrada, no uno por dato.
- **Valores límite:** el error vive en el borde (ej. 3,94 / 3,95 / 4,00).
- **Tabla de decisión:** cuando la regla combina varias condiciones a la vez.

> La prueba es el detector: si no puedes escribirla, el requisito está mal redactado, no incompleto.

**Con un agente — errores típicos (RF, RNF y pruebas):**
- **Inventa umbrales:** "menos de 2 segundos" — un número inventado se ve idéntico a uno levantado del cliente.
- **Duplica requisitos:** el mismo comportamiento aparece varias veces con distinta redacción y distinto ID.
- **RNF de manual:** "el sistema será seguro y escalable" — genérico, sin las seis partes.
- **Prueba la implementación:** escribe tests que verifican *cómo* está hecho, no *qué* debía cumplir.

**Contramedida:** prohibir números sin cita, exigir el escenario de seis partes por cada RNF, y correr la rúbrica de la Técnica 5 (LLM-as-a-Judge) sobre la lista antes de aceptarla.

### 3.6 Backlog

Todo lo que falta, en un solo lugar, ordenado. Las historias salen de los casos de uso — **una historia no es un requisito, es la promesa de una conversación pendiente.**

- **Ordenado:** por valor y riesgo, no por módulo ni por lo más fácil de programar.
- **Un ítem por historia:** ID, historia, criterios, estimación, fuente, estado.
- **Vivo:** cambia cada semana; un backlog que no cambia es una lista de deseos.
- **Con dueño:** alguien decide el orden — si lo decide el equipo entero, no lo decide nadie.

**Criterios de aceptación vs. Definition of Done** — dos cosas distintas que se confunden a menudo:

| | Criterios de aceptación | Definition of Done |
|---|---|---|
| Alcance | Por historia, cambian en cada una | Del equipo, aplica a todas por igual |
| Ejemplo | DADO un prerrequisito pendiente / CUANDO intenta inscribir / ENTONCES rechaza e indica cuál | Código, pruebas, revisión, documentación, trazabilidad, despliegue |

> Una historia puede cumplir todos sus criterios y aun así no estar terminada.

**Con un agente — errores típicos:**
- **Cantidad sin cobertura:** genera el mismo CRUD parafraseado ochenta veces y parece un backlog completo.
- **Criterios circulares:** "dado que soy usuario, cuando inscribo, entonces queda inscrito" — no verifica nada.
- **Estima sin base:** pone story points que no significan nada porque no existe velocidad histórica del equipo.
- **Ordena por módulo:** agrupa por pantalla o entidad, nunca por riesgo o valor para el cliente.

**Contramedida:** tope de historias por caso de uso, al menos un criterio de camino no feliz por historia, y la estimación la hace el equipo — no el modelo.

### 3.7 Diagrama de secuencia de sistema (SSD)

Muestra los eventos que un actor envía al sistema durante un caso de uso, en orden, y las respuestas que recibe. **Es análisis, no diseño.**

- **Una sola línea de vida:** el sistema completo — no hay controladores, servicios ni repositorios.
- **De dónde sale:** del flujo principal de un caso de uso; uno por caso de uso.
- **Para qué sirve:** de ahí salen las operaciones del sistema — la API que va a hacer falta.

```
sequenceDiagram
  actor E as Estudiante
  participant S as Sistema
  E->>S: consultarOferta(periodo)
  S-->>E: secciones disponibles
  E->>S: inscribir(seccionId)
  S-->>E: comprobante o motivo
  E->>S: confirmarCarga()
  S-->>E: comprobante en PDF
```

> Si en el diagrama aparece el nombre de una clase interna, te equivocaste de diagrama.

**Con un agente — errores típicos:**
- **Mete la arquitectura:** dibuja Controller, Service y Repository en un diagrama que debía ser caja negra.
- **Inventa mensajes:** agrega llamadas que no están en ningún paso del caso de uso.
- **Olvida las respuestas:** dibuja solo las flechas de ida; se pierde qué devuelve el sistema y en qué formato.
- **Un diagrama para todo:** junta varios casos de uso y el orden deja de significar algo.

**Contramedida:** una sola línea de vida en el prompt, flechas de ida y de vuelta obligatorias, y cada mensaje asociado al número de paso del caso de uso.

---

## 4. El hilo completo

**Dominio → Casos de uso → RF y RNF → Pruebas → Backlog → SSD**

Cada artefacto consume el anterior — de qué hablamos, qué hace el sistema, qué y qué tan bien, cómo se comprueba, en qué orden, qué cruza la frontera.

> El desafío común a las cinco técnicas y a los seis artefactos: el modelo produce lo que vio mil veces en su entrenamiento, no lo que corresponde a las fuentes reales del proyecto. Por eso el curso empieza por requisitos y no por programar.

---

## 5. Referencias citadas en la clase

- Weller, Marone, Weir, Lawrie, Khashabi & Van Durme (2024). *"According to…": Prompting Language Models Improves Quoting from Pre-Training Data.* EACL.
- Tam, Fu, Yu et al. (2024). *Let Me Speak Freely?* EMNLP.
- Wang, Xu, Lan, Hu, Lan, Lee & Lim (2023). *Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models.* ACL.
- Dhuliawala, Komeili, Xu, Raileanu, Li, Celikyilmaz & Weston (2024). *Chain-of-Verification Reduces Hallucination in Large Language Models.* Findings of ACL.
- Zheng, Chiang, Sheng et al. (2023). *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena.* NeurIPS, Datasets and Benchmarks.
- Schulhoff et al. *The Prompt Report* (arXiv:2406.06608).

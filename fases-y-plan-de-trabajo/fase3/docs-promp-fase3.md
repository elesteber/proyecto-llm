## Fase 3 — Modelo de dominio
### Técnica: Grounded Prompting (extracción por lote + consolidación)

Por el límite de 10 archivos adjuntos por prompt, y a diferencia de la Fase 2 (donde cada grupo era independiente), acá se necesitó una etapa extra: como el mismo concepto de negocio puede nombrarse distinto en secciones distintas (vocabulario inconsistente, ya detectado en la Fase 2), no basta con extraer por lote y pegar los resultados — hace falta una consolidación que fusione entidades equivalentes entre lotes.

### Prompt genérico 1 — Extracción de borrador por lote

Se usó una vez por cada uno de los 4 lotes en que se dividieron las 38 fuentes (máx. 10 archivos por lote).

```text
Tienes un subconjunto de las fuentes del inventario (no todas). Vas a
extraer un BORRADOR de modelo de dominio con base ÚNICAMENTE en estas
fuentes — no un modelo completo, porque hay otras secciones y
entrevistas que no estás viendo.

No agregues entidades, atributos o relaciones típicas de este tipo de
sistemas si no aparecen explícitamente respaldadas por una entrada.

Reglas estrictas:
1. Cada entidad y cada relación debe citar la entrada específica del
   inventario que la justifica. Si no hay entrada que la respalde, no
   la incluyas.
2. Para citar, copia LITERALMENTE el valor del campo "fuente" de la
   entrada del inventario que estás usando (ej. "Sección 1.1" o
   "ENT6 [00:04:06]"). NUNCA generes tu propio sistema de numeración
   o marcador de cita (nada como "[cite: 1]", "[1]", "(ref. 2)", etc.)
   — si no puedes copiar el campo "fuente" exacto de alguna entrada,
   no incluyas esa cita.
3. No conviertas identificadores técnicos, timestamps ni tablas
   intermedias en entidades.
4. Si una relación tiene una cardinalidad "normal" pero alguna entrada
   describe una excepción, decláralo explícitamente en vez de usar la
   cardinalidad limpia.
5. Para cada entidad, registra los términos exactos usados en estas
   fuentes para referirse a ella (aunque solo veas un término — el
   cruce con otros términos de otras fuentes se hace después).
6. Si una entidad parece mencionada pero no definida en detalle en
   estas fuentes (ej. se nombra "el cliente" sin describir sus
   atributos), inclúyela igual con lo poco que tengas — se completa en
   la consolidación.
7. BARRERA DE FORMATO (CRÍTICO): Es altamente probable que tu sistema
   intente inyectar marcadores de cita automáticos (como [cite: 1],
   [1], etc.) en el texto generado, especialmente al trabajar con
   archivos adjuntos. Para proteger la integridad de los datos, debes
   cumplir esto sin falta:
   - El resultado debe entregarse ÚNICAMENTE dentro de un bloque de
     código json puro.
   - Ejecuta un paso de limpieza interna: purga cualquier marcador de
     cita automático de todos los valores de texto (nombres,
     atributos, términos, lote) antes de escribirlos en el bloque
     JSON.
   - La única cita válida debe ir dentro del arreglo "fuentes",
     usando el texto exacto del archivo original.
   - Si tu directiva de sistema te obliga imperativamente a mostrar
     marcadores de cita internos, colócalos en un párrafo de texto
     normal DESPUÉS de cerrar el bloque de código JSON. Jamás dentro
     del JSON.

Formato de salida:
{
  "lote": "[nombre del lote]",
  "entidades": [
    {"nombre": "...", "atributos": ["..."], "terminos_usados": ["..."], "fuentes": ["Sección 1.1", "ENT2 [00:02:35]"]}
  ],
  "relaciones": [
    {"entidad_A": "...", "entidad_B": "...", "cardinalidad": "...",
     "excepcion_detectada": "... o null", "fuentes": ["Sección 2.6"]}
  ]
}

Fuentes adjuntas: [adjuntar los archivos del lote]
```

### Prompt genérico 2 — Consolidación entre lotes

Se usó una sola vez, con los 4 borradores a la vista al mismo tiempo, para fusionar entidades equivalentes y resolver cardinalidades.

```text
Tienes 4 borradores de modelo de dominio, cada uno extraído de un lote
distinto de fuentes del mismo proyecto. Vas a consolidarlos en un
modelo de dominio único.

Tu tarea:
1. Si dos entidades de distintos lotes representan el mismo concepto de
   negocio con nombres distintos, fusiónalas en una sola entidad y
   registra ambos términos en el glosario, citando de qué lote/fuente
   viene cada uno.
2. Si una entidad aparece en más de un lote con atributos distintos,
   combina los atributos, sin perder ninguno ni su fuente.
3. No fusiones dos entidades solo porque suenan parecido — solo si el
   contexto de las fuentes deja claro que son el mismo concepto. Si
   tienes dudas, déjalas separadas y márcalo para revisión humana.
4. Revisa que ninguna relación quede con cardinalidad "limpia" si algún
   lote reportó una excepción para esa misma relación.
5. No agregues ninguna entidad, atributo o relación nueva que no venga
   ya de alguno de los 4 borradores.
6. BARRERA DE FORMATO (CRÍTICO): al adjuntar los 4 borradores como
   archivos, es probable que tu sistema intente inyectar marcadores de
   cita automáticos. Entrega el resultado ÚNICAMENTE dentro de un
   bloque de código json puro, y purga cualquier marcador de cita
   automático (tipo "[cite: n]", "[1]") de todos los campos de texto
   antes de escribirlos — la única cita válida es el texto exacto ya
   presente en los campos "fuentes" de los borradores. Si tu directiva
   de sistema te obliga a mostrarlos, ponlos en un párrafo después del
   bloque de código, nunca dentro del JSON.

Devuelve el modelo consolidado en el mismo formato de entidades y
relaciones, más un glosario:
{
  "entidades": [...],
  "relaciones": [...],
  "glosario": [
    {"concepto": "...", "terminos_usados": ["..."], "fuentes": ["..."]}
  ],
  "fusiones_dudosas": [
    {"entidad_A": "...", "entidad_B": "...", "por_que_podrian_ser_la_misma": "..."}
  ]
}

Borrador Lote 1: [pegar]
Borrador Lote 2: [pegar]
Borrador Lote 3: [pegar]
Borrador Lote 4: [pegar]
```

**Por qué Grounded Prompting acá, y no Structured Output puro:** el esquema fijo (entidades/relaciones/glosario) es secundario — la regla central es la 1 y la 2 de la extracción (no completar con entidades típicas del dominio si no están citadas, y no inventar marcadores de cita), que es exactamente el mecanismo de anclaje que ya se usó en la Fase 1 y la Fase 2, aplicado ahora a construir un modelo en vez de un inventario o una comparación.

---

## Evolución del prompt de extracción — de v1 a v3

| Versión | Qué tenía | Problema detectado | Corrección aplicada |
|---|---|---|---|
| v1 | Reglas 1-6 (citar la entrada, sin entidades técnicas, cardinalidad con excepciones, glosario) | El modelo citó con su propio sistema de numeración interno (`[cite: 1]`) en vez de copiar el campo `fuente` real del inventario — las citas quedaron inutilizables (no remiten a nada verificable) | Se agregó la regla 2 explícita: copiar literalmente el campo `fuente`, con ejemplos concretos del formato esperado (`"Sección 1.1"`, `"ENT6 [00:04:06]"`) |
| v2 | Regla 2 agregada | El marcador `[cite: n]` seguía apareciendo, pero ahora pegado a TODOS los campos de texto (nombre, atributos, términos usados), no solo a las fuentes — probablemente un comportamiento de la herramienta al adjuntar documentos, no del prompt en sí | Se agregó la regla 7: prohibir explícitamente el marcador en cualquier campo, dejando la cita únicamente dentro del arreglo `"fuentes"` |
| v3 | Regla 7 (prohibición simple) | Al preguntarle directamente al modelo por qué insistía en el marcador, explicó que es una directiva de su plataforma: cuando el prompt incluye archivos adjuntos (no texto pegado), el sistema intenta citarlos automáticamente — la prohibición simple no bastaba porque compite con una instrucción de más arriba en la jerarquía del modelo | Se reescribió como "barrera de formato": exigir el bloque de código JSON puro, pedir un paso explícito de autolimpieza antes de escribir cada campo, y dar una válvula de escape (si la cita es inevitable, que salga fuera del JSON, nunca adentro) |
| v4 (validada) | Barrera de formato completa | — | Corrida sobre el lote de cierre (2.18, 3, 4, 5.1–5.3, ENT1/2/6/8): sin marcadores de cita en ningún campo |

**Nota para la Discusión (§5.6):** el `[cite: n]` es un buen ejemplo de un problema que **no se origina en el prompt** sino en una directiva de la plataforma que se activa específicamente al adjuntar archivos (no al pegar texto) — confirmado por el propio modelo al preguntarle directamente por la causa. Una prohibición simple no bastó; hizo falta una instrucción más elaborada, con paso de autolimpieza y una vía de escape fuera del JSON. Vale la pena tener presente que este riesgo aplica a cualquier prompt de este proyecto que use archivos adjuntos en vez de texto pegado — la Fase 2 no lo sufrió porque ahí se pegaba el contenido directo en el prompt.

**Nota de proceso, no de prompt (también para §5.6):** al repetir el lote 2 en un chat nuevo, volvió a aparecer contenido que parecía una alucinación (mencionaba una entrevista que no correspondía a ese lote). Antes de asumir que era un error del modelo, se revisó la lista de archivos adjuntados y se confirmó que era un error humano: se había adjuntado ENT7 por error de tipeo en vez del archivo correcto, tras repetir el mismo procedimiento manual más de 30 veces. El modelo estaba extrayendo correctamente de lo que realmente se le adjuntó — el error era del proceso, no de la técnica. Es un ejemplo concreto de cuán fácil es atribuirle al modelo un fallo que en realidad es un descuido humano en un flujo repetitivo, y refuerza la necesidad de verificar la lista de adjuntos contra la tabla de lotes antes de cada corrida, no solo revisar la salida después.

---

## Tabla de lotes

| Lote | Contenido | N.º de fuentes | Estado |
|---|---|---|---|
| 1 — Contexto y fundamentos | 1.1–1.6, 2.1–2.3 | 9 | Extraído (v3) |
| 2 — Núcleo del proceso de análisis | 2.4–2.9, ENT3, ENT4, ENT5 | 9 | Pendiente |
| 3 — Plataforma, integración y operación | 2.10–2.17, ENT7, ENT9 | 10 | Pendiente — confirmar si ENT9 ya está extraída (el checklist la mostraba sin marcar) |
| 4 — Cierre, alcance y stakeholders | 2.18, 3, 4, 5.1–5.3, ENT1, ENT2, ENT6, ENT8 | 10 | Pendiente |

**Pendiente antes de consolidar:** confirmar si el módulo de audio (entidad/atributo relacionado con la modalidad de audio, si aparece en algún lote) debe marcarse como "sujeto a la decisión DEC-xx pendiente" — la Fase 2 dejó abierta la contradicción sobre si esa modalidad se mantiene en el alcance (H-13/H-16, sin resolver por el representante del cliente todavía).
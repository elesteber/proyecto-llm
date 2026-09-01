## Evolución del prompt de extracción — Fase 1 (inventario estructurado)

|Versión|Qué tenía|Problema detectado|Corrección aplicada|
|---|---|---|---|
|v1|Esquema JSON básico (texto, fuente, tipo, sección) sin criterio de clasificación|Categorías `solucion_decidida` vs. `regla_de_negocio` sin definición → mismo tipo de afirmación clasificado distinto según el ítem|Se agregaron 4 definiciones con orden de evaluación estricto (opinion → regla_de_negocio → solucion_decidida → necesidad), cada una con señal típica|
|v2|Definiciones agregadas, pero sin regla explícita contra fusión de fuentes distintas|En 00:04:46, tres afirmaciones de dos fuentes distintas (opinión del gerente + cita del contrato + necesidad) se fusionaron en una sola frase genérica ("existen diferentes interpretaciones internas"), borrando la contradicción que debía quedar servida para la Fase 2|Se explicitó en la regla 2: "si dentro del mismo fragmento distintas personas o documentos dicen cosas distintas sobre el mismo tema, mantenlas como entradas separadas, no las resumas en una sola conclusión"|
|v3|Regla anti-fusión agregada|Apareció un problema nuevo: una entrada anticipaba lo que "el cliente argumentaría" sin que la fuente lo dijera realmente — relleno especulativo dentro de la propia fuente, no fusión de fuentes|Se agregó la regla 5 (nunca generar lo que alguien "podría decir" o "argumentaría"; si el hablante mismo anticipa la postura de un tercero, decirlo explícito como anticipación) y el campo `cita_textual` obligatorio (regla 6), para poder verificar sin re-escuchar el audio completo cada vez|
|v4 (final)|Definiciones + regla anti-fusión + regla anti-anticipación + cita textual obligatoria|—|Validada contra ENT8 [00:00:56–00:15:16]: sin fusiones indebidas, sin anticipaciones disfrazadas, categorías consistentes|


## Promp final utilizado en cada seccion

```
Vas a extraer afirmaciones del siguiente fragmento de un documento de
requisitos. Trabaja ÚNICAMENTE con el texto entregado — no completes
con conocimiento externo ni con suposiciones sobre lo que "normalmente"
diría un documento de este tipo.

Para cada afirmación relevante, devuelve un objeto con este esquema,
en JSON:

{
  "texto": "la afirmación, parafraseada de forma breve",
  "cita_textual": "fragmento textual corto (máx. 20 palabras) tomado
    LITERALMENTE de la fuente, que respalda 'texto'",
  "fuente": "cita exacta: número de sección/página, o ENTn [mm:ss]",
  "tipo": "necesidad | solucion_decidida | opinion | regla_de_negocio",
  "seccion_o_entrevista": "identificador de la sección o entrevista"
}

Para asignar "tipo", evalúa en este orden estricto y detente en la
primera que aplique:

1. opinion — el juicio, expectativa o preferencia de una persona
   puntual, SIN respaldo en un documento formal (contrato, propuesta,
   política escrita). Señal típica: "opina que...", "considera que...".
2. regla_de_negocio — tiene forma condición → consecuencia y está
   establecida formalmente (documento firmado, propuesta comercial,
   política), exista o no software de por medio. Señal típica: "si...,
   entonces...", tramos, umbrales, "está definido que...".
3. solucion_decidida — describe una elección YA TOMADA sobre cómo se
   construye o se opera el sistema (tecnología, mecanismo, proceso),
   sin ser una condición de negocio. Señal típica: "se usará...",
   "el sistema hará X mediante Y".
4. necesidad — describe un problema, carencia o algo que el negocio
   requiere resolver, sin fijar todavía cómo se resuelve. Señal
   típica: "se necesita...", "falta...", "debe poder...".

Reglas estrictas:
1. Si no puedes ubicar una fuente exacta para una afirmación, NO la
   incluyas en el inventario. No inventes ni aproximes la cita.
2. Si una misma idea aparece en más de una fuente, crea una entrada
   por cada fuente por separado — no las fusiones. Si dentro del mismo
   fragmento distintas personas o documentos dicen cosas distintas
   sobre el mismo tema, mantenlas como entradas separadas, no las
   resumas en una sola conclusión.
3. Si el texto contiene una cifra, umbral o plazo, extráelo tal cual
   aparece, sin redondear ni interpretar.
4. No evalúes ni resuelvas contradicciones aquí — tu única tarea es
   extraer, no interpretar. Eso pasa en una fase posterior.
5. NUNCA generes lo que una persona "podría decir", "argumentaría" o
   "esperaría de" otra. Extrae solo declaraciones que la fuente
   atribuye realmente a alguien. Si el hablante mismo anticipa la
   postura de un tercero, extráelo tal cual y dilo explícito en
   "texto" (ej. "Valentina anticipa que el cliente podría argumentar
   que..."), nunca como si fuera la postura directa del tercero.
6. Si no puedes producir "cita_textual" con un fragmento literal real
   de la fuente, no incluyas esa entrada.

Fragmento a procesar: [texto] 

```

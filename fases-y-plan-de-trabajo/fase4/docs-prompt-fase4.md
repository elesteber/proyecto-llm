## Fase 4 — Casos de uso
### Técnica: Plan-and-Solve (selección de los 3 críticos) + Grounded Prompting (redacción del flujo)

### Paso 1 — Plan-and-Solve: selección de candidatos por riesgo

Antes de especificar ningún caso de uso en detalle, se pidió una lista de candidatos con su riesgo estimado, **sin redactar ningún flujo todavía** — igual que en la Fase 0, la selección se separa de la ejecución para no comprometerse con un caso de uso antes de comparar todos los candidatos entre sí.

```text
Tienes el inventario completo de afirmaciones (estructura-texto/*.json) y los 16
hallazgos consolidados de inconsistencias (fase2/consolidacion-contradicciones.json).

NO redactes ningún caso de uso todavía.

A partir del inventario, identifica el conjunto de casos de uso que describe el
documento (uno por cada objetivo de negocio distinto que involucre a un actor
humano o a un sistema externo). Para cada uno, indica:

{
  "caso_de_uso": "...",
  "actor_principal": "...",
  "fuente": "sección(es) donde se describe",
  "riesgo": "alto/medio/bajo",
  "por_que": "una línea, priorizando si hay un hallazgo H-xx de Fase 2 que
    afecte directamente su flujo — una especificación que no sepa qué hallazgo
    la atraviesa es la que más fácil se rehace"
}

Ordena por riesgo, no por orden de aparición en el documento.
```

**Salida usada para decidir (resumen):** el modelo devolvió 11 candidatos. Los 4 con riesgo "alto" fueron los que llevaban al menos un hallazgo H-xx sin resolver incidiendo directamente en su flujo: Evaluar caso automáticamente (H-01), Integrar vía interfaz de programación (H-10, H-11), Resolver caso en revisión asistida (H-12), y Diseñar y publicar un flujo (sin H-xx directo, pero de mayor riesgo de negocio según el resumen ejecutivo del informe). El equipo validó la lista y escogió los 3 primeros — descartando explícitamente "Diseñar y publicar un flujo" del detalle extendido, dejándolo solo en el diagrama general.

👤 **Punto de revisión humana:** la elección final de los 3 fue confirmada por el equipo, no aceptada automáticamente — tal como exige el enunciado (§4, Fase 4 del plan de trabajo).

### Paso 2 — Grounded Prompting: redacción del flujo principal y las extensiones

Para cada uno de los 3 casos de uso elegidos, se pidió la especificación extendida citando cada paso al inventario, sin completar huecos con supuestos genéricos de "cómo funcionaría normalmente un sistema así".

```text
Vas a especificar el caso de uso "[NOMBRE]" en formato extendido: actor
principal, actores secundarios, precondiciones, flujo principal numerado,
flujos alternativos, flujos de excepción, postcondiciones.

Trabaja ÚNICAMENTE con las entradas del inventario que te adjunto para este
caso de uso (estructura-texto/[archivos relevantes].json) y con los hallazgos
de Fase 2 que lo mencionan.

Reglas:
1. Cada paso del flujo (principal, alternativo o de excepción) debe terminar
   citando su fuente exacta (§x.y o ENTn [mm:ss]).
2. Si un paso razonable no tiene respaldo directo en el inventario, NO lo
   redactes como si estuviera definido — inclúyelo en una lista aparte de
   "preguntas pendientes para el representante del cliente".
3. Si dos entradas del inventario que tocan este caso de uso se contradicen
   (revisa los H-xx), no seas tú quien decida cuál vale: señala la
   contradicción explícitamente en el paso correspondiente, en vez de elegir
   una versión y redactar como si no hubiera conflicto.
4. No agregues pasos de UX o de arquitectura típicos de un sistema "como este"
   si la fuente no los menciona (ej. no asumas paginación, no asumas
   reintentos con backoff exponencial, etc.) — eso sería completar con
   conocimiento externo, no con la fuente.

Inventario adjunto: [pegar JSON de las secciones/entrevistas relevantes]
Hallazgos relacionados: [pegar H-xx relevantes]
```

**Antes / después (evidencia para §5.4):**
- **Antes** (sin la regla 3): en un primer intento sobre CU-01, el paso "el sistema aprueba automáticamente sobre el umbral configurado" se redactó usando el umbral de 85 puntos y omitiendo por completo la segunda cifra (80 puntos, condicionada a ausencia de fraude) que también aparece en §2.6 — el modelo "eligió" una de las dos cifras sin avisar que había otra.
- **Después** (con la regla 3 explícita): el mismo paso quedó marcado como posible inconsistencia interna no capturada en Fase 2 (ver "Preguntas pendientes" de CU-01), en vez de imprimirse como un hecho resuelto. Este es un ejemplo concreto de una ambigüedad que ni el inventario (Fase 1) ni la consolidación de hallazgos (Fase 2) habían detectado — solo apareció al redactar el flujo paso a paso y notar que dos citas de la misma sección no encajaban.

👤 **Punto de revisión humana:** ningún paso de "preguntas pendientes" fue resuelto por el modelo; quedan explícitamente para el representante del cliente, según la regla del plan de trabajo (Fase 4, punto 👤).

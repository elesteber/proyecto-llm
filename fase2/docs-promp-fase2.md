## Fase 2 — Detección de inconsistencias
### Técnica: Grounded Prompting (comparación entre fuentes) + Structured Output Prompting (consolidación)

### Prompt genérico 1 — Comparación por grupo (Grounded Prompting)

Se usó una vez por cada uno de los diez grupos del plan de lectura, cambiando solo el tema y las fuentes adjuntas.

```text
Tienes el inventario de afirmaciones extraídas de las siguientes fuentes:
[FUENTE_1].json, [FUENTE_2].json, [FUENTE_N].json (adjuntos a
continuación).

Trabaja ÚNICAMENTE con estas entradas. No uses conocimiento externo sobre
el caso ni completes con lo que "normalmente" ocurriría en un sistema de
este tipo.

Tema de esta comparación: [TEMA — tomado del "que_buscar" del plan de
lectura, sin incluir el "riesgo_de_contradiccion" anticipado].

Tu tarea:
1. Agrupa las entradas que tratan sobre el mismo tema o la misma regla.
2. Dentro de cada grupo, identifica si hay entradas con "fuente" distinta
   que afirman condiciones, umbrales o reglas incompatibles entre sí.
3. No fuerces una contradicción donde no la hay: si dos entradas son
   compatibles o complementarias, no las reportes como conflicto.
4. No resuelvas ni decidas cuál entrada debería prevalecer — tu única
   tarea es detectar y citar ambas partes, no decidir.
5. No reformules las entradas — copia literalmente los campos "texto" y
   "fuente" tal como aparecen en el inventario, no los parafrasees de
   nuevo.

Para cada contradicción encontrada, devuelve:
{
  "tema": "de qué trata el conflicto",
  "entrada_A": {"texto": "...", "fuente": "..."},
  "entrada_B": {"texto": "...", "fuente": "..."},
  "naturaleza_del_conflicto": "en qué exactamente no son compatibles"
}

Si un grupo temático no tiene contradicciones, no lo incluyas en la salida.

Fuentes adjuntas:
[pegar contenido de FUENTE_1.json]
[pegar contenido de FUENTE_2.json]
[pegar contenido de FUENTE_N.json]
```

**Por qué Grounded Prompting acá:** el mismo mecanismo de anclaje de la Fase 1 (no completar con conocimiento externo, citar exactamente lo que dice cada fuente) se reutiliza, pero aplicado a *comparar* en vez de a *extraer* — la regla clave que cambia es la 3 y la 4: en vez de "no dejes huecos sin citar", acá es "no fuerces ni resuelvas un conflicto que no está realmente en las fuentes".

### Prompt genérico 2 — Consolidación (Structured Output Prompting)

Se usó una vez por cada salida del prompt anterior, para llevarlas todas a un formato único con campos de seguimiento para la validación del equipo.

```text
Tienes la salida de una comparación de inconsistencias para un grupo
específico del análisis de requisitos. Vas a reformatearla, sin cambiar
su contenido, agregando campos de seguimiento.

Reglas:
1. No modifiques "tema", "entrada_A", "entrada_B" ni
   "naturaleza_del_conflicto" — cópialos exactamente como vienen.
2. Agrega estos campos a cada objeto:
   - "id": usa el placeholder "H-XX" (se renumera a mano al consolidar).
   - "grupo_origen": usa el texto indicado en GRUPO_ORIGEN.
   - "validado_por_equipo": siempre null.
   - "notas_validacion": siempre "" (string vacío).
3. Si la salida original no tenía ninguna contradicción real (lista
   vacía, o todas terminan diciendo "son compatibles"/"no hay
   conflicto" en su propia justificación), devuelve un arreglo vacío
   []. No inventes ni fuerces un hallazgo para tener algo que mostrar.
4. Devuelve SOLO el arreglo JSON final, sin texto adicional.
5. No abras ni cierres los corchetes del arreglo — varios grupos se
   consolidan después en un solo archivo.
6. Devuelve la salida dentro de un bloque de código (```), aunque
   pidas que no lleve texto adicional — sin el bloque, el chat
   renderiza el JSON como markdown y se pierden partes del contenido
   (ej. corchetes de timestamp como "[00:04:06]").

GRUPO_ORIGEN: [nombre exacto de las secciones/entrevistas de este
grupo — usar el mismo que se usó en el prompt de comparación, no
reescribirlo de memoria: un desliz aquí (ej. poner ENT4 en vez de
ENT6) no rompe el contenido pero sí desorienta a quien intente volver
al archivo original de ese grupo]

Salida a reformatear:
[pegar aquí el arreglo JSON que dio la comparación de ese grupo]
```

**Por qué Structured Output Prompting acá:** el objetivo no es generar contenido nuevo — es forzar un esquema fijo (`id`, `grupo_origen`, `validado_por_equipo`, `notas_validacion`) sobre contenido que ya existe, para que el consolidado sea uniforme y quede listo para que otra persona (el compañero validador) lo complete sin reformatear nada a mano.

---

## Resumen de la Fase 2 — para la sección de Técnicas de prompting (§5.4)

| Grupo (según plan de lectura) | Fuentes | Hallazgos consolidados | Riesgo anticipado |
|---|---|---|---|
| Umbral de confianza (2.6) | 2.6, ENT2, ENT6 | H-01 | Alto — confirmado; ENT2 sin hallazgos (no tocaba el tema) |
| Facturación (2.14 + 1.4) | 1.4, 2.14, ENT1, ENT4, ENT8 | H-02, H-03, H-04 | Alto — confirmado (3 contradicciones independientes) |
| Operación del servicio (2.17 + 2.15) | 2.17, 2.15, ENT7, ENT9 | H-05, H-06, H-07 | Medio — subió a 3 hallazgos, más fuerte de lo anticipado |
| Trazabilidad y auditoría (2.11 + 3) | 2.11, 3, ENT3, ENT6 | H-08, H-09 | Alto — parcial: falta el segundo conflicto anticipado (reproducibilidad exacta vs. no-determinismo) |
| Interfaz e integración (2.10 + 4) | 2.10, 4, ENT3, ENT7 | H-10, H-11 | Alto — parcial: falta el conflicto de tiempos de respuesta (2-5 s vs. 30-40 s) |
| Revisión asistida (2.7) | 2.7, ENT4, ENT5 | H-12 | Medio — confirmado, y más nítido de lo anticipado (sesgo del operador, no solo falta de detalle) |
| Módulos y motor de análisis (2.4/2.5/2.9) | 2.4, 2.5, 2.9, ENT1, ENT3, ENT4 | H-13 | Bajo — confirmado (modalidad audio); H-13 y H-16 son la misma raíz citada dos veces |
| Diseñador de flujos (2.8 + 2.16) | 2.8, 2.16, ENT2, ENT9 | — | Medio — sin hallazgo consolidado aún |
| Contexto y propósito (1.2–1.6, 2.1–2.3) | 1.2–1.6, 2.1–2.3, ENT1, ENT2 (1.1 excluida, revisión manual aparte) | — | Bajo — confirmado, sin inconsistencias reales |
| Alcance y plazos (5.1–5.3) | 5.1, 5.2, 5.3, ENT1 | H-14, H-15, H-16 | Bajo — subió a 3 hallazgos, más fuerte de lo anticipado |

**Total consolidado: 16 hallazgos (H-01 a H-16), con dos observaciones para la validación del equipo:**
- **H-13 y H-16** citan literalmente la misma frase de ENT1 (sacrificar el audio) contra dos partes distintas del documento (2.4 y 5.2) — es una sola raíz con doble impacto, no dos inconsistencias independientes. Pendiente decidir si se fusionan antes de pasar a la tabla §5.5.
- **Dos conflictos que el plan de lectura anticipaba no llegaron a confirmarse**: la promesa de reproducibilidad exacta vs. la advertencia de no-determinismo de ingeniería (grupo 2.11/3), y el choque de tiempos de respuesta prometidos vs. reales (grupo 2.10/4). No se sabe todavía si es que la fuente no lo sostiene con la fuerza que anticipaba el plan, o si se perdió en el camino — queda para revisión antes de cerrar la Fase 2.

**Caso de "la técnica no funcionó bien" (evidencia explícita para §5.4):** al reintentar el grupo de Contexto y propósito en otro modelo (por límite de adjuntos), la salida devolvió 10 supuestas contradicciones que en su propia justificación (`naturaleza_del_conflicto`) se describían a sí mismas como "compatibles" o "sin conflicto" en los 10 casos — es decir, el modelo no aplicó la regla 3 del prompt (no reportar como conflicto lo que es compatible). Se descartaron los 10 candidatos y se confirmó el resultado original (sin inconsistencias) con el otro modelo. Este es un ejemplo concreto de falla de la técnica pese a un prompt idéntico al usado exitosamente en los otros nueve grupos — variación entre modelos, no entre prompts.

**Segundo caso, en la etapa de consolidación:** en una de las corridas del prompt de reformateo, la salida del chat truncó el timestamp entre corchetes (ej. "ENT6 [00:04:06]" quedó como "ENT6") porque no se pidió el bloque de código y el chat interpretó el corchete como sintaxis markdown. Se corrigió agregando la regla 6 al prompt de consolidación (exigir bloque de código) y reextrayendo el timestamp perdido desde el archivo original de esa fuente.
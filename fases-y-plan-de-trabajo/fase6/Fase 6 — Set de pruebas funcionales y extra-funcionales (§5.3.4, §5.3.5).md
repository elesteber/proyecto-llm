# Fase 6 — Set de pruebas funcionales y extra-funcionales (§5.3.4, §5.3.5)

## Técnicas de prompting aplicadas

Según lo prescrito en `Plan_de_Trabajo_MIRA.md` para esta fase:

- **Plan-and-Solve Prompting**: antes de redactar caso por caso, se planificó qué requisitos Must necesitaban prueba, cuáles extensiones de los 3 casos de uso críticos (§5.3.2) aún no tenían cobertura, y qué atributos de calidad tenían respaldo real en las fuentes de MIRA antes de definir el set de pruebas extra-funcionales — evitando redactar pruebas por atributo "de manual" sin fuente.
- **Structured Output Prompting**: formato fijo por tabla (`ID | Verifica | Precondición | Pasos | Resultado esperado` para funcionales; `ID | Atributo | Escenario | Umbral` para extra-funcionales), igual al exigido en el enunciado.
- **Grounded Prompting**: cada caso de prueba cita su requisito de origen (RQF-xxx / RQNF-xxx), la sección del documento o la entrevista, y — cuando corresponde — la decisión de inconsistencia (H-xx) que fijó el valor concreto que se verifica.

## Fuentes usadas

- `fase5/fase5-lester/requisitos_formato_final.md` — 53 RQF + 4 RQNF con columna "Verificación" ya redactada.
- `fase4/casos-de-us0-Lester/caso_de_uso_critico{1,2,3}.json` — flujo principal y extensiones de los 3 casos de uso críticos.
- Las 16 inconsistencias resueltas (H-01…H-16) del informe — fijan los valores concretos (umbral 90 puntos, retención 5-10 años, tramos de cobro, etc.).

## Nota sobre reconciliación de RNF

El archivo `fase5/requisitos-funcionales-y-no-funcionales-final-final.md` (commit más reciente) concatena dos listas de RNF sin deduplicar: la lista limpia de 4 RQNF de `requisitos_formato_final.md`, y un segundo bloque con IDs repetidos y verificación vacía (`PF-`) que cubre atributos de calidad (rendimiento, disponibilidad, residencia de datos, escalabilidad, cifrado, logging) casi ausentes en la primera lista. **Ese archivo no se modificó en esta fase** — se resuelve después junto con el resto de la integración al informe. Para construir el set de pruebas extra-funcionales se tomaron ambos bloques como fuente, citando cada uno por separado; no se inventó ningún umbral que no viniera de una fuente.

El ítem de escalabilidad del segundo bloque ya había sido marcado por la propia auditoría LLM-as-a-Judge de Fase 5 como `[NO CUMPLE: falta Medida y Entorno]`. Se mantiene ese mismo veredicto en la prueba extra-funcional correspondiente (PX-011): se documenta el vacío en vez de inventar un umbral, siguiendo el mismo criterio ya aplicado a RQF-034 y RQF-052 (requisitos "no verificables tal como están").

## Exclusiones deliberadas (con justificación)

- **RQF-013 (tiempo restante / conteo regresivo de casos por vencer en la bandeja)**: excluido de las pruebas funcionales por decisión del equipo. Ningún caso de prueba de esta fase hace referencia a "tiempo restante", aunque el paso 1 del flujo principal de CU-2 lo mencione — ese paso se cubre por el resto de su contenido (visualización de evidencia y alertas), omitiendo la parte de conteo regresivo.
- **"Consumo de recursos del dispositivo"** (atributo sugerido en el enunciado, §5.3.5): no se generó una prueba para este atributo. MIRA es una plataforma cloud con interfaz web para operadores y clientes; no tiene, en esta etapa, un componente de campo o dispositivo móvil propio — la aplicación móvil de captura está explícitamente fuera de alcance (§5.1). El criterio de selección de atributos es el riesgo de negocio, no la disponibilidad de un atributo de la lista sugerida.
- **Reversibilidad de despliegue / ambientes separados** (presente en el segundo bloque de RNF): no se generó una prueba de calidad específica para esto. Es una propiedad del proceso de entrega (release engineering), no un atributo de calidad observable por el usuario final del sistema — no encaja en ninguno de los seis atributos que pide el enunciado (rendimiento, disponibilidad, seguridad, usabilidad, operación sin conexión, volumen).

## Artefactos de esta fase

- [`pruebas-funcionales.md`](./pruebas-funcionales.md) — 45 casos de prueba (PF-001 a PF-045): 42 cubren uno a uno los RQF con prioridad Must (excluido RQF-013), y 3 adicionales cubren extensiones de los casos de uso críticos cuyo RQF de origen no es Must (CU-1 ext. 8a, CU-2 ext. 6b, CU-3 ext. 7a).
- [`pruebas-extra-funcionales.md`](./pruebas-extra-funcionales.md) — 11 pruebas (PX-001 a PX-011) sobre rendimiento, disponibilidad, continuidad ante caída de proveedor externo, seguridad, cumplimiento normativo, usabilidad, volumen de datos y escalabilidad (esta última, marcada explícitamente como no verificable tal como está).

Actúa como un Ingeniero de Requisitos Experto. Tu tarea es analizar el documento de necesidades del proyecto "MIRA" y extraer estrictamente los requisitos funcionales (RQF) y no funcionales (RQNF) que son VITALES y CRÍTICOS para el núcleo del sistema.

Para evitar una explosión de micro-requisitos, consolida las funcionalidades relacionadas en requisitos robustos (apunta a un máximo de 15 a 20 requisitos en total).

Aplica las siguientes técnicas y reglas estrictas:

**1. GROUNDED PROMPTING (Trazabilidad estricta):**
Cada requisito debe estar fundamentado explícitamente en el texto base o las entrevistas. Está estrictamente prohibido inventar o alucinar funcionalidades. En la columna "Fuente", debes citar la sección exacta (ej. §2.5.2) o la entrevista y marca de tiempo (ej. ENT3 [00:04:05]).

**2. STRUCTURED OUTPUT PROMPTING (Formato de salida):**
Genera la salida exclusivamente como una tabla Markdown con la siguiente estructura exacta:
| ID | Tipo | Requisito | Prioridad | Fuente | Verificación |
| :--- | :--- | :--- | :--- | :--- | :--- |

*   **ID:** RQF-XXX o RQNF-XXX.
*   **Tipo:** Funcional o No Funcional.
*   **Requisito:** Enunciado claro.
*   **Prioridad:** Usa MoSCoW (Must, Should, Could, Won't). Distribuye lógicamente; es inaceptable que todos sean "Must" (el equipo humano hará la revisión final y discusión de esta priorización).
*   **Fuente:** Cita exacta. Si el texto original tiene un vacío que requerirá una decisión humana para poder implementarse, añade la etiqueta "[Requiere DEC]".
*   **Verificación:** ID del caso de prueba propuesto (ej. PF-01, PX-02).

**3. LLM-AS-A-JUDGE (Rúbrica estricta para No Funcionales):**
Antes de imprimir cada requisito NO FUNCIONAL (RQNF) en la tabla final, pásalo por esta rúbrica de evaluación internamente. Un RNF válido debe describir un escenario completo con 6 partes:
1. Fuente del estímulo (quién/qué lo inicia).
2. Estímulo (qué ocurre).
3. Artefacto (qué parte del sistema es afectada).
4. Entorno (condiciones, ej. operación normal, red degradada).
5. Respuesta (qué hace el sistema).
6. Medida de respuesta (umbral numérico o condición objetiva verificable).

*Instrucción de Juicio:* Si el RQNF cumple con los 6 puntos y tiene una métrica numérica/objetiva, escríbelo normal en la tabla. Si el RQNF NO CUMPLE con alguno de los puntos o su métrica es ambigua, escríbelo en la tabla, pero en la columna "Requisito" agrega al final la etiqueta en mayúsculas: **[NO CUMPLE: falta {indicar qué parte de las 6 falta}]**. NO lo corrijas automáticamente; déjalo marcado con el error para que el equipo humano lo resuelva.

Imprime solo la tabla solicitada.
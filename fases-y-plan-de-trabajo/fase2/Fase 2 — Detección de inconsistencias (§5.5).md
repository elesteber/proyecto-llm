**Objetivo:** encontrar contradicciones entre fuentes, ambigüedades, vacíos y requisitos no verificables.
 
🔀 Dos formas razonables de encarar esto — elijan según cuánto tiempo quieran invertir:
 
- **Opción A — Grounded Prompting sobre el inventario ya construido:** pedirle al modelo que agrupe las entradas del inventario por tema y señale dónde dos entradas con distinta fuente se contradicen, exigiendo que cite ambas.
- **Opción B — variante del principio de CoVe (aislar el contexto):** el mismo modelo que arma el inventario tiende a ser "generoso" resolviendo tensiones sin avisar, igual que pasa cuando se le pide que revise su propio resumen. Si notan que el modelo está "limando" contradicciones en vez de reportarlas, prueben pedir la comparación en una conversación nueva, dándole solo dos fragmentos del inventario a la vez (sin el resto del análisis a la vista) y preguntando explícitamente "¿estas dos afirmaciones son compatibles? cita ambas".
Empiecen con la Opción A; si ven que el modelo suaviza conflictos reales, cambien a la B para esa parte.
 
👤 **La resolución de cada inconsistencia (columna "Decisión" de la tabla §5.5) es 100% humana.** El modelo puede proponer alternativas — nunca elegir cuál prevalece. Eso lo decide el representante del cliente y queda en la bitácora (DEC-xx).
 
---
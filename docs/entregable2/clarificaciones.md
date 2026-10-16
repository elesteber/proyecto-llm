# Acta Oficial de Sesión de Clarificación con el Cliente (Compuerta 2)

**Proyecto:** MIRA — Plataforma de Inteligencia Multimodal para Decisiones Empresariales (DPRIME SpA)  
**Taller:** Desarrollo de Software Conducido por Agentes de IA — Universidad de Valparaíso  
**Incremento Funcional:** F5 (Gestión y Configuración de Umbrales) + F4 (Evaluación y Decisión por Umbrales)  
**Fecha de Sesión:** Miércoles 14 de Octubre de 2026  
**Artefacto Base:** [`specs/001-f5-f4-umbrales-evaluacion/spec.md`](../../specs/001-f5-f4-umbrales-evaluacion/spec.md)  
**Estado de la Compuerta:** **aprobada por el cliente; revisada por Lester y Jorge (mensaje del 2026-10-15); pendiente revisión de Angel**  

---

## 1. Participantes y Protocolo de Mitigación de Conflicto de Interés (DEC-E2-03 / R-08)

La sesión interactiva de clarificación fue ejecutada exclusivamente por **Rodrigo Guerrero** con el agente de IA el 14 de octubre de 2026. Lester Gonzalez, Jorge Alvarez y Angel Salgado no estuvieron presentes durante dicha interacción.

En cumplimiento del protocolo de mitigación formalizado en **`DEC-E2-03`** (para gestionar el riesgo de conflicto de interés **`R-08`** asociado a que el Representante del Cliente sea a la vez el desarrollador del backend), los roles y estados de revisión del equipo se establecen de la siguiente manera:

1. **Rodrigo Guerrero:** Representante del Cliente para la Entrega 2 (DEC-E2-07) y Desarrollador Backend. Ejecutó la sesión de clarificación interactiva con el agente y dictaminó las opciones vinculantes de negocio en representación del cliente piloto y del área de riesgo.
2. **Lester Gonzalez:** Estrategia de Pruebas y Aseguramiento de Calidad (QA). No estuvo presente en la sesión interactiva; revisó el resultado el 2026-10-14 y lo aprobó formalmente con las correcciones registradas en la bitácora de intervenciones (`docs/entregable2/bitacora-intervenciones.md`).
3. **Jorge Alvarez:** Desarrollador Frontend y Experiencia de Usuario (UI). No estuvo presente en la sesión interactiva; revisó y dio su visto bueno (mensaje del 2026-10-15).
4. **Angel Salgado:** Redactor del Informe, Gobernanza Documental y Custodio de la Constitución. No estuvo presente en la sesión interactiva; revisión pendiente.

---

## 2. Registro Exhaustivo de Clarificaciones

A continuación se registran las cinco preguntas estructuradas formuladas por el agente de IA, las alternativas evaluadas, la resolución vinculante adoptada por el Representante del Cliente y su impacto directo sobre la especificación y los contratos de datos:

```
[Q1: Mínimos y Pesos F4/F5] ──> [Q2: Doble Control y Borrador F5] ──> [Q3: Consistencia Corte y Umbral 60]
                                                                                      │
                                [Q5: Métrica Usabilidad SC-005] <── [Q4: Latencia SLA vs Reproducibilidad]
```

---

### Clarificación 1: Definición de Señales Individuales, Mínimos Propios y Ponderaciones
- **Identificadores Vinculados:** `H-05`, `DEC-05`, `D-07`, `D-08`, `DEC-E2-10(a)`, `RQF-041 [fase5-lester]`, `RQF-044 [final-final]`, `RQF-B09 [PDF pág. 9]`, `RQF-B10 [PDF pág. 9]`.
- **Contexto:** En MIRA §2.6 y ENT3 [00:21:47], Sebastián Alarcón declaró que los mínimos por señal y sus pesos estaban pendientes de definición con el área de riesgo del cliente piloto.
- **Pregunta Formal:** *¿Qué valores normativos de mínimos individuales y ponderaciones relativas por señal regirán formalmente para el flujo de reembolso de gastos médicos durante la marcha blanca?*
- **Alternativas Evaluadas:**
  - *Opción A (Recomendada):* Autenticidad (mín. 70, peso 0.40), Cruce de fuentes (mín. 70, peso 0.40) y Coherencia de solicitud (mín. 60, peso 0.20), con suma exacta de pesos = 1.00. Bandera `alertaFraudeActiva` como booleano independiente.
  - *Opción B:* Mínimos homogéneos (70/70/70) y pesos equitativos (0.34, 0.33, 0.33).
  - *Opción C:* Mínimos tolerantes (60/60/50) con ponderaciones desbalanceadas.
- **Dictamen del Representante del Cliente:** **Opción A ratificada formalmente.**
- **Justificación (redactada por el agente; el cliente solo dictaminó la opción):** Ratifica el supuesto de ingeniería (`[SUPUESTO del equipo]`) acordado en `DEC-E2-10(a)`. El flujo de marcha blanca corresponde al reembolso de consultas médicas y exámenes (MIRA §5.2), donde la no manipulación de la boleta (`autenticidad_documentos`) y la concordancia entre prestador y afiliado (`cruce_fuentes`) concentran el mayor peso analítico por decisión del equipo, mientras que la coherencia de solicitud pondera el 20% restante con tolerancia a 60 puntos.
- **Impacto Técnico:**
  - Fija la fórmula de agregación del motor de F4: `Puntaje Global = (0.40 * aut) + (0.40 * cruce) + (0.20 * coh)`.
  - Configura los valores por defecto de la versión 1 en SQLite.
  - Gobierna los casos sintéticos `CASO-MED-001` y `CASO-MED-002` de `data/casos_prueba.json`.

---

### Clarificación 2: Identidades Simuladas y Ciclo de Vida de Propuestas en Borrador (Doble Control)
- **Identificadores Vinculados:** `H-06`, `H-12`, `D-04`, `D-05`, `DEC-06`, `DEC-E2-10(d)`, `RQF-039 [fase5-lester]`, `RQF-035 [final-final]`, `PF-033`.
- **Contexto:** Para posibilitar la evaluación y prueba en máquina limpia sin módulos de autenticación corporativa pesados (H-06 / D-04), se requería definir el catálogo cerrado de identidades preconfiguradas y la gestión de borradores concurrentes para verificar `PF-033`.
- **Pregunta Formal:** *¿Qué conjunto exacto de identidades preconfiguradas debe incluir el selector de sesión para validar la segregación de funciones y qué ciclo de vida rige para una propuesta en borrador?*
- **Alternativas Evaluadas:**
  - *Opción A (Recomendada):* 5 identidades fijas en la barra superior (`Diseñador 1`, `Diseñador 2`, `Administrador 1`, `Administrador 2`, `Operador 1`). Ciclo de vida con máximo un único borrador activo simultáneo por flujo, con acciones de *Aprobar* y *Desestimar* ejecutables únicamente por un Administrador distinto al proponente.
  - *Opción B:* 3 identidades mínimas sin opción de desestimar.
  - *Opción C:* Identidades dinámicas por texto libre y múltiples borradores paralelos.
- **Dictamen del Representante del Cliente:** **Opción A ratificada formalmente.**
- **Justificación (redactada por el agente; el cliente solo dictaminó la opción):** Contar con dos usuarios para cada rol directivo (`Diseñador 1/2` y `Administrador 1/2`) permite verificar tanto el caso de éxito de aprobación cruzada como el caso de prueba funcional `PF-033` ("aprobación por un segundo administrador distinto"), cubriendo la discrepancia textual entre MIRA §2.13 y PF-033. Limitar a un único borrador activo por flujo previene condiciones de carrera y colisiones de parámetros en la base de datos relacional.
- **Impacto Técnico:**
  - Interfaz web: incorpora selector desplegable de sesión activa en el encabezado.
  - Backend: valida en `/api/umbrales/borrador/aprobar` que `usuarioAprobador !== usuarioProponente`.
  - Persistencia: estado `BORRADOR` bloquea la creación de nuevos borradores hasta que sea `APROBADO` o `DESESTIMADO`.

---

### Clarificación 3: Consistencia Paramétrica de Corte y Comportamiento Bajo Umbral Crítico
- **Identificadores Vinculados:** `H-08`, `DEC-08`, `DEC-E2-10(b)`, `RQF-020 [fase5-lester]`, `RQF-044 [final-final]`, `RQF-B09 [PDF pág. 9]`, `RQF-B11 [PDF pág. 9]`, `RQF-B12 [PDF pág. 9]`, `PF-015`.
- **Contexto:** Al erradicar terminantemente el rechazo automático por mandato normativo (Daniela Cortés, ENT6 [00:04:06]), era necesario definir la consistencia de los cortes numéricos en F5 y el tratamiento de los expedientes bajo 60 puntos en F4.
- **Pregunta Formal:** *¿Debe el sistema en F5 validar obligatoriamente que el umbral de aprobación sea estrictamente mayor que el umbral de riesgo alto (`umbralAprobacion > umbralRiesgoAlto`), y qué comportamiento resolutivo rige si el puntaje global cae bajo este último?*
- **Alternativas Evaluadas:**
  - *Opción A (Recomendada):* Validación estricta en F5 de `umbralAprobacion > umbralRiesgoAlto` (90 > 60 por defecto). En F4, si `scoreGlobal < umbralRiesgoAlto` el caso siempre se deriva (`decision: 'DERIVADO_REVISION'`) y se activa `riesgoAltoRechazo: true`; el motivo lo fija RN-04 (con los valores por defecto 70/70/60 y 0,40/0,40/0,20 será `senal_bajo_minimo`, salvo que haya alerta de fraude, que tiene precedencia (`alerta_fraude`); con otra configuración puede ser `puntaje_bajo_umbral`), garantizando cero rechazos automáticos.
  - *Opción B:* Permitir igualdad de umbrales eliminando el rango intermedio de derivación ordinaria (60 a 89.9 puntos).
  - *Opción C:* Desacoplar ambos umbrales sin validación de orden relativo.
- **Dictamen del Representante del Cliente:** **Opción A ratificada formalmente.**
- **Justificación (redactada por el agente; el cliente solo dictaminó la opción):** La exigencia `umbralAprobacion > umbralRiesgoAlto` garantiza la coherencia del modelo: no puede existir un puntaje que califique simultáneamente para aprobación y para advertencia de riesgo alto. Asimismo, consagra la redefinición del antiguo umbral de 60 de la Entrega 1 (DEC-08, DEC-E2-10(b)): si `scoreGlobal < umbralRiesgoAlto`, el caso siempre se deriva y se activa `riesgoAltoRechazo: true`, con motivo fijado por RN-04 (con los valores por defecto será `senal_bajo_minimo`, salvo que haya alerta de fraude, que tiene precedencia (`alerta_fraude`)), asegurando que ninguna resolución emitida por el software use la palabra "rechazado" ni genere rechazo automático.
- **Impacto Técnico:**
  - Validación de formulario en F5: rechaza peticiones con `umbralAprobacion <= umbralRiesgoAlto` con código HTTP 400.
  - Motor F4: evalúa `riesgoAltoRechazo = (conteo(señales bajo mínimo) >= 2) || (scoreGlobal < umbralRiesgoAlto)`.
  - Decisión siempre confinada a `APROBADO_AUTOMATICO` o `DERIVADO_REVISION`.

---

### Clarificación 4: Ausencia de SLA Contractual Vinculante de Latencia y Foco en Reproducibilidad
- **Identificadores Vinculados:** `H-11`, `H-14`, `DEC-11`, `DEC-14`, `DEC-E2-05`, `RQNF-002 [fase5-lester]`, `RQNF-003 [final-final]`, `SC-004`.
- **Contexto:** En la Entrega 1 se plantearon confusiones respecto a requerimientos de tiempo de respuesta (H-11), requiriéndose clarificar el alcance del criterio C5 de pruebas extra-funcionales para el incremento F5+F4.
- **Pregunta Formal:** *¿Ratifica el Representante del Cliente que para la Entrega 2 no rige ningún SLA de latencia o tiempo de respuesta como requisito vinculante, concentrando la prueba extra-funcional obligatoria exclusivamente en la reproducibilidad determinista al 100%?*
- **Alternativas Evaluadas:**
  - *Opción A (Recomendada):* No rige SLA contractual vinculante de latencia en la Entrega 2. La prueba extra-funcional oficial y medible en C5 es el 100% de reproducibilidad determinista histórica de decisiones sobre versiones guardadas en SQLite (`tests/reproducibility/deterministic.test.ts`). k6 queda como medición exploratoria de línea base sin causal de reprobación.
  - *Opción B:* Imponer un SLA contractual estricto de latencia (< 200 ms en percentil 95).
  - *Opción C:* Implementar un SLA por tramos según complejidad de documentos.
- **Dictamen del Representante del Cliente:** **Opción A ratificada formalmente.**
- **Justificación (redactada por el agente; el cliente solo dictaminó la opción):** La simulación determinista de casos fijos sintéticos (`D-02`) desacopla el motor de modelos pesados de inferencia visual. Medir latencia de milisegundos sobre casos ya calculados carece de valor analítico de negocio. En contraste, la política de auditoría y defensa ante reclamos exige que una decisión tomada hace meses pueda ser reproducida exactamente idéntica ante una auditoría legal o reclamo del asegurado (`H-14` / `RQNF-002 [fase5-lester]`), haciendo de la reproducibilidad determinista al 100% el indicador extra-funcional crítico.
- **Impacto Técnico:**
  - Se programa la suite automatizada en `tests/reproducibility/deterministic.test.ts`.
  - La tabla de auditoría en SQLite almacena `versionUmbralesAplicada`, `scoreGlobal`, `motivo`, `decision` e inputs exactos.
  - Se descartan penalizaciones por latencia en la aceptación del software.

---

### Clarificación 5: Criterio Cuantitativo de Usabilidad y Operatividad de la Interfaz Web
- **Identificadores Vinculados:** `SC-005`, Criterios C4 y C5 de la pauta, Compuerta 5 (Aceptación), Compuerta 6 (Usabilidad Externa).
- **Contexto:** Para asegurar que la aplicación cumpla la pauta de operatividad fluida en español sin intervención técnica y que la prueba con el evaluador externo independiente del sábado 17 (`docs/entregable2/usabilidad.md`) sea objetiva, se requería formalizar la métrica `SC-005`.
- **Pregunta Formal:** *¿Qué criterio cuantitativo de éxito medible debe regir para la facilidad operativa de consulta en la interfaz (`SC-005`) durante la prueba de usabilidad externa y la sesión formal de aceptación con el cliente?*
- **Alternativas Evaluadas:**
  - *Opción A (Recomendada):* Acceso a la consulta de configuración vigente e historial de versiones en ≤ 2 clics desde la navegación principal. Tiempo de ejecución de tareas clave (evaluar caso en F4 o proponer/aprobar borrador en F5) ≤ 3 minutos en la prueba externa por un usuario sin inducción técnica previa.
  - *Opción B:* Vista unificada tipo Dashboard condensada en 1 solo clic.
  - *Opción C:* Evaluación cualitativa libre mediante escala SUS sin límites numéricos.
- **Dictamen del Representante del Cliente:** **Opción A ratificada formalmente.**
- **Justificación (redactada por el agente; el cliente solo dictaminó la opción):** Una meta de ≤ 2 clics para acceder a las vistas operativas y ≤ 3 minutos para evaluar un expediente o modificar una política asegura una curva de aprendizaje mínima para los liquidadores y directores de suscripción del cliente piloto, garantizando además que el evaluador independiente de otro equipo pueda auditar el software sin requerir asistencia técnica ni manuales extensos.
- **Impacto Técnico:**
  - Frontend (React): menú de navegación limpio con acceso directo a "Evaluación de Casos (F4)" y "Gestión de Umbrales (F5)".
  - Métricas de prueba: `docs/entregable2/usabilidad.md` registrará número de clics y cronómetro por tarea.
  - Criterio de aceptación `SC-005` plenamente medible y automatizable en Playwright.

---

## 3. Síntesis de Acuerdos y Supuestos Ratificados

| # | Parámetro / Regla | Estado Previo | Resolución Formal en Clarify | Requisito / Ficha Vinculada |
|---|---|---|---|---|
| **1** | Mínimos y Pesos por Señal | Hallazgo abierto `H-05` / Supuesto | **Ratificado:** Aut 70 (0.40), Cruce 70 (0.40), Coh 60 (0.20), Fraude independiente | `RQF-041 [fase5-lester]`, `DEC-05`, `D-07`, `D-08` |
| **2** | Separación de Roles y Borradores | Duda D-04 / Ambigüedad PF-033 | **Ratificado:** 5 usuarios fijos en selector, máximo 1 borrador activo, Aprobar / Desestimar | `RQF-039 [fase5-lester]`, `PF-033`, `D-04` |
| **3** | Consistencia de Corte y Umbral 60 | Supuesto pendiente de corte | **Ratificado:** `umbralAprobacion > umbralRiesgoAlto` estricto; si `scoreGlobal < umbralRiesgoAlto` siempre deriva con `riesgoAltoRechazo: true` (motivo fijado por RN-04: por defecto `senal_bajo_minimo`, salvo que haya alerta de fraude, que tiene precedencia (`alerta_fraude`); con otra configuración `puntaje_bajo_umbral`) | `RQF-020 [fase5-lester]`, `DEC-08`, `DEC-E2-10(b)` |
| **4** | Exigibilidad de SLA de Latencia | Duda H-11 / Parcialmente abierta | **Ratificado:** Sin SLA vinculante; reproducibilidad determinista al 100% como prueba medible | `H-11`, `H-14`, `DEC-E2-05`, `RQNF-002 [fase5-lester]` |
| **5** | Métrica de Usabilidad SC-005 | Supuesto del equipo | **Ratificado:** Acceso en ≤ 2 clics; tareas clave completadas en ≤ 3 min sin inducción | `SC-005`, Criterios C4/C5, Compuertas 5 y 6 |
| **6** | Delimitación Decisión Final del Operador | Propuesto por Lester en revisión | **Ratificado:** La decisión humana final del Operador sobre un caso derivado (aprobar o denegar tras su revisión) queda fuera de este incremento; F4 solo emite la derivación y la advertencia (Confirmado por Rodrigo Guerrero, representante del cliente, el 2026-10-15, comentario en PR #16) | MIRA §3, DEC-08, F4 emite derivación y advertencia |

---

## 4. Veredicto y Cierre de la Compuerta 2

El Representante del Cliente y los revisores del equipo declaran:

1. Que el archivo [`specs/001-f5-f4-umbrales-evaluacion/spec.md`](../../specs/001-f5-f4-umbrales-evaluacion/spec.md) refleja con fidelidad matemática y operativa las resoluciones acordadas, habiéndose resuelto las 5 consultas de clarificación y habiéndose confirmado el supuesto (f) por Rodrigo Guerrero el 2026-10-15 en PR #16.
2. Que la lista de chequeo de calidad [`requirements.md`](../../specs/001-f5-f4-umbrales-evaluacion/checklists/requirements.md) alcanza 16/16 ítems cumplidos.
3. Que la especificación no contiene detalles prematuros de tecnologías, frameworks ni librerías de implementación, respetando el Principio VI de la Constitución.
4. **Estado de la Compuerta 2:** "aprobada por el cliente; revisada por Lester y Jorge (mensaje del 2026-10-15); pendiente revisión de Angel".

**Fecha de Sesión:** 14 de Octubre de 2026  
**Revisión y Conformidad:**  
- *Rodrigo Guerrero* (Representante del Cliente y Backend): Dictaminado y Aprobado (2026-10-14; confirmación de supuesto (f) en PR #16 el 2026-10-15)  
- *Lester Gonzalez* (Aseguramiento de Calidad y Pruebas): Revisado y Aprobado con correcciones en bitácora (2026-10-14)  
- *Jorge Alvarez* (Frontend y Experiencia de Usuario): Revisado OK (mensaje del 2026-10-15)  
- *Angel Salgado* (Gobernanza y Custodia Documental): Pendiente  

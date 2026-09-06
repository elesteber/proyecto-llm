# Fase 5 — Requisitos funcionales y no funcionales (§5.3.3)

**Técnica:** Structured Output Prompting + Grounded Prompting (generación) y LLM-as-a-Judge (evaluación).

## Paso 1 — Generación base: Extracción y estructuración de requisitos

Para evitar una explosión de micro-requisitos inmanejables y asegurar la trazabilidad absoluta, se utilizó un prompt estructurado que exigía fundamentación estricta en las fuentes originales, consolidando el formato en un solo paso.

### Prompt utilizado

> Actúa como un Ingeniero de Requisitos Experto. Analiza el inventario del proyecto **"MIRA"** y extrae los requisitos funcionales (RQF) y no funcionales (RQNF) críticos.
>
> Consolida funcionalidades para evitar micro-requisitos inconexos.
>
> **Reglas:**
>
> 1. **Grounded Prompting:** Cada requisito debe estar fundamentado explícitamente citando la sección exacta (ej. §2.5.2) o entrevista (ej. ENT3 [00:04:05]) en la columna **"Fuente"**.
> 2. **Structured Output:** Genera exclusivamente una tabla Markdown con las columnas:
>
>    `ID | Tipo | Requisito | Prioridad | Fuente | Verificación`
>
> 3. Propón una priorización preliminar usando **MoSCoW**.

### Resultado de la generación

El modelo generó una tabla preliminar consolidando las necesidades en **18 requisitos estructurados (12 RQF y 6 RQNF)**, eliminando redundancias de la descripción inicial y citando estrictamente su origen. Además, identificó correctamente vacíos donde la fuente no era concluyente, citando múltiples fuentes en conflicto dentro de la misma celda.

**👤 Punto de revisión humana:** La priorización MoSCoW preliminar generada por el modelo fue descartada y reevaluada por el equipo humano. Tal como exige el instructivo de la entrega, *"una lista donde todo es Must no es una priorización"*. El equipo debatió el valor de negocio de cada punto, degradando a **Should** o **Could** aquellas características que no bloqueaban el inicio del desarrollo crítico.

---

## Paso 2 — LLM-as-a-Judge: Auditoría estricta de Requisitos No Funcionales

Dado que las reglas de evaluación penalizan severamente los requisitos no funcionales que no posean un criterio de verificación medible, se ejecutó un segundo prompt evaluador sobre la lista de RQNF generada, utilizando una rúbrica de **6 partes** para obligar al modelo a juzgar la calidad de sus propias salidas.

### Prompt utilizado

> Toma la lista de Requisitos No Funcionales (RQNF) recién generada y actúa como un **Auditor de Calidad (LLM-as-a-Judge)**. Evalúa cada RQNF contra esta rúbrica de 6 partes:
>
> 1. **Fuente del estímulo**
> 2. **Estímulo**
> 3. **Artefacto**
> 4. **Entorno** (ej. red degradada, carga máxima)
> 5. **Respuesta**
> 6. **Medida de respuesta** (umbral numérico o condición objetiva verificable)
>
> **Instrucción estricta:** Si el RQNF cumple las 6 partes, imprímelo tal cual. Si **NO** cumple con alguna, imprímelo pero agrega al final de la descripción la etiqueta en mayúsculas:
>
> `[NO CUMPLE: falta {indicar qué parte falta}]`.
>
> **NUNCA** asumas ni inventes el dato faltante. Devuelve el error al equipo.

### Antes / después — Evidencia para §5.4

**Antes (sin el paso de juez):**

El modelo había dado por válido un RQNF redactado como:

> "El sistema debe procesar los casos de integración de forma asincrónica, sin perder información por caídas, según pide arquitectura (ENT7)".

Este requisito carece del nivel de detalle necesario para ser medible.

**Después (con la rúbrica LLM-as-a-Judge):**

El juez detectó la ambigüedad y devolvió:

> "El sistema debe procesar los casos de integración de forma asincrónica... **[NO CUMPLE: falta Entorno y Medida de respuesta numérica]**".

Esto evitó que el equipo presentara un requisito defectuoso.

**👤 Punto de revisión humana:** El equipo aisló todos los requisitos marcados con `[NO CUMPLE]` y utilizó al representante del cliente para definir las métricas exactas. A partir de esas deliberaciones, se crearon los registros en la bitácora de decisiones (**DEC-**) necesarios para fijar los umbrales numéricos de rendimiento y concurrencia, completando manualmente los requisitos antes de diseñar los casos de prueba extra-funcionales (**PX**).
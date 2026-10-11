# Estado Actual del Proyecto MIRA (Entrega 1, DPRIME SpA)
### Base de Decisión para la Entrega 2: SDD (Spec Kit) vs. BMAD

> **Fecha de actualización:** 11 de octubre de 2026  
> **Alcance del análisis:** Revisión completa de la raíz del repositorio, `fases-y-plan-de-trabajo/` (fase0 a fase8, `estructura-texto/`), `prompts/` y la carpeta `informe proyecto/` (con los nuevos entregables oficiales en PDF: `Informe Mira - LLM.pdf` y `MIRA-Analisis-de-Requisitos-Asistido-por-LLM .pdf`).

---

## 1. Mapa del Repositorio

A continuación se detalla cada elemento del repositorio (excluyendo `.git/` y los archivos metodológicos de `entregable2/`):

### Raíz del repositorio
- [`README.md`](../README.md): Pauta y rúbrica oficial de la evaluación ("Entregable 1: Articulación y análisis de requisitos asistido por LLM", ICI525, Universidad de Valparaíso).
- [`Resumen_Profundo_Proyecto_MIRA.md`](../Resumen_Profundo_Proyecto_MIRA.md): Documento de síntesis y preparación del equipo para la presentación oral, con análisis de vacíos, técnicas y reflexiones.
- [`Resumen_Requisitos_con_Agentes_IA.md`](../Resumen_Requisitos_con_Agentes_IA.md): Apunte conceptual del curso sobre vibe coding, las 5 técnicas de prompting y los 6 artefactos de requisitos.

### Carpeta `informe proyecto/` (Actualizada en commit `5c34d14`)
- [`informe proyecto/Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf): Informe escrito final de 23 páginas en PDF (reemplaza al anterior `.docx`). Contiene Resumen Ejecutivo, Introducción, Dominio, Casos de Uso, Requisitos (36 RQF-B + 13 RQNF-B), Pruebas Funcionales (40 PF), Pruebas Extra-funcionales (12 PX), enlace al Backlog en GitHub Projects, SSD, Técnicas de Prompting, 16 Inconsistencias, Discusión completa, Conclusiones y Anexo con plantilla DEC-00.
- [`informe proyecto/MIRA-Analisis-de-Requisitos-Asistido-por-LLM .pdf`](../informe%20proyecto/MIRA-Analisis-de-Requisitos-Asistido-por-LLM%20.pdf): Presentación oral de 21 diapositivas en PDF exportada desde PowerPoint (autor: Rodrigo Guerrero), con esquemas visuales, capturas del Backlog en GitHub Projects y tablas resumen.

### Carpeta `prompts/`
- [`prompts/Rodrigo/Prompt - Introduccion y resumen ejecutivo.md`](../prompts/Rodrigo/Prompt%20-%20Introduccion%20y%20resumen%20ejecutivo.md): Prompt v2.0 para redactar y auditar Introducción y Resumen Ejecutivo.
- [`prompts/Rodrigo/prompt general- Analisis de requisitos.md`](../prompts/Rodrigo/prompt%20general-%20Analisis%20de%20requisitos.md): Prompt maestro v1.0 secuencial (Pasos 1 al 7) para generar los artefactos de análisis.

### Carpeta `fases-y-plan-de-trabajo/`
- [`fases-y-plan-de-trabajo/Plan_de_Trabajo_MIRA.md`](../fases-y-plan-de-trabajo/Plan_de_Trabajo_MIRA.md): Guía metodológica previa (Fases 0 a 9) que define técnicas de prompting y puntos de control humano (👤).
- [`fases-y-plan-de-trabajo/backlog-resumen-proms.md`](../fases-y-plan-de-trabajo/backlog-resumen-proms.md): Tabla comparativa de prompts e impacto para LLM-as-a-Judge y Plan-and-Solve.
- [`fases-y-plan-de-trabajo/promps_usados.md`](../fases-y-plan-de-trabajo/promps_usados.md): Resumen de las técnicas utilizadas y justificación del descarte del resumen directo.

#### Subcarpeta `fases-y-plan-de-trabajo/estructura-texto/`
- **38 archivos JSON** (`1.1.json` a `1.6.json`, `2.1.json` a `2.18.json`, `3.0.json`, `4.0.json`, `5.1.json` a `5.3.json`, y `ENT1.json` a `ENT9.json`): Base de datos estructurada con las 415 afirmaciones clasificadas del documento y entrevistas.

#### Subcarpeta `fases-y-plan-de-trabajo/fase0/`
- [`fases-y-plan-de-trabajo/fase0/fase 0 plan de lectura entrega 1.md`](../fases-y-plan-de-trabajo/fase0/fase%200%20plan%20de%20lectura%20entrega%201.md): Registro de pasadas de lectura estructural y clasificación inicial.
- [`fases-y-plan-de-trabajo/fase0/plan_lectura.json`](../fases-y-plan-de-trabajo/fase0/plan_lectura.json): Plan de lectura priorizado en 10 grupos ordenados por riesgo de contradicción.

#### Subcarpeta `fases-y-plan-de-trabajo/fase1/`
- [`fases-y-plan-de-trabajo/fase1/Fase 1 — Inventario estructurado del documento y las entrevistas.md`](../fases-y-plan-de-trabajo/fase1/Fase%201%20%E2%80%94%20Inventario%20estructurado%20del%20documento%20y%20las%20entrevistas.md): Evolución del prompt (v1 a v4) y plantilla de extracción JSON.
- [`fases-y-plan-de-trabajo/fase1/checklist.md`](../fases-y-plan-de-trabajo/fase1/checklist.md): Control de avance sobre secciones del documento y entrevistas ENT1 a ENT9.

#### Subcarpeta `fases-y-plan-de-trabajo/fase2/`
- [`fases-y-plan-de-trabajo/fase2/Fase 2 — Detección de inconsistencias (§5.5).md`](../fases-y-plan-de-trabajo/fase2/Fase%202%20%E2%80%94%20Detecci%C3%B3n%20de%20inconsistencias%20%28%C2%A75.5%29.md): Definición metodológica de opciones A (Grounded) y B (aislamiento CoVe).
- [`fases-y-plan-de-trabajo/fase2/docs-promp-fase2.md`](../fases-y-plan-de-trabajo/fase2/docs-promp-fase2.md): Prompts de comparación, consolidación, justificaciones de fallos y matriz de 10 grupos.
- [`fases-y-plan-de-trabajo/fase2/consolidacion-contradicciones.json`](../fases-y-plan-de-trabajo/fase2/consolidacion-contradicciones.json): 16 inconsistencias en formato JSON (H-01 a H-16) con campos de validación del equipo.
- [`fases-y-plan-de-trabajo/fase2/consolidacion-contradicciones.md`](../fases-y-plan-de-trabajo/fase2/consolidacion-contradicciones.md): Tabla Markdown de 15 inconsistencias en bruto (H-01 a H-15).
- [`fases-y-plan-de-trabajo/fase2/inconsistencias-revisadas.md`](../fases-y-plan-de-trabajo/fase2/inconsistencias-revisadas.md): Tabla consolidada con 16 inconsistencias (HC-001 a HC-016), resolución y decisiones.
- [`fases-y-plan-de-trabajo/fase2/Revisar inconsitencias .xlsx`](../fases-y-plan-de-trabajo/fase2/Revisar%20inconsitencias%20.xlsx): Planilla Excel de trabajo intermedio.

#### Subcarpeta `fases-y-plan-de-trabajo/fase3/`
- [`fases-y-plan-de-trabajo/fase3/docs-promp-fase3.md`](../fases-y-plan-de-trabajo/fase3/docs-promp-fase3.md): Prompts de extracción por lotes, consolidación, barrera de formato y evolución v1 a v4.
- [`fases-y-plan-de-trabajo/fase3/borrador_modelo-dominio/`](../fases-y-plan-de-trabajo/fase3/borrador_modelo-dominio/): 4 archivos JSON con los borradores intermedios de los lotes 1 a 4.
- [`fases-y-plan-de-trabajo/fase3/modelo_dominio.json`](../fases-y-plan-de-trabajo/fase3/modelo_dominio.json): Modelo de dominio conceptual final con 26 entidades, 26 relaciones, glosario y 3 fusiones dudosas.

#### Subcarpeta `fases-y-plan-de-trabajo/fase4/`
- [`fases-y-plan-de-trabajo/fase4/Fase 4 — Casos de uso (§5.3.2).md`](../fases-y-plan-de-trabajo/fase4/Fase%204%20%E2%80%94%20Casos%20de%20uso%20%28%C2%A75.3.2%29.md): Artefacto completo con los 11 casos de uso (3 diagramas PlantUML, 8 breves y especificación extendida de UC-01, UC-02 y UC-03).
- [`fases-y-plan-de-trabajo/fase4/docs-prompt-fase4.md`](../fases-y-plan-de-trabajo/fase4/docs-prompt-fase4.md): Registro de la técnica Plan-and-Solve (selección) + Grounded Prompting (redacción) y antes/después.
- `fases-y-plan-de-trabajo/fase4/casos-de-us0-Lester/`: Archivos de trabajo de Lester con JSON de los 3 casos críticos, preguntas abiertas (`pregutas_casos_de_uso_criticos.md`), consolidados y particiones de prueba.

#### Subcarpeta `fases-y-plan-de-trabajo/fase5/`
- [`fases-y-plan-de-trabajo/fase5/# Fase 5 — Requisitos funcionales y no funcionales.md`](../fases-y-plan-de-trabajo/fase5/%23%20Fase%205%20%E2%80%94%20Requisitos%20funcionales%20y%20no%20funcionales.md): Registro metodológico de generación estructurada y auditoría con LLM-as-a-Judge (rúbrica de 6 partes).
- [`fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md): Tabla consolidada de 75 requisitos (58 RQF + 17 RQNF) con MoSCoW, fuentes y verificación.
- [`fases-y-plan-de-trabajo/fase5/RQF-RQNF_promp.md`](../fases-y-plan-de-trabajo/fase5/RQF-RQNF_promp.md): Registro de prompts para la extracción y juicio de requisitos.
- [`fases-y-plan-de-trabajo/fase5/Listado_RQF-RQNF(Con Deepseek).xlsx`](../fases-y-plan-de-trabajo/fase5/Listado_RQF-RQNF%28Con%20Deepseek%29.xlsx): Planilla Excel con extracción paralela usando Deepseek.
- `fases-y-plan-de-trabajo/fase5/fase5-lester/`: Documentación paralela con `requisitos_formato_final.md` (53 RQF + 4 RQNF) y `requisitos_combinados.json` (57 ítems).

#### Subcarpeta `fases-y-plan-de-trabajo/fase6/`
- [`fases-y-plan-de-trabajo/fase6/Fase 6 — Set de pruebas funcionales y extra-funcionales (§5.3.4, §5.3.5).md`](../fases-y-plan-de-trabajo/fase6/Fase%206%20%E2%80%94%20Set%20de%20pruebas%20funcionales%20y%20extra-funcionales%20%28%C2%A75.3.4,%20%C2%A75.3.5%29.md): Resumen de diseño, exclusiones justificadas (RQF-013, app móvil) y fuentes.
- [`fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md): Set de pruebas funcionales (39 casos en tabla, identificadores entre PF-001 y PF-045).
- [`fases-y-plan-de-trabajo/fase6/pruebas-extra-funcionales.md`](../fases-y-plan-de-trabajo/fase6/pruebas-extra-funcionales.md): Set de 11 pruebas extra-funcionales (PX-001 a PX-011).

#### Subcarpeta `fases-y-plan-de-trabajo/fase8/`
- [`fases-y-plan-de-trabajo/fase8/Fase 8 — Diagrama de secuencia de sistema (§5.3.7).md`](../fases-y-plan-de-trabajo/fase8/Fase%208%20%E2%80%94%20Diagrama%20de%20secuencia%20de%20sistema%20%28%C2%A75.3.7%29.md): Especificación del SSD en Mermaid para CU-02 (Flujo B), justificación y checklist de consistencia.
- [`fases-y-plan-de-trabajo/fase8/docs-prompt-fase8.md`](../fases-y-plan-de-trabajo/fase8/docs-prompt-fase8.md): Registro de Grounded Prompting anclado a CU-02 y análisis del bug del "Paso 6".
- [`fases-y-plan-de-trabajo/fase8/sdd.png`](../fases-y-plan-de-trabajo/fase8/sdd.png): Imagen renderizada del diagrama de secuencia del sistema.

### Matriz de Producción por Fase
| Fase | Artefacto de trabajo en fases | Artefacto en informe final (`Informe Mira - LLM.pdf`) |
|---|---|---|
| **Fase 0** | [`plan_lectura.json`](../fases-y-plan-de-trabajo/fase0/plan_lectura.json) | Metodología de lectura reflejada en introducción (§2). |
| **Fase 1** | 38 JSON en [`estructura-texto/`](../fases-y-plan-de-trabajo/estructura-texto/) | Insumo base de citas en todo el informe. |
| **Fase 2** | [`inconsistencias-revisadas.md`](../fases-y-plan-de-trabajo/fase2/inconsistencias-revisadas.md) | Sección 4: 16 Inconsistencias (H-01 a H-16, págs. 19-21). |
| **Fase 3** | [`modelo_dominio.json`](../fases-y-plan-de-trabajo/fase3/modelo_dominio.json) | Sección 3.1: Diagrama de Clases y Glosario (págs. 5-6). |
| **Fase 4** | [`Fase 4 — Casos de uso (§5.3.2).md`](../fases-y-plan-de-trabajo/fase4/Fase%204%20%E2%80%94%20Casos%20de%20uso%20%28%C2%A75.3.2%29.md) | Sección 3.2: 11 CU y detalle de UC-01, 02 y 03 (págs. 6-8). |
| **Fase 5** | [`requisitos...final-final.md`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md) (75 reqs) | Sección 3.3: 49 requisitos (`RQF-B01..B36`, `RQNF-B01..B13`, págs. 9-12). |
| **Fase 6** | [`pruebas-funcionales.md`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md), [`pruebas-extra-funcionales.md`](../fases-y-plan-de-trabajo/fase6/pruebas-extra-funcionales.md) | Sección 3.4 (40 PF) y 3.5 (12 PX, págs. 13-15). |
| **Fase 7** | *No generado en carpetas locales* | Sección 3.6: Enlace a GitHub Projects + Capturas en Slides 12-13. |
| **Fase 8** | [`Fase 8 — Diagrama de secuencia...md`](../fases-y-plan-de-trabajo/fase8/Fase%208%20%E2%80%94%20Diagrama%20de%20secuencia%20de%20sistema%20%28%C2%A75.3.7%29.md) | Sección 3.7: Diagrama SSD de CU-02 Flujo B (pág. 16). |

---

## 2. Resumen por Fase

| Fase | Objetivo | Técnica de prompting | Artefacto producido | Decisiones humanas tomadas (👤) | Estado en entrega final |
|---|---|---|---|---|---|
| **Fase 0** | Planificar orden de lectura según riesgo de contradicción. | **Plan-and-Solve Prompting** | [`plan_lectura.json`](../fases-y-plan-de-trabajo/fase0/plan_lectura.json) | Aprobación de 10 grupos de lectura invirtiendo el orden secuencial para priorizar secciones críticas. | **Completo** |
| **Fase 1** | Extraer afirmaciones del texto y 9 entrevistas en esquema citable. | **Grounded + Structured Output** (v1 a v4) | 38 archivos JSON en [`estructura-texto/`](../fases-y-plan-de-trabajo/estructura-texto/) | Clasificación estricta (opinión, regla, solución, necesidad); verificación de citas literales. | **Completo** |
| **Fase 2** | Detectar y resolver contradicciones, ambigüedades y vacíos. | **Grounded Prompting** + **Structured Output** | [`inconsistencias-revisadas.md`](../fases-y-plan-de-trabajo/fase2/inconsistencias-revisadas.md) | Resolución 100% humana de las 16 inconsistencias (adopción umbral 90, retención 5-10 años, etc.). | **Completo** |
| **Fase 3** | Modelar clases conceptuales y vocabulario sin elementos técnicos. | **Grounded Prompting** (por lotes y consolidación) | [`modelo_dominio.json`](../fases-y-plan-de-trabajo/fase3/modelo_dominio.json) | Respeto a cardinalidades sucias con excepción; aislamiento de 3 fusiones dudosas. | **Completo** |
| **Fase 4** | Seleccionar y detallar los 3 casos de uso críticos por riesgo. | **Plan-and-Solve** + **Grounded Prompting** | [`Fase 4 — Casos de uso (§5.3.2).md`](../fases-y-plan-de-trabajo/fase4/Fase%204%20%E2%80%94%20Casos%20de%20uso%20%28%C2%A75.3.2%29.md) | Selección de UC-01, UC-02 y UC-03; descarte de "Diseñar flujo" del detalle; adopción de Flujo B para piloto. | **Completo** |
| **Fase 5** | Especificar requisitos medibles priorizados con MoSCoW. | **Structured Output** + **LLM-as-a-Judge** (rúbrica 6 partes) | 49 requisitos en [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) (y 75 en `final-final.md`) | Ajuste manual de MoSCoW; etiquetado de requisitos no verificables (`[NO CUMPLE]`). | **Completo** (con divergencia de IDs entre archivos) |
| **Fase 6** | Diseñar pruebas funcionales (Must) y de calidad (PX). | **Plan-and-Solve** + **Structured Output** + **Grounded** | 40 PF y 12 PX en [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) | Exclusión deliberada de RQF-013 (tiempo restante); exclusión de componente móvil; adición de PX012 (logging). | **Completo** |
| **Fase 7** | Gestionar backlog con historias, criterios y DoD. | *Gestión en herramienta externa* | Tablero en GitHub Projects y capturas en Slides 12-13. | Priorización de historias en GitHub Projects por valor de negocio y riesgo técnico. | **Completo en plataforma externa** (no en MD local) |
| **Fase 8** | Diagramar interacción caja negra del caso más crítico. | **Grounded Prompting** anclado a CU-02 | [`Fase 8 — Diagrama de secuencia...md`](../fases-y-plan-de-trabajo/fase8/Fase%208%20%E2%80%94%20Diagrama%20de%20secuencia%20de%20sistema%20%28%C2%A75.3.7%29.md), [`sdd.png`](../fases-y-plan-de-trabajo/fase8/sdd.png) | Modelado de caja negra para Flujo B; detección del "Paso 6" inventado tras revisión independiente. | **Completo** |

---

## 3. Contenido de los Artefactos Principales, con Cifras

### 3.1 Inventario de afirmaciones
- **Cantidad total:** **415 afirmaciones estructuradas**, distribuidas en 38 archivos JSON en [`fases-y-plan-de-trabajo/estructura-texto/`](../fases-y-plan-de-trabajo/estructura-texto/).
  - **252 afirmaciones** provienen de las 29 secciones del cuerpo del documento (`1.1.json` a `5.3.json`).
  - **163 afirmaciones** provienen de las 9 entrevistas transcritas (`ENT1.json` a `ENT9.json`).
- **Distribución por tipo de afirmación:**
  - `necesidad`: **175** (42,2 %)
  - `regla_de_negocio`: **110** (26,5 %)
  - `solucion_decidida`: **67** (16,1 %)
  - `opinion`: **63** (15,2 %)
- **Formato:** Cada entrada incluye `texto`, `cita_textual` (máx. 20 palabras literales), `fuente` (`Sección x.y` o `ENTn [mm:ss]`), `tipo` y `seccion_o_entrevista`.

### 3.2 Inconsistencias detectadas
- **Total consolidado:** **16 inconsistencias** numeradas **H-01 a H-16** en la sección 4 de [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) (págs. 19-21) y como **HC-001 a HC-016** en [`inconsistencias-revisadas.md`](../fases-y-plan-de-trabajo/fase2/inconsistencias-revisadas.md).
- **Estado de resolución:**
  - **Resueltas:** **12 hallazgos** (H-01, H-02, H-03, H-04, H-06, H-07, H-08, H-09, H-12, H-13, H-14, H-15).
  - **Abiertas / Pendientes:** **3 hallazgos** (H-05: señales con mínimo propio; H-10: conflicto de fecha enero vs abril; H-16: desborde de tramos tarifarios).
  - **Parcialmente resuelta:** **1 hallazgo** (H-11: estructura de SLA por tramos resuelta, pero valores numéricos abiertos por falta de pruebas de carga).

### 3.3 Bitácora de decisiones (DEC-xx)
> **Hallazgo persistente:** En todo el proyecto **NO EXISTE una bitácora poblada con identificadores formales `DEC-01`, `DEC-02`, etc.** En [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) (pág. 23, Sección 6 Anexos), únicamente se encuentra la plantilla vacía `DEC - 00` (`Fecha: xx-xx-xxxx`). Las decisiones humanas reales están consignadas en la columna "Decisión" de la tabla de inconsistencias:
1. **H-01:** Umbral de aprobación fijado en 90 puntos parametrizable — *Decidido por Francisca Leiva (cliente piloto / ENT4)*.
2. **H-02:** Retención fijada en 5 a 10 años (90 días activo, luego archivo frío) — *Decidido por Daniela Cortés (Cumplimiento / ENT6)*.
3. **H-03:** Rate limit con rechazo `Retry-After` para tráfico estándar y modo bulk para carga masiva — *Decidido por equipo técnico y Hugo Marambio (ENT7)*.
4. **H-04:** Cobro restringido solo a decisiones automáticas; derivadas no se facturan — *Decidido por Valentina Ruiz-Tagle (Finanzas / ENT8)*.
5. **H-05:** Mínimos por señal individual — *Decisión ABIERTA (Pendiente de reunión de trabajo con riesgo del cliente piloto)*.
6. **H-06:** Autenticación vía SSO corporativo declarada obligatoria — *Decidido por Hugo Marambio (Arquitectura / ENT7)*.
7. **H-07:** Escritura en sistema de siniestros automatizada vía archivos — *Decidido por equipo técnico y Hugo Marambio (ENT7)*.
8. **H-08:** Eliminación definitiva de rechazo automático bajo 60 puntos — *Decidido por Daniela Cortés (Cumplimiento / ENT6)*.
9. **H-09:** Cobro de 1 validación por siniestro, salvo evidencia nueva sustantiva — *Decidido por Valentina Ruiz-Tagle (ENT8)*.
10. **H-10:** Reconciliación de plazo comercial (enero 2027) vs producción (abril 2027) — *Decisión ABIERTA (Requiere aclaración con Rodrigo Vergara / ENT1)*.
11. **H-11:** SLA desagregado por tramos según tipo/tamaño — *Decidido por Sebastián Alarcón (Modelos / ENT3); valores exactos abiertos*.
12. **H-12:** Rastro de decisión inalterable disociado de evidencia personal anonimizable — *Decidido por Daniela Cortés (Cumplimiento / ENT6)*.
13. **H-13:** Soporte dual de integración (archivos para cliente piloto, API para resto) — *Decidido por equipo técnico*.
14. **H-14:** Reconstrucción de decisiones como trazabilidad de inputs/versiones/parámetros — *Decidido por Sebastián Alarcón (ENT3)*.
15. **H-15:** Plazo de 2 semanas para clientes estándar; +2-3 semanas para formulario propio — *Decidido por Camila Ordóñez (ENT2)*.
16. **H-16:** Creación de tramo tarifario (5.000–15.000) y tramo Enterprise superior — *Decisión ABIERTA (Pendiente entre Finanzas y Comercial)*.

### 3.4 Modelo de dominio
- **Entidades:** **26 entidades** en [`modelo_dominio.json`](../fases-y-plan-de-trabajo/fase3/modelo_dominio.json) (`Caso`, `Evidencia`, `Puntaje`, `Señal`, `Flujo`, `Bloque`, `Umbral`, `Operador`, `Decisión del Operador`, `Módulo de análisis`, `Dato`, `Punto de Acceso`, `Registro de auditoría`, `Cliente`, `Usuario`, `Panel`, `Bandeja`, `Plantilla de flujo`, `Validación`, `Notificación`, `Incidente`, `Servicio externo`, `Sistema de siniestros`, `Decisión`, `Plataforma`, `Asegurado`).
- **Relaciones:** **26 relaciones** con excepciones del negocio (ej. `Caso` – `Evidencia` 1 a N, pero reapertura vinculada si el caso está cerrado).
- **Glosario:** 8 conceptos en JSON y 15 términos adoptados en la tabla del informe final ([`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf), págs. 5-6).
- **Fusiones dudosas:** 3 registradas (`Decisión` vs. `Decisión del Operador`; `Flujo` vs. `Plantilla de flujo`; `Usuario` vs. `Operador`).

### 3.5 Casos de uso
- **Catálogo total:** **11 casos de uso** (PlantUML) en [`Fase 4...md`](../fases-y-plan-de-trabajo/fase4/Fase%204%20%E2%80%94%20Casos%20de%20uso%20%28%C2%A75.3.2%29.md) e [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) (págs. 6-7).
- **Los 3 críticos detallados en formato extendido:**
  1. **UC-01 — Evaluar caso automáticamente:** Motor central. *Justificación de riesgo:* Conflicto bajo 60 puntos (H-01/H-08) y umbrales 85 vs 80 puntos sin resolver; rehacerlo impacta todo el motor.
  2. **UC-02 — Integrar caso vía interfaz de programación:** Contrato de frontera. Flujo A (API REST) y Flujo B (Archivos compartidos, vigente para piloto). *Justificación:* Riesgo de H-13 (arquitectura de integración) y H-03 (rate limits).
  3. **UC-03 — Resolver caso en revisión asistida:** Pantalla del operador. *Justificación:* Riesgo de H-12 (sesgo de anclaje de puntaje vs. evidencia planteado por Marco Peñailillo en ENT5).

### 3.6 Requisitos funcionales y no funcionales
- **Cifras en el informe oficial ([`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf), págs. 9-12):**
  - **Total:** **49 requisitos**.
  - **Funcionales:** **36 RQF** (`RQF-B01` a `RQF-B36`).
  - **No funcionales:** **13 RQNF** (`RQNF-B01` a `RQNF-B13`).
- **Distribución MoSCoW en el informe final:**
  - **Must:** **39** (79,6 %)
  - **Should:** **8** (16,3 %)
  - **Could:** **2** (4,1 %) — `RQF-B35` (exportación de auditoría a CSV/JSON) y `RQF-B36` (modo oscuro de interfaz).
  - **Won't:** **0** (0,0 %).
- *(Divergencia con archivos Markdown de fase: en [`requisitos-funcionales-y-no-funcionales-final-final.md`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md) existen 75 requisitos con nomenclatura `RQF-001..064` y `RQNF-001..017`).*
- **Cumplimiento de las 6 partes del escenario:** 12 de los 13 RQNF en el PDF cumplen estrictamente con la estructura (Fuente, Estímulo, Artefacto, Entorno, Respuesta, Medida objetiva). Solo `RQNF-B07` (escalabilidad horizontal elástica) hereda la condición de no verificable por falta de métrica de concurrencia en la fuente.

### 3.7 Pruebas, Backlog y SSD
- **Pruebas funcionales (PF):**
  - En [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) (págs. 13-14), la tabla está poblada con **40 casos de prueba** (`PF-006` a `PF-045`).
  - En [`pruebas-funcionales.md`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md) local existen **39 casos** (numerados entre PF-001 y PF-042).
- **Pruebas extra-funcionales (PX):**
  - En [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) (pág. 15) hay **12 pruebas** (`PX001` a `PX012`), añadiendo `PX012: Seguridad — logging`.
  - En [`pruebas-extra-funcionales.md`](../fases-y-plan-de-trabajo/fase6/pruebas-extra-funcionales.md) local hay **11 pruebas** (`PX-001` a `PX-011`).
- **Backlog de producto:**
  - En [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) (pág. 15, sección 3.6), el backlog se formalizó mediante el enlace oficial a **GitHub Projects**:
    `https://github.com/users/elesteber/projects/2/views/1`.
  - En [`MIRA-Analisis-de-Requisitos-Asistido-por-LLM .pdf`](../informe%20proyecto/MIRA-Analisis-de-Requisitos-Asistido-por-LLM%20.pdf) (diapositivas 12 y 13), se presentan las capturas de pantalla de este tablero con sus historias, estimaciones y estados.
- **Diagrama de secuencia de sistema (SSD):**
  - Presente en pág. 16 de [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf), en Slide 14 y en [`Fase 8...md`](../fases-y-plan-de-trabajo/fase8/Fase%208%20%E2%80%94%20Diagrama%20de%20secuencia%20de%20sistema%20%28%C2%A75.3.7%29.md). Modela CU-02 (Flujo B, intercambio de archivos) tratando a MIRA como caja negra con 3 ramas condicionales.

---

## 4. Convenciones y Trazabilidad

### 4.1 Esquema de identificadores
- Fuentes: `§x.y` (documento MIRA), `ENTn [mm:ss]` (entrevistas).
- Reglas originales: `RN-xx`, `RNF-xx`.
- Inconsistencias: `H-xx` (en informe y JSON) / `HC-xxx` (en `inconsistencias-revisadas.md`).
- Casos de uso: `UC-xx` / `CU-xx` (UC-01 a UC-11).
- Requisitos en fases: `RQF-xxx`, `RQNF-xxx`.
- Requisitos en informe final: `RQF-Bxx` (01 a 36), `RQNF-Bxx` (01 a 13).
- Pruebas funcionales: `PF-xxx` (PF-006 a PF-045).
- Pruebas extra-funcionales: `PXxxx` / `PX-xxx` (PX001 a PX012).
- Decisiones: `DEC-xx` (plantilla DEC-00).

### 4.2 Enlaces rotos, incompletos o inconsistentes

| Enlace / Cruce | Diagnóstico | Evidencia y archivos en conflicto |
|---|---|---|
| **Requisito (PDF) ↔ Prueba (PDF)** | **Inconsistente en nomenclatura** | En [`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf) (págs. 9-12), los requisitos usan `RQF-Bxx`. Sin embargo, la tabla de pruebas funcionales (págs. 13-14) cita la numeración antigua `RQF-xxx` (ej. `PF-006` verifica `RQF-006`, no `RQF-B06`). |
| **Requisitos Markdown ↔ Requisitos PDF** | **Divergencia de volumen y numeración** | [`requisitos...final-final.md`](../fases-y-plan-de-trabajo/fase5/requisitos-funcionales-y-no-funcionales-final-final.md) tiene 75 requisitos (`RQF-002..064`). El PDF final tiene 49 requisitos (`RQF-B01..B36` y `RQNF-B01..B13`). |
| **Pruebas PF Markdown ↔ Pruebas PF PDF** | **Divergencia de rango** | [`pruebas-funcionales.md`](../fases-y-plan-de-trabajo/fase6/pruebas-funcionales.md) contiene 39 pruebas que inician en `PF-001`. El PDF contiene 40 pruebas pero inicia en `PF-006` (omitiendo PF-001 a PF-005). |
| **Inconsistencias ↔ Bitácora DEC-xx** | **Incompleto** | Las decisiones están redactadas en la columna "Decisión" de H-01 a H-16, pero nunca se trasladaron a fichas individuales con código `DEC-xx` en el Anexo. |
| **Backlog ↔ Repositorio Local** | **Desconectado** | Las historias de usuario viven en GitHub Projects (`users/elesteber/projects/2`) y en capturas de diapositivas, sin archivo de texto/JSON versionado dentro del repositorio Git local. |

---

## 5. Huecos y Riesgos

1. **Persistencia de 3 decisiones de negocio abiertas:**
   - **H-05:** Mínimos por señal individual sin definir con el cliente piloto.
   - **H-10:** Desfase entre la expectativa comercial de operar en enero de 2027 y la salida a producción en abril de 2027.
   - **H-16:** El volumen del cliente piloto (12k casos / 40k docs) sobrepasa los tramos de precios y el tramo superior no tiene tarifa fijada.
2. **Ambigüedad de SLA numérico (H-11):** Siguen sin comprometerse valores numéricos exactos de latencia para casos pesados hasta ejecutar pruebas de carga reales.
3. **Comportamiento ante sobrecarga en carpetas compartidas (H-03):** El mecanismo `Retry-After` es HTTP; no está definido cómo se rechaza o desacelera el depósito masivo de archivos en carpetas compartidas (Flujo B).
4. **Doble nomenclatura de requisitos:** La coexistencia de `RQF-xxx` (en Markdown y pruebas) y `RQF-Bxx` (en el informe final) representa un riesgo de desorientación para cualquier agente que intente trazar código contra especificaciones.
5. **Backlog externo no versionado en Git:** Si la herramienta GitHub Projects cambia o no está sincronizada, el repositorio local carece de la definición escrita de historias y criterios de aceptación.

---

## 6. Insumos Reutilizables para la Entrega 2

### 6.1 Artefactos utilizables como insumo
- **415 afirmaciones JSON (`estructura-texto/`):** Base de conocimiento y ground truth indiscutible para alimentar el contexto de agentes o bases vectoriales.
- **16 Inconsistencias con resolución (H-01 a H-16):** Matriz de supuestos, restricciones y directrices para redactar un Project Brief o Constitution.
- **Modelo de Dominio conceptual (`modelo_dominio.json`):** 26 entidades con atributos, relaciones y glosario, listo para alimentar esquemas de datos o modelos de arquitectura.
- **11 Casos de Uso y 3 Extendidos (UC-01, UC-02, UC-03):** Especificación funcional de alto detalle con flujos alternativos y de excepción para generar especificaciones técnicas.
- **Catálogo de Requisitos (49 en PDF / 75 en MD):** Especificaciones de comportamiento y atributos de calidad con criterios medibles.
- **40 Pruebas Funcionales y 12 Extra-funcionales (en PDF):** Suites de Acceptance Testing y casos de prueba automatizables (*Test-Driven / Spec-Driven*).
- **Diagrama de Secuencia de Sistema (SSD):** Contrato caja negra para la integración por archivos compartidos del cliente piloto.
- **Backlog en GitHub Projects:** Historias de usuario preliminares accesibles vía enlace y capturas en diapositivas.

### 6.2 Nivel de preparación para agentes de IA
- **Formato:** Excelente. Los insumos de `estructura-texto/` y `modelo_dominio.json` están en JSON puro estructurado, sin ruido visual.
- **Claridad de criterios de verificación:** Alta. Los casos PF y PX poseen precondiciones, pasos y resultados observables bien determinados.
- **Qué falta normalizar antes de partir:**
  1. Unificar la nomenclatura de requisitos (decidir si rige `RQF-xxx` o `RQF-Bxx`).
  2. Extraer o exportar las historias de usuario de GitHub Projects a un archivo estructurado versionado en Git (`backlog.json` o `backlog.md`).
  3. Formalizar las fichas `DEC-01` a `DEC-16` para estabilizar las referencias de decisiones tomadas.

---

## 7. Observaciones para Decidir: SDD (Spec Kit) vs. BMAD

*(Observaciones fundadas estrictamente en los hechos constatados en el repositorio, sin inclinación ni recomendación).*

### Aspectos del repositorio que favorecen SDD (Spec Kit)
1. **Especificaciones funcionales de alta densidad ya redactadas:** Existen flujos alternativos y excepciones exhaustivamente detalladas en UC-01, UC-02 y UC-03 ([`Fase 4...md`](../fases-y-plan-de-trabajo/fase4/Fase%204%20%E2%80%94%20Casos%20de%20uso%20%28%C2%A75.3.2%29.md)), lo que encaja directamente con la jerarquía formal de SDD (*Constitution → Specification → Plan → Tasks*).
2. **Contratos de integración estrictos y no convencionales:** La imposición de operar por intercambio asíncrono de archivos para el cliente piloto (Flujo B, H-13, SSD) requiere que el desarrollo esté fuertemente guiado por especificaciones rígidas para evitar que los modelos de generación de código asuman por defecto una API REST web estándar.
3. **Set de pruebas funcionales y de calidad exhaustivo:** Con 40 casos PF y 12 PX con umbrales medibles en el informe final, el enfoque *spec-driven / test-first* de SDD permite convertir cada caso de prueba en un criterio de aceptación verificable antes de codificar.
4. **Historial de alucinaciones prevenible por especificación lineal:** La experiencia documentada en el informe (el bug del "Paso 6" en el SSD) demostró que saltar a la generación sin un anclaje formal paso a paso produce referencias inventadas, riesgo que SDD controla mediante validación estricta de tareas contra especificaciones previas.

### Aspectos del repositorio que favorecen BMAD (Breakthrough Method for Agile AI-Driven Development)
1. **Tensión entre requerimientos de proceso y arquitectura:** Las 9 entrevistas reflejan tensiones directas entre áreas con intereses divergentes (Cumplimiento/Daniela vetando rechazos automáticos y exigiendo 10 años de retención; Finanzas/Valentina limitando cobros; Arquitectura/Hugo restringiendo protocolos; Modelos/Sebastián advirtiendo inviabilidad técnica). Aunque BMAD no incluye agentes de áreas de negocio del cliente (sus roles son de proceso de software: Mary/Analista en `bmad-agent-analyst`, John/PM en `bmad-agent-pm`, Winston/Arquitecto en `bmad-agent-architect`, Amelia/Desarrolladora en `bmad-agent-dev` y Sally/Diseñadora UX en `bmad-agent-ux-designer`, sin agentes como *Compliance Agent*, *Finance Agent* ni *QA Agent*), permite que John y Mary canalicen restricciones de negocio en el PRD (`bmad-prd`) mientras Winston formaliza los límites técnicos en `ARCHITECTURE-SPINE.md` (`bmad-architecture`). Para debatir o contrastar perspectivas de negocio personalizadas, BMAD ofrece la opción de `bmad-party-mode` (conversación multi-agente dirigida por el humano), aunque esto constituye una personalización y no un rol predefinido.
2. **Backlog gestionado externamente y decisiones abiertas:** Al estar el backlog en GitHub Projects y persistir decisiones no resueltas (H-05 mínimos por señal, H-10 fechas de salida, H-16 tarifas de volumen), BMAD aborda esta incertidumbre separando el desglose de historias (`bmad-create-epics-and-stories` con John/PM) del diseño arquitectónico (`bmad-architecture` con Winston/Arquitecto) y estableciendo una compuerta formal previa a la construcción mediante `bmad-sprint-planning`. Dicha compuerta evalúa si las historias están listas antes de codificar emitiendo un veredicto estructurado (*PASS*, *CONCERNS* o *FAIL*), lo que evita construir sobre ambigüedades no resueltas y permite activar `bmad-correct-course` ante cambios de alcance.
3. **Control de desalineaciones mediante compuertas y revisiones por etapas:** En la sección de Discusión del informe final ([`Informe Mira - LLM.pdf`](../informe%20proyecto/Informe%20Mira%20-%20LLM.pdf), pág. 21), el equipo reconoció que los artefactos no se actualizan solos al cambiar una decisión previa. BMAD no dispone de agentes supervisores permanentes ni de un *LLM-as-a-Judge continuo* que sincronice artefactos de forma autónoma en segundo plano; en cambio, mitiga este riesgo a través de manuales repetibles y compuertas de revisión explícitas: validación de requisitos en `bmad-prd`, compuerta *PASS/CONCERNS/FAIL* en `bmad-sprint-planning`, checkpoints humanos obligatorios en el diff durante `bmad-build`, revisión de código con `bmad-code-review`, ajuste formal de documentación con `bmad-correct-course` y evaluación en `bmad-retrospective`.

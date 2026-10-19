<!--
Sync Impact Report:
- Version change: Unratified template (0.0.0) → 1.0.0
- Adoption / Ratification: Ratificada por Lester Gonzalez el 2026-10-14; pendiente de lectura y aprobación del equipo en el PR.
- Principles defined: 11 principios operativos fundamentales formalizados y vinculados a decisiones DEC-01..16 y DEC-E2-01..10:
  - I. Prohibición Absoluta de Rechazo Automático (NO NEGOCIABLE) [DEC-08, DEC-E2-06, DEC-E2-10, ENT6]
  - II. Determinismo y Precedencia Estricta del Motor de Decisión (F4) [DEC-01, DEC-E2-06, DEC-E2-10, MIRA §3]
  - III. Gestión Dinámica, Versionamiento y Doble Control de Umbrales (F5) [DEC-E2-10, D-03, D-04, ENT6, MIRA §2.13]
  - IV. Inmutabilidad de Artefactos Heredados de la Entrega 1 [DEC-E2-01, §2.f]
  - V. Trazabilidad Canónica, Citación de Fuentes y Verificación Pre-Entrega [DEC-E2-02, DEC-E2-09, §2.a, §8.1]
  - VI. Flujo SDD Obligatorio, Spec Única y Aislamiento de Especificación [DEC-E2-10(c), §3.1]
  - VII. Stack Tecnológico, Contrato Compartido y Datos Sintéticos [DEC-E2-05, DEC-E2-10, §5.2]
  - VIII. Matriz Exhaustiva de Pruebas y Reproducibilidad Determinista [DEC-14, H-14, RQNF-002, §2.d]
  - IX. Convención Canónica de Commits y Trazabilidad por Tarea [§7.2]
  - X. Registro Obligatorio de Intervención Humana y Medición de Retrabajo [§7.7, DEC-E2-08]
  - XI. Política de Ramas, Protección de Main y Flujo de Integración [§2.f, §5.3]
- Added sections: Restricciones Adicionales y Salvaguardas de Calidad, Flujo de Desarrollo y Compuertas de Calidad, Governance
- Removed sections: Marcadores de posición de plantilla no utilizados
- Follow-up TODOs / Puntos [POR CONFIRMAR]: Término "arquitectura liviana Express" en Principio VII (DEC-E2-05 define "Node.js (v20+ LTS) con TypeScript y Express / Fastify"); frase textual "commit acotado a menos de 2 horas" en Principio IX (§3.1 y §4.1 respaldan "Tareas atómicas de <2 horas").
-->

# Constitución del Proyecto MIRA (Entrega 2)

La presente Constitución establece los principios rectores, invariantes de negocio, restricciones de arquitectura y normas de gobernanza que rigen de forma obligatoria el desarrollo de la Entrega 2 de MIRA (Plataforma de Inteligencia Multimodal para Decisiones Empresariales, DPRIME SpA), en el marco del Taller de Desarrollo de Software Conducido por Agentes de IA (Universidad de Valparaíso).

---

## Core Principles

### I. Prohibición Absoluta de Rechazo Automático (NO NEGOCIABLE)
- **Principio Fundamental:** *"El sistema nunca rechaza automáticamente un caso; el máximo efecto es derivarlo, con advertencia de riesgo alto cuando corresponda"* (Citas: `DEC-08`, `DEC-E2-06`, `DEC-E2-10(b)`; Daniela Cortés en ENT6 [00:04:06]).
- **Lenguaje Prohibido en UI y Código:** La UI y el código no presentan como decisión del sistema un "rechazado" o "rechazo automático" (`DEC-E2-10(b)`, §3.1). Se permite el campo `riesgoAltoRechazo` y el texto de advertencia *"Riesgo alto de rechazo: decide un operador"*, que son solo informativos.
- **Estados de Salida Permitidos:** La respuesta del motor de evaluación contempla única y estrictamente dos estados resolutivos (`decision`):
  1. `APROBADO_AUTOMATICO`: El caso cumple holgadamente todos los criterios y aprueba sin intervención humana.
  2. `DERIVADO_REVISION`: El caso requiere revisión humana obligatoria asistida por la bandeja del operador.
- **Motivos de Decisión:** Toda resolución emitida debe registrar explícitamente uno de los siguientes cuatro motivos técnicos (`motivo`): `'aprobado'`, `'alerta_fraude'`, `'senal_bajo_minimo'` o `'puntaje_bajo_umbral'`.
- **Advertencia Informativa de Riesgo Alto:** El atributo booleano `riesgoAltoRechazo: boolean` es estrictamente una señal informativa para alertar visualmente al operador humano en la interfaz (*"Riesgo alto de rechazo: decide un operador"*). Se evalúa con posterioridad a las reglas de negocio y **bajo ninguna circunstancia altera el resultado** de la decisión (`decision` se mantiene como `DERIVADO_REVISION`). Se activa (`true`) si se cumple al menos una de dos condiciones:
  1. Existen al menos dos señales individuales bajo su respectivo mínimo propio (`conteo(señales bajo mínimo) >= 2`), O
  2. El puntaje global es estrictamente menor que `umbralRiesgoAlto` (valor por defecto 60, configurable y versionado desde F5).
- *Alternativas Descartadas:* Se descartan formalmente el rechazo propuesto con confirmación en un clic (Alternativa B, descartada por sesgo de anclaje y falta de intervención significativa; ENT5 [00:15:16], ENT6 [00:01:21]) y el rechazo automático configurable (Alternativa C, descartada por mandato normativo indelegable; ENT6 [00:04:06]).

### II. Orden de Evaluación Fijo y Precedencia Estricta del Motor de Decisión (F4)
- **Precedencia de Evaluación:** El motor determinista de F4 ejecuta la lógica de evaluación en un orden secuencial fijo e inalterable (§3.1, §5.2):
  1. **Precedencia de Fraude:** Si `alertaFraudeActiva === true`, el sistema resuelve de inmediato `decision: 'DERIVADO_REVISION'` con `motivo: 'alerta_fraude'`, con máxima precedencia e ignorando cualquier puntaje obtenido (Citas: MIRA §3, `DEC-E2-06`, `PF-018`).
  2. **Precedencia de Señal Bajo Mínimo:** Si al menos una señal individual no alcanza su umbral mínimo propio, el sistema resuelve `decision: 'DERIVADO_REVISION'` con `motivo: 'senal_bajo_minimo'`, con precedencia sobre el puntaje global ponderado (Citas: MIRA §2.6, `H-05`, `D-07`, `DEC-E2-10(a)`).
  3. **Aprobación Automática:** Si el puntaje global iguala o supera el umbral de aprobación (`scoreGlobal >= umbralAprobacion`, fijado en 90 por defecto como política conservadora del equipo) y no existen alertas de fraude ni señales bajo mínimo, el sistema resuelve `decision: 'APROBADO_AUTOMATICO'` con `motivo: 'aprobado'` (Citas: `H-01`, `DEC-01`, ENT4 [00:11:06], `PF-020`).
  4. **Derivación por Puntaje Bajo Umbral:** En cualquier otro caso (puntaje global inferior al umbral de aprobación sin alerta de fraude ni caídas bajo mínimos individuales), el sistema resuelve `decision: 'DERIVADO_REVISION'` con `motivo: 'puntaje_bajo_umbral'`.
- **Jerarquía Estricta de Motivos:** Ante la presencia concurrente de múltiples causas, rige la jerarquía de precedencia: `alerta_fraude` > `senal_bajo_minimo` > `puntaje_bajo_umbral` (o `aprobado` si aprueba automáticamente).

### III. Gestión Dinámica, Versionamiento y Doble Control de Umbrales (F5)
- **Configurabilidad Integral:** Todos los parámetros de cálculo son dinámicamente configurables en F5: umbral de aprobación (`umbralAprobacion`), umbral de riesgo alto (`umbralRiesgoAlto`), mínimos individuales por señal (`minimoAutenticidad`, `minimoCruceFuentes`, `minimoCoherencia`) y ponderaciones continuas (`pesoAutenticidad`, `pesoCruceFuentes`, `pesoCoherencia`) (Citas: `DEC-E2-10(a)`, `D-07`, `D-08`, `RQF-044 [final-final]` / `RQF-B09 [PDF pág. 9]`).
- **Protocolo de Doble Control (Separación de Roles):** Modificar umbrales, mínimos o ponderaciones requiere un flujo estricto de doble aprobación:
  1. Un usuario con rol *Diseñador* propone la modificación (el registro queda en estado `BORRADOR`).
  2. Un usuario distinto con rol *Administrador* revisa y aprueba formalmente el cambio (pasa a estado `APROBADO` y entra en vigencia operativa).
  3. **Regla de Incompatibilidad:** Quien propone el cambio jamás puede aprobarlo (Citas: ENT6 [00:21:16], MIRA §2.13, `PF-033`, `DEC-E2-10(d)`, `D-04`).
- **Versionamiento Inmutable:** Cada aprobación genera una nueva versión inmutable con identificador autonumérico ascendente (`version`), fecha/hora ISO y rastro de auditoría con los identificadores de quien propuso y quien autorizó (Citas: `RQNF-002 [fase5-lester]`, `DEC-14`, `D-03`). Queda prohibida la sobrescritura directa (`UPDATE`) sobre versiones vigentes o pasadas.
- **Reglas de Validación Estrictas:**
  1. La suma de los tres pesos debe ser exactamente igual a 1,0 (`suma de pesos = 1,0`), con cada peso acotado entre 0,00 y 1,00.
  2. Todos los umbrales de corte y mínimos individuales deben ser valores numéricos enteros o decimales acotados entre 0 y 100 (`0 <= x <= 100`).

### IV. Inmutabilidad de Artefactos Heredados de la Entrega 1
- **Solo Lectura Histórica:** Todos los artefactos generados en la Entrega 1 y archivados en el directorio `fases-y-plan-de-trabajo/` son considerados patrimonio documental de solo lectura histórica (`DEC-E2-01`, §0.1, §2.f).
- **Prohibición de Edición Directa:** Ni el agente de IA ni los desarrolladores humanos modificarán directamente los archivos de `fases-y-plan-de-trabajo/`.
- **Formalización de Refinamientos:** Cualquier cambio, clarificación, refinamiento o resolución de inconsistencias heredadas se formaliza mediante una nueva ficha de decisión documentada (`DEC-xx` o `DEC-E2-xx`) en `entregable2/guia-implementacion-sdd.md` (sección 1), que es el único repositorio de fichas DEC del proyecto. *(Corrección 2026-10-19: se eliminó la referencia a una carpeta `docs/entregable2/decisiones/` que nunca llegó a crearse; las 16 fichas `DEC-01` a `DEC-16` y las 10 `DEC-E2-01` a `DEC-E2-10` viven únicamente en la guía.)*

### V. Trazabilidad Canónica, Citación de Fuentes y Verificación Pre-Entrega
- **Convención Canónica de Identificadores:** Ante la colisión de IDs detectada entre los archivos de la Fase 5, rige como convención rectora la numeración de `fase5/fase5-lester/requisitos_formato_final.md` respaldada por la suite de pruebas funcionales de `fase6/pruebas-funcionales.md` (`DEC-E2-02`, §2.a).
- **Exigencia Formal de Citación:** Todo requisito mencionado en especificaciones (`spec.md`), planes (`plan.md`), tareas (`tasks.md`), matriz de trazabilidad, código fuente, comentarios de tests o informe final debe citarse obligatoriamente acompañado de su archivo fuente (ejemplo: `RQF-040 [fase5-lester]`, `RQF-028 [final-final]`). La referencia cruzada `RQF-Bxx [PDF pág. X]` se cita cuando exista equivalente; si no existe, se escribe "sin equivalente en PDF" (ej. `RQF-039`). Prohibido inventar un `RQF-Bxx` (`DEC-E2-02`, §7.4, §8.1).
- **Tolerancia Cero a Citas Inexistentes:** Toda afirmación o cita no respaldada fehacientemente en la documentación heredada o en las fuentes verificadas debe marcarse explícitamente como `[POR VERIFICAR]` o `[POR CONFIRMAR]`. Inventar una cita documental o ID constituye un defecto grave con penalización directa de −1,0 punto (`DEC-E2-09`, §8.1).
- **Script de Verificación Pre-Entrega:** Es requisito obligatorio de la Definición de Terminado (§8.2 / `DEC-E2-09`) ejecutar antes de la entrega final un script automatizado que valide en el árbol git la existencia física de cada ID, cita y hash referenciado.

### VI. Flujo SDD Obligatorio, Spec Única y Aislamiento de Especificación
- **Secuencia Estricta de Fases:** El avance del proyecto se rige por el ciclo secuencial estricto de Spec-Driven Development:
  1. `/speckit-constitution` → Gobernanza y principios no negociables.
  2. `/speckit-specify` → Especificación técnica formal en lenguaje natural.
  3. `/speckit-clarify` → Resolución estructurada de ambigüedades con el cliente.
  4. `/speckit-plan` → Arquitectura, diseño técnico y contratos de datos.
  5. `/speckit-tasks` → Desglose ordenado de tareas atómicas.
  6. `/speckit-analyze` → Auditoría de consistencia y completitud cruzada.
  7. `/speckit-implement` → Implementación guiada por pruebas y tareas.
- **Prohibición de Código Prematuro:** El archivo `src/shared/types.ts` es un contrato derivado del plan y se commitea con prefijo `[PLAN]`; lo prohibido antes de plan (`plan.md`), tasks (`tasks.md`) y analyze (`speckit-analyze`) es la lógica de producción (motor, endpoints, UI) (§3.1).
- **Especificación Única Consolidada:** Se redacta una sola especificación consolidada (`spec.md`) para el incremento conjunto F5 + F4, estructurando las tareas de desarrollo en `tasks.md` con etiquetas explícitas `[F5]` y `[F4]` para mantener trazabilidad y control de avance (`DEC-E2-10(c)`, `D-09`).
- **Aislamiento Tecnológico de la Spec:** La especificación técnica (`spec.md`) describe exclusivamente reglas de negocio, requerimientos funcionales, contratos de dominio y criterios de aceptación (`AC-1` a `AC-6`), excluyendo terminantemente menciones a tecnologías, frameworks, bases de datos o librerías de implementación (§3.1).

### VII. Stack Tecnológico, Contrato Compartido y Datos Sintéticos
- **Stack Tecnológico Oficial:**
  - **Backend:** Node.js con TypeScript, arquitectura liviana Express [POR CONFIRMAR: en la guía DEC-E2-05 figura como "Node.js (v20+ LTS) con TypeScript y Express / Fastify"] (`DEC-E2-05`).
  - **Frontend:** React con Vite, componentes interactivos en español neutro profesional (`DEC-E2-05`).
  - **Persistencia:** Base de datos relacional SQLite autocontenida sin contenedores Docker pesados, permitiendo levantar el sistema en máquina limpia en menos de 15 minutos vía `npm install && npm run dev` (`DEC-E2-05`, `D-01`, C4).
  - **Testing:** Vitest + Supertest para pruebas unitarias e integración de backend; Playwright para pruebas E2E de navegador (`DEC-E2-05`, `D-06`).
- **Simulación Determinista del Motor:** Conforme a la pauta (§4.3) y a la decisión `D-02`, el motor multimodal de inteligencia artificial no se construye; se simula mediante carga determinista de casos desde `data/casos_prueba.json` respaldada en SQLite.
- **Uso Exclusivo de Datos Sintéticos:** Por seguridad y cumplimiento normativo, queda terminantemente prohibido el uso o almacenamiento de datos reales de siniestros o asegurados. Únicamente se permiten datos ficticios controlados en `data/` (`R-10`).
- **Contrato de Datos Unificado:** El archivo `src/shared/types.ts` (§5.2, `DEC-E2-10`) constituye la única interfaz canónica compartida entre frontend y backend (`UmbralesFlujo`, `SenalesCaso`, `ResultadoEvaluacion`).

### VIII. Matriz Exhaustiva de Pruebas y Reproducibilidad Determinista (RQNF-002)
- **Suite de Casos de Negocio en `data/casos_prueba.json`:** Se definen y verifican formalmente los 6 casos de prueba de reembolso médico que aíslan individualmente cada regla de negocio (§2.d):
  - `CASO-MED-001` (Aprobación Automática): Puntaje 94.0 ≥ 90, sin fraude ni señales bajo mínimo → `APROBADO_AUTOMATICO`, `motivo: 'aprobado'`, `riesgoAltoRechazo: false`.
  - `CASO-MED-002` (Derivación por Señal Bajo Mínimo): Coherencia = 55 (< 60), puntaje 91.0 ≥ 90 → `DERIVADO_REVISION`, `motivo: 'senal_bajo_minimo'`, `riesgoAltoRechazo: false` (`H-05`).
  - `CASO-MED-003` (Precedencia de Fraude): `alertaFraudeActiva = true`, puntaje 94.0 → `DERIVADO_REVISION`, `motivo: 'alerta_fraude'`, `riesgoAltoRechazo: false` (`DEC-E2-06`).
  - `CASO-MED-004` (Derivación con Advertencia de Riesgo Alto): Puntaje 44.0 (< 60) y dos señales bajo mínimo (autenticidad 40, cruce 40) → `DERIVADO_REVISION`, `motivo: 'senal_bajo_minimo'`, `riesgoAltoRechazo: true` (`DEC-08`, `DEC-E2-10`).
  - `CASO-MED-005` (Derivación por Rango Intermedio): Puntaje 75.0 (en rango 60-89), todas las señales cumplen mínimos → `DERIVADO_REVISION`, `motivo: 'puntaje_bajo_umbral'`, `riesgoAltoRechazo: false`.
  - `CASO-MED-006` (Riesgo Alto por Puntaje Crítico con 1 Señal Bajo Mínimo): Autenticidad = 0, cruce = 70, coherencia = 60, puntaje 40.0 (< 60) → `DERIVADO_REVISION`, `motivo: 'senal_bajo_minimo'`, `riesgoAltoRechazo: true`.
- **Prueba Unitaria de Condición Lógica Multiseñal:** Prueba directa complementaria en `tests/unit/engine.test.ts`: caso con autenticidad = 65 (< 70), cruce = 65 (< 70) y coherencia = 100 con puntaje global = 72.0 (≥ 60), verificando que activa `riesgoAltoRechazo = true` por la regla de "al menos dos señales bajo mínimo" aun cuando el puntaje global supere holgadamente el umbral de 60 (`DEC-E2-10(b)`, §2.d).
- **Prueba Extra-funcional Medible de Reproducibilidad:** Test automatizado en `tests/reproducibility/deterministic.test.ts` que reevalúa casos históricos contra su versión archivada de umbrales en SQLite, exigiendo un **100% de reproducibilidad determinista** (idéntico resultado e idéntico motivo) ante repetición de ejecuciones (Citas: `RQNF-002 [fase5-lester]` / `RQNF-003 [final-final]`, `DEC-14`, `H-14`, §6.1 Día 4, §8.1 C5).

### IX. Convención Canónica de Commits y Trazabilidad Atómica
- **Estructura Obligatoria de Commits:** Todo commit en el repositorio debe seguir la convención canónica (§7.2):
  `[PREFIJO] [ID]: Descripción concisa en modo imperativo`
- **Prefijos Autorizados:**
  - `[CONSTITUTION]`: Ratificación o enmiendas a este documento constitucional.
  - `[SPEC]`: Artefactos de especificación técnica y criterios de aceptación.
  - `[CLARIFY]`: Registro formal de clarificaciones con el cliente.
  - `[PLAN]`: Plan técnico, arquitectura y contratos TypeScript.
  - `[TASK-xx]`: Commits de implementación atómica trazables a `tasks.md`.
  - `[HUMAN-FIX]`: Correcciones manuales realizadas por integrantes humanos sobre artefactos o código del agente.
  - `[TEST]`: Suites de pruebas unitarias, de integración, E2E o de reproducibilidad.
  - `[DOC]`: Guías, bitácoras, matrices de trazabilidad e informes.
- **Aislamiento de Correcciones Humanas:** Queda terminantemente prohibido mezclar correcciones humanas con commits de generación del agente. Toda corrección manual debe aislarse en commits separados bajo el prefijo `[HUMAN-FIX]` para auditar el esfuerzo real de ingeniería (§7.2).
- **Atomicidad de Tareas:** Cada tarea de desarrollo debe corresponder a un commit acotado a menos de 2 horas [POR CONFIRMAR: en la guía §3.1 y §4.1 respaldado como "Tareas atómicas de <2 horas"; la frase textual "commit acotado a menos de 2 horas" no aparece en §7.2].

### X. Registro Obligatorio de Intervención Humana y Medición de Retrabajo
- **Bitácora de Intervenciones Humanas:** Cada intervención manual correctiva sobre código, especificaciones o planes generados por el agente de IA debe registrarse inmediatamente en `docs/entregable2/bitacora-intervenciones.md` detallando: qué cambió, motivo del cambio y evidencia verificable (commit hash, archivo modificado o prueba asociada) (`DEC-E2-08`, §7.7).
- **Indicadores Cuantitativos de Retrabajo:** La bitácora nutre el cálculo diario de las métricas exigidas para la sección 6.6 del informe final:
  1. **TPR (Tasa de Preservación de Requisitos Must):**
     `TPR = Must de F4/F5 sin cambio / Must de F4/F5 x 100`
  2. **TIH (Tasa de Intervención Humana en Código):**
     `TIH = Commits de corrección humana / Commits de tareas x 100`
  3. **IRF (Índice de Retrabajo por Fase):**
     `IRF = Artefactos de fase con corrección humana sustantiva / Artefactos de la fase`
- **Responsabilidad:** Angel Salgado es el custodio oficial del registro y llenado diario de las tablas comparativas (§7.7).

### XI. Política de Ramas, Protección de Main y Flujo de Integración
- **Protección de Main:** Queda prohibido commitear o pushear código directamente sobre la rama `main` (§2.f, §5.3, §8.2).
- **Ramas por Frente de Trabajo:** Todo desarrollo se realiza en ramas especializadas creadas a partir de `main` (ej. `feat/setup-speckit`, `feat/constitution`, `feat/spec-f5-f4`, `feat/backend-engine`, `feat/frontend-ui`).
- **Integración mediante Pull Requests (PRs):** La fusión hacia `main` se realiza exclusivamente mediante Pull Requests con revisión cruzada obligatoria (§5.3):
  - PRs de Backend (Rodrigo) → Revisan Jorge y Lester.
  - PRs de Frontend (Jorge) → Revisan Rodrigo y Lester.
  - PRs de Testing y QA (Lester) → Revisa Rodrigo.
  - PRs de Especificación y Documentación (Angel) → Revisan Rodrigo y Lester.
- **Etiquetado Oficial:** El cierre definitivo del proyecto se sella con el tag anotado `v2.0` sobre `main` previo a las 14:00 CLT del 19 de octubre de 2026 (§0.1, §6.1, §8.2).

---

## Restricciones Adicionales y Salvaguardas de Calidad

1. **Facilidad de Ejecución (Criterio C4):** El repositorio debe ser completamente ejecutable en máquina limpia en menos de 15 minutos siguiendo las instrucciones de `README.md` (`git clone`, `npm install`, `npm run dev`). No se admiten configuraciones externas opacas, contenedores Docker obligatorios ni dependencias de servicios cloud de pago.
2. **Seguridad y Fuga de Secretos (R-10):** Queda prohibido versionar credenciales reales o variables de entorno en git. Se exige el uso de `.env.example` y la incorporación de `.env` en `.gitignore`.
3. **Localización e Idioma:** Toda la interfaz de usuario, etiquetas de control, mensajes de validación y documentación operativa estarán redactados en idioma español neutro profesional.
4. **Desacoplamiento Estricto:** F5 y F4 interactúan exclusivamente a través de la persistencia relacional en SQLite y los tipos de datos de `src/shared/types.ts`. Ningún componente de la interfaz de F4 accederá a mutaciones de base de datos de F5 de forma directa ni bypasseará la capa de API.

---

## Flujo de Desarrollo, Compuertas de Calidad y Criterios de Aceptación

El equipo establece seis compuertas humanas de paso obligado para salvaguardar la excelencia del entregable:

1. **Compuerta 1 (Constitución):** Ratificada por Lester Gonzalez el 2026-10-14; pendiente de lectura y aprobación del equipo en el PR.
2. **Compuerta 2 (Especificación y Clarificación):** Validación formal de `spec.md` y de los supuestos documentados por el Representante del Cliente (Rodrigo Guerrero), en presencia de Lester Gonzalez y Jorge Alvarez como observadores y auditores.
3. **Compuerta 3 (Plan Técnico y Contratos):** Aprobación técnica conjunta de la arquitectura y del contrato `src/shared/types.ts` por parte de Backend (Rodrigo) y Frontend (Jorge) antes de la generación de tareas.
4. **Compuerta 4 (Revisión de Diff y Pruebas):** El integrante humano a cargo revisa cada propuesta de código del agente, ejecuta la suite de tests automatizados y verifica que no existan tests circulares ni código espurio antes de realizar el commit.
5. **Compuerta 5 (Sesión Formal de Aceptación con el Cliente):** Demostración interactiva en la que Rodrigo Guerrero (en su rol de cliente) evalúa el software integrado contra los criterios `AC-1` a `AC-6` y firma el acta en `docs/entregable2/sesion-aceptacion.md`.
6. **Compuerta 6 (Prueba de Usabilidad Externa):** Aplicación de una prueba de usabilidad independiente con un evaluador externo de otro equipo, registrando observaciones y tiempos de tarea en `docs/entregable2/usabilidad.md`.

---

## Governance

- **Supremacía Constitucional:** La presente Constitución prevalece sobre cualquier sugerencia, prompt del agente o decisión no documentada. Todo desacuerdo técnico se resuelve contrastando el código propuesto contra los 11 principios aquí formalizados.
- **Procedimiento de Enmienda:** Toda modificación o adición a este documento exige acuerdo unánime de los cuatro ingenieros del equipo (Lester Gonzalez, Rodrigo Guerrero, Jorge Alvarez, Angel Salgado), registro en una ficha de decisión (`DEC-E2-xx`) y actualización del versionamiento SemVer en este archivo.
- **Custodia:** Angel Salgado (Gobernanza y Documentación) y Lester Gonzalez (Aseguramiento de Calidad) custodian la adherencia a estos principios en cada revisión de Pull Request.

**Version**: 1.0.0 | **Ratified**: Ratificada por Lester Gonzalez el 2026-10-14; pendiente de lectura y aprobación del equipo en el PR | **Last Amended**: 2026-10-14

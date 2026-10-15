# Investigación Técnica y Decisiones Arquitectónicas (Phase 0)

**Incremento:** F5 (Configuración y Gestión de Umbrales) + F4 (Evaluación y Decisión por Umbrales)  
**Ruta:** `specs/001-f5-f4-umbrales-evaluacion/research.md`  
**Estado:** Propuesto; pendiente de revisión de Rodrigo y Jorge (Compuerta 3)  
**Fecha:** 2026-10-14  

---

## 1. Contexto y Objetivos de Investigación

El propósito de esta fase de investigación técnica es resolver los aspectos arquitectónicos no cerrados en las fases previas, asegurando el cumplimiento estricto de la Constitución del Proyecto (v1.0.0), la guía de implementación SDD (`entregable2/guia-implementacion-sdd.md`), las decisiones técnicas heredadas (`D-01` a `D-09`), las clarificaciones de negocio ratificadas por el Representante del Cliente (`docs/entregable2/clarificaciones.md`) y la restricción no negociable de puesta en marcha en máquina limpia en menos de 15 minutos (Criterio C4 de la rúbrica).

---

## 2. Decisiones Técnicas Previamente Cerradas (Línea Base Rectora)

Las siguientes decisiones fueron formalmente cerradas y ratificadas en la guía de implementación (§4.1) y en el acta de clarificación, constituyendo invariantes de diseño que el plan respeta integralmente:

| Identificador | Decisión Cerrada | Justificación / Origen | Fuente Formal |
| :--- | :--- | :--- | :--- |
| **D-01** | **Persistencia relacional en SQLite autocontenida** | Base de datos relacional ligera en archivo local (`mira.sqlite`), sin requerir contenedores Docker pesados ni bases de datos cliente-servidor externas (PostgreSQL/MySQL), permitiendo clonar y levantar el proyecto en menos de 15 minutos. | `D-01`, `DEC-E2-05`, Criterio C4 |
| **D-02** | **Simulación determinista del motor y señales** | El motor de visión computacional y PLN sobre documentos/evidencias no se construye; se cargan casos de prueba sintéticos con señales numéricas precalculadas desde `data/casos_prueba.json` respaldadas en SQLite. | `D-02`, pauta §4.3 |
| **D-03** | **Versionado inmutable de umbrales con estados BORRADOR, APROBADO y DESESTIMADO** | Cada modificación aprobada genera una versión inmutable con número incremental entero (`version`), impidiendo mutaciones destructivas (`UPDATE`) sobre versiones vigentes o pasadas. | `D-03`, `RQF-039 [fase5-lester]`, `DEC-01`, Clarify P2 |
| **D-04** | **Autenticación simulada mediante selector de 5 identidades fijas** | Selector desplegable en la barra superior con las identidades fijas: `Diseñador 1`, `Diseñador 2`, `Administrador 1`, `Administrador 2` y `Operador 1`, garantizando segregación de roles para probar doble control (`PF-033`) sin autenticación OAuth o SSO corporativo en este incremento. | `D-04`, `H-06`, MIRA §2.13, `PF-033`, Clarify P2 |
| **D-05** | **Rastro inalterable de auditoría append-only** | Registro persistente de eventos de cambio de umbrales y evaluaciones de casos con triggers SQLite que bloquean operaciones `UPDATE` y `DELETE` sobre las tablas de auditoría. | `D-05`, `H-12`, `RQNF-008` |
| **D-06** | **Estrategia de testing con Vitest, Supertest y Playwright** | Vitest para tests unitarios y de integración de lógica de backend; Supertest para API HTTP; Playwright para recorrido E2E en navegador y prueba de usabilidad; test automatizado de reproducibilidad determinista al 100%. | `D-06`, `DEC-E2-05`, §6.5 |
| **D-07** | **Mínimos normativos por señal: Autenticidad 70, Cruce 70, Coherencia 60** | Valores base ratificados formalmente por el Representante del Cliente para el flujo de reembolso de gastos médicos. Modificables en F5 bajo doble control (rango válido 0 a 100 inclusive). | `D-07`, `H-05`, MIRA §2.6, ENT3 [00:21:47], Clarify P1 |
| **D-08** | **Fórmula de agregación y ponderaciones: 0.40, 0.40, 0.20 (suma = 1.00)** | Promedio ponderado lineal: `scoreGlobal = 0.40 * aut + 0.40 * cruce + 0.20 * coh`. Suma obligatoria = 1.00. La fórmula y pesos son `[SUPUESTO del equipo]`, citando `RQF-043 [final-final]` para el concepto de puntaje 0-100 con desglose. | `D-08`, `RQF-043 [final-final]`, MIRA §2.6, Clarify P1 |
| **D-09** | **Especificación única consolidada F5 + F4** | Gestión de umbrales y evaluación integradas en una sola especificación `spec.md`, con tareas etiquetadas `[F5]` y `[F4]` para mantener trazabilidad productor-consumidor. | `D-09`, `DEC-E2-10(c)` |

---

## 3. Decisiones Técnicas Abiertas y Recomendaciones [POR CONFIRMAR]

A continuación se registran las tres decisiones técnicas no zanjadas taxativamente en la guía de implementación, formuladas con sus alternativas evaluadas y la recomendación técnica fundamentada para revisión del equipo (Compuerta 3):

### Investigación 1: Framework HTTP para el Backend Node.js [POR CONFIRMAR 1]
- **Pregunta:** *¿Qué framework HTTP debe emplearse en el backend Node.js (v20+ LTS) para exponer los endpoints de F5 y F4?*
- **Contexto:** En `entregable2/guia-implementacion-sdd.md` DEC-E2-05 figura "Node.js (v20+ LTS) con TypeScript y Express / Fastify", mientras que la Constitución (Principio VII) consigna "arquitectura liviana Express [POR CONFIRMAR]".
- **Alternativas Evaluadas:**
  - *Opción A (Recomendada): Express (v4.19+ o v5).*
    - *Ventajas:* Madurez industrial absoluta, API simple y minimalista, soporte nativo directo con `supertest` para pruebas de integración de endpoints sin necesidad de levantar listeners de red reales (`supertest(app)`), manejo transparente de JSON con `express.json()`, cero curva de aprendizaje para el equipo.
    - *Desventajas:* Menor rendimiento teórico en benchmarks de microsegundos frente a Fastify (irrelevante para este incremento sin SLA de latencia y con casos sintéticos).
  - *Opción B: Fastify.*
    - *Ventajas:* Validación basada en esquemas JSON Schema de alta velocidad, tipado TypeScript integrado en rutas.
    - *Desventajas:* Requiere configuración adicional (`fastify.inject()` o adapter para supertest), mayor complejidad en tipado de middlewares y hooks de ciclo de vida.
- **Recomendación:** **Opción A (Express).** Permite implementar la API REST en pocas líneas de código limpio, facilita la testing suite con `supertest` y asegura levantar el backend de forma confiable en cualquier máquina limpia sin complicaciones de compatibilidad.

### Investigación 2: Driver de Conexión y Gestión de Base de Datos SQLite [POR CONFIRMAR 2]
- **Pregunta:** *¿Qué librería o driver debe utilizar el backend TypeScript para interactuar con el archivo de base de datos SQLite y garantizar triggers de auditoría inmutables?*
- **Contexto:** Las decisiones D-01 y D-05 exigen persistencia SQLite relacional y rastro de auditoría append-only con triggers.
- **Alternativas Evaluadas:**
  - *Opción A (Recomendada): `better-sqlite3` con sentencias SQL preparadas nativas y migraciones DDL directas.*
    - *Ventajas:* Ejecución síncrona determinista de alto rendimiento (ideal para Node.js CLI y microservicios autocontenidos), manejo directo de triggers SQLite (`CREATE TRIGGER ... RAISE(ABORT, ...)`), transacciones nativas con `.transaction()`, cero abstracciones opacas, máxima velocidad en tests unitarios en memoria (`:memory:`).
    - *Desventajas:* Requiere precompilación nativa (prebuild binaries provistos automáticamente por npm para Linux x64/arm64, macOS y Windows).
  - *Opción B: `sqlite3` asíncrono tradicional.*
    - *Ventajas:* Librería clásica por callbacks.
    - *Desventajas:* API basada en callbacks obsoleta que obliga a wrapping manual con Promesas; propensa a race conditions en pruebas consecutivas de lectura/escritura.
  - *Opción C: ORM pesado (Prisma / TypeORM).*
    - *Ventajas:* Generación automática de tipos y migraciones.
    - *Desventajas:* Descarga de binarios pesados (Prisma engine ~40MB), tiempos de inicio elevados, sobrecarga innecesaria para un modelo de datos acotado a 3 tablas, riesgo de superar los 15 minutos en máquina limpia (Criterio C4).
- **Recomendación:** **Opción A (`better-sqlite3`).** Ofrece API síncrona limpia en TypeScript, soporte completo para DDL y triggers de inmutabilidad (D-05), y permite usar `:memory:` en tests de Vitest para ejecuciones instantáneas y deterministas al 100%.

### Investigación 3: Estructura de Workspace y Comunicación Frontend ↔ Backend [POR CONFIRMAR 3]
- **Pregunta:** *¿Cómo estructurar el repositorio y la ejecución concurrente para cumplir con el arranque en menos de 15 minutos sin problemas de CORS ni puertos colisionados?*
- **Contexto:** Se requiere frontend React + Vite y backend Node.js en español neutro, ejecutables mediante un único comando en la raíz del repositorio (`npm install && npm run dev`).
- **Alternativas Evaluadas:**
  - *Opción A (Recomendada): Monorepo liviano con carpetas `backend/` y `frontend/` y `package.json` raíz coordinado con `concurrently` y Vite Proxy.*
    - *Estructura:*
      - Raíz: `package.json` con scripts `"dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""`.
      - `backend/`: corre en puerto `3001` (configurable vía variable `PORT`).
      - `frontend/`: Vite dev server corre en puerto `5173` con proxy inverso configurado en `vite.config.ts`: `/api` redirige a `http://localhost:3001`.
      - Tipos compartidos: Contrato TypeScript en `src/shared/types.ts` accesible por ambos frentes mediante path aliases de TypeScript.
    - *Ventajas:* Elimina por diseño los errores de CORS en el navegador; permite levantar tanto la API como la interfaz con un solo comando; el evaluador abre `http://localhost:5173` y la aplicación opera fluidamente.
  - *Opción B: Single-package unificado donde Express sirve los estáticos compilados de Vite.*
    - *Ventajas:* Un solo proceso en ejecución.
    - *Desventajas:* Requiere compilar el frontend (`npm run build`) antes de poder probar cambios, ralentizando el ciclo de desarrollo interactivo de Jorge.
  - *Opción C: Workspaces npm formales (`npm workspaces`).*
    - *Ventajas:* Separación estricta de dependencias de node_modules.
    - *Desventajas:* Mayor complejidad de configuración y riesgos de enlaces simbólicos rotos en diferentes sistemas operativos o entornos Docker restringidos.
- **Recomendación:** **Opción A (Monorepo liviano con proxy de Vite).** Garantiza experiencia de desarrollo desacoplada para Rodrigo (Backend) y Jorge (Frontend), elimina la fricción de CORS y asegura que el comando unificado `npm run dev` levante todo el ecosistema de inmediato.

---

## 4. Estrategia de Reproducibilidad Determinista (RQNF-002 / SC-004)

Conforme a la clarificación 4 ratificada por el cliente, en la Entrega 2 no rige ningún SLA contractual de latencia. La prueba extra-funcional vinculante para el Criterio C5 es la **reproducibilidad determinista al 100%** de decisiones pasadas:
1. **Mecanismo de Auditoría Histórica:** Al evaluar un caso en F4, el sistema almacena en la tabla `auditoria_evaluaciones`:
   - `idEvaluacion` (UUID autonumérico/v4)
   - `idCaso` (identificador del caso evaluado)
   - `versionUmbralesAplicada` (número exacto de la versión vigente utilizada)
   - `senalesInsumo` (JSON con las señales exactas del caso en ese instante: `autenticidad_documentos`, `cruce_fuentes`, `coherencia_solicitud`, `alertaFraudeActiva`)
   - `scoreGlobal` (número flotante exacto sin redondear)
   - `decision` (`APROBADO_AUTOMATICO` o `DERIVADO_REVISION`)
   - `motivo` (`aprobado`, `alerta_fraude`, `senal_bajo_minimo`, `puntaje_bajo_umbral`)
   - `riesgoAltoRechazo` (booleano)
   - `timestamp` (ISO 8601 UTC)
2. **Suite Automatizada de Verificación (`tests/reproducibility/deterministic.test.ts`):**
   - El test toma cada registro de evaluación histórica en la base de datos SQLite.
   - Recupera la versión histórica exacta de umbrales desde la tabla `umbrales_flujo` usando `versionUmbralesAplicada`.
   - Vuelve a ejecutar la función pura del motor de evaluación `evaluarCaso(senalesInsumo, umbralesHistoricos)`.
   - Valida que `decisionCalculada === decisionArchivada`, `motivoCalculado === motivoArchivado`, `scoreCalculado === scoreArchivado` y `riesgoAltoCalculado === riesgoAltoArchivado` en el 100% de las iteraciones.

---

## 5. Delimitación de Alcance y Supuesto (f) Pendiente

En cumplimiento del Supuesto propuesto por Lester en la revisión del 14-10-2026 (§7.1(f) de `spec.md` y fila 6 del acta de clarificación), se formaliza:
- **Fuera de Alcance:** La decisión humana final del Operador sobre un caso derivado (aprobar o denegar el reembolso tras revisar la evidencia en su bandeja) queda fuera del incremento F5+F4.
- **Alcance Incluido de F4:** El motor y la interfaz de F4 se limitan estrictamente a calcular las señales, determinar la decisión (`APROBADO_AUTOMATICO` o `DERIVADO_REVISION`), asignar el motivo, calcular la advertencia de severidad (`riesgoAltoRechazo`) y desplegar la ficha visual de resultados con el texto *"Riesgo alto de rechazo: decide un operador"* cuando corresponda.
- **Impacto en el Plan:** No se diseñarán endpoints ni vistas para que el Operador apruebe o rechace siniestros; el Operador únicamente consulta y visualiza expedientes evaluados.

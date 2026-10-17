# Tasks: Incremento Consolidado F5 (Configuración de Umbrales) + F4 (Evaluación de Casos y Decisión)

**Input**: [`specs/001-f5-f4-umbrales-evaluacion/spec.md`](spec.md), [`plan.md`](plan.md), [`data-model.md`](data-model.md), [`contracts/`](contracts/), [`research.md`](research.md), [`quickstart.md`](quickstart.md)  
**Status**: Ready for Implementation (Compuerta 3 Aprobada en PR #16, 2026-10-15)  
**Feature Identifier**: `001-f5-f4-umbrales-evaluacion`  
**Branch Activa**: `feat/tasks-f5-f4`

---

## Resumen de Tareas y Roles del Equipo

En cumplimiento del principio de gobernanza y separación de frentes de trabajo (§4.1, DEC-E2-03, DEC-E2-07):
- **Rodrigo Guerrero (Backend & Persistencia):** Infraestructura de servidor Express, conexión SQLite con `better-sqlite3`, DDL, triggers e integridad referencial, repositorio de umbrales, servicios de negocio F5/F4, controladores REST y pruebas unitarias/integración de backend.
- **Jorge Alvarez (Frontend & Experiencia de Usuario):** Configuración de Vite, armazón SPA React, componentes visuales de F5 y F4, hooks reactivos, selector de identidades simuladas y estilos CSS. *Jorge puede comenzar el desarrollo del frontend de inmediato a partir de los contratos formalizados en `contracts/`, sin esperar la finalización del backend.*
- **Lester Gonzalez (Aseguramiento de Calidad & QA):** Contrato tipado `src/shared/types.ts` (commit `[PLAN]`), pruebas extra-funcionales de reproducibilidad determinista al 100% (`SC-004`), suites E2E en Playwright (`doble-control-f5`, `evaluacion-f4`, `usabilidad-recorrido` para `SC-005`), documentación de arranque rápido en `< 15 min` (`README.md`) y matriz de trazabilidad canónica.

---

## Phase 0: Infraestructura y Configuración Base (Shared Infrastructure)

**Propósito**: Inicialización del monorepo modular, configuración de TypeScript y Vite, base de datos relacional SQLite con triggers inmutables y claves foráneas activas, carga de casos sintéticos, sesión simulada en backend y frontend (selector de identidades), repositorio de lectura de umbrales y servidor Express base.

- [x] T001 [INFRA] [P] Inicializar configuración raíz en `package.json` y `tsconfig.json` con dependencias base (Node 20+, Express, better-sqlite3, React, Vite, Vitest, Supertest, Playwright, tsx, concurrently), creación de `tests/playwright.config.ts` (con bloque webServer para backend en :3001 y frontend en :5173), scripts dev (backend + vite con `--config src/frontend/vite.config.ts`), db:seed (vía `tsx src/backend/db/seeds/initial-seed.ts`), build, test:e2e (confirmando que ejecuta Playwright usando `tests/playwright.config.ts`), test (unit, integration, e2e, reproducibility) y path aliases (Cubre: PC-01, PC-02, PC-03, Criterio C4; Responsable sugerido: Rodrigo)
- [x] T002 [INFRA] [P] Configurar empaquetador Vite con `root: 'src/frontend'`, `build.outDir: '../../dist'` y proxy inverso `/api -> http://localhost:3001` en `src/frontend/vite.config.ts` (Cubre: PC-03, Criterio C4; Responsable sugerido: Jorge)
- [x] T003 [INFRA] [PLAN] - la hace Lester: Crear contrato TypeScript canónico compartido F5 <-> F4 (`UmbralesFlujo`, `SenalesCaso`, `CasoPrueba`, `ResultadoEvaluacion`, `IdentidadSimulada`) desde `data-model.md §4` en `src/shared/types.ts` (Cubre: DEC-E2-10, D-03, D-04, Principio VII; Responsable sugerido: Lester)
- [x] T004 [INFRA] Crear esquema DDL relacional en SQLite con tablas `umbrales_flujo`, `auditoria_evaluaciones`, `rastro_auditoria`, triggers append-only (`trg_prevent_update_*`, `trg_prevent_delete_*`) e índice único parcial `idx_un_solo_borrador_por_flujo` en `src/backend/db/schema.sql` y conexión síncrona con driver nativo `better-sqlite3` ejecutando explícitamente `PRAGMA foreign_keys = ON al abrir la conexión en src/backend/db/database.ts`, aplicando `src/backend/db/schema.sql` de forma idempotente al conectar (`CREATE ... IF NOT EXISTS` para tablas, triggers e índice) (Cubre: RQF-036 [fase5-lester], RQF-013 [final-final], FR-004 soporte técnico, PC-02, D-01, D-05; Responsable sugerido: Rodrigo)
- [x] T005 [INFRA] [P] Generar archivo de casos sintéticos de prueba con los 6 casos de reembolso médico copiados de guía §2.d en `data/casos_prueba.json` e implementar script de inicialización y siembra en `src/backend/db/seeds/initial-seed.ts` (carga de casos y registro de versión 1 por defecto con proponente 'sistema' y aprobador 'carga inicial del sistema (valores por defecto)'), asegurando que el seed pueda ejecutarse dos veces de forma idempotente sin duplicar la versión 1 (permitiendo que `npm run db:seed` funcione en máquina limpia) (Cubre: RQF-040 [fase5-lester], RQF-041 [fase5-lester], RQF-023 [fase5-lester], RQF-004 [final-final], D-02, AC-1..AC-6; Responsable sugerido: Rodrigo)
- [x] T006 [INFRA] Configurar servidor Express exportando la instancia `app` desde un módulo separado de la llamada a `listen()` (para que supertest la consuma sin abrir puerto) y montando los enrutadores base (`/api/session`, `/api/evaluacion`, `/api/umbrales`) en `src/backend/server.ts`, con middlewares de parseo JSON, manejo de cookies (para `mira_session`), registro de peticiones en `src/backend/middlewares/request-logger.ts`, manejador centralizado de errores en `src/backend/middlewares/error-handler.ts` y configuración de entorno en `src/backend/config/env.ts` (Cubre: PC-01, Criterio C4; Responsable sugerido: Rodrigo)
- [x] T007 [INFRA] [P] Configurar armazón SPA de Frontend en React con punto de entrada HTML en `src/frontend/index.html`, montaje en `src/frontend/main.tsx`, layout principal en `src/frontend/App.tsx`, tokens de diseño CSS moderno en `src/frontend/styles/app.css` y cliente HTTP base en `src/frontend/services/api-client.ts` (Cubre: PC-03, Principio VII; Responsable sugerido: Jorge)
- [x] T031 [INFRA] [P] (movida desde Fase 5; ID conservado) Escribir pruebas de integración fallidas para gestión de sesión simulada en `tests/integration/session-api.test.ts` (verificar `GET /api/session/current`, `POST /api/session/switch` con cuerpo `{"nuevoUsuario": "..."}`, conmutación entre las 5 identidades fijas, persistencia en cookie `mira_session` y valor por defecto `'Diseñador 1'` per `contracts/session-simulada.md`) (Depende de: T006) (Cubre: D-04, PF-033 adaptada, SC-003; Responsable sugerido: Rodrigo)
- [x] T034 [INFRA] (movida desde Fase 5; ID conservado) Implementar servicio y controlador de sesión simulada en `src/backend/services/session-service.ts`, `src/backend/controllers/session-controller.ts` y `src/backend/routes/session-routes.ts` gestionando lectura y emisión de cookie HTTP `mira_session`, endpoints `GET /api/session/current` y `POST /api/session/switch` (con cuerpo `nuevoUsuario`), y middleware de resolución de identidad activa (Depende de: T006) (Cubre: D-04, PF-033 adaptada; Responsable sugerido: Rodrigo)
- [x] T037 [INFRA] [P] (movida desde Fase 5; ID conservado) Implementar hook de sesión y componente selector de identidad `src/frontend/hooks/useSession.ts` y `src/frontend/components/common/HeaderSelectorIdentidad.tsx` en la barra superior desplegando el selector con las 5 identidades fijas y conmutando dinámicamente la cookie de sesión (Cubre: D-04, PF-033 adaptada; Responsable sugerido: Jorge)
- [x] T051 [INFRA] Implementar repositorio de acceso a datos en `src/backend/repositories/umbrales-repo.ts` con `obtenerVigente(idFlujo)` para consultar la versión APROBADA más reciente desde SQLite, desacoplando la lectura para el motor F4 y umbrales-service (Depende de: T004) (Cubre: RQF-044 [final-final], FR-001, FR-005, D-01; Responsable sugerido: Rodrigo)

---

## Phase 1: User Story 1 - Evaluación de Caso y Derivación por Precedencia de Fraude o Señal Bajo Mínimo (Prioridad: P1) [F4]

**Meta**: Evaluar expedientes sintéticos priorizando la seguridad y contención del riesgo: ante sospecha de fraude o señales documentales bajo su mínimo propio, el sistema deriva obligatoriamente a revisión (`DERIVADO_REVISION`), ignorando cualquier puntaje obtenido.  
**Criterio de Prueba Independiente**: Evaluar `CASO-MED-003` (alerta de fraude activa) y `CASO-MED-002` (coherencia 55 < 60) verificando salida `DERIVADO_REVISION`, motivos respectivos `alerta_fraude` y `senal_bajo_minimo`, y ausencia de aprobación automática.

### Tests Unitarios e Integración (TDD: escribir primero, deben fallar)
- [x] T008 [F4] [US1] [P] Escribir pruebas unitarias fallidas de precedencia de alerta de fraude (`AC-3`, `CASO-MED-003`, ignora puntaje 94.0 -> `alerta_fraude`) y derivación por señal individual bajo mínimo (`AC-2`, `CASO-MED-002`, coherencia 55 < 60 con puntaje 91.0 -> `senal_bajo_minimo`) en `tests/unit/evaluacion-engine.test.ts` (Cubre: RQF-023 [fase5-lester], RQF-041 [fase5-lester], FR-007, FR-008, AC-2, AC-3; Responsable sugerido: Rodrigo)
- [x] T009 [F4] [US1] [P] Escribir prueba de integración fallida para endpoint `POST /api/evaluacion/evaluar` en `tests/integration/evaluacion-api.test.ts` validando derivación resolutiva `DERIVADO_REVISION` con motivos `alerta_fraude` para CASO-MED-003 y `senal_bajo_minimo` para CASO-MED-002 (Cubre: RQF-023 [fase5-lester], RQF-041 [fase5-lester], FR-007, FR-008, AC-2, AC-3; Responsable sugerido: Rodrigo)

### Implementación
- [x] T010 [F4] [US1] Implementar lógica de motor en `src/backend/services/evaluacion-engine.ts` para paso 1 (precedencia absoluta de fraude -> `alerta_fraude`) y paso 2 (detección de señales bajo mínimo propio -> `senal_bajo_minimo`) retornando `DERIVADO_REVISION` sin alterar por puntaje (Cubre: RQF-023 [fase5-lester], RQF-041 [fase5-lester], FR-007, FR-008; Responsable sugerido: Rodrigo)
- [x] T011 [F4] [US1] Implementar controlador y enrutador de evaluación para `POST /api/evaluacion/evaluar` en `src/backend/controllers/evaluacion-controller.ts` y `src/backend/routes/evaluacion-routes.ts` con carga de señales desde `data/casos_prueba.json` e inserción inmutable en tabla `auditoria_evaluaciones` (Cubre: RQF-023 [fase5-lester], RQF-041 [fase5-lester], FR-007, FR-008, D-02; Responsable sugerido: Rodrigo)
- [x] T012 [F4] [US1] [P] Implementar hook de consulta y mutación de evaluación `src/frontend/hooks/useEvaluacion.ts` consumiendo `POST /api/evaluacion/evaluar` y exponiendo estado, resultado y errores (Cubre: FR-007, FR-008; Responsable sugerido: Jorge)
- [x] T013 [F4] [US1] [P] Implementar componente de resultado de evaluación `src/frontend/components/evaluacion/VistaResultado.tsx` con despliegue de badge resolutivo (`DERIVADO_REVISION`), motivo técnico (`alerta_fraude` o `senal_bajo_minimo`), lista de señales en falta y desglose numérico puntual (Cubre: RQF-023 [fase5-lester], RQF-041 [fase5-lester], FR-007, FR-008, AC-2, AC-3; Responsable sugerido: Jorge)

---

## Phase 2: User Story 2 - Aprobación Automática de Casos Cumplidores sin Fraude y Rango Intermedio (Prioridad: P1) 🎯 MVP

**Meta**: Resolver aprobación automática directa (`APROBADO_AUTOMATICO`) para expedientes que superen el umbral exigido (score >= 90) sin caídas bajo mínimos ni alertas de fraude, y derivar a revisión con motivo `puntaje_bajo_umbral` aquellos en rango intermedio (60 <= score < 90).  
**Criterio de Prueba Independiente**: Evaluar `CASO-MED-001` (puntaje 94.0 >= 90) verificando `APROBADO_AUTOMATICO` con motivo `aprobado`, caso límite con puntaje exacto 90.0 aprobando automáticamente, y `CASO-MED-005` (puntaje 75.0) derivando con motivo `puntaje_bajo_umbral`.

### Tests Unitarios e Integración (TDD: escribir primero, deben fallar)
- [x] T014 [F4] [US2] Escribir pruebas unitarias fallidas de cálculo ponderado continuo (`calcularScoreGlobal`), aprobación automática holgada (`AC-1`, `CASO-MED-001`, puntaje 94.0 >= 90 -> `aprobado`), caso límite inclusivo (`scoreGlobal === 90.0` -> `aprobado`) y derivación por rango intermedio (`AC-5`, `CASO-MED-005`, puntaje 75.0 -> `puntaje_bajo_umbral`) en `tests/unit/evaluacion-engine.test.ts` (Cubre: RQF-040 [fase5-lester], RQF-004 [final-final], FR-005, FR-006, FR-009, AC-1, AC-5, DEC-01; Responsable sugerido: Rodrigo)
- [x] T015 [F4] [US2] Escribir pruebas de integración fallidas en `tests/integration/evaluacion-api.test.ts` para `GET /api/evaluacion/casos` (lista los 6 casos sintéticos) y `POST /api/evaluacion/evaluar` con `CASO-MED-001` (200 OK, `APROBADO_AUTOMATICO`, `aprobado`) y `CASO-MED-005` (200 OK, `DERIVADO_REVISION`, `puntaje_bajo_umbral`) (Cubre: RQF-040 [fase5-lester], RQF-004 [final-final], FR-005, FR-006, FR-009, AC-1, AC-5; Responsable sugerido: Rodrigo)

### Implementación
- [x] T016 [F4] [US2] Implementar en `src/backend/services/evaluacion-engine.ts` la función `calcularScoreGlobal` (`0.40·aut + 0.40·cruce + 0.20·coh`), paso 3 (`scoreGlobal >= umbralAprobacion` -> `APROBADO_AUTOMATICO`, `aprobado`) y paso 4 (`scoreGlobal < umbralAprobacion` -> `DERIVADO_REVISION`, `puntaje_bajo_umbral`) aplicando la versión vigente de umbrales obtenida vía `umbrales-repo.ts` (Depende de: T051) (Cubre: RQF-040 [fase5-lester], RQF-004 [final-final], FR-005, FR-006, FR-009, AC-1, AC-5; Responsable sugerido: Rodrigo)
- [x] T017 [F4] [US2] Implementar handler y ruta `GET /api/evaluacion/casos` en `src/backend/controllers/evaluacion-controller.ts` y `src/backend/routes/evaluacion-routes.ts` retornando catálogo de expedientes sintéticos desde `data/casos_prueba.json` (Cubre: RQF-040 [fase5-lester], D-02, AC-1..AC-6; Responsable sugerido: Rodrigo)
- [x] T018 [F4] [US2] [P] Implementar componente de catálogo de casos `src/frontend/components/evaluacion/ListaCasosPrueba.tsx` para listar expedientes sintéticos con detalle de prestación médica y selección interactiva (Cubre: RQF-040 [fase5-lester], AC-1..AC-6, D-02; Responsable sugerido: Jorge)
- [x] T019 [F4] [US2] [P] Implementar disparador de evaluación `src/frontend/components/evaluacion/FormularioEvaluacion.tsx` permitiendo al operador seleccionar caso, ejecutar evaluación contra el backend y actualizar la vista de resultado (Cubre: RQF-040 [fase5-lester], FR-006, AC-1; Responsable sugerido: Jorge)

---

## Phase 3: User Story 3 - Señalización de Advertencia de Riesgo Alto sin Rechazo Automático (Prioridad: P1) [F4]

**Meta**: Activar la advertencia informativa `riesgoAltoRechazo: true` (*"Riesgo alto de rechazo: decide un operador"*) cuando existan 2 o más señales bajo mínimo o el puntaje global sea inferior a `umbralRiesgoAlto` (60), garantizando que el sistema jamás emita una resolución de "rechazo automático" (salidas exclusivas `APROBADO_AUTOMATICO` o `DERIVADO_REVISION`).  
**Criterio de Prueba Independiente**: Evaluar `CASO-MED-004` (score 44.0 y 2 señales bajo mínimo), `CASO-MED-006` (score 40.0 con 1 señal bajo mínimo) y `PU-1` (score 72.0 con 2 señales bajo mínimo), verificando `riesgoAltoRechazo: true`, `decision: 'DERIVADO_REVISION'` y 0% de uso de la palabra "rechazado".

### Tests Unitarios e Integración (TDD: escribir primero, deben fallar)
- [x] T020 [F4] [US3] Escribir pruebas unitarias fallidas en `tests/unit/evaluacion-engine.test.ts` para cálculo de `riesgoAltoRechazo: true` en `CASO-MED-004` (`AC-4`, score 44.0 y 2 señales bajo mínimo), `CASO-MED-006` (`AC-6`, score 40.0 con 1 señal bajo mínimo), prueba multiseñal `PU-1` (Aut: 65, Cruce: 65, Coh: 100 con score 72.0 >= 60 y 2 señales bajo mínimo), y verificación de invariante estricto de cero rechazo automático del sistema (`SC-002`, `FR-010`) (Cubre: RQF-020 [fase5-lester], PF-015, FR-010, FR-011, AC-4, AC-6, PU-1, SC-002, DEC-08, DEC-E2-10(b); Responsable sugerido: Rodrigo)
- [x] T021 [F4] [US3] Escribir pruebas de integración fallidas en `tests/integration/evaluacion-api.test.ts` verificando que la respuesta de `POST /api/evaluacion/evaluar` para `CASO-MED-004` y `CASO-MED-006` contiene `decision: 'DERIVADO_REVISION'` (nunca 'RECHAZADO') y `riesgoAltoRechazo: true` (Cubre: RQF-020 [fase5-lester], PF-015, FR-010, FR-011, AC-4, AC-6, SC-002; Responsable sugerido: Rodrigo)

### Implementación
- [x] T022 [F4] [US3] Implementar en `src/backend/services/evaluacion-engine.ts` la función `calcularRiesgoAltoRechazo` (`conteo(senales bajo minimo) >= 2 || scoreGlobal < umbralRiesgoAlto`) y garantizar en todo el backend la restricción de salidas exclusivas `APROBADO_AUTOMATICO` o `DERIVADO_REVISION` sin lenguaje de rechazo (Cubre: RQF-020 [fase5-lester], FR-010, FR-011, SC-002, DEC-08; Responsable sugerido: Rodrigo)
- [x] T023 [F4] [US3] [P] Implementar componente de advertencia informativa `src/frontend/components/evaluacion/AlertaRiesgoAlto.tsx` desplegando tarjeta de aviso con el texto exacto *"Riesgo alto de rechazo: decide un operador"*, asegurando ausencia absoluta de la palabra "rechazado" como dictamen (Cubre: FR-010, FR-011, SC-002, AC-4, AC-6; Responsable sugerido: Jorge)

---

## Phase 4: User Story 4 - Gestión y Propuesta de Modificación de Umbrales en Borrador (Prioridad: P2) [F5]

**Meta**: Permitir a un usuario con rol Diseñador consultar la política paramétrica vigente y registrar propuestas de modificación en estado `BORRADOR` con estricta validación de entrada (suma pesos = 1.00, rangos [0, 100], `umbralAprobacion > umbralRiesgoAlto`), sin alterar la operación de evaluación de F4.  
**Criterio de Prueba Independiente**: Acceder como Diseñador, consultar versión vigente y enviar propuesta válida verificando creación en estado `BORRADOR` con autor registrado, bloqueo de propuestas inválidas (suma pesos != 1.00 o umbrales invertidos) y límite de 1 solo borrador activo por flujo.

### Tests Unitarios e Integración (TDD: escribir primero, deben fallar)
- [x] T024 [F5] [US4] [P] Escribir pruebas unitarias fallidas de validación de umbrales en `tests/unit/umbrales-validation.test.ts` para suma exacta de ponderaciones = 1.00 (`|sum - 1.0| < 0.0001`), límites inclusivos [0, 100] para mínimos y umbrales, y consistencia de corte `umbralAprobacion > umbralRiesgoAlto` (Cubre: RQF-044 [final-final], FR-003, US4 / Esc. 4.2; Responsable sugerido: Rodrigo)
- [x] T025 [F5] [US4] [P] Escribir pruebas de integración fallidas en `tests/integration/umbrales-api.test.ts` para `GET /api/umbrales/vigente` (retorna versión 1 activa), `POST /api/umbrales/borrador` (crea borrador con `MAX(version) + 1`, autor en proponente, valida rol Diseñador; 400 si parámetros inválidos; 409 si ya existe borrador activo per `idx_un_solo_borrador_por_flujo`), y `PUT /api/umbrales/borrador` (actualiza borrador existente) (Depende de: T034) (Cubre: RQF-044 [final-final], RQF-039 [fase5-lester], FR-001, FR-003, US4; Responsable sugerido: Rodrigo)

### Implementación
- [x] T026 [F5] [US4] Implementar métodos de negocio en `src/backend/services/umbrales-service.ts` delegando `obtenerVigente()` en `umbrales-repo.ts` (Depende de: T051), y añadiendo `validarParametrosUmbrales()`, `crearBorrador()` (asignando versión correlativa y registrando proponente) y `modificarBorrador()` sobre la tabla `umbrales_flujo` (Cubre: RQF-044 [final-final], RQF-039 [fase5-lester], FR-001, FR-003; Responsable sugerido: Rodrigo)
- [x] T027 [F5] [US4] Implementar handlers y rutas en `src/backend/controllers/umbrales-controller.ts` y `src/backend/routes/umbrales-routes.ts` para `GET /api/umbrales/vigente`, `POST /api/umbrales/borrador` y `PUT /api/umbrales/borrador`, validando rol Diseñador desde sesión activa (Depende de: T034) y registrando evento `PROPUESTA_CREADA` / `PROPUESTA_MODIFICADA` en `rastro_auditoria` (Cubre: RQF-044 [final-final], RQF-039 [fase5-lester], FR-001, FR-003, D-05; Responsable sugerido: Rodrigo)
- [x] T028 [F5] [US4] [P] Implementar hook de gestión de umbrales `src/frontend/hooks/useUmbrales.ts` para consultar versión vigente, borrador activo y enviar mutaciones de propuesta (Cubre: FR-001, FR-003; Responsable sugerido: Jorge)
- [x] T029 [F5] [US4] [P] Implementar componente de consulta de política activa `src/frontend/components/umbrales/PanelUmbralesVigentes.tsx` mostrando número de versión vigente, fecha de entrada en vigencia, umbrales de corte, mínimos por señal y pesos normalizados (Cubre: RQF-044 [final-final], FR-001; Responsable sugerido: Jorge)
- [x] T030 [F5] [US4] [P] Implementar formulario interactivo `src/frontend/components/umbrales/FormularioPropuesta.tsx` para que el Diseñador proponga nuevos parámetros o edite el borrador, con validación reactiva de suma de pesos = 1.00, restricción `umbralAprobacion > umbralRiesgoAlto` y sincronización con identidad simulada (Depende de: T037) (Cubre: RQF-044 [final-final], RQF-039 [fase5-lester], FR-001, FR-003, US4 / Esc. 4.1 y 4.2; Responsable sugerido: Jorge)

---

## Phase 5: User Story 5 - Flujo de Doble Control, Roles y Aprobación de Nuevas Versiones (Prioridad: P2) [F5]

**Meta**: Exigir que toda propuesta de umbrales sea aprobada por un Administrador formalmente distinto al Diseñador proponente, bloqueando la auto-aprobación (`aprobador !== proponente` como defensa en profundidad) y promoviendo el borrador a `APROBADO` con entrada en vigencia inmediata e incremento autonumérico de versión.  
**Criterio de Prueba Independiente**: Conmutar identidades con cookie `mira_session`: Diseñador 1 propone borrador; Diseñador 1 intenta aprobar y recibe 403 Forbidden por rol y auto-aprobación; Administrador 1 aprueba formalmente y la versión pasa a ser la vigente para futuras evaluaciones en F4.

### Tests Unitarios e Integración (TDD: escribir primero, deben fallar)
- [x] T032 [F5] [US5] Escribir pruebas de integración fallidas de doble control en `tests/integration/umbrales-api.test.ts`: Diseñador propone (403 Forbidden si Administrador intenta POST/PUT borrador), Administrador aprueba (403 Forbidden si Diseñador intenta aprobar o desestimar), bloqueo de auto-aprobación (`aprobador === proponente` retorna 403 Forbidden como defensa en profundidad) y aprobación exitosa por Administrador independiente (retorna 200 OK, promueve estado a `APROBADO`, actualiza fechaResolución y rige inmediatamente en F4) (Depende de: T034) (Cubre: RQF-039 [fase5-lester], FR-002, SC-003, US5 / Esc. 5.1 y 5.2, PF-033 adaptada; Responsable sugerido: Rodrigo)
- [x] T033 [F5] [US5] Escribir prueba de integración fallida para desestimación de borrador en `tests/integration/umbrales-api.test.ts` (`POST /api/umbrales/borrador/desestimar`), validando transición a estado `DESESTIMADO`, conservación del número de versión en SQLite y liberación del índice único para nuevos borradores (Cubre: RQF-039 [fase5-lester], FR-002, D-03; Responsable sugerido: Rodrigo)

### Implementación
- [x] T035 [F5] [US5] Implementar lógica de resolución formal de borradores en `src/backend/services/umbrales-service.ts` (`aprobarBorrador()` y `desestimarBorrador()`), exigiendo rol Administrador, comprobando `aprobador !== proponente`, actualizando registro inmutable en `umbrales_flujo` e insertando eventos `PROPUESTA_APROBADA` o `PROPUESTA_DESESTIMADA` en `rastro_auditoria` (Cubre: RQF-039 [fase5-lester], FR-002, SC-003, D-05; Responsable sugerido: Rodrigo)
- [x] T036 [F5] [US5] Implementar endpoints de aprobación y desestimación en `src/backend/controllers/umbrales-controller.ts` y `src/backend/routes/umbrales-routes.ts` para `POST /api/umbrales/borrador/aprobar` y `POST /api/umbrales/borrador/desestimar` (Cubre: RQF-039 [fase5-lester], FR-002, SC-003; Responsable sugerido: Rodrigo)
- [x] T038 [F5] [US5] [P] Implementar bandeja de revisión administrativa `src/frontend/components/umbrales/BandejaRevision.tsx` para que el Administrador audite los cambios propuestos respecto a la versión vigente y ejecute las acciones de "Aprobar Propuesta" o "Desestimar Propuesta" con bloqueo preventivo si la sesión coincide con el proponente (Depende de: T037) (Cubre: RQF-039 [fase5-lester], FR-002, SC-003, US5; Responsable sugerido: Jorge)

---

## Phase 6: User Story 6 - Consulta de Historial y Reproducibilidad Determinista (Prioridad: P3) [F5 / F4]

**Meta**: Mantener un historial inmutable y auditable de versiones de umbrales y evaluaciones pasadas protegido por triggers SQLite, permitiendo reevaluar deterministamente al 100% casos históricos contra la versión con la que fueron evaluados originalmente (`SC-004`).  
**Criterio de Prueba Independiente**: Reevaluar un caso evaluado bajo versión 1 (donde aprobaba) contra una versión 2 vigente con umbrales más exigentes (donde deriva), comprobando que la reevaluación histórica contra versión 1 reproduce exactamente el dictamen y motivo original sin circularidad.

### Tests Unitarios e Integración (TDD: escribir primero, deben fallar)
- [ ] T039 [INFRA] [US6] [P] Escribir pruebas de integración fallidas de inmutabilidad e integridad referencial en `tests/integration/auditoria-inmutable.test.ts` verificando que los triggers SQLite `trg_prevent_update_*`, `trg_prevent_delete_*` y `trg_prevent_update_umbrales_cerrados` abortan con error cualquier intento de `UPDATE` o `DELETE` sobre evaluaciones, rastro de auditoría o versiones cerradas, y añadiendo aserción de que las FK están activas (insertar una evaluación con versión de umbrales inexistente debe fallar con error de clave foránea) (Cubre: RQF-036 [fase5-lester], RQF-013 [final-final], FR-004 soporte técnico, D-05; Responsable sugerido: Rodrigo)
- [ ] T040 [F4] [US6] [P] Escribir suite extra-funcional automatizada de reproducibilidad determinista al 100% en `tests/reproducibility/deterministic.test.ts` (`SC-004`), verificando que al reevaluar casos históricos contra su versión de umbrales archivada se reproduce idéntico score, decisión y motivo, incorporando aserción explícita de no-circularidad sobre `CASO-MED-001` evaluado con v2 (umbral 96 -> DERIVADO_REVISION) y reevaluado con v1 (umbral 90 -> APROBADO_AUTOMATICO) (Cubre: RQNF-002 [fase5-lester] ↔ RQNF-003 [final-final], FR-012, SC-004, Criterio C5; Responsable sugerido: Lester)

### Implementación
- [ ] T041 [F5] [US6] Implementar consulta de historial cronológico de versiones `obtenerHistorial()` en `src/backend/services/umbrales-service.ts` y endpoint `GET /api/umbrales/historial` en `src/backend/controllers/umbrales-controller.ts` y `src/backend/routes/umbrales-routes.ts` (Cubre: RQNF-002 [fase5-lester] ↔ RQNF-003 [final-final], FR-004, US6 / Esc. 6.1; Responsable sugerido: Rodrigo)
- [ ] T042 [F4] [US6] Implementar lógica de reevaluación histórica determinista `reevaluarCasoHistorico()` en `src/backend/services/evaluacion-engine.ts`, y endpoints `POST /api/evaluacion/reevaluar-historico` y `GET /api/evaluacion/historial` en `src/backend/controllers/evaluacion-controller.ts` y `src/backend/routes/evaluacion-routes.ts` (Cubre: RQNF-002 [fase5-lester] ↔ RQNF-003 [final-final], FR-012, SC-004, US6 / Esc. 6.2; Responsable sugerido: Rodrigo)
- [x] T043 [F5] [US6] [P] Implementar tabla de historial inmutable de versiones `src/frontend/components/umbrales/HistorialVersiones.tsx` listando cronológicamente versiones vigentes, pasadas y desestimadas con metadatos de proponente, aprobador, estado y fechas (Cubre: RQNF-002 [fase5-lester] ↔ RQNF-003 [final-final], FR-004, US6 / Esc. 6.1; Responsable sugerido: Jorge)
- [ ] T044 [F4] [US6] [P] Implementar vista de historial de dictámenes `src/frontend/components/evaluacion/HistorialEvaluaciones.tsx` desplegando casos calificados, versión aplicada y botón de reevaluación histórica determinista (Cubre: RQNF-002 [fase5-lester] ↔ RQNF-003 [final-final], FR-012, SC-004; Responsable sugerido: Jorge)

---

## Phase 7: Polish, Usabilidad (SC-005), E2E y Cierre de Calidad

**Propósito**: Verificación transversal de usabilidad (≤ 2 clics, ≤ 3 minutos), pruebas de integración extremo a extremo en navegador con Playwright, documentación para arranque limpio en `< 15 min` y matriz de trazabilidad canónica.

- [x] T045 [INFRA] [P] Implementar barra de navegación `src/frontend/components/common/Navbar.tsx` con accesos directos de navegación limpia entre "Evaluación de Casos (F4)" y "Gestión de Umbrales (F5)", garantizando acceso en ≤ 2 clics (Cubre: SC-005, Criterio C4; Responsable sugerido: Jorge)
- [ ] T046 [F5] [P] Implementar prueba de sistema E2E en Playwright `tests/e2e/doble-control-f5.spec.ts` validando el flujo completo de F5: login simulado Diseñador 1, creación de borrador v2, bloqueo de aprobación por Diseñador 1, conmutación a Administrador 1 y aprobación exitosa con entrada en vigencia (Cubre: RQF-039 [fase5-lester], FR-001, FR-002, SC-003, D-04, D-06; Responsable sugerido: Lester)
- [ ] T047 [F4] [P] Implementar prueba de sistema E2E en Playwright `tests/e2e/evaluacion-f4.spec.ts` validando la evaluación en navegador de los 6 casos sintéticos (`AC-1` a `AC-6`), verificando la correcta visualización del estado resolutivo, badges de motivo y la tarjeta de advertencia de riesgo alto (Cubre: RQF-040 [fase5-lester], RQF-023 [fase5-lester], RQF-041 [fase5-lester], RQF-004 [final-final], RQF-020 [fase5-lester], AC-1..AC-6, SC-001, SC-002; Responsable sugerido: Lester)
- [ ] T048 [INFRA] [P] Implementar prueba E2E automatizada de métrica de usabilidad en Playwright `tests/e2e/usabilidad-recorrido.spec.ts` (`SC-005`) midiendo que la consulta de configuración e historial toma ≤ 2 clics y que las tareas clave se ejecutan en ≤ 3 minutos (Cubre: SC-005, Criterios C4 y C5; Responsable sugerido: Lester)
- [ ] T049 [INFRA] [P] Redactar documentación de arranque y validación en `README.md` con instrucciones verificadas paso a paso para puesta en marcha en máquina limpia en menos de 15 minutos (`git clone`, `npm install`, `npm run db:seed`, `npm run dev`), conmutación de los 5 usuarios simulados y ejecución de tests (Cubre: Criterio C4, R-03; Responsable sugerido: Lester)
- [ ] T050 [INFRA] [P] Generar matriz de trazabilidad canónica de verificación en `docs/entregable2/matriz-trazabilidad-tareas.md` mapeando cada RQF [fuente], FR, AC y SC a sus tareas atómicas de implementación y suites de prueba automatizadas (Cubre: DEC-E2-02, DEC-E2-09, Principio V; Responsable sugerido: Lester)

---

## Dependencies & Execution Order

### Dependencias entre Fases

```
[Phase 0: Infraestructura Base, Sesión y Repositorio] (T001..T007, T031, T034, T037, T051)
         │
         ├───> [Phase 1: US1 - Precedencia Fraude / Señal Mínimo] (T008..T013)
         │              │
         │              └───> [Phase 2: US2 - Aprobación Automática / MVP] (T014..T019)
         │                             │ [T016 depende de T051]
         │                             └───> [Phase 3: US3 - Riesgo Alto / No Rechazo] (T020..T023)
         │
         └───> [Phase 4: US4 - Propuesta Umbrales Borrador] (T024..T030)
                        │ [T025 y T027 dependen de T034; T026 depende de T051; T030 depende de T037]
                        └───> [Phase 5: US5 - Doble Control y Aprobación] (T032, T033, T035, T036, T038)
                                       │ [T032 depende de T034; T038 depende de T037]
                                       └───> [Phase 6: US6 - Historial y Reproducibilidad] (T039..T044)
                                                      │
[Phase 7: Polish, Usabilidad SC-005, E2E y Cierre de Calidad] <───┘ (T045..T050)
```

1. **Phase 0 (Infraestructura, Sesión y Repositorio)**: Bloqueante para todo el equipo. Requiere T001 (Playwright config y scripts), T002 (Vite proxy), T003 (`[PLAN] - types.ts`), T004 (BD SQLite con PRAGMA foreign_keys = ON y schema idempotente), T005 (datos JSON y seed idempotente), T006 (Express modular con app separada de listen), T007 (Vite React), T031/T034 (sesión simulada backend dependiente de T006), T037 (selector de identidad frontend) y T051 (repositorio de umbrales dependiente de T004).
2. **Frente F4 (Evaluación)**: Puede ejecutarse en orden prioritario P1: US1 → US2 (MVP) → US3. T016 requiere T051 para obtener la versión vigente desde el repositorio.
3. **Frente F5 (Gestión de Umbrales)**: Puede ejecutarse en orden prioritario P2: US4 → US5 → US6. T025 y T027 requieren el middleware de sesión T034; T026 delega en T051; T032 requiere T034; T030 y T038 requieren el componente selector T037 (disponible desde Phase 0).
4. **Desacoplamiento Frontend/Backend**:
   - Jorge (Frontend) puede comenzar las tareas de UI (`T012`, `T013`, `T018`, `T019`, `T023`, `T028`, `T029`, `T030`, `T038`, `T043`, `T044`, `T045`) inmediatamente después de Phase 0 (habiendo completado T007 y T037), consumiendo los contratos estables de `contracts/` y `src/shared/types.ts`.
   - Rodrigo (Backend) implementa la persistencia, repositorio, servicios de cálculo y endpoints REST.
5. **Phase 7 (Polish y E2E)**: Requiere la integración completa de F4 y F5 para verificar flujos cruzados de doble control, evaluación de casos y usabilidad en navegador.

### Orden TDD dentro de cada Historia de Usuario
1. Se escriben primero las pruebas unitarias y de integración (`tests/unit/*`, `tests/integration/*`).
2. Se ejecuta la suite de pruebas y se comprueba que **fallan** (Red).
3. Se implementa la lógica de backend (servicios y controladores) y componentes de frontend.
4. Se ejecutan las pruebas hasta obtener **éxito total** (Green).
5. Se efectúa la refactorización y documentación de bitácora si corresponde.

### Camino Crítico del Proyecto

El camino crítico determina la duración mínima obligatoria para completar el incremento funcional integrado, calculado paso a paso con las duraciones estimadas de cada tarea secuencial:

- **Paso 1: Phase 0 (Infraestructura, BD con FK, semillas, Express modular, sesión simulada y repositorio)**
  - Tareas: `T001` (1.0h) + `T003` (1.0h) + `T004` (1.5h) + `T005` (1.0h) + `T006` (1.0h) + `T034` (1.5h) + `T037` (1.0h) + `T051` (1.0h)
  - Subtotal Paso 1: **9.0 horas** (acumulado: 9.0 horas)

- **Paso 2: US1 (Motor F4: precedencia de fraude y señales bajo mínimo)**
  - Tareas: `T008` (1.0h) + `T010` (1.5h) + `T011` (1.0h)
  - Subtotal Paso 2: **3.5 horas** (acumulado: 9.0 + 3.5 = 12.5 horas)

- **Paso 3: US2 (Motor F4: agregación ponderada y aprobación automática / MVP)**
  - Tareas: `T014` (1.0h) + `T016` (1.5h) + `T017` (1.0h)
  - Subtotal Paso 3: **3.5 horas** (acumulado: 12.5 + 3.5 = 16.0 horas)

- **Paso 4: US3 (Motor F4: cálculo de riesgo alto y garantía de cero rechazo)**
  - Tareas: `T020` (1.0h) + `T022` (1.5h)
  - Subtotal Paso 4: **2.5 horas** (acumulado: 16.0 + 2.5 = 18.5 horas)

- **Paso 5: US4 (Gestión F5: validación y persistencia de borradores con sesión activa)**
  - Tareas: `T024` (1.0h) + `T026` (1.5h) + `T027` (1.0h)
  - Subtotal Paso 5: **3.5 horas** (acumulado: 18.5 + 3.5 = 22.0 horas)

- **Paso 6: US5 (Gestión F5: doble control, bloqueo auto-aprobación y resolución formal)**
  - Tareas: `T032` (1.5h) + `T035` (1.5h) + `T036` (1.0h)
  - Subtotal Paso 6: **4.0 horas** (acumulado: 22.0 + 4.0 = 26.0 horas)

- **Paso 7: US6 (Historial y Reproducibilidad: triggers inmutables y consistencia histórica al 100%)**
  - Tareas: `T039` (1.0h) + `T040` (1.5h) + `T041` (1.0h) + `T042` (1.5h)
  - Subtotal Paso 7: **5.0 horas** (acumulado: 26.0 + 5.0 = 31.0 horas)

- **Paso 8: Phase 7 (Cierre: E2E Playwright, test de usabilidad SC-005 y README C4)**
  - Tareas: `T046` (1.5h) + `T047` (1.0h) + `T048` (1.5h) + `T049` (1.0h)
  - Subtotal Paso 8: **5.0 horas** (acumulado: 31.0 + 5.0 = 36.0 horas)

**Duración total estimada en ruta crítica**: **36.0 horas** de trabajo de ingeniería secuencial en el tronco principal.

> [!NOTE]
> Las duraciones son estimaciones de planificación; las tareas fuera del camino crítico no tienen estimación individual.

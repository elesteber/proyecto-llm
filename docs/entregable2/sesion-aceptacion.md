# Sesión formal de aceptación con el cliente (Compuerta 5)

Acta de la sesión de aceptación del incremento F5 + F4 de MIRA. Los resultados observados se contrastaron con el historial que guardó la API al cierre de la sesión (ver anexos de la sección 3).

## 1. Datos de la sesión

| Campo | Valor |
|-------|-------|
| Fecha | 2026-10-19 |
| Hora de inicio / término | 00:15 / 00:38 |
| Medio | Videollamada |
| Representante del Cliente | Rodrigo Guerrero |
| Demostración | Lester González |
| Acta | Lester González |
| Otros asistentes | Angel Salgado |
| Versión demostrada | `main` en el commit `b9f5f2d` |
| Preparación del entorno | `rm -f data/mira.db*` y `npm run db:seed` (base sembrada el 2026-10-18 a las 23:58); `npm run dev`; navegador |

**Declaración de rol:** Rodrigo Guerrero integra el equipo desarrollador (backend) y actúa como Representante del Cliente por asignación del taller. La aceptación se registra bajo ese rol.

## 2. Alcance

- Incluido: F5 (configuración de umbrales con doble control) y F4 (evaluación de casos por umbrales).
- Fuera de alcance de este incremento: la decisión final humana del Operador sobre casos derivados (`spec.md`, supuesto (f)) y el SLA numérico (H-11).

## 3. Escenarios demostrados

| # | Escenario | Pasos resumidos | Resultado esperado | Criterio | Resultado observado | Decisión |
|---|-----------|-----------------|--------------------|----------|---------------------|----------|
| 1 | Consultar la política vigente (F5) | Abrir la pestaña de umbrales | Se muestra la versión vigente (v1) | — | Se mostró la versión vigente al inicio de la sesión: versión 1, umbral de aprobación 90, cargada por el sistema. | Sí |
| 2 | Proponer una nueva versión (F5) | Como Diseñador 1, proponer un umbral de aprobación de 92 | Se crea un borrador con versión correlativa | — | Como Diseñador 1 se propuso la versión 2 con umbral de aprobación 92 (registro creado a las 00:19). | Sí |
| 3 | Doble control (F5) | Intentar aprobar el borrador como el mismo proponente; intentar proponer como Administrador | La auto-aprobación y la propuesta por Administrador son rechazadas | — | Se vio lo esperado: como Diseñador no deja aprobar la propuesta propia. La propuesta por Administrador y las respuestas 403 de la API están cubiertas por `tests/integration/umbrales-api.test.ts`. | Sí |
| 4 | Aprobación independiente (F5) | Cambiar a Administrador 1 y aprobar | La versión 2 entra en vigencia; la versión 1 queda en el historial | — | Con Administrador 1 se aprobó la versión 2 (resuelta a las 00:21). La versión 1 permanece en el historial. | Sí |
| 5 | Historial de versiones (F5) | Abrir el historial | Se listan las versiones; las cerradas no son modificables | — | El historial lista la versión 1 (carga inicial del sistema), la 2 (proponente Diseñador 1, aprobador Administrador 1) y la 3 (proponente Diseñador 1, aprobador Administrador 2, creada al final de la sesión, 00:38). La inmutabilidad se verifica con `tests/integration/auditoria-inmutable.test.ts`; el log de la sesión no registra intentos de modificación (sin PUT ni DELETE). | Sí |
| 6 | CASO-MED-001 (F4) | Evaluar el caso | `APROBADO_AUTOMATICO` (puntaje sobre el umbral) | AC-1 | Puntaje 94 con la versión 2 (umbral 92): `APROBADO_AUTOMATICO`, motivo `aprobado`, `riesgoAltoRechazo` falso. | Sí |
| 7 | CASO-MED-002 (F4) | Evaluar el caso | `DERIVADO_REVISION` por `senal_bajo_minimo` | AC-2 | Puntaje 91: `DERIVADO_REVISION` por `senal_bajo_minimo` (coherencia 55, bajo el mínimo de 60); el puntaje también queda bajo 92, pero prevalece la señal bajo mínimo. Se evaluó dos veces (00:24 y 00:28) con el mismo resultado. | Sí |
| 8 | CASO-MED-003 (F4) | Evaluar el caso | `DERIVADO_REVISION` por `alerta_fraude` (precede al resto) | AC-3 | Puntaje 94 con alerta de fraude activa: `DERIVADO_REVISION` por `alerta_fraude`, aunque el puntaje supera el umbral. | Sí |
| 9 | CASO-MED-004 y CASO-MED-006 (F4) | Evaluar ambos casos | `riesgoAltoRechazo` informativo, sin rechazo automático | AC-4 y AC-6 | CASO-MED-004: puntaje 44. CASO-MED-006: puntaje 40. Ambos `DERIVADO_REVISION` por `senal_bajo_minimo`, con `riesgoAltoRechazo` verdadero y sin resolución de rechazo. | Sí |
| 10 | CASO-MED-005 (F4) | Evaluar el caso | `DERIVADO_REVISION` por `puntaje_bajo_umbral` | AC-5 | Puntaje 75: `DERIVADO_REVISION` por `puntaje_bajo_umbral` (sin señales bajo el mínimo). | Sí |
| 11 | Reevaluación determinista (F4) | Reevaluar un registro del historial | Reproduce el dictamen original al 100% | SC-004 | Se vio lo esperado y se comparó el resultado con el original (el log registra 11 reevaluaciones, todas respondidas con éxito). | Sí |
| 12 | Regla transversal | Revisar todos los resultados anteriores | Ningún caso termina en rechazo automático | — | Los 7 registros de evaluación de la sesión son 1 `APROBADO_AUTOMATICO` y 6 `DERIVADO_REVISION`; ninguno termina en rechazo. | Sí |

Los IDs de la columna "Criterio" se tomaron de los títulos de las pruebas automatizadas correspondientes (matriz de trazabilidad, sección B); "—" indica que no se asignó un ID. Con la versión 2 (umbral 92) los resultados esperados de F4 no cambian respecto de la versión 1.

**Anexos (respuesta de la API al cierre de la sesión; las horas están en UTC, 3 horas más que la hora de Chile):**
- `docs/entregable2/evidencia/sesion-aceptacion-historial-evaluaciones.json`
- `docs/entregable2/evidencia/sesion-aceptacion-historial-umbrales.json`

## 4. Hallazgos de usabilidad comunicados al cliente

Se informó el resultado de la prueba con personas externas (`docs/entregable2/usabilidad.md`): SC-005 no se cumple en la dimensión manual; el defecto dominante es la descubribilidad de los menús y del selector de rol. Reacción del cliente:

> mi reaccion es que nececitan hacerlo mas responsivo y de mas intuitivo para la gente que no sea experta

## 5. Resultado de la sesión

- [x] Aceptado
- [ ] Aceptado con observaciones
- [ ] No aceptado

El Representante del Cliente registró observaciones de diseño durante la sesión (abajo). La categoría final (Aceptado o Aceptado con observaciones) la confirma él en el comentario del PR (sección 6).

**Observaciones del cliente (texto textual):**

> el tamaño de la puntuacion que se genera en la evaluacion es muy pequeña y es opacada por los demas textos. Hay mucha informacion en pantalla que no es relevante para lo que se va a realizar o aparece varias veces presentada, lo cual genera confusiones y hay algunas opciones que es necesario escrolear para encontrar lo cual puede confundir a los usuarios.

**Compromisos o acciones derivadas (propuestos; el equipo los decide el 2026-10-19 a las 10:00):**

| # | Acción | Responsable | Plazo |
|---|--------|-------------|-------|
| 1 | Aumentar el tamaño de la puntuación en el resultado de la evaluación y reducir el texto repetido | Jorge Alvarez (por confirmar) | Decisión del equipo el 2026-10-19 a las 10:00 |
| 2 | Evitar que opciones clave requieran scroll | Jorge Alvarez (por confirmar) | Idem |
| 3 | Hacer más visibles los menús y el selector de rol; instructivo inicial breve | Jorge Alvarez (por confirmar) | Idem |

Si alguna acción no se implementa antes de las 14:00 del 2026-10-19, se declara como defecto conocido en el informe.

## 6. Confirmación

La decisión de la sección 5 la confirma el Representante del Cliente (Rodrigo Guerrero) con un comentario en el PR que incorpora esta acta; el comentario se enlaza desde la descripción del PR.
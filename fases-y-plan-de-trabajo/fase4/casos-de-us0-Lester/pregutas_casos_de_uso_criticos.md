# Preguntas pendientes para el representante del cliente
### Consolidado de los 3 casos de uso críticos (Fase 4)

Estas preguntas surgieron al especificar en detalle los casos de uso — son más finas que las decisiones de negocio ya registradas en la bitácora de inconsistencias (HC-00X): asumen que la decisión de fondo ya se tomó, y preguntan por el detalle de implementación que esa decisión todavía no cubre.

## Del caso de uso 1 — Ingresar evidencia y encolar peticiones

| # | Pregunta | Decisión de la que depende |
|---|---|---|
| 1 | ¿Aplica el límite de llamadas por minuto (rate limit) también al flujo de integración por archivos/carpetas, o es exclusivo del flujo por API? | HC-003 / HC-013 |
| 2 | Si la integración es por intercambio de archivos (HC-013), ¿qué archivo de metadatos o convención de nombres acompañará la evidencia para identificar al emisor, dado que no hay respuesta inmediata? | HC-013 |
| 3 | Si ante exceso de límite el sistema termina rechazando las llamadas (en vez de encolarlas), ¿qué código HTTP u objeto de error debe devolver la API para que el sistema emisor sepa que debe reintentar? | HC-003 |
| 4 | En una carga masiva histórica (bulk), ¿existe un límite máximo de encolamiento seguro (timeout) que la plataforma deba respetar para no saturar su infraestructura? | — (nuevo, no depende de HC-003/013) |

## Del caso de uso 2 — Resolver caso derivado con intervención manual

| # | Pregunta | Decisión de la que depende |
|---|---|---|
| 5 | Cuando el operador "solicita antecedentes adicionales", ¿el caso queda retenido en la bandeja (congelando el tiempo de respuesta), se cierra temporalmente, o se devuelve al sistema core del cliente para que gestione el contacto con el asegurado? | — |
| 6 | Cuando el operador determina que la evidencia es una falsificación y lo manda a "investigación", ¿hacia qué módulo, estado o rol se envía el caso? ¿Existe una bandeja de segundo nivel especializada en fraude? | — |
| 7 | ¿Existe información histórica del asegurado (coberturas, topes, siniestros previos) que MIRA deba consultar e integrar visualmente en la bandeja, y que hoy no viaja adjunta en la evidencia? | — |

## Del caso de uso 3 — Facturación automatizada y validaciones útiles

| # | Pregunta | Decisión de la que depende |
|---|---|---|
| 8 | ¿Cómo debe proceder la automatización de la factura cuando el consumo del cliente entra en el tramo de "diez mil o más" validaciones, que hoy no tiene tarifa configurada? | HC (tramo sin precio — ver bitácora, tema de tramos de volumen) |
| 9 | Si prevalece la regla de "no se cobra lo que no se pudo procesar" (caso ilegible), ¿ese caso debe aparecer igual en el contador del cliente con costo $0 (para evidenciar el "servicio prestado" de detectar el error), o se oculta del panel de facturación por completo? | HC-004 (parcial) |

## Nota de alcance, no consolidada como pregunta

El caso de uso 1 no generó una extensión "5b" (rechazo de llamadas por exceso de límite) porque no existe ninguna entrada del inventario que respalde qué comportamiento exacto debería tener esa rama — quedó reflejada como la pregunta #3 de esta lista en vez de como una extensión inventada.

## Decisiones de negocio aún abiertas que afectan a estos 3 casos de uso (recordatorio, no son preguntas nuevas)

- **HC-003** — comportamiento del sistema ante exceso del límite de llamadas (rechazar vs. encolar).
- **HC-013** — arquitectura de integración real con el cliente piloto (API vs. intercambio de archivos).
- **HC-008** — si el rechazo automático bajo 60 puntos se mantiene o se elimina por exigencia de cumplimiento.
- **HC-004** — qué constituye una validación cobrable (solo automáticas, o también las derivadas a revisión humana).
- **HC-009** — si una reevaluación por evidencia nueva cuenta como una validación o como dos.

Estas cinco no son preguntas de detalle — son las decisiones de fondo que, una vez resueltas, van a determinar cuál de las variantes ya redactadas en cada caso de uso (marcadas con 🚩) se queda y cuál se descarta.
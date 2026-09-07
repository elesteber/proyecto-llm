# Set de pruebas funcionales (§5.3.4)

Verifica los requisitos funcionales priorizados como Must (`fase5/fase5-lester/requisitos_formato_final.md`), excluido RQF-013 por decisión del equipo (ver nota en el doc de fase). PF-043 a PF-045 cubren extensiones de los 3 casos de uso críticos cuyo RQF de origen no es Must — se incluyen igual porque el enunciado exige cobertura de al menos un flujo alternativo o de excepción por cada caso de uso detallado.

## A. Ingesta y aceptación de casos

| ID | Verifica | Precondición | Pasos | Resultado esperado |
| :--- | :--- | :--- | :--- | :--- |
| PF-001 | RQF-001 | El actor está autenticado en el punto de acceso de la plataforma. | Iniciar un caso enviando una carga con un archivo en formato PDF, imagen o video. | La plataforma acepta la carga y no la rechaza. |
| PF-002 | RQF-002 | Existe un flujo publicado con punto de acceso API habilitado. | Realizar una llamada HTTP POST al punto de acceso, adjuntando la evidencia en una sola llamada. | El sistema responde exitosamente y registra el caso a partir de esa única llamada. |
| PF-003 | RQF-003 | Cliente integrado por intercambio de archivos en carpeta compartida (H-13). | Depositar un archivo de evidencia en la carpeta designada. | El proceso interno captura el archivo automáticamente dentro de los 30 minutos siguientes al depósito. |
| PF-004 | RQF-004 | Cliente con límite de tasa configurado (100 llamadas/min en integración, 1000 en producción). | Simular 1001 peticiones en un minuto desde el mismo cliente. | El sistema detecta y marca el exceso en el registro interno. |
| PF-005 | RQF-005 | Igual a PF-004, con tráfico marcado como carga por lote (bulk). | Superar el límite de peticiones por minuto para una carga bulk declarada como tal. | Según H-03, la carga bulk se encola para procesarse después; no se pierde ningún caso. **[Cubre CU-1 ext. 5a]** |
| PF-006 | RQF-006 | Caso recién ingresado, evidencia aún no analizada. | Enviar un archivo PDF dañado o corrupto. | El caso se interrumpe antes de invocar los módulos de análisis, sin consumir recursos del motor. **[Cubre CU-1 ext. 6a]** |
| PF-007 | RQF-007 | Ninguna especial. | Crear dos casos consecutivos con evidencia idéntica. | Ambos casos reciben identificadores alfanuméricos distintos, que no cambian durante su ciclo de vida. |
| PF-008 | RQF-008 | Flujo configurado en modo asíncrono. | Enviar una petición vía API. | La respuesta de aceptación con el ID del caso llega de inmediato, sin esperar a que termine el análisis. |
| PF-043 | RQF-009 (Should) | Regla de resolución rápida configurada para el flujo. | Enviar una petición por API a un caso resoluble de forma síncrona. | La respuesta inmediata ya incluye el ID del caso, el puntaje, la decisión y el desglose de señales. **[Cubre CU-1 ext. 8a]** |

## B. Continuidad del caso

| ID | Verifica | Precondición | Pasos | Resultado esperado |
| :--- | :--- | :--- | :--- | :--- |
| PF-009 | RQF-010 | Existe un caso abierto con ID conocido. | Enviar un segundo documento referenciando el ID del caso abierto. | El archivo se adjunta al mismo caso y gatilla una reevaluación. **[Cubre CU-1 ext. 1a]** |
| PF-010 | RQF-011 | Existe un caso previamente cerrado. | Enviar nueva evidencia a un ID de caso resuelto y cerrado. | Se genera un nuevo ID de caso con referencia explícita al ID antiguo, sin alterar el caso original. **[Cubre CU-1 ext. 1b]** |

## C. Bandeja de revisión asistida

| ID | Verifica | Precondición | Pasos | Resultado esperado |
| :--- | :--- | :--- | :--- | :--- |
| PF-011 | RQF-015 | Caso derivado, operador en pantalla de inspección de evidencia. | Hacer clic en un dato extraído (ej. "Fecha de evento"). | El visor de documentos encuadra o hace zoom automáticamente sobre esa ubicación en el documento original. |
| PF-012 | RQF-016 | Caso derivado a revisión manual. | Abrir el expediente derivado. | Se muestra la frase textual que explica el motivo de derivación, no solo un código interno. |
| PF-013 | RQF-018 | Operador con caso abierto en bandeja. | Seleccionar la acción "Rechazar" y confirmar. | El caso cambia su estado a "Finalizado - Rechazado". |
| PF-014 | RQF-019 | Caso resuelto manualmente. | Cerrar el caso y consultar el log de auditoría. | Existe una fila inalterable que detalla usuario, fecha, decisión y motivo. |
| PF-015 | RQF-020 | Caso evaluado con puntaje bajo 60. | Procesar un caso que arroja 45 puntos. | Según H-08, el caso se escala obligatoriamente a un analista humano; no se ejecuta un rechazo automático. **[Cubre CU-2 ext. 1a]** |
| PF-044 | RQF-025 (Should) | Operador revisando evidencia de un caso derivado. | Seleccionar la clasificación "Falsificación comprobada" sobre la evidencia. | El expediente cambia a estado "En investigación" de fraude, saliendo del flujo normal de rechazo. **[Cubre CU-2 ext. 6b]** |

## D. Motor de decisión y umbrales

| ID | Verifica | Precondición | Pasos | Resultado esperado |
| :--- | :--- | :--- | :--- | :--- |
| PF-016 | RQF-021 | Dato extraído automáticamente con valor incorrecto. | El operador corrige un monto de 1000 a 100. | El registro conserva "valor original: 1000" y "valor corregido: 100", sin sobrescribir el dato original. **[Cubre CU-2 ext. 3a]** |
| PF-017 | RQF-022 | Módulo de análisis (ej. OCR) caído. | Abrir un caso derivado por indisponibilidad de ese módulo. | El botón "Aprobar" está deshabilitado y el sistema detalla la ausencia del módulo. **[Cubre CU-2 ext. 4a]** |
| PF-018 | RQF-023 | Caso con puntaje perfecto (100) y alerta de fraude activa en paralelo. | Procesar el caso. | El caso no se aprueba automáticamente; la alerta de fraude tiene precedencia sobre el puntaje. **[Cubre CU-2 ext. 4b]** |
| PF-019 | RQF-024 | Caso cuyo puntaje sugería fuertemente un rechazo. | Un operador aprueba manualmente ese caso. | El sistema etiqueta el caso como discrepancia para revisión algorítmica del equipo de modelos. **[Cubre CU-2 ext. 6a]** |
| PF-020 | RQF-040 | Caso sin señales de fraude; umbral de aprobación automática fijado en 90 puntos (H-01). | Inyectar un caso con puntaje evaluado por sobre 90. | El sistema aprueba el caso automáticamente sin asignarlo a la bandeja de un operador. |
| PF-021 | RQF-041 | Caso con puntaje perfecto (100) pero con una señal individual bajo su mínimo definido. | Procesar el caso. | El sistema deriva o rechaza el caso, ignorando el puntaje agregado. |

## E. Facturación y medición de consumo

| ID | Verifica | Precondición | Pasos | Resultado esperado |
| :--- | :--- | :--- | :--- | :--- |
| PF-022 | RQF-026 | Caso recién finalizado. | Consultar el caso en la base de datos. | El caso tiene un indicador booleano que determina si es cobrable. |
| PF-023 | RQF-027 | Caso finalizado en el escritorio de un analista humano. | Procesar el caso hasta su cierre derivado. | El indicador de cobro se aplica según H-04: se cobra solo cuando la plataforma resuelve el caso de forma automática. |
| PF-024 | RQF-028 | Usuario con rol cliente autenticado. | Ingresar al panel de consumo. | Existe un panel con la sumatoria de validaciones mensuales, actualizada tras cada operación. |
| PF-025 | RQF-029 | Usuario con rol comercial autenticado. | Comparar el dashboard comercial con el del cliente para el mismo período. | Montos, listados y desglose coinciden exactamente. |
| PF-026 | RQF-030 | Fin de mes de facturación. | Validar el cierre mensual del consumo. | El sistema consolida el total de casos cobrables y prepara los datos de facturación sin exportación manual a planillas. |
| PF-027 | RQF-031 | Falla de red simulada dentro del módulo de análisis. | Forzar que el caso reintente su procesamiento 3 veces por error interno. | El cliente visualiza un único caso cobrable, sin duplicar el cobro por los reintentos. **[Cubre CU-3 ext. 1a]** |
| PF-028 | RQF-032 | Existe un caso ya procesado y cerrado. | Procesar nueva evidencia sustantiva sobre el mismo ID de caso, forzando un reanálisis completo. | Según H-09, se cobra una segunda validación solo si la nueva evidencia gatilla un reanálisis completo; en caso contrario, el contador no se incrementa. **[Cubre CU-3 ext. 2a/2b]** |
| PF-029 | RQF-033 | Archivo adjunto ilegible o encriptado. | Cargar un PDF encriptado como evidencia del caso. | La validación queda registrada como intentada/rechazada, pero no incrementa el contador de cobro. **[Cubre CU-3 ext. 3a]** |
| PF-045 | RQF-034 (Won't, resuelto por H-16) | Cliente cuyo volumen mensual escala a 10.000 validaciones o más. | Consolidar el consumo mensual de un cliente con 12.000 validaciones. | Según H-16, se aplica el tramo fijo 5.000-15.000; sobre 15.000 el caso se marca para tarifa Enterprise a convenir, en vez de fallar por falta de precio. **[Cubre CU-3 ext. 7a]** |

## F. Auditoría, seguridad y cumplimiento

| ID | Verifica | Precondición | Pasos | Resultado esperado |
| :--- | :--- | :--- | :--- | :--- |
| PF-030 | RQF-035 | Solicitud válida de un titular de datos. | Emitir una solicitud de borrado de evidencia e información biométrica de ese titular. | El sistema ejecuta la acción definida por el área de cumplimiento (borrado o anonimización), separando el contenido personal del metadato inalterable de la decisión (H-12). |
| PF-031 | RQF-036 | Usuario con rol Administrador o personal DPRIME autenticado. | Intentar editar o eliminar un registro del rastro de auditoría. | El sistema rechaza la transacción con un error de permisos absolutos, sin excepción de rol. |
| PF-032 | RQF-038 | Cliente con autenticación SSO habilitada como requisito duro (H-06). | Un usuario del cliente intenta acceder a su bandeja. | El sistema valida las credenciales contra el directorio corporativo federado, sin requerir un segundo juego de contraseñas. |
| PF-033 | RQF-039 | Umbral de decisión configurado. | Un administrador ajusta el umbral y guarda el cambio. | El cambio queda pendiente, sin aplicarse, hasta que un segundo administrador distinto lo aprueba. |

## G. Integración, continuidad operacional y gobierno de flujos

| ID | Verifica | Precondición | Pasos | Resultado esperado |
| :--- | :--- | :--- | :--- | :--- |
| PF-034 | RQF-037 | Caso cerrado con resolución final. | Cerrar un caso y monitorear la sincronización hacia el sistema de siniestros del cliente. | Según H-07, el resultado se escribe automáticamente en el sistema del cliente por el mecanismo de intercambio de archivos, sin transcripción manual. |
| PF-035 | RQF-043 | Proveedor de modelo externo no disponible. | Simular un timeout de red hacia el proveedor del modelo. | El caso queda retenido en estado "en curso"; no se marca como fallido ni se pierde. |
| PF-036 | RQF-045 | Caso con discrepancia entre la corrección del operador y el puntaje algorítmico. | Un operador corrige un dato que cambia la decisión de aprobado a rechazado. | El sistema conserva la decisión del operador como resolución activa; el motor no la revierte. |
| PF-037 | RQF-046 | Caso con veredicto sugerido por la plataforma. | Un operador aprueba un caso que el sistema había sugerido rechazar. | El sistema anexa un flag interno que envía el caso a la cola de revisión y reentrenamiento del modelo. |
| PF-038 | RQF-047 | Caso previamente cerrado. | Enviar un documento nuevo apuntando al ID de un caso cerrado. | El caso original no se altera; se crea un nuevo ID relacionado con el histórico. |
| PF-039 | RQF-048 | Caso cerrado que recibe evidencia complementaria. | Procesar evidencia adicional forzando una reevaluación. | El motor se ejecuta nuevamente y el evento se registra en el panel de consumo conforme a la política de reevaluación (H-09). |
| PF-040 | RQF-049 | Flujo en edición sin módulo de análisis activo. | Intentar publicar el flujo en ese estado. | El sistema bloquea la publicación y mantiene el flujo en borrador. |
| PF-041 | RQF-050 | Caso iniciado bajo la versión vigente de un flujo (v1). | Publicar una nueva versión del flujo (v2) mientras el caso sigue en curso. | El caso finaliza utilizando exclusivamente los nodos y umbrales de la v1. |

## H. Gobernanza de datos y autorización

| ID | Verifica | Precondición | Pasos | Resultado esperado |
| :--- | :--- | :--- | :--- | :--- |
| PF-042 | RQF-051 | Cliente con autorización de uso de datos previamente otorgada. | El cliente revoca la autorización desde su panel. | El sistema excluye de inmediato los datos de ese cliente de cualquier pipeline de entrenamiento. |

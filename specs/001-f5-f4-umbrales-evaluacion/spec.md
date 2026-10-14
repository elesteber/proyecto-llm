# Feature Specification: Incremento Consolidado F5 (Configuración de Umbrales) + F4 (Evaluación de Casos y Decisión)

**Feature Identifier**: `001-f5-f4-umbrales-evaluacion`  
**Feature Branch**: `feat/spec-f5-f4`  
**Created**: 2026-10-14  
**Status**: Validated (Compuerta 2 Aprobada por Representante del Cliente el 2026-10-14)  
**Input**: Incremento conjunto F5 (Configuración de umbrales de decisión) y F4 (Evaluación de casos y decisión resolutiva) para el flujo de reembolso de gastos médicos de MIRA (DEC-E2-10(c), D-09).

---

## 1. Resumen Ejecutivo y Alcance del Incremento

### 1.1 Resumen
El presente documento constituye la especificación funcional única y consolidada (DEC-E2-10(c), D-09) para el desarrollo integrado de las funcionalidades **F5 (Gestión y Configuración de Umbrales de Decisión)** y **F4 (Evaluación Automatizada de Casos y Emisión de Decisión)** de la plataforma MIRA (DPRIME SpA), acotada al flujo de **reembolso de gastos médicos** de la aseguradora piloto (MIRA §5.2).

La relación funcional entre ambos componentes es estrictamente de productor a consumidor:
- **F5 (Productor):** Permite a los usuarios autorizados inspeccionar los umbrales vigentes, proponer modificaciones a los parámetros de evaluación (umbrales de aprobación, umbral de riesgo alto, ponderaciones y mínimos por señal) bajo un estado de borrador, y someterlos a un flujo de doble control donde un usuario con rol de administrador aprueba formalmente la propuesta, generando una nueva versión inmutable con trazabilidad auditable (DEC-E2-10(a)(d), D-03, D-04).
- **F4 (Consumidor):** Evalúa casos de reembolso médico aplicando deterministamente la versión aprobada y vigente de los umbrales provista por F5, emitiendo una resolución oficial bajo únicamente dos estados posibles (`APROBADO_AUTOMATICO` o `DERIVADO_REVISION`), junto con el motivo técnico de la decisión, el puntaje global ponderado, el desglose de aportes de cada señal y una advertencia informativa de riesgo alto cuando corresponda (DEC-08, DEC-E2-06, DEC-E2-10(b)).

### 1.2 Alcance Incluido
1. **Gestión de Umbrales (F5):**
   - Visualización de la configuración paramétrica vigente (umbral de aprobación, umbral de riesgo alto, mínimos por señal y ponderaciones).
   - Creación de propuestas de cambio de parámetros en estado borrador por parte de un Diseñador.
   - Flujo de doble control y separación de funciones: aprobación formal obligatoria por parte de un Administrador distinto del proponente para que la versión entre en vigencia.
   - Historial cronológico inmutable de versiones de umbrales con registro de proponente, aprobador, marca temporal y estado.
   - Validación estricta de reglas numéricas: suma de pesos exactamente igual a 1,00; valores de mínimos y umbrales acotados entre 0 y 100.
2. **Evaluación de Casos y Decisión (F4):**
   - Evaluación determinista de casos de reembolso médico aplicando la versión vigente de umbrales.
   - Secuencia obligatoria de evaluación de cuatro pasos: fraude → señales bajo mínimo → umbral de aprobación → derivación general.
   - Emisión de resolución con estados estrictos (`APROBADO_AUTOMATICO` o `DERIVADO_REVISION`) y motivos exhaustivos (`aprobado`, `alerta_fraude`, `senal_bajo_minimo`, `puntaje_bajo_umbral`).
   - Señalización informativa de advertencia de riesgo alto de rechazo para el operador, sin alterar la decisión de derivación ni emitir jamás un rechazo automático por parte del sistema.
   - Reevaluación histórica determinista: capacidad de reproducir al 100% el resultado de una evaluación pasada utilizando la versión de umbrales con la que fue originalmente evaluada (RQNF-002 [fase5-lester]).

### 1.3 Alcance Excluido (Fuera de Alcance)
1. **Motor Multimodal Real de Inteligencia Artificial:** Conforme a las bases del proyecto (§4.3) y a la decisión D-02, el motor de inteligencia artificial no se construye en este incremento. La evaluación opera sobre casos de prueba sintéticos controlados que contienen señales numéricas y banderas ya calculadas y estandarizadas.
2. **Datos Reales de Asegurados o Siniestros:** Queda estrictamente prohibido el uso o ingesta de información médica, nombres o pólizas reales (R-10). Se emplean exclusivamente expedientes y datos sintéticos ficticios en el dominio de reembolso médico.
3. **Integraciones Externas:** Bypasses, conexiones a sistemas legados de aseguradoras, validadores de firmas digitales externos o pasarelas de pago de reembolsos.
4. **Flujos Distintos a Reembolso Médico:** Procesos de indemnización por siniestros vehiculares, seguros de vida, seguros de cesantía o fraudes corporativos complejos.

---

## Clarifications

### Session 2026-10-14
- Q: ¿Qué valores normativos de mínimos individuales y ponderaciones relativas por señal regirán formalmente para el flujo de reembolso de gastos médicos durante la marcha blanca? (RQF-041 [fase5-lester], RQF-044 [final-final]) → A: Opción A ratificada por el Representante del Cliente (bajo auditoría de Lester y Jorge): Autenticidad (mín. 70, peso 0.40), Cruce de fuentes (mín. 70, peso 0.40) y Coherencia de solicitud (mín. 60, peso 0.20), con suma exacta de pesos = 1.00. La bandera de fraude (`alertaFraudeActiva`) se mantiene como variable booleana independiente (cierra formalmente el hallazgo H-05 / DEC-05 / D-07 / D-08).
- Q: ¿Qué conjunto exacto de identidades preconfiguradas debe incluir el selector de sesión para validar la segregación de funciones y qué ciclo de vida rige para una propuesta en borrador? (RQF-039 [fase5-lester], RQF-035 [final-final], PF-033) → A: Opción A ratificada por el Representante del Cliente (bajo auditoría de Lester y Jorge): 5 identidades fijas en barra superior (`Diseñador 1`, `Diseñador 2`, `Administrador 1`, `Administrador 2`, `Operador 1`). Máximo 1 borrador activo por flujo a la vez. Un Administrador distinto al autor puede Aprobar (promueve a vigente inmutable incrementando versión según D-03) o Desestimar (descarta propuesta), con registro inalterable en auditoría (cierra H-06 / H-12 / D-04 / D-05 / PF-033).
- Q: ¿Debe el sistema en F5 validar obligatoriamente que el umbral de aprobación sea estrictamente mayor que el umbral de riesgo alto (`umbralAprobacion > umbralRiesgoAlto`), y qué comportamiento resolutivo rige si el puntaje global cae bajo este último? (`RQF-020 [fase5-lester]`, `RQF-044 [final-final]`, `DEC-08`, `DEC-E2-10(b)`) → A: Opción A ratificada por el Representante del Cliente (bajo auditoría de Lester y Jorge): F5 exige obligatoriamente la regla `umbralAprobacion > umbralRiesgoAlto` (por defecto 90 > 60), impidiendo rangos invertidos o solapados y preservando el rango de derivación ordinaria (60 a 89.9 puntos). En F4, si `scoreGlobal < umbralRiesgoAlto`, el sistema resuelve obligatoriamente `decision: 'DERIVADO_REVISION'` con `motivo: 'senal_bajo_minimo'` y activa la etiqueta visual de prioridad crítica `riesgoAltoRechazo: true`, garantizando cero rechazos automáticos (cierra consulta de clarificación de §3.2, H-08 / DEC-08 / RQF-020 [fase5-lester] / DEC-E2-10(b)).
- Q: ¿Ratifica el Representante del Cliente que para la Entrega 2 no rige ningún SLA de latencia o tiempo de respuesta como requisito vinculante, concentrando la prueba extra-funcional obligatoria exclusivamente en la reproducibilidad determinista al 100%? (`H-11`, `DEC-E2-05`, `RQNF-002 [fase5-lester]`) → A: Opción A ratificada por el Representante del Cliente (bajo auditoría de Lester y Jorge): No existe SLA contractual vinculante de latencia en la Entrega 2; la herramienta k6 se conserva únicamente como línea base exploratoria opcional (DEC-E2-05). La prueba extra-funcional obligatoria y medible para el criterio C5 se concentra al 100% en la reproducibilidad determinista histórica de decisiones sobre versiones archivadas en SQLite (`tests/reproducibility/deterministic.test.ts`, AC-6, H-14 / DEC-14 / RQNF-002 [fase5-lester] / RQNF-003 [final-final]).
- Q: ¿Qué criterio cuantitativo de éxito medible debe regir para la facilidad operativa de consulta en la interfaz (`SC-005`) durante la prueba de usabilidad externa y la sesión formal de aceptación con el cliente? (`SC-005`, Compuerta 5, Compuerta 6) → A: Opción A ratificada por el Representante del Cliente (bajo auditoría de Lester y Jorge): Acceso a la consulta de umbrales vigentes e historial inmutable en F5 y evaluación/desglose de casos en F4 accesible en ≤ 2 clics desde el menú principal (operable 100% desde navegador sin base de datos ni devtools). Tiempo de ejecución de tareas clave (inspeccionar/evaluar caso o proponer/aprobar borrador) ≤ 3 minutos por un evaluador sin inducción previa (cierra formalmente SC-005 para Compuerta 5 y Compuerta 6).

---

## 2. Actores del Sistema

| Actor | Rol y Responsabilidades | Permisos Clave en el Sistema |
| :--- | :--- | :--- |
| **Diseñador** | Usuario especialista en diseño de políticas de suscripción y reglas de negocio (MIRA §2.13). Responsable de ajustar los umbrales de decisión, mínimos por señal y ponderaciones del flujo según directrices del área de riesgo. | - Consulta de versión vigente e historial.<br>- Creación y modificación de propuestas de umbrales en estado `BORRADOR` (máximo un borrador activo por flujo).<br>- Envío de borradores a revisión administrativa.<br>- *Restricción:* No puede auto-aprobar sus propias propuestas. |
| **Administrador** | Usuario con máxima atribución operativa sobre la gobernanza de parámetros de la plataforma (MIRA §2.13, PF-033, DEC-E2-10(d)). Responsable de auditar y autorizar formalmente las políticas propuestas. | - Consulta de versión vigente e historial.<br>- Aprobación o desestimación formal de propuestas en estado `BORRADOR`.<br>- Promoción de la versión a estado `APROBADO` (entrada en vigencia inmediata e incremento autonumérico de versión).<br>- *Restricción:* Solo puede aprobar o desestimar propuestas creadas por un usuario distinto. |
| **Operador** | Analista humano de liquidación de reembolsos que atiende los casos derivados a revisión manual en la bandeja de trabajo (MIRA §2.6, ENT6 [00:04:06]). | - Visualización de casos evaluados.<br>- Inspección de decisión emitida, motivo técnico, puntaje global y desglose por señales.<br>- Recepción y visualización de la advertencia informativa de riesgo alto para apoyar su deliberación humana. |
| **Representante del Cliente** | Rodrigo Guerrero (integrante del equipo que actúa como representante del cliente en la Entrega 2; DEC-E2-07, DEC-E2-10). | - Validador de criterios de aceptación y confirmación de supuestos de negocio durante la fase de clarificación. |

---

## 3. Reglas de Negocio del Dominio (Invariantes Constitucionales)

### RN-01: Prohibición Absoluta de Rechazo Automático (NO NEGOCIABLE)
- **Principio Fundamental:** *"El sistema nunca rechaza automáticamente un caso; el máximo efecto es derivarlo, con advertencia de riesgo alto cuando corresponda"* (Citas: `DEC-08`, `DEC-E2-06`, `DEC-E2-10(b)`; Daniela Cortés en ENT6 [00:04:06]).
- **Lenguaje Prohibido en UI y Código:** La interfaz de usuario y los mensajes del sistema jamás presentarán como decisión del sistema un "rechazado", "rechazo automático" o término equivalente (`DEC-E2-10(b)`, §3.1).
- **Decisiones Resolutivas Permitidas:** El sistema emite estricta y únicamente dos decisiones de salida:
  1. `APROBADO_AUTOMATICO`: El caso aprueba sin intervención humana por cumplir holgadamente todos los criterios de puntaje y consistencia.
  2. `DERIVADO_REVISION`: El caso es remitido obligatoriamente a la bandeja del operador humano para su deliberación asistida.
- **Motivos Técnicos de Decisión:** Toda resolución emitida debe justificar técnicamente su salida con exactamente uno de cuatro motivos:
  - `'aprobado'`: Cumplió puntaje mayor o igual al umbral de aprobación sin alertas ni caídas bajo mínimo.
  - `'alerta_fraude'`: Presenta bandera de alerta de fraude activa.
  - `'senal_bajo_minimo'`: Al menos una señal individual no alcanzó su umbral mínimo propio.
  - `'puntaje_bajo_umbral'`: El puntaje ponderado global no alcanzó el umbral de aprobación automática, sin registrar fraude ni caídas bajo mínimos individuales.

### RN-02: Advertencia Informativa de Riesgo Alto de Rechazo
- **Naturaleza Informativa:** El sistema calcula un indicador booleano de riesgo (`riesgoAltoRechazo`). Es estrictamente una señal visual informativa destinada a advertir al operador humano en su interfaz y **bajo ninguna circunstancia altera la decisión** (`decision` se mantiene inalterablemente como `DERIVADO_REVISION`) (`DEC-08`, `DEC-E2-10(b)`).
- **Condición Lógica de Activación:** Se activa en verdadero (`riesgoAltoRechazo = true`) si y solo si se cumple al menos una de las dos condiciones siguientes:
  1. Existen dos o más señales individuales bajo su respectivo umbral mínimo propio (`conteo(señales bajo mínimo) >= 2`), **O**
  2. El puntaje global ponderado es estrictamente menor que el umbral de riesgo alto configurado (`scoreGlobal < umbralRiesgoAlto`, fijado por defecto en 60).
- **Texto de Advertencia:** Cuando el indicador sea verdadero, la interfaz exhibe de forma destacada el texto: *"Riesgo alto de rechazo: decide un operador"*.

### RN-03: Señales de Evaluación, Ponderaciones y Puntaje Global
- **Señales del Dominio de Reembolso Médico:** Para cada caso sintético se consideran tres señales analíticas continuas (acotadas de 0 a 100) y una bandera independiente de fraude (`DEC-E2-10(a)`, MIRA §2.6, ENT3 [00:21:47]):
  1. `autenticidad_documentos`: Calificación de autenticidad documental y no adulteración (Ponderación por defecto: 0,40; Mínimo propio por defecto: 70) `[SUPUESTO del equipo]`.
  2. `cruce_fuentes`: Concordancia de datos entre prestador, boleta y afiliado (Ponderación por defecto: 0,40; Mínimo propio por defecto: 70) `[SUPUESTO del equipo]`.
  3. `coherencia_solicitud`: Coherencia y consistencia de la prestación médica solicitada (Ponderación por defecto: 0,20; Mínimo propio por defecto: 60) `[SUPUESTO del equipo]`.
  4. `alertaFraudeActiva`: Indicador booleano independiente que señala sospecha fundada o detección de anomalía de fraude (MIRA §3). No forma parte de la suma ponderada continua.
- **Fórmula de Agregación del Puntaje Global:**
  Puntaje Global = (0,40 * autenticidad_documentos) + (0,40 * cruce_fuentes) + (0,20 * coherencia_solicitud)
  *(Regla de precisión: el motor de evaluación realiza todas las comparaciones de umbrales y reglas utilizando el puntaje con precisión decimal completa SIN redondear; el redondeo a un decimal es exclusivamente para propósitos de visualización en la interfaz [SUPUESTO del equipo]).*

### RN-04: Orden Secuencial Determinista y Precedencia del Motor (F4)
El motor de evaluación evalúa las condiciones de negocio en un orden secuencial fijo e inalterable (§3.1, §5.2, DEC-01, DEC-E2-06, DEC-E2-10):
1. **Paso 1 (Precedencia de Fraude):** Si `alertaFraudeActiva` es verdadera, el sistema resuelve inmediatamente `decision = DERIVADO_REVISION` con `motivo = 'alerta_fraude'`, con máxima jerarquía e ignorando cualquier puntaje obtenido (MIRA §3, PF-018).
2. **Paso 2 (Precedencia de Señal Bajo Mínimo):** Si al menos una señal individual no alcanza su mínimo propio respectivo, el sistema resuelve `decision = DERIVADO_REVISION` con `motivo = 'senal_bajo_minimo'`, con precedencia sobre el puntaje global ponderado (H-05, D-07, DEC-E2-10(a)).
3. **Paso 3 (Aprobación Automática):** Si no hay fraude ni señales bajo mínimo, y el puntaje global es mayor o igual al umbral de aprobación vigente (`Puntaje Global >= umbralAprobacion`, fijado en 90 por defecto; DEC-01, PF-020), el sistema resuelve `decision = APROBADO_AUTOMATICO` con `motivo = 'aprobado'`.
4. **Paso 4 (Derivación por Puntaje Bajo Umbral):** En cualquier otro caso (puntaje global inferior a 90 sin fraude ni señales bajo mínimo, con los valores por defecto), el sistema resuelve `decision = DERIVADO_REVISION` con `motivo = 'puntaje_bajo_umbral'`.
- **Jerarquía de Precedencia:** En caso de concurrencia de causas de derivación, la jerarquía de asignación de motivo es: `alerta_fraude` > `senal_bajo_minimo` > `puntaje_bajo_umbral`.

### RN-05: Protocolo de Doble Control y Versionamiento Inmutable (F5)
- **Separación Obligatoria de Funciones:** Ningún usuario puede aprobar una propuesta de umbrales que haya sido creada por él mismo (`RQF-039 [fase5-lester]`, MIRA §2.13, ENT6 [00:21:16], PF-033, DEC-E2-10(d)):
  - Un usuario con rol Diseñador crea la propuesta (estado `BORRADOR`).
  - Un usuario con rol Administrador distinto al Diseñador proponente aprueba la propuesta (transiciona a estado `APROBADO`).
- **Inmutabilidad y Versionamiento:**
  - Toda aprobación formal genera una nueva versión inmutable con identificador autonumérico ascendente (`version`), fecha y hora, identificación del proponente y del aprobador.
  - Las versiones históricas son de solo lectura; queda prohibida su modificación o eliminación directa (D-03, RQNF-002 [fase5-lester]).
  - En cualquier momento existe exactamente una sola versión activa en estado `APROBADO` para el flujo de reembolso médico.

### RN-06: Validaciones de Integridad Paramétrica (F5)
Al proponer un cambio en los parámetros de umbral, el sistema valida obligatoriamente:
1. **Suma de Ponderaciones:** La suma de los tres pesos debe ser exactamente igual a 1,00 (0,40 + 0,40 + 0,20 = 1,00), con cada peso individual acotado entre 0,00 y 1,00 (0,00 <= peso <= 1,00).
2. **Límites de Umbrales y Mínimos:** Todos los umbrales de corte (`umbralAprobacion`, `umbralRiesgoAlto`) y mínimos individuales por señal (`minimoAutenticidad`, `minimoCruceFuentes`, `minimoCoherencia`) deben ser números dentro del rango inclusivo de 0 a 100 (0 <= x <= 100).
3. **Consistencia de Corte:** El umbral de aprobación debe ser estrictamente mayor que el umbral de riesgo alto (`umbralAprobacion > umbralRiesgoAlto`, por defecto 90 > 60), impidiendo rangos invertidos o solapados y preservando el rango de derivación ordinaria (ratificado por el Representante del Cliente el 2026-10-14).

### RN-07: Reproducibilidad Determinista Histórica (RQNF-002)
- Reevaluar un caso registrado en el historial contra la versión específica de umbrales con la que fue evaluado originalmente debe producir con un 100% de consistencia el mismo puntaje global, la misma decisión, el mismo motivo técnico y el mismo estado de riesgo alto (`RQNF-002 [fase5-lester]`, DEC-14, H-14).

---

## 4. User Scenarios & Testing *(mandatory)*

### User Story 1 - Evaluación de Caso y Derivación por Precedencia de Fraude o Señal Bajo Mínimo (Prioridad: P1)
*Como Operador de liquidación de reembolsos médicos, deseo que el sistema evalúe automáticamente los expedientes derivando a revisión aquellos con alertas de fraude o deficiencias críticas por señal, para priorizar la seguridad del proceso y evitar pagos indebidos.*

- **Por qué esta prioridad:** La contención del fraude y la detección de documentos inconsistentes son las mayores fuentes de riesgo financiero y legal de la aseguradora (MIRA §3, ENT6 [00:04:06]).
- **Prueba Independiente:** Inyectar un caso con alerta de fraude activa o con señal bajo mínimo y verificar que el sistema emite `DERIVADO_REVISION` con su motivo correspondiente, sin aprobar automáticamente aun si el puntaje supera 90.

#### Escenarios de Aceptación:
1. **Escenario 1.1: Precedencia de fraude sobre puntaje excelente (CASO-MED-003)**
   - **Dado** que la versión vigente de umbrales establece aprobación en 90 y mínimo de señales en 70/70/60,
   - **Cuando** se evalúa un caso (`CASO-MED-003`) con autenticidad = 95, cruce = 95, coherencia = 90 (puntaje ponderado = 94.0 ≥ 90) y `alertaFraudeActiva = true`,
   - **Entonces** el sistema resuelve `decision: 'DERIVADO_REVISION'`, `motivo: 'alerta_fraude'`, `riesgoAltoRechazo: false`, indicando que la alerta de fraude tiene precedencia absoluta sobre el puntaje global.
2. **Escenario 1.2: Derivación por señal individual bajo mínimo con puntaje aprobatorio (CASO-MED-002)**
   - **Dado** que la versión vigente exige un mínimo de coherencia = 60 y umbral de aprobación = 90,
   - **Cuando** se evalúa un caso (`CASO-MED-002`) con autenticidad = 100, cruce = 100 y coherencia = 55 (puntaje ponderado = 91.0 ≥ 90) sin alerta de fraude,
   - **Entonces** el sistema resuelve `decision: 'DERIVADO_REVISION'`, `motivo: 'senal_bajo_minimo'`, `riesgoAltoRechazo: false`, identificando a `coherencia` como la señal en falta.

---

### User Story 2 - Aprobación Automática de Casos Cumplidores sin Fraude (Prioridad: P1)
*Como Operador de reembolsos, deseo que los casos que cumplen holgadamente todos los criterios de calidad y superan el umbral exigido aprueben automáticamente sin fricción humana, para acelerar la liquidación de reembolsos legítimos.*

- **Por qué esta prioridad:** Constituye el valor central de productividad de MIRA, automatizando las liquidaciones directas según la exigencia del cliente piloto (ENT4 [00:11:06], DEC-01).
- **Prueba Independiente:** Evaluar un expediente sintético con todas las señales sobre sus mínimos y puntaje global ≥ 90, verificando la resolución de aprobación inmediata.

#### Escenarios de Aceptación:
1. **Escenario 2.1: Aprobación automática holgada (CASO-MED-001)**
   - **Dado** que el umbral de aprobación vigente es 90 y los mínimos son 70/70/60,
   - **Cuando** se evalúa un caso (`CASO-MED-001`) con autenticidad = 95, cruce = 95, coherencia = 90 (puntaje = 94.0 ≥ 90) sin fraude,
   - **Entonces** el sistema resuelve `decision: 'APROBADO_AUTOMATICO'`, `motivo: 'aprobado'`, `riesgoAltoRechazo: false` y desglosa los componentes de puntaje.
2. **Escenario 2.2: Aprobación automática en el límite exacto del umbral**
   - **Dado** que el umbral de aprobación vigente es exactamente 90.0 puntos,
   - **Cuando** se evalúa un caso con puntaje global ponderado exactamente igual a 90.0, sin fraude y con todas las señales sobre sus mínimos,
   - **Entonces** el sistema resuelve `decision: 'APROBADO_AUTOMATICO'` con `motivo: 'aprobado'`, aplicando el criterio inclusivo `scoreGlobal >= umbralAprobacion` (DEC-01).

---

### User Story 3 - Señalización de Advertencia de Riesgo Alto sin Rechazo Automático (Prioridad: P1)
*Como Operador en bandeja de revisión asistida, deseo visualizar una advertencia clara cuando un caso derivado presente alto riesgo de rechazo, para examinar la evidencia con rigor pero manteniendo siempre la facultad indelegable de la decisión humana.*

- **Por qué esta prioridad:** Salvaguarda el principio no negociable RN-01 (`DEC-08`, `DEC-E2-10(b)`, ENT6 [00:04:06]), eliminando el rechazo automático e impidiendo que el software tome decisiones desfavorables autónomas.
- **Prueba Independiente:** Procesar casos con puntaje menor a 60 o múltiples señales bajo mínimo y constatar que el sistema emite `DERIVADO_REVISION` activando el mensaje informativo sin usar jamás la palabra "rechazado" para calificar la decisión.

#### Escenarios de Aceptación:
1. **Escenario 3.1: Derivación con advertencia por puntaje crítico y dos señales bajo mínimo (CASO-MED-004)**
   - **Dado** que `umbralRiesgoAlto` está configurado en 60,
   - **Cuando** se evalúa un caso (`CASO-MED-004`) con autenticidad = 40 (< 70), cruce = 40 (< 70) y coherencia = 60 (puntaje = 44.0 < 60) sin fraude,
   - **Entonces** el sistema resuelve `decision: 'DERIVADO_REVISION'`, `motivo: 'senal_bajo_minimo'`, activa `riesgoAltoRechazo: true` y despliega la advertencia *"Riesgo alto de rechazo: decide un operador"*, sin presentar la decisión como rechazo.
2. **Escenario 3.2: Derivación con advertencia por puntaje crítico con una sola señal bajo mínimo (CASO-MED-006)**
   - **Dado** que el umbral de riesgo alto es 60,
   - **Cuando** se evalúa un caso (`CASO-MED-006`) con autenticidad = 0 (< 70), cruce = 70 y coherencia = 60 (puntaje ponderado = 40.0 < 60),
   - **Entonces** el sistema resuelve `decision: 'DERIVADO_REVISION'`, `motivo: 'senal_bajo_minimo'`, y activa `riesgoAltoRechazo: true` debido a que el puntaje es estrictamente inferior a 60.

---

### User Story 4 - Gestión y Propuesta de Modificación de Umbrales en Borrador (Prioridad: P2)
*Como Diseñador de políticas, deseo consultar la configuración de umbrales vigente y preparar propuestas de ajuste en modo borrador, para modelar los parámetros de riesgo sin alterar de inmediato la operación del motor.*

- **Por qué esta prioridad:** Permite adaptar el sistema a nuevas directrices de riesgo sin comprometer la estabilidad operativa (F5, MIRA §2.13).
- **Prueba Independiente:** Ingresar como Diseñador, modificar los valores de umbrales y verificar que la propuesta queda guardada en estado `BORRADOR` mientras que el motor continúa evaluando con la versión anterior activa.

#### Escenarios de Aceptación:
1. **Escenario 4.1: Creación exitosa de propuesta en borrador**
   - **Dado** que un usuario con rol Diseñador accede al panel de umbrales,
   - **Cuando** ingresa nuevos parámetros válidos (pesos sumando 1,00 y valores entre 0 y 100) y envía la propuesta,
   - **Entonces** el sistema registra la propuesta en estado `BORRADOR`, almacena la identidad del proponente y no altera la versión vigente de evaluación.
2. **Escenario 4.2: Bloqueo de propuesta con suma de ponderaciones inválida**
   - **Dado** que el Diseñador ingresa pesos de 0,50, 0,40 y 0,20 (suma = 1,10),
   - **Cuando** intenta guardar la propuesta,
   - **Entonces** el sistema bloquea el guardado, emite una alerta indicando que *"La suma de las ponderaciones debe ser exactamente 1,00"* y mantiene el formulario en edición.

---

### User Story 5 - Flujo de Doble Control y Aprobación de Nuevas Versiones (Prioridad: P2)
*Como Administrador del sistema, deseo auditar las propuestas de umbrales en borrador elaboradas por los diseñadores y aprobarlas formalmente, para que entren en vigencia operativa bajo estricta separación de funciones.*

- **Por qué esta prioridad:** La gobernanza corporativa y las regulaciones de seguros exigen segregación de roles en la alteración de reglas de decisión (RQF-039 [fase5-lester], ENT6 [00:21:16], PF-033).
- **Prueba Independiente:** Intentar aprobar una propuesta con el mismo usuario proponente (verificar rechazo) y luego aprobar con un Administrador diferente (verificar entrada en vigencia e incremento de versión).

#### Escenarios de Aceptación:
1. **Escenario 5.1: Bloqueo de auto-aprobación por el mismo usuario**
   - **Dado** que existe una propuesta en estado `BORRADOR` creada por el usuario "Diseñador 1",
   - **Cuando** el usuario "Diseñador 1" (o un usuario con el mismo identificador) intenta ejecutar la acción de aprobación,
   - **Entonces** el sistema bloquea la acción y emite el mensaje *"El usuario que propone un cambio no puede aprobarlo; se requiere un aprobador independiente"*.
2. **Escenario 5.2: Aprobación formal por un Administrador independiente**
   - **Dado** que existe una propuesta en borrador creada por "Diseñador 1",
   - **Cuando** el usuario "Administrador 1" (distinto al proponente) aprueba la propuesta,
   - **Entonces** el sistema actualiza el estado a `APROBADO`, incrementa el número de versión (ej. de 1 a 2), registra el usuario aprobador, la fecha/hora de vigencia, y a partir de ese instante F4 evalúa todos los nuevos casos con la nueva versión.

---

### User Story 6 - Consulta de Historial y Reproducibilidad Determinista (Prioridad: P3)
*Como Administrador, deseo inspeccionar el histórico inmutable de versiones de umbrales y reevaluar casos pasados, para garantizar la total trazabilidad y reproducibilidad de las decisiones tomadas.*

- **Por qué esta prioridad:** Requisito no funcional regulatorio indispensable para auditoría y defensa ante reclamos (RQNF-002 [fase5-lester], DEC-14, H-14).
- **Prueba Independiente:** Consultar el histórico de versiones y ejecutar la reevaluación de un caso histórico contra su versión de origen, verificando 100% de consistencia decisional.

#### Escenarios de Aceptación:
1. **Escenario 6.1: Consulta del historial cronológico de versiones**
   - **Dado** que se han aprobado múltiples versiones de umbrales a lo largo del tiempo,
   - **Cuando** un usuario consulta el historial de versiones,
   - **Entonces** el sistema lista todas las versiones pasadas y la actual en orden cronológico, detallando número de versión, fecha de aprobación, usuario proponente, usuario aprobador y estado.
2. **Escenario 6.2: Reproducibilidad determinista de decisiones históricas**
   - **Dado** un caso evaluado originalmente bajo la versión de umbrales 1, habiendo actualmente una versión 2 vigente con umbrales distintos,
   - **Cuando** el Administrador solicita la reevaluación del caso contra la versión 1,
   - **Entonces** el sistema reproduce de forma exacta e idéntica el puntaje, la decisión, el motivo y las banderas originales (100% determinismo).

---

### Edge Cases (Casos Límite y Manejo de Errores)

1. **Puntaje Global Exactamente en Umbral de Aprobación (90.0 puntos):**
   - *Comportamiento esperado:* Si no hay alertas de fraude ni señales bajo mínimo, un puntaje global de exactamente 90.0 aprueba automáticamente (`APROBADO_AUTOMATICO`, `motivo: 'aprobado'`) debido a la regla matemática inclusiva `Puntaje Global >= umbralAprobacion` (DEC-01, PF-020).
2. **Puntaje Global Exactamente en Umbral de Riesgo Alto (60.0 puntos):**
   - *Comportamiento esperado:* La condición de riesgo alto por puntaje exige estrictamente `scoreGlobal < umbralRiesgoAlto`. Si un caso obtiene exactamente 60.0 puntos con una sola señal bajo mínimo, no activa la advertencia por puntaje (se mantiene en falso a menos que tenga 2 o más señales bajo mínimo).
3. **Señal Individual Exactamente en su Mínimo Propio (ej. Autenticidad = 70.0 con mínimo 70.0):**
   - *Comportamiento esperado:* La señal se considera aprobada y en cumplimiento (`valor >= minimo`). No se computa como señal bajo mínimo ni deriva el caso por este concepto.
4. **Mínimo Absoluto de Señal en Cero (0.0):**
   - *Comportamiento esperado:* Si una señal obtiene 0.0 (ejemplo: falsificación evidente de boleta), la señal cae estrictamente bajo su mínimo propio (salvo que el mínimo configurado fuera 0), forzando derivación por `senal_bajo_minimo` y activando riesgo alto si el puntaje global cae bajo 60.
5. **Propuesta con Ponderaciones Decimales que Suman 0,999 o 1,001 por Redondeo:**
   - *Comportamiento esperado:* El sistema exige validación de igualdad a 1,00 con precisión de dos decimales (1,00). Valores fuera de este umbral exacto no pueden ser enviados a aprobación.
6. **Múltiples Borradores Concurrentes en F5:**
   - *Comportamiento esperado:* Solo puede existir un único borrador activo en revisión por flujo a la vez (ratificado por el Representante del Cliente el 2026-10-14). Si existe un borrador pendiente de aprobación o desestimación, el Diseñador debe editar el borrador existente o esperar la resolución administrativa antes de proponer uno nuevo.
7. **Modificación de Umbrales mientras Ocurre una Evaluación en F4:**
   - *Comportamiento esperado:* Toda evaluación iniciada se completa atómicamente con la versión de umbrales que estaba vigente en el instante exacto de la petición, registrando el número de versión aplicado en el resultado.

---

## 5. Requirements *(mandatory)*

### 5.1 Requisitos Funcionales del Incremento

| ID Requisito | Descripción Funcional y Reglas Asociadas | Requisito Origen (Fuente E1) | Equivalente Alternativo (`final-final.md`) | Equivalente PDF E1 (`RQF-Bxx`) | Ficha DEC Vinculada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-001** | El sistema debe permitir a un usuario con rol Diseñador configurar y proponer modificaciones a los parámetros de evaluación (umbral de aprobación, umbral de riesgo alto, mínimos por señal y ponderaciones continuas), registrando la propuesta en estado BORRADOR con rastro de auditoría del proponente. | `RQF-044 [final-final]` (configuración de umbrales) y `RQF-039 [fase5-lester]` (propuesta en borrador) | `RQF-035 [final-final]` (para RQF-039) / *sin equivalente en lester* (para RQF-044) | `RQF-B09 [PDF pág. 9]` (para configuración de umbrales) / *sin equivalente en PDF* (para propuesta en borrador de doble aprobación) | `DEC-E2-10(a)(d)`, `D-04`, `PF-033` |
| **FR-002** | El sistema debe exigir que toda propuesta de umbrales sea aprobada por un usuario con rol Administrador formalmente distinto al usuario que la propuso, impidiendo terminantemente la auto-aprobación del cambio y actualizando el estado a APROBADO e incrementando el número de versión al autorizarse. | `RQF-039 [fase5-lester]` | `RQF-035` | *sin equivalente en PDF* | `DEC-E2-10(d)`, `D-04`, `PF-033` |
| **FR-003** | El sistema debe validar que en toda propuesta de umbrales la suma de los tres pesos de las señales sea exactamente igual a 1,00, y que cada mínimo individual y umbral de decisión sea un valor numérico acotado entre 0 y 100. | `RQF-044 [final-final]` | *sin equivalente en lester* | `RQF-B09 [PDF pág. 9]` | `DEC-E2-10(a)`, `D-08` |
| **FR-004** | El sistema debe mantener un historial inmutable de versiones de umbrales donde cada registro conserva versión, parámetros, usuario proponente, usuario aprobador, fecha/hora y estado, impidiendo su sobrescritura o borrado. | `RQNF-002 [fase5-lester]` | `RQNF-003` | *sin equivalente en PDF* | `DEC-14`, `H-14`, `D-03` |
| **FR-005** | El sistema debe calcular el puntaje global ponderado de un caso de reembolso médico multiplicando cada una de las tres señales (`autenticidad_documentos`, `cruce_fuentes`, `coherencia_solicitud`) por su ponderación vigente. | `RQF-040 [fase5-lester]` | `RQF-005` | `RQF-B10 [PDF pág. 9]` | `DEC-E2-10(a)`, `D-08` |
| **FR-006** | El sistema debe resolver `decision: 'APROBADO_AUTOMATICO'` con `motivo: 'aprobado'` cuando el puntaje global sea mayor o igual al umbral de aprobación vigente (90 por defecto), no exista alerta de fraude y ninguna señal esté bajo su mínimo individual. | `RQF-040 [fase5-lester]` | `RQF-005` | `RQF-B10 [PDF pág. 9]` (prueba en PDF usa umbral 85) | `DEC-01`, `DEC-E2-10(b)`, `PF-020` |
| **FR-007** | El sistema debe resolver `decision: 'DERIVADO_REVISION'` con `motivo: 'alerta_fraude'` ante cualquier caso con alerta de fraude activa, con máxima precedencia sobre cualquier puntaje obtenido. | `RQF-023 [fase5-lester]` | `RQF-028` | `RQF-B12 [PDF pág. 9]` (cobertura parcial por contenido; el PDF estipula rechazo automático ante fraude, superado por DEC-E2-06; prueba PF-018 en pág. 13 cita RQF-023) | `DEC-E2-06`, `PF-018` |
| **FR-008** | El sistema debe resolver `decision: 'DERIVADO_REVISION'` con `motivo: 'senal_bajo_minimo'` cuando al menos una señal individual no alcance su mínimo propio, con precedencia sobre el puntaje global y subordinada únicamente a la alerta de fraude. | `RQF-041 [fase5-lester]` | `[SIN EQUIVALENTE VERIFICADO en final-final]` | `RQF-B12 [PDF pág. 9]` (cobertura parcial por contenido; PDF dice "Rechazado", superado por DEC-08/E2-06) | `DEC-E2-10(a)`, `H-05`, `PF-021` |
| **FR-009** | El sistema debe resolver `decision: 'DERIVADO_REVISION'` con `motivo: 'puntaje_bajo_umbral'` cuando el caso no presente alertas de fraude ni señales bajo mínimo pero su puntaje global sea inferior al umbral de aprobación. | `RQF-020 [fase5-lester]` | `[SIN EQUIVALENTE VERIFICADO en final-final]` | `RQF-B11 [PDF pág. 9] y RQF-B12 [PDF pág. 9]` (cobertura parcial por contenido; RQF-B11 rango intermedio 60-84 y RQF-B12 rechazo bajo umbral mínimo, superado por DEC-08) | `DEC-08`, `DEC-E2-10(b)`, `PF-015` |
| **FR-010** | El sistema nunca debe rechazar automáticamente un caso ni utilizar la palabra "rechazado" o "rechazo automático" para comunicar una decisión del sistema. | Nuevo por decisión del equipo (DEC-08, DEC-E2-06, DEC-E2-10(b)); modifica RQF-B12 (relacionado: `RQF-020 [fase5-lester]`) | `[SIN EQUIVALENTE VERIFICADO en final-final]` | Modificado respecto a RQF-B12 (reemplazado por DEC-08, DEC-E2-06 y DEC-E2-10) | `DEC-08`, `DEC-E2-06`, `DEC-E2-10(b)` |
| **FR-011** | El sistema debe activar el indicador informativo `riesgoAltoRechazo: true` y desplegar el texto *"Riesgo alto de rechazo: decide un operador"* si el caso presenta 2 o más señales bajo mínimo o un puntaje menor a `umbralRiesgoAlto` (60 por defecto), sin alterar la decisión de derivación. | Nuevo por decisión del equipo (DEC-E2-10(b)) (relacionado: `RQF-020 [fase5-lester]`) | `[SIN EQUIVALENTE VERIFICADO en final-final]` | `RQF-B11 [PDF pág. 9] y RQF-B12 [PDF pág. 9]` (Modificado: rechazo automático → derivación con advertencia de riesgo alto [umbralRiesgoAlto = 60]. Origen: equipo, con base en ENT6) | `DEC-08`, `DEC-E2-10(b)` |
| **FR-012** | El sistema debe ser capaz de reevaluar un caso histórico contra la versión específica de umbrales con la que fue evaluado originalmente, garantizando un 100% de reproducibilidad determinista en la decisión y el motivo. | `RQNF-002 [fase5-lester]` | `RQNF-003` | *sin equivalente en PDF* | `DEC-14`, `H-14` |

---

### 5.2 Key Entities (Entidades de Dominio de Negocio)

- **Versión de Umbrales (`UmbralesFlujo`):** Representa el conjunto normativo paramétrico que rige la evaluación de los expedientes de reembolso médico en un momento dado.
  - *Atributos esenciales:* Identificador del flujo de negocio (reembolso médico), número de versión secuencial entero, umbral de corte para aprobación automática, umbral de corte para advertencia de riesgo alto, umbrales mínimos requeridos para cada una de las tres señales, ponderaciones relativas continuas para cada señal, identificador del usuario que propuso la versión, identificador del usuario que aprobó la versión, fecha y hora de formalización, y estado de vigencia del registro (`BORRADOR` o `APROBADO`).
- **Caso de Reembolso Médico (`Caso`):** Representa la solicitud de reembolso presentada por un afiliado que debe ser calificada por la plataforma.
  - *Atributos esenciales:* Identificador único de expediente, tipo de prestación médica cubierta, monto del reembolso solicitado, listado de evidencias documentales asociadas (boletas, órdenes de laboratorio, recetas ficticias), conjunto de señales analíticas evaluadas y bandera de sospecha de fraude.
- **Señales del Caso (`SenalesCaso`):** Representa el vector de evaluaciones cuantitativas y cualitativas sintéticas computadas para un caso.
  - *Atributos esenciales:* Nivel de autenticidad documental (0 a 100), nivel de cruce de concordancia entre fuentes (0 a 100), nivel de coherencia clínica y documental de la solicitud (0 a 100) y bandera booleana de alerta de fraude activa o inactiva.
- **Resultado de Evaluación (`ResultadoEvaluacion`):** Representa el dictamen resolutivo oficial generado por el motor de evaluación para un caso específico.
  - *Atributos esenciales:* Identificador del caso evaluado, puntaje global ponderado consolidado, estado resolutivo de decisión emitida (`APROBADO_AUTOMATICO` o `DERIVADO_REVISION`), motivo técnico estructurado de la decisión (`aprobado`, `alerta_fraude`, `senal_bajo_minimo`, `puntaje_bajo_umbral`), indicador booleano de advertencia de riesgo alto (`riesgoAltoRechazo`), lista de nombres de señales que no alcanzaron su mínimo propio, desglose del aporte ponderado individual de cada señal, número de versión de umbrales aplicada en el dictamen y marca de tiempo de la evaluación.

---

## 6. Success Criteria *(mandatory)*

### 6.1 Criterios de Aceptación de Casos de Negocio (§2.d, §7.4)

A continuación se formaliza la correspondencia canónica de los criterios de aceptación `AC-1` a `AC-6`, vinculándolos de forma unívoca a los casos de prueba sintéticos documentados en la guía (§2.d, §7.4):

| Criterio | Caso Asociado (§2.d) | Descripción del Escenario de Prueba | Señales de Entrada | Puntaje Global | Resultado Esperado | Motivo Esperado | Advertencia Riesgo Alto |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AC-1** | `CASO-MED-001` | Aprobación automática holgada sobre umbral sin anomalías | Aut: 95, Cruce: 95, Coh: 90, Fraude: false | **94.0** (≥ 90) | `APROBADO_AUTOMATICO` | `'aprobado'` | `false` |
| **AC-2** | `CASO-MED-002` | Derivación por señal individual bajo mínimo propio con puntaje aprobatorio | Aut: 100, Cruce: 100, Coh: 55 (< 60), Fraude: false | **91.0** (≥ 90) | `DERIVADO_REVISION` | `'senal_bajo_minimo'` | `false` |
| **AC-3** | `CASO-MED-003` | Precedencia absoluta de alerta de fraude ignorando puntaje aprobatorio | Aut: 95, Cruce: 95, Coh: 90, Fraude: **true** | **94.0** (≥ 90) | `DERIVADO_REVISION` | `'alerta_fraude'` | `false` |
| **AC-4** | `CASO-MED-004` | Derivación con advertencia de riesgo alto por puntaje crítico y 2 señales bajo mínimo | Aut: 40 (< 70), Cruce: 40 (< 70), Coh: 60, Fraude: false | **44.0** (< 60) | `DERIVADO_REVISION` | `'senal_bajo_minimo'` | **`true`** |
| **AC-5** | `CASO-MED-005` | Derivación estándar en rango intermedio de puntaje sin señales bajo mínimo | Aut: 75, Cruce: 75, Coh: 75, Fraude: false | **75.0** (60 ≤ x < 90) | `DERIVADO_REVISION` | `'puntaje_bajo_umbral'` | `false` |
| **AC-6** | `CASO-MED-006` | Derivación con advertencia de riesgo alto por puntaje crítico con 1 sola señal bajo mínimo | Aut: 0 (< 70), Cruce: 70, Coh: 60, Fraude: false | **40.0** (< 60) | `DERIVADO_REVISION` | `'senal_bajo_minimo'` | **`true`** |

### 6.2 Prueba Unitaria de Condición Lógica Multiseñal (PU-1)

Fuera de la suite de casos de negocio del dominio en interfaz, se define una prueba unitaria técnica directa en motor (§2.d ítem 7) para aislar la condición de multiseñal bajo mínimo:

| Identificador | Caso Asociado (§2.d) | Descripción del Escenario de Prueba | Señales de Entrada | Puntaje Global | Resultado Esperado | Motivo Esperado | Advertencia Riesgo Alto |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PU-1** | Caso Unitario (§2.d) | Derivación con advertencia de riesgo alto por 2 señales bajo mínimo con puntaje no crítico | Aut: 65 (< 70), Cruce: 65 (< 70), Coh: 100, Fraude: false | **72.0** (≥ 60) | `DERIVADO_REVISION` | `'senal_bajo_minimo'` | **`true`** |

### 6.3 Resultados Medibles de Éxito (Measurable Outcomes)

- **SC-001 (Consistencia Resolutiva Total):** El 100% de los casos de prueba sintéticos de la suite de negocio (`CASO-MED-001` a `CASO-MED-006`) y la prueba unitaria `PU-1` deben evaluarse con estricta coincidencia frente a su decisión, motivo y bandera de riesgo esperado en pruebas automatizadas independientes.
- **SC-002 (Cero Falsos Rechazos del Sistema):** En el 100% de las evaluaciones realizadas, la salida del sistema debe ser estrictamente `APROBADO_AUTOMATICO` o `DERIVADO_REVISION`. La tasa de emisión de "rechazo automático" por parte del sistema es exactamente 0% (invariante absoluto RN-01).
- **SC-003 (Eficacia del Protocolo de Doble Control):** El 100% de los intentos de auto-aprobación de un borrador de umbrales por el mismo usuario que lo propuso deben ser bloqueados por el sistema de forma comprobable.
- **SC-004 (Reproducibilidad Determinista Histórica):** El 100% de las reevaluaciones históricas ejecutadas contra versiones archivadas de umbrales deben producir idéntico puntaje ponderado, idéntica decisión e idéntico motivo de salida (RQNF-002 [fase5-lester]).
- **SC-005 (Facilidad Operativa de Consulta y Usabilidad):** Los operadores y administradores acceden a la configuración vigente e historial completo de cambios en un máximo de 2 interacciones (clics) desde el menú principal de la interfaz web, y completan la inspección/evaluación de un caso en F4 o la propuesta/aprobación de un borrador en F5 en un tiempo menor o igual a 3 minutos sin asistencia técnica externa (ratificado formalmente por el Representante del Cliente el 2026-10-14 para la prueba de usabilidad y la sesión formal de aceptación).

---

## 7. Assumptions (Supuestos y Declaraciones de Diseño)

1. **Simulación Determinista del Motor Multimodal (D-02):** El análisis de visión por computadora y procesamiento de lenguaje natural sobre las imágenes y PDFs ficticios no se realiza en tiempo real; se asume que las señales numéricas resultantes (`autenticidadDocumentos`, `cruceFuentes`, `coherenciaSolicitud`) y la bandera `alertaFraudeActiva` ya han sido calculadas previamente y residen en los casos de prueba sintéticos controlados.
2. **Valores por Defecto de Mínimos y Ponderaciones (D-07, D-08):** Conforme a MIRA §2.6 y a las declaraciones de Sebastián en ENT3 [00:21:47] (*"mínimos por señal… aunque nadie ha definido cuáles son"*), se asumen como `[SUPUESTO del equipo]` ratificado formalmente por el Representante del Cliente para el flujo de reembolso médico: Autenticidad = 70 (peso 0,40), Cruce = 70 (peso 0,40) y Coherencia = 60 (peso 0,20).
3. **Rol del Umbral 60 como Señal de Riesgo Alto (DEC-08, DEC-E2-10(b)):** El valor 60 no opera como umbral de rechazo automático sino como un disparador informativo de `riesgoAltoRechazo`. Matemáticamente, con los valores por defecto de mínimos asumidos (70/70/60) y ponderaciones (0,40/0,40/0,20), el puntaje mínimo sin señales bajo mínimo es 68.0 puntos, por lo que todo puntaje inferior a 60 presenta forzosamente al menos una deficiencia documental con los valores por defecto.
4. **Selector de Sesión y Autenticación Simulada (D-04, H-06):** Para posibilitar la demostración y verificación del protocolo de doble control en un entorno sin credenciales complejas ni servicios en la nube externos, el sistema dispondrá en la barra superior de un selector con 5 identidades preconfiguradas fijas: `Diseñador 1`, `Diseñador 2`, `Administrador 1`, `Administrador 2` y `Operador 1` (ratificado por el Representante del Cliente el 2026-10-14, dando cumplimiento estricto a PF-033 y MIRA §2.13).
5. **Idioma Oficial:** Toda la interfaz de usuario, etiquetas, mensajes de retroalimentación, estados y advertencias se redactan exclusivamente en idioma español neutro profesional (Principio VII / Restricción 3).
6. **Regla de Precisión en Comparaciones:** Las comparaciones lógicas y matemáticas del motor de evaluación se ejecutan sobre los valores numéricos sin redondear; el redondeo a un decimal es una regla exclusiva de presentación visual en interfaz [SUPUESTO del equipo].

### 7.1 Estado de Supuestos y Decisiones Operativas
Todos los supuestos operativos propuestos por el equipo de ingeniería para F5 y F4 han sido formalmente ratificados por el Representante del Cliente (Rodrigo Guerrero, con auditoría de Lester Gonzalez y Jorge Alvarez) en la sesión de clarificación del 2026-10-14, quedando **cero supuestos pendientes de confirmación**:
- **(a) Mínimos y Ponderaciones:** Ratificados en 70/70/60 y 0,40/0,40/0,20 como `[SUPUESTO del equipo]` de dominio para el piloto de reembolso médico (DEC-05 / D-07 / D-08 / DEC-E2-10(a)).
- **(b) Consistencia de Corte Paramétrico:** Ratificada la regla `umbralAprobacion > umbralRiesgoAlto` (90 > 60 por defecto) para preservar el rango de derivación ordinaria e impedir rangos invertidos en F5.
- **(c) Concurrencia de Borradores y Doble Control:** Ratificado el límite de 1 solo borrador activo por flujo, con acciones de Aprobar y Desestimar por Administrador independiente y 5 identidades preconfiguradas fijas en selector (D-04 / PF-033).
- **(d) Requisitos de Latencia y Reproducibilidad:** Ratificada la ausencia de SLA contractual vinculante de latencia en E2 (H-11), consagrando el 100% de reproducibilidad determinista histórica como la prueba extra-funcional oficial en C5 (H-14 / RQNF-002 [fase5-lester]).
- **(e) Métrica de Usabilidad SC-005:** Ratificado el límite de ≤ 2 clics para consulta y ≤ 3 minutos para ejecución de tareas clave en la interfaz web por un evaluador sin inducción previa.

---

## 8. Registro de Clarificaciones Formales Realizadas

Todas las consultas de clarificación han sido resueltas formalmente con el Representante del Cliente (Rodrigo Guerrero, DEC-E2-07) bajo auditoría cruzada de Lester Gonzalez y Jorge Alvarez (DEC-E2-03) en la sesión del 2026-10-14. Quedan exactamente **CERO marcadores `[NEEDS CLARIFICATION]` pendientes** en la especificación:

### Clarificación 1: Confirmación de Valores de Mínimos por Señal y Ponderaciones [RESUELTA - 2026-10-14]
- **Resolución:** Ratificada formalmente la Opción A por el Representante del Cliente (Rodrigo Guerrero, con auditoría de Lester Gonzalez y Jorge Alvarez): Autenticidad (mín. 70, peso 0.40), Cruce de fuentes (mín. 70, peso 0.40) y Coherencia de solicitud (mín. 60, peso 0.20), con suma exacta de pesos = 1.00. La bandera de fraude (`alertaFraudeActiva`) se mantiene como variable booleana independiente (cierra formalmente el hallazgo H-05 / DEC-05 / D-07 / D-08).

### Clarificación 2: Nombres y Roles del Mecanismo Simulado de Doble Control [RESUELTA - 2026-10-14]
- **Resolución:** Ratificada formalmente la Opción A por el Representante del Cliente (Rodrigo Guerrero, con auditoría de Lester Gonzalez y Jorge Alvarez): Selector en barra superior con 5 identidades fijas (`Diseñador 1`, `Diseñador 2`, `Administrador 1`, `Administrador 2`, `Operador 1`). Ciclo de vida con máximo 1 borrador activo simultáneo por flujo. Un Administrador distinto al autor puede Aprobar o Desestimar la propuesta con rastro inalterable de auditoría (cierra formalmente H-06 / H-12 / D-04 / D-05 / PF-033).

### Clarificación 3: Consistencia Paramétrica de Corte y Comportamiento bajo Umbral Crítico [RESUELTA - 2026-10-14]
- **Resolución:** Ratificada formalmente la Opción A por el Representante del Cliente (Rodrigo Guerrero, con auditoría de Lester Gonzalez y Jorge Alvarez): F5 valida obligatoriamente `umbralAprobacion > umbralRiesgoAlto` (90 > 60 por defecto). En F4, todo puntaje inferior a 60 deriva obligatoriamente a revisión (`DERIVADO_REVISION`, `motivo: 'senal_bajo_minimo'`) y activa la etiqueta informativa destacada `riesgoAltoRechazo: true`, garantizando cero rechazos automáticos (cierra consulta §3.2, H-08 / DEC-08 / RQF-020 [fase5-lester] / DEC-E2-10(b)).

### Clarificación 4: Confirmación de Ausencia de SLA Vinculante de Tiempo de Respuesta [RESUELTA - 2026-10-14]
- **Resolución:** Ratificada formalmente la Opción A por el Representante del Cliente (Rodrigo Guerrero, con auditoría de Lester Gonzalez y Jorge Alvarez): No existe SLA contractual vinculante de latencia en la Entrega 2. La prueba extra-funcional obligatoria exigible para el criterio C5 se concentra al 100% en la reproducibilidad determinista histórica de decisiones sobre versiones guardadas en SQLite (`tests/reproducibility/deterministic.test.ts`, AC-6, H-14 / DEC-14 / RQNF-002 [fase5-lester] / RQNF-003 [final-final]). Las herramientas como k6 quedan reservadas únicamente para medir líneas base exploratorias opcionales (DEC-E2-05).

### Clarificación 5: Criterio Cuantitativo de Usabilidad y Operatividad de la Interfaz [RESUELTA - 2026-10-14]
- **Resolución:** Ratificada formalmente la Opción A por el Representante del Cliente (Rodrigo Guerrero, con auditoría de Lester Gonzalez y Jorge Alvarez): Acceso a la consulta de configuración vigente e historial de versiones en ≤ 2 clics desde la navegación principal. Tiempo de ejecución de tareas clave ≤ 3 minutos en la prueba de usabilidad externa (`docs/entregable2/usabilidad.md`, Compuerta 6) y sesión de aceptación (`docs/entregable2/sesion-aceptacion.md`, Compuerta 5) para un usuario sin inducción técnica previa (cierra SC-005, C4 y C5).

---
*Fin de la Especificación Funcional Consolidada.*

# Contrato de API: Evaluación de Casos y Motor de Decisión (F4)

**Ruta:** `specs/001-f5-f4-umbrales-evaluacion/contracts/api-evaluacion-f4.md`  
**Estado:** Propuesto; pendiente de revisión de Rodrigo y Jorge (Compuerta 3)  
**Protocolo:** HTTP / REST (JSON)  
**Prefijo Base:** `/api/evaluacion`  

---

## 1. `GET /api/evaluacion/casos`
Obtiene la lista de casos de prueba sintéticos preconfigurados en `data/casos_prueba.json` para el flujo de reembolso de gastos médicos.

- **Respuesta 200 OK:**
```json
[
  {
    "idCaso": "CASO-MED-001",
    "nombrePaciente": "Paciente Sintético 01",
    "montoReclamado": 45000,
    "descripcionClinica": "Consulta medicina general y perfil lipídico",
    "senales": {
      "autenticidad_documentos": 95.0,
      "cruce_fuentes": 95.0,
      "coherencia_solicitud": 90.0,
      "alertaFraudeActiva": false
    },
    "resultadoEsperado": {
      "decision": "APROBADO_AUTOMATICO",
      "motivo": "aprobado",
      "riesgoAltoRechazo": false
    }
  },
  {
    "idCaso": "CASO-MED-002",
    "nombrePaciente": "Paciente Sintético 02",
    "montoReclamado": 72000,
    "descripcionClinica": "Consulta traumatológica",
    "senales": {
      "autenticidad_documentos": 95.0,
      "cruce_fuentes": 95.0,
      "coherencia_solicitud": 55.0,
      "alertaFraudeActiva": false
    },
    "resultadoEsperado": {
      "decision": "DERIVADO_REVISION",
      "motivo": "senal_bajo_minimo",
      "riesgoAltoRechazo": false
    }
  }
]
```

---

## 2. `POST /api/evaluacion/evaluar`
Ejecuta la evaluación determinista de un expediente contra la versión de umbrales actualmente vigente (o contra una versión histórica explícita para fines de auditoría). Almacena el resultado inmutablemente en SQLite.

- **Cuerpo de la Petición:**
```json
{
  "idCaso": "CASO-MED-001",
  "idFlujo": "reembolso-gastos-medicos",
  "senales": {
    "autenticidad_documentos": 95.0,
    "cruce_fuentes": 95.0,
    "coherencia_solicitud": 90.0,
    "alertaFraudeActiva": false
  },
  "usuarioOperador": "Operador 1"
}
```
- **Lógica de Ejecución (Orden de Evaluación RN-04):**
  1. Recupera la versión vigente de `umbrales_flujo` para `idFlujo`.
  2. Calcula `scoreGlobal = (pesoAut * aut) + (pesoCruce * cruce) + (pesoCoh * coh)` (sin redondear).
  3. Evalúa precedencia:
     - Si `alertaFraudeActiva === true` → `decision = DERIVADO_REVISION`, `motivo = 'alerta_fraude'`.
     - Si alguna señal < mínimo propio respectivo → `decision = DERIVADO_REVISION`, `motivo = 'senal_bajo_minimo'`.
     - Si `scoreGlobal >= umbralAprobacion` → `decision = APROBADO_AUTOMATICO`, `motivo = 'aprobado'`.
     - Caso contrario → `decision = DERIVADO_REVISION`, `motivo = 'puntaje_bajo_umbral'`.
  4. Calcula advertencia informativa:
     `riesgoAltoRechazo = (conteo(señales bajo mínimo) >= 2) || (scoreGlobal < umbralRiesgoAlto)`.
  5. Inserta registro inmutable en `auditoria_evaluaciones`.
- **Respuesta 200 OK:**
```json
{
  "idEvaluacion": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  "idCaso": "CASO-MED-001",
  "scoreGlobal": 94.0,
  "scoreVisual": "94.0",
  "decision": "APROBADO_AUTOMATICO",
  "motivo": "aprobado",
  "riesgoAltoRechazo": false,
  "mensajeOperador": "Expediente aprobado automáticamente.",
  "senalesBajoMinimo": [],
  "desgloseComponentes": {
    "autenticidad": 95.0,
    "cruceFuentes": 95.0,
    "coherencia": 90.0
  },
  "versionUmbralesAplicada": 1,
  "timestamp": "2026-10-14T11:30:00.000Z"
}
```

---

## 3. Ejemplo de Respuesta con Advertencia de Riesgo Alto (CASO-MED-006)
Cuando un expediente cae bajo el umbral de riesgo alto (40.0 < 60) o presenta 2 o más señales bajo mínimo:

- **Respuesta 200 OK:**
```json
{
  "idEvaluacion": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "idCaso": "CASO-MED-006",
  "scoreGlobal": 40.0,
  "scoreVisual": "40.0",
  "decision": "DERIVADO_REVISION",
  "motivo": "senal_bajo_minimo",
  "riesgoAltoRechazo": true,
  "mensajeOperador": "Riesgo alto de rechazo: decide un operador",
  "senalesBajoMinimo": [
    "autenticidad_documentos"
  ],
  "desgloseComponentes": {
    "autenticidad": 0.0,
    "cruceFuentes": 70.0,
    "coherencia": 60.0
  },
  "versionUmbralesAplicada": 1,
  "timestamp": "2026-10-14T11:32:00.000Z"
}
```
*(Nótese que la decisión es `DERIVADO_REVISION` y bajo ninguna circunstancia se usa la palabra "rechazado", en estricto apego al Principio I de la Constitución).*

---

## 4. `GET /api/evaluacion/historial`
Permite consultar el rastro de auditoría de evaluaciones históricas, insumo directo de la suite de reproducibilidad determinista (`tests/reproducibility/deterministic.test.ts`).

- **Query Params:** `?idCaso=CASO-MED-001&limit=50`
- **Respuesta 200 OK:**
```json
{
  "total": 1,
  "evaluaciones": [
    {
      "idEvaluacion": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
      "idCaso": "CASO-MED-001",
      "versionUmbralesAplicada": 1,
      "scoreGlobal": 94.0,
      "decision": "APROBADO_AUTOMATICO",
      "motivo": "aprobado",
      "riesgoAltoRechazo": false,
      "senalesInsumo": {
        "autenticidad_documentos": 95.0,
        "cruce_fuentes": 95.0,
        "coherencia_solicitud": 90.0,
        "alertaFraudeActiva": false
      },
      "timestamp": "2026-10-14T11:30:00.000Z"
    }
  ]
}
```

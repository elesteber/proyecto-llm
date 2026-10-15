# Contrato de API: Evaluación de Casos y Motor de Decisión (F4)

**Ruta:** `specs/001-f5-f4-umbrales-evaluacion/contracts/api-evaluacion-f4.md`  
**Estado:** Propuesto; pendiente de revisión de Rodrigo y Jorge (Compuerta 3)  
**Protocolo:** HTTP / REST (JSON)  
**Prefijo Base:** `/api/evaluacion`  

---

## 1. `GET /api/evaluacion/casos`
Obtiene la lista de casos de prueba sintéticos preconfigurados en `data/casos_prueba.json` para el flujo de reembolso de gastos médicos, con datos y señales copiados exactamente de `entregable2/guia-implementacion-sdd.md §2.d`.

- **Respuesta 200 OK:**
```json
[
  {
    "idCaso": "CASO-MED-001",
    "prestacion": "Consulta médica de medicina general (45.000 CLP) [guía §2.d]",
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
    "prestacion": "Exámenes de laboratorio de sangre (120.000 CLP) [guía §2.d]",
    "senales": {
      "autenticidad_documentos": 100.0,
      "cruce_fuentes": 100.0,
      "coherencia_solicitud": 55.0,
      "alertaFraudeActiva": false
    },
    "resultadoEsperado": {
      "decision": "DERIVADO_REVISION",
      "motivo": "senal_bajo_minimo",
      "riesgoAltoRechazo": false
    }
  },
  {
    "idCaso": "CASO-MED-003",
    "prestacion": "Reembolso de medicamentos de alto costo (280.000 CLP) [guía §2.d]",
    "senales": {
      "autenticidad_documentos": 95.0,
      "cruce_fuentes": 95.0,
      "coherencia_solicitud": 90.0,
      "alertaFraudeActiva": true
    },
    "resultadoEsperado": {
      "decision": "DERIVADO_REVISION",
      "motivo": "alerta_fraude",
      "riesgoAltoRechazo": false
    }
  },
  {
    "idCaso": "CASO-MED-004",
    "prestacion": "Procedimiento ambulatorio (60.000 CLP) [guía §2.d]",
    "senales": {
      "autenticidad_documentos": 40.0,
      "cruce_fuentes": 40.0,
      "coherencia_solicitud": 60.0,
      "alertaFraudeActiva": false
    },
    "resultadoEsperado": {
      "decision": "DERIVADO_REVISION",
      "motivo": "senal_bajo_minimo",
      "riesgoAltoRechazo": true
    }
  },
  {
    "idCaso": "CASO-MED-005",
    "prestacion": "Consulta médica con especialista (50.000 CLP) [guía §2.d]",
    "senales": {
      "autenticidad_documentos": 75.0,
      "cruce_fuentes": 75.0,
      "coherencia_solicitud": 75.0,
      "alertaFraudeActiva": false
    },
    "resultadoEsperado": {
      "decision": "DERIVADO_REVISION",
      "motivo": "puntaje_bajo_umbral",
      "riesgoAltoRechazo": false
    }
  },
  {
    "idCaso": "CASO-MED-006",
    "prestacion": "Reembolso de exámenes complejos con documentación ilegible (95.000 CLP) [guía §2.d]",
    "senales": {
      "autenticidad_documentos": 0.0,
      "cruce_fuentes": 70.0,
      "coherencia_solicitud": 60.0,
      "alertaFraudeActiva": false
    },
    "resultadoEsperado": {
      "decision": "DERIVADO_REVISION",
      "motivo": "senal_bajo_minimo",
      "riesgoAltoRechazo": true
    }
  }
]
```

---

## 2. `POST /api/evaluacion/evaluar`
Ejecuta la evaluación determinista de un expediente contra la versión de umbrales actualmente vigente (`MAX(version) WHERE estado = 'APROBADO'`).
- **Autenticación e Identidad:** La identidad del operador se extrae de la sesión activa (`/api/session`). **No se envía en el cuerpo.**
- **Carga de Señales en Servidor (D-02):** El cliente envía únicamente el `idCaso` (y opcionalmente `idFlujo`). **Las señales analíticas no se envían en la petición:** el backend las carga estáticamente desde `data/casos_prueba.json` garantizando determinismo e impidiendo adulteración externa.

- **Cuerpo de la Petición:**
```json
{
  "idCaso": "CASO-MED-001",
  "idFlujo": "reembolso-gastos-medicos"
}
```

- **Lógica de Ejecución (Orden de Evaluación RN-04):**
  1. Carga las señales sintéticas del caso desde `data/casos_prueba.json` (`D-02`).
  2. Recupera la versión vigente de `umbrales_flujo` para `idFlujo` (`MAX(version) WHERE estado = 'APROBADO'`).
  3. Calcula `scoreGlobal = (pesoAut · aut) + (pesoCruce · cruce) + (pesoCoh · coh)` sin redondear.
  4. Evalúa precedencia estricta:
     - Paso 1: Si `alertaFraudeActiva === true` → `decision = 'DERIVADO_REVISION'`, `motivo = 'alerta_fraude'`.
     - Paso 2: Si alguna señal < mínimo propio respectivo → `decision = 'DERIVADO_REVISION'`, `motivo = 'senal_bajo_minimo'`.
     - Paso 3: Si `scoreGlobal >= umbralAprobacion` → `decision = 'APROBADO_AUTOMATICO'`, `motivo = 'aprobado'`.
     - Paso 4: En cualquier otro caso → `decision = 'DERIVADO_REVISION'`, `motivo = 'puntaje_bajo_umbral'`.
  5. Calcula advertencia informativa:
     `riesgoAltoRechazo = (conteo(señales bajo mínimo) >= 2) || (scoreGlobal < umbralRiesgoAlto)`.
  6. Inserta registro inmutable en `auditoria_evaluaciones`.

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
Permite consultar el rastro inmutable de evaluaciones históricas registradas en `auditoria_evaluaciones`.

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
      "usuarioOperador": "Operador 1",
      "timestamp": "2026-10-14T11:30:00.000Z"
    }
  ]
}
```

---

## 5. `POST /api/evaluacion/reevaluar-historico`
Endpoint de verificación de reproducibilidad determinista histórica exigido por `FR-012`, `RQNF-002 [fase5-lester]` y `SC-004`.
- **Propósito:** Reevalúa un dictamen pasado utilizando los insumos archivados (`senales_insumo`) contra la versión de umbrales que estaba vigente en su origen, o contra una versión archivada explícita.
- **Inmutabilidad:** **No inserta registros nuevos en la tabla operacional de auditoría** (operación determinista idempotente de solo verificación).

- **Cuerpo de la Petición:**
```json
{
  "idEvaluacion": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
}
```

- **Lógica de Ejecución:**
  1. Recupera el registro original desde `auditoria_evaluaciones`.
  2. Recupera la versión archivada de `umbrales_flujo` especificada en `version_umbrales_aplicada`.
  3. Ejecuta el motor determinista sobre las señales insumo archivadas.
  4. Compara el resultado recomputado con el original registrado.

- **Respuesta 200 OK:**
```json
{
  "idEvaluacionOriginal": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  "versionUmbralesAplicada": 1,
  "resultadoReevaluacion": {
    "scoreGlobal": 94.0,
    "decision": "APROBADO_AUTOMATICO",
    "motivo": "aprobado",
    "riesgoAltoRechazo": false
  },
  "reproducibilidadDeterminista": {
    "puntajeCoincide": true,
    "decisionCoincide": true,
    "motivoCoincide": true,
    "riesgoAltoCoincide": true,
    "consistencia100Porciento": true
  }
}
```

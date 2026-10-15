# Contrato de API: Gestión de Umbrales (F5)

**Ruta:** `specs/001-f5-f4-umbrales-evaluacion/contracts/api-umbrales-f5.md`  
**Estado:** Propuesto; pendiente de revisión de Rodrigo y Jorge (Compuerta 3)  
**Protocolo:** HTTP / REST (JSON)  
**Prefijo Base:** `/api/umbrales`  

---

## 1. `GET /api/umbrales/vigente`
Obtiene la configuración de umbrales actualmente vigente (la versión con estado `APROBADO` de mayor número secuencial correlativo).

- **Headers:** Ninguno requerido.
- **Respuesta 200 OK (Versión inicial sembrada por defecto):**
```json
{
  "idFlujo": "reembolso-gastos-medicos",
  "version": 1,
  "umbralAprobacion": 90.0,
  "umbralRiesgoAlto": 60.0,
  "minimoAutenticidad": 70.0,
  "minimoCruceFuentes": 70.0,
  "minimoCoherencia": 60.0,
  "pesoAutenticidad": 0.40,
  "pesoCruceFuentes": 0.40,
  "pesoCoherencia": 0.20,
  "proponente": "sistema",
  "aprobador": "carga inicial del sistema (valores por defecto)",
  "fechaPropuesta": "2026-10-14T00:00:00.000Z",
  "fechaResolucion": "2026-10-14T00:00:00.000Z",
  "estado": "APROBADO"
}
```
- **Respuesta 404 Not Found:**
```json
{
  "error": "No existe una versión aprobada vigente para este flujo."
}
```

---

## 2. `GET /api/umbrales/historial`
Lista todas las versiones históricas de umbrales del flujo (aprobadas, desestimadas y borrador activo si existe), ordenadas por versión descendente.

- **Respuesta 200 OK:**
```json
{
  "idFlujo": "reembolso-gastos-medicos",
  "borradorActivo": null,
  "versiones": [
    {
      "version": 1,
      "umbralAprobacion": 90.0,
      "umbralRiesgoAlto": 60.0,
      "minimoAutenticidad": 70.0,
      "minimoCruceFuentes": 70.0,
      "minimoCoherencia": 60.0,
      "pesoAutenticidad": 0.40,
      "pesoCruceFuentes": 0.40,
      "pesoCoherencia": 0.20,
      "proponente": "sistema",
      "aprobador": "carga inicial del sistema (valores por defecto)",
      "fechaPropuesta": "2026-10-14T00:00:00.000Z",
      "fechaResolucion": "2026-10-14T00:00:00.000Z",
      "estado": "APROBADO"
    }
  ]
}
```

---

## 3. `POST /api/umbrales/borrador`
Crea una nueva propuesta de umbrales en estado `BORRADOR`.
- **Autenticación e Identidad:** La identidad del proponente se extrae automáticamente en el servidor desde la sesión activa (`/api/session`). **No se envía en el cuerpo de la petición.**
- **Control de Acceso:** El backend valida que la identidad activa posea el rol de **`Diseñador`** (ej. `'Diseñador 1'` o `'Diseñador 2'`). Si no es Diseñador, rechaza con código 403 Forbidden.
- **Restricción de Concurrencia:** Bloqueado con error 409 Conflict si ya existe un borrador activo sin resolver en el flujo (garantizado por el índice único condicional SQLite).
- **Asignación de Versión:** El backend asigna de inmediato el número secuencial `version = MAX(version) + 1`.

- **Cuerpo de la Petición:**
```json
{
  "idFlujo": "reembolso-gastos-medicos",
  "umbralAprobacion": 88.0,
  "umbralRiesgoAlto": 65.0,
  "minimoAutenticidad": 70.0,
  "minimoCruceFuentes": 70.0,
  "minimoCoherencia": 60.0,
  "pesoAutenticidad": 0.40,
  "pesoCruceFuentes": 0.40,
  "pesoCoherencia": 0.20
}
```
- **Validaciones:**
  - `pesoAutenticidad + pesoCruceFuentes + pesoCoherencia === 1.00` (con tolerancia 0.0001 `[SUPUESTO del equipo]`; error 400 si difiere).
  - Cada peso entre `0.00` y `1.00`.
  - Umbrales y mínimos numéricos entre `0.0` y `100.0` inclusive.
  - `umbralAprobacion > umbralRiesgoAlto` estricto (error 400 si `umbralAprobacion <= umbralRiesgoAlto`).
- **Respuesta 201 Created:**
```json
{
  "mensaje": "Borrador de umbrales registrado exitosamente.",
  "borrador": {
    "idFlujo": "reembolso-gastos-medicos",
    "version": 2,
    "umbralAprobacion": 88.0,
    "umbralRiesgoAlto": 65.0,
    "minimoAutenticidad": 70.0,
    "minimoCruceFuentes": 70.0,
    "minimoCoherencia": 60.0,
    "pesoAutenticidad": 0.40,
    "pesoCruceFuentes": 0.40,
    "pesoCoherencia": 0.20,
    "proponente": "Diseñador 1",
    "aprobador": null,
    "fechaPropuesta": "2026-10-14T11:00:00.000Z",
    "fechaResolucion": null,
    "estado": "BORRADOR"
  }
}
```
- **Respuesta 400 Bad Request:**
```json
{
  "error": "Validación fallida: la suma de las ponderaciones debe ser exactamente 1.00 (suma actual: 0.95)."
}
```
- **Respuesta 403 Forbidden:**
```json
{
  "error": "Acceso denegado: solo un usuario con rol Diseñador puede proponer modificaciones de umbrales."
}
```
- **Respuesta 409 Conflict:**
```json
{
  "error": "Ya existe un borrador de umbrales activo pendiente de resolución en este flujo (versión 2)."
}
```

---

## 4. `PUT /api/umbrales/borrador`
Modifica los parámetros numéricos de la propuesta actualmente en estado `BORRADOR`.
- **Autenticación e Identidad:** La identidad del editor se extrae de la sesión activa (`/api/session`).
- **Control de Acceso:** El backend valida que la identidad activa sea de rol **`Diseñador`**.
- **Regla:** Actualiza los campos numéricos manteniendo el mismo número de `version` asignado previamente.

- **Cuerpo de la Petición:**
```json
{
  "idFlujo": "reembolso-gastos-medicos",
  "umbralAprobacion": 89.0,
  "umbralRiesgoAlto": 64.0,
  "minimoAutenticidad": 70.0,
  "minimoCruceFuentes": 70.0,
  "minimoCoherencia": 60.0,
  "pesoAutenticidad": 0.40,
  "pesoCruceFuentes": 0.40,
  "pesoCoherencia": 0.20
}
```
- **Respuesta 200 OK:**
```json
{
  "mensaje": "Borrador de umbrales actualizado exitosamente.",
  "borrador": {
    "idFlujo": "reembolso-gastos-medicos",
    "version": 2,
    "umbralAprobacion": 89.0,
    "umbralRiesgoAlto": 64.0,
    "minimoAutenticidad": 70.0,
    "minimoCruceFuentes": 70.0,
    "minimoCoherencia": 60.0,
    "pesoAutenticidad": 0.40,
    "pesoCruceFuentes": 0.40,
    "pesoCoherencia": 0.20,
    "proponente": "Diseñador 1",
    "aprobador": null,
    "fechaPropuesta": "2026-10-14T11:00:00.000Z",
    "fechaResolucion": null,
    "estado": "BORRADOR"
  }
}
```
- **Respuesta 404 Not Found:**
```json
{
  "error": "No existe un borrador activo para modificar en este flujo."
}
```

---

## 5. `POST /api/umbrales/borrador/aprobar`
Aprueba el borrador activo, promoviéndolo a estado `APROBADO` como nueva versión vigente inmutable.
- **Autenticación e Identidad:** La identidad del aprobador se extrae de la sesión activa (`/api/session`). **No se envía en el cuerpo.**
- **Control de Acceso:** El backend valida que la identidad activa tenga rol **`Administrador`**.
- **Incompatibilidad estricta de doble control (`PF-033`):** El backend valida que `usuarioAprobador !== proponente`. Si el mismo usuario que propuso el borrador intenta aprobarlo, rechaza con 403 Forbidden.

- **Cuerpo de la Petición:**
```json
{
  "idFlujo": "reembolso-gastos-medicos"
}
```
- **Respuesta 200 OK:**
```json
{
  "mensaje": "Propuesta de umbrales aprobada exitosamente. Nueva versión vigente: 2.",
  "versionAprobada": {
    "idFlujo": "reembolso-gastos-medicos",
    "version": 2,
    "estado": "APROBADO",
    "aprobador": "Administrador 1",
    "fechaResolucion": "2026-10-14T11:15:00.000Z"
  }
}
```
- **Respuesta 403 Forbidden (Auto-aprobación bloqueada):**
```json
{
  "error": "Violación de segregación de funciones: El usuario proponente no puede aprobar su propia propuesta de umbrales; se requiere un aprobador independiente."
}
```

---

## 6. `POST /api/umbrales/borrador/desestimar`
Descarta y archiva el borrador activo, pasándolo a estado `DESESTIMADO` sin alterar la versión vigente.
- **Autenticación e Identidad:** La identidad del resolutor se extrae de la sesión activa (`/api/session`). **No se envía en el cuerpo.**
- **Control de Acceso:** El backend valida rol **`Administrador`** y regla de incompatibilidad `usuario !== proponente`.
- **Efecto de Versionamiento:** La versión desestimada conserva su número de versión asignado en el historial inmutable (generando un hueco en la numeración correlativa de versiones aprobadas).

- **Cuerpo de la Petición:**
```json
{
  "idFlujo": "reembolso-gastos-medicos",
  "motivoDesestimacion": "Ponderaciones incompatibles con política de riesgo de octubre [SUPUESTO del equipo]."
}
```
- **Respuesta 200 OK:**
```json
{
  "mensaje": "Propuesta de umbrales desestimada y archivada. Conserva su número de versión histórica.",
  "versionDesestimada": {
    "idFlujo": "reembolso-gastos-medicos",
    "version": 2,
    "estado": "DESESTIMADO",
    "aprobador": "Administrador 1",
    "fechaResolucion": "2026-10-14T11:20:00.000Z"
  }
}
```
- **Respuesta 403 Forbidden:**
```json
{
  "error": "Violación de segregación de funciones: El usuario proponente no puede desestimar su propia propuesta; se requiere un Administrador independiente."
}
```

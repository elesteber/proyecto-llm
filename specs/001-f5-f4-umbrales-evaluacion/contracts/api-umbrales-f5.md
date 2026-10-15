# Contrato de API: Gestión de Umbrales (F5)

**Ruta:** `specs/001-f5-f4-umbrales-evaluacion/contracts/api-umbrales-f5.md`  
**Estado:** Propuesto; pendiente de revisión de Rodrigo y Jorge (Compuerta 3)  
**Protocolo:** HTTP / REST (JSON)  
**Prefijo Base:** `/api/umbrales`  

---

## 1. `GET /api/umbrales/vigente`
Obtiene la configuración de umbrales actualmente vigente (la versión con estado `APROBADO` de mayor número correlativo).

- **Headers:** Ninguno requerido.
- **Respuesta 200 OK:**
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
  "proponente": "Administrador 1",
  "aprobador": "Administrador 2",
  "fechaPropuesta": "2026-10-14T10:00:00.000Z",
  "fechaResolucion": "2026-10-14T10:05:00.000Z",
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
  "flujo": "reembolso-gastos-medicos",
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
      "proponente": "Administrador 1",
      "aprobador": "Administrador 2",
      "fechaPropuesta": "2026-10-14T10:00:00.000Z",
      "fechaResolucion": "2026-10-14T10:05:00.000Z",
      "estado": "APROBADO"
    }
  ]
}
```

---

## 3. `POST /api/umbrales/borrador`
Crea una nueva propuesta de umbrales en estado `BORRADOR` formulada por el usuario activo (rol Diseñador o Administrador).

- **Restricciones:** Bloqueado con error 409 si ya existe un borrador activo sin resolver en el flujo.
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
  "pesoCoherencia": 0.20,
  "usuarioProponente": "Diseñador 1"
}
```
- **Validaciones:**
  - `pesoAutenticidad + pesoCruceFuentes + pesoCoherencia === 1.00` (error 400 si la suma difiere de 1.00).
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
- **Respuesta 409 Conflict:**
```json
{
  "error": "Ya existe un borrador de umbrales activo pendiente de resolución en este flujo (versión 2)."
}
```

---

## 4. `POST /api/umbrales/borrador/aprobar`
Aprueba el borrador activo, promoviéndolo a estado `APROBADO` como nueva versión vigente inmutable.

- **Cuerpo de la Petición:**
```json
{
  "idFlujo": "reembolso-gastos-medicos",
  "version": 2,
  "usuarioAprobador": "Administrador 1"
}
```
- **Validaciones:**
  - `usuarioAprobador` debe tener rol de Administrador.
  - **Incompatibilidad estricta de doble control:** `usuarioAprobador !== proponente` (error 403 Forbidden si el proponente intenta auto-aprobarse).
  - La versión debe encontrarse actualmente en estado `BORRADOR`.
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
- **Respuesta 403 Forbidden:**
```json
{
  "error": "Violación de segregación de funciones: El usuario proponente ('Diseñador 1') no puede aprobar su propia propuesta de umbrales."
}
```

---

## 5. `POST /api/umbrales/borrador/desestimar`
Descarta y archiva el borrador activo, pasándolo a estado `DESESTIMADO` sin alterar la versión vigente.

- **Cuerpo de la Petición:**
```json
{
  "idFlujo": "reembolso-gastos-medicos",
  "version": 2,
  "usuarioAprobador": "Administrador 1",
  "motivoDesestimacion": "Ponderaciones incompatibles con política de riesgo de octubre."
}
```
- **Validaciones:**
  - `usuarioAprobador` debe tener rol Administrador.
  - `usuarioAprobador !== proponente`.
- **Respuesta 200 OK:**
```json
{
  "mensaje": "Propuesta de umbrales desestimada y archivada.",
  "versionDesestimada": {
    "idFlujo": "reembolso-gastos-medicos",
    "version": 2,
    "estado": "DESESTIMADO",
    "aprobador": "Administrador 1",
    "fechaResolucion": "2026-10-14T11:20:00.000Z"
  }
}
```

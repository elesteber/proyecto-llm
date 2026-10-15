# Contrato de API: Sesión Simulada y Conmutación de Identidades (D-04)

**Ruta:** `specs/001-f5-f4-umbrales-evaluacion/contracts/session-simulada.md`  
**Estado:** Propuesto; pendiente de revisión de Rodrigo y Jorge (Compuerta 3)  
**Protocolo:** HTTP / REST (JSON)  
**Prefijo Base:** `/api/session`  

---

## 1. Contexto de Diseño (D-04 / PF-033)

Para permitir que el sistema se clone y ejecute en máquina limpia en menos de 15 minutos sin servicios externos de autenticación ni bases de datos de usuarios complejas, se implementa un mecanismo de sesión simulada en memoria/cookie respaldado en el catálogo cerrado de 5 identidades preconfiguradas ratificadas en la clarificación 2:
1. `Diseñador 1` (Rol: Diseñador)
2. `Diseñador 2` (Rol: Diseñador)
3. `Administrador 1` (Rol: Administrador)
4. `Administrador 2` (Rol: Administrador)
5. `Operador 1` (Rol: Operador)

---

## 2. `GET /api/session/current`
Obtiene la identidad actualmente activa en la interfaz y el catálogo de identidades disponibles para conmutación.

- **Respuesta 200 OK:**
```json
{
  "usuarioActivo": {
    "nombre": "Diseñador 1",
    "rol": "Diseñador",
    "descripcion": "Usuario autorizado para proponer y editar borradores de umbrales."
  },
  "catalogoIdentidades": [
    { "nombre": "Diseñador 1", "rol": "Diseñador" },
    { "nombre": "Diseñador 2", "rol": "Diseñador" },
    { "nombre": "Administrador 1", "rol": "Administrador" },
    { "nombre": "Administrador 2", "rol": "Administrador" },
    { "nombre": "Operador 1", "rol": "Operador" }
  ]
}
```

---

## 3. `POST /api/session/switch`
Conmuta la sesión activa hacia otra de las 5 identidades preconfiguradas para permitir probar la segregación de funciones (ej. proponer con Diseñador 1 y aprobar con Administrador 1).

- **Cuerpo de la Petición:**
```json
{
  "nuevoUsuario": "Administrador 1"
}
```
- **Validaciones:**
  - `nuevoUsuario` debe pertenecer al catálogo cerrado de 5 identidades. Cualquier otro valor devuelve error 400.
- **Respuesta 200 OK:**
```json
{
  "mensaje": "Sesión conmutada exitosamente a 'Administrador 1'.",
  "usuarioActivo": {
    "nombre": "Administrador 1",
    "rol": "Administrador"
  }
}
```
- **Respuesta 400 Bad Request:**
```json
{
  "error": "Identidad no autorizada. Debe seleccionar una de las 5 identidades oficiales: Diseñador 1, Diseñador 2, Administrador 1, Administrador 2, Operador 1."
}
```

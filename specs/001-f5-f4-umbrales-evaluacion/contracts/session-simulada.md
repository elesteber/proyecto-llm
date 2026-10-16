# Contrato de API: Sesión Simulada y Conmutación de Identidades (D-04)

**Ruta:** `specs/001-f5-f4-umbrales-evaluacion/contracts/session-simulada.md`  
**Estado:** Aprobada por Rodrigo Guerrero (backend) y Jorge Alvarez (frontend) mediante reviews en PR #16, 2026-10-15  
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

---

## 4. Mecanismo de Persistencia de Sesión

Para garantizar que la identidad activa se preserve a través de llamadas sucesivas sin requerir bases de datos de sesiones complejas:
1. **Emisión de Cookie de Sesión:** En cada llamada exitosa a `POST /api/session/switch`, el servidor responde con la cabecera HTTP:
   `Set-Cookie: mira_session=<nombre_usuario_codificado>; Path=/; HttpOnly; SameSite=Lax`
   El valor de la cookie va codificado con `encodeURIComponent` (ej. `mira_session=Dise%C3%B1ador%201`) para compatibilidad estándar HTTP ante espacios y caracteres con tilde, y se decodifica mediante `decodeURIComponent` en el middleware del backend.
2. **Identidad por Defecto:** Si una petición no incluye la cookie `mira_session` o su valor decodificado no pertenece al catálogo de 5 identidades válidas, el middleware de autenticación del backend asume por defecto la identidad `'Diseñador 1'`.
3. **Validación en Middleware:** Cada endpoint protegido (creación/modificación de borradores, aprobación, desestimación y evaluación) extrae el usuario activo desde la cookie de sesión validada, garantizando que el rol y nombre se resuelvan en el servidor y no puedan ser falsificados en el cuerpo JSON de la petición.
4. **Mecanismo de simulación (D-04):** La identidad es falsificable desde el cliente por diseño; no es un mecanismo de seguridad. Su propósito exclusivo es habilitar la alternancia ágil de roles y la demostración verificable del doble control en entornos de evaluación docente y testing automatizado en < 15 minutos (C4).
5. **Persistencia en Pruebas y Clientes CLI (`curl`):**
   Para automatizaciones o pruebas manuales mediante CLI, las llamadas deben persistir y reutilizar el archivo de cookies empleando los parámetros `-c cookies.txt` (guardar cookies recibidas) y `-b cookies.txt` (enviar cookies guardadas).


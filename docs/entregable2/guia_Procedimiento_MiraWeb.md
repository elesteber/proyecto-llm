# Guía de Procedimientos de Validación y Prueba — MIRA Web (F5 + F4)

**Proyecto:** MIRA — Plataforma de Inteligencia Multimodal para Decisiones Empresariales (DPRIME SpA)  
**Taller:** Desarrollo de Software Conducido por Agentes de IA — Universidad de Valparaíso  
**Incremento Funcional:** F5 (Gestión y Configuración de Umbrales) + F4 (Evaluación y Decisión por Umbrales)  
**Rama Técnica:** `feat/backend-frontend`  
**Fecha:** Octubre de 2026  
**Documento:** `docs/entregable2/guia_Procedimiento_MiraWeb.md`  

---

## 1. Propósito y Alcance

Este documento describe de manera exhaustiva los procedimientos operativos necesarios para validar, comprobar y demostrar el funcionamiento del incremento integrado **F5 + F4** en la plataforma web de MIRA.

Cubre tanto la **validación automatizada en consola** (pruebas unitarias, de integración, tipos e inmutabilidad en base de datos) como la **validación funcional interactiva de extremo a extremo en la interfaz web**, garantizando el cumplimiento de los principios constitucionales, la segregación de funciones, la reactividad cruzada y los criterios de aceptación normativos.

---

## 2. Requisitos Previos del Entorno

Para ejecutar y probar la solución sin dependencias complejas ni contenedores requeridos (cumpliendo con el Criterio C4 de arranque en máquina limpia en menos de 15 minutos):

- **Node.js:** Versión 20.x o superior.
- **npm:** Versión 10.x o superior.
- **Terminal:** PowerShell, Git Bash o terminal Linux/macOS.
- **Navegador Web:** Chrome, Edge, Firefox o cualquier navegador moderno.

---

## 3. Procedimiento 1: Validación Automatizada en Consola (CLI)

Ejecutar desde la raíz del proyecto (`proyecto-llm`):

### 3.1. Verificación de Tipos TypeScript (Cero Errores)
Verifica que todos los contratos compartidos (`@shared/*`), alias de backend (`@backend/*`) y componentes frontend estén estrictamente tipados sin inconsistencias:
```powershell
npx tsc --noEmit
```
* **Resultado esperado:** El comando finaliza de inmediato con código de salida `0` sin imprimir ninguna advertencia ni error de tipos.

### 3.2. Ejecución de la Suite Completa de Pruebas
Ejecuta la totalidad de pruebas automatizadas con Vitest:
```powershell
npm test
```
* **Resultado esperado:**
  - **7 archivos de prueba ejecutados y aprobados:**
    1. `tests/unit/evaluacion-engine.test.ts` (Motor F4: precedencia, ponderaciones, riesgo alto)
    2. `tests/unit/umbrales-repo.test.ts` (Repositorio de acceso a datos SQLite)
    3. `tests/unit/umbrales-validation.test.ts` (Reglas matemáticas de validación de umbrales)
    4. `tests/integration/session-api.test.ts` (Sesión simulada y persistencia de cookies)
    5. `tests/integration/evaluacion-api.test.ts` (Evaluación de casos y auditoría inmutable)
    6. `tests/integration/umbrales-api.test.ts` (Flujo de doble control, borradores y aprobación)
    7. `tests/integration/auditoria-inmutable.test.ts` (Triggers SQLite e integridad referencial)
  - **Total de pruebas:** 49 passed (100% éxito).

### 3.3. Ejecución Granular por Capas
Para ejecutar pruebas específicas durante el desarrollo o revisión puntual:
```powershell
# Pruebas unitarias de motor y cálculo
npm run test:unit

# Pruebas de integración de API, base de datos y sesión
npm run test:integration
```

---

## 4. Procedimiento 2: Validación Interactiva en Navegador Web (Full Stack)

### Paso 4.1: Siembra e Inicialización de la Base de Datos SQLite
Asegura que la base de datos local contenga la Versión 1 vigente por defecto y el catálogo canónico de los 6 expedientes médicos sintéticos (operación idempotente):
```powershell
npm run db:seed
```

### Paso 4.2: Iniciar el Servidor Dual de Desarrollo
Levanta en un único comando el servidor Express modular y el servidor de desarrollo de Vite:
```powershell
npm run dev
```
* **Servicios desplegados:**
  - **Backend (API REST):** `http://localhost:3001`
  - **Frontend (React + Vite):** `http://localhost:5173`
  - **Proxy transparente:** Las peticiones desde el navegador a `http://localhost:5173/api/*` son redirigidas automáticamente a `http://localhost:3001/api/*` evitando problemas de CORS.

Abre el navegador web en: **`http://localhost:5173`**

---

### Paso 4.3: Pruebas Funcionales en Módulo F4 (Evaluación de Casos)

Navega a la pestaña **"Evaluación de Casos (F4)"** desde la barra superior.

#### Prueba A: Aprobación Automática (`CASO-MED-001`) — Criterio AC-1
1. En el catálogo lateral izquierdo, selecciona el expediente **`CASO-MED-001`**.
2. Presiona el botón **"Evaluar Expediente"**.
3. **Resultado visual esperado:**
   - **Badge de Decisión:** Verde brillante con texto `APROBADO_AUTOMATICO`.
   - **Motivo Técnico:** `aprobado`.
   - **Score Global Calculado:** `94.00 / 100` (superior al umbral de aprobación `90.0`).
   - **Desglose de Señales:** Autenticidad (95.0), Cruce de Fuentes (95.0), Coherencia (90.0) — todas sobre los mínimos normativos.
   - **Advertencia de Riesgo Alto:** Inactiva (`false`).

#### Prueba B: Precedencia de Alerta de Fraude (`CASO-MED-003`) — Criterio AC-3
1. Selecciona el expediente **`CASO-MED-003`** y presiona **"Evaluar Expediente"**.
2. **Resultado visual esperado:**
   - **Badge de Decisión:** Ámbar `DERIVADO_REVISION`.
   - **Motivo Técnico:** `alerta_fraude`.
   - **Regla demostrada (Principio II):** A pesar de que el caso ostenta un puntaje ponderado alto de **94.0**, la sospecha o confirmación de fraude tiene precedencia absoluta sobre el cálculo ponderado, forzando la derivación humana obligatoria.

#### Prueba C: Precedencia de Señal Bajo Mínimo Propio (`CASO-MED-002`) — Criterio AC-2
1. Selecciona el expediente **`CASO-MED-002`** y presiona **"Evaluar Expediente"**.
2. **Resultado visual esperado:**
   - **Badge de Decisión:** Ámbar `DERIVADO_REVISION`.
   - **Motivo Técnico:** `senal_bajo_minimo`.
   - **Regla demostrada:** El caso tiene un puntaje global de **91.0** (que normalmente calificaría para aprobación), pero su señal de **Coherencia Documental es 55.0** (inferior al mínimo exigido de 60.0). Se lista explícitamente la señal en falta.

#### Prueba D: Rango Intermedio de Puntaje (`CASO-MED-005`) — Criterio AC-5
1. Selecciona el expediente **`CASO-MED-005`** y presiona **"Evaluar Expediente"**.
2. **Resultado visual esperado:**
   - **Badge de Decisión:** Ámbar `DERIVADO_REVISION`.
   - **Motivo Técnico:** `puntaje_bajo_umbral`.
   - **Regla demostrada:** Ninguna señal cayó bajo el mínimo y no hay fraude, pero su score ponderado es de **75.00** ($60.0 \le \text{score} < 90.0$). Al no alcanzar el corte de aprobación, pasa a revisión de un analista.

#### Prueba E: Advertencia de Riesgo Alto sin Dictamen de Rechazo (`CASO-MED-004` y `CASO-MED-006`) — Criterios AC-4, AC-6 y Principio I
1. Selecciona **`CASO-MED-006`** (score 40.0) o **`CASO-MED-004`** (score 44.0 y 2 señales bajo mínimo).
2. Presiona **"Evaluar Expediente"**.
3. **Resultado visual esperado:**
   - **Badge de Decisión:** Ámbar `DERIVADO_REVISION`.
   - **Tarjeta de Advertencia Destacada:** Aparece un banner de advertencia visual en color ámbar/rojo con el texto textual canónico:
     > **"Riesgo alto de rechazo: decide un operador"**
   - **Invariante Constitucional (Principio I):** El sistema **jamás emite un estado de rechazo automático**. El software únicamente recomienda derivación; la potestad resolutiva final es humana.

---

### Paso 4.4: Pruebas de Doble Control y Gestión de Umbrales en F5 (US4 y US5)

Navega a la pestaña **"Gestión de Umbrales (F5)"** desde la barra superior.

#### Paso 4.4.1: Consulta de la Versión Vigente
- Se visualiza el panel de la **Versión 1 (Vigente)** con los valores de fábrica:
  - Umbral Aprobación: `90.0` | Umbral Riesgo Alto: `60.0`
  - Mínimos: Autenticidad (70.0), Cruce (70.0), Coherencia (60.0)
  - Ponderaciones: 0.40 / 0.40 / 0.20 (Suma: 1.00)
  - Proponente: `sistema` | Aprobador: `carga inicial del sistema (valores por defecto)`

#### Paso 4.4.2: Crear Propuesta de Modificación como Diseñador 1
1. En el selector de usuario ubicado en la esquina superior derecha, selecciona **`Diseñador 1`**.
2. En el formulario de propuesta de nuevos umbrales:
   - Modifica el **Umbral de Aprobación** a **`96.0`**.
   - Verifica que la suma de ponderaciones permanezca en `1.00` y que `umbralAprobacion > umbralRiesgoAlto`.
3. Presiona el botón **"Guardar Propuesta de Borrador"**.
4. **Resultado esperado:**
   - Se crea exitosamente la **Versión 2** en estado **`BORRADOR`**.
   - El proponente registrado es formalmente `Diseñador 1`.
   - El índice único de la base de datos impide crear un segundo borrador concurrente (aparecerá botón para editar el borrador existente).

#### Paso 4.4.3: Verificar Bloqueo de Auto-Aprobación / Segregación de Roles
1. Manteniendo la sesión como **`Diseñador 1`**, intenta aprobar la propuesta.
2. **Resultado esperado:**
   - La acción es impedida por la interfaz y por la API (`403 Forbidden`).
   - Mensaje: *Solo un usuario con rol Administrador puede resolver propuestas de umbrales y quien propone no puede aprobar su propio borrador*.

#### Paso 4.4.4: Aprobación Formal por Administrador Independiente
1. En el selector superior de identidades, conmuta a **`Administrador 1`**.
2. Observarás que se activa la **Bandeja de Revisión Administrativa**:
   - Muestra el resumen de diferencias de parámetros propuestos vs versión vigente.
3. Presiona el botón **"Aprobar Propuesta"**.
4. **Resultado esperado:**
   - La **Versión 2** es promovida formalmente a estado **`APROBADO`**.
   - El aprobador registrado es `Administrador 1`.
   - La Versión 2 pasa a ser inmediatamente la política vigente para futuras evaluaciones.

#### Paso 4.4.5: Verificación de Reactividad Cruzada Viva (F5 $\to$ F4)
1. Regresa a la pestaña **"Evaluación de Casos (F4)"**.
2. Selecciona y reevalúa **`CASO-MED-001`** (cuyo puntaje es 94.0).
3. **Resultado esperado:**
   - **Bajo la Versión 1** aprobaba automáticamente ($94.0 \ge 90.0$).
   - **Bajo la Versión 2 vigente** ($umbral = 96.0$), el dictamen cambia de inmediato a **`DERIVADO_REVISION`** con motivo **`puntaje_bajo_umbral`** ($94.0 < 96.0$).
   - Esto demuestra la integración directa y en tiempo real entre la persistencia de F5 y el motor de cálculo de F4.

---

## 5. Procedimiento 3: Verificación Directa de API REST (cURL / PowerShell)

Si requieres validar los servicios backend desacoplados de la interfaz visual:

```powershell
# 1. Consultar la identidad activa en la sesión simulada
curl -s http://localhost:3001/api/session/current

# 2. Conmutar sesión a Diseñador 2
curl -s -X POST http://localhost:3001/api/session/switch `
  -H "Content-Type: application/json" `
  -d '{"nuevoUsuario": "Diseñador 2"}'

# 3. Consultar la política vigente de umbrales
curl -s http://localhost:3001/api/umbrales/vigente

# 4. Listar el catálogo de expedientes de prueba
curl -s http://localhost:3001/api/evaluacion/casos

# 5. Evaluar directamente un expediente
curl -s -X POST http://localhost:3001/api/evaluacion/evaluar `
  -H "Content-Type: application/json" `
  -d '{"idCaso": "CASO-MED-001", "idFlujo": "reembolso-gastos-medicos"}'
```

---

## 6. Resumen de la Matriz de Casos de Prueba (Referencia Rápida)

| Caso de Prueba | Prestación Médica | Señales (Aut / Cruce / Coh / Fraude) | Score Global | Decisión Resultante | Motivo Técnico | Advertencia Riesgo Alto |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **CASO-MED-001** | Consulta Especialista | 95.0 / 95.0 / 90.0 / false | **94.00** | `APROBADO_AUTOMATICO` | `aprobado` | `false` |
| **CASO-MED-002** | Exámenes de Laboratorio | 100.0 / 100.0 / 55.0 / false | **91.00** | `DERIVADO_REVISION` | `senal_bajo_minimo` | `false` |
| **CASO-MED-003** | Procedimiento Quirúrgico | 95.0 / 95.0 / 90.0 / **true** | **94.00** | `DERIVADO_REVISION` | `alerta_fraude` | `false` |
| **CASO-MED-004** | Hospitalización | 40.0 / 40.0 / 60.0 / false | **44.00** | `DERIVADO_REVISION` | `senal_bajo_minimo` | **`true`** |
| **CASO-MED-005** | Radiografías | 75.0 / 75.0 / 75.0 / false | **75.00** | `DERIVADO_REVISION` | `puntaje_bajo_umbral` | `false` |
| **CASO-MED-006** | Terapia Física | 0.0 / 70.0 / 60.0 / false | **40.00** | `DERIVADO_REVISION` | `senal_bajo_minimo` | **`true`** |

---

## 7. Verificación de Invariantes y Reglas Constitucionales

- **Principio I (Salidas Exclusivas):** Únicamente se generan dictámenes `APROBADO_AUTOMATICO` o `DERIVADO_REVISION`. Queda vetado el dictamen "rechazado".
- **Principio II (Precedencia en F4):**  
  $$\text{Fraude } (\texttt{alerta\_fraude}) \succ \text{Señal bajo mínimo } (\texttt{senal\_bajo\_minimo}) \succ \text{Score } \ge 90\ (\texttt{aprobado}) \succ \text{Score } < 90\ (\texttt{puntaje\_bajo\_umbral})$$
- **Principio III (Doble Control en F5):**  
  - Diseñador solo propone y edita borradores.
  - Administrador solo aprueba o desestima.
  - Bloqueo de auto-aprobación: si `aprobador === proponente`, retorna código HTTP `403 Forbidden`.
- **Inmutabilidad y Auditoría (Principio IV y VI):**  
  Las tablas `auditoria_evaluaciones` y `rastro_auditoria` tienen triggers SQLite que impiden actualizaciones y borrados accidentales o maliciosos, preservando la trazabilidad absoluta.

# Guía Rápida de Validación y Puesta en Marcha (Phase 1)

**Incremento:** F5 (Configuración y Gestión de Umbrales) + F4 (Evaluación y Decisión por Umbrales)  
**Ruta:** `specs/001-f5-f4-umbrales-evaluacion/quickstart.md`  
**Estado:** Propuesto; pendiente de revisión de Rodrigo y Jorge (Compuerta 3)  
**Fecha:** 2026-10-14  

---

## 1. Requisitos Previos y Entorno de Ejecución

Para satisfacer de manera garantizada el Criterio C4 de la rúbrica docente (arranque en máquina limpia en menos de 15 minutos), el proyecto no utiliza contenedores Docker obligatorios ni dependencias complejas en la nube:
- **Node.js:** v20.x o superior (LTS recomendado).
- **npm:** v10.x o superior.
- **Sistema Operativo:** Linux, macOS o Windows (WSL2 recomendado en Windows).
- **Herramientas opcionales:** `curl` o navegador web moderno para interacción manual.

---

## 2. Instalación y Arranque Rápido (estimación por medir: < 5 minutos)

Desde la raíz del repositorio clonado, ejecutar los siguientes comandos estándar:

```bash
# 1. Instalar dependencias completas del ecosistema
npm install

# 2. Inicializar la base de datos SQLite con la semilla inicial (versión 1 y casos de prueba)
npm run db:seed

# 3. Levantar la aplicación completa (Backend en :3001 y Frontend Vite en :5173)
npm run dev
```

Una vez ejecutado `npm run dev`:
- **Interfaz Web (React):** `http://localhost:5173`
- **API Backend (Express):** `http://localhost:3001/api`
- **Proxy Vite transparente:** Las peticiones a `http://localhost:5173/api/*` son redirigidas automáticamente a `http://localhost:3001/api/*` sin problemas de CORS.

---

## 3. Escenarios de Validación Extremo a Extremo

### Escenario 1: Verificación de Umbrales Vigentes por Defecto (Versión 1)
- **Objetivo:** Verificar que el sistema inicia con la configuración normativa ratificada en la Entrega 2 como carga inicial del sistema.
- **Acción:**
  ```bash
  curl -s http://localhost:3001/api/umbrales/vigente | jq .
  ```
- **Resultado Esperado:**
  - `version: 1`
  - `umbralAprobacion: 90.0`
  - `umbralRiesgoAlto: 60.0`
  - `minimoAutenticidad: 70.0`, `minimoCruceFuentes: 70.0`, `minimoCoherencia: 60.0`
  - `pesoAutenticidad: 0.40`, `pesoCruceFuentes: 0.40`, `pesoCoherencia: 0.20`
  - `proponente: "sistema"`
  - `aprobador: "carga inicial del sistema (valores por defecto)"`
  - `estado: "APROBADO"`

---

### Escenario 2: Doble Control y Segregación de Funciones en F5 (`PF-033`)
- **Objetivo:** Demostrar que quien propone un cambio no puede aprobarlo y que se requiere un segundo Administrador independiente (`D-04`, `PF-033`). La identidad proviene de la cookie de sesión activa (`mira_session`) gestionada con `-c cookies.txt -b cookies.txt`.

- **Paso 2.0: Conmutar sesión activa a Administrador 1**
  ```bash
  curl -s -c cookies.txt -b cookies.txt -X POST http://localhost:3001/api/session/switch \
    -H "Content-Type: application/json" \
    -d '{"nuevoUsuario": "Administrador 1"}' | jq .
  ```

- **Paso 2.1: Crear propuesta como Administrador 1 (asigna versión 2 en BORRADOR)**
  ```bash
  curl -s -c cookies.txt -b cookies.txt -X POST http://localhost:3001/api/umbrales/borrador \
    -H "Content-Type: application/json" \
    -d '{
      "idFlujo": "reembolso-gastos-medicos",
      "umbralAprobacion": 88.0,
      "umbralRiesgoAlto": 65.0,
      "minimoAutenticidad": 70.0,
      "minimoCruceFuentes": 70.0,
      "minimoCoherencia": 60.0,
      "pesoAutenticidad": 0.40,
      "pesoCruceFuentes": 0.40,
      "pesoCoherencia": 0.20
    }' | jq .
  ```
  *Resultado:* Código 201 Created; versión 2 registrada en estado `BORRADOR` con `proponente: "Administrador 1"` `(PF-033 [fase6/pruebas-funcionales.md, línea 69]: 'Un administrador ajusta el umbral y guarda el cambio')`.

- **Paso 2.2: Intento de auto-aprobación con Administrador 1 activo (Debe Fallar con 403)**
  ```bash
  curl -s -c cookies.txt -b cookies.txt -X POST http://localhost:3001/api/umbrales/borrador/aprobar \
    -H "Content-Type: application/json" \
    -d '{
      "idFlujo": "reembolso-gastos-medicos"
    }' | jq .
  ```
  *Resultado:* Código 403 Forbidden (*"Violación de segregación de funciones: El usuario proponente no puede aprobar su propia propuesta de umbrales; se requiere un aprobador independiente"*).

- **Paso 2.3: Conmutar sesión activa a Administrador 2**
  ```bash
  curl -s -c cookies.txt -b cookies.txt -X POST http://localhost:3001/api/session/switch \
    -H "Content-Type: application/json" \
    -d '{"nuevoUsuario": "Administrador 2"}' | jq .
  ```

- **Paso 2.4: Aprobación legítima por Administrador 2**
  ```bash
  curl -s -c cookies.txt -b cookies.txt -X POST http://localhost:3001/api/umbrales/borrador/aprobar \
    -H "Content-Type: application/json" \
    -d '{
      "idFlujo": "reembolso-gastos-medicos"
    }' | jq .
  ```
  *Resultado:* Código 200 OK; versión 2 pasa a `APROBADO` y entra en vigencia operativa con `aprobador: "Administrador 2"`.

---

### Escenario 3: Ejecución de la Matriz Canónica de Casos en F4 (`AC-1` a `AC-6`)
- **Objetivo:** Verificar las 6 reglas de negocio de evaluación sobre casos sintéticos precalculados copiados exactamente de `entregable2/guia-implementacion-sdd.md §2.d`:

| Criterio | Caso | Señales de Entrada (Aut / Cruce / Coh / Fraude) | Puntaje | Decisión Esperada | Motivo Esperado | Advertencia Riesgo Alto |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **AC-1** | `CASO-MED-001` | 95.0 / 95.0 / 90.0 / false | **94.0** | `APROBADO_AUTOMATICO` | `aprobado` | `false` |
| **AC-2** | `CASO-MED-002` | 100.0 / 100.0 / 55.0 / false | **91.0** | `DERIVADO_REVISION` | `senal_bajo_minimo` | `false` |
| **AC-3** | `CASO-MED-003` | 95.0 / 95.0 / 90.0 / **true** | **94.0** | `DERIVADO_REVISION` | `alerta_fraude` | `false` |
| **AC-4** | `CASO-MED-004` | 40.0 / 40.0 / 60.0 / false | **44.0** | `DERIVADO_REVISION` | `senal_bajo_minimo` | **`true`** |
| **AC-5** | `CASO-MED-005` | 75.0 / 75.0 / 75.0 / false | **75.0** | `DERIVADO_REVISION` | `puntaje_bajo_umbral` | `false` |
| **AC-6** | `CASO-MED-006` | 0.0 / 70.0 / 60.0 / false | **40.0** | `DERIVADO_REVISION` | `senal_bajo_minimo` | **`true`** |

*Comando para evaluar directamente un caso (las señales se cargan en el servidor desde data/casos_prueba.json per D-02 y la sesión se envía con cookies):*
```bash
curl -s -c cookies.txt -b cookies.txt -X POST http://localhost:3001/api/evaluacion/evaluar \
  -H "Content-Type: application/json" \
  -d '{
    "idCaso": "CASO-MED-001",
    "idFlujo": "reembolso-gastos-medicos"
  }' | jq .
```

---

### Escenario 4: Prueba Unitaria Multiseñal `PU-1` (§2.d, §6.2)
- **Objetivo:** Verificar que dos señales bajo su mínimo activan `riesgoAltoRechazo: true` incluso con un puntaje global superior al umbral de 60:
- **Entrada:** Autenticidad = 65 (< 70), Cruce = 65 (< 70), Coherencia = 100 (≥ 60). Fraude = false.
- **Puntaje Global:** `(0.40 * 65) + (0.40 * 65) + (0.20 * 100) = 26 + 26 + 20 = 72.0` (≥ 60).
- **Resultado:**
  - `decision: "DERIVADO_REVISION"`
  - `motivo: "senal_bajo_minimo"`
  - `riesgoAltoRechazo: true` (por condición: conteo señales bajo mínimo = 2 >= 2).

---

### Escenario 5: Prueba Extra-funcional de Reproducibilidad Histórica (`SC-004`)
- **Objetivo:** Comprobar la reproducibilidad determinista al 100% de decisiones históricas frente a versiones archivadas de umbrales (`RQNF-002 [fase5-lester]`, Criterio C5).
- **Comando:**
  ```bash
  npm run test:reproducibility
  ```
- **Aserción Explícita de No-Circularidad:**
  La prueba no es circular porque valida explícitamente dos comportamientos opuestos sobre el mismo expediente `CASO-MED-001`:
  1. Al evaluarlo contra la Versión 2 vigente (donde `umbralAprobacion = 96.0`), el caso resulta `decision: 'DERIVADO_REVISION'` con `motivo: 'puntaje_bajo_umbral'` (94.0 < 96.0).
  2. Al reevaluar el mismo caso contra su Versión 1 archivada de origen (donde `umbralAprobacion = 90.0`), el sistema reproduce de forma exacta e idéntica `decision: 'APROBADO_AUTOMATICO'`, `motivo: 'aprobado'` y `riesgoAltoRechazo: false` (100% determinismo).
- **Resultado Esperado:** 100% de casos históricos reproducen exactamente el dictamen original (`PASS`).

---

### Escenario 6: Prueba E2E de Usabilidad en Interfaz Web (`SC-005`, Criterios C4 y C5)
- **Objetivo:** Probar el acceso fluido a la consulta y tareas en ≤ 2 clics y ≤ 3 minutos sin inducción previa.
- **Recorrido:**
  1. Abrir `http://localhost:5173`.
  2. En el encabezado superior, seleccionar identidad activa en el selector (ej. `Diseñador 1`).
  3. Navegar a "Gestión de Umbrales" (1 clic): visualizar versión vigente e historial.
  4. Proponer un cambio de ponderación o umbral (formulario en español neutro).
  5. Conmutar a `Administrador 1` en el selector superior (1 clic) y presionar "Aprobar" sobre la propuesta.
  6. Navegar a "Evaluación de Casos" (1 clic): seleccionar `CASO-MED-006` y presionar "Evaluar Expediente".
  7. Confirmar visualización de la tarjeta de advertencia en color ámbar/rojo con el texto exacto:
     `"Riesgo alto de rechazo: decide un operador"`.

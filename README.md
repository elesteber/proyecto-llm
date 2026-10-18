# MIRA

Desarrollo integrado de las funcionalidades **F5 (Gestión y Configuración de Umbrales de Decisión)** y **F4 (Evaluación Automatizada de Casos y Emisión de Decisión)** de la plataforma MIRA, acotada al flujo de **reembolso de gastos médicos** de la aseguradora piloto ([specs/001-f5-f4-umbrales-evaluacion/spec.md:L14](specs/001-f5-f4-umbrales-evaluacion/spec.md#L14)). F5 permite inspeccionar y proponer modificaciones paramétricas bajo doble control administrativo, mientras que F4 evalúa casos aplicando deterministamente la política vigente para emitir resoluciones automáticas o derivaciones a revisión sin rechazo automático ([specs/001-f5-f4-umbrales-evaluacion/spec.md:L17-L18](specs/001-f5-f4-umbrales-evaluacion/spec.md#L17-L18)).

---

## 1. Requisitos del Sistema

Entorno verificado:
- **Sistema Operativo:** Linux x86_64.
- **Node.js:** `v26.5.0`.
- **npm:** `11.17.0`.

> [!NOTE]
> La ejecución y las pruebas fueron verificadas exclusivamente en Linux x86_64 con las versiones indicadas de Node.js y npm; otras plataformas y versiones no han sido verificadas. Las herramientas de compilación C/C++ (`gcc`/`g++`, `make`, `python3`) no son un requisito previo obligatorio, ya que `better-sqlite3` utiliza un binario precompilado durante la instalación estándar; solo se requerirían si falla la descarga de dicho binario.

---

## 2. Pasos de Instalación y Puesta en Marcha

Ejecutar los siguientes comandos en orden desde la terminal:

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/elesteber/proyecto-llm.git
cd proyecto-llm
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Inicializar y sembrar la base de datos SQLite
Crea el esquema relacional idempotente con claves foráneas activas y siembra la Versión 1 de umbrales por defecto junto con el catálogo de 6 casos médicos sintéticos:
```bash
npm run db:seed
```

### Paso 4: Iniciar servidores de desarrollo
Levanta simultáneamente el servidor backend Express y el servidor frontend Vite en un solo comando:
```bash
npm run dev
```

- **Backend (API REST):** `http://localhost:3001`
- **Frontend (SPA React):** `http://localhost:5173`
- **Proxy inverso transparente:** Las peticiones desde el frontend a `/api/*` son canalizadas automáticamente a `http://localhost:3001/api/*` sin problemas de CORS.

Abre tu navegador en: **`http://localhost:5173`**

---

## 3. Conmutación de Identidades Simuladas (Doble Control)

Para demostrar y auditar el protocolo de doble control administrativo y la evaluación de casos sin requerir servicios de autenticación externos, el sistema incluye en la barra superior un selector reactivo con el catálogo canónico de **5 identidades oficiales fijas**:

| Identidad Simulada | Rol en el Sistema | Atribuciones y Permisos |
| :--- | :--- | :--- |
| **`Diseñador 1`** | `Diseñador` | Usuario por defecto. Puede proponer y editar borradores de umbrales en F5. |
| **`Diseñador 2`** | `Diseñador` | Diseñador secundario para proponer y editar borradores. |
| **`Administrador 1`** | `Administrador` | Puede revisar, aprobar formalmente o desestimar propuestas de umbrales. |
| **`Administrador 2`** | `Administrador` | Administrador secundario independiente. |
| **`Operador 1`** | `Operador` | Operador autorizado para evaluar expedientes y revisar casos derivados en F4. |

> [!IMPORTANT]
> **Regla de Segregación Estricta:**
> Quien propone un borrador jamás puede auto-aprobarlo. Si una propuesta fue creada por `Diseñador 1`, la auto-aprobación es bloqueada preventivamente tanto en la interfaz como en la API (`403 Forbidden`). Para aprobar y poner en vigencia la nueva versión, conmuta la identidad activa en la barra superior a `Administrador 1` o `Administrador 2`.

---

## 4. Ejecución de la Suite de Pruebas Automatizadas

El proyecto cuenta con verificación integral automatizada:

### 4.1. Verificación de Tipos TypeScript
Garantiza cero discrepancias de tipos en backend, frontend y contratos compartidos:
```bash
npx tsc --noEmit
```

### 4.2. Pruebas Unitarias, Integración y Reproducibilidad (Vitest)
Ejecuta la totalidad de pruebas automatizadas sobre la base de datos de test (`data/mira.test.db`):
```bash
npm test
```
*Comandos granulares opcionales:*
- `npm run test:unit`: pruebas unitarias de cálculo ponderado, precedencia y validación.
- `npm run test:integration`: pruebas de API REST, sesión simulada, auditoría inmutable y triggers SQLite.
- `npm run test:reproducibility`: prueba extra-funcional de reproducibilidad histórica determinista al 100% (SC-004, Criterio C5).

### 4.3. Pruebas de Sistema Extremo a Extremo (Playwright E2E)
Instala los navegadores necesarios (solo la primera vez):
```bash
npx playwright install chromium
```
Ejecuta las pruebas E2E en navegador sobre una base de datos aislada (`data/mira.e2e.db`):
```bash
npm run test:e2e
```
*Cobertura E2E:*
1. **Doble control y segregación en F5 (`tests/e2e/doble-control-f5.spec.ts`):** propuesta v2 por Diseñador 1, bloqueo de auto-aprobación, aprobación por Administrador 1 y entrada en vigencia.
2. **Evaluación de casos en F4 (`tests/e2e/evaluacion-f4.spec.ts`):** dictamen determinista de los 6 casos sintéticos (`AC-1` a `AC-6`), badges técnicos y garantía de cero rechazo automático.
3. **Métricas de usabilidad (`tests/e2e/usabilidad-recorrido.spec.ts`):** acceso a políticas e historiales en ≤ 2 clics y tareas clave en < 3 minutos (SC-005, Criterio C4).

---

## 5. Verificación de Arranque en Máquina Limpia (C4)

Tiempos medidos en una instalación en frío con cachés de npm y Playwright vacías:

| Paso | Comando | Tiempo medido |
| :--- | :--- | :--- |
| Instalación de dependencias | `npm install` | 3,2 s |
| Inicialización y siembra de base de datos | `npm run db:seed` | 0,3 s |
| Descarga e instalación de navegador E2E | `npx playwright install chromium` | 31,1 s |
| Suite de pruebas unitarias e integración | `npm test` | 2,0 s |
| Suite de pruebas de sistema E2E | `npm run test:e2e` | 8,7 s |
| **Tiempo total acumulado** | | **≈ 45 s** |

- **Condiciones de medición:** Linux x86_64, Node.js `v26.5.0`, npm `11.17.0`, conexión doméstica rápida.
- **Alcance de la medición:** Cumple holgadamente el criterio C4 (< 15 minutos). La medición no incluye el tiempo previo de instalación de Node.js en el sistema operativo. `better-sqlite3` utilizó su binario precompilado sin necesidad de herramientas de compilación.

---

## 6. Problemas Conocidos y Solución de Errores

### 6.1. Advertencia de `allow-scripts` y compilación en `better-sqlite3`
- Durante `npm install`, npm puede emitir una advertencia respecto a scripts de instalación no cubiertos por `allow-scripts` (`better-sqlite3` y `esbuild`):
  ```text
  npm warn allow-scripts 2 packages have install scripts not yet covered by allowScripts:
  npm warn allow-scripts   better-sqlite3@12.11.1 (install: prebuild-install || node-gyp rebuild --release)
  npm warn allow-scripts   esbuild@0.28.2 (postinstall: node install.js)
  ```
- **Esta advertencia es meramente informativa y NO impide el funcionamiento del sistema:** se ha verificado empíricamente que la siembra (`npm run db:seed`), las pruebas automatizadas (`npm test`) y las pruebas E2E (`npm run test:e2e`) funcionan y pasan al 100% sin requerir aprobar scripts.
- `better-sqlite3` descarga e instala su binario nativo precompilado de forma predeterminada. Las herramientas de compilación C/C++ (`python3`, `make`, `gcc`/`g++`) solo son necesarias si el gestor de paquetes no logra descargar el binario precompilado para la arquitectura del sistema y requiere compilar desde el código fuente.

### 6.2. Conflicto de puertos ocupados (`3001` o `5173`)
- Si al ejecutar `npm run dev` aparece `EADDRINUSE: address already in use :::3001` o `Port 5173 is in use`, significa que otra instancia del servidor sigue activa.
- Para liberar los puertos en Linux:
  ```bash
  lsof -ti:3001,5173 | xargs kill -9 2>/dev/null || true
  ```

### 6.3. Error `Executable doesn't exist` en Playwright
- Si `npm run test:e2e` falla con un mensaje indicando que falta el ejecutable de Chromium, instala los binarios del navegador ejecutando:
  ```bash
  npx playwright install chromium
  ```

### 6.4. Aislamiento de bases de datos locales SQLite
- El sistema utiliza archivos SQLite locales dedicados e independientes que son ignorados automáticamente por Git:
  - `data/mira.db`: entorno de desarrollo interactivo (`npm run dev`).
  - `data/mira.test.db`: suite de pruebas Vitest (`npm test`).
  - `data/mira.e2e.db`: suite de pruebas Playwright (`npm run test:e2e`).
- `npm run db:seed` es idempotente: si la versión 1 ya existe, no inserta nada (muestra "Omitiendo inserción").
- Para reiniciar el entorno de desarrollo a valores de fábrica: detén `npm run dev`, ejecuta `rm -f data/mira.db*` y luego `npm run db:seed`.
- Esto afecta solo a `data/mira.db` (desarrollo). Las bases de test y E2E se recrean solas en cada ejecución.
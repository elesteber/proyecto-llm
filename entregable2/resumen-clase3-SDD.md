# Clase 3 — Spec-Driven Development (SDD)

Taller de Desarrollo de Software Conducido por Agentes de IA · Prof. Diego Gatica · Escuela de Ingeniería Informática, U. de Valparaíso

Flujo central: `specify → clarify → plan → tasks → implement`

---

## 1. Qué es SDD y qué problema resuelve

La especificación (`spec.md`) es el artefacto principal y el código se deriva de ella. El contexto vive en archivos versionados, no en el chat.

| Vibe coding (prompt-driven) | Spec-Driven Development |
|---|---|
| El contexto vive en el chat y se pierde | El contexto vive en archivos versionados |
| El agente rellena los huecos con supuestos | Lo ambiguo se marca `[NEEDS CLARIFICATION]` |
| Cada iteración renegocia el alcance | El alcance se congela antes de generar |
| No hay artefacto revisable antes del código | `spec.md` y `plan.md` se revisan como código |
| Rework alto: se corrige a mano | Rework menor: cambias el spec y regeneras |

**Costo real:** ~20–40 % más tokens por feature, a cambio de menos ciclos de corrección.

## 2. Ventajas

- **Menos rework:** un requisito ambiguo detectado en `clarify` cuesta una pregunta; detectado en `implement` cuesta un ciclo completo.
- **Trazabilidad:** cada criterio `AC-N` → un test → un comentario en el código. Sin eso el spec es "documentación muerta a las dos semanas".
- **Revisión antes del código:** se revisan `spec.md`, `plan.md` y `tasks.md` como si fueran código.
- **Alcance controlado:** el "fuera de alcance" explícito evita que el agente invente features.
- **Criterio de término objetivo:** la tarea está lista cuando `pytest` pasa, no cuando el código "se ve bien".
- **Independiente del agente:** el flujo es el mismo en Codex, Gemini CLI, Copilot, Cursor o Antigravity; solo cambia la sintaxis de invocación.
- **Contexto persistente y reutilizable:** `constitution.md` fija reglas transversales que todos los comandos leen antes de proponer nada.

## 3. Cuándo usar SDD (y cuándo no)

Criterio: el costo del error supera el costo de escribir el spec.

| Sí | No |
|---|---|
| Código que va a producción | Prototipo desechable de una tarde |
| Más de una persona toca la feature | Exploración: aún no sabes qué construir |
| Dominio con reglas de negocio densas | Script de un solo uso |
| Codebase con invariantes que respetar | El spec sería más largo que el código |
| La feature se va a auditar o certificar | Ya sabes exactamente el diff que quieres |

**Para llevarse:** empiezas vibe, terminas spec-driven. Lo que sobrevive al prototipo se especifica antes de volver a generarlo.

---

## 4. Cómo implementar SDD, paso a paso

### 4.1 Las tres capas (no confundirlas)

1. **Spec Kit** = andamiaje de archivos y plantillas (toolkit MIT de GitHub). No es un agente ni un modelo.
2. **Agente** (Codex, Gemini CLI, Copilot Chat, Cursor, Antigravity…) = quien lee y escribe los archivos.
3. **Modelo** (Gemini, Claude, etc.) = quien genera los tokens.

### 4.2 Instalación

```bash
# Requiere Python 3.11+ y uv
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify init taller-sdd --ai codex      # sintaxis de la clase
specify integration list                # ver agentes soportados
```

> La documentación actual del repo usa `--integration <clave>` en vez de `--ai <clave>` (ver sección 6).

Estructura que queda en el repo:

```
taller-sdd/
├── .specify/              plantillas y scripts
├── memory/
│   └── constitution.md    reglas del proyecto
├── .agents/skills/        los comandos, según el agente
└── specs/FEAT-014/
        ├── spec.md   plan.md   tasks.md
```

### 4.3 Los comandos, en orden

| Paso | Comando | Responde | Entrada → salida |
|---|---|---|---|
| 0 (una vez) | `constitution` | Reglas que ninguna fase puede violar (lenguaje, tests, prohibiciones, estilo de commits) | tu dictado → `constitution.md` |
| 1 | `specify` | **¿QUÉ** queremos? Contexto, criterios de aceptación numerados, alcance negativo. Sin stack | tu descripción → `spec.md` |
| 2 | `clarify` | ¿Qué falta o está ambiguo? Pregunta de a una, con opciones; las respuestas vuelven al spec | `spec.md` → `spec.md` actualizado |
| 3 | `plan` | **¿CÓMO** lo construimos? Arquitectura, contratos, modelo de datos, aquí se elige el stack | spec → `plan.md` + `research.md` + `data-model.md` |
| 4 | `tasks` | ¿Qué hay que hacer? Tareas ordenadas por dependencia y con los archivos que toca cada una | plan + spec → `tasks.md` |
| 5 | `implement` | Ejecuta tareas, genera código y tests, marca lo completado en `tasks.md` | tasks + plan → `src/` + `tests/` |

**Comandos de calidad (opcionales, pero los que más rework ahorran):**

| Comando | Qué hace | Cuándo |
|---|---|---|
| `clarify` | Busca ambigüedad en el spec | entre `specify` y `plan` |
| `checklist` | Lista de verificación sobre el propio spec: ¿completo, consistente, ambiguo? ("tests unitarios para el español del documento") | después de `plan` |
| `analyze` | Consistencia entre spec, plan y tareas antes de programar: requisitos sin tarea, tareas sin requisito, decisiones que violan la constitución. Entrega un reporte | entre `tasks` e `implement` |
| `converge` | Evalúa el código existente contra el spec y agrega al final de `tasks.md` lo que falta. Es la puerta de entrada para aplicar SDD sobre código que ya existe | tras `implement` / código existente |

Cuándo saltarse `clarify`: feature chica, dominio que conoces bien, spec de cuatro criterios sin zonas grises.

Existe además `taskstoissues` (convierte `tasks.md` en issues de GitHub; útil en equipo).

### 4.4 Quién conduce cada paso

- **`specify` y `clarify` los conduce el humano.** Si el modelo escribe el spec, después lo cumple y el ejercicio se vuelve circular.
- Del 3 al 5, el agente propone y tú corriges. **`plan` es donde más se equivoca:** revisar antes de seguir. Revisar también orden y tamaño de las tareas.
- Spec Kit **termina en `implement`**: no verifica que lo construido cumpla el spec. Eso lo cierran los tests.

### 4.5 Anatomía de un buen `spec.md` (ejemplo: FEAT-014, validación de RUT)

```markdown
# FEAT-014 — Validación de RUT chileno

## Contexto
El portal debe rechazar RUT mal formados antes de llegar al backend.

## Criterios de aceptación
AC-1  "12.345.678-5"  →  devuelve "123456785"
AC-2  dígito verificador malo  →  InvalidRutError
AC-3  DV "k" o "K"  →  se normaliza a "K"
AC-4  entrada vacía o no-str  →  InvalidRutError

## Fuera de alcance
No consulta al SII. No valida que el RUT exista.

## [NEEDS CLARIFICATION]
¿Se aceptan RUT de empresa (cuerpo > 8 dígitos)?
```

Cuatro reglas:
1. **Comportamiento, no implementación:** ni una palabra de FastAPI, regex o Pydantic (eso es `plan.md`).
2. **Criterios verificables:** cada `AC-N` tiene entrada y salida esperada y se convierte en un test 1:1. Si no se puede escribir como test, es un deseo.
3. **Alcance negativo explícito:** lo que NO se hace.
4. **Ambigüedad marcada, no adivinada:** el agente pregunta en vez de asumir.

### 4.6 Del spec a los tests y al código

- **Cada `AC-N` produce exactamente un test**, con la trazabilidad en el comentario (`# AC-1`). Se generan primero los tests: si el agente los escribe mal, se ve antes de que exista implementación.
- **El código referencia al spec; el spec no referencia al código** (`"""Implementa FEAT-014 (AC-1 a AC-4)."""`, `# AC-2`).
- **Regla del taller:** todo comentario de trazabilidad (`AC-N`, `FEAT-N`) es obligatorio y se revisa en el PR.
- La implementación no agrega nada fuera de alcance (no cachea, no loguea, no consulta el SII). "Eso es disciplina de spec."
- Criterio de término real: `pytest -q`.

### 4.7 Sesión completa de ejemplo

```text
specify init taller-sdd --ai codex
cd taller-sdd && codex

$speckit-constitution   Python 3.12, pytest, sin ORM
$speckit-specify        FEAT-014 validación de RUT
$speckit-clarify        responde las preguntas
$speckit-plan           revisa ANTES de seguir
$speckit-tasks
$speckit-analyze        pilla desincronizaciones
$speckit-implement

pytest -q               # criterio de término real
```

---

## 5. Ruta con API (Gemini): solo si usas agente con API key

La clase muestra esta ruta para el laboratorio. Si trabajas con un IDE sin API (Antigravity), esta sección **no aplica**, pero explica por qué importa la cuota.

- **Un comando NO es un request:** el agente itera (lee archivos, llama tools, escribe, verifica). Un `plan` son 3–5 requests y el loop completo, **25–35 requests**.
- **Free tier de Google AI Studio** (cifras de un proyecto concreto; Google no las publica y las cambia sin aviso):

| Modelo | RPM | TPM | RPD | Rol |
|---|---|---|---|---|
| Gemini 3.x Flash Lite | 15 | 250K | 500 | Caballo de batalla del loop |
| Gemini 3.x Flash | 5 | 250K | 20 | Reserva: solo si Flash Lite falla dos veces seguidas |
| Gemma 4 26B / 31B | 30 | 16K | 14.400 | Llamadas sueltas; el spec completo no le cabe |
| 2.5 Pro · 3.1 Pro · Veo | 0 | 0 | 0 | No están en free tier |

- **Modelo por fase:** `specify`/`clarify` → ninguno (lo escribe el alumno); `plan`/`tasks` → Flash Lite; `implement` → Flash Lite, y si falla dos veces seguidas, subir a Flash.
- **Automatizar spec → código:** endpoint compatible con OpenAI (`https://generativelanguage.googleapis.com/v1beta/openai/`), `temperature=0.2`, el spec va entre `<spec>…</spec>`, y el prompt prohíbe inventar requisitos y obliga a detenerse ante `[NEEDS CLARIFICATION]`.
- **Conectar VS Code (BYOK):** crear key en aistudio.google.com → Copilot Chat → *Manage Models…* → *Add Models* → Gemini. No requiere plan Copilot.
- **Gemini CLI:** `npm install -g @google/gemini-cli`, `export GEMINI_API_KEY=...`, `specify init taller-sdd --ai gemini`. Contexto de 1M tokens.
- **Smoke test** antes de depurar la UI: `curl` al endpoint `/openai/models` con la key. La key nunca va en el repo ni en `settings.json` (`.env` en `.gitignore`).

---

## 6. Usar Spec Kit en IDEs sin API (Antigravity y similares)

Fuente: repo oficial [github/spec-kit](https://github.com/github/spec-kit) y su [referencia de integraciones](https://github.github.io/spec-kit/reference/integrations.html).

**Idea clave:** Spec Kit no necesita API key propia. Solo escribe plantillas y comandos dentro de la carpeta del proyecto en el formato que tu agente entiende. Es el agente del IDE (con su propia sesión/cuenta) quien ejecuta los comandos, así que las cuotas de la sección 5 no te afectan directamente.

### 6.1 Pasos con Antigravity

```bash
uv tool install specify-cli                   # requiere Python 3.11+ y uv
specify init mi-proyecto --integration agy    # "agy" = Antigravity
cd mi-proyecto
```

1. Abre la carpeta del proyecto en Antigravity.
2. Abre el chat del agente.
3. Invoca los comandos **dentro del chat**, uno a la vez (no son comandos de terminal):

```text
/speckit-constitution  Principios de calidad, testing y mantenibilidad...
/speckit-specify       <qué quieres construir>
/speckit-plan          <stack y restricciones técnicas>
/speckit-tasks
/speckit-implement
/speckit-converge
```

4. Revisa cada resultado antes de continuar.

### 6.2 Datos útiles de la documentación

- Antigravity (`agy`) usa **modo skills** y se instala en `.agents/skills/` (igual que Codex). Claude Code usa `.claude/skills`; Copilot, `.github/skills/`.
- **Sintaxis según el agente:**

| Agente / modo | Ejemplo |
|---|---|
| Copilot (skills por defecto), Antigravity, Claude Code | `/speckit-specify` |
| Notación con punto (referencias antiguas) | `/speckit.specify` |
| Codex | `$speckit-specify` |
| Kimi | `/skill:speckit-specify` |

  Si un comando no se reconoce, prueba la otra notación: **mismo flujo, invocación distinta**.
- `specify integration list` muestra qué integraciones existen y si son de CLI o de IDE. Cursor, Cline y Firebender se describen como IDE-based ("funcionan a través del IDE").
- Comandos de gestión: `specify integration install|switch|use|upgrade|uninstall|status <clave>`; `switch` o `use` permite cambiar de agente en el mismo proyecto sin perder los artefactos.
- Con Antigravity en modo headless se puede aprobar tools automáticamente con `SPECKIT_AGY_ALLOW_ALL_TOOLS=1` (usa `--dangerously-skip-permissions`; solo si sabes lo que haces).
- **Código existente:** `converge` y la [guía de proyectos existentes](https://github.github.io/spec-kit/guides/existing-projects.html). Se repite `implement` → `converge` hasta que el reporte diga **Converged**.
- El README actual solo muestra los comandos núcleo (`constitution`, `specify`, `plan`, `tasks`, `implement`, `converge`) y dice que clarificación, checklists y análisis de consistencia son compuertas de calidad opcionales; los nombres `clarify`, `analyze` y `checklist` salen de las diapositivas de la clase. Si no aparecen en tu agente, revisa `.agents/skills/` para ver qué skills quedaron instaladas.
- El repo también ofrece extensiones (`specify extension add bug` / `assess`), presets y workflows (ver la guía de personalización).

---

## 7. Ejercicio de la clase (Andesware Consultores)

Herramienta de escritorio para que consultores registren horas (duración, proyecto, descripción) en el momento, **con y sin conexión**, sincronizando luego con el servidor central existente. Restricciones: sin nueva infraestructura (sin motor de base de datos que instalar ni procesos permanentes en segundo plano).

Puntos que el spec debe resolver con `clarify`:
1. Envío interrumpido a la mitad: no contabilizar horas dos veces (idempotencia).
2. Qué pasa si se detecta un error después de enviar un registro (se puede corregir hasta que se facture; después no).
3. Un consultor con más de un computador.
4. Qué prevalece cuando lo local difiere del servidor (conflictos).

**Entregable de la sesión:** `spec.md` con al menos 4 criterios de aceptación, los tests generados y el reporte de `pytest`. Se evalúa la **trazabilidad**, no la elegancia.

---

## 8. Conexión con el Entregable 2 (MIRA)

Las fases de SDD de la clase coinciden con las que exige el enunciado de la Opción A:

| Fase del Entregable 2 | Comando | Condición específica del enunciado |
|---|---|---|
| Constitución | `constitution` | Incorporar las decisiones DEC de la Entrega 1 que apliquen, citando su ID |
| Especificación | `specify` | Conservar los ID de la Entrega 1 (RQF-xxx); requisitos nuevos con ID nuevo y fuente |
| Aclaración | `clarify` | Responder las preguntas con el representante del cliente y citar fuente o decisión |
| Plan | `plan` | Declarar qué RQNF atiende y cómo se verifican |
| Tareas | `tasks` | Cada tarea referencia al menos un requisito |
| Análisis de consistencia | `analyze` | Si la herramienta no lo ofrece, hacerlo con un prompt propio y adjuntarlo |
| Implementación | `implement` | Un commit o PR por tarea o grupo coherente |

Recordatorios aplicables: los artefactos se versionan fase por fase (no en una sola carga), las correcciones humanas van en un commit propio, y las pruebas deben verificar los criterios de aceptación de la Entrega 1, no el comportamiento que el código ya tiene.
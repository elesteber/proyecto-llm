# Clase 4 — BMAD Method (Breakthrough Method for Agile AI-Driven Development)

Taller de Desarrollo de Software Conducido por Agentes de IA · Prof. Diego Gatica · Escuela de Ingeniería Informática, U. de Valparaíso

Idea central: tratar a la IA como a un equipo de software: **roles especializados, entregas documentadas y manuales repetibles**.

---

## 1. Qué es BMAD y qué problema resuelve

**Definición:** un método distribuido como archivos: roles de agentes escritos en Markdown y YAML, más workflows, plantillas y un instalador CLI que los integra con tu LLM favorito. **No es un producto, un IDE ni un servicio hospedado**; son archivos de prompts y workflows.

| Dato | Valor |
|---|---|
| Licencia | MIT, libre y sin muros de pago |
| Versión | v6 (línea actual 2026; la clase cita v6.11, consultada el 30-08-2026) |
| Popularidad | ~52k estrellas en GitHub |
| Modelo | BYOM (usa tu propio modelo) |

**Problemas que ataca:**
1. Delegar el pensamiento crítico a la IA y programar "por sensaciones" en vez de forma sistemática.
2. En SDD la spec persiste, pero el proceso no define necesariamente roles especializados ni traspasos (handoffs).

> No es un problema de modelo, es un problema de **proceso**. Modelos mejores no lo resuelven solos. BMAD no mejora el modelo: mejora el proceso alrededor del modelo.

---

## 2. Vibe coding vs SDD vs BMAD

Tres formas de programar con IA: **Conversación** (vibe coding) → **Especificación** (SDD) → **Equipo simulado** (BMAD, "agentic agile"). A mayor control y trazabilidad, mayor costo de proceso. La pregunta no es cuál es mejor, sino cuál corresponde al trabajo.

| Dimensión | Vibe coding | SDD (p. ej. Spec Kit) | BMAD Method |
|---|---|---|---|
| Fuente de verdad | El chat | El spec versionado | Spec + PRD + arquitectura + historias |
| Unidad de trabajo | El prompt | La especificación | Intención, spec, issue o historia |
| Roles | Uno solo: tú y el LLM | Habitualmente uno, guiado por plantillas | Equipo simulado: PM, arquitecto, dev, UX, QA |
| Planificación | Habitualmente ninguna | Previa y explícita | Adaptativa a la escala del cambio |
| Trazabilidad | Habitualmente muy baja | Alta sobre el spec | Alta de punta a punta |
| Costo de proceso | Mínimo | Medio | Variable: se adapta a la escala |
| Mejor para | Prototipo desechable | Feature bien acotada | Producto que evoluciona con un equipo |

### ¿BMAD es SDD?

- **Cumple la definición:** el PRD, el documento de arquitectura y los archivos de historia son artefactos versionados que dirigen la implementación.
- **Y la amplía** con roles, planificación adaptable, implementación y revisión posterior.
- **Spec-first vs agile-simulation-first:** Spec Kit, Kiro y OpenSpec parten del formato de especificación y agregan proceso; BMAD parte del equipo ágil simulado y agrega elementos spec-driven. El resultado se parece; el punto de entrada y el vocabulario no.
- Progresión del curso: prompting → vibe coding → SDD/Spec Kit → **BMAD (hoy)** → MCP, RAG, evals. "No es de peor a mejor, es de menos a más estructura."

### Equivalencias Spec Kit → BMAD

| Spec Kit | BMAD | Qué cambia |
|---|---|---|
| `constitution` | `AGENTS.md` (`bmad-project-context`) | Ambos persisten reglas para los agentes, con alcance y mecanismo distintos |
| `specify` | `bmad-prd` + `bmad-spec` | Separa el producto (`prd.md`) del contrato técnico (`SPEC.md`) |
| `clarify` | no es un comando | La elicitación va dentro de cada workflow: el agente pregunta mientras avanza |
| `plan` | `bmad-architecture` | `ARCHITECTURE-SPINE.md` como columna vertebral de las decisiones |
| `tasks` | `bmad-create-epics-and-stories` | Épicas e historias con criterios, no una lista plana de tareas |
| `analyze` / `checklist` | `bmad-sprint-planning` | Compuerta antes de codificar: PASS, CONCERNS o FAIL |
| `implement` | `bmad-build` (una historia por vez) | Unidad del tamaño de una sesión, con checkpoint humano en el diff |
| — | `bmad-code-review`, `bmad-correct-course`, `bmad-retrospective` | Spec Kit llega hasta implementación; BMAD modela workflows posteriores |

La equivalencia es de **fases, no de comandos**: Spec Kit tiene un comando por artefacto; BMAD, un skill por rol y fase.

---

## 3. Ventajas

- **Contexto que persiste:** las decisiones quedan explícitas en archivos versionados y el contexto viaja hacia adelante en vez de reexplicarse en cada chat. "El valor está en el contexto que persiste, no en la cantidad de agentes."
- **Trazabilidad de punta a punta:** brief → PRD → spec → arquitectura → historias → código → revisión.
- **Escala adaptativa:** no todo necesita un PRD; el proceso crece o se achica según el trabajo.
- **Las preguntas son el valor:** cada pregunta del agente que respondes reduce una ambigüedad que, en vibe coding, el LLM resolvería en silencio inventando una decisión.
- **Checkpoints humanos:** `bmad-build` se detiene y muestra el diff; tú decides.
- **Cobertura posterior a la implementación:** revisión de código, corrección de rumbo y retrospectiva basada en evidencia.
- **Libre y agnóstico del modelo/herramienta** (MIT, BYOM).

## 4. Riesgos y límites

| Riesgo | Detalle |
|---|---|
| Costo de tokens | La planificación completa consume bastante. Los *Web Bundles* permiten hacer parte de la planificación en ChatGPT o Gemini y llevar los artefactos al IDE |
| Superficie de seguridad | Agentes con acceso al repo y herramientas externas: trifecta letal e inyección de prompts. **Los artefactos también son entrada no confiable** |
| Ceremonia excesiva | El proceso puede volverse el producto: si se pasa más tiempo generando documentos que decidiendo, la escala está mal elegida |
| Dependencia del método | Se puede aprender a operar BMAD sin aprender diseño de software. El método ordena; el criterio sigue siendo humano |

---

## 5. Anatomía

### 5.1 Módulos

| Módulo | Sigla | Para qué sirve |
|---|---|---|
| BMad method | BMM | Núcleo: planificar y entregar software, de prototipo a código heredado (**el que se usa en clase**) |
| BMad Builder | BMB | Crear tus propios agentes, skills y workflows |
| Creative Intelligence Suite | CIS | Innovación, design thinking y narrativa |
| Test Architect | TEA | Estrategia de pruebas basada en riesgo, nivel empresa |
| Core | core | Se instala siempre: tareas compartidas, workflows utilitarios, configuración global |
| Game Dev Studio | BMGD | Unity, Unreal, Godot y Phaser |

### 5.2 Agentes con nombre

Cada agente se invoca como un skill y expone un menú de disparadores cortos (PRD, CA, BD, CR…).

| Agente | Skill | Qué hace |
|---|---|---|
| **Mary** · Analista | `bmad-agent-analyst` | Brainstorm, deep recon, selección tecnológica, análisis competitivo, investigación de usuarios, product brief, project context |
| **John** · Product Manager | `bmad-agent-pm` | PRD (crear/actualizar/validar), épicas e historias, corregir rumbo |
| **Winston** · Arquitecto | `bmad-agent-architect` | Definición y validación de arquitectura, decisiones tecnológicas |
| **Amelia** · Desarrolladora | `bmad-agent-dev` | Build, pruebas E2E, code review, sprint, retro |
| **Sally** · Diseñadora UX | `bmad-agent-ux-designer` | `DESIGN.md` y `EXPERIENCE.md` |

### 5.3 Skills y workflows

Un **skill** es un archivo de instrucciones que tu herramienta de IA carga bajo demanda. Puede ejecutar un **workflow**: secuencia de pasos con puntos de entrada humana y un artefacto de salida definido.

`Invocas el skill → Pregunta y elicita → Propone borrador → Revisas y corriges → Escribe el artefacto`

| Lo que aporta el agente | Lo que aportas tú |
|---|---|
| Método, preguntas correctas, plantilla del artefacto y consistencia entre sesiones | Criterio de negocio, restricciones reales y la decisión final en cada checkpoint |

### 5.4 Artefactos que cargan el contexto

Todos son archivos de texto versionados en git (esa es la diferencia con el historial de un chat).

| Artefacto | Lo produce | Qué preserva |
|---|---|---|
| `brief.md` / `addendum.md` | `bmad-product-brief` | Visión estratégica, problema y anexos |
| `prd.md` | `bmad-prd` | Requisitos de producto, alcance y criterios |
| `SPEC.md` | `bmad-spec` | Contrato: por qué, capacidades, restricciones, no-objetivos, señal de éxito |
| `DESIGN.md` / `EXPERIENCE.md` | `bmad-ux` | Lo visual y lo conductual de la interfaz |
| `ARCHITECTURE-SPINE.md` | `bmad-architecture` | Decisiones técnicas, patrones y límites |
| archivos de épica | `bmad-create-epics-and-stories` | Trabajo partido en unidades implementables |
| `stories.yaml` | `bmad-spec` (Story Breakdown) | Historias de una épica, cuando se pide el desglose |
| `AGENTS.md` | `bmad-project-context` | Reglas del repo que todo agente debe respetar |

---

## 6. Cómo implementar BMAD

### 6.1 Las cuatro fases

| Fase | Pregunta | Skills principales | Salida |
|---|---|---|---|
| 1. Análisis (opcional) | ¿Vale la pena esta idea? | `bmad-brainstorming`, `bmad-forge-idea`, `bmad-deep-recon`, `bmad-product-brief`, `bmad-prfaq` | `brief.md`, reportes |
| 2. Planificación | ¿Qué construimos y para quién? | `bmad-prd`, `bmad-ux`, `bmad-spec` | `prd.md`, `SPEC.md`, `DESIGN.md` |
| 3. Solución | ¿Cómo lo construimos? | `bmad-architecture`, `bmad-create-epics-and-stories`, `bmad-sprint-planning` | arquitectura, épicas, `sprint-status.yaml` |
| 4. Implementación | ¿Está hecho y bien hecho? | `bmad-build`, `bmad-build-auto` (autónomo), `bmad-code-review`, `bmad-correct-course`, `bmad-retrospective` | código, registro de implementación y retro con veredicto |

Si te pierdes: invoca **`bmad-help`** y pregunta qué corresponde ahora.

### 6.2 Escala adaptativa (qué recorrido elegir)

| Trabajo | Recorrido |
|---|---|
| Arreglar un bug o un texto | `bmad-build` directo |
| Feature acotada de una sesión | `bmad-spec` → `bmad-build` |
| Épica de varias sesiones | `bmad-spec` (+ Story Breakdown) → `stories.yaml` → `bmad-build` por historia |
| Producto nuevo multi-épica | brief → PRD → UX → arquitectura → épicas → sprint → build |
| Código heredado o reglas poco conocidas | considerar `bmad-project-context` antes de construir |

> El error más caro del principiante es planificar de más un cambio trivial; el segundo, no planificar nada.

### 6.3 Flujo para un proyecto desde cero (8 pasos)

1. **Preparar:** `git init` + instalar BMAD + elegir BMM.
2. **Encuadrar:** `bmad-product-brief` (problema, usuarios, alcance).
3. **Definir:** `bmad-prd` → `prd.md` (producto, alcance, criterios).
4. **Diseñar:** `bmad-ux` y `bmad-architecture`, cuando correspondan.
5. **Partir:** `bmad-create-epics-and-stories` → archivos de épica.
6. **Contratar:** `bmad-spec` por épica; Story Breakdown → `stories.yaml`.
7. **Construir:** `bmad-sprint-planning` y luego `bmad-build` por unidad.
8. **Cerrar:** `bmad-code-review` + `bmad-retrospective`.

No todos los pasos son obligatorios: la escala decide. **Commit después de cada artefacto.**

### 6.4 Instalación (según la clase)

Prerrequisitos: **Node.js 20.12+** (obligatorio), una herramienta de IA soportada (Claude Code, Cursor, Copilot, Windsurf…), **uv** (lo exigen `bmad-build` y `bmad-build-auto`; sin él la instalación termina igual pero esos skills no funcionan), Python 3.11+ (3.12 para el backend del taller) y Git.

```bash
# Linux (Ubuntu/Debian): Node vía nvm y uv
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc && nvm install 20 && nvm use 20
curl -LsSf https://astral.sh/uv/install.sh | sh

# Crear proyecto e instalar BMAD dentro
mkdir hilo-puerto && cd hilo-puerto && git init
npx bmad-method install          # interactivo: elegir BMM y la herramienta de IA
```

- **macOS:** `brew install node@20 python@3.12 uv git`, luego lo mismo.
- **Windows (PowerShell, sin admin):** `winget install OpenJS.NodeJS.LTS`, `Python.Python.3.12`, `Git.Git`, uv con `irm https://astral.sh/uv/install.ps1 | iex`; cerrar y reabrir la terminal. **Recomendado: WSL2** (`wsl --install -d Ubuntu`), usando el Node de Ubuntu y no el `node.exe` de Windows. Opción del curso: `git config --global core.autocrlf input`.
- Verificar: `npx bmad-method install --list-tools` (herramientas soportadas); `npx bmad-method@next install` (versión de prueba, cambia seguido).
- Debe decir **"BMAD is ready to use!"**. Queda `_bmad/` (configuración compartida y scripts) y los skills en el directorio de cada herramienta de IA elegida.
- Prueba final: abrir la herramienta de IA en la carpeta e invocar `bmad-help` preguntando qué hacer.

### 6.5 Skills por fase (referencia rápida)

**Fases 1 y 2**

| Skill | Qué hace | Produce |
|---|---|---|
| `bmad-brainstorming` | Lluvia de ideas guiada | `brainstorm.html` + intent opcional |
| `bmad-forge-idea` | Somete la idea a presión hasta que se endurece o muere barato | `forge-report.html`, `forged-idea.md` |
| `bmad-deep-recon` | Investiga un tema para decidir; seis paquetes tipificados y citados | `research.md` citado |
| `bmad-product-brief` | Captura la visión cuando el concepto ya está claro | `brief.md` + `addendum.md` |
| `bmad-prfaq` | Working Backwards: valida el concepto desde el cliente | `prfaq-{proyecto}.md` |
| `bmad-prd` | Crea, actualiza o valida el PRD (tres intenciones en un skill) | `prd.md`, `addendum.md`, `.memlog.md` o informe |
| `bmad-ux` | Diseña la experiencia cuando la UX importa | `DESIGN.md` + `EXPERIENCE.md` |
| `bmad-spec` | Destila cualquier entrada en un contrato `SPEC.md` | `SPEC.md` + `stories.yaml` bajo solicitud |

**Fases 3 y 4**

| Skill | Qué hace | Produce |
|---|---|---|
| `bmad-architecture` | Hace explícitas las decisiones técnicas | `ARCHITECTURE-SPINE.md` |
| `bmad-create-epics-and-stories` | Parte los requisitos en trabajo implementable | épicas con historias |
| `bmad-sprint-planning` | Compuerta de preparación y seguimiento de historias | PASS/CONCERNS/FAIL + `sprint-status.yaml` |
| `bmad-build` | Implementa y revisa una unidad con checkpoints humanos | código + registro de implementación |
| `bmad-build-auto` | Lo mismo, sin supervisión (trabajador para un orquestador) | código + estado terminal |
| `bmad-code-review` | Revisión ad hoc de cualquier cambio | hallazgos clasificados (patch / defer / decision needed) + parches |
| `bmad-correct-course` | Maneja un cambio grande a mitad de sprint | plan actualizado o re-ruteo |
| `bmad-retrospective` | Revisa la épica terminada contra sus criterios | retro, acciones y veredicto |

Transversales: `bmad-help` (qué hago ahora) y `bmad-project-context` (mantiene `AGENTS.md`).

---

## 7. Instalar BMAD en IDEs sin API (Antigravity y similares)

Fuente: repo [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) y [docs.bmad-method.org](https://docs.bmad-method.org/).

**Idea clave:** BMAD son archivos (skills) que tu herramienta carga; no pide API key propia. La inferencia la hace el agente del IDE con su propia sesión o cuenta. Funciona con cualquier herramienta que soporte skills.

### 7.1 La instalación actual difiere de la clase

La documentación vigente instala con el **Skills CLI**, no con `npx bmad-method install` (que es lo que muestran las diapositivas, v6.11):

```bash
cd mi-proyecto && git init
npx skills add bmad-code-org/BMAD-METHOD      # elegir la herramienta (Antigravity) y los skills
# o instalar un conjunto por nombre:
npx skills add bmad-code-org/BMAD-METHOD --skill bmad --skill bmod-core-tools --skill bmod-method --skill bmad-build
```

Requisitos: Node + npm, Git, una herramienta de IA que soporte skills y `uv`.

Luego:
1. Abrir Antigravity en la carpeta del proyecto.
2. En el chat, pedir al skill `bmad` que ejecute **`bmad setup`** (instala el runtime compartido y scripts en `_bmad/`).
3. Pedir **`bmad status`** para verificar versiones.
4. Usar `bmad` para saber qué sigue, o invocar `bmad-build` con el cambio que quieres.

Carpetas: `_bmad/` (configuración y scripts), `_bmad/custom/` (personalizaciones que sobreviven a las actualizaciones) y `_bmad-output/` (documentos y tickets).

### 7.2 Datos útiles para Antigravity

- **Dónde quedan los skills:** Antigravity usa **`.agent/skills/`** (ojo: `.agent`, sin "s"). Claude Code, `.claude/skills/`; Cursor, Windsurf, Codex y la mayoría, `.agents/skills/`; Cline, `.cline/skills/`. El instalador muestra la ruta exacta.
- **Cómo invocar:** escribir el nombre del skill (`bmad`, `bmad-prd`…); en algunas plataformas lleva prefijo `/` o `$`. Para agentes: cargar el agente por su skill ID (`bmad-agent-dev`) y luego un código de menú (`BD`, `CR`…). Los códigos dependen del agente: `CR` es *competitive teardown* para el Analista y *code review* para la Desarrolladora.
- Si un skill no aparece tras instalar: habilitar skills en los ajustes del IDE y reiniciar o recargar la ventana.
- Usa **un solo método de instalación por skill** (CLI o plugin) para no duplicar comandos.
- **Actualizar:** pedir `bmad setup` (ejecuta `npx skills update` y refresca el proyecto) o `npx skills update` y luego `bmad setup`.
- **Código existente:** guía [Add BMad to an existing codebase](https://docs.bmad-method.org/existing-codebases/start-in-an-existing-codebase/) y `bmad-project-context`.
- **Diferencias con las diapositivas** (documentación más nueva): aparece `bmad-ticket` (planifica y sigue iniciativas, épicas y entradas), `bmad-qa-generate-e2e-tests`, `bmad-review`, `bmad-walkthrough`, `bmad-party-mode` y `bmad-advanced-elicitation`; la Analista y el PM tienen códigos como `PRD`, `CC`, `TK`. El Technical Writer (Paige) está en pausa. No encontré en esas páginas la lista completa de herramientas soportadas ni `--list-tools`, así que conviene confirmar en el propio instalador.

---

## 8. Caso práctico de la clase: "Hilo Puerto"

Marca de ropa de Valparaíso, 8 prendas. Página con catálogo, elegir una prenda y pagar con tarjeta. Sin cuentas, sin carrito multi-ítem, sin despacho. Debe registrarse la orden pagada.

**Stack:** React + Vite + TypeScript · Python 3.12 + FastAPI · Stripe Checkout + webhook · SQLite (una tabla de órdenes). Sirve porque tiene requisitos no funcionales reales: dinero, seguridad de claves y un flujo asíncrono (el webhook) que el vibe coding suele implementar mal.

| Paso | Skill | Resultado |
|---|---|---|
| 1. Brief | `bmad-product-brief` | Marca local, 8 prendas, vende por Instagram y transferencia; éxito = primera venta pagada sin intervención manual |
| 2. PRD | `bmad-prd` (crear) | El agente pregunta y tú decides: ¿invitado o cuenta? → invitado · ¿una prenda o carrito? → una · ¿devoluciones? → fuera de alcance · ¿stock? → manual |
| 3. Contrato | `bmad-spec` | `SPEC.md` con el kernel de cinco campos |
| 4. Arquitectura | `bmad-architecture` | Stripe Checkout alojado (no Elements): el sitio nunca toca datos de tarjeta |
| 5. Épica 1 | `bmad-create-epics-and-stories` | 5 historias (catálogo, sesión de pago, botón React, webhook, páginas éxito/cancelación) |
| 6-7. Build | `bmad-sprint-planning` → `bmad-build` | Checkpoint humano en cada diff |
| 8. Cierre | `bmad-code-review` + `bmad-retrospective` | Hallazgos típicos: clave en el repo, CORS abierto, falta de idempotencia |

**El kernel de `SPEC.md`:** *Problem · Capabilities · Constraints · Non-goals · Success signal.* "Los no-objetivos son el campo que más ahorra: son la instrucción explícita de no construir lo que no pediste."

Ejemplos de lo que baja del spec al código:
- Constraint "montos calculados en el servidor" → `unit_amount` sale de `PRODUCTOS`, no del request.
- Constraint "claves de Stripe solo en el backend" → `os.environ["STRIPE_SECRET_KEY"]`.
- Historia 1.4: el webhook verifica la firma (`construct_event`) y es **idempotente** (Stripe reenvía).
- Probar: `stripe listen --forward-to localhost:8000/api/webhooks/stripe`, tarjeta `4242 4242 4242 4242`.

La compuerta `bmad-sprint-planning` evalúa cada historia antes de construir: **PASS, CONCERNS o FAIL**.

**Estructura del caso:** 5 historias, 3 checkpoints humanos, 7 archivos de contexto, 1 épica cerrada con retro.

---

## 9. Buenas prácticas y anti-patrones

| Hazlo | Evítalo |
|---|---|
| Commit por artefacto, no solo por código | Correr todas las fases para arreglar un typo |
| Mantén `AGENTS.md` vivo con las reglas del repo | Aceptar el PRD sin discutir una sola pregunta |
| Lee el diff en cada checkpoint: es tu trabajo | Dejar que el agente decida el modelo de datos solo |
| Escribe los no-objetivos con la misma seriedad que los objetivos | Editar el SPEC sin revalidar el Story Breakdown ni los artefactos dependientes |
| Considera `bmad-project-context` antes de entrar en código heredado | Confundir "el agente lo revisó" con "está revisado" |

**Regla del curso:** si no puedes explicar por qué el código quedó así, no está terminado.

---

## 10. Taller de la clase

En parejas, desde el repositorio base (React + FastAPI + Stripe), instalar BMAD y llevar de punta a punta una tienda de un solo producto con pago Stripe en modo prueba, en 150 minutos. Entregan el repositorio con los artefactos versionados y un video de 3 minutos con el pago funcionando.

| Criterio | Peso |
|---|---|
| Artefactos completos y versionados | 30 % |
| Calidad del SPEC: no-objetivos y restricciones | 25 % |
| Pago funcionando de punta a punta | 25 % |
| Evidencia de revisión humana en los diffs | 20 % |

Claves de prueba de Stripe; cualquier clave real en el repo es nota mínima en seguridad.

---

## 11. Conexión con el Entregable 2 (Opción B: BMAD)

El enunciado exige estos roles y artefactos. La columna de skills es una correspondencia mía con lo que muestra la clase; la tabla del enunciado usa roles clásicos de BMAD (PO, SM, QA) que no aparecen como agentes con nombre en v6.

| Rol del enunciado | Artefacto mínimo | Skill de la clase | Condición del enunciado |
|---|---|---|---|
| Analyst | Project brief | `bmad-product-brief` (Mary) | Construido desde el informe de la Entrega 1; cita las DEC y los H que acotan el alcance |
| PM | PRD | `bmad-prd` (John) | Requisitos con el ID de la Entrega 1 (RQF-xxx); los nuevos con ID nuevo y fuente |
| UX Expert | Especificación de interfaz | `bmad-ux` (Sally) → `DESIGN.md` + `EXPERIENCE.md` | **Obligatorio** en esta entrega |
| Architect | Documento de arquitectura | `bmad-architecture` (Winston) → `ARCHITECTURE-SPINE.md` | Declara qué RQNF atiende y cómo se verifican |
| PO | Validación y fragmentación de documentos | `bmad-prd` (intención validar), `bmad-spec` y la compuerta `bmad-sprint-planning` | Registra las inconsistencias entre PRD y arquitectura |
| SM | Historias | `bmad-create-epics-and-stories` | Cada historia referencia la HU de origen del backlog de la Entrega 1 |
| Dev y QA | Código, pruebas y revisión de QA | `bmad-build` (Amelia), `bmad-qa-generate-e2e-tests`, `bmad-code-review` | Un commit o PR por historia; la revisión de QA queda en el repositorio |

Recordatorios aplicables: commit por artefacto (el historial debe mostrar la secuencia de fases), correcciones humanas en un commit propio, y las pruebas deben verificar los criterios de aceptación de la Entrega 1, no el comportamiento que el código ya tiene.

---

## 12. Para llevarse

1. BMAD no mejora el modelo: mejora el proceso alrededor del modelo.
2. Incorpora principios spec-driven y los amplía con roles, fases y revisión.
3. El valor está en el contexto que persiste, no en la cantidad de agentes.
4. Elegir la escala correcta del proceso es la habilidad profesional real.

**Fuentes de la clase:** BMAD Method v6.11 (consultado 30-08-2026) · github.com/bmad-code-org/BMAD-METHOD · docs.bmad-method.org · docs.stripe.com/checkout · arXiv 2509.06216 · arXiv 2606.04967 (preprint no revisado por pares: comparación BMAD / Spec Kit).
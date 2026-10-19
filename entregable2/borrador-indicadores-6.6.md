# Borrador — Indicadores cuantitativos de la sección 6.6 (Comparativa con la Entrega 1)

> Material de trabajo para Angel Salgado. No es el informe final: es la base de datos y el cálculo ya hecho, lista para redactar 6.6. Fecha de cálculo: 2026-10-19, sobre `main` en `b9f5f2d` (post-PR #23, pre-tag `v2.0`).

---

## 0. Advertencia metodológica — Inconsistencia por trabajo de IA en la propia documentación de la Entrega 2

**Hallazgo a declarar en el informe (6.3 o 6.7), no ocultar:** parte del trabajo de documentación de esta misma Entrega 2 —las filas `INT-021` a `INT-023` de la bitácora, las 15 fichas `DEC-02` a `DEC-16`, y el cálculo de los indicadores de este mismo archivo— fue producido con asistencia de un agente de IA (Claude Code) operando bajo la identidad de commit de Angel Salgado (`ange-salgado-m`), en ramas separadas (`feat/bitacora-int018-023`, `feat/fichas-dec-02-16`) todavía no fusionadas a `main` al momento de este cálculo.

**Por qué se excluye del cómputo de TIH/IRF:** el indicador TIH mide intervención *humana* sobre lo que el agente generó durante el ciclo SDD real del equipo. Si estos commits se contabilizaran como `[HUMAN-FIX]`/`[DOC]` legítimos, el indicador mediría en parte la intervención de un agente sobre su propia documentación, no la intervención humana del equipo — distorsionando el propio objeto de medición. Por eso:

- Los indicadores de este archivo (§1-§3) se calculan **solo sobre lo que hoy está en `main`**, es decir, sobre el trabajo del equipo (Lester, Rodrigo, Jorge) tal como quedó en el historial hasta el PR #23.
- Si en algún momento se fusionan `feat/bitacora-int018-023` y `feat/fichas-dec-02-16`, esos commits **no deben sumarse** al numerador de TIH ni al denominador de IRF de ninguna fase. Se recomienda registrarlos con un prefijo distinto (p. ej. `[DOC-IA-ASISTIDA]`) o, como mínimo, señalarlos aparte en la nota al pie de la tabla de indicadores del informe final.
- Esto se documenta como una inconsistencia propia de la Entrega 2 (no heredada de la E1): el equipo usó IA para redactar parte de su propia evidencia de trazabilidad, lo cual debe declararse con la misma honestidad que exige el Principio V de la constitución para cualquier otro artefacto generado por agente.

---

## 1. TIH — Tasa de Intervención Humana en Código

**Fórmula (DEC-E2-08):** `TIH = Commits de corrección humana / Commits de tareas × 100`

| Dato | Valor | Cómo se obtuvo |
|---|---|---|
| Commits `[HUMAN-FIX]` en `main` | **22** | `git log main --pretty=format:"%s" \| grep -cE "^\[HUMAN-FIX\]"` |
| Commits `[TASK-xxx]` en `main` (sin merges) | **39** | `git log main --pretty=format:"%s" \| grep -cE "^\[TASK-"` (cubren las 51 tareas de `tasks.md`; varios commits agrupan más de un ID) |

**TIH = 22 / 39 × 100 = 56,4 %**

Lectura para el informe: por cada 10 commits de implementación, casi 6 requirieron una corrección humana aparte. Es evidencia cuantitativa de que, aun con SDD, la intervención humana fue sustancial.

---

## 2. TPR — Tasa de Preservación de Requisitos Must

**Fórmula (DEC-E2-08):** `TPR = Must de F4/F5 sin cambio / Must de F4/F5 × 100`

**Ambigüedad detectada (pendiente de ratificar por el equipo, 2 min):** la fórmula no especifica si la base de cálculo es (a) los requisitos Must *de la Entrega 1* que caen en el alcance F5+F4, o (b) los Requisitos Funcionales (`FR-xxx`) consolidados en `spec.md` de la Entrega 2. Dan números distintos. Recomiendo (a), porque "preservación" debería medirse contra el punto de partida.

### Clasificación sobre la base (a) — 8 Must de la E1 en alcance F5+F4 (tabla §2.a de la guía)

| Requisito E1 | Clasificación | Evidencia |
|---|---|---|
| `RQF-041 [fase5-lester]` (derivación ignorando puntaje si señal bajo mínimo o fraude) | Sin cambio | `FR-008` en `spec.md`, sin modificación de la regla |
| `RQF-004 [final-final]` (derivación en rango intermedio 60-89,9) | Sin cambio | `FR-009` en `spec.md`, regla preservada (solo se aclaró la cita de origen) |
| `RQF-023 [fase5-lester]` (precedencia de fraude) | Sin cambio | `FR-007` en `spec.md` |
| `RQF-044 [final-final]` (configuración de umbrales por cliente/flujo) | Sin cambio | `FR-001`/`FR-003` en `spec.md` |
| `RQF-040 [fase5-lester]` (aprobación automática) | **Modificado** | `DEC-01` fijó el umbral en ≥ 90, resolviendo la contradicción 85 vs 80 de la E1 |
| `RQF-020 [fase5-lester]` (derivación bajo 60 puntos) | **Modificado** | `DEC-08`/H-08 eliminó la opción de rechazo, redefiniendo la regla a derivación obligatoria |
| `RQF-039 [fase5-lester]` (dos aprobaciones separadas) | **Modificado** | `DEC-E2-10(d)` precisó que propone el Diseñador y aprueba el Administrador — ambigüedad no resuelta en la E1 (PF-033 decía literalmente "administrador") |
| `RQNF-002 [fase5-lester]` (reconstrucción de decisiones pasadas) | **Modificado** | `DEC-14`/H-14 redefinió "reproducibilidad exacta" como "trazabilidad" |

**TPR = 4 / 8 × 100 = 50 %**

### Base alternativa (b), solo como referencia — 12 FR consolidados de `spec.md`

Sin cambio: FR-001, 002, 003, 005, 007, 008, 012 (7). Modificado: FR-004, 006, 009 (3). Nuevo: FR-010, 011 (2).

**TPR (base b) = 7 / 12 × 100 = 58,3 %**

---

## 3. IRF — Índice de Retrabajo por Fase

**Fórmula (DEC-E2-08):** `IRF = Artefactos de fase con corrección humana sustantiva / Artefactos de la fase`

| Fase | Artefactos de la fase | Con corrección humana sustantiva | IRF |
|---|---|---|---|
| Constitución | 1 (`constitution.md`) | 1 | **100 %** |
| Especificación | 2 (`spec.md`, `checklists/requirements.md`) | 2 | **100 %** |
| Aclaración | 1 (`clarificaciones.md`) | 1 | **100 %** |
| Plan | 7 (`plan.md`, `data-model.md`, `research.md`, `quickstart.md`, `contracts/api-umbrales-f5.md`, `contracts/api-evaluacion-f4.md`, `contracts/session-simulada.md`) | 7 | **100 %** |
| Tareas | 1 (`tasks.md`) | 1 | **100 %** |
| Análisis | — | — | **N/A** — no existe `reporte-analisis-consistencia.md` como artefacto propio; los hallazgos de `/speckit-analyze` (H1-H8 citados en INT-013) se aplicaron directo sobre Plan y Tareas, ya contabilizados ahí. **Pendiente del DoD** (DEC-E2-09 punto 5): el archivo debería existir. |
| Implementación | 52 (`src/` + `tests/`, conteo por `find`) | **≥ 7 confirmados**: `App.tsx`, `FormularioEvaluacion.tsx`, `VistaResultado.tsx`, `useSession.ts`, `session-api.test.ts`, `umbrales-api.test.ts`, `umbrales-repo.test.ts` | **≥ 13,5 %**, cifra abierta |

**Pendiente para cerrar Implementación:** falta la lista exacta de los 6 archivos que tocó el commit `fdfc199` (Rodrigo, bitácora `INT-018`). Pueden solapar con los 7 ya confirmados o ser nuevos. Rango estimado final: 13,5 % – 25 %.

---

## 4. Checklist antes de pasar esto a la sección 6.6 del informe

- [ ] Ratificar con el equipo la base de cálculo de TPR (recomendado: base (a), 8 Must de la E1).
- [ ] Pedir a Rodrigo los 6 archivos de `fdfc199` para cerrar IRF de Implementación.
- [ ] Decidir cómo tratar en el informe los commits de IA-asistida de Angel (§0) — declararlos aparte, no sumarlos a TIH/IRF.
- [ ] Recalcular estos 3 indicadores una vez se fusionen `feat/bitacora-int018-023` y `feat/fichas-dec-02-16`, y una vez se cree el tag `v2.0` (congelar los números finales contra esa versión, no antes).

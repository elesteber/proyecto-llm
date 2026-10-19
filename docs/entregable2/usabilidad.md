# Prueba de usabilidad externa — Criterio SC-005

Fecha de las pruebas: 2026-10-18. Facilitador: Lester González (integrante del equipo, rol QA).

## 1. Criterio evaluado

`spec.md` define SC-005 así: los operadores y administradores acceden a la configuración vigente e historial completo de cambios en un máximo de 2 interacciones (clics) desde el menú principal de la interfaz web, y completan la inspección/evaluación de un caso en F4 o la propuesta/aprobación de un borrador en F5 en un tiempo menor o igual a 3 minutos **sin asistencia técnica externa**. Ratificado por el Representante del Cliente el 2026-10-14, para un evaluador sin inducción previa.

Interpretación aplicada en este documento: una pista del facilitador durante la tarea se cuenta como asistencia. Los límites de clics rigen para las tareas de consulta (tareas 1 y 2); las tareas 3 y 4 se evalúan por tiempo y ausencia de asistencia.

## 2. Protocolo

| # | Tarea | Límite SC-005 |
|---|-------|---------------|
| 1 | Consultar los umbrales vigentes | ≤ 2 clics |
| 2 | Consultar el historial de versiones | ≤ 2 clics |
| 3 | Evaluar CASO-MED-001 y leer el dictamen | ≤ 3 min |
| 4 | Proponer un umbral de aprobación de 92 y aprobarlo con otro rol | ≤ 3 min |

- Entorno: navegador. Base de datos reiniciada antes de cada prueba.
- Participantes: dos personas externas al equipo y al curso, del entorno personal del facilitador. Ambos dieron su consentimiento. Se identifican solo por iniciales.

## 3. Prueba 1 — Participante IMO

Fecha y hora: 2026-10-18, 19:50. Perfil: desarrollador de videojuegos independiente.

| # | Tarea | Tiempo | Clics | Ayudas | Resultado | Cumple SC-005 | Observaciones |
|---|-------|--------|-------|--------|-----------|---------------|---------------|
| 1 | Umbrales vigentes (≤ 2 clics) | 120 s | Más de 2 | — | No logrado | No (excede el límite de clics) | "Siento que al inicio, como todavía no entendía muy bien qué eran las cosas que estaba viendo y los menús desplegables eran chiquititos arriba a la izquierda —y los que están al medio de la pantalla también son chiquititos— como que al inicio no los consideré dentro de las opciones que tenía para apretar..." |
| 2 | Historial de versiones (≤ 2 clics) | 10 s | — | — | Logrado | Sí* | Sin observaciones |
| 3 | Evaluar CASO-MED-001 y leer dictamen (≤ 3 min) | 47 s | 2 | — | Logrado | Sí | — |
| 4 | Proponer 92 y aprobar con otro rol (≤ 3 min) | 45 s | 7 | — | Logrado | Sí | — |

\* El facilitador dio la tarea por lograda; el número de clics no quedó registrado.

**Comentario libre:** "Yo creo que en la primera interacción te enseña cómo funcionan los menús y una vez adquirido cómo están la disposición de los menús, después uno, es súper intuitivo cachar cómo hacer las cosas. [...] sabiendo cómo funciona, como con una explicación a lo mejor básica al principio, cualquier persona con conocimientos básicos de computación podría gestionar el sistema."

## 4. Prueba 2 — Participante KGR

Fecha y hora: 2026-10-18, 20:10. Perfil: usuario no afín a la tecnología.

| # | Tarea | Tiempo | Clics | Ayudas | Resultado | Cumple SC-005 | Observaciones |
|---|-------|--------|-------|--------|-----------|---------------|---------------|
| 1 | Umbrales vigentes (≤ 2 clics) | 1 min 40 s | 4 | Sí (mirar los menús) | Logrado con ayuda | No (4 clics y con ayuda) | "En realidad no me fijé que había un menú arriba hasta que me dijiste y empecé a bajar a ver qué había abajo. Después miré arriba cuando dijeron los menús, empecé a tocar todos los menús y miré uno que decía 'umbrales'." |
| 2 | Historial de versiones (≤ 2 clics) | 37,55 s | 8 | Sin ayudas | No logrado | No (8 clics) | Encontró la versión, pero siguió haciendo clics buscando si había más. Se detuvo la prueba por superar el límite de 2 clics; instrucciones poco claras. |
| 3 | Evaluar CASO-MED-001 y leer dictamen (≤ 3 min) | 1 min 46 s | 4 | Pista: intentar hacer scroll | Logrado con ayuda | No (con asistencia) | Posición poco obvia del botón de evaluar. |
| 4 | Proponer 92 y aprobar con otro rol (≤ 3 min) | 3 min 42 s | 4 | Pista: "mira más arriba" | Logrado con ayuda | No (excede 3 min y con asistencia) | Se partió desde Administrador en lugar de Diseñador. Costó encontrar el cambio de rol ("diseñador 1" / "administrador 1") por ser elementos muy pequeños en la parte superior. El paso final de aprobar fue intuitivo. |

**Comentario libre:** "Considerar agregar un instructivo de cómo funcionan los menús; además, son muy pequeños. [...] captar bien qué se estaba pidiendo, porque como que me concentré en una pura cosa y al final ya como que fue una pista de 'mira más arriba'. Al decir eso fue como que miré que habían unas cosas más chicas arriba [...] ahí encontré recién donde podía modificar algo, porque yo estaba tocando todo tratando de modificar algo y no resultaba nada."

## 5. Resultado frente a SC-005

| Participante | Tarea 1 | Tarea 2 | Tarea 3 | Tarea 4 | Cumplen |
|--------------|---------|---------|---------|---------|---------|
| IMO | No | Sí* | Sí | Sí | 3 de 4 |
| KGR | No | No | No | No | 0 de 4 |

**SC-005 no se cumple en la prueba con personas externas (n=2):** 3 de 8 ejecuciones de tarea cumplieron los límites sin asistencia, y una de ellas sin recuento de clics registrado.

Este resultado convive con el de la prueba automatizada T048 (`tests/e2e/usabilidad-recorrido.spec.ts`), que sí cumple: mide el camino mínimo (1 clic por recorrido; 0,15 s a 0,60 s por tarea), pero no mide si una persona descubre ese camino. La prueba externa mide justamente eso, y es donde falla. El flujo es corto y operativo (las tareas 3 y 4 de IMO, 47 s y 45 s); lo que falla es la descubribilidad de la interfaz en el primer contacto.

## 6. Defectos consolidados

| # | Defecto | Origen |
|---|---------|--------|
| 1 | Los menús de navegación no se perciben como interactivos en el primer contacto. | IMO y KGR |
| 2 | Los menús y el selector de rol se describieron como "chiquititos" y "muy pequeños". | IMO y KGR |
| 3 | El selector de cambio de rol es poco evidente; obliga a buscar en la zona superior. | KGR |
| 4 | La posición del botón "Evaluar" es poco obvia y requirió una pista de scroll. | KGR |
| 5 | Ambos sugieren una explicación o instructivo inicial sobre el funcionamiento de los menús. | IMO y KGR |
| 6 | El límite de clics de la tarea 2 no quedó claro en la consigna (defecto del protocolo, no del sistema). | KGR |

## 7. Limitaciones

- Dos participantes: el resultado es indicativo y no tiene valor estadístico.
- Ambos pertenecen al entorno personal del facilitador, aunque no tienen vínculo con el curso ni con el proyecto. El facilitador integra el equipo desarrollador.
- El aprendizaje inicial recae sobre la tarea 1 (IMO tardó 120 s en ella y 10 s en la tarea 2).
- En la prueba de KGR hubo pistas del facilitador; se cuentan como asistencia.
- Solo se registró "navegador" como entorno: no constan el tamaño de pantalla ni el zoom.
- En la tarea 2 de IMO no se registró el número de clics.
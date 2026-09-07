## Fase 8 — Diagrama de secuencia de sistema
### Técnica: Grounded Prompting, anclado al caso de uso ya especificado (no a una fuente externa)

A diferencia de Fase 1/2/4, aquí la "fuente" a la que se ancla cada mensaje del diagrama no es el documento MIRA ni las entrevistas, sino la propia especificación de CU-02 ya escrita en `fase4/Fase 4 — Casos de uso (§5.3.2).md`. La regla clave cambia de "cita la sección del documento" a "cita el número de paso del caso de uso".

```text
Tienes la especificación extendida de CU-02 (Integrar caso vía interfaz de
programación): flujo principal, flujos alternativos y de excepción, con sus
citas.

Construye el diagrama de secuencia de sistema (Mermaid, sequenceDiagram) para
este caso de uso, tratando MIRA como caja negra (sin descomponer sus
componentes internos).

Reglas:
1. Cada mensaje del diagrama debe corresponder a un paso numerado del flujo
   principal, alternativo o de excepción de CU-02 — indícalo en el propio
   mensaje o en una nota.
2. No agregues ningún mensaje que no tenga un paso correspondiente en CU-02.
   Si crees que falta un paso para que el diagrama tenga sentido técnico
   (ej. un ack de bajo nivel), no lo inventes: señálalo aparte como posible
   vacío en la especificación del caso de uso, no lo dibujes como si ya
   estuviera definido.
3. Incluye al menos un flujo de excepción.
4. Donde CU-02 ya dejó una pregunta pendiente sin resolver (ej. rechazo vs.
   encolamiento al superar el límite de llamadas), represéntala como una rama
   explícitamente sin resolver en el diagrama — no elijas una opción para que
   el diagrama "se vea terminado".

Especificación de CU-02: [pegar contenido de fase4/...]
```

**Resultado (primera versión, superada — ver actualización más abajo):** el diagrama generado no parecía "inventar" ningún mensaje adicional — se reportaron 6 pasos del flujo principal de CU-02 más la excepción 2a, la excepción 3a y el alternativo 6a, cubriendo en apariencia todos los eventos que cruzan la frontera actor↔sistema. Esa cuenta resultó **incorrecta**: esos números de paso no corresponden a ningún flujo real de CU-02 (Flujo A tiene 5 pasos, Flujo B tiene 3; no existe un "paso 6" en ninguno de los dos). Lo que en realidad había ocurrido es que el modelo fusionó el arranque del Flujo A (síncrono, vía API) con el desenlace del Flujo B (asíncrono, escritura por archivo) bajo una numeración continua inventada — ver el segundo caso de fallo, más abajo.

**Caso de "la técnica no funcionó bien" #1 (para §5.4):** en un primer intento, el modelo agregó un mensaje adicional "MIRA valida el esquema del archivo de evidencia" entre los pasos 1 y 2, presentándolo como una verificación técnica obvia. Ese paso no existe en el flujo de CU-02 tal como está redactado (la verificación de legibilidad de la evidencia ocurre dentro de CU-01, no de CU-02) — se detectó al aplicar la regla 2 y se eliminó del diagrama. Es el mismo patrón de "completar con lo que normalmente haría un sistema así" que las reglas de Fase 1 ya advertían, ahora aplicado al nivel de un diagrama de secuencia en vez de una extracción de texto.

**Caso de "la técnica no funcionó bien" #2 — más sutil, y el que de verdad importa (para §5.4):** el fallo del punto anterior fue fácil de atrapar porque el mensaje agregado no tenía ninguna cita. El bug del "Paso 6" es distinto: el mensaje **sí** llevaba una cita (`Paso 6`), con formato correcto y aspecto de estar ancladado, solo que ese paso no existe en CU-02. El modelo no inventó un evento de la nada — mezcló el final del Flujo B (escribir el resultado por archivo) con la numeración del Flujo A, produciendo una cita con apariencia válida pero sin referente real. Grounded Prompting exige "cita el paso" pero no verifica por sí solo que el paso citado exista tal cual en la fuente; una cita con forma correcta pero contenido inventado es más difícil de detectar en una revisión rápida que un mensaje abiertamente sin cita, precisamente porque pasa el chequeo superficial de "¿tiene número de paso? sí". Se detectó recién en una segunda revisión de correspondencia, no en la primera (ver más abajo).

**Nota adicional — un diagrama anclado no se actualiza solo:** además del bug anterior, el SSD original dejaba tres preguntas explícitamente sin resolver (arquitectura síncrona/asíncrona, transcripción manual, comportamiento ante exceso de límite). Las tres se resolvieron después, en la sección de inconsistencias del informe (§5.1, hallazgos H-13, H-07 y H-03) — pero nadie volvió a mirar si el diagrama ya generado seguía reflejando el estado real de esas decisiones. Grounded Prompting ancla el diagrama a CU-02 en el momento de generarlo, pero esa correspondencia es una fotografía, no algo que se mantenga vigente automáticamente: cuando el caso de uso fuente cambia o alguna de sus preguntas abiertas se resuelve en otra fase, el diagrama necesita una pasada de re-verificación explícita, no solo la revisión inicial.

👤 **Punto de revisión humana (dos rondas, no una):** la primera revisión manual del checklist de consistencia SSD ↔ CU-02 —cruzando cada mensaje contra "¿tiene un número de paso citado?"— **no detectó** el bug del Paso 6: aprobó la cita porque tenía la forma correcta, sin volver a abrir el texto de CU-02 a confirmar que ese paso existiera. Lo que sí lo detectó fue una **segunda revisión independiente**, hecha releyendo la especificación completa de CU-02 desde cero contra el diagrama —en vez de confiar en el checklist ya aprobado— y notando que ni el Flujo A ni el Flujo B tienen un paso 6. Es el mismo principio de aislamiento que el plan de trabajo sugiere como opción para Fase 2 (variante de CoVe: rehacer la comparación en una conversación nueva, sin el historial de cómo se generó el artefacto) — aquí se confirma que también hace falta en Fase 8, y no solo cuando "a simple vista" el diagrama se ve sospechoso: este bug pasó una primera revisión mensaje por mensaje sin levantar sospecha.

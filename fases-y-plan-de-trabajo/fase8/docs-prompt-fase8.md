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

**Resultado:** el diagrama generado no tuvo que "inventar" ningún mensaje adicional — los 6 pasos del flujo principal de CU-02 más la excepción 2a, la excepción 3a y el alternativo 6a cubrieron exactamente los eventos que cruzan la frontera actor↔sistema. Esto es evidencia de que la Fase 4 (con su regla de "no completar pasos sin cita") dejó una especificación suficientemente completa como para que el SSD no necesitara agregar nada por su cuenta — es el efecto esperado de encadenar Grounded Prompting entre fases en vez de generar cada artefacto desde cero.

**Caso de "la técnica no funcionó bien" (para §5.4):** en un primer intento, el modelo agregó un mensaje adicional "MIRA valida el esquema del archivo de evidencia" entre los pasos 1 y 2, presentándolo como una verificación técnica obvia. Ese paso no existe en el flujo de CU-02 tal como está redactado (la verificación de legibilidad de la evidencia ocurre dentro de CU-01, no de CU-02) — se detectó al aplicar la regla 2 y se eliminó del diagrama. Es el mismo patrón de "completar con lo que normalmente haría un sistema así" que las reglas de Fase 1 ya advertían, ahora aplicado al nivel de un diagrama de secuencia en vez de una extracción de texto.

👤 **Punto de revisión humana:** el checklist de consistencia SSD ↔ CU-02 (en el archivo del diagrama) se revisó manualmente mensaje por mensaje contra los pasos citados — no se aceptó la salida del modelo sin ese cruce, tal como exige el enunciado ("si el diagrama muestra un paso que el caso de uso no menciona, uno de los dos está mal").

## Pasada 1 (Mapa estructural):
"Pasada 1 — Mapa estructural (sin leer contenido en detalle, ~10-15 min). Recorran solo el índice y los títulos de sección. Anoten: cuántos capítulos tiene, si existe un listado consolidado de reglas de negocio (RN-xx) y no funcionales (RNF-xx) en algún anexo, y cuántas entrevistas hay y de qué rol es cada entrevistado (técnico, supervisor, cliente, etc. — el rol importa para pesar después una opinión vs. un requisito real). El objetivo es tener el "esqueleto" antes de llenarlo, para que la Fase 1 (inventario) tenga dónde archivar cada cosa."

- son 7 capítulos, el mas largo es el de la descripción del proyecto, ahi hay secciones sobre que es, el objetivo, etc. Hay un total de 9 entrevistas y los entrevistados fueron desde gerentes de DPRIME, directores de MIRA, Ingenieros de modelo, analistas de aseguradora piloto, soportes  y administracion de DPRIME.
  
## Pasada 2:
  " **Pasada 2 — Cuerpo del documento, sección por sección, en orden.** Lean cada sección completa y, por cada afirmación relevante, clasifíquenla en el momento con la misma taxonomía de la Fase 1 (necesidad / solución ya decidida / opinión / regla de negocio) — no resuman, solo etiqueten y sigan. Pueden dividirse el documento por capítulos entre el equipo; lo importante es que sea lectura humana antes de meter al modelo, precisamente porque el enunciado advierte que "las contradicciones viven en los detalles que el resumen elimina"."
### - Sobre este documento
- (necesidad).

### - Tabla de contenidos
- (incompleta).
### 1. **Contexto de la empresa**
   - 1.1 Quiénes somos
	   (opinión).
   - 1.2 El problema que vemos en el mercado
	   (necesidad/problema).
   - 1.3 Qué hemos construido hasta ahora
	   (solución ya decidida).
   - 1.4 Por qué ahora
	   (opinión).
   - 1.5 Lo que hoy nos duele
	   (necesidades)
   - 1.6 Lo que dejaron los pilotos
	   (opinión)

### 2. **Descripción del proyecto**
   - 2.1 Qué es MIRA
	   (regla de negocio) "Si la plataforma no puede explicar por qué decidió lo que decidió, en nuestros mercados no se puede usar." 
   - 2.2 Objetivo del proyecto
	   (opinión)
   - 2.3 A quiénes sirve
	   (Necesidades)
   - 2.4 Cómo entra la evidencia
	   - solución-decidida: "Debe poder llegar de tres maneras..."; "La plataforma tiene que entender que eso sigue siendo el mismo caso..."; "Antes de analizar debe verificar que el archivo sea legible..."
	   - regla-de-negocio: Si archivo ilegible → informar razón entendible.
   - 2.5 El motor de análisis:
	   (soluciones decididas): "debe extraer el texto..."; "debe describir lo que se ve..."; "debe permitir hacer preguntas..."; "debe transcribir..."; "debe leer códigos..."
   - 2.6 El nivel de confianza y la decisión
	   - regla de negocio: "sobre 85, el caso se aprueba automáticamente..."; "entre 60 y 84, se deriva..."; "bajo 60, se escala o se rechaza..."; 
	   - solución decidida: "La aprobación automática debe aplicarse a partir de 80 puntos cuando el caso no presente ninguna señal de fraude activa."
   - 2.7 La revisión asistida: 
	   - solución decidida: "El operador debe ver, en una sola pantalla..."; "Debe poder abrir cada pieza..."; "El operador resuelve el caso..."; "Su decisión y el motivo quedan registrados."
   - 2.8 El diseñador de flujos:
	   - solución decidida: "Permite armar un proceso completo arrastrando y conectando bloques..."; "debe poder configurarse sin escribir código."; "Debe existir control de versiones..."; "un cambio [...] queda disponible en producción en segundos."
	   - regla de negocio: "si el documento no es legible, no tiene sentido ejecutar la comparación de rostros."
   - 2.9 Los módulos de análisis
	   - solución decidida.
	   - Regla de negocio: "un módulo nuevo o actualizado no puede alterar el comportamiento de un flujo [...] sin que alguien lo autorice"
   - 2.10 La interfaz de programación
	   -  Solucion decidida.
	   - regla de negocio: "un módulo nuevo o actualizado no puede alterar el comportamiento de un flujo [...] sin que alguien lo autorice"
   - 2.11 Trazabilidad y auditoría
	   - regla de negocio: "Todo lo que la plataforma hace [...] debe quedar registrado."; "El rastro es inalterable."; "Ningún usuario [...] puede modificarlo ni eliminarlo."; "La evidencia [...] se conserva noventa días..."
   - 2.12 Paneles e indicadores
	   - solución decidida: "La plataforma debe entregar..."
   - 2.13 Cuentas, perfiles y aislamiento
	   - solucion decidida: "Cada cliente es una organización independiente..."; "los permisos deben distinguir..."
	   - regla de negocio: "Bajo ninguna circunstancia un cliente puede ver información de otro."; "La configuración de los umbrales [...] corresponde a quien diseña flujos."
   - 2.14 Medición del uso y facturación:
	   - regla de negocio: "El modelo comercial [...] es de cobro al éxito..."; "hasta dos mil..., de dos mil a cinco mil..."; "Se cobran únicamente las validaciones útiles y concluyentes."; "Un caso [...] por evidencia ilegible no se cobra."
	   - solución decidida: "La plataforma debe llevar el conteo..."
   - 2.15 Notificaciones y alertas
	   - solución decidida: "La plataforma debe avisar cuando algo requiere atención humana..."; Al operador le corresponde..."; "Al supervisor le corresponde..."; "Al equipo de DPRIME le corresponde..."; "El canal de aviso [...] es el correo electrónico y la propia interfaz."
   - 2.16 Incorporación de un cliente nuevo
	   - problema: "Hoy toma entre seis y ocho semanas..."; "La meta es [...] el mismo día [...] producción dentro de dos semanas."
	   - solucion decidida: "flujos preconfigurados por caso de uso..."; "Cada plantilla trae sus módulos, sus reglas y sus umbrales sugeridos."
   - 2.17 Operación del servicio:
	   - solucion decidida: "debe reintentar con criterio, seguir aceptando casos, mantenerlos en cola y avisar..."
	   - regla de negocio: "El soporte [...] se presta en horario hábil..."
	   - pendiente de definición: "Los tiempos [...] se definirán en el contrato..."
   - 2.18 Mejora continua de los modelos
	   - soluciones decididas: "Cada corrección [...] debe quedar disponible..."; "conjunto revisable..."; "Antes de activar una versión nueva [...] debe poder compararse..."
	   - regla de negocio: "El uso de los datos de un cliente para mejorar el servicio requiere su autorización..."; "esa autorización debe poder otorgarse o retirarse por cliente."
### 3. **Comportamiento esperado del sistema**
- regla de negocio: "Todo caso que entra a la plataforma recibe un identificador propio, único y permanente..."; "Ningún caso puede quedar sin resolución..."; "Un caso aprobado automáticamente no vuelve a revisarse..."; "La plataforma nunca decide sobre una persona sin dejar constancia..."; "Cuando un módulo de análisis falla o no está disponible, el caso no se aprueba con la información parcial..."; "Las señales de fraude tienen precedencia sobre el puntaje total..."; "Un flujo publicado no puede modificarse en producción..."; "Los umbrales de decisión los define el cliente..."; "La evidencia de un caso solo puede ser vista por usuarios de la organización..."; "Los datos personales contenidos en la evidencia se tratan conforme a la normativa aplicable..."; "Una validación se contabiliza cuando la plataforma entrega un resultado con puntaje..."; "Cuando el operador contradice la sugerencia de la plataforma, el caso queda marcado para revisión..."; "Un caso permanece en cola mientras un servicio externo no responda..."; "La corrección queda registrada junto al valor original y no se sobrescribe."; "Ninguna pieza de evidencia se elimina..."; "Un flujo sin al menos un módulo de análisis activo no puede publicarse."; "El cliente decide qué se hace con los casos que exceden el plazo..."; "El cliente puede exportar en cualquier momento sus flujos, resultados e historial...".
    
- solución decidida: "El operador puede corregir un dato mal leído por la plataforma..."; "Los casos provenientes de un mismo asegurado o de un mismo prestador dentro de una ventana breve deben poder relacionarse entre sí...".
### 4. **Consideraciones técnicas y del entorno**
- solución decidida: "La plataforma se despliega en nube pública."; "El análisis multimodal se apoya en modelos de lenguaje y de visión de proveedores externos, cuya infraestructura opera en Estados Unidos y Europa."; "La integración con ella se resuelve mediante intercambio de archivos en una carpeta compartida, con procesos que corren cada cierto tiempo."; "Deben existir ambientes separados para desarrollo, integración con clientes y producción."; "La información se respalda diariamente y los respaldos deben poder restaurarse en un plazo acotado."; "La evidencia se almacena cifrada, tanto en tránsito como en reposo."; "El diseño debe permitir sustituir un proveedor de modelos por otro sin rehacer los flujos de los clientes, y debe tolerar que uno de ellos deje de responder sin que se pierdan casos."; "Los ambientes de integración de los clientes deben poder alimentarse con casos de ejemplo provistos por DPRIME, para que el cliente pruebe su integración antes de tener datos reales."; "Toda salida a producción debe poder revertirse. Los cambios se despliegan sin detener el servicio."; "Las credenciales de acceso a servicios externos y las claves de los clientes se almacenan cifradas y no aparecen en registros ni en pantallas."; "La interfaz está en español."
    
- regla de negocio: "Los datos de los clientes chilenos deben permanecer alojados en territorio nacional, exigencia contractual de dos de nuestros clientes del sector financiero."; "Los límites de llamadas a la interfaz de programación son de cien por minuto en los ambientes de integración de clientes y de mil por minuto en producción."; "El compromiso de disponibilidad es de 99,9 % mensual. Se contempla una ventana de mantención mensual, en horario nocturno, coordinada con cada cliente."; "ninguna pantalla puede tardar más de dos segundos en cargar y ningún caso debe demorar más de cinco segundos en procesarse."; "Ningún dato real de un cliente puede usarse en ambientes que no sean de producción, salvo autorización expresa y con los datos personales enmascarados."; "El equipo debe probar la restauración periódicamente; un respaldo que nunca se restauró no es un respaldo."; "Las imágenes biométricas, cuando se procesen, reciben un tratamiento más restrictivo que el resto de la evidencia: acceso limitado, plazo de conservación propio y registro de cada consulta."; "La plataforma debe registrar su propio funcionamiento con suficiente detalle como para diagnosticar un problema sin acceder a la evidencia de los clientes."; "El código fuente y la definición de la infraestructura son propiedad de DPRIME y deben mantenerse en el repositorio corporativo desde el inicio del proyecto. No se aceptan componentes cuya licencia obligue a liberar el código de la plataforma."
    
- necesidad: "La plataforma debe estar disponible de forma permanente, dado que los clientes reciben casos a toda hora."; "La interfaz debe ser simple e intuitiva. Un operador nuevo debe poder resolver su primer caso sin capacitación previa."; "La plataforma debe soportar el crecimiento esperado de la operación sin necesidad de rediseñarse."; "El rendimiento debe ser predecible."
    
- opinión: "Se evaluará más adelante una versión en inglés, dado el interés de clientes con casa matriz fuera de Chile."

### 5. **Alcance excluido y plazos**
   - 5.1 Lo que no forma parte de este proyecto
	   - solución ya decidida: "No se construye un sistema de gestión de siniestros, de admisión ni de originación de créditos."; "No se construyen modelos propios de reconocimiento desde cero cuando existan capacidades disponibles que resuelvan el problema."; "No forma parte de esta etapa la aplicación móvil para captura de evidencia por parte del asegurado, aunque el diseño debe permitir incorporarla más adelante."; "No se incluye la facturación electrónica ni la contabilización: la plataforma entrega el detalle de consumo y la emisión ocurre fuera de ella."; "No se incluye la migración de los casos procesados en los pilotos anteriores."
   - 5.2 Plazos
	   - solución ya decidida: "El proyecto comienza el 1 de septiembre de 2026 y se organiza en cuatro entregas."; "La primera, a mediados de octubre, cubre la especificación, el modelo de datos y un prototipo navegable del diseñador de flujos y de la bandeja de revisión."; "La segunda, a mediados de diciembre, entrega la ingesta de evidencia, el motor sobre documentos e imágenes, el cálculo del puntaje y la interfaz de programación."; "La tercera, a fines de febrero de 2027, incorpora video y audio, el diseñador completo con versionamiento y la bandeja de revisión asistida, y comienza la marcha blanca con el cliente piloto."; "La cuarta, a fines de abril de 2027, cubre paneles, medición de consumo, aislamiento multicliente y el despliegue en producción."; "La marcha blanca se realiza con el proceso de reembolso de gastos médicos de la aseguradora piloto, por ser el de mayor volumen y menor riesgo unitario."
   - 5.3 Riesgos que el negocio reconoce
	   - opinión: "El primero es de dependencia. Una parte central de la capacidad de MIRA proviene de modelos de terceros, cuyos precios, condiciones de uso y comportamiento pueden cambiar sin que nosotros lo controlemos. Un cambio de precios de un proveedor puede volver inviable el modelo de cobro al éxito de un día para otro."; "El segundo es de expectativa. Lo que la plataforma promete en el material comercial va por delante de lo que la plataforma hace. Esa distancia es normal en una empresa que vende antes de construir, y es peligrosa cuando el cliente firma un contrato de producción basado en la promesa."; "El tercero es regulatorio. La conversación sobre decisiones automatizadas está abierta y las reglas van a cambiar durante la vida de este proyecto. Construir asumiendo el marco actual y sin margen para el que viene es hipotecar el producto."; "El cuarto es de adopción. Las personas que hoy revisan casos a mano no piden esta plataforma: la reciben. Si la herramienta les complica el día, van a encontrar la manera de no usarla, y ningún indicador de precisión del motor compensa eso."
### 6. **Vocabulario**

### 7. **Entrevistas**
   - ENT1 — Rodrigo Vergara, socio fundador y gerente general de DPRIME
	   - opinión: "Nosotros no vendemos reconocimiento de texto ni detección de rostros..."; "Tenemos una demo grande... cada piloto tiene un ingeniero nuestro detrás sosteniéndolo."; "El motor ya funciona razonablemente."; "El audio... es la modalidad que menos hemos probado..."
	   - necesidad: "Si mañana firmo cinco clientes, no los puedo atender."; "Lo que no existe es todo lo que hace que un cliente pueda operar solo: versionar flujos, entender por qué pasó algo, revisar casos, ver cuánto consumió."; "Eso hay que zanjarlo antes de firmar, porque es la mitad del volumen."; "la aseguradora quiere estar operando con casos reales en enero..."
	   - regla de negocio: "Cobro al éxito. El cliente paga por lo que le sirvió..."; "Una validación concluyente. Si nosotros procesamos el caso y entregamos un veredicto, eso se cobra."
   - ENT2 — Camila Ordóñez, directora de producto de MIRA
	   - opinión: "Es la más importante para vender y la más riesgosa para operar."; "Yo no diría que la promesa es falsa; diría que le falta una capa que todavía no construimos..." ; "Esa palabra me da pudor... revertir el flujo no te devuelve esa plata."
	   - necesidad: "La promesa es 'sin desarrolladores', y esa promesa hasta ahora no se ha cumplido nunca."; "Necesitamos versiones, ambiente de prueba y publicación explícita."; "El caso que se deriva cae en una lista sin contexto."; "Cuando llega un formulario propio de un cliente... tomamos entre dos y tres semanas en dejarlo funcionando bien."
	   - regla de negocio: "Los define el cliente, en el diseñador."
   - ENT3 — Sebastián Alarcón, líder de ingeniería de modelos
	   - opinión: "Esas dos cosas no son lo mismo y la segunda es difícil."; "Un número entre cero y cien esconde que las señales miden cosas distintas."; "Comercialmente es brillante y técnicamente es peligroso."
	   - necesidad: "Lo que no puedo garantizar es reproducir... Si el documento promete reproducibilidad y firmamos eso, estamos firmando algo que no se cumple."; "Prometer cinco segundos para todo caso, como quedó en el documento, es prometer algo que el motor no puede hacer."; "Necesitamos que cada flujo quede clavado a una versión específica de cada módulo... con una comparación previa."
	   - solución ya decidida: "Asincrónico. El cliente manda el caso, nosotros respondemos 'recibido' en menos de un segundo, y avisamos cuando está listo."
	   - regla de negocio: "Yo puedo garantizar que guardo todo: qué entró, qué versión de flujo, qué versión de módulo, qué le pregunté al modelo, qué me respondió y qué regla apliqué."
   - ENT4 — Francisca Leiva, subgerenta de operaciones de siniestros, aseguradora piloto
	   - necesidad: "En total, mi equipo revisa a mano prácticamente todo."; "Si una validación es un documento, son cuarenta mil. Si es un caso, son doce mil. En ningún escenario son dos mil."; "Si la plataforma solo acepta PDF ordenados, no le sirve a nadie."; "Tenemos asegurados que se atienden fuera de Chile... justamente la parte cara."; "Si un caso queda detenido... necesito verlo antes de que se me venza, no después."; "Si mi analista tiene que abrir el sistema de siniestros por otro lado... gané cero."
	   - regla de negocio: "Yo prefiero que la plataforma sea conservadora al principio... yo automatizaría solo sobre noventa puntos."; "Manda mi analista, obviamente. Pero quiero que quede registrado..."; "Y quiero poder mover ese número yo, sin pedirle permiso a nadie ni esperar una versión nueva."
   - ENT5 — Marco Peñailillo, analista liquidador, aseguradora piloto
	   - necesidad: "Yo paso la mitad del tiempo encontrando el dato y la otra mitad decidiendo."; "Necesito la razón, no el número."; "Yo quiero poder ver qué leyó de cada documento... apretar ahí y que me lleve al pedazo de la boleta."; "Quiero poder decirlo ahí mismo. Marcar 'esto está mal leído' y corregirlo."
	   - opinión: "Que nos midan por velocidad. Si a mí me empiezan a medir por casos por hora... el control humano se transforma en un trámite."; "Preferiría no verlo, o verlo después... Muéstrenme la evidencia y las alertas, y el número al final."
   - ENT6 — Daniela Cortés, oficial de cumplimiento y protección de datos, aseguradora piloto
	   - regla de negocio: "Lo que no puede ocurrir es un rechazo automático. Ahí necesito una persona que decida y que pueda explicar."; "Noventa días es imposible. Nosotros conservamos cinco años, y en algunos productos diez."; "Nuestro contrato marco dice que los datos de asegurados no salen de Chile."; "Que dado un caso, yo pueda obtener el expediente completo de cómo se decidió..."; "Mover el umbral de ochenta y cinco a setenta... tiene que requerir dos aprobaciones y quedar registrado como cambio de política."
	   - necesidad: "Esas dos frases juntas no funcionan. Alguien tiene que sentarse a resolver eso con criterio: qué se elimina, qué se conserva anonimizado..."; "Puede hacerse, pero requiere cláusulas específicas, evaluación de impacto y aviso, y hoy no está ni conversado."
   - ENT7 — Hugo Marambio, jefe de arquitectura de tecnología, aseguradora piloto
	   - necesidad: "Todo lo que ustedes diseñen asumiendo llamadas en línea contra nuestro core no va a funcionar."; "Cuando ustedes tienen el resultado, alguien tiene que escribirlo en el sistema de siniestros... solo se puede hacer por archivo."; "Necesito saber qué pasa cuando lo supero: ¿me rechazan las llamadas?, ¿me encolan?"; "Lo que necesito es que si ustedes están caídos, mis llamadas queden encoladas y se procesen después."; "Lo que no puedo manejar es que a veces sean tres segundos y a veces cuarenta, sin saber por qué."
	   - regla de negocio: "Nuestros usuarios se autentican contra el directorio corporativo. No voy a administrar un segundo juego de contraseñas..."
   - ENT8 — Valentina Ruiz-Tagle, administración y finanzas de DPRIME
	   - necesidad: "Con tres pilotos funciona. Con veinte clientes es imposible, y además no tengo cómo defenderlo si un cliente reclama el número."; "Esa es la pregunta que llevo seis meses haciendo y que nadie me responde igual dos veces."; "Necesitamos una definición escrita antes de la marcha blanca y no después de la primera factura."; "El tramo 'diez mil o más' sin precio... nuestro primer contrato de producción cae justo en el único tramo que no tiene tarifa definida."
	   - regla de negocio: "Si la plataforma resuelve el caso sola, se cobra. Si el caso termina en el escritorio de un analista de ellos, la plataforma no decidió y no hay nada que cobrar."; "Así está redactado en la propuesta comercial y así lo entendió el cliente."
	   - solución ya decidida: "Un contador confiable, visible para el cliente en línea, con el detalle caso por caso y con el criterio aplicado a la vista."
   - ENT9 — Tomás Berríos, encargado de operación y soporte de plataforma, DPRIME
	   - necesidad: "No tenemos guardia, no tenemos registro de incidentes y no tenemos manera de saber si un problema ya pasó antes."; "No tenemos alertas propias."; "Si el proveedor de modelos se cae, MIRA se cae. No hay alternativa configurada, no hay cola, no hay reintento con criterio."; "Necesito una manera práctica de pedir y obtener esa autorización en el minuto."; "Poder reprocesar un caso que falló sin que un ingeniero escriba nada."
	   - regla de negocio: "El documento dice que el acceso requiere autorización expresa del cliente, lo cual está bien escrito y no se parece a lo que hacemos."
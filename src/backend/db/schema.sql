-- Tabla 1: Versiones de Umbrales (F5)
CREATE TABLE IF NOT EXISTS umbrales_flujo (
    id_flujo TEXT NOT NULL,
    version INTEGER NOT NULL,
    umbral_aprobacion REAL NOT NULL CHECK(umbral_aprobacion >= 0 AND umbral_aprobacion <= 100),
    umbral_riesgo_alto REAL NOT NULL CHECK(umbral_riesgo_alto >= 0 AND umbral_riesgo_alto <= 100),
    minimo_autenticidad REAL NOT NULL CHECK(minimo_autenticidad >= 0 AND minimo_autenticidad <= 100),
    minimo_cruce_fuentes REAL NOT NULL CHECK(minimo_cruce_fuentes >= 0 AND minimo_cruce_fuentes <= 100),
    minimo_coherencia REAL NOT NULL CHECK(minimo_coherencia >= 0 AND minimo_coherencia <= 100),
    peso_autenticidad REAL NOT NULL CHECK(peso_autenticidad >= 0 AND peso_autenticidad <= 1),
    peso_cruce_fuentes REAL NOT NULL CHECK(peso_cruce_fuentes >= 0 AND peso_cruce_fuentes <= 1),
    peso_coherencia REAL NOT NULL CHECK(peso_coherencia >= 0 AND peso_coherencia <= 1),
    proponente TEXT NOT NULL,
    aprobador TEXT,
    fecha_propuesta TEXT NOT NULL,
    fecha_resolucion TEXT,
    estado TEXT NOT NULL CHECK(estado IN ('BORRADOR', 'APROBADO', 'DESESTIMADO')),
    PRIMARY KEY (id_flujo, version),
    CHECK(umbral_aprobacion > umbral_riesgo_alto),
    -- Tolerancia numérica ante redondeo de punto flotante en SQLite
    CHECK(ABS((peso_autenticidad + peso_cruce_fuentes + peso_coherencia) - 1.0) < 0.0001)
);

-- Índice único condicional: Garantiza estrictamente máximo 1 borrador activo por flujo
CREATE UNIQUE INDEX IF NOT EXISTS idx_un_solo_borrador_por_flujo
ON umbrales_flujo (id_flujo) WHERE estado = 'BORRADOR';

-- Índice para recuperar rápidamente la versión vigente (mayor version con estado APROBADO)
CREATE INDEX IF NOT EXISTS idx_umbrales_vigente 
ON umbrales_flujo (id_flujo, estado, version DESC);

-- Tabla 2: Auditoría y Registro Histórico de Evaluaciones (F4 / Reproducibilidad RQNF-002)
CREATE TABLE IF NOT EXISTS auditoria_evaluaciones (
    id_evaluacion TEXT PRIMARY KEY,
    id_caso TEXT NOT NULL,
    id_flujo TEXT NOT NULL,
    version_umbrales_aplicada INTEGER NOT NULL,
    score_global REAL NOT NULL,
    decision TEXT NOT NULL CHECK(decision IN ('APROBADO_AUTOMATICO', 'DERIVADO_REVISION')),
    motivo TEXT NOT NULL CHECK(motivo IN ('aprobado', 'alerta_fraude', 'senal_bajo_minimo', 'puntaje_bajo_umbral')),
    riesgo_alto_rechazo INTEGER NOT NULL CHECK(riesgo_alto_rechazo IN (0, 1)),
    senales_bajo_minimo TEXT NOT NULL, -- JSON array: ["coherencia_solicitud"]
    desglose_componentes TEXT NOT NULL, -- JSON object
    senales_insumo TEXT NOT NULL, -- JSON object: vector de entrada exacto
    usuario_operador TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (id_flujo, version_umbrales_aplicada) REFERENCES umbrales_flujo(id_flujo, version)
);

-- Tabla 3: Rastro de Auditoría Append-Only de Eventos de Umbrales (D-05)
CREATE TABLE IF NOT EXISTS rastro_auditoria (
    id_evento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_flujo TEXT NOT NULL,
    version INTEGER NOT NULL,
    accion TEXT NOT NULL CHECK(accion IN ('PROPUESTA_CREADA', 'PROPUESTA_MODIFICADA', 'PROPUESTA_APROBADA', 'PROPUESTA_DESESTIMADA')),
    usuario TEXT NOT NULL,
    detalles_json TEXT NOT NULL,
    timestamp TEXT NOT NULL
);

-- Triggers de Inmutabilidad (D-05): Bloquean estrictamente UPDATE y DELETE en tablas de auditoría
CREATE TRIGGER IF NOT EXISTS trg_prevent_update_evaluaciones
BEFORE UPDATE ON auditoria_evaluaciones
BEGIN
    SELECT RAISE(ABORT, 'Violación de Inmutabilidad: Prohibido modificar registros de auditoría histórica de evaluaciones.');
END;

CREATE TRIGGER IF NOT EXISTS trg_prevent_delete_evaluaciones
BEFORE DELETE ON auditoria_evaluaciones
BEGIN
    SELECT RAISE(ABORT, 'Violación de Inmutabilidad: Prohibido eliminar registros de auditoría histórica de evaluaciones.');
END;

CREATE TRIGGER IF NOT EXISTS trg_prevent_update_rastro_auditoria
BEFORE UPDATE ON rastro_auditoria
BEGIN
    SELECT RAISE(ABORT, 'Violación de Inmutabilidad: Prohibido modificar el rastro de auditoría de umbrales.');
END;

CREATE TRIGGER IF NOT EXISTS trg_prevent_delete_rastro_auditoria
BEFORE DELETE ON rastro_auditoria
BEGIN
    SELECT RAISE(ABORT, 'Violación de Inmutabilidad: Prohibido eliminar el rastro de auditoría de umbrales.');
END;

-- Trigger para impedir edición de versiones de umbrales ya APROBADAS o DESESTIMADAS
CREATE TRIGGER IF NOT EXISTS trg_prevent_update_umbrales_cerrados
BEFORE UPDATE ON umbrales_flujo
FOR EACH ROW
WHEN OLD.estado IN ('APROBADO', 'DESESTIMADO')
BEGIN
    SELECT RAISE(ABORT, 'Violación de Inmutabilidad: Una versión de umbrales APROBADA o DESESTIMADA no puede ser modificada.');
END;

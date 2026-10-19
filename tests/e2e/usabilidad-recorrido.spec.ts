import { test, expect } from '@playwright/test';

/**
 * T048 - Métrica Automatizada de Usabilidad y Recorridos (SC-005, Criterios C4 y C5)
 *
 * NOTA METODOLÓGICA IMPORTANTE:
 * Esta suite de pruebas automatizada en Playwright mide la capacidad de respuesta,
 * los tiempos de ejecución de tareas clave en milisegundos y el número de clics requeridos
 * en la navegación de la interfaz web (SC-005: ≤ 2 clics para acceso a consultas/historiales
 * y ≤ 3 minutos [180.000 ms] para tareas clave).
 *
 * Esta verificación automatizada NO reemplaza la prueba de usabilidad con una persona externa
 * (evaluador sin inducción técnica previa según SC-005 (spec.md) y la sesión de aceptación),
 * sino que proporciona la línea base cuantitativa y evidencia técnica reproducible de que la UI
 * no impone fricciones estructurales ni caminos con exceso de interacciones.
 */

test.describe('T048 - Pruebas E2E de Usabilidad y Recorridos (SC-005)', () => {
  test.beforeEach(async ({ page }) => {
    // Registrar contador de clics reales con isTrusted === true en fase de captura sobre document
    await page.addInitScript(() => {
      (window as any).__clics = 0;
      document.addEventListener(
        'click',
        (e) => {
          if (e.isTrusted) {
            (window as any).__clics = ((window as any).__clics || 0) + 1;
          }
        },
        { capture: true }
      );
    });
  });

  test.describe('Recorridos de Consulta en ≤ 2 clics (SC-005)', () => {
    test('Recorrido (a): acceso a la política de umbrales vigente (F5) en ≤ 2 clics', async ({
      page,
    }, testInfo) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Reiniciar contador a 0 antes del recorrido (page.goto no cuenta)
      await page.evaluate(() => {
        (window as any).__clics = 0;
      });

      // Clic 1: Navegar a Gestión de Umbrales (F5)
      const tabUmbrales = page.locator('#nav-tab-umbrales');
      await expect(tabUmbrales).toBeVisible();
      await tabUmbrales.click();

      // Destino: Panel de umbrales vigentes visible
      const panelVigente = page.locator('#panel-umbrales-vigentes');
      await expect(panelVigente).toBeVisible();
      await expect(panelVigente.locator('.version-pill')).toBeVisible();

      const clics = await page.evaluate(() => (window as any).__clics || 0);

      const evidencia = {
        metrica: 'usabilidad_clics',
        recorrido: '(a) politica_umbrales_vigente_f5',
        clics,
        limiteMaximo: 2,
        cumpleSC005: clics >= 1 && clics <= 2,
      };
      testInfo.annotations.push({
        type: 'evidencia_clics',
        description: JSON.stringify(evidencia),
      });
      console.log(JSON.stringify(evidencia));

      expect(clics).toBeGreaterThanOrEqual(1);
      expect(clics).toBeLessThanOrEqual(2);
    });

    test('Recorrido (b): acceso al historial de versiones de umbrales (F5) en ≤ 2 clics', async ({
      page,
    }, testInfo) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Reiniciar contador a 0 antes del recorrido (page.goto no cuenta)
      await page.evaluate(() => {
        (window as any).__clics = 0;
      });

      // Clic 1: Navegar a Historial de Versiones (F5)
      const tabAuditoria = page.locator('#nav-tab-auditoria');
      await expect(tabAuditoria).toBeVisible();
      await tabAuditoria.click();

      // Destino: Historial de versiones visible
      const historialVersiones = page.locator('#historial-versiones-umbrales');
      await expect(historialVersiones).toBeVisible();
      await expect(historialVersiones.locator('.versions-table')).toBeVisible();

      const clics = await page.evaluate(() => (window as any).__clics || 0);

      const evidencia = {
        metrica: 'usabilidad_clics',
        recorrido: '(b) historial_versiones_umbrales_f5',
        clics,
        limiteMaximo: 2,
        cumpleSC005: clics >= 1 && clics <= 2,
      };
      testInfo.annotations.push({
        type: 'evidencia_clics',
        description: JSON.stringify(evidencia),
      });
      console.log(JSON.stringify(evidencia));

      expect(clics).toBeGreaterThanOrEqual(1);
      expect(clics).toBeLessThanOrEqual(2);
    });

    test('Recorrido (c): acceso al historial de evaluaciones (F4) en ≤ 2 clics', async ({
      page,
    }, testInfo) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Reiniciar contador a 0 antes del recorrido (page.goto no cuenta)
      await page.evaluate(() => {
        (window as any).__clics = 0;
      });

      // Clic 1: Navegar a Historial de Dictámenes (F4)
      const tabHistorialEval = page.locator('#nav-tab-historial-evaluaciones');
      await expect(tabHistorialEval).toBeVisible();
      await tabHistorialEval.click();

      // Destino: Historial de evaluaciones visible
      const historialEval = page.locator('#historial-evaluaciones-f4');
      await expect(historialEval).toBeVisible();

      const clics = await page.evaluate(() => (window as any).__clics || 0);

      const evidencia = {
        metrica: 'usabilidad_clics',
        recorrido: '(c) historial_evaluaciones_f4',
        clics,
        limiteMaximo: 2,
        cumpleSC005: clics >= 1 && clics <= 2,
      };
      testInfo.annotations.push({
        type: 'evidencia_clics',
        description: JSON.stringify(evidencia),
      });
      console.log(JSON.stringify(evidencia));

      expect(clics).toBeGreaterThanOrEqual(1);
      expect(clics).toBeLessThanOrEqual(2);
    });
  });

  test.describe('Tareas Clave con Tiempo Medido en < 3 minutos (180.000 ms) (SC-005)', () => {
    test('Tarea clave (i): evaluar un caso del catálogo y leer su dictamen en < 3 minutos', async ({
      page,
    }, testInfo) => {
      await page.goto('/');
      await page.locator('#nav-tab-evaluacion').click();
      await expect(page.locator('#catalogo-casos-prueba')).toBeVisible();

      const inicio = Date.now();

      // 1. Seleccionar caso del catálogo sintético
      const tarjetaCaso = page.locator('.case-item-card:has-text("CASO-MED-001")');
      await expect(tarjetaCaso).toBeVisible();
      await tarjetaCaso.click();

      // 2. Verificar que el formulario cargue el caso
      const formulario = page.locator('#formulario-evaluacion-caso');
      await expect(formulario).toBeVisible();
      await expect(formulario.locator('.case-id-badge')).toHaveText('CASO-MED-001');

      // 3. Ejecutar evaluación determinista
      const btnEvaluar = page.locator('#btn-ejecutar-evaluacion');
      await expect(btnEvaluar).toBeEnabled();
      await btnEvaluar.click();

      // 4. Leer dictamen completo en vista de resultado
      const vistaResultado = page.locator('#vista-resultado-evaluacion');
      await expect(vistaResultado).toBeVisible();
      await expect(vistaResultado.locator('#badge-decision-resolutiva')).toBeVisible();
      await expect(vistaResultado.locator('.score-number')).toBeVisible();

      const duracionMs = Date.now() - inicio;

      const evidencia = {
        metrica: 'tiempo_tarea_clave',
        tarea: '(i) evaluar_caso_y_leer_dictamen',
        duracionMs,
        duracionSegundos: Number((duracionMs / 1000).toFixed(2)),
        limiteMs: 180000,
        cumpleSC005: duracionMs < 180000,
      };
      testInfo.annotations.push({
        type: 'evidencia_tiempo',
        description: JSON.stringify(evidencia),
      });
      console.log(JSON.stringify(evidencia));

      expect(duracionMs).toBeLessThan(180000);
    });

    test('Tarea clave (ii): consultar la política vigente y su historial de versiones en < 3 minutos', async ({
      page,
    }, testInfo) => {
      await page.goto('/');

      const inicio = Date.now();

      // 1. Consultar política vigente en F5
      await page.locator('#nav-tab-umbrales').click();
      const panelVigente = page.locator('#panel-umbrales-vigentes');
      await expect(panelVigente).toBeVisible();
      await expect(panelVigente.locator('.version-pill')).toBeVisible();

      // 2. Consultar historial inmutable de versiones en F5
      await page.locator('#nav-tab-auditoria').click();
      const panelHistorial = page.locator('#historial-versiones-umbrales');
      await expect(panelHistorial).toBeVisible();
      await expect(panelHistorial.locator('.versions-table')).toBeVisible();

      const duracionMs = Date.now() - inicio;

      const evidencia = {
        metrica: 'tiempo_tarea_clave',
        tarea: '(ii) consultar_politica_vigente_e_historial_versiones',
        duracionMs,
        duracionSegundos: Number((duracionMs / 1000).toFixed(2)),
        limiteMs: 180000,
        cumpleSC005: duracionMs < 180000,
      };
      testInfo.annotations.push({
        type: 'evidencia_tiempo',
        description: JSON.stringify(evidencia),
      });
      console.log(JSON.stringify(evidencia));

      expect(duracionMs).toBeLessThan(180000);
    });

    test('Tarea clave (iii): reevaluar un registro del historial en < 3 minutos', async ({
      page,
    }, testInfo) => {
      await page.goto('/');

      const inicio = Date.now();

      // 1. Acceder al historial de dictámenes (F4)
      await page.locator('#nav-tab-historial-evaluaciones').click();
      const panelHistorial = page.locator('#historial-evaluaciones-f4');
      await expect(panelHistorial).toBeVisible();

      // Asegurar que exista al menos un registro en el historial para reevaluar
      const botonesReevaluar = page.locator('.versions-table tbody tr button:has-text("Reevaluar")');
      if ((await botonesReevaluar.count()) === 0) {
        await page.locator('#nav-tab-evaluacion').click();
        await page.locator('.case-item-card:has-text("CASO-MED-001")').click();
        await page.locator('#btn-ejecutar-evaluacion').click();
        await expect(page.locator('#vista-resultado-evaluacion')).toBeVisible();
        await page.locator('#nav-tab-historial-evaluaciones').click();
        await expect(panelHistorial).toBeVisible();
      }

      // 2. Ejecutar reevaluación determinista sobre el primer registro disponible
      const primerBotonReevaluar = page.locator('.versions-table tbody tr button:has-text("Reevaluar")').first();
      await expect(primerBotonReevaluar).toBeVisible();
      await primerBotonReevaluar.click();

      // 3. Verificar que la tarjeta de reevaluación determinista se despliegue con éxito
      const cajaReevaluacion = page.locator('.reevaluacion-box').first();
      await expect(cajaReevaluacion).toBeVisible();
      await expect(cajaReevaluacion).toContainText('Resultado de Reevaluación Determinista (SC-004)');
      await expect(cajaReevaluacion).toContainText('100% Determinista (SC-004 Verificado)');

      const duracionMs = Date.now() - inicio;

      const evidencia = {
        metrica: 'tiempo_tarea_clave',
        tarea: '(iii) reevaluar_registro_historial',
        duracionMs,
        duracionSegundos: Number((duracionMs / 1000).toFixed(2)),
        limiteMs: 180000,
        cumpleSC005: duracionMs < 180000,
      };
      testInfo.annotations.push({
        type: 'evidencia_tiempo',
        description: JSON.stringify(evidencia),
      });
      console.log(JSON.stringify(evidencia));

      expect(duracionMs).toBeLessThan(180000);
    });
  });
});

import { test, expect } from '@playwright/test';

interface CasoE2EEsperado {
  idCaso: string;
  criterio: string;
  decisionEsperada: 'APROBADO_AUTOMATICO' | 'DERIVADO_REVISION';
  motivoEtiquetaEsperada: string;
  riesgoAltoEsperado: boolean;
  scoreEsperado: string;
}

const CASOS_PRUEBA_ESPERADOS: CasoE2EEsperado[] = [
  {
    idCaso: 'CASO-MED-001',
    criterio: 'AC-1',
    decisionEsperada: 'APROBADO_AUTOMATICO',
    motivoEtiquetaEsperada: 'Aprobación Normativa',
    riesgoAltoEsperado: false,
    scoreEsperado: '94.0',
  },
  {
    idCaso: 'CASO-MED-002',
    criterio: 'AC-2',
    decisionEsperada: 'DERIVADO_REVISION',
    motivoEtiquetaEsperada: 'Señal Bajo Mínimo Propio',
    riesgoAltoEsperado: false,
    scoreEsperado: '91.0',
  },
  {
    idCaso: 'CASO-MED-003',
    criterio: 'AC-3',
    decisionEsperada: 'DERIVADO_REVISION',
    motivoEtiquetaEsperada: 'Precedencia de Fraude',
    riesgoAltoEsperado: false,
    scoreEsperado: '94.0',
  },
  {
    idCaso: 'CASO-MED-004',
    criterio: 'AC-4',
    decisionEsperada: 'DERIVADO_REVISION',
    motivoEtiquetaEsperada: 'Señal Bajo Mínimo Propio',
    riesgoAltoEsperado: true,
    scoreEsperado: '44.0',
  },
  {
    idCaso: 'CASO-MED-005',
    criterio: 'AC-5',
    decisionEsperada: 'DERIVADO_REVISION',
    motivoEtiquetaEsperada: 'Puntaje en Rango Intermedio',
    riesgoAltoEsperado: false,
    scoreEsperado: '75.0',
  },
  {
    idCaso: 'CASO-MED-006',
    criterio: 'AC-6',
    decisionEsperada: 'DERIVADO_REVISION',
    motivoEtiquetaEsperada: 'Señal Bajo Mínimo Propio',
    riesgoAltoEsperado: true,
    scoreEsperado: '40.0',
  },
];

test.describe('T047 - Suite E2E de Evaluación F4 y Cumplimiento de Invariantes (AC-1..AC-6, SC-001, SC-002)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#nav-tab-evaluacion').click();
    await expect(page.locator('#catalogo-casos-prueba')).toBeVisible();
  });

  for (const caso of CASOS_PRUEBA_ESPERADOS) {
    test(`evalúa ${caso.idCaso} (${caso.criterio}) con resolución ${caso.decisionEsperada} y sin rechazo automático`, async ({
      page,
    }) => {
      // 1. Seleccionar el caso en el catálogo sintético
      const tarjetaCaso = page.locator(`.case-item-card:has-text("${caso.idCaso}")`);
      await expect(tarjetaCaso).toBeVisible();
      await tarjetaCaso.click();

      // Verificar que el formulario de evaluación cargue el expediente seleccionado
      const formulario = page.locator('#formulario-evaluacion-caso');
      await expect(formulario).toBeVisible();
      await expect(formulario.locator('.case-id-badge')).toHaveText(caso.idCaso);

      // 2. Ejecutar la evaluación determinista
      const btnEvaluar = page.locator('#btn-ejecutar-evaluacion');
      await expect(btnEvaluar).toBeEnabled();
      await btnEvaluar.click();

      // 3. Verificar el dictamen en VistaResultado
      const vistaResultado = page.locator('#vista-resultado-evaluacion');
      await expect(vistaResultado).toBeVisible();
      await expect(vistaResultado.locator('.case-id-badge')).toHaveText(caso.idCaso);

      // Verificar Score Visual Global
      await expect(vistaResultado.locator('.score-number')).toHaveText(caso.scoreEsperado);

      // Verificar Estado Resolutivo
      const badgeDecision = vistaResultado.locator('#badge-decision-resolutiva');
      await expect(badgeDecision).toContainText(caso.decisionEsperada);

      // Invariante Absoluto (Principio I y SC-002): Prohibición de la palabra "Rechazado" como decisión
      const textoBadge = await badgeDecision.innerText();
      expect(textoBadge).not.toMatch(/rechazado/i);
      expect(textoBadge).not.toMatch(/rechazo automático/i);

      // Verificar Badge de Motivo Técnico
      const motivoLabel = vistaResultado.locator('.motivo-label');
      await expect(motivoLabel).toContainText(caso.motivoEtiquetaEsperada);

      // 4. Verificar tarjeta informativa de "Riesgo alto de rechazo: decide un operador" (SC-002, AC-4, AC-6)
      const alertaRiesgo = page.locator('#alerta-riesgo-alto-rechazo');
      if (caso.riesgoAltoEsperado) {
        await expect(alertaRiesgo).toBeVisible();
        await expect(alertaRiesgo.locator('.alert-high-risk-title')).toHaveText(
          'Riesgo alto de rechazo: decide un operador'
        );
      } else {
        await expect(alertaRiesgo).toHaveCount(0);
      }
    });
  }
});

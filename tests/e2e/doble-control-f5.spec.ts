import { test, expect } from '@playwright/test';

/**
 * Justificación de diseño de la propuesta v2 (Aislamiento y no-interferencia con F4):
 * Se aprueba una versión 2 con umbralAprobacion = 92.0 (y manteniendo intactos todos los demás parámetros de v1:
 * umbralRiesgoAlto = 60.0, mínimos = 70/70/60, pesos = 0.40/0.40/0.20).
 * Dado que CASO-MED-001 alcanza un puntaje de 94.0 (≥ 92.0), este cambio no altera ninguno de los resultados
 * esperados de la suite de negocio AC-1 a AC-6 ni la vigencia de reglas para evaluacion-f4.spec.ts.
 * De este modo, las pruebas E2E son robustas e independientes del orden de ejecución compartiendo la misma BD.
 */

test.describe('T046 - Flujo E2E de Doble Control y Segregación de Funciones en F5', () => {
  test('Diseñador 1 propone borrador v2, auto-aprobación es bloqueada, Administrador 1 aprueba y v2 entra en vigencia', async ({
    page,
  }) => {
    // 1. Acceder a la aplicación MIRA
    await page.goto('/');

    // 2. Navegar a la pestaña de Gestión de Umbrales (F5) en ≤ 2 clics
    await page.locator('#nav-tab-umbrales').click();
    await expect(page.locator('#panel-umbrales-vigentes')).toBeVisible();

    // Verificar que inicialmente rige la Versión 1 por defecto
    await expect(page.locator('#panel-umbrales-vigentes .version-pill')).toHaveText('Versión 1');
    await expect(page.locator('#panel-umbrales-vigentes .card-header .badge-approved')).toContainText('APROBADO');

    // 3. Login simulado como "Diseñador 1"
    const selectorIdentidad = page.locator('#selector-identidad-simulada');
    await selectorIdentidad.selectOption('Diseñador 1');
    await expect(page.locator('.session-role-tag')).toHaveText('Diseñador');

    // 4. Diseñador 1 propone borrador v2
    const formPropuesta = page.locator('#formulario-propuesta-umbrales');
    await expect(formPropuesta).toBeVisible();

    // Modificar umbralAprobacion a 92.0 manteniendo el resto de parámetros idénticos a v1
    const inputUmbralAprobacion = page.locator('#input-umbral-aprobacion');
    await inputUmbralAprobacion.fill('92.0');

    // Verificar que la suma de pesos sea exactamente 1.00 (✓)
    await expect(page.locator('#indicador-suma-pesos')).toContainText('✓');

    // Registrar la propuesta en estado BORRADOR
    const btnGuardarPropuesta = page.locator('#btn-guardar-propuesta');
    await expect(btnGuardarPropuesta).toBeEnabled();
    await btnGuardarPropuesta.click();

    // 5. Verificar que la propuesta aparece en la Bandeja de Revisión en estado BORRADOR
    const bandejaRevision = page.locator('#bandeja-revision-propuestas');
    await expect(bandejaRevision).toBeVisible();
    await expect(bandejaRevision).toContainText('Revisión de Propuesta — Versión 2 (BORRADOR)');
    await expect(bandejaRevision).toContainText('Propuesto por: Diseñador 1');

    // 6. Intento de auto-aprobación con Diseñador 1 activo: debe estar bloqueado preventivamente
    const alertaBloqueo = page.locator('#alerta-bloqueo-auto-aprobacion');
    await expect(alertaBloqueo).toBeVisible();
    await expect(alertaBloqueo).toContainText('Bloqueo por Segregación de Funciones');
    await expect(alertaBloqueo).toContainText('quien propone jamás puede aprobar');

    const btnAprobar = page.locator('#btn-aprobar-propuesta');
    await expect(btnAprobar).toBeDisabled();

    // 7. Conmutar sesión activa a "Administrador 1" desde el selector de identidades
    await selectorIdentidad.selectOption('Administrador 1');
    await expect(page.locator('.session-role-tag')).toHaveText('Administrador');

    // La alerta de auto-aprobación debe desaparecer y el botón de aprobación debe habilitarse
    await expect(alertaBloqueo).toHaveCount(0);
    await expect(btnAprobar).toBeEnabled();

    // 8. Administrador 1 aprueba formalmente la propuesta
    await btnAprobar.click();

    // 9. Verificar que v2 aparece formalmente vigente en la UI
    // Panel de umbrales vigentes actualizado a Versión 2 con umbral 92.0
    await expect(page.locator('#panel-umbrales-vigentes .version-pill')).toHaveText('Versión 2');
    await expect(page.locator('#panel-umbrales-vigentes .policy-number.text-approved')).toHaveText('92.0');
    await expect(page.locator('#panel-umbrales-vigentes .policy-audit-footer')).toContainText('Administrador 1');

    // La bandeja de revisión ahora debe estar vacía (sin borradores pendientes)
    await expect(page.locator('.review-inbox-card.empty')).toBeVisible();
    await expect(page.locator('.review-inbox-card .empty-state-title')).toHaveText(
      'Bandeja de Revisión Administrativa Vacía'
    );
  });
});

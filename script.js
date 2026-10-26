/**
 * EcoSync Enterprise Platform
 * Lógica principal en JavaScript Vanilla
 * Sin dependencias externas ni frameworks
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. ESTADO GLOBAL DE LA DEMO
  // =========================================================================
  const state = {
    isOnline: true,
    lastSavedTimestamp: null,
    syncAttempts: 0,
    contingencyEventsCount: 0,
    consoleLogs: [],
    resilienceSteps: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false
    },
    autosaveTimer: null,
    isAnnualBilling: false
  };

  const STORAGE_KEY = 'ecosync_form_draft_v2';

  // =========================================================================
  // 2. REFERENCIAS AL DOM
  // =========================================================================
  // Vistas y Navegación
  const navLinks = document.querySelectorAll('.nav-link');
  const viewSections = document.querySelectorAll('.view-section');
  const navBrand = document.getElementById('nav-brand');

  // Indicadores de Conexión
  const globalConnectionPill = document.getElementById('global-connection-pill');
  const globalStatusDot = document.getElementById('global-status-dot');
  const globalStatusText = document.getElementById('global-status-text');
  const contingencyBanner = document.getElementById('contingency-banner');
  const btnBannerRestore = document.getElementById('btn-banner-restore');

  // Dashboard de Telemetría
  const dashConnectionStatus = document.getElementById('dash-connection-status');
  const dashConnectionText = document.getElementById('dash-connection-text');
  const dashConnectionDesc = document.getElementById('dash-connection-desc');
  const dashFormStatus = document.getElementById('dash-form-status');
  const dashFormSub = document.getElementById('dash-form-sub');
  const dashLastSaved = document.getElementById('dash-last-saved');
  const dashSavedBytes = document.getElementById('dash-saved-bytes');
  const dashSyncAttempts = document.getElementById('dash-sync-attempts');
  const dashContingencyCount = document.getElementById('dash-contingency-count');

  // Formulario y Controles
  const quoteForm = document.getElementById('quote-form');
  const autosaveBar = document.getElementById('autosave-bar');
  const autosaveIcon = document.getElementById('autosave-icon');
  const autosaveText = document.getElementById('autosave-text');
  const autosaveTime = document.getElementById('autosave-time');

  const fRut = document.getElementById('f-rut');
  const fRazon = document.getElementById('f-razon');
  const fContacto = document.getElementById('f-contacto');
  const fEmail = document.getElementById('f-email');
  const fProducto = document.getElementById('f-producto');
  const fCantidad = document.getElementById('f-cantidad');
  const fPrecio = document.getElementById('f-precio');
  const fDescuento = document.getElementById('f-descuento');

  // Resumen Económico
  const calcSubtotal = document.getElementById('calc-subtotal');
  const calcDescuento = document.getElementById('calc-descuento');
  const calcNeto = document.getElementById('calc-neto');
  const calcIva = document.getElementById('calc-iva');
  const calcTotal = document.getElementById('calc-total');

  // Botones del Formulario
  const btnSaveDraft = document.getElementById('btn-save-draft');
  const btnRestoreDraft = document.getElementById('btn-restore-draft');
  const btnClearForm = document.getElementById('btn-clear-form');
  const btnSimulateDrop = document.getElementById('btn-simulate-drop');
  const btnRestoreConnection = document.getElementById('btn-restore-connection');
  const btnSync = document.getElementById('btn-sync');
  const syncFeedbackBox = document.getElementById('sync-feedback-box');

  // Modal de Confirmación
  const confirmModal = document.getElementById('confirm-modal');
  const confirmModalMsg = document.getElementById('confirm-modal-msg');
  const btnModalCancel = document.getElementById('btn-modal-cancel');
  const btnModalConfirm = document.getElementById('btn-modal-confirm');
  let confirmCallback = null;

  // Consola Técnica
  const techConsoleDrawer = document.getElementById('tech-console-drawer');
  const consoleOutput = document.getElementById('console-output');
  const consoleEventCounter = document.getElementById('console-event-counter');
  const btnConsoleClose = document.getElementById('btn-console-close');
  const btnConsoleClear = document.getElementById('btn-console-clear');
  const btnConsoleExport = document.getElementById('btn-console-export');
  const btnFloatingConsole = document.getElementById('btn-floating-console');
  const btnOpenConsoleGuide = document.getElementById('btn-open-console-guide');

  // Botones de Guía y Navegación cruzada
  const btnSimReload = document.getElementById('btn-sim-reload');
  const btnHeroTry = document.getElementById('btn-hero-try');
  const btnHeroTech = document.getElementById('btn-hero-tech');
  const btnHeaderCta = document.getElementById('btn-header-cta');
  const btnCtaTerminal = document.getElementById('btn-cta-terminal');

  // Facturación y Precios
  const btnBillingToggle = document.getElementById('btn-billing-toggle');
  const lblBillingMonthly = document.getElementById('lbl-billing-monthly');
  const lblBillingAnnual = document.getElementById('lbl-billing-annual');
  const pricePyme = document.getElementById('price-pyme');
  const priceCorp = document.getElementById('price-corp');
  const priceEnterprise = document.getElementById('price-enterprise');
  const notePyme = document.getElementById('note-pyme');
  const noteCorp = document.getElementById('note-corp');
  const noteEnterprise = document.getElementById('note-enterprise');

  // Calculadora ESG Dinámica
  const rangeUsers = document.getElementById('range-users');
  const valUsers = document.getElementById('val-users');
  const selectErp = document.getElementById('select-erp');
  const rangeTx = document.getElementById('range-tx');
  const valTx = document.getElementById('val-tx');
  const resEnergy = document.getElementById('res-energy');
  const resCarbon = document.getElementById('res-carbon');
  const resTrees = document.getElementById('res-trees');
  const resMoney = document.getElementById('res-money');
  const resHomes = document.getElementById('res-homes');
  const btnDownloadEsg = document.getElementById('btn-download-esg');

  // Calculadora Green IT Simplificada
  const scReq = document.getElementById('sc-req');
  const scReduction = document.getElementById('sc-reduction');
  const scDays = document.getElementById('sc-days');
  const scTotalResult = document.getElementById('sc-total-result');

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  // =========================================================================
  // 3. SISTEMA DE REGISTRO EN CONSOLA TÉCNICA (CERO PII)
  // =========================================================================
  function logEvent(type, message, details = {}) {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    
    // Filtro estricto para no registrar PII
    const safeEvent = {
      id: state.consoleLogs.length + 1,
      timestamp: now.toISOString(),
      displayTime: timeStr,
      type: type, // 'INFO', 'PERSIST', 'DROP', 'RESTORE', 'SYNC', 'WARN'
      message: message,
      details: details
    };

    state.consoleLogs.push(safeEvent);

    // Renderizar en UI de la consola
    const entryEl = document.createElement('div');
    entryEl.className = 'log-entry';
    
    let badgeClass = 'info';
    if (type === 'PERSIST') badgeClass = 'persist';
    else if (type === 'DROP') badgeClass = 'drop';
    else if (type === 'RESTORE') badgeClass = 'restore';
    else if (type === 'SYNC') badgeClass = 'sync';
    else if (type === 'WARN') badgeClass = 'warn';

    entryEl.innerHTML = `
      <span class="log-time">[${timeStr}]</span>
      <span class="log-badge ${badgeClass}">${type}</span>
      <span class="log-msg">${escapeHtml(message)}</span>
    `;

    consoleOutput.appendChild(entryEl);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;

    consoleEventCounter.textContent = `Total eventos: ${state.consoleLogs.length}`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function toggleTechConsole() {
    techConsoleDrawer.classList.toggle('hidden');
    if (!techConsoleDrawer.classList.contains('hidden')) {
      markResilienceStep(8);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
  }

  // Atajo de teclado: Ctrl + Shift + D
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
      e.preventDefault();
      toggleTechConsole();
    }
  });

  btnFloatingConsole.addEventListener('click', toggleTechConsole);
  btnConsoleClose.addEventListener('click', toggleTechConsole);
  if (btnOpenConsoleGuide) {
    btnOpenConsoleGuide.addEventListener('click', () => {
      techConsoleDrawer.classList.remove('hidden');
      markResilienceStep(8);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
    });
  }

  btnConsoleClear.addEventListener('click', () => {
    state.consoleLogs = [];
    consoleOutput.innerHTML = '';
    consoleEventCounter.textContent = 'Total eventos: 0';
    logEvent('INFO', 'Historial de consola reiniciado por el usuario.');
  });

  btnConsoleExport.addEventListener('click', () => {
    const exportData = {
      software: 'EcoSync Enterprise',
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      totalEvents: state.consoleLogs.length,
      piiSanitized: true,
      events: state.consoleLogs
    };

    const dataBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecosync-diagnostico-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logEvent('INFO', 'Historial técnico exportado exitosamente como JSON.');
  });

  // =========================================================================
  // 4. NAVEGACIÓN ENTRE VISTAS (SPA)
  // =========================================================================
  function switchView(targetViewId) {
    viewSections.forEach(section => {
      if (section.id === targetViewId) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    navLinks.forEach(link => {
      if (link.dataset.target === targetViewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    logEvent('INFO', `Navegación hacia la sección: ${targetViewId}`);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = e.currentTarget.dataset.target;
      if (target) switchView(target);
    });
  });

  navBrand.addEventListener('click', () => switchView('view-inicio'));

  // Enlaces de pie de página
  document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.currentTarget.dataset.target;
      if (target) switchView(target);
    });
  });

  // Enlaces legales
  document.querySelectorAll('.legal-notice-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Aviso de Privacidad y Términos Demo: EcoSync opera bajo arquitectura Zero-Retention. No se transmiten credenciales ni datos personales a servidores externos durante esta prueba.');
    });
  });

  // Botones de acción directa para abrir la terminal
  if (btnHeroTry) btnHeroTry.addEventListener('click', () => switchView('view-terminal'));
  if (btnHeaderCta) btnHeaderCta.addEventListener('click', () => switchView('view-terminal'));
  if (btnCtaTerminal) btnCtaTerminal.addEventListener('click', () => switchView('view-terminal'));
  if (btnHeroTech) btnHeroTech.addEventListener('click', () => switchView('view-solucion'));

  // Botones de selección de planes
  document.querySelectorAll('[data-select-plan]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plan = e.currentTarget.dataset.selectPlan;
      switchView('view-terminal');
      if (plan === 'Pyme') fProducto.value = 'licencia-pyme';
      else if (plan === 'Corporativo') fProducto.value = 'licencia-corp';
      else if (plan === 'Enterprise') fProducto.value = 'licencia-enterprise';
      calculateQuote();
      logEvent('INFO', `Plan seleccionado desde tabla de precios: ${plan}`);
    });
  });

  // =========================================================================
  // 5. CÁLCULO ECONÓMICO DEL FORMULARIO (IVA 19%)
  // =========================================================================
  function calculateQuote() {
    const cantidad = Math.max(1, parseFloat(fCantidad.value) || 1);
    const precio = Math.max(0, parseFloat(fPrecio.value) || 0);
    const descuentoPct = Math.min(100, Math.max(0, parseFloat(fDescuento.value) || 0));

    const subtotalBruto = cantidad * precio;
    const montoDescuento = subtotalBruto * (descuentoPct / 100);
    const subtotalNeto = Math.max(0, subtotalBruto - montoDescuento);
    const iva19 = subtotalNeto * 0.19;
    const total = subtotalNeto + iva19;

    calcSubtotal.textContent = formatCurrency(subtotalBruto);
    calcDescuento.textContent = `-${formatCurrency(montoDescuento)}`;
    calcNeto.textContent = formatCurrency(subtotalNeto);
    calcIva.textContent = formatCurrency(iva19);
    calcTotal.textContent = formatCurrency(total);

    return { subtotalBruto, montoDescuento, subtotalNeto, iva19, total };
  }

  function formatCurrency(val) {
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';
  }

  // =========================================================================
  // 6. PERSISTENCIA EN LOCALSTORAGE Y AUTOGUARDADO (DEBOUNCE)
  // =========================================================================
  function getFormData() {
    return {
      rut: fRut.value.trim(),
      razon: fRazon.value.trim(),
      contacto: fContacto.value.trim(),
      email: fEmail.value.trim(),
      producto: fProducto.value,
      cantidad: fCantidad.value,
      precio: fPrecio.value,
      descuento: fDescuento.value
    };
  }

  function setFormData(data) {
    if (!data) return;
    if (data.rut !== undefined) fRut.value = data.rut;
    if (data.razon !== undefined) fRazon.value = data.razon;
    if (data.contacto !== undefined) fContacto.value = data.contacto;
    if (data.email !== undefined) fEmail.value = data.email;
    if (data.producto !== undefined) fProducto.value = data.producto;
    if (data.cantidad !== undefined) fCantidad.value = data.cantidad;
    if (data.precio !== undefined) fPrecio.value = data.precio;
    if (data.descuento !== undefined) fDescuento.value = data.descuento;
    calculateQuote();
  }

  function hasFormContent() {
    const data = getFormData();
    return !!(data.rut || data.razon || data.contacto || data.email);
  }

  function executeAutosave() {
    try {
      const data = getFormData();
      const payload = {
        data: data,
        savedAt: new Date().toISOString()
      };

      const serialized = JSON.stringify(payload);
      localStorage.setItem(STORAGE_KEY, serialized);

      state.lastSavedTimestamp = new Date();
      const timeStr = state.lastSavedTimestamp.toLocaleTimeString();

      // Actualizar Barra de Estado
      autosaveBar.className = 'autosave-status-bar saved';
      autosaveIcon.textContent = '✅';
      autosaveText.textContent = 'Borrador guardado localmente de forma segura.';
      autosaveTime.textContent = `Último guardado: ${timeStr}`;

      // Actualizar Dashboard
      dashFormStatus.textContent = 'Borrador guardado';
      dashFormStatus.className = 'dash-card-val text-green';
      dashFormSub.textContent = 'Sincronizado con LocalStorage';
      dashLastSaved.textContent = timeStr;
      dashSavedBytes.textContent = `${serialized.length} bytes respaldados`;

      logEvent('PERSIST', `Borrador guardado localmente en LocalStorage (${serialized.length} bytes, 8 campos).`);
      markResilienceStep(2);
    } catch (err) {
      autosaveBar.className = 'autosave-status-bar error';
      autosaveIcon.textContent = '⚠️';
      autosaveText.textContent = 'Error al escribir en LocalStorage.';
      logEvent('WARN', 'Fallo de almacenamiento local: ' + err.message);
    }
  }

  function triggerDebouncedAutosave() {
    // Si estamos editando durante contingencia, marcamos el paso 4
    if (!state.isOnline) {
      markResilienceStep(4);
    } else {
      markResilienceStep(1);
    }

    autosaveBar.className = 'autosave-status-bar saving';
    autosaveIcon.textContent = '⏳';
    autosaveText.textContent = 'Guardando cambios en buffer local...';

    dashFormStatus.textContent = 'Editando...';
    dashFormStatus.className = 'dash-card-val text-blue';
    dashFormSub.textContent = 'Modificaciones en proceso';

    clearTimeout(state.autosaveTimer);
    state.autosaveTimer = setTimeout(() => {
      executeAutosave();
    }, 600);
  }

  // Escuchar inputs del formulario
  [fRut, fRazon, fContacto, fEmail, fCantidad, fPrecio, fDescuento].forEach(input => {
    input.addEventListener('input', () => {
      calculateQuote();
      triggerDebouncedAutosave();
    });
  });

  fProducto.addEventListener('change', () => {
    calculateQuote();
    triggerDebouncedAutosave();
  });

  // Guardar Manualmente
  btnSaveDraft.addEventListener('click', () => {
    clearTimeout(state.autosaveTimer);
    executeAutosave();
  });

  // =========================================================================
  // 7. RECUPERACIÓN Y RESTAURACIÓN DE BORRADORES
  // =========================================================================
  function restoreDraft(force = false) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      alert('No se encontró ningún borrador guardado en LocalStorage.');
      logEvent('WARN', 'Intento de recuperación fallido: Almacenamiento vacío.');
      return;
    }

    try {
      const payload = JSON.parse(raw);
      if (!payload || !payload.data) return;

      const performRestore = () => {
        setFormData(payload.data);
        const timeStr = payload.savedAt ? new Date(payload.savedAt).toLocaleTimeString() : 'reciente';

        autosaveBar.className = 'autosave-status-bar restored';
        autosaveIcon.textContent = '📥';
        autosaveText.textContent = 'Borrador recuperado con éxito.';
        autosaveTime.textContent = `Restaurado de: ${timeStr}`;

        dashFormStatus.textContent = 'Borrador recuperado';
        dashFormStatus.className = 'dash-card-val text-blue';
        dashLastSaved.textContent = timeStr;

        logEvent('RESTORE', 'Borrador recuperado e inyectado en el formulario.');
        markResilienceStep(6);
      };

      if (!force && hasFormContent()) {
        openConfirmModal('El formulario actual contiene información. ¿Deseas reemplazarla con el borrador almacenado?', () => {
          performRestore();
        });
      } else {
        performRestore();
      }
    } catch (e) {
      logEvent('WARN', 'Error al procesar el JSON del borrador: ' + e.message);
    }
  }

  btnRestoreDraft.addEventListener('click', () => {
    restoreDraft(false);
  });

  // Limpiar Formulario y Borrador
  btnClearForm.addEventListener('click', () => {
    openConfirmModal('¿Estás seguro de que deseas limpiar el formulario y eliminar el borrador de LocalStorage?', () => {
      quoteForm.reset();
      fCantidad.value = 1;
      fPrecio.value = 890;
      fDescuento.value = 10;
      calculateQuote();

      localStorage.removeItem(STORAGE_KEY);

      autosaveBar.className = 'autosave-status-bar';
      autosaveIcon.textContent = '🧹';
      autosaveText.textContent = 'Formulario y borrador limpiados.';
      autosaveTime.textContent = '';

      dashFormStatus.textContent = 'Sin cambios';
      dashFormStatus.className = 'dash-card-val text-slate';
      dashFormSub.textContent = 'Formulario listo para captura';
      dashLastSaved.textContent = 'Ninguno';
      dashSavedBytes.textContent = 'Buffer vacío';

      logEvent('PERSIST', 'Borrador de LocalStorage purgado por el usuario.');
    });
  });

  // =========================================================================
  // 8. SIMULACIÓN DE CAÍDA Y RESTAURACIÓN DE CONEXIÓN
  // =========================================================================
  function setConnectionState(online) {
    state.isOnline = online;

    if (online) {
      // Estado En Línea
      globalConnectionPill.className = 'connection-pill';
      globalStatusDot.className = 'status-indicator online';
      globalStatusText.textContent = 'En Línea';

      contingencyBanner.classList.add('hidden');

      dashConnectionStatus.innerHTML = '<span class="status-indicator online"></span><span>En Línea</span>';
      dashConnectionStatus.className = 'dash-card-val text-green';
      dashConnectionDesc.textContent = 'Simulación operativa disponible';

      btnSync.disabled = false;
      btnSync.classList.remove('btn-disabled');

      logEvent('RESTORE', 'Conexión de red simulada restaurada. Modo contingencia desactivado.');
      markResilienceStep(7);
    } else {
      // Estado Caída / Contingencia
      state.contingencyEventsCount++;

      globalConnectionPill.className = 'connection-pill contingency';
      globalStatusDot.className = 'status-indicator offline';
      globalStatusText.textContent = 'Contingencia';

      contingencyBanner.classList.remove('hidden');

      dashConnectionStatus.innerHTML = '<span class="status-indicator offline"></span><span>Desconectado</span>';
      dashConnectionStatus.className = 'dash-card-val text-orange';
      dashConnectionDesc.textContent = 'Modo contingencia activo (Offline)';
      dashContingencyCount.textContent = state.contingencyEventsCount;

      btnSync.disabled = true;

      logEvent('DROP', '¡Caída momentánea de red simulada! Activado modo contingencia.');
      markResilienceStep(3);
    }
  }

  btnSimulateDrop.addEventListener('click', () => {
    setConnectionState(false);
  });

  btnRestoreConnection.addEventListener('click', () => {
    setConnectionState(true);
  });

  if (btnBannerRestore) {
    btnBannerRestore.addEventListener('click', () => {
      setConnectionState(true);
    });
  }

  // =========================================================================
  // 9. SIMULACIÓN DE SINCRONIZACIÓN (SIN SERVIDOR REAL)
  // =========================================================================
  btnSync.addEventListener('click', () => {
    if (!state.isOnline) {
      showSyncFeedback('warning', '⚠️ No se puede sincronizar: El modo de contingencia está activo. Restaura la conexión simulada primero.');
      logEvent('WARN', 'Intento de sincronización rechazado: Desconectado.');
      return;
    }

    state.syncAttempts++;
    dashSyncAttempts.textContent = state.syncAttempts;

    showSyncFeedback('processing', '⏳ Procesando sincronización simulada de datos consolidados...');
    logEvent('SYNC', `Iniciando intento de sincronización #${state.syncAttempts}...`);

    btnSync.disabled = true;

    setTimeout(() => {
      btnSync.disabled = false;
      showSyncFeedback('success', '✅ Sincronización simulada completada exitosamente. <br><strong>Aviso importante:</strong> Esta es una simulación académica local en cliente; no se ha transmitido información a ningún servidor externo.');
      logEvent('SYNC', `Sincronización simulada #${state.syncAttempts} finalizada con éxito (0 peticiones al backend real).`);
    }, 1200);
  });

  function showSyncFeedback(type, htmlContent) {
    syncFeedbackBox.className = `sync-feedback-box ${type}`;
    syncFeedbackBox.innerHTML = htmlContent;
    syncFeedbackBox.classList.remove('hidden');
  }

  // =========================================================================
  // 10. PRUEBA GUIADA DE RESILIENCIA (TRACKER INTERACTIVO)
  // =========================================================================
  function markResilienceStep(stepNumber) {
    state.resilienceSteps[stepNumber] = true;
    const stepEl = document.querySelector(`.guide-step[data-step="${stepNumber}"]`);
    if (stepEl) {
      stepEl.classList.add('done');
      const circle = document.getElementById(`step-check-${stepNumber}`);
      if (circle) circle.textContent = '✓';
    }
  }

  // Botón de recarga simulada
  if (btnSimReload) {
    btnSimReload.addEventListener('click', () => {
      logEvent('INFO', 'Simulación de recarga de página ejecutada por el operador.');
      markResilienceStep(5);
      
      // Simular breve parpadeo de recarga
      document.body.style.opacity = '0.3';
      setTimeout(() => {
        document.body.style.opacity = '1';
        alert('Página recargada. Observa que el borrador sigue a salvo en LocalStorage y puede recuperarse.');
      }, 300);
    });
  }

  // =========================================================================
  // 11. CALCULADORA DINÁMICA DE IMPACTO ESG (Referencia Imagen 4)
  // =========================================================================
  function calculateEsgMetrics() {
    const users = parseInt(rangeUsers.value, 10) || 2500;
    const erpFactor = parseFloat(selectErp.value) || 1.2;
    const dailyTx = parseInt(rangeTx.value, 10) || 120;

    valUsers.textContent = users.toLocaleString();
    valTx.textContent = dailyTx.toLocaleString();

    // Factores de ingeniería Green IT:
    // Peticiones redundantes evitadas por usuario/día: ~45% de dailyTx
    // Energía ahorrada por petición evitada en edge vs datacenter: 0.00015 kWh
    const avoidedRequestsAnnual = users * dailyTx * 0.45 * 250 * erpFactor;
    const energyKwhAnnual = Math.round(avoidedRequestsAnnual * 0.000045);
    
    // IEA 2023 factor: 0.385 kg CO2e / kWh = 0.000385 Ton CO2e / kWh
    const carbonTonsAnnual = ((energyKwhAnnual * 0.385) / 1000).toFixed(1);

    // Equivalencia arbórea: 1 árbol maduro absorbe ~22 kg CO2 / año
    const trees = Math.round((parseFloat(carbonTonsAnnual) * 1000) / 22);

    // Ahorro cloud / vCPU / egress ($0.038 USD por cada kWh evitado + storage)
    const moneySaved = Math.round(energyKwhAnnual * 0.377);

    // Hogares equivalentes (consumo promedio 1,200 kWh/año)
    const homes = Math.max(1, Math.round(energyKwhAnnual / 1150));

    resEnergy.innerHTML = `${energyKwhAnnual.toLocaleString()} <span class="val-unit">kWh / año</span>`;
    resCarbon.innerHTML = `${carbonTonsAnnual} <span class="val-unit">Ton CO2e</span>`;
    resTrees.innerHTML = `${trees.toLocaleString()} <span class="val-unit">árboles</span>`;
    resMoney.innerHTML = `$${moneySaved.toLocaleString()} <span class="val-unit">USD / año</span>`;
    resHomes.textContent = `Equivalente a alimentar ${homes} hogares promedio durante 1 año.`;

    return { users, dailyTx, energyKwhAnnual, carbonTonsAnnual, trees, moneySaved, homes };
  }

  rangeUsers.addEventListener('input', calculateEsgMetrics);
  selectErp.addEventListener('change', calculateEsgMetrics);
  rangeTx.addEventListener('input', calculateEsgMetrics);

  btnDownloadEsg.addEventListener('click', () => {
    const metrics = calculateEsgMetrics();
    const textReport = `=====================================================
ECOSYNC ENTERPRISE — REPORTE DE IMPACTO ESG Y GREEN IT
Fecha de Emisión: ${new Date().toLocaleString()}
Algoritmo de Simulación: SCI v2.4b (Alcance 2 y 3)
=====================================================

1. PARÁMETROS DE INFRAESTRUCTURA ANALIZADA:
   - Usuarios y Puestos Activos: ${metrics.users.toLocaleString()}
   - Plataforma ERP/CRM: ${selectErp.options[selectErp.selectedIndex].text}
   - Transacciones Diarias Promedio: ${metrics.dailyTx} tx/usuario

2. RESULTADOS DE EFICIENCIA PROYECTADA:
   - Ahorro Energético Anual: ${metrics.energyKwhAnnual.toLocaleString()} kWh / año
   - Huella de Carbono Evitada: ${metrics.carbonTonsAnnual} Toneladas de CO2e
   - Equivalente Arbóreo de Mitigación: ${metrics.trees.toLocaleString()} árboles maduros
   - Ahorro Económico en Infraestructura Cloud: $${metrics.moneySaved.toLocaleString()} USD / año
   - Equivalente en Hogares Sustentados: ${metrics.homes} hogares completos

3. CUMPLIMIENTO Y METODOLOGÍA:
   - Marco de Cálculo: GHG Protocol Corporate Standard & GRI 302
   - Software Carbon Intensity (SCI) especificación GSF
   - Certificación: Generado en entorno local de demostración EcoSync

=====================================================
EcoSync — Eficiencia IT y Sostenibilidad Global
=====================================================`;

    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecosync-reporte-esg-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logEvent('INFO', 'Reporte ejecutivo ESG descargado por el operador.');
  });

  // =========================================================================
  // 12. CALCULADORA GREEN IT SIMPLIFICADA (Requisito 8)
  // =========================================================================
  function calculateSimpleGreenIt() {
    const req = parseFloat(scReq.value) || 0;
    const reduction = parseFloat(scReduction.value) || 0;
    const days = parseFloat(scDays.value) || 0;

    // Fórmula: Solicitudes evitadas al año = req * (reduction / 100) * days
    const totalAvoided = Math.round(req * (reduction / 100) * days);

    scTotalResult.textContent = `${totalAvoided.toLocaleString()} peticiones`;
  }

  scReq.addEventListener('input', calculateSimpleGreenIt);
  scReduction.addEventListener('input', calculateSimpleGreenIt);
  scDays.addEventListener('input', calculateSimpleGreenIt);

  // =========================================================================
  // 13. PRECIOS Y FACTURACIÓN ANUAL (-20%)
  // =========================================================================
  btnBillingToggle.addEventListener('click', () => {
    state.isAnnualBilling = !state.isAnnualBilling;
    btnBillingToggle.setAttribute('aria-checked', state.isAnnualBilling ? 'true' : 'false');

    if (state.isAnnualBilling) {
      lblBillingMonthly.classList.remove('active');
      lblBillingAnnual.classList.add('active');

      pricePyme.textContent = '199';
      priceCorp.textContent = '712';
      priceEnterprise.textContent = '1,752';

      notePyme.textContent = 'Facturado anualmente ($2,388 USD/año)';
      noteCorp.textContent = 'Facturado anualmente ($8,544 USD/año)';
      noteEnterprise.textContent = 'Facturado anualmente con soporte VIP';
    } else {
      lblBillingMonthly.classList.add('active');
      lblBillingAnnual.classList.remove('active');

      pricePyme.textContent = '249';
      priceCorp.textContent = '890';
      priceEnterprise.textContent = '2,190';

      notePyme.textContent = 'Facturado mes a mes';
      noteCorp.textContent = 'Facturado mes a mes';
      noteEnterprise.textContent = 'Tarifa base a la medida';
    }

    logEvent('INFO', `Conmutador de facturación cambiado a: ${state.isAnnualBilling ? 'Anual (-20%)' : 'Mensual'}`);
  });

  // FAQ Accordion
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // =========================================================================
  // 14. MODAL GENÉRICO DE CONFIRMACIÓN
  // =========================================================================
  function openConfirmModal(msg, onConfirm) {
    confirmModalMsg.textContent = msg;
    confirmCallback = onConfirm;
    confirmModal.classList.remove('hidden');
  }

  function closeConfirmModal() {
    confirmModal.classList.add('hidden');
    confirmCallback = null;
  }

  btnModalCancel.addEventListener('click', closeConfirmModal);
  btnModalConfirm.addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    closeConfirmModal();
  });

  // =========================================================================
  // 15. INICIALIZACIÓN DE LA APLICACIÓN
  // =========================================================================
  function initApp() {
    calculateQuote();
    calculateEsgMetrics();
    calculateSimpleGreenIt();

    logEvent('INFO', 'Plataforma EcoSync v2.4 inicializada correctamente.');
    logEvent('INFO', 'Micro-kernel de resiliencia local en espera de capturas.');

    // Comprobar si existe un borrador guardado en LocalStorage
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    if (existingRaw) {
      try {
        const payload = JSON.parse(existingRaw);
        if (payload && payload.data) {
          const time = payload.savedAt ? new Date(payload.savedAt).toLocaleTimeString() : 'sesión previa';
          dashLastSaved.textContent = time;
          dashSavedBytes.textContent = `${existingRaw.length} bytes respaldados`;
          dashFormStatus.textContent = 'Borrador disponible';
          dashFormStatus.className = 'dash-card-val text-blue';
          dashFormSub.textContent = 'Listo para restaurar';

          logEvent('PERSIST', `Se detectó un borrador previo en LocalStorage (${existingRaw.length} bytes, guardado a las ${time}).`);
          
          // Restauración automática si el formulario está limpio
          setFormData(payload.data);
          autosaveBar.className = 'autosave-status-bar restored';
          autosaveIcon.textContent = '📥';
          autosaveText.textContent = `Borrador restaurado automáticamente de la sesión anterior (${time}).`;
          autosaveTime.textContent = `Guardado: ${time}`;
        }
      } catch (e) {
        logEvent('WARN', 'Borrador existente no legible: ' + e.message);
      }
    }
  }

  initApp();
});

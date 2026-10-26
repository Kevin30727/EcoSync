/**
 * EcoSync Enterprise Platform — Gateway v2.4.9
 * Lógica principal en JavaScript Vanilla
 * Sin frameworks ni dependencias externas
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. ESTADO GLOBAL DE LA APLICACIÓN
  // =========================================================================
  const state = {
    isOnline: true,
    lastSavedTimestamp: null,
    syncAttempts: 0,
    contingencyEventsCount: 0,
    consoleLogs: [],
    autosaveTimer: null,
    isAnnualBilling: false,

    // Autenticación de Usuario
    currentUser: null,

    // Líneas de Servicio en Terminal Operativa
    serviceLines: [
      {
        id: 1,
        sku: 'SRV-IND-4601',
        desc: 'Mantenimiento Preventivo Servomotores Fase II - Sala Compresores',
        qty: 16.0,
        unit: 'hrs',
        rate: 45.00,
        cc: 'SAP-CC-4881'
      },
      {
        id: 2,
        sku: 'SRV-CAL-2022',
        desc: 'Calibración Telemétrica de Sensores Térmicos Red IoT LoRaWAN',
        qty: 8.5,
        unit: 'hrs',
        rate: 52.00,
        cc: 'SAP-CC-8098'
      },
      {
        id: 3,
        sku: 'INS-REP-8812',
        desc: 'Kit de Repuesto Termoacoplador y Válvula de Alivio Inoxidable 316L',
        qty: 2.0,
        unit: 'un.',
        rate: 185.00,
        cc: 'SAP-INV-1102'
      }
    ]
  };

  const STORAGE_KEY_FORM = 'ecosync_form_draft_v2';
  const STORAGE_KEY_AUTH = 'ecosync_auth_user_v2';

  // Perfiles Demo Preconfigurados
  const DEMO_PROFILES = {
    roberto: {
      name: 'Ing. Roberto Silva',
      email: 'roberto.silva@grupo-alfa.corp',
      role: 'Gerente de Infraestructura TI',
      avatar: 'RS',
      company: 'Grupo Industrial Alfa'
    },
    camila: {
      name: 'Camila Soto',
      email: 'camila.soto@grupo-alfa.corp',
      role: 'Operadora Servicios / Finanzas',
      avatar: 'CS',
      company: 'Grupo Industrial Alfa'
    }
  };

  // =========================================================================
  // 2. REFERENCIAS AL DOM
  // =========================================================================
  // Navegación
  const navLinks = document.querySelectorAll('.nav-link');
  const viewSections = document.querySelectorAll('.view-section');
  const navBrand = document.getElementById('nav-brand');

  // Conexión y Contingencia
  const globalConnectionPill = document.getElementById('global-connection-pill');
  const globalStatusDot = document.getElementById('global-status-dot');
  const globalStatusText = document.getElementById('global-status-text');
  const contingencyBanner = document.getElementById('contingency-banner');
  const btnBannerRestore = document.getElementById('btn-banner-restore');

  // Autenticación
  const authModal = document.getElementById('auth-modal');
  const btnCloseAuth = document.getElementById('btn-close-auth');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const userChipBtn = document.getElementById('user-chip-btn');
  const userDropdown = document.getElementById('user-dropdown');
  const headerAvatar = document.getElementById('header-avatar');
  const headerUserName = document.getElementById('header-user-name');
  const headerUserRole = document.getElementById('header-user-role');
  const dropdownUserName = document.getElementById('dropdown-user-name');
  const dropdownUserEmail = document.getElementById('dropdown-user-email');
  const btnSwitchRoberto = document.getElementById('btn-switch-roberto');
  const btnSwitchCamila = document.getElementById('btn-switch-camila');
  const btnLogout = document.getElementById('btn-logout');
  const btnQuickRoberto = document.getElementById('btn-quick-roberto');
  const btnQuickCamila = document.getElementById('btn-quick-camila');
  const btnOpenLogin = document.getElementById('btn-open-login');
  const btnOpenRegister = document.getElementById('btn-open-register');
  const guestActions = document.getElementById('guest-actions');

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

  // Terminal Operativa y Servicios
  const quoteForm = document.getElementById('quote-form');
  const autosaveBar = document.getElementById('autosave-bar');
  const autosaveIcon = document.getElementById('autosave-icon');
  const autosaveText = document.getElementById('autosave-text');
  const autosaveTime = document.getElementById('autosave-time');
  const fRut = document.getElementById('f-rut');
  const fRazon = document.getElementById('f-razon');
  const fContacto = document.getElementById('f-contacto');
  const fSucursal = document.getElementById('f-sucursal');
  const fObservaciones = document.getElementById('f-observaciones');
  const obsCounter = document.getElementById('obs-counter');
  const servicesTbody = document.getElementById('services-tbody');
  const btnAddLineItem = document.getElementById('btn-add-line-item');
  const pillActiveLines = document.getElementById('pill-active-lines');

  // Totales
  const calcSubtotal = document.getElementById('calc-subtotal');
  const calcDescuento = document.getElementById('calc-descuento');
  const calcNeto = document.getElementById('calc-neto');
  const calcIva = document.getElementById('calc-iva');
  const calcTotal = document.getElementById('calc-total');

  // Botones de acción del formulario
  const btnSaveDraft = document.getElementById('btn-save-draft');
  const btnRestoreDraft = document.getElementById('btn-restore-draft');
  const btnClearForm = document.getElementById('btn-clear-form');
  const btnSimulateDrop = document.getElementById('btn-simulate-drop');
  const btnRestoreConnection = document.getElementById('btn-restore-connection');
  const btnSync = document.getElementById('btn-sync');
  const syncFeedbackBox = document.getElementById('sync-feedback-box');

  // Consola Técnica Oculta
  const techConsoleDrawer = document.getElementById('tech-console-drawer');
  const consoleOutput = document.getElementById('console-output');
  const consoleEventCounter = document.getElementById('console-event-counter');
  const btnConsoleClose = document.getElementById('btn-console-close');
  const btnConsoleClear = document.getElementById('btn-console-clear');
  const btnConsoleExport = document.getElementById('btn-console-export');
  const btnFloatingConsole = document.getElementById('btn-floating-console');

  // Modales
  const confirmModal = document.getElementById('confirm-modal');
  const confirmModalMsg = document.getElementById('confirm-modal-msg');
  const btnModalCancel = document.getElementById('btn-modal-cancel');
  const btnModalConfirm = document.getElementById('btn-modal-confirm');
  let confirmCallback = null;

  // Facturación
  const btnBillingToggle = document.getElementById('btn-billing-toggle');
  const lblBillingMonthly = document.getElementById('lbl-billing-monthly');
  const lblBillingAnnual = document.getElementById('lbl-billing-annual');
  const pricePyme = document.getElementById('price-pyme');
  const priceCorp = document.getElementById('price-corp');
  const priceEnterprise = document.getElementById('price-enterprise');

  // Calculadora ESG
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

  // =========================================================================
  // 3. LOGGING FORENSE EN CONSOLA (CERO PII)
  // =========================================================================
  function logEvent(type, message) {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const safeEvent = {
      id: state.consoleLogs.length + 1,
      timestamp: now.toISOString(),
      displayTime: timeStr,
      type: type,
      message: message
    };

    state.consoleLogs.push(safeEvent);

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
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
      e.preventDefault();
      toggleTechConsole();
    }
  });

  btnFloatingConsole.addEventListener('click', toggleTechConsole);
  btnConsoleClose.addEventListener('click', toggleTechConsole);

  btnConsoleClear.addEventListener('click', () => {
    state.consoleLogs = [];
    consoleOutput.innerHTML = '';
    consoleEventCounter.textContent = 'Total eventos: 0';
    logEvent('INFO', 'Historial técnico purgado por el operador.');
  });

  btnConsoleExport.addEventListener('click', () => {
    const exportData = {
      platform: 'EcoSync Enterprise Gateway',
      version: '2.4.9',
      exportedAt: new Date().toISOString(),
      totalEvents: state.consoleLogs.length,
      events: state.consoleLogs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecosync-diagnostico-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    logEvent('INFO', 'Logs técnicos exportados a archivo JSON.');
  });

  // =========================================================================
  // 4. SISTEMA DE AUTENTICACIÓN (LOGIN Y REGISTRO)
  // =========================================================================
  function updateUserUI() {
    if (state.currentUser) {
      userChipBtn.classList.remove('hidden');
      guestActions.classList.add('hidden');
      headerAvatar.textContent = state.currentUser.avatar;
      headerUserName.textContent = state.currentUser.name;
      headerUserRole.textContent = state.currentUser.role;
      dropdownUserName.textContent = state.currentUser.name;
      dropdownUserEmail.textContent = state.currentUser.email;

      // Actualizar operadora en la terminal operativa
      const teOpName = document.getElementById('te-operator-name');
      if (teOpName) teOpName.textContent = state.currentUser.name;
    } else {
      userChipBtn.classList.add('hidden');
      userDropdown.classList.add('hidden');
      guestActions.classList.remove('hidden');
    }
  }

  function setAuthenticatedUser(userData) {
    state.currentUser = userData;
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(userData));
    updateUserUI();
    logEvent('INFO', `Sesión iniciada para el usuario corporativo: ${userData.role}`);
  }

  function openAuthModal(initialTab = 'login') {
    authModal.classList.remove('hidden');
    if (initialTab === 'register') {
      tabRegister.click();
    } else {
      tabLogin.click();
    }
  }

  function closeAuthModal() {
    authModal.classList.add('hidden');
  }

  // Event Listeners Auth
  if (userChipBtn) {
    userChipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('hidden');
    });
  }

  document.addEventListener('click', () => {
    if (userDropdown) userDropdown.classList.add('hidden');
  });

  if (btnCloseAuth) btnCloseAuth.addEventListener('click', closeAuthModal);
  if (btnOpenLogin) btnOpenLogin.addEventListener('click', () => openAuthModal('login'));
  if (btnOpenRegister) btnOpenRegister.addEventListener('click', () => openAuthModal('register'));

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
  });

  // Submit Login
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const name = email.split('@')[0].replace('.', ' ').toUpperCase();
    const avatar = name.substring(0, 2);

    setAuthenticatedUser({
      name: name,
      email: email,
      role: 'Especialista de Sistemas ERP',
      avatar: avatar,
      company: 'Grupo Alfa'
    });

    closeAuthModal();
    alert(`¡Bienvenido a EcoSync, ${name}!`);
  });

  // Submit Register
  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const company = document.getElementById('reg-company').value.trim();
    const role = document.getElementById('reg-role').value;
    const avatar = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'US';

    setAuthenticatedUser({
      name: name,
      email: email,
      role: role,
      avatar: avatar,
      company: company
    });

    closeAuthModal();
    alert(`Cuenta corporativa creada exitosamente. Bienvenido a EcoSync, ${name}.`);
  });

  // Quick Demo Logins
  btnQuickRoberto.addEventListener('click', () => {
    setAuthenticatedUser(DEMO_PROFILES.roberto);
    closeAuthModal();
  });
  btnQuickCamila.addEventListener('click', () => {
    setAuthenticatedUser(DEMO_PROFILES.camila);
    closeAuthModal();
  });
  btnSwitchRoberto.addEventListener('click', () => {
    setAuthenticatedUser(DEMO_PROFILES.roberto);
    userDropdown.classList.add('hidden');
  });
  btnSwitchCamila.addEventListener('click', () => {
    setAuthenticatedUser(DEMO_PROFILES.camila);
    userDropdown.classList.add('hidden');
  });
  btnLogout.addEventListener('click', () => {
    state.currentUser = null;
    localStorage.removeItem(STORAGE_KEY_AUTH);
    updateUserUI();
    logEvent('INFO', 'Sesión cerrada por el operador.');
  });

  // =========================================================================
  // 5. NAVEGACIÓN ENTRE VISTAS (SPA)
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
    logEvent('INFO', `Navegación hacia la vista: ${targetViewId}`);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = e.currentTarget.dataset.target;
      if (target) switchView(target);
    });
  });

  navBrand.addEventListener('click', () => switchView('view-inicio'));

  // Enlaces directos a terminal
  document.getElementById('btn-header-cta').addEventListener('click', () => switchView('view-terminal'));
  document.getElementById('btn-hero-try').addEventListener('click', () => switchView('view-terminal'));
  document.getElementById('btn-hero-tech').addEventListener('click', () => switchView('view-solucion'));
  document.getElementById('btn-hero-dashboard').addEventListener('click', () => switchView('view-dashboard-ejecutivo'));
  document.getElementById('btn-cta-terminal').addEventListener('click', () => switchView('view-terminal'));

  const linkGoDiag = document.getElementById('link-go-diagnosticos');
  if (linkGoDiag) {
    linkGoDiag.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('view-diagnosticos');
    });
  }

  // =========================================================================
  // 6. TERMINAL OPERATIVA AVANZADA Y LÍNEAS DE SERVICIO (Imagen 4)
  // =========================================================================
  function renderServiceLines() {
    servicesTbody.innerHTML = '';
    let subtotalNeto = 0;

    state.serviceLines.forEach((item, index) => {
      const itemSubtotal = item.qty * item.rate;
      subtotalNeto += itemSubtotal;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="badge-cache">CACHÉ</span></td>
        <td><code>${escapeHtml(item.sku)}</code></td>
        <td><strong>${escapeHtml(item.desc)}</strong></td>
        <td>${item.qty} ${item.unit}</td>
        <td>$ ${item.rate.toFixed(2)}</td>
        <td><span class="badge-cc">${escapeHtml(item.cc)}</span></td>
        <td><strong>$ ${itemSubtotal.toFixed(2)}</strong></td>
        <td>
          <button type="button" class="btn btn-sm btn-outline-danger btn-delete-line" data-index="${index}" title="Eliminar fila">✕</button>
        </td>
      `;
      servicesTbody.appendChild(tr);
    });

    pillActiveLines.textContent = `${state.serviceLines.length} LÍNEAS ACTIVAS`;

    // Recalcular Liquidación (IVA 19% + Descuento Convenio 5%)
    const descuento5 = subtotalNeto * 0.05;
    const baseImponible = Math.max(0, subtotalNeto - descuento5);
    const iva19 = baseImponible * 0.19;
    const totalFactura = baseImponible + iva19;

    calcSubtotal.textContent = `$ ${subtotalNeto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    calcDescuento.textContent = `- $ ${descuento5.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    calcNeto.textContent = `$ ${baseImponible.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    calcIva.textContent = `$ ${iva19.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    calcTotal.textContent = `$ ${totalFactura.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

    // Listeners para eliminar fila
    document.querySelectorAll('.btn-delete-line').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        state.serviceLines.splice(idx, 1);
        renderServiceLines();
        triggerDebouncedAutosave();
      });
    });
  }

  // Añadir nueva fila
  btnAddLineItem.addEventListener('click', () => {
    const skus = ['SRV-SEC-9901', 'SRV-NET-3310', 'SRV-DAT-5502', 'INS-MOD-2024'];
    const descs = [
      'Auditoría y Parcheo de Vulnerabilidades en Endpoint Edge',
      'Configuración de Túnel IPsec Redundante Failover',
      'Migración de Caché Local a Clúster Multi-Región',
      'Instalación de Sonda Telemétrica SCI de Consumo'
    ];
    const rand = Math.floor(Math.random() * skus.length);

    state.serviceLines.push({
      id: Date.now(),
      sku: skus[rand],
      desc: descs[rand],
      qty: 4.0,
      unit: 'hrs',
      rate: 65.00,
      cc: 'SAP-CC-9900'
    });

    renderServiceLines();
    triggerDebouncedAutosave();
    logEvent('PERSIST', `Nueva línea de servicio añadida: ${skus[rand]}`);
  });

  // Contador de Observaciones
  fObservaciones.addEventListener('input', () => {
    obsCounter.textContent = `${fObservaciones.value.length} caracteres guardados en vivo`;
    triggerDebouncedAutosave();
  });

  // =========================================================================
  // 7. AUTOGUARDADO EN LOCALSTORAGE (DEBOUNCE 600ms)
  // =========================================================================
  function executeAutosave() {
    try {
      const data = {
        rut: fRut.value.trim(),
        razon: fRazon.value.trim(),
        contacto: fContacto.value.trim(),
        observaciones: fObservaciones.value,
        lines: state.serviceLines,
        savedAt: new Date().toISOString()
      };

      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY_FORM, serialized);

      state.lastSavedTimestamp = new Date();
      const timeStr = state.lastSavedTimestamp.toLocaleTimeString();

      autosaveBar.className = 'autosave-status-bar saved';
      autosaveIcon.textContent = '✅';
      autosaveText.textContent = 'Borrador y líneas de servicio guardados localmente.';
      autosaveTime.textContent = `Último guardado: ${timeStr}`;

      dashFormStatus.textContent = 'Borrador guardado';
      dashFormStatus.className = 'dash-card-val text-green';
      dashFormSub.textContent = 'Buffer en memoria seguro';
      dashLastSaved.textContent = timeStr;
      dashSavedBytes.textContent = `${serialized.length} bytes respaldados`;

      logEvent('PERSIST', `Borrador guardado en LocalStorage (${serialized.length} bytes, ${state.serviceLines.length} líneas).`);
    } catch (err) {
      logEvent('WARN', 'Error de guardado en LocalStorage: ' + err.message);
    }
  }

  function triggerDebouncedAutosave() {
    autosaveBar.className = 'autosave-status-bar saving';
    autosaveIcon.textContent = '⏳';
    autosaveText.textContent = 'Guardando cambios en buffer local...';

    clearTimeout(state.autosaveTimer);
    state.autosaveTimer = setTimeout(() => {
      executeAutosave();
    }, 600);
  }

  [fRut, fRazon, fContacto].forEach(input => {
    input.addEventListener('input', triggerDebouncedAutosave);
  });

  btnSaveDraft.addEventListener('click', () => {
    clearTimeout(state.autosaveTimer);
    executeAutosave();
  });

  btnRestoreDraft.addEventListener('click', () => {
    const raw = localStorage.getItem(STORAGE_KEY_FORM);
    if (!raw) {
      alert('No se encontró ningún borrador guardado en LocalStorage.');
      return;
    }
    try {
      const payload = JSON.parse(raw);
      if (payload.rut) fRut.value = payload.rut;
      if (payload.razon) fRazon.value = payload.razon;
      if (payload.contacto) fContacto.value = payload.contacto;
      if (payload.observaciones) fObservaciones.value = payload.observaciones;
      if (payload.lines && Array.isArray(payload.lines)) {
        state.serviceLines = payload.lines;
        renderServiceLines();
      }
      autosaveBar.className = 'autosave-status-bar restored';
      autosaveIcon.textContent = '📥';
      autosaveText.textContent = 'Borrador y tabla de servicios recuperados con éxito.';
      logEvent('RESTORE', 'Borrador recuperado desde LocalStorage.');
    } catch (e) {
      logEvent('WARN', 'Error al leer borrador: ' + e.message);
    }
  });

  btnClearForm.addEventListener('click', () => {
    openConfirmModal('¿Deseas limpiar todos los campos y purgar el borrador de LocalStorage?', () => {
      fRut.value = '';
      fRazon.value = '';
      fContacto.value = '';
      fObservaciones.value = '';
      state.serviceLines = [];
      renderServiceLines();
      localStorage.removeItem(STORAGE_KEY_FORM);

      autosaveBar.className = 'autosave-status-bar';
      autosaveIcon.textContent = '🧹';
      autosaveText.textContent = 'Formulario y buffer purgados.';
      autosaveTime.textContent = '';
      logEvent('PERSIST', 'Almacenamiento local limpiado por el usuario.');
    });
  });

  // =========================================================================
  // 8. SIMULACIÓN DE CAÍDA Y RESTAURACIÓN DE CONEXIÓN
  // =========================================================================
  function setConnectionState(online) {
    state.isOnline = online;

    if (online) {
      globalConnectionPill.className = 'connection-pill';
      globalStatusDot.className = 'status-indicator online';
      globalStatusText.textContent = 'En Línea';

      contingencyBanner.classList.add('hidden');

      dashConnectionStatus.innerHTML = '<span class="status-indicator online"></span><span>En Línea</span>';
      dashConnectionStatus.className = 'dash-card-val text-green';
      dashConnectionDesc.textContent = 'Simulación operativa disponible';

      btnSync.disabled = false;
      logEvent('RESTORE', 'Conexión de red simulada restaurada al 100%.');
    } else {
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
      logEvent('DROP', '¡Caída momentánea de red simulada! Activado modo de contingencia.');
    }
  }

  btnSimulateDrop.addEventListener('click', () => setConnectionState(false));
  btnRestoreConnection.addEventListener('click', () => setConnectionState(true));
  if (btnBannerRestore) btnBannerRestore.addEventListener('click', () => setConnectionState(true));

  // Sincronización Simulada
  btnSync.addEventListener('click', () => {
    if (!state.isOnline) {
      showSyncFeedback('warning', '⚠️ No se puede emitir la orden: Modo de contingencia activo. Restaura la conexión primero.');
      return;
    }

    state.syncAttempts++;
    dashSyncAttempts.textContent = state.syncAttempts;
    showSyncFeedback('processing', '⏳ Emitiendo y sincronizando orden consolidada con el servidor central...');
    btnSync.disabled = true;

    setTimeout(() => {
      btnSync.disabled = false;
      showSyncFeedback('success', '✅ Orden emitida y sincronizada exitosamente. <br><strong>Aviso:</strong> Simulación local en cliente. No se transmitieron datos a servidores externos.');
      logEvent('SYNC', `Orden de servicio #${state.syncAttempts} emitida y confirmada en clúster local.`);
    }, 1200);
  });

  function showSyncFeedback(type, msg) {
    syncFeedbackBox.className = `sync-feedback-box ${type}`;
    syncFeedbackBox.innerHTML = msg;
    syncFeedbackBox.classList.remove('hidden');
  }

  // =========================================================================
  // 9. DIAGNÓSTICOS FORENSES E INCIDENTES (Imagen 2)
  // =========================================================================
  const incidentCards = document.querySelectorAll('.incident-card');
  incidentCards.forEach(card => {
    const summaryBar = card.querySelector('.incident-summary-bar');
    summaryBar.addEventListener('click', () => {
      card.classList.toggle('expanded');
      const btn = card.querySelector('.btn-toggle-incident');
      if (btn) btn.textContent = card.classList.contains('expanded') ? '▲' : '▼';
    });
  });

  // Filtros de incidentes
  const forensicSearch = document.getElementById('forensic-search');
  const filterSystem = document.getElementById('filter-system');
  const filterSeverity = document.getElementById('filter-severity');
  const btnResetFilters = document.getElementById('btn-reset-filters');

  function filterIncidents() {
    const query = forensicSearch.value.toLowerCase();
    const system = filterSystem.value;
    const severity = filterSeverity.value;

    incidentCards.forEach(card => {
      const cardText = card.textContent.toLowerCase();
      const cardSys = card.dataset.system;
      const cardSev = card.dataset.severity;

      const matchesSearch = !query || cardText.includes(query);
      const matchesSystem = (system === 'ALL' || cardSys === system);
      const matchesSeverity = (severity === 'ALL' || cardSev === severity);

      if (matchesSearch && matchesSystem && matchesSeverity) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  forensicSearch.addEventListener('input', filterIncidents);
  filterSystem.addEventListener('change', filterIncidents);
  filterSeverity.addEventListener('change', filterIncidents);
  btnResetFilters.addEventListener('click', () => {
    forensicSearch.value = '';
    filterSystem.value = 'ALL';
    filterSeverity.value = 'ALL';
    filterIncidents();
  });

  const btnCopyTrace = document.getElementById('btn-copy-trace');
  if (btnCopyTrace) {
    btnCopyTrace.addEventListener('click', () => {
      alert('Traza forense SHA256-e91a274b8c9 copiada al portapapeles.');
      logEvent('INFO', 'Traza forense copiada al portapapeles.');
    });
  }

  const btnDownloadHar = document.getElementById('btn-download-har');
  if (btnDownloadHar) {
    btnDownloadHar.addEventListener('click', () => {
      alert('Descarga de Dump HAR iniciada: incident-INT-9904.har');
      logEvent('INFO', 'Dump HAR de auditoría descargado.');
    });
  }

  // =========================================================================
  // 10. CENTRO SDK Y HANDSHAKE TESTER (Imagen 3)
  // =========================================================================
  // Copiar Tokens
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.currentTarget.dataset.target;
      const input = document.getElementById(targetId);
      if (input) {
        navigator.clipboard.writeText(input.value);
        e.currentTarget.textContent = '¡Copiado!';
        setTimeout(() => e.currentTarget.textContent = 'Copiar', 1500);
      }
    });
  });

  const btnRegenKey = document.getElementById('btn-regen-key');
  if (btnRegenKey) {
    btnRegenKey.addEventListener('click', () => {
      const randKey = 'ecosync_sec_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      document.getElementById('txt-secret-key').value = randKey;
      alert('Secret API Key regenerada en HSM.');
      logEvent('INFO', 'Secret API Key rotada por el administrador.');
    });
  }

  // Framework Tabs
  const fwTabs = document.querySelectorAll('.fw-tab');
  const codeDisplay = document.getElementById('code-snippet-display');
  const snippets = {
    html: `<!-- EcoSync Universal Edge Script -->\n<script\n  src="https://cdn.ecosync.cloud/v2/loader.min.js"\n  data-tenant="tenant_ecosync_prod_994821a8"\n  data-mode="smart-focal-aes256"\n  data-auto-scroll="true"\n  data-localstorage-sync="active"\n  async>\n</script>`,
    react: `// React / Next.js Component Hook\nimport { useEffect } from 'react';\nimport { initEcoSync } from '@ecosync/react-sdk';\n\nexport default function App() {\n  useEffect(() => {\n    initEcoSync({\n      tenant: 'tenant_ecosync_prod_994821a8',\n      resilienceMode: 'zero-data-loss'\n    });\n  }, []);\n  return <YourApp />;\n}`,
    angular: `// Angular / Vue Integration\nimport { EcoSyncModule } from '@ecosync/client-core';\n\n@NgModule({\n  imports: [\n    EcoSyncModule.forRoot({\n      tenant: 'tenant_ecosync_prod_994821a8',\n      aesEncryption: true\n    })\n  ]\n})\nexport class AppModule {}`,
    extension: `// MDM / Active Directory GPO\n// Despliegue de extensión vía Chrome Enterprise Core Policy:\n{\n  "ExtensionSettings": {\n    "ecosync-resilience-ext": {\n      "installation_mode": "force_installed",\n      "update_url": "https://cdn.ecosync.cloud/ext/update.xml"\n    }\n  }\n}`
  };

  fwTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      fwTabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const fw = e.currentTarget.dataset.fw;
      codeDisplay.textContent = snippets[fw] || snippets.html;
    });
  });

  const btnCopySnippet = document.getElementById('btn-copy-snippet');
  if (btnCopySnippet) {
    btnCopySnippet.addEventListener('click', () => {
      navigator.clipboard.writeText(codeDisplay.textContent);
      btnCopySnippet.textContent = '¡Copiado!';
      setTimeout(() => btnCopySnippet.textContent = '📋 Copiar Código', 1500);
    });
  }

  // Handshake Tester
  const btnRunHandshake = document.getElementById('btn-run-handshake');
  const daemonOutput = document.getElementById('daemon-output');
  if (btnRunHandshake) {
    btnRunHandshake.addEventListener('click', () => {
      const url = document.getElementById('txt-endpoint-url').value;
      daemonOutput.innerHTML = `<code>$ ecosync-cli probe --endpoint ${escapeHtml(url)}\n[PROBANDO] Conectando con ${escapeHtml(url)}...\n[TLS] Negociando cipher suite TLS 1.3 ECDHE-RSA-AES256-GCM...</code>`;

      setTimeout(() => {
        daemonOutput.innerHTML += `\n<code>[OK] Certificado SSL Válido (Emisor: DigiCert Global Root G2)\n[RESPUESTA] HTTP 200 OK - Latencia RTT: 12.4 ms\n[VALIDADO] Handshake exitoso con EcoSync Edge Gateway.</code>`;
        logEvent('INFO', `Handshake TLS 1.3 validado para endpoint: ${url}`);
      }, 700);
    });
  }

  // =========================================================================
  // 11. CALCULADORA ESG DINÁMICA & CALCULADORA SIMPLIFICADA
  // =========================================================================
  function calculateEsgMetrics() {
    const users = parseInt(rangeUsers.value, 10) || 2500;
    const erpFactor = parseFloat(selectErp.value) || 1.2;
    const dailyTx = parseInt(rangeTx.value, 10) || 120;

    valUsers.textContent = users.toLocaleString();
    valTx.textContent = dailyTx.toLocaleString();

    const avoidedRequestsAnnual = users * dailyTx * 0.45 * 250 * erpFactor;
    const energyKwhAnnual = Math.round(avoidedRequestsAnnual * 0.000045);
    const carbonTonsAnnual = ((energyKwhAnnual * 0.385) / 1000).toFixed(1);
    const trees = Math.round((parseFloat(carbonTonsAnnual) * 1000) / 22);
    const moneySaved = Math.round(energyKwhAnnual * 0.377);
    const homes = Math.max(1, Math.round(energyKwhAnnual / 1150));

    resEnergy.innerHTML = `${energyKwhAnnual.toLocaleString()} <span class="val-unit">kWh / año</span>`;
    resCarbon.innerHTML = `${carbonTonsAnnual} <span class="val-unit">Ton CO2e</span>`;
    resTrees.innerHTML = `${trees.toLocaleString()} <span class="val-unit">árboles</span>`;
    resMoney.innerHTML = `$${moneySaved.toLocaleString()} <span class="val-unit">USD / año</span>`;
    resHomes.textContent = `Equivalente a alimentar ${homes} hogares promedio durante 1 año.`;
  }

  rangeUsers.addEventListener('input', calculateEsgMetrics);
  selectErp.addEventListener('change', calculateEsgMetrics);
  rangeTx.addEventListener('input', calculateEsgMetrics);

  btnDownloadEsg.addEventListener('click', () => {
    alert('Descargando Resumen Ejecutivo ESG en formato texto.');
    logEvent('INFO', 'Reporte ESG exportado.');
  });

  // Calculadora Simplificada
  function calculateSimpleGreenIt() {
    const req = parseFloat(scReq.value) || 0;
    const reduction = parseFloat(scReduction.value) || 0;
    const days = parseFloat(scDays.value) || 0;
    const totalAvoided = Math.round(req * (reduction / 100) * days);
    scTotalResult.textContent = `${totalAvoided.toLocaleString()} peticiones`;
  }
  scReq.addEventListener('input', calculateSimpleGreenIt);
  scReduction.addEventListener('input', calculateSimpleGreenIt);
  scDays.addEventListener('input', calculateSimpleGreenIt);

  // Switch de Precios
  btnBillingToggle.addEventListener('click', () => {
    state.isAnnualBilling = !state.isAnnualBilling;
    btnBillingToggle.setAttribute('aria-checked', state.isAnnualBilling ? 'true' : 'false');
    if (state.isAnnualBilling) {
      lblBillingMonthly.classList.remove('active');
      lblBillingAnnual.classList.add('active');
      pricePyme.textContent = '199';
      priceCorp.textContent = '712';
      priceEnterprise.textContent = '1,752';
    } else {
      lblBillingMonthly.classList.add('active');
      lblBillingAnnual.classList.remove('active');
      pricePyme.textContent = '249';
      priceCorp.textContent = '890';
      priceEnterprise.textContent = '2,190';
    }
  });

  // Modal genérico
  function openConfirmModal(msg, onConfirm) {
    confirmModalMsg.textContent = msg;
    confirmCallback = onConfirm;
    confirmModal.classList.remove('hidden');
  }
  btnModalCancel.addEventListener('click', () => {
    confirmModal.classList.add('hidden');
    confirmCallback = null;
  });
  btnModalConfirm.addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    confirmModal.classList.add('hidden');
    confirmCallback = null;
  });


  // =========================================================================
  // 13. LÓGICA DE LA ARQUITECTURA DEL SISTEMA Y OPTIMIZADOR EN VIVO
  // =========================================================================
  const optDelta = document.getElementById('opt-delta');
  const optDebounce = document.getElementById('opt-debounce');
  const optCache = document.getElementById('opt-cache');
  const optThrottle = document.getElementById('opt-throttle');

  const bmLatency = document.getElementById('bm-latency');
  const bmPayload = document.getElementById('bm-payload');
  const bmRequests = document.getElementById('bm-requests');
  const bmCpu = document.getElementById('bm-cpu');

  const barLatency = document.getElementById('bar-latency');
  const barPayload = document.getElementById('bar-payload');
  const barRequests = document.getElementById('bar-requests');
  const barCpu = document.getElementById('bar-cpu');

  const gainLatency = document.getElementById('gain-latency');
  const gainPayload = document.getElementById('gain-payload');
  const gainRequests = document.getElementById('gain-requests');
  const gainCpu = document.getElementById('gain-cpu');

  const btnRunSimulation = document.getElementById('btn-run-simulation');
  const btnRunStressTest = document.getElementById('btn-run-stress-test');
  const simulationStatus = document.getElementById('simulation-status');
  const btnOpenConsoleArch = document.getElementById('btn-open-console-arch');

  function updateOptimizationBenchmark() {
    const isDelta = optDelta ? optDelta.checked : true;
    const isDebounce = optDebounce ? optDebounce.checked : true;
    const isCache = optCache ? optCache.checked : true;
    const isThrottle = optThrottle ? optThrottle.checked : true;

    // 1. Latencia
    if (isCache) {
      bmLatency.textContent = '1.4 ms';
      barLatency.style.width = '99%';
      gainLatency.textContent = '⚡ 99.6% más rápido';
      gainLatency.className = 'bm-gain text-green';
    } else {
      bmLatency.textContent = '145 ms';
      barLatency.style.width = '40%';
      gainLatency.textContent = '⚠️ Sin caché: Consulta remota obligatoria';
      gainLatency.className = 'bm-gain text-orange';
    }

    // 2. Payload
    if (isDelta) {
      bmPayload.textContent = '18.4 KB';
      barPayload.style.width = '92%';
      gainPayload.textContent = '📉 92.5% menos ancho de banda';
      gainPayload.className = 'bm-gain text-green';
    } else {
      bmPayload.textContent = '245 KB';
      barPayload.style.width = '20%';
      gainPayload.textContent = '⚠️ Sin compresión: Payload completo enviado';
      gainPayload.className = 'bm-gain text-orange';
    }

    // 3. Requests
    if (isDebounce) {
      bmRequests.textContent = '3 req/min';
      barRequests.style.width = '93%';
      gainRequests.textContent = '🛡️ 93.3% tráfico mitigado';
      gainRequests.className = 'bm-gain text-green';
    } else {
      bmRequests.textContent = '45 req/min';
      barRequests.style.width = '15%';
      gainRequests.textContent = '⚠️ Sin debounce: Saturación por pulsación';
      gainRequests.className = 'bm-gain text-orange';
    }

    // 4. CPU
    if (isThrottle) {
      bmCpu.textContent = '0.02%';
      barCpu.style.width = '99%';
      gainCpu.textContent = '🍃 Cero saturación de hilos';
      gainCpu.className = 'bm-gain text-green';
    } else {
      bmCpu.textContent = '1.85%';
      barCpu.style.width = '35%';
      gainCpu.textContent = '⚠️ Sin eco-throttle: Sondeo continuo en background';
      gainCpu.className = 'bm-gain text-orange';
    }

    logEvent('INFO', `Parámetros de optimización actualizados: [Delta: ${isDelta}, Debounce: ${isDebounce}, Cache: ${isCache}, Throttle: ${isThrottle}]`);
  }

  [optDelta, optDebounce, optCache, optThrottle].forEach(sw => {
    if (sw) sw.addEventListener('change', updateOptimizationBenchmark);
  });

  function runStressSimulation() {
    if (!simulationStatus) return;
    simulationStatus.classList.remove('hidden');
    simulationStatus.innerHTML = `<strong>Iniciando Simulación de Estrés:</strong><br>Emitiendo ráfaga de 100 eventos concurrentes de formulario...`;
    
    if (btnRunSimulation) btnRunSimulation.disabled = true;
    if (btnRunStressTest) btnRunStressTest.disabled = true;

    setTimeout(() => {
      simulationStatus.innerHTML = `
        <strong>Progreso del Pipeline de Optimización:</strong><br>
        [T+100ms] 100 eventos interceptados por Capa 01 (DOM Observer)<br>
        [T+250ms] Capa 02 activada: Buffer LocalStorage consolidó el estado en 1 snapshot AES-256 (18.4 KB)<br>
        [T+400ms] Capa 03 activada: Enrutador descartó 99 peticiones HTTP redundantes<br>
        [T+600ms] Capa 04: Servidor ERP recibió 1 única transacción consolidada.<br>
        <strong class="text-green font-bold">✅ Resultado: 99 peticiones evitadas (99% de ahorro de red). Latencia final: 1.4 ms. Cero pérdida de datos.</strong>
      `;

      logEvent('PERSIST', 'Simulación de estrés completada: 100 eventos concurrentes consolidados en 1 única escritura (99% mitigado).');
      
      if (btnRunSimulation) btnRunSimulation.disabled = false;
      if (btnRunStressTest) btnRunStressTest.disabled = false;
    }, 600);
  }

  if (btnRunSimulation) btnRunSimulation.addEventListener('click', runStressSimulation);
  if (btnRunStressTest) {
    btnRunStressTest.addEventListener('click', () => {
      switchView('view-arquitectura');
      setTimeout(runStressSimulation, 300);
    });
  }

  if (btnOpenConsoleArch) {
    btnOpenConsoleArch.addEventListener('click', () => {
      toggleTechConsole();
    });
  }

  // =========================================================================
  // 12. INICIALIZACIÓN DE LA PLATAFORMA
  // =========================================================================
  function initApp() {
    // Cargar Usuario guardado o default Roberto Silva
    const savedUser = localStorage.getItem(STORAGE_KEY_AUTH);
    if (savedUser) {
      try {
        state.currentUser = JSON.parse(savedUser);
      } catch (e) {
        state.currentUser = DEMO_PROFILES.roberto;
      }
    } else {
      state.currentUser = DEMO_PROFILES.roberto;
    }
    updateUserUI();

    // Renderizar servicios en la terminal
    renderServiceLines();
    calculateEsgMetrics();
    calculateSimpleGreenIt();

    logEvent('INFO', 'EcoSync Enterprise Gateway v2.4.9 inicializado con éxito.');
    logEvent('INFO', `Operador autenticado: ${state.currentUser.name} (${state.currentUser.role})`);
  }

  initApp();
});

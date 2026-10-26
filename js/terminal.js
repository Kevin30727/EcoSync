// js/terminal.js — EcoSync Terminal & Connection Simulator
window.EcoSync = window.EcoSync || {};

window.EcoSync.terminal = {
  isOffline: false,
  syncAttempts: 0,
  contingencyEvents: 0,
  _autosaveTimer: null,

  init() {
    this._bindFormInputs();
    this._bindButtons();
    this._restoreOnLoad();
    this._updateCalculations();
    window.EcoSync.logger.log('info', 'Terminal transaccional inicializado');
  },

  _bindFormInputs() {
    const fields = ['rut', 'razon-social', 'contacto', 'email', 'producto', 'cantidad', 'precio-unitario', 'descuento'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        this._updateCalculations();
        this._scheduleAutosave();
      });
    });
  },

  _bindButtons() {
    document.getElementById('btn-save-draft')?.addEventListener('click', () => this.saveDraft());
    document.getElementById('btn-recover-draft')?.addEventListener('click', () => this.recoverDraft(true));
    document.getElementById('btn-clear-form')?.addEventListener('click', () => this.clearForm());
    document.getElementById('btn-simulate-offline')?.addEventListener('click', () => this.goOffline());
    document.getElementById('btn-restore-connection')?.addEventListener('click', () => this.goOnline());
    document.getElementById('btn-sync')?.addEventListener('click', () => this.syncSimulate());
  },

  _restoreOnLoad() {
    this._updateDashboard();
  },

  _getFormData() {
    return {
      rut: document.getElementById('rut')?.value || '',
      razonSocial: document.getElementById('razon-social')?.value || '',
      contacto: document.getElementById('contacto')?.value || '',
      email: document.getElementById('email')?.value || '',
      producto: document.getElementById('producto')?.value || '',
      cantidad: document.getElementById('cantidad')?.value || '',
      precioUnitario: document.getElementById('precio-unitario')?.value || '',
      descuento: document.getElementById('descuento')?.value || ''
    };
  },

  _setFormData(data) {
    if (data.rut) document.getElementById('rut').value = data.rut;
    if (data.razonSocial) document.getElementById('razon-social').value = data.razonSocial;
    if (data.contacto) document.getElementById('contacto').value = data.contacto;
    if (data.email) document.getElementById('email').value = data.email;
    if (data.producto) document.getElementById('producto').value = data.producto;
    if (data.cantidad) document.getElementById('cantidad').value = data.cantidad;
    if (data.precioUnitario) document.getElementById('precio-unitario').value = data.precioUnitario;
    if (data.descuento) document.getElementById('descuento').value = data.descuento;
  },

  _updateCalculations() {
    const qty = parseFloat(document.getElementById('cantidad')?.value) || 0;
    const price = parseFloat(document.getElementById('precio-unitario')?.value) || 0;
    const disc = parseFloat(document.getElementById('descuento')?.value) || 0;

    const subtotal = qty * price;
    const descAmount = subtotal * (disc / 100);
    const base = subtotal - descAmount;
    const iva = base * 0.19;
    const total = base + iva;

    const fmt = v => v.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

    this._setText('calc-subtotal', fmt(subtotal));
    this._setText('calc-descuento', `- ${fmt(descAmount)}`);
    this._setText('calc-base', fmt(base));
    this._setText('calc-iva', fmt(iva));
    this._setText('calc-total', fmt(total));
  },

  _setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  },

  _scheduleAutosave() {
    clearTimeout(this._autosaveTimer);
    this._setStatus('saving', '⏳ Guardando cambios...');
    this._autosaveTimer = setTimeout(() => this.saveDraft(true), 600);
  },

  saveDraft(auto = false) {
    const data = this._getFormData();
    const ok = window.EcoSync.storage.saveDraft(data);
    if (ok) {
      const now = new Date().toLocaleTimeString('es-CL');
      this._setStatus('saved', `✅ Borrador guardado — ${now}`);
      this._setText('dashboard-last-save', now);
      if (!auto) window.EcoSync.logger.log('success', 'Borrador guardado manualmente');
      else window.EcoSync.logger.log('info', 'Borrador autoguardado');
    } else {
      this._setStatus('error', '❌ Error al guardar');
      window.EcoSync.logger.log('error', 'Error al guardar borrador');
    }
    this._updateDashboard();
  },

  recoverDraft(askConfirm = false) {
    const draft = window.EcoSync.storage.loadDraft();
    if (!draft) {
      alert('No hay borrador guardado.');
      return;
    }
    const hasData = Object.values(this._getFormData()).some(v => v.trim());
    if (askConfirm && hasData) {
      if (!confirm('El formulario tiene datos. ¿Deseas reemplazarlos con el borrador guardado?')) return;
    }
    this._setFormData(draft);
    this._updateCalculations();
    const age = window.EcoSync.storage.getDraftAge();
    this._setStatus('recovered', `📂 Borrador recuperado (${age})`);
    window.EcoSync.logger.log('success', `Borrador recuperado`);
    this._updateDashboard();
  },

  clearForm() {
    if (!confirm('¿Limpiar el formulario y el borrador guardado?')) return;
    ['rut','razon-social','contacto','email','producto','cantidad','precio-unitario','descuento'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    window.EcoSync.storage.clearDraft();
    this._updateCalculations();
    this._setStatus('', 'Sin borrador guardado');
    window.EcoSync.logger.log('info', 'Formulario y borrador limpiados');
    this._updateDashboard();
  },

  goOffline() {
    this.isOffline = true;
    this.contingencyEvents++;
    this._updateDashboard();
    document.getElementById('contingency-banner')?.classList.add('active');
    document.getElementById('connection-status')?.classList.add('offline');
    this._setText('connection-label', '🔴 Desconectado');
    window.EcoSync.logger.log('warn', 'Caída de conexión simulada. Sin envío real a servidor.');
  },

  goOnline() {
    this.isOffline = false;
    document.getElementById('contingency-banner')?.classList.remove('active');
    document.getElementById('connection-status')?.classList.remove('offline');
    this._setText('connection-label', '🟢 Conectado');
    window.EcoSync.logger.log('info', 'Conexión simulada restaurada. Nota: no se envió información a ningún servidor real.');
    this._updateDashboard();
  },

  syncSimulate() {
    if (this.isOffline) {
      alert('Debes restaurar la conexión antes de sincronizar.');
      window.EcoSync.logger.log('warn', 'Intento de sync bloqueado — modo contingencia activo');
      return;
    }
    this.syncAttempts++;
    this._updateDashboard();
    this._setStatus('syncing', '🔄 Simulando sincronización...');
    window.EcoSync.logger.log('info', 'Iniciando simulación de sincronización (sin servidor real)');

    setTimeout(() => {
      this._setStatus('synced', '✅ Simulación completada — Nota: ningún dato fue enviado a un servidor real.');
      window.EcoSync.logger.log('success', 'Sincronización simulada completada exitosamente (local únicamente)');
    }, 1800);
  },

  _setStatus(type, msg) {
    const el = document.getElementById('autosave-status');
    if (!el) return;
    el.textContent = msg;
    el.className = 'autosave-status ' + type;
  },

  _updateDashboard() {
    this._setText('dashboard-sync-attempts', this.syncAttempts);
    this._setText('dashboard-contingency-events', this.contingencyEvents);
    const draft = window.EcoSync.storage.loadDraft();
    this._setText('dashboard-form-status', draft ? '📄 Borrador disponible' : '⬜ Sin borrador');
    this._setText('dashboard-connection', this.isOffline ? '🔴 Desconectado' : '🟢 Conectado');
  }
};

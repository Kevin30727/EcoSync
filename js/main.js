// js/main.js — EcoSync Main Orchestrator
window.EcoSync = window.EcoSync || {};

// ─── Auth System ───────────────────────────────────────────────────────────
window.EcoSync.auth = {
  DEMO_USERS: [
    { id: 1, name: 'Ing. Roberto Silva', role: 'Admin', email: 'roberto@ecosync.cl', avatar: 'RS' },
    { id: 2, name: 'Camila Soto', role: 'Operadora', email: 'camila@ecosync.cl', avatar: 'CS' }
  ],

  currentUser: null,

  init() {
    const saved = window.EcoSync.storage.loadUser();
    if (saved) { this.currentUser = saved; this._renderUser(); }
    this._bindUI();
  },

  login(userId) {
    const user = this.DEMO_USERS.find(u => u.id === userId);
    if (!user) return;
    this.currentUser = user;
    window.EcoSync.storage.saveUser(user);
    this._renderUser();
    this._hideModal();
    window.EcoSync.logger?.log('info', `Sesión iniciada — rol: ${user.role}`);
  },

  logout() {
    this.currentUser = null;
    window.EcoSync.storage.remove(window.EcoSync.storage.USER_KEY);
    this._renderUser();
    window.EcoSync.logger?.log('info', 'Sesión cerrada');
  },

  _renderUser() {
    const nav = document.getElementById('nav-user-area');
    if (!nav) return;
    if (this.currentUser) {
      nav.innerHTML = `
        <div class="user-chip" onclick="document.getElementById('user-dropdown').classList.toggle('open')">
          <span class="user-avatar">${this.currentUser.avatar}</span>
          <span class="user-name">${this.currentUser.name}</span>
          <span class="user-role-badge">${this.currentUser.role}</span>
        </div>
        <div class="user-dropdown" id="user-dropdown">
          <div class="dropdown-item">${this.currentUser.email}</div>
          <hr>
          <button class="dropdown-btn" onclick="window.EcoSync.auth.logout()">Cerrar sesión</button>
        </div>`;
    } else {
      nav.innerHTML = `<button class="btn btn-primary btn-sm" onclick="window.EcoSync.auth.showModal()">Iniciar sesión</button>`;
    }
  },

  showModal() {
    document.getElementById('auth-modal')?.classList.add('open');
  },

  _hideModal() {
    document.getElementById('auth-modal')?.classList.remove('open');
  },

  _bindUI() {
    document.addEventListener('click', e => {
      if (e.target.matches('[data-login]')) this.login(parseInt(e.target.dataset.login));
      if (e.target.matches('#btn-show-login')) this.showModal();
      if (e.target.matches('.modal-close') || e.target.matches('.modal-overlay')) this._hideModal();
      // Tab switching in auth modal
      if (e.target.matches('.auth-tab')) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        const panel = document.getElementById('panel-' + e.target.dataset.tab);
        if (panel) panel.classList.add('active');
      }
    });

    // Register form submit (demo only)
    document.getElementById('register-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('reg-name')?.value;
      if (name) {
        this.currentUser = { id: 99, name, role: 'Demo', email: document.getElementById('reg-email')?.value, avatar: name.charAt(0).toUpperCase() };
        window.EcoSync.storage.saveUser(this.currentUser);
        this._renderUser();
        this._hideModal();
        window.EcoSync.logger?.log('info', `Registro demo completado — rol: Demo`);
      }
    });
  }
};

// ─── Green IT Calculator ───────────────────────────────────────────────────
window.EcoSync.greenIT = {
  init() {
    const inputs = ['green-requests', 'green-reduction', 'green-days'];
    inputs.forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => this.calculate());
    });
    this.calculate();
  },

  calculate() {
    const req = parseFloat(document.getElementById('green-requests')?.value) || 0;
    const red = parseFloat(document.getElementById('green-reduction')?.value) || 0;
    const days = parseFloat(document.getElementById('green-days')?.value) || 0;
    const avoided = Math.round(req * (red / 100) * days);
    const co2 = (avoided * 0.0000021).toFixed(3);
    const el = document.getElementById('green-result');
    if (el) el.innerHTML = `<strong>${avoided.toLocaleString('es-CL')}</strong> solicitudes evitadas al año<br><small>≈ ${co2} kg CO₂e ahorrado (estimado)</small>`;
  }
};

// ─── Navigation ────────────────────────────────────────────────────────────
window.EcoSync.nav = {
  init() {
    // Highlight active nav link
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(a => {
      if (path.endsWith(a.getAttribute('href')?.split('/').pop())) {
        a.classList.add('active');
      }
    });

    // Mobile menu toggle
    document.getElementById('nav-toggle')?.addEventListener('click', () => {
      document.getElementById('nav-menu')?.classList.toggle('open');
    });
  }
};

// ─── Bootstrap ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Init logger
  window.EcoSync.logger?.init?.();
  // Init auth
  window.EcoSync.auth.init();
  // Init nav
  window.EcoSync.nav.init();
  // Init Green IT (if elements exist)
  window.EcoSync.greenIT.init();
  // Init terminal (if elements exist)
  window.EcoSync.terminal?.init?.();

  // Recover draft on terminal page
  if (document.getElementById('rut')) {
    const draft = window.EcoSync.storage.loadDraft();
    if (draft) {
      const age = window.EcoSync.storage.getDraftAge();
      const restore = confirm(`Hay un borrador guardado (${age}). ¿Deseas recuperarlo?`);
      if (restore) window.EcoSync.terminal.recoverDraft(false);
    }
  }
});

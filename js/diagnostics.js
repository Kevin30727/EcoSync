// js/diagnostics.js — EcoSync Diagnostics Console
window.EcoSync = window.EcoSync || {};

window.EcoSync.logger = {
  logs: [],

  init() {
    this.logs = window.EcoSync.storage.loadLogs() || [];
    this.log('info', 'EcoSync iniciado');
    this._renderAll();
    this._setupKeyboard();
    this._setupButtons();
  },

  log(type, message) {
    // Never log PII
    const safe = message
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]')
      .replace(/\b\d{7,8}-[\dkK]\b/g, '[rut]');

    const entry = {
      type,
      message: safe,
      time: new Date().toLocaleTimeString('es-CL', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ts: Date.now()
    };
    this.logs.push(entry);
    if (this.logs.length > 500) this.logs.shift();
    window.EcoSync.storage.saveLogs(this.logs);
    this._renderEntry(entry);
  },

  _renderAll() {
    const out = document.getElementById('console-output');
    if (!out) return;
    out.innerHTML = '';
    this.logs.forEach(e => this._renderEntry(e));
  },

  _renderEntry(entry) {
    const out = document.getElementById('console-output');
    if (!out) return;
    const colors = { info: '#60A5FA', warn: '#FBBF24', error: '#F87171', success: '#34D399' };
    const line = document.createElement('div');
    line.className = 'console-line';
    line.innerHTML = `<span class="console-time">[${entry.time}]</span> <span style="color:${colors[entry.type] || '#fff'}">[${entry.type.toUpperCase()}]</span> ${entry.message}`;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  },

  clear() {
    this.logs = [];
    window.EcoSync.storage.saveLogs([]);
    const out = document.getElementById('console-output');
    if (out) out.innerHTML = '';
    this.log('info', 'Consola limpiada');
  },

  exportJSON() {
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecosync-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.log('info', 'Logs exportados');
  },

  toggle() {
    const drawer = document.getElementById('diagnostics-drawer');
    if (!drawer) return;
    drawer.classList.toggle('open');
  },

  _setupKeyboard() {
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggle();
      }
    });
  },

  _setupButtons() {
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('btn-toggle-console');
      if (btn) btn.addEventListener('click', () => this.toggle());
      const clear = document.getElementById('btn-clear-console');
      if (clear) clear.addEventListener('click', () => this.clear());
      const exp = document.getElementById('btn-export-console');
      if (exp) exp.addEventListener('click', () => this.exportJSON());
      const close = document.getElementById('btn-close-console');
      if (close) close.addEventListener('click', () => this.toggle());
    });
  }
};

// js/storage.js — EcoSync Storage Utilities
window.EcoSync = window.EcoSync || {};
window.EcoSync.storage = {
  DRAFT_KEY: 'ecosync_draft_v1',
  USER_KEY: 'ecosync_user_v1',
  LOGS_KEY: 'ecosync_logs_v1',

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch(e) {
      window.EcoSync.logger && window.EcoSync.logger.log('error', 'Storage error: ' + e.message);
      return false;
    }
  },

  load(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch(e) { return fallback; }
  },

  remove(key) {
    try { localStorage.removeItem(key); return true; } catch(e) { return false; }
  },

  saveDraft(formData) {
    const draft = { ...formData, _savedAt: new Date().toISOString() };
    return this.save(this.DRAFT_KEY, draft);
  },

  loadDraft() { return this.load(this.DRAFT_KEY); },

  clearDraft() { return this.remove(this.DRAFT_KEY); },

  saveUser(user) { return this.save(this.USER_KEY, user); },

  loadUser() { return this.load(this.USER_KEY); },

  saveLogs(logs) { return this.save(this.LOGS_KEY, logs); },

  loadLogs() { return this.load(this.LOGS_KEY, []); },

  getDraftAge() {
    const draft = this.loadDraft();
    if (!draft || !draft._savedAt) return null;
    const ms = Date.now() - new Date(draft._savedAt).getTime();
    const mins = Math.floor(ms / 60000);
    return mins < 1 ? 'hace menos de 1 min' : `hace ${mins} min`;
  }
};

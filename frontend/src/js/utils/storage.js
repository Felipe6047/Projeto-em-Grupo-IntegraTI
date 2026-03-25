export const storage = {
  get(key) {
    return localStorage.getItem(key);
  },
  set(key, value) {
    localStorage.setItem(key, String(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  getJson(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};


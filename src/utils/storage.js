import config from '../config';

export default {
  setItem(key, value) {
    let storage = this.getStorage();
    storage[key] = value;
    localStorage.setItem(config.namespace, JSON.stringify(storage));
  },
  getItem(key) {
    return this.getStorage()[key];
  },
  getStorage() {
    return JSON.parse(window.localStorage.getItem(config.namespace) || '{}');
  },
  clearItem(key) {
    let storage = this.getStorage();
    delete storage[key];
    localStorage.setItem(config.namespace, JSON.stringify(storage));
  },
  clearAll() {
    localStorage.clear();
  }
};

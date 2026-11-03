// Guarda os dados no navegador deste aparelho.
export class LocalStore {
  constructor(key = "pauta-data") {
    this.key = key;
  }

  load() {
    try {
      return JSON.parse(localStorage.getItem(this.key));
    } catch {
      return null;
    }
  }

  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
}

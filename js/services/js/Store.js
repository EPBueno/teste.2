// Fonte única dos dados. Salva no aparelho na hora e na nuvem (se houver login).
export class Store {
  constructor(local, cloud) {
    this.local = local;
    this.cloud = cloud;
    this.uid = null;
    this.listeners = new Set();
    this.saveTimer = null;
    this.data = this.normalize(local.load());
  }

  // Garante o formato e um id único em cada item (inclusive backups antigos).
  normalize(raw) {
    const withIds = (list = []) => list.map((item) => ({ id: crypto.randomUUID(), ...item }));
    return {
      sessions: withIds(raw?.sessions),
      works: withIds(raw?.works),
      updatedAt: raw?.updatedAt ?? 0,
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
  }

  emit() {
    this.listeners.forEach((listener) => listener(this.data));
  }

  add(collection, item) {
    this.data[collection].push({ id: crypto.randomUUID(), ...item });
    this.commit();
  }

  update(collection, id, changes) {
    const item = this.data[collection].find((entry) => entry.id === id);
    if (item) Object.assign(item, changes);
    this.commit();
  }

  remove(collection, id) {
    this.data[collection] = this.data[collection].filter((entry) => entry.id !== id);
    this.commit();
  }

  replace(raw) {
    this.data = this.normalize(raw);
    this.commit();
  }

  commit() {
    this.data.updatedAt = Date.now();
    this.local.save(this.data);
    this.emit();
    this.scheduleCloudSave();
  }

  scheduleCloudSave() {
    if (!this.uid) return;
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      this.cloud.save(this.uid, this.data).catch(() => {
        console.error("Falha ao sincronizar com a nuvem.");
      });
    }, 800);
  }

  // Ao entrar: vence a versão mais recente (local ou da nuvem).
  async connect(uid) {
    this.uid = uid;
    const remote = await this.cloud.load(uid);

    if (remote && remote.updatedAt > this.data.updatedAt) {
      this.data = this.normalize(remote);
      this.local.save(this.data);
      this.emit();
    } else {
      await this.cloud.save(uid, this.data);
    }
  }

  disconnect() {
    this.uid = null;
  }
}

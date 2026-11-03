import { View } from "./View.js";
import { escapeHtml, today, toast } from "../utils.js";

export class SettingsView extends View {
  template() {
    const user = this.app.auth.user;

    const account = user
      ? `<p>Conectado como <strong>${escapeHtml(user.email)}</strong>. Seus dados sincronizam entre aparelhos.</p>
         <button class="btn" id="signOut">Sair</button>`
      : `<p>Entre com sua conta Google para acessar seus dados em qualquer aparelho.</p>
         <button class="btn primary" id="signIn">Entrar com Google</button>`;

    return `
      <h2>Conta e backup</h2>

      <section class="card">
        <h3>Conta</h3>
        ${account}
      </section>

      <section class="card">
        <h3>Backup em arquivo</h3>
        <p class="muted">Baixe uma cópia dos seus dados ou restaure a partir de um arquivo.</p>
        <div class="actions" style="margin-top: 12px">
          <button class="btn primary" id="export">Baixar backup</button>
          <button class="btn" id="import">Restaurar backup</button>
          <input type="file" id="importFile" accept=".json,application/json" hidden>
        </div>
      </section>`;
  }

  bind(root) {
    root.querySelector("#signIn")?.addEventListener("click", () => this.signIn());
    root.querySelector("#signOut")?.addEventListener("click", () => this.app.auth.signOut());
    root.querySelector("#export").addEventListener("click", () => this.exportBackup());

    const fileInput = root.querySelector("#importFile");
    root.querySelector("#import").addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => this.importBackup(fileInput.files[0]));
  }

  async signIn() {
    try {
      await this.app.auth.signIn();
    } catch {
      toast("Não foi possível entrar. Verifique se o domínio está autorizado no Firebase.");
    }
  }

  exportBackup() {
    const json = JSON.stringify(this.store.data, null, 2);
    const link = document.createElement("a");

    link.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    link.download = `pauta-backup-${today()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async importBackup(file) {
    if (!file) return;

    try {
      const raw = JSON.parse(await file.text());
      if (!confirm("Substituir os dados atuais por este backup?")) return;
      this.store.replace(raw);
      toast("Backup restaurado.");
    } catch {
      toast("Arquivo inválido. Escolha um backup em JSON.");
    }
  }
}

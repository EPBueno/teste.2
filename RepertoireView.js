import { View } from "./View.js";
import { escapeHtml, toast } from "../utils.js";

const STATUSES = ["Quero aprender", "Em estudo", "Em revisão", "Pronta"];

export class RepertoireView extends View {
  template() {
    const works = this.store.data.works;

    return `
      <h2>Repertório</h2>
      <p class="muted">${works.length} obras cadastradas</p>

      <form class="card" id="workForm">
        <div class="fields">
          <label>Título <input name="title" required></label>
          <label>Compositor <input name="composer"></label>
          <label>Estado
            <select name="status">
              ${STATUSES.map((status) => `<option>${status}</option>`).join("")}
            </select>
          </label>
        </div>
        <button class="btn primary">Adicionar obra</button>
      </form>

      <ul class="list">
        ${works.map((work) => this.row(work)).join("")
          || '<li class="empty">Seu repertório está vazio. Adicione a primeira obra acima.</li>'}
      </ul>`;
  }

  row(work) {
    const options = STATUSES
      .map((status) => `<option ${status === work.status ? "selected" : ""}>${status}</option>`)
      .join("");

    return `
      <li>
        <div>
          <strong>${escapeHtml(work.title)}</strong>
          <p class="muted">${escapeHtml(work.composer || "Compositor não informado")}</p>
        </div>
        <div class="actions">
          <select data-status="${work.id}" aria-label="Estado de ${escapeHtml(work.title)}">${options}</select>
          <button class="btn quiet" data-remove="${work.id}">Excluir</button>
        </div>
      </li>`;
  }

  bind(root) {
    root.querySelector("#workForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.target);

      this.store.add("works", {
        title: form.get("title").trim(),
        composer: form.get("composer").trim(),
        status: form.get("status"),
      });
      toast("Obra adicionada.");
    });

    root.querySelectorAll("[data-status]").forEach((select) => {
      select.addEventListener("change", () => {
        this.store.update("works", select.dataset.status, { status: select.value });
      });
    });

    root.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        if (confirm("Excluir esta obra?")) this.store.remove("works", button.dataset.remove);
      });
    });
  }
}

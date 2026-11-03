import { View } from "./View.js";
import { escapeHtml, formatDate, today, toast } from "../utils.js";

const FOCUS_OPTIONS = ["Técnica", "Repertório", "Teoria e percepção", "Improviso e composição"];

export class StudiesView extends View {
  get sessions() {
    return [...this.store.data.sessions].sort((a, b) => b.date.localeCompare(a.date));
  }

  template() {
    const sessions = this.sessions;
    const total = sessions.reduce((sum, session) => sum + session.duration, 0);

    return `
      <h2>Estudos</h2>
      <p class="muted">${sessions.length} sessões e ${Math.floor(total / 60)} h ${total % 60} min no total</p>

      <form class="card" id="sessionForm">
        <div class="fields">
          <label>Data <input type="date" name="date" value="${today()}" required></label>
          <label>Duração (min) <input type="number" name="duration" min="1" value="30" required></label>
          <label>Foco
            <select name="focus">
              ${FOCUS_OPTIONS.map((option) => `<option>${option}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="fields">
          <label>O que você estudou <input name="content" placeholder="Ex.: arpejos, introdução da peça"></label>
        </div>
        <button class="btn primary">Registrar estudo</button>
      </form>

      <ul class="list">
        ${sessions.map((session) => this.row(session)).join("")
          || '<li class="empty">Nenhum estudo registrado ainda. Use o formulário acima.</li>'}
      </ul>`;
  }

  row(session) {
    return `
      <li>
        <div>
          <strong>${escapeHtml(session.content || session.focus)}</strong>
          <p class="muted">${formatDate(session.date)}, ${session.duration} min, ${escapeHtml(session.focus)}</p>
        </div>
        <button class="btn quiet" data-remove="${session.id}">Excluir</button>
      </li>`;
  }

  bind(root) {
    root.querySelector("#sessionForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.target);

      this.store.add("sessions", {
        date: form.get("date"),
        duration: Number(form.get("duration")),
        focus: form.get("focus"),
        content: form.get("content").trim(),
      });
      toast("Estudo registrado.");
    });

    root.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        if (confirm("Excluir este estudo?")) this.store.remove("sessions", button.dataset.remove);
      });
    });
  }
}

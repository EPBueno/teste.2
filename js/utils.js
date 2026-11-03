// Data de hoje no fuso local (toISOString sozinho usa UTC e erra o dia à noite).
export const today = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
};

export const formatDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");

const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export const escapeHtml = (text = "") =>
  String(text).replace(/[&<>"']/g, (char) => ENTITIES[char]);

export function toast(message) {
  const element = document.querySelector("#toast");
  element.textContent = message;
  element.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { element.hidden = true; }, 2500);
}

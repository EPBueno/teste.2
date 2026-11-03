// Base de todas as telas: template() devolve o HTML, bind() liga os eventos.
export class View {
  constructor(app) {
    this.app = app;
  }

  get store() {
    return this.app.store;
  }

  template() {
    return "";
  }

  bind(root) {}

  mount(root) {
    root.innerHTML = this.template();
    this.bind(root);
  }
}

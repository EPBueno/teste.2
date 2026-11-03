import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { firebaseConfig } from "./firebase-config.js";
import { AuthService } from "./services/AuthService.js";
import { CloudStore } from "./services/CloudStore.js";
import { LocalStore } from "./services/LocalStore.js";
import { Store } from "./Store.js";
import { StudiesView } from "./views/StudiesView.js";
import { RepertoireView } from "./views/RepertoireView.js";
import { SettingsView } from "./views/SettingsView.js";
import { toast } from "./utils.js";

class App {
  constructor() {
    const firebase = initializeApp(firebaseConfig);

    this.auth = new AuthService(firebase);
    this.store = new Store(new LocalStore(), new CloudStore(firebase));
    this.root = document.querySelector("#view");
    this.routes = {
      estudos: new StudiesView(this),
      repertorio: new RepertoireView(this),
      conta: new SettingsView(this),
    };
  }

  get currentRoute() {
    const name = location.hash.slice(1);
    return name in this.routes ? name : "estudos";
  }

  start() {
    this.store.subscribe(() => this.render());
    window.addEventListener("hashchange", () => this.render());
    this.auth.onChange((user) => this.handleAuthChange(user));
    this.render();
  }

  async handleAuthChange(user) {
    if (user) {
      try {
        await this.store.connect(user.uid);
      } catch {
        toast("Não foi possível sincronizar agora. Seus dados continuam salvos neste aparelho.");
      }
    } else {
      this.store.disconnect();
    }
    this.render();
  }

  render() {
    const route = this.currentRoute;

    document.querySelectorAll("#nav a").forEach((link) => {
      link.classList.toggle("active", link.dataset.route === route);
    });
    this.routes[route].mount(this.root);
  }
}

new App().start();

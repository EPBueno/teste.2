import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut }
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

export class AuthService {
  constructor(app) {
    this.auth = getAuth(app);
    this.provider = new GoogleAuthProvider();
    this.user = null;
  }

  onChange(callback) {
    return onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      callback(user);
    });
  }

  signIn() {
    return signInWithPopup(this.auth, this.provider);
  }

  signOut() {
    return signOut(this.auth);
  }
}

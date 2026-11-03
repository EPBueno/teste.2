import { getFirestore, doc, getDoc, setDoc }
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Um documento por usuário: users/{uid}
export class CloudStore {
  constructor(app) {
    this.db = getFirestore(app);
  }

  async load(uid) {
    const snapshot = await getDoc(doc(this.db, "users", uid));
    return snapshot.exists() ? snapshot.data() : null;
  }

  save(uid, data) {
    return setDoc(doc(this.db, "users", uid), data);
  }
}

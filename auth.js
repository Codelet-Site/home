// auth.js - modular Firebase auth + Firestore for Codelet
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  "apiKey": "AIzaSyD-GTGy3sqCGdo9tMw0iuyWLWEh2srUA1w",
  "authDomain": "codelet-2ad97.firebaseapp.com",
  "projectId": "codelet-2ad97",
  "storageBucket": "codelet-2ad97.firebasestorage.app",
  "messagingSenderId": "379390074770",
  "appId": "1:379390074770:web:9f433d198b21aae5c9eb4b",
  "measurementId": "G-0YN428EFB8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// SIGNUP
const signupBtn = document.getElementById('signupBtn');
if (signupBtn) {
  signupBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const status = document.getElementById('signupStatus');

    if (!username) {
      status.textContent = 'Please enter a username.';
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      await setDoc(doc(db, 'users', uid), {
        username,
        email,
        role: 'Member',
        createdAt: serverTimestamp(),
        points: 0,
        tasks: 0,
        xp: 0,
        badges: []
      });

      status.textContent = 'Account created! Redirecting...';
      setTimeout(() => window.location.href = 'dashboard.html', 700);
    } catch (e) {
      status.textContent = e.message;
    }
  });
}

// LOGIN
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const status = document.getElementById('loginStatus');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'dashboard.html';
    } catch (e) {
      status.textContent = e.message;
    }
  });
}

// LOGOUT (if on dashboard)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'index.html';
  });
}

// DASHBOARD: load user data when on dashboard
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  // only run if dashboard elements exist
  const nameEl = document.getElementById('username');
  if (!nameEl) return;

  const uid = user.uid;
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) {
    nameEl.textContent = 'Unknown user';
    return;
  }
  const data = snap.data();

  nameEl.textContent = data.username || 'No name';
  const roleEl = document.getElementById('role');
  if (roleEl) roleEl.textContent = 'Role: ' + (data.role || 'Member');

  // badges
  const badgesEl = document.getElementById('badges');
  if (badgesEl) {
    badgesEl.innerHTML = '';
    if (data.badges && data.badges.length) {
      data.badges.forEach(b => {
        const el = document.createElement('span');
        el.className = 'badge';
        el.textContent = b;
        badgesEl.appendChild(el);
      });
    } else {
      badgesEl.textContent = 'No badges yet.';
    }
  }

  // stats
  const points = document.getElementById('points');
  const tasks = document.getElementById('tasks');
  const xp = document.getElementById('xp');
  if (points) points.textContent = data.points || 0;
  if (tasks) tasks.textContent = data.tasks || 0;
  if (xp) xp.textContent = data.xp || 0;
});
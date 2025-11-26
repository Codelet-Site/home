// auth.js — Firebase init + auth handlers + export auth & db
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

/* ----- FIREBASE CONFIG ----- */
const firebaseConfig = {
  apiKey: "AIzaSyD-GTGy3sqCGdo9tMw0iuyWLWEh2srUA1w",
  authDomain: "codelet-2ad97.firebaseapp.com",
  projectId: "codelet-2ad97",
  storageBucket: "codelet-2ad97.firebasestorage.app",
  messagingSenderId: "379390074770",
  appId: "1:379390074770:web:9f433d198b21aae5c9eb4b",
  measurementId: "G-0YN428EFB8"
};

/* ----- INITIALIZE ----- */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ----- EXPORTS for other pages (chat etc.) ----- */
export { auth, db };

/* ----- DOM-ready handlers ----- */
document.addEventListener("DOMContentLoaded", () => {
  /* SIGNUP (if signup page present) */
  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
      const usernameEl = document.getElementById("username");
      const emailEl = document.getElementById("email");
      const passEl = document.getElementById("password");
      const statusEl = document.getElementById("signupStatus");

      const username = usernameEl ? usernameEl.value.trim() : "";
      const email = emailEl ? emailEl.value.trim() : "";
      const password = passEl ? passEl.value : "";

      if (!username) {
        if (statusEl) statusEl.textContent = "Please choose a username.";
        return;
      }

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;

        await setDoc(doc(db, "users", uid), {
          username,
          email,
          role: "Member",
          createdAt: serverTimestamp(),
          points: 0,
          tasks: 0,
          xp: 0,
          badges: []
        });

        if (statusEl) statusEl.textContent = "Account created! Redirecting...";
        setTimeout(() => (window.location.href = "dashboard.html"), 700);
      } catch (err) {
        if (statusEl) statusEl.textContent = err.message;
      }
    });
  }

  /* LOGIN (if login page present) */
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const emailEl = document.getElementById("email");
      const passEl = document.getElementById("password");
      const statusEl = document.getElementById("loginStatus");

      const email = emailEl ? emailEl.value.trim() : "";
      const password = passEl ? passEl.value : "";

      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard.html";
      } catch (err) {
        if (statusEl) statusEl.textContent = err.message;
      }
    });
  }

  /* LOGOUT (if logout button exists on a page) */
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "login.html";
      } catch (err) {
        // silent fail
        console.error("Logout failed", err);
      }
    });
  }
});

/* ----- Optional auth guard for protected pages ----- */
/* This redirects guests away from protected pages (dashboard/chat etc.) */
onAuthStateChanged(auth, (user) => {
  const protectedPages = [
    "dashboard.html",
    "chat.html",
    "lessons.html",
    "projects.html",
    "settings.html",
    "codes.html",
    "market.html"
  ];
  const path = window.location.pathname.split("/").pop();

  if (!user && protectedPages.includes(path)) {
    // If the page requires auth and user not signed in — redirect to login
    window.location.href = "login.html";
  }
});

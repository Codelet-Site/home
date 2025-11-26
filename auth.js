// --- Firebase Core ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Config ---
const firebaseConfig = {
  apiKey: "AIzaSyD-GTGy3sqCGdo9tMw0iuyWLWEh2srUA1w",
  authDomain: "codelet-2ad97.firebaseapp.com",
  projectId: "codelet-2ad97",
  storageBucket: "codelet-2ad97.firebasestorage.app",
  messagingSenderId: "379390074770",
  appId: "1:379390074770:web:9f433d198b21aae5c9eb4b",
  measurementId: "G-0YN428EFB8"
};

// --- Init ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Export so other pages can import ---
export { auth, db };

// --- Auto redirect if logged out (optional) ---
onAuthStateChanged(auth, user => {
  const protectedPages = [
    "dashboard.html",
    "chat.html",
    "lessons.html",
    "projects.html",
    "settings.html"
  ];

  const current = location.pathname.split("/").pop();

  if (!user && protectedPages.includes(current)) {
    location.href = "login.html";
  }
});

// --- Logout button ---
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", () => signOut(auth).then(() => {
    location.href = "login.html";
  }));
});

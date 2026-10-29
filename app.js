import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";

// Конфигурация твоего проекта college-13be5
const firebaseConfig = {
  apiKey: "AIzaSyDp3Dar0NzjYpnzKP3IhXq4NiJr7TSr2gQ",
  authDomain: "college-13be5.firebaseapp.com",
  databaseURL: "https://college-13be5-default-rtdb.firebaseio.com",
  projectId: "college-13be5",
  storageBucket: "college-13be5.firebasestorage.app",
  messagingSenderId: "406945749920",
  appId: "1:406945749920:web:28973883860d0d2b8b62c5",
  measurementId: "G-TQYYXF46QR"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
const database = getDatabase(app);

const studentsRef = ref(database, 'students');

// --- ОБРАБОТКА ФОРМЫ (Insert) ---
const form = document.getElementById('student-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const major = document.getElementById('major').value.trim();
  const gradYear = Number(document.getElementById('gradYear').value);

  if (!name || !major || !gradYear) return;

  const newStudentRef = push(studentsRef);
  set(newStudentRef, { name, major, gradYear })
    .then(() => {
      form.reset();
      console.log("Insert success!");
    })
    .catch((error) => {
      console.error("Database write error:", error);
      alert("Не удалось сохранить: " + error.message);
    });
});

// --- ОТОБРАЖЕНИЕ ВСЕХ (Select в реальном времени) ---
const displayElement = document.getElementById('student-display');

onValue(studentsRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) {
    displayElement.textContent = "Студентов нет.";
    return;
  }

  const html = Object.entries(data).map(([key, s]) => `
    <div class="student">
      <p><strong>Имя:</strong> ${s.name ?? '-'}</p>
      <p><strong>Специальность:</strong> ${s.major ?? '-'}</p>
      <p><strong>Год выпуска:</strong> ${s.gradYear ?? '-'}</p>
    </div>
    <hr>
  `).join('');

  displayElement.innerHTML = html;
}, (error) => {
  console.error("Ошибка чтения:", error);
  displayElement.textContent = "Ошибка загрузки данных.";
});

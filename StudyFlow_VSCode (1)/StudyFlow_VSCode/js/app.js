// StudyFlow - interações do protótipo
const STORAGE_USER = "studyflow_user";
const STORAGE_TASKS = "studyflow_tasks";

function getUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_USER)) || null; }
  catch { return null; }
}

function updateHeaderUser() {
  const user = getUser();
  const name = user?.name || "Aluno";
  const nameTarget = document.getElementById("student-name");
  const headerTarget = document.getElementById("header-user");
  const avatar = document.getElementById("avatar-initial");
  if (nameTarget) nameTarget.textContent = name.split(" ")[0];
  if (headerTarget) headerTarget.textContent = name.split(" ")[0];
  if (avatar) avatar.textContent = name.charAt(0).toUpperCase();
}

function setupRegistration() {
  const form = document.getElementById("register-form");
  if (!form) return;

  const toggle = document.getElementById("toggle-password");
  const password = document.getElementById("password");
  toggle?.addEventListener("click", () => {
    const show = password.type === "password";
    password.type = show ? "text" : "password";
    toggle.textContent = show ? "Ocultar" : "Mostrar";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = password.value;
    const message = document.getElementById("register-message");

    if (!name || !email || pass.length < 6) {
      message.textContent = "Confira os campos. A senha precisa ter pelo menos 6 caracteres.";
      return;
    }

    // Demonstração local: não use este armazenamento para senhas reais.
    localStorage.setItem(STORAGE_USER, JSON.stringify({ name, email }));
    window.location.href = "painel.html";
  });
}

function setupTasks() {
  const checks = [...document.querySelectorAll(".study-task")];
  if (!checks.length) return;

  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(STORAGE_TASKS)) || []; } catch {}
  checks.forEach((check, index) => {
    check.checked = Boolean(saved[index]);
    check.addEventListener("change", save);
  });

  function save() {
    const values = checks.map(check => check.checked);
    localStorage.setItem(STORAGE_TASKS, JSON.stringify(values));
    const done = values.filter(Boolean).length;
    const percent = Math.round((done / checks.length) * 100);
    document.getElementById("task-count").textContent = `${done}/${checks.length}`;
    document.getElementById("progress-number").textContent = `${percent}%`;
    document.getElementById("progress-bar").style.width = `${percent}%`;
    document.getElementById("progress-caption").textContent = `${percent}% das tarefas concluídas`;
  }
  save();
}

function setupSubjects() {
  const grid = document.getElementById("subject-grid");
  if (!grid) return;
  const buttons = [...grid.querySelectorAll(".subject-button")];
  const title = document.getElementById("selected-subject-title");
  const search = document.getElementById("subject-search");

  function selectSubject(name) {
    buttons.forEach(button => button.classList.toggle("selected", button.dataset.subject === name));
    title.textContent = name;
  }

  buttons.forEach(button => button.addEventListener("click", () => selectSubject(button.dataset.subject)));
  search?.addEventListener("input", () => {
    const term = search.value.toLocaleLowerCase("pt-BR");
    buttons.forEach(button => {
      button.hidden = !button.dataset.subject.toLocaleLowerCase("pt-BR").includes(term);
    });
  });

  const params = new URLSearchParams(window.location.search);
  const requested = params.get("materia");
  if (requested && buttons.some(button => button.dataset.subject === requested)) selectSubject(requested);
}

function setupDate() {
  const target = document.getElementById("today-date");
  if (target) {
    target.textContent = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date());
  }
}

function setupLogout() {
  document.getElementById("logout")?.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_USER);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateHeaderUser();
  setupRegistration();
  setupTasks();
  setupSubjects();
  setupDate();
  setupLogout();
});

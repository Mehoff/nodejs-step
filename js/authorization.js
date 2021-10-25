let isLogIn = true;

const form = document.querySelector("form");
const actionToggler = document.querySelector("#action-toggler");
const authHeaderElement = document.querySelector("#authorization-header");
const loginElement = document.querySelector("#login");
const passwordElement = document.querySelector("#password");
const confirmPasswordElement = document.querySelector("#confirm-password");
const confirmPasswordWrapperElement = document.querySelector(
  "#confirm-password-wrapper"
);
const submitElement = document.querySelector("#submit-button");

const formData = new FormData();

document.addEventListener("submit", (e) => {
  e.preventDefault();

  const body = createBody();
  if (!body) return;

  fetch(window.location, {
    method: "POST",
    body: formData,
  })
    .then((r) => r.json())
    .then((res) => {
      if (res.error) {
        alert(res.error);
        return;
      }
      alert(`Добро пожаловать, ${res.login}`);
    });
});

actionToggler.addEventListener("click", (e) => {
  isLogIn
    ? (confirmPasswordWrapperElement.classList.remove("invisible"),
      (authHeaderElement.textContent = "Регистрация"),
      (actionToggler.textContent = "Вход"),
      (submitElement.value = "Зарегистрироваться"),
      (isLogIn = false))
    : (confirmPasswordWrapperElement.classList.add("invisible"),
      (authHeaderElement.textContent = "Вход"),
      (actionToggler.textContent = "Регистрация"),
      (submitElement.value = "Войти"),
      (isLogIn = true));
});

const createBody = () => {
  const login = loginElement.value.trim();
  const password = passwordElement.value.trim();
  const confirmation = confirmPasswordElement.value.trim();

  if (!isLogIn) {
    if (password !== confirmation) {
      alert("Пароль и подтверждение пароля не совпадают!");
      return false;
    }
  }

  formData.append("isLogin", isLogIn);
  formData.append("login", login);
  formData.append("password", password);
  return true;
};

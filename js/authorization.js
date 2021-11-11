let isLogIn = true;

const form = document.querySelector("form");
const actionToggler = document.querySelector("#action-toggler");
const authHeaderElement = document.querySelector("#authorization-header");
const emailElement = document.querySelector("#email");
const passwordElement = document.querySelector("#password");

const confirmPasswordElement = document.querySelector("#confirm-password");
const confirmPasswordWrapperElement = document.querySelector(
  "#confirm-password-wrapper"
);

const nameElement = document.querySelector("#name");
const nameWrapperElement = document.querySelector("#name-wrapper");

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

      console.log(res);
      alert(`Добро пожаловать, ${res.name}`);
      window.location = "/";
    });
});

actionToggler.addEventListener("click", (e) => {
  isLogIn
    ? (confirmPasswordWrapperElement.classList.remove("invisible"),
      (authHeaderElement.textContent = "Регистрация"),
      (actionToggler.textContent = "Вход"),
      (submitElement.value = "Зарегистрироваться"),
      nameWrapperElement.classList.remove("invisible"),
      (isLogIn = false))
    : (confirmPasswordWrapperElement.classList.add("invisible"),
      (authHeaderElement.textContent = "Вход"),
      (actionToggler.textContent = "Регистрация"),
      (submitElement.value = "Войти"),
      nameWrapperElement.classList.add("invisible")((isLogIn = true)));
});

const createBody = () => {
  const email = emailElement.value.trim();
  const password = passwordElement.value.trim();
  const confirmation = confirmPasswordElement.value.trim();
  const name = nameElement.value.trim();

  if (!isLogIn) {
    if (password !== confirmation) {
      alert("Пароль и подтверждение пароля не совпадают!");
      return false;
    }
  }

  formData.append("isLogin", isLogIn);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("name", name);
  return true;
};

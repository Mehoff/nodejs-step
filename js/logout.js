const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  const dResult = confirm("Вы уверены что хотите выйти из учетной записи?");

  if (dResult) {
    fetch("/logout", { method: "GET" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          window.location = "/";
        }
      });
  }
});

document.addEventListener("submit", (e) => {
  e.preventDefault();

  const form = document.forms[0];
  const formData = new FormData(form);

  fetch("/addBook", { method: "POST", body: formData })
    .then((res) => res.json())
    .then(console.log);
  //console.log(formData.values);
});

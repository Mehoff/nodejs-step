document.addEventListener("submit", (e) => {
  e.preventDefault();

  const clearInputs = () => {
    nameElement.value = "";
    descriptionElement.value = "";
    picturesElement.value = null;
  };

  const setValues = (name = "", description = "", path) => {
    bookNameElement.textContent = name;
    bookDescriptionElement.textContent = description;
    bookImageElement.src = "..\\" + path;
  };

  // Data validation
  const getInputData = () => {
    let res = {};

    const name = nameElement.value.trim();
    if (!name || name.length === 0) return false;

    const description = descriptionElement.value.trim();
    if (!description || description.length === 0) return false;

    console.log(picturesElement.files[0]);
    if (!picturesElement.files[0]) return false;

    res.name = name;
    res.description = description;
    res.picture = picturesElement.files[0];

    return res;
  };

  // Getting the form object
  const form = e.target;

  // Form elements
  const nameElement = form.querySelector("#name");
  const descriptionElement = form.querySelector("#description");
  const picturesElement = form.querySelector("#pictureFile");

  // Book elements
  const bookNameElement = document.querySelector("#book-name");
  const bookDescriptionElement = document.querySelector("#book-description");
  const bookImageElement = document.querySelector("#book-image");
  const bookImageNameElement = document.querySelector("#book-image-name");

  const formData = new FormData();

  // Call validation function
  const inputData = getInputData();
  if (!inputData) {
    alert(
      "Bad input data. Fill text inputs and select a picture from your desktop"
    );
    return;
  }

  // Fill formData which we going to send to POST /books
  formData.append("name", inputData.name);
  formData.append("description", inputData.description);
  formData.append("picture", inputData.picture);

  // Add user id
  //formData.append("user")

  // set image original name to front-end
  bookImageNameElement.textContent = picturesElement.files[0].name;

  // sending the request. fetch is capable of setting content-type and other headers on its own
  fetch("/books", {
    method: "POST",
    body: formData,
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.error) {
        alert(`Failed to upload a file!\n${data.error}`);
        return;
      }

      // if data is ok - clear inputs
      clearInputs();

      // API responds with name, description which we set, and path to image that we saved on server.
      setValues(data.name, data.description, data.imagePath);
    });
});

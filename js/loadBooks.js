document.addEventListener("DOMContentLoaded", async (e) => {
  const booksElement = document.querySelector("#books-list");

  const books = await fetch("/books-api", { method: "GET" }).then((r) =>
    r.json()
  );

  console.log("GET: /books-api", books);

  let row = createElement("row d-flex-row");

  for (let i = 0; i < books.length; i++) {
    if (i % 3 === 0 && i != 0) {
      booksElement.appendChild(row);
      row = createElement("row d-flex-row");
    }
    row.appendChild(createBookElement(books[i]));
  }

  if (row.hasChildNodes()) booksElement.appendChild(row);
});

const createElement = (className = "") => {
  const row = document.createElement("div");
  row.className = className;
  return row;
};

const createButton = (text = "", className = "", handler) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.onclick = handler;

  button.style.border = "none";

  return button;
};

const createBookElement = (book) => {
  const div = createElement("col");

  const imageCol = createElement("row image-fluid");
  const dataCol = createElement("row d-flex justify-content-between text-left");

  div.style.outline = "1px solid lightgrey";
  div.style.margin = "5px";

  const titleElement = document.createElement("h3");
  const descriptionElement = document.createElement("p");
  const imageElement = document.createElement("img");
  const uploadedAtElement = document.createElement("small");

  const buttonDel = createButton("Удалить", "link-secondary", () => {
    console.log("Удалить" + book._id);
  });
  const buttonEdit = createButton("Редактировать", "link-primary", () => {
    console.log("Редактировать" + book._id);
  });

  titleElement.innerText = book.title;
  descriptionElement.innerText = book.description;
  imageElement.src = book.path;
  imageElement.style.maxWidth = "200px";
  uploadedAtElement.innerText = new Date(book.uploadedAt).toLocaleDateString();

  imageCol.appendChild(imageElement);
  dataCol.appendChild(titleElement);
  dataCol.appendChild(descriptionElement);
  dataCol.appendChild(uploadedAtElement);
  dataCol.appendChild(buttonEdit);
  dataCol.appendChild(buttonDel);

  div.appendChild(imageCol);
  div.appendChild(dataCol);

  return div;
};

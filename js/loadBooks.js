const filter = document.querySelector("#filter");

filter.addEventListener("change", (e) => {
  //all, own, deleted
  const option = e.target.value;

  if (!option) option = "all";

  fillBooksByOption(option);
});

function fillBooksByOption(option) {
  fetch(`/books-api/${option}`, {
    method: "GET",
  })
    .then((r) => r.json())
    .then((books) => {
      clearContainer();
      if (books.error) {
        alert("Для того чтобы получить доступ к своим книгам - авторизуйтесь");
        return;
      }
      fillContainer(books);
    });
}

function fillContainer(books) {
  const booksElement = document.querySelector("#books-list");

  let row = createElement("row d-flex-row");

  for (let i = 0; i < books.length; i++) {
    if (i % 3 === 0 && i != 0) {
      booksElement.appendChild(row);
      row = createElement("row d-flex-row");
    }
    row.appendChild(createBookElement(books[i]));
  }

  if (row.hasChildNodes()) booksElement.appendChild(row);
}

document.addEventListener("DOMContentLoaded", async (e) => {
  fillBooksByOption("all");
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

    if (confirm(`Вы уверены что хотите удалить ${book.title}?`))
      deleteBook(book._id);
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

const deleteBook = async (bookId) => {
  const raw = await fetch("/books-api", {
    method: "DELETE",
    body: JSON.stringify({ bookId }),
  });

  const response = await raw.json();

  if (response) {
    if (response.error) {
      alert(response.error);
    }
    location.reload();
  } else {
    alert("Response is undefined");
    console.log(response);
  }
};

const clearContainer = () => {
  const booksElement = document.querySelector("#books-list");
  booksElement.innerHTML = "";
};

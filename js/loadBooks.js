document.addEventListener("DOMContentLoaded", async (e) => {
  const booksElement = document.querySelector("#books-list");

  const books = await fetch("/books-api", { method: "GET" }).then((r) =>
    r.json()
  );

  console.log("GET: /books-api", books);
});

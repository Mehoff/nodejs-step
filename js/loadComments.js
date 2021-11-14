const commentsElement = document.querySelector("#comments");

function getJsonFromUrl(url) {
  if (!url) url = location.search;
  var query = url.substr(1);
  var result = {};
  query.split("&").forEach(function (part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

document.addEventListener("DOMContentLoaded", async (e) => {
  const bookId = getJsonFromUrl(location.search).bookId;
  const comments = await loadComments(bookId);

  if (!comments) {
    commentsElement.textContent = "У этой книги нет комментариев";
    return;
  }
  if (comments.length === 0) {
    commentsElement.textContent = "У этой книги нет комментариев";
    return;
  }

  for (const comment of comments) {
    commentsElement.appendChild(createCommentElement(comment));
  }
});

const createCommentElement = (comment) => {
  const el = document.createElement("div");
  el.className = "comment-element";

  const name = document.createElement("h4");
  name.textContent = comment.author.name;

  const text = document.createElement("span");
  text.textContent = comment.text;

  el.appendChild(name);
  el.appendChild(text);

  return el;
};

const loadComments = async (bookId) => {
  const comments = await fetch("/books-api/comments", {
    method: "POST",
    body: JSON.stringify({ bookId }),
  }).then((r) => r.json());

  if (!comments) {
    return null;
  } else return comments;
};

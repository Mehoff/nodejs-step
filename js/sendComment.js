const textArea = document.querySelector("#comment-text");
const sendButton = document.querySelector("#sendComment");

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

sendButton.addEventListener("click", (e) => {
  const text = textArea.value;

  if (text.length < 1) {
    alert("Комментарий пустой");
    return;
  }

  const bookId = getJsonFromUrl(location.search).bookId;

  sendComment(text, bookId);
});

const sendComment = (text, bookId) => {
  if (!bookId) {
    alert("Failed to fetch book id");
    return;
  }
  if (!text.length) {
    alert("Minimum comment length is 1 character");
    return;
  }

  fetch("/comments", { method: "POST", body: JSON.stringify({ text, bookId }) })
    .then((r) => r.json())
    .then((res) => {
      if (res.error) {
        alert(res.error);
        return;
      }
    });

  location.reload();
};

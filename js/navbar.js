const getCookies = () => {
  const list = {};
  const cookies = document.cookie;

  cookies &&
    cookies.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      list[parts.shift().trim()] = decodeURI(parts.join("="));
    });

  return list;
};

const navbarElement = document.querySelector("#navbar");
const element = document.createElement("li");
element.className = "nav-item";

if (getCookies()["jwt"]) {
    element.innerHTML =
    "<button id='logout' style='cursor: pointer; border: none' class='nav-link'>Log out</button>"
} else {
    element.innerHTML =
    "<a class='nav-link' href='authorization'>Authorization</a>"
}

navbarElement.appendChild(element)

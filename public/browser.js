let itemTemplate = item => `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
<span class="item-text">${item.text}</span>
<div>
  <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
  <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
</div>
</li>`;

// Initial page load render
let ourHTML = items.map(item => itemTemplate(item)).join("");
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML);

// Create feature
let createField = document.getElementById("create-field");
document.getElementById("create-form").addEventListener("submit", e => {
  e.preventDefault();
  axios
    .post("/create-item", { text: createField.value })
    .then(response => {
      // create the html for a new item
      document
        .getElementById("item-list")
        .insertAdjacentHTML("beforeend", itemTemplate(response.data));
      createField.value = "";
      createField.focus();
    })
    .catch(err => {
      console.log("err:", err);
    });
});

document.addEventListener("click", e => {
  // Update feature
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt(
      `enter your desired new text`,
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
    );
    // console.log(userInput);
    // Below is a Promise
    if (userInput) {
      axios
        .post("/update-item", {
          text: userInput,
          id: e.target.getAttribute("data-id")
        })
        .then(() => {
          // do something here
          e.target.parentElement.parentElement.querySelector(
            ".item-text"
          ).innerHTML = userInput;
        })
        .catch(err => {
          console.log("err:", err);
        });
    }
  }
  // Delete feature
  if (e.target.classList.contains("delete-me")) {
    if (confirm(`Do you want to delete this item permanently?`)) {
      axios
        .post("/delete-item", {
          id: e.target.getAttribute("data-id")
        })
        .then(() => {
          // do something here
          e.target.parentElement.parentElement.remove();
        })
        .catch(err => {
          console.log("err:", err);
        });
    }
  }
});

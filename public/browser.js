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

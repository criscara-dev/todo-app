document.addEventListener("click", e => {
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
});

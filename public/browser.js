document.addEventListener("click", e => {
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt(`enter your desired new text`);
    // console.log(userInput);
    axios
      .post("/update-item", { text: userInput })
      .then(() => {
        // do something here
      })
      .catch(err => {
        console.log("err:", err);
      });
  }
});

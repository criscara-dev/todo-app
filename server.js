// create the express server

let express = require("express");
let mongodb = require("mongodb");
let sanitizeHTML = require("sanitize-html");

let port = 3000;
let app = express();
let db;

// To make available in our server this file and files contained in it.
app.use(express.static("public"));
let connectionString =
  "mongodb+srv://todoAppUser:pS1itlXXFIigEv79@cluster0-hwztk.mongodb.net/TodoApp?retryWrites=true&w=majority";
mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    // select the MongoDb database
    db = client.db();
    app.listen(port);
  }
);

// Tell express to get async request and add it to a body object that live into the requested object
app.use(express.json());
// Configure the Express framework to automatically take submitted form data and add it to a body object that live into the requested object
app.use(express.urlencoded({ extended: false }));

let passwordProtected = (req, res, next) => {
  res.set("WWW-Authenticate", "Basic realm='To-do App'");
  console.log("req.headers.authorization:", req.headers.authorization);
  if (req.headers.authorization == "Basic Y3JpczpqYXZhc2NyaXB0dG9kb2FwcA==") {
    next();
  } else {
    res.status(401).send("Authentication required");
  }
};

// Use the passowrd for all route instead of passing the arg into each app. function
app.use(passwordProtected);

// Homepage route
app.get("/", (req, res) => {
  // load the data from the database before send back a response
  db.collection("items")
    .find()
    .toArray((err, items) => {
      // console.log("items:", items);
      res.send(`
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App</h1>
    
    <div class="jumbotron p-3 shadow-sm">
      <form id="create-form" action="/create-item" method="POST">
        <div class="d-flex align-items-center">
          <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>
    
    <ul id="item-list" class="list-group pb-5">
      
    </ul>
    
  </div>

  <script>
  let items =${JSON.stringify(items)}
  </script>

  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="/browser.js"></script>
</body>
</html>
  `);
    });
});

// /create-item is from the <form> and 'item' in { text: req.body.item } is the 'name' of the input form
app.post("/create-item", (req, res) => {
  let safeText = sanitizeHTML(req.body.text, {
    allowTags: [],
    allowedAttributes: {}
  });
  db.collection("items").insertOne({ text: safeText }, (err, info) => {
    res.json(info.ops[0]);
  });
});

app.post("/update-item", (req, res) => {
  let safeText = sanitizeHTML(req.body.text, {
    allowTags: [],
    allowedAttributes: {}
  });
  db.collection("items").findOneAndUpdate(
    // data from the button with html >Edit< ... and from HTML5 feature attribute data-
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { text: safeText } },
    () => {
      res.send("success");
    }
  );
});

app.post("/delete-item", (req, res) => {
  db.collection("items").deleteOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    () => {
      res.send("success");
    }
  );
});

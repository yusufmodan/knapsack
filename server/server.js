var express = require("express");
var bodyParser = require("body-parser"); // request body parsing middleware (json, url)
var morgan = require("morgan"); // log requests to the console

var cookieParser = require("cookie-parser"); // parses cookie header, populate req.cookies
var session = require("express-session");
var sequelize = require("sequelize"); // promise based ORM for SQL
var db = require("../config/database.js"); // connect to database
var ddl = require("../config/ddl.js"); // create database tables

var bcrypt = require('bcrypt-nodejs'); // hashing passwords
var Promise = require('bluebird'); // for promisification

var app = express(); // create our app w/ express
var port = process.env.PORT || 3000;
var ip = "127.0.0.1"; // localhost

/************************************************************/
// CONFIGURE SERVER
/************************************************************/

/************************************************************/
// Initialize Database
/************************************************************/
db.sync()
  .then(function(err) {
    console.log('Database is up and running');
  }, function(err) {
    console.log('An error occurred while creating the database:', err);
  });

/************************************************************/

// Express uses template engine to parse front-end scripts. Can parse HTML, EJS, JADE, etc.
app.set("view engine", "ejs");
// Tells Express from where to deliver front end views
app.set("views", __dirname + "/../client/views");

// Logger for dev environment
app.use(morgan("dev"));

// Body parser is middleware to handle POST data in Express 4
app.use(bodyParser.urlencoded({
  "extended": "true"
}));

app.use(bodyParser.json());
// Cookie parser is middleware to handle cookies sent from the client.
app.use(cookieParser());
// Express sessions handles sessions in Express
app.use(session({
  secret: "$#%!@#@@#SSDASASDVV@@@@",
  key: "sid",
  saveUninitialized: true,
  resave: true
}));

// serve up static files
app.use(express.static(__dirname + "/../client"));


/************************************************************/
// ROUTE HANDLING
/************************************************************/

var router = express.Router();

// local dev route (http://localhost:3000)
router.get("/", function(req, res) {
  res.render("index");
});

app.post("/", function(req, res) {
  res.send("I got a POST Request from the home page");
});


// apply the routes to our application
app.use("/", router);

app.post("/api/signin", function(req, res) {
  console.log(req.body);
});

app.post("/api/signup", function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  ddl.users.findOne({
      where: {
        username: username
      }
    }).then(function(user) {
      if (!user) {
        var hashing = Promise.promisify(bcrypt.hash); // hashing is a promisified version of bcyrpt hash
        var hashPass = hashing(password, null, null).
        then(function(hash) {
          
        })
      }
    })
    // sequelize.query("INSERT INTO users (user_name, password) VALUES (username, password)").success(function(myTableRows) {
    //   console.log(myTableRows);
    // });
  console.log("Username: ", username, "Password: ", password);
});


/************************************************************/
// AUTHENTICATION ROUTES
/************************************************************/




/************************************************************/
// HANDLE WILDCARD ROUTES - IF ALL OTHER ROUTES FAIL
/************************************************************/




/************************************************************/
// START THE SERVER
/************************************************************/
app.listen(port);
console.log("Knapsack is listening on port " + port);

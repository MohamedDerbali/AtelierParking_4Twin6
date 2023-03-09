var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const http = require("http");
const db = require("./db.json");
require("dotenv").config();
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const eventsRouter = require("./routes/events");
var app = express();

mongoose
  .connect(process.env.MONGO_URI || db.MONGO.URI)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err.message));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/events", eventsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

const server = http.createServer(app);
const io = require("socket.io")(server);
io.on('connection', (stream) => {
  console.log('socket io is connected!');
  stream.on("parking", (car)=>{
    console.log(`car entered!`, car);
    stream.emit("parked", (car));
  })
});
server.listen(5000, () => {
  console.log("app is running on port 5000");
});

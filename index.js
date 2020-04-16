const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const port = 80;
let { initDb, addAdmin } = require("./model/index");
const { adminRouter } = require("./controller/admin");
const { studentRouter } = require("./controller/student");
const { commonRouter } = require("./controller");

initDb();

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  res.set("Content-Type", "application/json");
  next();
};
app.use(allowCrossDomain);
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/common", commonRouter);
app.use("/api/student", studentRouter);
app.use("/api/admin", adminRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

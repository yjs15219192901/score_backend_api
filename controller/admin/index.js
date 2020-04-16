const express = require("express");
const uuid = require("uuidjs");
const { SCHOOL_MAP } = require("../../util/index");
const router = express.Router();
const {
  insertAct,
  adminGetActivityList,
  updateAct,
  getAdmin,
  logScore,
  getLogScore,
  delScore,
} = require("../../model/index");

router.post("/add_activity", async (req, res) => {
  res.status(200);
  res.set("Content-Type", "application/json");
  let data = req.body;
  let response = await insertAct(data);
  // console.log(req.body);
  // let record = await getProfile("201630666158");
  res.set("Content-Type", "application/json");
  res.status(200);
  res.send(response);
});

router.get("/act_list", async (req, res) => {
  let school = SCHOOL_MAP[req.cookies.publisher];
  let response = await adminGetActivityList(school);
  res.send(response);
});
router.get("/get_admin", async (req, res) => {
  let school = SCHOOL_MAP[req.cookies.publisher];
  let response = await getAdmin(school);
  res.send(response);
});

router.post("/update_activity", async (req, res) => {
  let actId = req.query.id;
  let data = req.body;
  let response = await updateAct(actId, data);
  res.send(response);
});

router.post("/log_score", async (req, res) => {
  let actId = req.query.id;
  let attendanceData = req.body;
  let response = await logScore(attendanceData, actId);
  res.send(response);
});

router.get("/get_log_score", async (req, res) => {
  let actId = req.query.id;
  let response = await getLogScore(actId);
  res.send(response);
});

router.post("/delete_score", async (req, res) => {
  let actId = req.query.id;
  let delData = req.body;
  let response = await delScore(actId, delData);
  res.send(response);
});

module.exports = {
  adminRouter: router,
};

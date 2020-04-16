const express = require("express");
const router = express.Router();
const {
  studentGetActivityList,
  getProfile,
  collectAct,
  cancelCollectAct,
  applyForAct,
  studentGetActApplication,
  getCollections,
  studentGetLogScore,
  cancelApplication,
} = require("../../model/index");

router.get("/act_list", async (req, res) => {
  let id = req.cookies.id;
  let response = await studentGetActivityList(id);
  res.send(response);
});

router.get("/profile", async (req, res) => {
  let id = req.cookies.id;
  let response = await getProfile(id);
  res.send(response);
});

router.get("/get_application", async (req, res) => {
  let id = req.cookies.id;
  let response = await studentGetActApplication(id);
  res.send(response);
});

router.get("/get_collections", async (req, res) => {
  let id = req.cookies.id;
  let response = await getCollections(id);
  res.send(response);
});

router.post("/collect_act", async (req, res) => {
  let id = req.cookies.id;
  let actId = req.body.id;
  let response = await collectAct(id, actId);
  res.send(response);
});

router.post("/cancel_collect_act", async (req, res) => {
  let id = req.cookies.id;
  let actId = req.body.id;
  let response = await cancelCollectAct(id, actId);
  res.send(response);
});

router.post("/apply_for_act", async (req, res) => {
  let id = req.cookies.id;
  let data = req.body.data;
  let response = await applyForAct(id, data);
  res.send(response);
});

router.get("/get_attendance", async (req, res) => {
  let id = req.cookies.id;
  let response = await studentGetLogScore(id);
  res.send(response);
});

router.post("/cancel_application", async (req, res) => {
  let actId = req.query.id;
  let id = req.cookies.id;
  let response = await cancelApplication(id, actId);
  res.send(response);
});
module.exports = {
  studentRouter: router,
};

const express = require("express");
const router = express.Router();
const { getActDetail, getActApplication } = require("../model/index");

router.get("/act_detail", async (req, res) => {
  console.log(req.query);
  const actId = req.query.id;
  let response = await getActDetail(actId);
  res.send(response);
});

router.get("/act_applicant_list", async (req, res) => {
  const actId = req.query.id;
  let response = await getActApplication(actId);
  res.send(response);
});

module.exports = {
  commonRouter: router,
};

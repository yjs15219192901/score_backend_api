const mongoose = require("mongoose");
const schema = mongoose.Schema;

const AdministratorSchema = new schema({
  school: String,
  actPublished: [String],
});

const administratorModel = mongoose.model(
  "administratorModel",
  AdministratorSchema
);
module.exports = administratorModel;

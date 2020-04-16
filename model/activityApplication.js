const mongoose = require("mongoose");
const schema = mongoose.Schema;

const activityApplicationSchema = new schema({
  activityID: String,
  applicantMessage: [
    {
      studentId: String,
      name: String,
      school: String,
      applyFormValue: [
        {
          title: String,
          value: [String],
        },
      ],
    },
  ],
});

const activityApplicationModel = mongoose.model(
  "activityApplicationModel",
  activityApplicationSchema
);
module.exports = activityApplicationModel;

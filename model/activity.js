const mongoose = require("mongoose");
const { scoreSchema } = require("./student");
const schema = mongoose.Schema;
// console.log(scoreSchema);
const ActivitySchema = new schema({
  // ID: {
  //   required: true,
  //   type: String,
  // },
  name: {
    required: true,
    type: String,
  },
  description: {
    type: String,
  },
  time: {
    type: Date,
  },
  place: String,
  score: {
    moral: Number, // 德育分
    humanity: Number, // 人文分
    innovation: Number, // 创新分
    volunteer: Number, // 志愿时,
  },
  publisher: {
    type: String,
  },
  qualification: {
    //参加条件
    type: [
      {
        major: String,
        grade: Number, //1：大一，2：大二，3：大三，4：大四，5：研一，6：研二、0：不限
      },
    ],
    default: [],
  },
  quato: Number,
  registrationMethod: String, //online或offline
  applyForm: [
    {
      title: {
        type: String,
        required: true,
      },
      inputType: {
        type: String,
        required: true,
      },
      placeholder: String,
      multiple: Boolean,
      required: Boolean,
      options: [
        {
          optionName: String,
        },
      ],
      max: Number,
      min: Number,
    },
  ],
});

const applyFormSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    required: true,
  },
  placeholder: String,
  multiple: Boolean,
  options: [
    {
      optionName: String,
    },
  ],
});

let activityModel = mongoose.model("activity", ActivitySchema);

module.exports = activityModel;

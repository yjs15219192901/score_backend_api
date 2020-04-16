const mongoose = require("mongoose");
const uuid = require("uuidjs");
const url = "mongodb://localhost:27017/test";
const db = mongoose.connection;
const { studentModel } = require("./student");
const activityModel = require("./activity");
const adminModel = require("./administrator");
const activityApplicationModel = require("./activityApplication");
const activityAttendanceModel = require("./activityAttendance");

exports.initDb = function () {
  mongoose.connect(url, { useNewUrlParser: true });
  db.once("open", async () => {
    console.log("connection open!");
    try {
      // console.log(await getActivityList());
    } catch (err) {
      console.log("insert error", err);
    }
  });
};

exports.getProfile = async (id) => {
  try {
    let record = await studentModel.findOne({ ID: id });
    return { error: 0, data: record };
  } catch (err) {
    throw err;
  }
};

exports.studentGetActivityList = async (id) => {
  try {
    let record = await studentModel.findOne({ ID: id });
    let { major, grade, school } = record;
    let actList = await activityModel.find();
    let filterList = actList.filter((act) => {
      for (let item of act.qualification) {
        if (
          (item.major === "不限" || item.major === school) &&
          (item.grade === 0 || item.grade === grade)
        ) {
          return true;
        }
      }
    });
    return { error: 0, data: filterList };
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.collectAct = async (studentId, actId) => {
  try {
    let student = await studentModel.findOne({ ID: studentId });
    student.collections.push(actId);
    await student.save();
    return { error: 0 };
  } catch (err) {
    return { error: 1, message: err };
  }
};
exports.cancelCollectAct = async (studentId, actId) => {
  try {
    let student = await studentModel.findOne({ ID: studentId });
    // console.log("student", student);

    student.collections.splice(student.collections.indexOf(actId), 1);
    let res = await student.save();
    return { error: 0 };
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.applyForAct = async (studentId, applyData) => {
  try {
    let existedRecord = await activityApplicationModel.findOne({
      activityID: applyData.actId,
    });
    let studentRecord = await studentModel.findOne({ ID: studentId });
    if (existedRecord) {
      let appliedStudent = existedRecord.applicantMessage.find(
        (item) => item.studentId === studentId
      );
      if (appliedStudent) {
        appliedStudent.applyFormValue = applyData.applyFormValue;
        await existedRecord.save();
        return { error: 0 };
      } else {
        existedRecord.applicantMessage.push({
          studentId,
          name: studentRecord.name,
          school: studentRecord.school,
          applyFormValue: applyData.applyFormValue,
        });
        await existedRecord.save();
        return { error: 0 };
      }
    } else {
      let newRecord = new activityApplicationModel({
        activityID: applyData.actId,
        applicantMessage: [
          {
            studentId,
            name: studentRecord.name,
            school: studentRecord.school,
            applyFormValue: applyData.applyFormValue,
          },
        ],
      });
      await newRecord.save();
      return { error: 0 };
    }
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.cancelApplication = async (id, actId) => {
  try {
    console.log(id, actId);
    let record = await activityApplicationModel.findOne({ activityID: actId });
    console.log(record);
    let applicantList = record.applicantMessage;
    let del = applicantList.find((applicant) => applicant.studentId === id);
    applicantList.splice(applicantList.indexOf(del), 1);
    await record.save();
    return { error: 0 };
  } catch (err) {
    return { error: 1 };
  }
};

exports.studentGetActApplication = async (id) => {
  try {
    let applicationList = await activityApplicationModel.find();
    let filtered = applicationList.filter((item) => {
      if (item.applicantMessage.find((i) => i.studentId === id)) {
        return true;
      }
      return false;
    });
    let result = [];
    for (let i of filtered) {
      let record = await activityModel.findById(i.activityID);
      result.push(record);
    }
    return { error: 0, data: result };
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.studentGetLogScore = async (studentId) => {
  try {
    let attendanceList = await activityAttendanceModel.find();
    let studentAttendance = null;
    let temp = attendanceList.filter((actAttendance) => {
      studentAttendance = actAttendance.attendance.find(
        (item) => item.ID === studentId
      );
      if (studentAttendance) {
        return true;
      } else {
        return false;
      }
    });
    let result = [];
    for (let i of temp) {
      let record = await activityModel.findById(i.actId);
      record.score = studentAttendance && studentAttendance.score;
      result.push(record);
    }
    return { error: 0, data: result };
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.getCollections = async (id) => {
  try {
    let record = await studentModel.findOne({ ID: id });
    let idList = record.collections;
    let result = [];
    for (let id of idList) {
      let act = await activityModel.findById(id);
      result.push(act);
    }
    return { error: 0, data: result };
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.insertProfile = async (data) => {
  try {
    let existRecord = await studentModel.findOne({ ID: data.ID });
    console.log("existed record?", existRecord);
    if (existRecord) {
      throw new Error("重复数据！");
    }
    let newRecord = new studentModel(data);
    await newRecord.save();
  } catch (err) {
    throw err;
  }
};

// export async function updateProfile(data) {
//     try {
//         await studentModel.updateOne()
//     }
// }

exports.deleteProfile = async (id) => {
  try {
    await studentModel.deleteOne({
      ID: id,
    });
  } catch (err) {
    throw err;
  }
};

exports.insertAct = async (data) => {
  let { name, publisher } = data;
  try {
    let record = await activityModel.findOne({ name, publisher });
    if (record) {
      return { error: 1, message: "活动已存在" };
    } else {
      let newRecord = new activityModel(data);
      let res = await newRecord.save();
      let adminRecord = await adminModel.findOne({ school: publisher });
      adminRecord.actPublished.push(res._id);
      await adminRecord.save();
      return { error: 0, res };
    }
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.getActDetail = async (actId) => {
  try {
    let record = await activityModel.findById(actId);
    if (record) {
      return { error: 0, data: record };
    } else {
      throw new Error("no record");
    }
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.getActApplication = async (actId) => {
  try {
    let record = await activityApplicationModel.findOne({ activityID: actId });
    if (record) {
      let { applicantMessage } = record;
      return { error: 0, data: applicantMessage };
    } else {
      return { error: 0, data: [] };
    }
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.adminGetActivityList = async (school) => {
  try {
    let record = await adminModel.findOne({ school });
    let ActIDList = record.actPublished;
    let ActList = [];
    for (id of ActIDList) {
      let exist = await activityModel.findById(id);
      exist && ActList.push(exist);
    }
    return { error: 0, data: ActList };
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.getAdmin = async (school) => {
  try {
    let record = await adminModel.findOne({ school });
    return { error: 0, data: record };
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.updateAct = async (actId, data) => {
  try {
    let updateRes = await activityModel.updateOne({ _id: actId }, data);
    if (updateRes.ok === 1) {
      return { error: 0 };
    }
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.logScore = async (attendanceData, actId) => {
  try {
    let record = await activityAttendanceModel.findOne({ actId });
    if (record) {
      let repeatData = attendanceData.find((item) => {
        let existed = record.attendance.find((i) => i.ID === item.ID);
        if (existed) {
          return true;
        } else {
          return false;
        }
      });
      if (repeatData) {
        return { error: 1, message: `学号${repeatData.ID}用户记录已存在` };
      }
      for (let item of attendanceData) {
        let studentRecord = await studentModel.findOne({ ID: item.ID });
        actScore = item.score;
        for (let k of Object.keys(actScore)) {
          if (k !== "_id") {
            studentRecord.score[k] += actScore[k];
          }
        }
        await studentRecord.save();
      }
      record.attendance = record.attendance.concat(attendanceData);
      await record.save();
    } else {
      let newRecord = new activityAttendanceModel({
        actId,
        attendance: attendanceData,
      });
      await newRecord.save();
    }
    return { error: 0 };
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.getLogScore = async (actId) => {
  try {
    let record = await activityAttendanceModel.findOne({ actId });
    if (record) {
      return { error: 0, data: record.attendance };
    } else {
      return { error: 0, data: [] };
    }
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.delScore = async (actId, delData) => {
  try {
    let record = await activityAttendanceModel.findOne({ actId });
    let studentRecord = await studentModel.findOne({ ID: delData.ID });
    let attendanceMsg = record.attendance.find(
      (item) => item.ID === delData.ID
    );
    for (let k of Object.keys(delData.score)) {
      if (k !== "_id") {
        studentRecord.score[k] = studentRecord.score[k] - delData.score[k];
      }
    }
    await studentRecord.save();
    record.attendance.splice(record.attendance.indexOf(attendanceMsg), 1);
    await record.save();
    return { error: 0 };
  } catch (err) {
    return { error: 1, message: err };
  }
};

exports.addAdmin = async (data) => {
  let newRecord = new adminModel(data);
  await newRecord.save();
};
exports.addStudent = async function addStudent(data) {
  let newRecord = new studentModel(data);
  await newRecord.save();
};

exports.refreshStuScore = async function refreshStuScore(id, score) {
  let record = await studentModel.findOne({ ID: id });
  record.score = score;
  record.save();
};

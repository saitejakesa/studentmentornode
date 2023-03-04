var express = require("express");
var router = express.Router();
const { mongoose, studentModel, mentorModel } = require("../dbSchema");
const { mongodb, dbName, dbUrl } = require("../dbConfig");

/* GET users listing. */
//Getting the student name according to the mentor name
router.get("/:mentorName", async (req, res) => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(dbUrl);
  try{
    let students = await mentorModel.find({
      mentorName: req.params.mentorName,
    });
    res.send({
      statusCode:200,
      students,
    })
  }
  catch(error){
    console.log(error);
    res.send({ statusCode: 400, message: "Internal Server Error", error });
  }
});

//Add mentor to the data base
router.post("/addmentor", async (req, res) => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(dbUrl);
  try {
    console.log(req.body);
    let Mentorname = await mentorModel.findOne({
      mentorName: req.body.mentorName,
    });
    console.log(Mentorname);
    if (Mentorname == null) {
      //findOneAndUpdate({mentorName:req.body.mentorName},{$push:{studentsName:req.body.studentsName}})
      let students4 = req.body.studentsName;
      console.log(students4.length);

      const commonfeild = { mentorName: req.body.mentorName };
      for (let i = 0; i < students4.length; i++) {
        console.log(students4[i]);
        let studentModel2 = await studentModel.create({
          mentorName: req.body.mentorName,
          studentName: students4[i],
        });
      }
      let mentordetails = await mentorModel.create(req.body);
      res.send({
        statusCode: 200,
        message: "New Mentor added to database",
      });
    } else {
      let students4 = req.body.studentsName;
      console.log(students4.length);

      const commonfeild = { mentorName: req.body.mentorName };
      for (let i = 0; i < students4.length; i++) {
        console.log(students4[i]);
        let studentModel2 = await studentModel.create({
          mentorName: req.body.mentorName,
          studentName: students4[i],
        });
      }
      let mentor = await mentorModel.updateOne(
        { mentorName: req.body.mentorName },
        { $push: { studentsName: { $each: req.body.studentsName } } }
      );
      res.send({
        statusCode: 200,
        message: "students added to database",
      });
    }
  } catch (err) {
    console.log(err);
    res.send({ statusCode: 400, message: "Internal Server Error", err });
  }
});

//Add student to the data base
router.post("/addstudent", async (req, res) => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(dbUrl);
  try {
    let commonMentor = await mentorModel.findOne({
      mentorName: req.body.mentorName,
    });
    let commonStudent = await mentorModel.findOne({
      studentsName: req.body.studentName,
    });
    console.log(commonStudent)
    if(commonStudent){
      let studentupdate=await mentorModel.updateOne(
        {mentorName:req.body.mentorName},
        {$addToSet: { studentsName: req.body.studentName}}
      )
      res.send({
        statusCode: 200,
        message: "student edited succesfully",
      });
    }
    else{
    if (commonMentor) {
      let mentor = await mentorModel.updateOne(
        { mentorName: req.body.mentorName },
        { $push: { studentsName: req.body.studentName } }
      );
      res.send({
        statusCode: 200,
        message: "student added to mentor succesfully",
      });
      console.log(mentor);
    } else {
      let mentorName = await mentorModel.create({
        mentorName: req.body.mentorName,
        studentsName: [req.body.studentName],
      });
    }
    let studentModel2 = await studentModel.create(req.body);
    res.send({
      statusCode: 200,
      message: "student's database added",
    });
  }
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 400, message: "Internal Server Error", error });
  }
});
router.put("/assignstudent", async (req, res) => {});

module.exports = router;

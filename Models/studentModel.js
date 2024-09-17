import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    studentnumber: {
      type: Number,
      unique: true,
      required: true,
    },
    course: {
      type: String,
      required: true,
      enum: [
        "Cyber Security",
        "Data Science",
        "Frontend Development",
        "Backend Development",
        "Mobile Development",
      ],
    },
    cohort: {
      type: String,
      required: true,
      enum: [
        "Cohort 1", "Cohort 2", "Cohort 3", "Cohort 4", "Cohort 5", "Cohort 6"
      ],
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tutorModel",
    },
    attendance: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "attendanceModel",
    }],
  },
  { timestamps: true }
);

// Avoid model overwrite
const studentModel = mongoose.models.studentModel || mongoose.model('studentModel', studentSchema);

export default studentModel;

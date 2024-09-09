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
    },

    cohort: {
      type: String,
      required: true,
    },

    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tutorModel",
    },
  },
  { timestamps: true }
);

const studentModel = mongoose.model("studentModel", studentSchema);
export default studentModel;

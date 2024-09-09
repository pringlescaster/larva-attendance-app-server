import mongoose from "mongoose";

const tutorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    course: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "adminModel",
    },

    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentModel"
    }]
  },
  { timestamps: true }
);
const tutorModel = mongoose.model("tutorModel", tutorSchema);
export default tutorModel;

import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
  {
    image: {
      type: String,
    },

    publicId: {
      type: String,
    },

    name: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
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

    tutors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tutorModel",
      },
    ],
  },
  { timestamps: true }
);

const adminModel = mongoose.model("adminModel", adminSchema);
export default adminModel;

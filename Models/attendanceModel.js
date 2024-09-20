import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema({
    date: {
        type: String,
        required: true,
        default: Date.now,
    },

   

    status: {
        type: String,
        enum: ["present", "absent", "left"],
        required: true,
    },

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "studentModel", // Ensure this matches the name of your student model
        required: true,
    }
},
{ timestamps: true }
);

const attendanceModel = mongoose.model("attendanceModel", attendanceSchema);
export default attendanceModel;

import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },

    course: {
        type: String,
        required: true,
        enum: [
            "Cyber Security",
            "Data Analysis",
            "Frontend Development",
            "Backend Development",
            "Mobile Development",
        ]
    },
    
    cohort: {
        type: String,
        required: true,
        enum: ["Cohort 1", "Cohort 2", "Cohort 3", "Cohort 4", "Cohort 5", "Cohort 6"],
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

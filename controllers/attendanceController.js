import attendanceModel from "../Models/attendanceModel.js";
import studentModel from "../Models/studentModel.js";

// Create Attendance

export const createAttendance = async (req, res) =>{
    try {
        const { date, status, studentId } = req.body
        const student = await studentModel.findById(studentId);
        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }
        const newAttendance = new attendanceModel({
            date,
            status,
            student: student._id
        });
        await newAttendance.save();
        student.attendance.push(newAttendance._id)
        await student.save();

        return res.status(201).json({msg: "Attendance Marked", newAttendance})
    } catch (error) {
        return res.status(500).json({ msg: error.message})
    }
}


//Fetch all attendance
export const attendances = async (req, res) => {
    try {
        const attendance = await attendanceModel.find().populate('student', 'image name studentNumber course cohort attendance')
        if(attendance.length === 0) {
            return res.status(404).json({ msg: "No attendance records found"})
        }
        return res.status(200).json(attendance)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

//fetch attendance by date
export const attendance = async (req,res) => {
    try {
        const { date } = req.params
        const attendance = await attendanceModel.find({ date }).populate('student', 'image name studentNumber course cohort attendance') 
        if(!attendance){
            return res.status(404).json({ msg: "Attendance not found"})
        }
        return res.status(200).json(attendance)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


//Delete student by ID

export const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params
        const deletedAttendance = await attendanceModel.findByIdAndDelete(id)
        if (!deletedAttendance) {
            return res.status(400).json({ msg: "Attendance not found" });
        }
        return res.status(200).json({ msg: "Attendance deleted" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
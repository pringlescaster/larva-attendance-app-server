import attendanceModel from "../Models/attendanceModel.js";
import studentModel from "../Models/studentModel.js";

// Add or Update Attendance
export const addAttendance = async (req, res) => {
    try {
      const { student, status, date, course, cohort } = req.body;
  
      // Validate request data
      if (!student || !status || !date || !course || !cohort) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Create new attendance record
      const newAttendance = await Attendance.create({
        student,
        status,
        date,
        course,
        cohort,
      });
  
      // Return success response
      return res.status(200).json({ message: "Attendance recorded successfully", data: newAttendance });
    } catch (error) {
      console.error("Error recording attendance:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
// Get Attendance by Student
export const getAttendanceByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({ msg: "Student ID is required" });
        }

        const attendanceRecords = await attendanceModel.find({ student: studentId });

        if (!attendanceRecords.length) {
            return res.status(404).json({ msg: "No attendance records found for this student" });
        }

        return res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching attendance by student:", error);
        return res.status(500).json({ error: error.message });
    }
};

// Get Filtered Attendance
export const getFilteredAttendance = async (req, res) => {
    try {
        const { date, course, cohort } = req.query;

        let query = {};
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.date = { $gte: startDate, $lte: endDate };
        }
        if (course) {
            query.course = course;
        }
        if (cohort) {
            query.cohort = cohort;
        }

        const attendanceRecords = await attendanceModel.find(query);

        if (!attendanceRecords.length) {
            return res.status(404).json({ msg: "No attendance records found matching the filters" });
        }

        return res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching filtered attendance:", error);
        return res.status(500).json({ error: error.message });
    }
};

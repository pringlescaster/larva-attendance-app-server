import attendanceModel from "../Models/attendanceModel.js";
import studentModel from "../Models/studentModel.js";

// Add or Update Attendance
export const addAttendance = async (req, res) => {
    try {
        const { date, course, cohort, status, student } = req.body;
        
        if (!student) {
            return res.status(400).json({ msg: "Student ID is required" });
        }

        // Find the student by ID
        const studentDoc = await studentModel.findById(student);
        if (!studentDoc) {
            return res.status(404).json({ msg: "Student not found" });
        }

        // Normalize the date to ignore time differences
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // Check if there is already an attendance record for this student on this date
        let attendanceRecord = await attendanceModel.findOne({
            student: studentDoc._id,
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        if (attendanceRecord) {
            // Update the existing attendance record
            attendanceRecord.status = status;
            attendanceRecord.course = course;
            attendanceRecord.cohort = cohort;
            await attendanceRecord.save();
        } else {
            // Create a new attendance record
            attendanceRecord = new attendanceModel({
                date: startDate,
                course,
                cohort,
                status,
                student: studentDoc._id,
            });

            // Save the new attendance record
            await attendanceRecord.save();

            // Add the attendance record to the student's attendance array
            studentDoc.attendance.push(attendanceRecord._id);
            await studentDoc.save();
        }

        return res.status(200).json(attendanceRecord);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get Attendance by Student
export const getAttendanceByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({ msg: "Student ID is required" });
        }

        // Find attendance records for the specific student
        const attendanceRecords = await attendanceModel.find({ student: studentId });

        if (attendanceRecords.length === 0) {
            return res.status(404).json({ msg: "No attendance records found for this student" });
        }

        return res.status(200).json(attendanceRecords);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get Filtered Attendance
export const getFilteredAttendance = async (req, res) => {
    try {
        const { date, course, cohort } = req.query;

        // Build the query object
        let query = {};
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.date = {
                $gte: startDate,
                $lte: endDate,
            };
        }
        if (course) {
            query.course = course;
        }
        if (cohort) {
            query.cohort = cohort;
        }

        // Find filtered attendance records
        const attendanceRecords = await attendanceModel.find(query);

        if (attendanceRecords.length === 0) {
            return res.status(404).json({ msg: "No attendance records found" });
        }

        return res.status(200).json(attendanceRecords);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

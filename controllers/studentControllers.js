import studentModel from "../Models/studentModel.js";
import tutorModel from "../Models/tutorModel.js";

// Get all students for the current tutor
export const getAllStudents = async (req, res) => {
    try {
        // Get the tutor ID from the request (set in middleware)
        const tutorId = req.user.id;

        // Find students associated with the tutor
        const students = await studentModel.find({ tutor: tutorId });

        if (!students.length) {
            return res.status(404).json({ msg: "No students found for this tutor" });
        }

        return res.status(200).json(students);
    } catch (error) {
        console.error("Error retrieving students:", error);
        return res.status(500).json({ error: error.message });
    }
};

// Get a specific student by ID for the current tutor
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        // Get the tutor ID from the request (set in middleware)
        const tutorId = req.user.id;

        // Find the student by ID and ensure they are associated with the current tutor
        const student = await studentModel.findOne({ _id: id, tutor: tutorId });

        if (!student) {
            return res.status(404).json({ msg: "Student not found or not associated with this tutor" });
        }

        return res.status(200).json(student);
    } catch (error) {
        console.error("Error retrieving student:", error);
        return res.status(500).json({ error: error.message });
    }
};

// Add a new student (Ensure the tutor is authenticated)
export const addStudents = async (req, res) => {
    try {
        const { name, studentnumber, course, cohort } = req.body;

        // Get the tutor ID from the request (set in middleware)
        const tutorId = req.user.id;

        // Check if the tutor exists
        const tutor = await tutorModel.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ msg: "Tutor not found" });
        }

        // Check if the student already exists
        const existingStudent = await studentModel.findOne({ studentnumber });
        if (existingStudent) {
            return res.status(400).json({ msg: "Student with this number already exists" });
        }

        // Create and save new student with tutor ID
        const newStudent = new studentModel({
            name,
            studentnumber,
            course,
            cohort,
            tutor: tutorId, // Associate student with the tutor
        });

        await newStudent.save();

        return res.status(201).json({ msg: "Student added successfully", newStudent });
    } catch (error) {
        console.error("Error adding student:", error);
        return res.status(500).json({ error: error.message });
    }
};

// Update student's attendance status
export const updateStudentAttendance = async (req, res) => {
    try {
        const { id } = req.params; // Student ID
        const { status } = req.body; // Attendance status (present, absent, left)

        // Validate status
        if (!status) {
            return res.status(400).json({ msg: "Attendance status is required" });
        }

        // Find and update the student's attendance status
        const student = await studentModel.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true } // Ensure it returns the updated document and validates schema
        );

        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }

        return res.status(200).json({ msg: "Attendance status updated successfully", student });
    } catch (error) {
        console.error("Error updating student attendance:", error);
        return res.status(500).json({ error: error.message });
    }
};

import studentModel from "../Models/studentModel.js";
import tutorModel from "../Models/tutorModel.js";

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await studentModel.find();
        if (students.length === 0) {
            return res.status(404).json({ msg: "No students found" });
        }
        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get a specific student by ID
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await studentModel.findById(id);
        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }
        return res.status(200).json(student);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Add a new student
export const addStudents = async (req, res) => {
    try {
        const { name, studentnumber, course, cohort, tutor } = req.body;
        const tutorId = await tutorModel.findById(tutor);
        if (!tutorId) {
            return res.status(404).json({ msg: "Tutor not found" });
        }

        const newStudent = new studentModel({
            name,
            studentnumber,
            course,
            cohort,
            tutor: tutorId._id,
        });

        await newStudent.save();

        tutorId.students.push(newStudent._id); // Ensure the 'students' field is an array in the tutor model
        await tutorId.save();

        return res.status(200).json(newStudent);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

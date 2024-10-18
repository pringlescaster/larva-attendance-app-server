import studentModel from "../Models/studentModel.js";
import tutorModel from "../Models/tutorModel.js";

// REGISTER STUDENT (No authentication)
export const registerStudent = async (req, res) => {
    try {
        const { body } = req;
        let image = null;
        if (req.file) {
            image = req.file.path;  
        }
 
        // Create new student without tutor association
        const newStudent = new studentModel({ ...body, image });

        // Save the student
        await newStudent.save();

        return res.status(201).json({ msg: "Student Registered", newStudent });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

// GET ALL STUDENTS
export const getAllStudents = async (req, res) => {
    try {
        const { tutorId } = req.query; // Assume tutorId is provided in the query string

        // Find students associated with the tutor
        const students = await studentModel.find({ tutor: tutorId }).populate('attendance', '-_id -createdAt -updatedAt -__v');
        if (students.length === 0) {
            return res.status(404).json({ msg: 'No students found for this tutor' });
        }
        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

// GET STUDENT BY ID
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const { tutorId } = req.query; // Assume tutorId is provided in the query string

        const student = await studentModel.findOne({ _id: id, tutor: tutorId }).populate('attendance', '-_id -createdAt -updatedAt -__v');
        if (!student) {
            return res.status(404).json({ msg: 'Student not found or not associated with this tutor' });
        }
        return res.status(200).json(student);
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

// UPDATE STUDENT
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { tutorId } = req.body; // Assume tutorId is provided in the body

        let image = null;
        if (req.file) {
            image = req.file.path; // Update the image if a new one is uploaded
        }

        const updatedStudent = await studentModel.findOneAndUpdate(
            { _id: id, tutor: tutorId },
            { ...req.body, image },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ msg: 'Student not found or not associated with this tutor' });
        }
        return res.status(200).json({ msg: "Student is updated", updatedStudent });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

// DELETE STUDENT
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { tutorId } = req.body; // Assume tutorId is provided in the body

        const deletedStudent = await studentModel.findOneAndDelete({ _id: id, tutor: tutorId });
        if (!deletedStudent) {
            return res.status(404).json({ msg: "Student not found or not associated with this tutor" });
        }

        // Remove the student's ID from the tutor's student list
        await tutorModel.updateOne({ _id: tutorId }, { $pull: { students: id } });

        if (deletedStudent.image) {
            const publicId = deletedStudent.image.split('/').pop().split('.')[0]; // Extract public ID
            cloudinary.uploader.destroy(publicId, function (error, result) {
              if (error) console.log("Error deleting image from Cloudinary:", error);
            });
          }
          

        return res.status(200).json({ msg: "Student is deleted" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

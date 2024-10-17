import tutorModel from "../Models/tutorModel.js";
import adminModel from "../Models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login Tutor
export const loginTutor = async (req, res) => {
    try {
        const { email, password } = req.body;

        const tutor = await tutorModel.findOne({ email });
        if (!tutor) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        const passwordCompare = await bcrypt.compare(password, tutor.password);
        if (!passwordCompare) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        const accessToken = jwt.sign(
            { userId: tutor._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.EXPIRATION }
        );

        return res.status(200).json({
            msg: "Login Successful",
            accessToken,
            user: {
                id: tutor._id,
                name: tutor.name,
                email: tutor.email,
                course: tutor.course,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Auth Status
export const authStatus = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: "Invalid Token" });
        }

        const tutor = await tutorModel.findById(req.user.userId);
        if (!tutor) {
            return res.status(404).json({ msg: "Tutor not found" });
        }

        return res.status(200).json({
            id: tutor._id,
            name: tutor.name,
            course: tutor.course,
        });
    } catch (error) {
        return res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// Add Tutor
export const addTutor = async (req, res) => {
    try {
        const { name, course, email, password, admin } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const adminId = await adminModel.findById(admin);
        if (!adminId) {
            return res.status(404).json({ msg: "Admin not found" });
        }

        // Handle file upload using multer
        let image;
        if (req.file) {
            image = req.file.path;  // Store the file path for the image
        }

        const newTutor = new tutorModel({
            name,
            course,
            email,
            password: hashedPassword,
            image,
            admin: adminId._id,
        });

        await newTutor.save();
        adminId.tutors.push(newTutor._id);
        await adminId.save();

        return res.status(200).json(newTutor);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get Tutor Details
export const getTutorDetails = async (req, res) => {
    try {
        const tutorId = req.user.userId;
        const tutor = await tutorModel.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ msg: "Tutor not found" });
        }

        return res.status(200).json(tutor);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update Tutor details
export const updateTutor = async (req, res) => {
    try {
        const { userId } = req.user;
        const { name, course, email } = req.body;

        const tutor = await tutorModel.findById(userId);
        if (!tutor) {
            return res.status(404).json({ msg: "Tutor not found" });
        }

        // Handle image update using multer
        let image;
        if (req.file) {
            image = req.file.path;  // Update with the new image file path
        }

        tutor.name = name || tutor.name;
        tutor.course = course || tutor.course;
        tutor.email = email || tutor.email;
        tutor.image = image || tutor.image;

        const updatedTutor = await tutor.save();

        return res.status(200).json({
            msg: "Tutor details updated successfully",
            tutor: {
                id: updatedTutor._id,
                name: updatedTutor.name,
                course: updatedTutor.course,
                email: updatedTutor.email,
                image: updatedTutor.image,
            },
        });
    } catch (error) {
        console.error("Error updating tutor:", error.message);
        return res.status(500).json({ msg: "Server error" });
    }
};

// Update Tutor password
export const updatePw = async (req, res) => {
    try {
        const { userId } = req.user; 
        const { currentpassword, newpassword } = req.body;

        const tutor = await tutorModel.findById(userId);
        if (!tutor) {
            return res.status(404).json({ msg: "Tutor not found" });
        }

        const passwordCompare = await bcrypt.compare(currentpassword, tutor.password);
        if (!passwordCompare) {
            return res.status(401).json({ msg: "Invalid current password" });
        }

        if (currentpassword === newpassword) {
            return res.status(400).json({ msg: "New password cannot be the same as the current password." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newpassword, saltRounds);

        tutor.password = hashedPassword;
        await tutor.save();

        return res.status(200).json({ msg: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Tutor Logout
export const logoutTutor = async (req, res) => {
    try {
        res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/api/refresh_token' });

        return res.status(200).json({ msg: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

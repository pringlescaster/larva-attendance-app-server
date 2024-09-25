import adminModel from "../Models/adminModel.js"; 
import tutorModel from "../Models/tutorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login Tutor
export const loginTutor = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the tutor by email
        const tutor = await tutorModel.findOne({ email });
        if (!tutor) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password in the database
        const passwordCompare = await bcrypt.compare(password, tutor.password);
        if (!passwordCompare) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        // Generate a JWT token
        const accessToken = jwt.sign(
            { userId: tutor._id },  // Include tutor's ID in the payload
            process.env.ACCESS_TOKEN_SECRET,  // Use the secret key from environment variables
            { expiresIn: process.env.EXPIRATION }  // Token expiration time
        );

        // Send the response with the token and tutor data
        return res.status(200).json({ msg: "Login Successful", accessToken });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Auth Status - Check if the user is authenticated
export const authStatus = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: "Invalid Token" });
        }

        const tutor = await tutorModel.findById(req.user.userId); // Update to use userId
        if (!tutor) {
            return res.status(404).json({ msg: "Tutor not found" });
        }

        return res.status(200).json({ id: tutor._id, name: tutor.name, course: tutor.course });
    } catch (error) {
        return res.status(500).json({ msg: "Server Error", error: error.message });
    }
};



// Add Tutor
export const addTutor = async (req, res) => {
    try {
        const { name, course, email, password, admin } = req.body;
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        const adminId = await adminModel.findById(admin);
        if (!adminId) {
            return res.status(404).json({ msg: "Admin not found" });
        }

        const newTutor = new tutorModel({
            name,
            course,
            email,
            password: hashedPassword,
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
        const tutorId = req.user.id;
        const tutor = await tutorModel.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ msg: "Tutor not found" });
        }

        return res.status(200).json(tutor);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update Tutor
export const updateTutor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, course, email } = req.body;

        const updatedTutor = await tutorModel.findByIdAndUpdate(
            id,
            { name, course, email },
            { new: true }
        );

        if (!updatedTutor) {
            return res.status(404).json({ msg: "Tutor not found" });
        }

        return res.status(200).json({ msg: "Tutor updated successfully", updatedTutor });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update Tutor password
export const updatePw = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentpassword, confirmpassword } = req.body;

        const tutor = await tutorModel.findById(id);
        if (!tutor) {
            return res.status(404).json({ msg: "Tutor not found" });
        }

        const passwordCompare = await bcrypt.compare(currentpassword, tutor.password);
        if (!passwordCompare) {
            return res.status(401).json({ msg: "Invalid current password" });
        }

        if (currentpassword === confirmpassword) {
            return res.status(400).json({ msg: "Current password and new password should not be the same" });
        }

        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(confirmpassword, saltRounds);
        const updatedTutor = await tutorModel.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );

        return res.status(200).json({ msg: "Tutor password is updated", updatedTutor });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete Tutor
export const deleteTutor = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTutor = await tutorModel.findByIdAndDelete(id);
        if (!deletedTutor) {
            return res.status(404).json({ msg: "Tutor not found" });
        }

        return res.status(200).json({ msg: "Tutor deleted successfully", deletedTutor });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Tutor Logout
export const logoutTutor = async (req, res) => {
    try {
        // Clear the authentication cookies
        res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/api/refresh_token' });

        return res.status(200).json({ msg: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

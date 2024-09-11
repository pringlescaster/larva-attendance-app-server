import adminModel from "../Models/adminModel.js";
import tutorModel from "../Models/tutorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Tutor Login
export const loginTutor = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if tutor exists
        const tutor = await tutorModel.findOne({ email });
        if (!tutor) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // Compare the provided password with the stored hashed password
        const passwordCompare = await bcrypt.compare(password, tutor.password);
        if (!passwordCompare) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        // Generate JWT access token
        const accessToken = jwt.sign(
            { id: tutor._id }, // Payload with tutor ID
            process.env.JWT_ACCESS_SECRET, // Secret key from environment variables
            { expiresIn: process.env.EXPIRATION } // Expiration time
        );

        // Set the token in a cookie (optional) or send in response
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });

        return res.status(200).json({ msg: "Login Successful", tutor, accessToken });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Check Authentication Status
export const authStatus = async (req, res) => {
    try {
        const tutor = req.user; // Assuming the user is attached to the request by the middleware (headerAuth)
        if (!tutor) {
            return res.status(401).json({
                Authenticated: false,
                message: "Invalid token",
            });
        }
        return res.status(200).json({
            Authenticated: true,
            message: "User authenticated",
            id: tutor._id,
            name: tutor.name,
            email: tutor.email,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
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

        adminId.tutors.push(newTutor._id); // Ensure the 'tutors' field is an array in the admin model
        await adminId.save();

        return res.status(200).json(newTutor);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get Tutor Details
export const getTutorDetails = async (req, res) => {
    try {
        const tutorId = req.user.id; // Get the tutor ID from the request object
        
        // Fetch tutor details from the database
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
        const updatedTutor = req.body;
        const tutor = await tutorModel.findByIdAndUpdate(id, updatedTutor, {
            new: true,
        });
        if (!tutor) {
            return res.status(404).json({ msg: "Tutor not found" });
        }
        return res.status(200).json(tutor);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Tutor Logout
export const logoutTutor = async (req, res) => {
    try {
        // Clear the access token cookie to log the user out
        res.clearCookie("accessToken", { httpOnly: true, secure: true });
        return res.status(200).json({ msg: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

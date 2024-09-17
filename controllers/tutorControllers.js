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
            { id: tutor._id, email: tutor.email },  // Include tutor's ID and email in the payload
            process.env.ACCESS_TOKEN_SECRET,  // Use the secret key from environment variables
            { expiresIn: process.env.EXPIRATION }  // Token expiration time
        );

        // Log the generated token for debugging
        // console.log("Generated access token:", accessToken);

        // USING THE res.COOKIE METHOD
        // Set the token as an HTTP-only cookie to prevent access via JavaScript
        // res.cookie("accessToken", accessToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',  // Ensure secure cookies in production
        //     sameSite: 'Strict',
        // });

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

        const tutor = await tutorModel.findOne({ _id: req.user.id })

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
        // Clear the authentication cookies
        res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/api/refresh_token' });

        return res.status(200).json({ msg: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

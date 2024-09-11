import adminModel from "../Models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create Admin
export const createAdmin = async (req, res) => {
    try {
        const { name, role, email, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        const newAdmin = new adminModel({
            name,
            role,
            email,
            password: hashedPassword
        });

        await newAdmin.save();
        return res.status(201).json({ msg: "Admin created successfully", newAdmin });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Login Admin
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        // Compare the provided password with the stored hashed password
        const passwordCompare = await bcrypt.compare(password, admin.password);
        if (!passwordCompare) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        // Generate JWT access token
        const accessToken = jwt.sign(
            { id: admin._id }, // Use admin._id
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.EXPIRATION }
        );

        // Set the token in a cookie (optional) or send in response
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });

        // Include the access token in the response body
        return res.status(200).json({
            msg: "Login Successful",
            accessToken,  // Include the access token here
            admin
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// Check Authentication
export const authStatus = async (req, res) => {
    try {
        const admin = req.user; // Ensure this comes from verified JWT
        if (!admin) {
            return res.status(401).json({
                Authenticated: false,
                message: "Invalid token",
            });
        }

        return res.status(200).json({
            Authenticated: true,
            message: "User authenticated",
            id: admin._id,
            name: admin.name,
            email: admin.email,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// Get Admin Details
export const getAdminDetails = async (req, res) => {
    try {
        const adminId = req.user.id; // Get the admin ID from the request object
        
        // Fetch admin details from the database
        const admin = await adminModel.findById(adminId);
        if (!admin) {
            return res.status(404).json({ msg: "Admin not found" });
        }
        
        return res.status(200).json(admin);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// Logout Admin
export const logoutAdmin = async (req, res) => {
    try {
        // Clear the access token cookie to log the user out
        res.clearCookie("accessToken", { httpOnly: true, secure: true });
        return res.status(200).json({ msg: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

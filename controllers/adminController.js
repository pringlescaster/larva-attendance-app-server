import adminModel from "../Models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Admin Registration
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        let image;
        if (req.file) {
            image = req.file.path; // multer stores file locally, use the file path
        }

        const newAdmin = new adminModel({
            image,
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newAdmin.save();
        res.status(201).json({ msg: "Admin registered successfully", newAdmin });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

// Admin Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }
        const passwordCompare = await bcrypt.compare(password, admin.password);
        if (!passwordCompare) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        const accessToken = jwt.sign(
            { userId: admin._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.EXPIRATION }
        );

        return res.status(200).json({
            msg: 'Login successful',
            accessToken,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

// Admin Auth Status
export const authStatus = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: "Invalid Token" });
        }
        const admin = await adminModel.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ msg: "Invalid Admin" });
        }

        return res.status(200).json({
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });
    } catch (error) {
        return res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// Fetch All Admins
export const admins = async (req, res) => {
    try {
        const allAdmins = await adminModel.find();
        if (allAdmins.length === 0) {
            return res.status(404).json({ msg: "No admins found" });
        }
        return res.status(200).json(allAdmins);
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

// Fetch Admin By ID (Individual Admin)
export const admin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await adminModel.findById(id);
        if (!admin) {
            return res.status(404).json({ msg: 'Admin not found' });
        }
        return res.status(200).json(admin);
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

// Update Admin By ID
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const admin = await adminModel.findById(id);
        if (!admin) {
            return res.status(404).json({ msg: 'Admin not found' });
        }

        let image;
        if (req.file) {
            image = req.file.path; // multer stores the file locally, using its path
        }

        // Update the admin fields
        admin.name = name || admin.name;
        admin.email = email || admin.email;
        admin.image = image || admin.image;
        admin.role = role || admin.role;

        await admin.save(); // Save the updated admin

        res.status(200).json({
            msg: "Admin updated successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                image: admin.image
            }
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Delete Admin By ID
export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await adminModel.findByIdAndDelete(id);
        if (!admin) {
            return res.status(404).json({ msg: "Admin not found in database" });
        }

        // Since Cloudinary is removed, no need to handle image deletion here
        return res.status(200).json({ msg: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

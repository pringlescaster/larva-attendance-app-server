import adminModel from "../Models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cloudinary } from "../config/cloudinary.js";

// Admin Registration
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        let image = null;
        let publicId = null;

        // Handle image upload if present
        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path); // Upload to Cloudinary
            image = uploadResponse.secure_url; // Get secure URL
            publicId = uploadResponse.public_id; // Get public ID for future reference
        }

        const newAdmin = new adminModel({
            image,
            publicId,
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
        const updatedData = req.body;

        const admin = await adminModel.findById(id);
        if (!admin) {
            return res.status(404).json({ msg: 'Admin not found' });
        }

        let image = admin.image; // Retain existing image
        let publicId = admin.publicId; // Retain existing public ID

        // Handle image upload if present
        if (req.file) {
            // Remove the old image from Cloudinary if it exists
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }

            const uploadResponse = await cloudinary.uploader.upload(req.file.path); // Upload new image
            image = uploadResponse.secure_url; // Get secure URL
            publicId = uploadResponse.public_id; // Update public ID
        }

        // Update the admin fields
        admin.name = updatedData.name || admin.name;
        admin.email = updatedData.email || admin.email;
        admin.image = image; // Update with new image URL
        admin.publicId = publicId; // Update with new public ID

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

        // Remove the associated image from Cloudinary if it exists
        if (admin.publicId) {
            await cloudinary.uploader.destroy(admin.publicId);
        }

        return res.status(200).json({ msg: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

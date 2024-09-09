import adminModel from "../Models/adminModel.js";
import bcrypt from "bcrypt";

export const createAdmin = async (req, res) => {
    try {
        const { name, role, email, password } = req.body
        const saltRounds = 10
        const hashedPassword = bcrypt.hashSync(password, saltRounds)
        const newAdmin = new adminModel({
            name,
            role,
            email,
            password: hashedPassword
        })

        await newAdmin.save()
        return res.status(201).json({ msg: "Admin created successfully", newAdmin })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await adminModel.findOne({ email })
        if (!admin) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        const passwordCompare = await bcrypt.compare(password, admin.password)
        console.log(passwordCompare);
        if (!passwordCompare) {
            return res.status(401).json({msg: "invalid credentials"})
        }
        return res.status(200).json({msg: "Login Successfully", admin});
    } catch (error) {
        return res.status(500).json({ errror: error.message }) 
    }
}

//getAdmin
export const getAdmin = async (req, res) => {
    try {
        const admins = await adminModel.find();
        if(admins.length === 0) {
            return res.status(404).json({msg: "No admins added"})
        }
        return res.status(200).json(admins);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}
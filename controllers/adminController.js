import adminModel from "../Models/adminModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//Admin registration
export const register = async (req, res) => {
    try {
        const {body} = req
        const {image, publicId, name, email, password, role} = body
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const newAdmin = new adminModel({
            image,
            publicId,
            name,
            email,
            password: hashedPassword,
            role,
        })

        await newAdmin.save();
        res.status(201).json({msg: "Admin registered successfully", newAdmin})
    } catch (error) {
      return res.statu(500).json({msg: error.message}) 
    }
}

//Admin Login
export const login = async (req, res) => {
    try {
        const {body}= req
        const {email, password}= body
        const admin = await adminModel.findOne({email})
        if (!admin) {
            return res.status(401).json({msg: "Invalid email or password"})
        }
        const passwordCompare = await bcrypt.compare(password, admin.password)
        if (!passwordCompare) {
            return res.status(404).json({msg: "Invalid email or password"})
        }

        const accessToken = jwt.sign({
            userId: admin._id
        },
    process.env.JWT_ACCESS_SECRET,
{subject: 'acecessApi', expiresIn: process.env.TOKEN_EXPIRATION })
return res.status (200).json({ msg: 'Login successful', accessToken });

    } catch (error) {
        return res.status (500).json({ msg: error.message})
    }
}

//Admin Auth Status
export const authStatus = async (req, res) => {
    try {
       if (!req.user){
return res.status(401).json({msg: "Invalid Token"});
       } 
       const admin = await adminModel.findOne({_id: req.user.id })
       if (!admin) {
        return res.status(404).json({msg: "Invalid Admin"})
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
}

//Fetch All Admins
export const admins = async (req, res) =>{
    try {
        const admin = await await adminModel.find()
        if(admin.length === 0){
            return res.status(404).json({msg: "No admins found"})
        }
        return res.status(200).json(admin)
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

//FETCH ADMIN BY ID (INDIVIDUAL ADMIN)
export const admin = async (req, res) =>{
    try {
        const { id } = req.params
        const admin = await adminModel.findById(id)
        if(!admin){
            return res.status(404).json({ msg: 'Admin not found' })
        }
        return res.status(200).json(admin)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

//UPDATE ADMIN BY ID
export const updateAdmin = async (req, res) =>{
    try {
        const { id } = req.params;
        const admin = req.body;
    
        const updatedAdmin = await adminModel.findByIdAndUpdate(id, admin, { new: true });
    
        if (!updatedAdmin) {
          return res.status(404).json({ msg: 'Admin not found' });
        }
        res.status(200).json({ msg: "Admin is updated", updatedAdmin });
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
}

//DELETE ADMIN BY ID
export const deleteAdmin = async (req, res) =>{
    try{
        const { id } = req.params
        const deletedAdmin = await adminModel.findByIdAndDelete(id)
        if(!deletedAdmin){
            return res.status(400).json({ msg: "Admin not found in database" })
        }
        return res.status(200).json({ msg: "Admin is deleted" })
    }
    catch(error){
        res.status(500).json({ msg: error.message })
    }
}
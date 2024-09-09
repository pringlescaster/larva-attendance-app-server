import adminModel from "../Models/adminModel.js";
import tutorModel from "../Models/tutorModel.js";
import bcrypt from "bcrypt";

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
        console.log(passwordCompare)
        if (!passwordCompare) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        return res.status(200).json({ msg: "Login Successful", tutor });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}


export const addTutor = async (req, res) => {
    try {
        const { name, course, email, password, admin } = req.body;
        const adminId = await adminModel.findById(admin);
        if (!adminId) {
            return res.status(404).json({ msg: "Admin not found" });
        }

        const newTutor = new tutorModel({
            name,
            course,
            email,
            password: await bcrypt.hash(password, 10),
            admin: adminId._id,
        });

        await newTutor.save();
       
        adminId.tutors.push(newTutor._id); // Ensure the 'tutors' field is an array in the admin model
        await adminId.save();

        return res.status(200).json(newTutor);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getTutor = async (req, res) => {
    try {
        const tutors = await tutorModel.find().select('-id -__v -createdAt -updatedAt')
        if (tutors.length === 0) {
            return res.status(404).json({msg: "tutor not added"});
        }
        return res.status(200).json(tutors);   
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}


export const updateTutor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTutor = req.body;
        const tutor = await tutorModel.findByIdAndUpdate(id, updatedTutor, {
            new: true,
        });
        if (!tutor) {
            res.status(404).json({msg: "Tutor not found"});
        }
        return res.status(200).json(tutor);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

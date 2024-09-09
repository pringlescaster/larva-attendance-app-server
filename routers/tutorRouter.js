import {Router} from "express";
import { loginTutor, getTutor, updateTutor, addTutor } from "../controllers/tutorControllers.js";


const route = Router()
route.post('/tutor', addTutor);
route.get('/tutor', getTutor);
route.post('/tutor/login', loginTutor);
route.put('/tutor/:id', updateTutor);



export default route
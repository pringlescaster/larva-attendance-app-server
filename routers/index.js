import { Router } from "express";
import adminRouter from "./adminRouter.js";
import attendanceRouter from "./attendanceRouter.js";
import studentRouter from "./studentRouter.js";
import tutorRouter from "./tutorRouter.js";


const router = Router()

router.use(adminRouter)
router.use(attendanceRouter)
router.use(studentRouter)
router.use(tutorRouter)


export default router;
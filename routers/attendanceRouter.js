import { Router } from "express";

import {
  attendance,
  attendances,
  createAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";


const router = Router();

//CREATE OPERATION
router.post("/attendance", createAttendance);
//READ OPERATION
router.get("/attendances", attendances);
router.get("/attendance/:date", attendance);
//DELETE OPERATION
router.delete("/attendance/:id", deleteAttendance);

export default router;

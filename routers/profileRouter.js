import express from "express";
import { editProfile, getProfile } from "../controllers/profileController.js";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({})

const upload = multer({ storage: storage });

router.get("/get-profile/:id", getProfile);
router.put("/update-profile/:id",upload.single("image"),editProfile);

export default router;
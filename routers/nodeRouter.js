import express from "express";
import { addNode, getNode, removeNode, updateNode } from "../controllers/nodeController.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/add-node",auth, addNode);
router.get("/get-node/:id",auth,getNode);
router.put("/update-node/:id",auth, updateNode);
router.delete("/delete-node/:id", auth, removeNode);

export default router;
import express from "express";
import { getContactConfig, sendContactMessage } from "../controller/contact.js";

const router = express.Router();

router.get("/config", getContactConfig);
router.post("/", sendContactMessage);

export default router;

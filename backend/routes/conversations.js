import express from "express";
import { Conversation } from "../models/Conversation.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const conversation = await Conversation.find()
      .select("patientName disease location createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .limit(20);

    return res.json(conversation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      res.status(400).json({ error: "Conversation not found" });
    }

    return res.json(conversation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;

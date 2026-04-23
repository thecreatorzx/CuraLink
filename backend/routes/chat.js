import express from "express";
import { Conversation } from "../models/Conversation.js";
import { callResearchPipeline } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { conversationId, disease, query, location, patientName } = req.body;

  if (!disease || !query) {
    res.status(400).json({ error: "disease and query are required" });
  }
  try {
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
    } else {
      conversation = new Conversation({
        patientName: patientName || "Anonymous",
        disease,
        location: location || "",
      });
    }
    const history = conversation.message.slice(-6).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
    history.push({ role: "user", content: query });

    console.log(
      `[Chat] Calling AI service | disease=${disease} | query=${query}`,
    );
    const result = await callResearchPipeline({
      disease: conversation.disease || disease,
      query,
      location: conversation.location || location || "",
      history,
    });
    if (!result.success) {
      return res.status(503).json({ error: result.error });
    }
    const aiData = result.data;
    const assistantContent = aiData.condition_overview || "Research complete";

    conversation.message.push({
      role: "user",
      content: query,
    });

    conversation.message.push({
      role: "assistant",
      content: assistantContent,
      structuredData: {
        condition_overview: aiData.condition_overview,
        research_insights: aiData.research_insights,
        recommendations: aiData.recommendations,
        expand_query: aiData.expand_query,
        publications: aiData.publications,
        clinical_trials: aiData.clinical_trials,
      },
    });
    await conversation.save();

    return res.json({
      conversationId: conversation._id,
      disease: conversation.disease,
      patientName: conversation.patientName,
      ...aiData,
    });
  } catch (error) {
    console.error("[Chat] Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

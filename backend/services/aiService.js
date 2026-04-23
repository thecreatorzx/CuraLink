import axios from "axios";
import { Cache } from "../models/Conversation.js";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

async function checkHealth() {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, {
      timeout: 5000,
    });
    return response.data.status === "ok";
  } catch (error) {
    console.error("Health check failed:", error.message);
    return false;
  }
}

function _buildCacheKey(disease, query) {
  const normalized = `${disease}:${query}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
  return normalized;
}

async function callResearchPipeline({ disease, query, location, history }) {
  const isFreshQuery = !history || history.length <= 1;
  if (isFreshQuery) {
    const key = _buildCacheKey(disease, query);
    const cached = await Cache.findOne({ key });
    if (cached) {
      console.log(`[Cache] HIT for key: ${key}`);
      return { success: true, data: cached.data, fromCache: true };
    }
    console.log(`[Cache] MISS for key: ${key}`);
  }
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/research`,
      {
        disease,
        query,
        location: location || "",
        history: history || [],
      },
      { timeout: 120000 },
    );
    if (isFreshQuery) {
      const key = _buildCacheKey(disease, query);
      await Cache.findOneAndUpdate(
        { key },
        { key, data: response.data },
        { upsert: true, returnDocument: "after" },
      );
      console.log(`[Cache] Saved result for key: ${key}`);
    }
    return { success: true, data: response.data };
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return { success: false, error: "AI service is not running" };
    }
    return { success: false, error: error.message };
  }
}

export { callResearchPipeline, checkHealth };

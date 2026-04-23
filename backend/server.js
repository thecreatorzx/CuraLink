import express from "express";
import cors from "cors";
import "dotenv/config";
import chatRoutes from "./routes/chat.js";
import conversationRoutes from "./routes/conversations.js";
import { checkHealth } from "./services/aiService.js";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/conversation", conversationRoutes);
app.get("/health", async (req, res) => {
  const aiHealthy = await checkHealth();
  res.json({
    node: "ok",
    ai_service: aiHealthy ? "ok" : "unreachable",
    mongodb: mongoose.connection.readyState === 1 ? "ok" : "disconnected",
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("[MongoDB] Connected");
    app.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[MongoDB] Connection failed: ", err.message);
    process.exit(1);
  });

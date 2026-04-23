import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  structuredData: {
    condition_overview: String,
    research_insights: String,
    recommendations: String,
    expanded_query: String,
    publications: [mongoose.Schema.Types.Mixed],
    clinical_trials: [mongoose.Schema.Types.Mixed],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ConversationSchema = new mongoose.Schema({
  patientName: {
    type: String,
    default: "Anonymous",
  },
  disease: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "",
  },
  message: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ConversationSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

const CacheSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  data: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, expires: 86400 },
});

const Cache = mongoose.model("Cache", CacheSchema);
const Conversation = mongoose.model("Conversation", ConversationSchema);
export { Cache, Conversation };

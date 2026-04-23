# 🧬 CuraLink

**A Context-Aware AI Medical Research Assistant**

CuraLink is a full-stack, microservices-based web application designed to synthesize real-time medical research. By simultaneously querying PubMed, ClinicalTrials.gov, and OpenAlex, it aggregates the latest clinical data and feeds it into a local Large Language Model (LLM) to generate structured, context-aware insights, recommendations, and relevant trials.

![CuraLink UI Preview](https://via.placeholder.com/1000x500.png?text=CuraLink+Dashboard+Preview)

## ✨ Key Features

- **Real-Time Data Aggregation:** Concurrently fetches live data from PubMed (E-utilities), ClinicalTrials.gov (v2 API), and OpenAlex.
- **TLS Firewall Bypass:** Utilizes advanced TLS-fingerprint spoofing (`curl_cffi`) to securely and reliably query government medical databases without rate-limit blocking.
- **Context-Aware Reasoning:** Maintains a stateful conversation history in MongoDB, allowing the LLM to understand follow-up questions (e.g., "What are the side effects of this treatment?") without losing the original medical context.
- **Intelligent Caching Mechanism:** Expensive LLM inference and external API calls are cached in MongoDB using normalized keys, returning instant responses for previously searched queries.
- **Strict JSON Pipeline:** The Python AI microservice forces the local LLM to output highly reliable, structured JSON containing condition overviews, insights, recommendations, and arrays of trials/publications.
- **Clinical Minimalist UI:** A sleek, responsive frontend built with React, Tailwind CSS, and Framer Motion, featuring skeleton loaders, dynamic system health badges, and animated data accordions.

## 🏗️ System Architecture

CuraLink operates on a modern microservices architecture:

1. **Frontend (React/Vite):** Handles the user interface, renders the structured AI JSON into beautiful data cards, and manages the session ID.
2. **Gateway API (Node.js/Express):** Acts as the central router. It manages the MongoDB connection, intercepts cached queries, stores conversation history, and forwards complex tasks to the AI service.
3. **AI Microservice (Python/FastAPI):** The heavy-lifter. It runs concurrent asynchronous API fetches, orchestrates the local Ollama LLM, and structures the final output payload.

## 💻 Tech Stack

**Frontend:**

- React (Vite)
- Tailwind CSS
- Framer Motion (Animations)
- Lucide React (Icons)
- Axios

**Backend Gateway:**

- Node.js & Express
- MongoDB & Mongoose (Database & Caching)

**AI Microservice:**

- Python 3.10+
- FastAPI & Uvicorn
- Ollama (Local LLM Inference)
- `curl_cffi` (Network/TLS Spoofing)

---
